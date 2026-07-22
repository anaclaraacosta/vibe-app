import { User, RecommendationItem } from '../types';
import { queryGemini } from './geminiService';
import { getTMDBDetail } from '../api/tmdb';
import { getDeezerDetail } from '../api/deezer';
import { getBookDetail } from '../api/books';
import { getWikipediaDetail } from '../api/wikipedia';
import { VIBE_QUESTIONS } from '../data/vibeQuestions';

const SYSTEM_INSTRUCTION = `Sos el curador cultural de la aplicación VIBE.
Tu trabajo no es recomendar simplemente contenido popular.
Tu objetivo es descubrir contenido que conecte emocionalmente con la personalidad del usuario.
Priorizá recomendaciones variadas.
Combiná clásicos, obras recientes y joyas poco conocidas.
Evitá repetir siempre las mismas recomendaciones.
Respondé SIEMPRE en español.
No traduzcas nombres propios.
No expliques nada.
Respondé únicamente utilizando el JSON solicitado.`;

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  "Melómano Introspectivo": "Tenés un fuerte apego por las narrativas profundas y estéticas melancólicas. Te rodeás de ambientes cálidos y valorás el arte independiente en todas sus expresiones.",
  "Bohemio Ecléctico": "Te apasiona la variedad, los clásicos de culto y la mixtura de estilos. Disfrutás de paseos culturales urbanos y conversaciones existenciales con buena música de fondo.",
  "Curador Urbano Moderno": "Tu ritmo es rápido, dinámico y estéticamente pulido. Te atraen los neones, el diseño vanguardista y las tendencias tecnológicas combinadas con un gusto de curaduría selecto."
};

const FASHION_DATA_SOURCE = [
  { id: "rec5", title: "Outfit Minimalista de Invierno", subtitle: "Abrigo, suéter, sastrero, botas y bufanda", category: "fashion" as const, image: "/outfits/winter.png" },
  { id: "rec15", title: "Outfit Bohemio de Verano", subtitle: "Camisa estampada, bermuda y sandalias", category: "fashion" as const, image: "/outfits/summer.png" },
  { id: "rec25", title: "Outfit Urbano Techwear", subtitle: "Campera técnica, cargo, sneakers y beanie", category: "fashion" as const, image: "/outfits/techwear.png" }
];

function getSeason(): string {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) {
    return 'Verano (Summer)';
  } else if (month >= 2 && month <= 4) {
    return 'Otoño (Autumn)';
  } else if (month >= 5 && month <= 7) {
    return 'Invierno (Winter)';
  } else {
    return 'Primavera (Spring)';
  }
}

function truncateToWords(str: string, maxWords: number = 5): string {
  const words = str.split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + '...';
}

function getUserInterests(quizAnswers: Record<number, string> | undefined): string {
  if (!quizAnswers || Object.keys(quizAnswers).length === 0) {
    return "No completado";
  }
  
  const interests: string[] = [];
  VIBE_QUESTIONS.forEach(q => {
    const selectedOptionId = quizAnswers[q.id];
    if (selectedOptionId) {
      const option = q.options.find(o => o.id === selectedOptionId);
      if (option) {
        const text = truncateToWords(option.text || '');
        const subtext = truncateToWords(option.subtext || '');
        interests.push(`${q.category}:${text}(${subtext})`);
      }
    }
  });
  return interests.join(', ');
}

function matchFashionOutfit(title: string, archetype: string): typeof FASHION_DATA_SOURCE[number] {
  const t = title.toLowerCase();
  if (t.includes('invierno') || t.includes('winter') || t.includes('minimalista') || t.includes('frío')) {
    return FASHION_DATA_SOURCE[0];
  }
  if (t.includes('verano') || t.includes('summer') || t.includes('bohemio') || t.includes('primavera') || t.includes('cálido')) {
    return FASHION_DATA_SOURCE[1];
  }
  if (t.includes('techwear') || t.includes('urbano') || t.includes('otoño') || t.includes('campera')) {
    return FASHION_DATA_SOURCE[2];
  }
  
  if (archetype === "Curador Urbano Moderno") {
    return FASHION_DATA_SOURCE[2];
  } else if (archetype === "Bohemio Ecléctico") {
    return FASHION_DATA_SOURCE[1];
  } else {
    return FASHION_DATA_SOURCE[0];
  }
}

export async function enrichSingleRecommendationSet(
  pool: {
    peliculas: string[];
    series: string[];
    musica: string[];
    libros: string[];
    lugares: string[];
    ropa: string[];
  },
  index: number,
  archetype: string
): Promise<RecommendationItem[]> {
  const enrichedList: RecommendationItem[] = [];
  const idx = index % 12;

  // 1. Cinema
  const movieTitle = pool.peliculas[idx] || "Eternal Sunshine";
  const movieDetail = await getTMDBDetail('cinema', movieTitle);
  enrichedList.push({
    id: `rec_cinema_${Date.now()}_${idx}`,
    title: movieDetail ? movieDetail.title : movieTitle,
    subtitle: movieDetail ? `${movieDetail.genres.slice(0, 2).join(', ')} · ${movieDetail.releaseYear}` : "Michel Gondry · Drama",
    category: 'cinema',
    isFavorite: false,
    isViewed: false,
    isDisliked: false
  });

  // 2. Series
  const seriesTitle = pool.series[idx] || "Normal People";
  const seriesDetail = await getTMDBDetail('series', seriesTitle);
  enrichedList.push({
    id: `rec_series_${Date.now() + 1}_${idx}`,
    title: seriesDetail ? seriesDetail.title : seriesTitle,
    subtitle: seriesDetail ? `${seriesDetail.genres.slice(0, 2).join(', ')} · ${seriesDetail.runtimeOrSeasons}` : "Sally Rooney · Romance",
    category: 'series',
    isFavorite: false,
    isViewed: false,
    isDisliked: false
  });

  // 3. Music
  const musicStr = pool.musica[idx] || "Phoebe Bridgers - Motion Sickness";
  const mParts = musicStr.split(' - ');
  let artistName = musicStr;
  let songName = "";
  if (mParts.length >= 2) {
    artistName = mParts[0].trim();
    songName = mParts[1].trim();
  } else {
    artistName = "Phoebe Bridgers";
    songName = "Motion Sickness";
  }
  const musicDetail = await getDeezerDetail(artistName, songName);
  enrichedList.push({
    id: `rec_music_${Date.now() + 2}_${idx}`,
    title: musicDetail ? musicDetail.artist : artistName,
    subtitle: musicDetail ? `${musicDetail.title} · Indie` : (songName ? `${songName} · Folk` : "Motion Sickness · Folk"),
    category: 'music',
    isFavorite: false,
    isViewed: false,
    isDisliked: false
  });

  // 4. Books
  const bookStr = pool.libros[idx] || "Year of Rest & Relaxation - Ottessa Moshfegh";
  const bParts = bookStr.split(' - ');
  let bookTitle = bookStr;
  let authorName = "";
  if (bParts.length >= 2) {
    bookTitle = bParts[0].trim();
    authorName = bParts[1].trim();
  }
  const bookDetail = await getBookDetail(bookTitle, authorName);
  enrichedList.push({
    id: `rec_books_${Date.now() + 3}_${idx}`,
    title: bookDetail ? bookDetail.title : bookTitle,
    subtitle: bookDetail ? `${bookDetail.author} · Literatura` : (authorName ? `${authorName} · Novela` : "Ottessa Moshfegh · Novela"),
    category: 'books',
    isFavorite: false,
    isViewed: false,
    isDisliked: false
  });

  // 5. Places
  const placeTitle = pool.lugares[idx] || "Bariloche";
  const placeDetail = await getWikipediaDetail(placeTitle);
  enrichedList.push({
    id: `rec_destination_${Date.now() + 4}_${idx}`,
    title: placeDetail ? placeDetail.title : placeTitle,
    subtitle: placeDetail ? (placeDetail.shortDescription || placeDetail.summary) : "Patagonia · Montaña",
    category: 'destination',
    isFavorite: false,
    isViewed: false,
    isDisliked: false
  });

  // 6. Ropa (outfits)
  const fashionTitle = pool.ropa[idx] || "Outfit Minimalista de Invierno";
  const selectedOutfit = matchFashionOutfit(fashionTitle, archetype);
  enrichedList.push({
    id: selectedOutfit.id,
    title: selectedOutfit.title,
    subtitle: selectedOutfit.subtitle,
    category: 'fashion',
    image: selectedOutfit.image,
    isFavorite: false,
    isViewed: false,
    isDisliked: false
  });

  return enrichedList;
}

export async function generateDynamicRecommendations(user: User): Promise<RecommendationItem[]> {
  const archetype = user.archetype || "Melómano Introspectivo";
  const archetypeDesc = ARCHETYPE_DESCRIPTIONS[archetype] || "Arquetipo cultural personalizado.";
  
  const promptTextPrefix = `Generá recomendaciones personalizadas en JSON para este usuario.

PERFIL:
- Arquetipo VIBE (FACTOR PRINCIPAL): ${archetype}
- Descripción: ${archetypeDesc}
- Respuestas quiz: ${getUserInterests(user.quizAnswers)}
- MBTI: ${user.mbtiCompleted && user.mbti ? user.mbti : "No realizado"}
- Estación: ${getSeason()}
- Ubicación: ${user.location || "No especificada"}
`;

  const promptTextSuffix = `
REGLAS:
1. El arquetipo define estética y tono de TODAS las recomendaciones.
2. Las respuestas del quiz refuerzan el arquetipo.
3. MBTI es solo suplementario.
4. Ubicación y estación SOLO afectan "lugares" y "ropa".
5. Recomendaciones distintas por arquetipo. Nada genérico ni masivo.
6. Solo JSON puro, sin markdown ni texto extra.

FORMATOS:
- musica: "Artista - Canción"
- libros: "Título - Autor"
- lugares: nombre del destino
- ropa: máximo 5 palabras (por ejemplo: 'Bomber reflectante con cargo slim')

RESPUESTA (JSON puro, EXACTAMENTE 12 opciones por categoría):
{"peliculas":["","","","","","","","","","","",""],"series":["","","","","","","","","","","",""],"musica":["","","","","","","","","","","",""],"libros":["","","","","","","","","","","",""],"lugares":["","","","","","","","","","","",""],"ropa":["","","","","","","","","","","",""]}`;

  let feedbackBlock = '';
  if (user.feedbackHistory && ((user.feedbackHistory.liked && user.feedbackHistory.liked.length > 0) || (user.feedbackHistory.disliked && user.feedbackHistory.disliked.length > 0))) {
    const sortedLikes = [...(user.feedbackHistory.liked || [])].sort((a, b) => b.timestamp - a.timestamp);
    const likedTitlesList = sortedLikes.slice(0, 8).map(item => item.title);
    const dislikedTitlesList = (user.feedbackHistory.disliked || []).map(item => item.title);
    
    feedbackBlock = `
HISTORIAL DE FEEDBACK DEL USUARIO:
- Le gustó: ${likedTitlesList.join(', ')}
- No le gustó / no volver a recomendar: ${dislikedTitlesList.join(', ')}

INSTRUCCIONES DE FEEDBACK:
- NUNCA recomiendes títulos de la lista "No le gustó".
- Usá los títulos que le gustaron como referencia de estilo y tono, pero no los repitas.
- Si no hay feedback todavía, ignorá esta sección.
`;

    // Cap characters safely below 3500 limit
    const tempFullPrompt = `${SYSTEM_INSTRUCTION}\n\nContexto del usuario:\n${promptTextPrefix}${feedbackBlock}${promptTextSuffix}`;
    if (tempFullPrompt.length > 3500) {
      const trimmedLikes = sortedLikes.slice(0, 5).map(item => item.title);
      feedbackBlock = `
HISTORIAL DE FEEDBACK DEL USUARIO:
- Le gustó: ${trimmedLikes.join(', ')}
- No le gustó / no volver a recomendar: ${dislikedTitlesList.join(', ')}

INSTRUCCIONES DE FEEDBACK:
- NUNCA recomiendes títulos de la lista "No le gustó".
- Usá los títulos que le gustaron como referencia de estilo y tono, pero no los repitas.
- Si no hay feedback todavía, ignorá esta sección.
`;
    }
  }

  const promptText = `${promptTextPrefix}${feedbackBlock}${promptTextSuffix}`;

  if (import.meta.env.DEV) {
    console.log("--- LLAMADA A GEMINI RECOMENDACIONES ---");
    console.log("Current user ID:", user.id);
    console.log("User name:", user.name);
    console.log("VIBE archetype:", archetype);
    console.log("Quiz answers:", user.quizAnswers);
    if (user.location) {
      console.log("Location:", user.location);
    }
    console.log("Complete prompt being sent to Gemini:", promptText);
  }

  try {
    const response = await queryGemini(SYSTEM_INSTRUCTION, promptText);
    
    const rawPool = {
      peliculas: response.peliculas || [],
      series: response.series || [],
      musica: response.musica || [],
      libros: response.libros || [],
      lugares: response.lugares || [],
      ropa: response.ropa || []
    };

    // Ensure they have exactly 12 items (pad if necessary)
    const categories = ['peliculas', 'series', 'musica', 'libros', 'lugares', 'ropa'] as const;
    categories.forEach(cat => {
      while (rawPool[cat].length < 12) {
        if (rawPool[cat].length > 0) {
          rawPool[cat].push(rawPool[cat][rawPool[cat].length - 1]);
        } else {
          rawPool[cat].push("");
        }
      }
    });

    const enrichedList = await enrichSingleRecommendationSet(rawPool, 0, archetype);

    user.recommendationPool = rawPool;
    user.recommendationIndex = 0;
    user.recommendationLastRotated = Date.now();
    user.recommendations = enrichedList;

    if (import.meta.env.DEV) {
      console.log("Final recommendation object saved to the user profile:", enrichedList);
    }

    return enrichedList;

  } catch (error) {
    console.error("Gemini recommendation generation failed, falling back to static DB:", error);
    // Return a clean fallback list based on VIBE archetype from RECOMMENDATIONS_DB
    const fallbackDB: Record<string, RecommendationItem[]> = {
      "Melómano Introspectivo": [
        { id: "rec1", title: "Phoebe Bridgers", subtitle: "Motion Sickness · Folk", category: "music" },
        { id: "rec2", title: "Eternal Sunshine", subtitle: "Michel Gondry · Drama", category: "cinema" },
        { id: "rec3", title: "Normal People", subtitle: "Sally Rooney · Romance", category: "series" },
        { id: "rec4", title: "Year of Rest & Relaxation", subtitle: "Ottessa Moshfegh · Novela", category: "books" },
        { id: "rec5", title: "Outfit Minimalista de Invierno", subtitle: "Abrigo, suéter, sastrero, botas y bufanda", category: "fashion", image: "/outfits/winter.png" },
        { id: "rec6", title: "Bariloche (Bosques)", subtitle: "Patagonia · Montaña", category: "destination" }
      ],
      "Bohemio Ecléctico": [
        { id: "rec11", title: "Devendra Banhart", subtitle: "Mi Negrita · Freak Folk", category: "music" },
        { id: "rec12", title: "Amélie", subtitle: "Jean-Pierre Jeunet · Comedia", category: "cinema" },
        { id: "rec13", title: "Fleabag", subtitle: "Phoebe Waller-Bridge · Comedia", category: "series" },
        { id: "rec14", title: "Rayuela", subtitle: "Julio Cortázar · Clásico", category: "books" },
        { id: "rec15", title: "Outfit Bohemio de Verano", subtitle: "Camisa estampada, bermuda y sandalias", category: "fashion", image: "/outfits/summer.png" },
        { id: "rec16", title: "Montevideo (Ciudad Vieja)", subtitle: "Paseo costero y cafés", category: "destination" }
      ],
      "Curador Urbano Moderno": [
        { id: "rec21", title: "Fred again..", subtitle: "Delilah (pull me out of this)", category: "music" },
        { id: "rec22", title: "Blade Runner 2049", subtitle: "Denis Villeneuve · Sci-Fi", category: "cinema" },
        { id: "rec23", title: "Succession", subtitle: "Jesse Armstrong · Drama", category: "series" },
        { id: "rec24", title: "Sapiens", subtitle: "Yuval Noah Harari · Ensayo", category: "books" },
        { id: "rec25", title: "Outfit Urbano Techwear", subtitle: "Campera técnica, cargo, sneakers y beanie", category: "fashion", image: "/outfits/techwear.png" },
        { id: "rec26", title: "Tokio (Shibuya)", subtitle: "Tecnología y Neón", category: "destination" }
      ]
    };
    return fallbackDB[archetype] || fallbackDB["Melómano Introspectivo"];
  }
}
