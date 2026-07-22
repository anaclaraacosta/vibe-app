import { QuizQuestion } from '../types';

export const MBTI_QUESTIONS: QuizQuestion[] = [
  // ==========================================
  // EI: Introversion vs Extraversion (4 Questions)
  // ==========================================
  {
    id: 1,
    questionText: "¿Cómo preferís arrancar tu sábado a la mañana?",
    category: "Música",
    dimension: "EI",
    options: [
      { id: "1a", text: "Café y vinilos a bajo volumen", subtext: "Intimidad y calma", mbtiValue: "I", weight: 2 },
      { id: "1b", text: "Silencio total o sonidos de naturaleza", subtext: "Foco y meditación", mbtiValue: "I", weight: 1 },
      { id: "1c", text: "Podcast interesante mientras ordeno", subtext: "Mente activa", mbtiValue: "E", weight: 1 },
      { id: "1d", text: "Playlist enérgica y desayuno completo", subtext: "Arranque bien arriba", mbtiValue: "E", weight: 2 }
    ]
  },
  {
    id: 2,
    questionText: "¿Qué preferís hacer un viernes a la noche para recargar energías?",
    category: "General",
    dimension: "EI",
    options: [
      { id: "2a", text: "Quedarme en casa leyendo o viendo una serie", subtext: "Desconexión total", mbtiValue: "I", weight: 2 },
      { id: "2b", text: "Cena tranquila con un par de amigos íntimos", subtext: "Charla profunda", mbtiValue: "I", weight: 1 },
      { id: "2c", text: "Ir a un bar o cafetería concurrida", subtext: "Salida relajada", mbtiValue: "E", weight: 1 },
      { id: "2d", text: "Ir a un show en vivo o una fiesta con mucha gente", subtext: "Ritmo y movimiento", mbtiValue: "E", weight: 2 }
    ]
  },
  {
    id: 3,
    questionText: "Cuando estás en un grupo grande de personas, ¿cómo solés participar?",
    category: "General",
    dimension: "EI",
    options: [
      { id: "3a", text: "Prefiero escuchar y hablar individualmente con alguien", subtext: "Perfil reservado", mbtiValue: "I", weight: 2 },
      { id: "3b", text: "Hablo solo cuando tengo algo muy claro que aportar", subtext: "Aportes clave", mbtiValue: "I", weight: 1 },
      { id: "3c", text: "Intento integrarme en la charla general de forma activa", subtext: "Conectar con todos", mbtiValue: "E", weight: 1 },
      { id: "3d", text: "Suelo proponer temas de debate y liderar el grupo", subtext: "Centro de atención", mbtiValue: "E", weight: 2 }
    ]
  },
  {
    id: 4,
    questionText: "Si querés contarle algo importante a un amigo, preferís:",
    category: "General",
    dimension: "EI",
    options: [
      { id: "4a", text: "Escribirle un mensaje largo y bien redactado", subtext: "Idea madurada", mbtiValue: "I", weight: 2 },
      { id: "4b", text: "Esperar a encontrarse en persona a solas", subtext: "Cara a cara", mbtiValue: "I", weight: 1 },
      { id: "4c", text: "Mandarle un mensaje de voz espontáneo", subtext: "Expresión natural", mbtiValue: "E", weight: 1 },
      { id: "4d", text: "Llamarlo por teléfono de inmediato", subtext: "Charla directa", mbtiValue: "E", weight: 2 }
    ]
  },

  // ==========================================
  // SN: Sensing vs Intuition (4 Questions)
  // ==========================================
  {
    id: 5,
    questionText: "Si tuvieras que elegir una paleta de colores y estética para tu habitación:",
    category: "Cine",
    dimension: "SN",
    options: [
      { id: "5a", text: "Tonos tierra y luces cálidas bajas", subtext: "Refugio orgánico", mbtiValue: "S", weight: 2 },
      { id: "5b", text: "Blanco minimalista y plantas de interior", subtext: "Orden práctico", mbtiValue: "S", weight: 1 },
      { id: "5c", text: "Colores pasteles y estética retro vintage", subtext: "Carga de nostalgia", mbtiValue: "N", weight: 1 },
      { id: "5d", text: "Negro, grises y luces de neón", subtext: "Inspiración cyberpunk", mbtiValue: "N", weight: 2 }
    ]
  },
  {
    id: 6,
    questionText: "¿Qué tipo de narrativa o lectura te resulta más atractiva?",
    category: "Libros",
    dimension: "SN",
    options: [
      { id: "6a", text: "Biografía de un artista o ensayo cultural", subtext: "Aprender de hechos reales", mbtiValue: "S", weight: 2 },
      { id: "6b", text: "Guía de viajes o crónicas periodísticas reales", subtext: "Hechos y detalles", mbtiValue: "S", weight: 1 },
      { id: "6c", text: "Novela gráfica o ciencia ficción experimental", subtext: "Arte visual y conceptos", mbtiValue: "N", weight: 1 },
      { id: "6d", text: "Novela de realismo mágico o ficción abstracta", subtext: "Viaje imaginativo libre", mbtiValue: "N", weight: 2 }
    ]
  },
  {
    id: 7,
    questionText: "Al apreciar una obra de arte, una canción o una película, te fijás primero en:",
    category: "Cine",
    dimension: "SN",
    options: [
      { id: "7a", text: "La calidad de producción y la ejecución técnica real", subtext: "Materia y técnica", mbtiValue: "S", weight: 2 },
      { id: "7b", text: "Los detalles de la ambientación, vestuarios o acordes", subtext: "Atención al detalle", mbtiValue: "S", weight: 1 },
      { id: "7c", text: "La metáfora y los mensajes ocultos detrás de la obra", subtext: "Simbolismo", mbtiValue: "N", weight: 1 },
      { id: "7d", text: "La vibra general, la abstracción y el significado oculto", subtext: "Atmósfera conceptual", mbtiValue: "N", weight: 2 }
    ]
  },
  {
    id: 8,
    questionText: "¿Qué destino te da más paz para pasar un fin de semana?",
    category: "Destino",
    dimension: "SN",
    options: [
      { id: "8a", text: "Cabaña solitaria equipada en el bosque", subtext: "Contacto directo con la tierra", mbtiValue: "S", weight: 2 },
      { id: "8b", text: "Playa tranquila con servicios cómodos y buena comida", subtext: "Placer físico", mbtiValue: "S", weight: 1 },
      { id: "8c", text: "Ciudad histórica con museos y librerías antiguas", subtext: "Enriquecimiento conceptual", mbtiValue: "N", weight: 1 },
      { id: "8d", text: "Metrópolis futurista repleta de galerías y neones", subtext: "Estímulo mental abstracto", mbtiValue: "N", weight: 2 }
    ]
  },

  // ==========================================
  // TF: Thinking vs Feeling (4 Questions)
  // ==========================================
  {
    id: 9,
    questionText: "Cuando tenés que tomar una decisión importante, solés guiarte por:",
    category: "General",
    dimension: "TF",
    options: [
      { id: "9a", text: "Un análisis objetivo de pros y contras lógicos", subtext: "Frialdad racional", mbtiValue: "T", weight: 2 },
      { id: "9b", text: "Lo que es más justo y razonable para la situación", subtext: "Equidad mental", mbtiValue: "T", weight: 1 },
      { id: "9c", text: "Mis valores personales y el impacto en los demás", subtext: "Empatía mutua", mbtiValue: "F", weight: 1 },
      { id: "9d", text: "Lo que siento en el corazón y mi intuición emocional", subtext: "Corazonada pura", mbtiValue: "F", weight: 2 }
    ]
  },
  {
    id: 10,
    questionText: "Si un amigo viene a contarte un problema personal, tu primera reacción es:",
    category: "General",
    dimension: "TF",
    options: [
      { id: "10a", text: "Analizar la situación objetivamente y sugerir soluciones lógicas", subtext: "Consejo práctico", mbtiValue: "T", weight: 2 },
      { id: "10b", text: "Preguntarle si quiere un consejo o solo desahogarse", subtext: "Ayuda estructurada", mbtiValue: "T", weight: 1 },
      { id: "10c", text: "Validar sus sentimientos y decirle que entiendo su dolor", subtext: "Apoyo emocional", mbtiValue: "F", weight: 1 },
      { id: "10d", text: "Abrazarlo y ofrecerle un espacio de contención afectuosa", subtext: "Empatía física y emocional", mbtiValue: "F", weight: 2 }
    ]
  },
  {
    id: 11,
    questionText: "En una discusión sobre cultura, política o arte, preferís:",
    category: "General",
    dimension: "TF",
    options: [
      { id: "11a", text: "Defender la verdad de los datos aunque incomode a alguien", subtext: "Objetividad ante todo", mbtiValue: "T", weight: 2 },
      { id: "11b", text: "Debatir con argumentos sólidos y debatir las ideas del otro", subtext: "Estimulación lógica", mbtiValue: "T", weight: 1 },
      { id: "11c", text: "Evitar confrontar demasiado para no arruinar el ambiente", subtext: "Cuidado del grupo", mbtiValue: "F", weight: 1 },
      { id: "11d", text: "Buscar puntos de acuerdo y entender la perspectiva del otro", subtext: "Armonía social", mbtiValue: "F", weight: 2 }
    ]
  },
  {
    id: 12,
    questionText: "¿Qué te conmueve más de una canción o de una película?",
    category: "Música",
    dimension: "TF",
    options: [
      { id: "12a", text: "La complejidad armónica, la mezcla o la estructura del guion", subtext: "Aprecio racional", mbtiValue: "T", weight: 2 },
      { id: "12b", text: "La coherencia de la obra y el ingenio de su desenlace", subtext: "Coherencia estética", mbtiValue: "T", weight: 1 },
      { id: "12c", text: "La nostalgia o los recuerdos personales que me evoca", subtext: "Conexión sentimental", mbtiValue: "F", weight: 1 },
      { id: "12d", text: "La crudeza de las emociones que transmite el autor", subtext: "Impacto lírico/emocional", mbtiValue: "F", weight: 2 }
    ]
  },

  // ==========================================
  // JP: Judging vs Perceiving (4 Questions)
  // ==========================================
  {
    id: 13,
    questionText: "Elegí una prenda de vestir indispensable en tu guardarropa habitual:",
    category: "Ropa",
    dimension: "JP",
    options: [
      { id: "13a", text: "Prenda de lino clásica bien planchada de tonos claros", subtext: "Estructura y prolijidad", mbtiValue: "J", weight: 2 },
      { id: "13b", text: "Zapatillas urbanas de diseño moderno y funcional", subtext: "Práctico y versátil", mbtiValue: "J", weight: 1 },
      { id: "13c", text: "Buzo oversize de algodón cómodo y abrigado", subtext: "Comodidad sin reglas", mbtiValue: "P", weight: 1 },
      { id: "13d", text: "Chaqueta de cuero vintage desgastada con bolsillos de sobra", subtext: "Estilo libre espontáneo", mbtiValue: "P", weight: 2 }
    ]
  },
  {
    id: 14,
    questionText: "Si tenés que definir tu ritmo y organización hoy en día, sería:",
    category: "General",
    dimension: "JP",
    options: [
      { id: "14a", text: "Rápido, dinámico y enfocado en listas de tareas claras", subtext: "Planificado y al día", mbtiValue: "J", weight: 2 },
      { id: "14b", text: "Tranquilo, siguiendo rutinas diarias consistentes", subtext: "Estructura suave", mbtiValue: "J", weight: 1 },
      { id: "14c", text: "Tranquilo, fluyendo con lo que traiga el día", subtext: "Sin presiones", mbtiValue: "P", weight: 1 },
      { id: "14d", text: "Ecléctico, cambiante según lo que me pinte hacer", subtext: "Multifacético y libre", mbtiValue: "P", weight: 2 }
    ]
  },
  {
    id: 15,
    questionText: "Al trabajar en un proyecto, estudiar o encarar una tarea:",
    category: "General",
    dimension: "JP",
    options: [
      { id: "15a", text: "Hago un cronograma y avanzo de a poco con tiempo", subtext: "Cero estrés final", mbtiValue: "J", weight: 2 },
      { id: "15b", text: "Me gusta terminarlo rápido para sacármelo de encima", subtext: "Foco directo", mbtiValue: "J", weight: 1 },
      { id: "15c", text: "Investigo varios caminos y cambio el rumbo a mitad de camino", subtext: "Proceso exploratorio", mbtiValue: "P", weight: 1 },
      { id: "15d", text: "Trabajo mejor bajo presión a último momento con adrenalina", subtext: "Chispazo final", mbtiValue: "P", weight: 2 }
    ]
  },
  {
    id: 16,
    questionText: "Si surge un plan o invitación inesperada que cambia tus planes previos:",
    category: "General",
    dimension: "JP",
    options: [
      { id: "16a", text: "Me genera incomodidad y prefiero apegarme a mi agenda", subtext: "Control del tiempo", mbtiValue: "J", weight: 2 },
      { id: "16b", text: "Lo evalúo con cautela y solo voy si realmente conviene", subtext: "Decisión medida", mbtiValue: "J", weight: 1 },
      { id: "16c", text: "Suelo adaptarme sin problemas si la propuesta es divertida", subtext: "Flexibilidad", mbtiValue: "P", weight: 1 },
      { id: "16d", text: "Me encanta, adoro la espontaneidad y los cambios de rumbo", mbtiValue: "P", weight: 2 }
    ]
  }
];

export function calculateMbtiType(answers: Record<number, string>): string {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  MBTI_QUESTIONS.forEach((q) => {
    const answerOptionId = answers[q.id];
    if (answerOptionId) {
      const option = q.options.find((opt) => opt.id === answerOptionId);
      if (option && option.mbtiValue) {
        scores[option.mbtiValue] += option.weight || 1;
      }
    }
  });

  const eOrI = scores.E >= scores.I ? 'E' : 'I';
  const sOrN = scores.S >= scores.N ? 'S' : 'N';
  const tOrF = scores.T >= scores.F ? 'T' : 'F';
  const jOrP = scores.J >= scores.P ? 'J' : 'P';

  return `${eOrI}${sOrN}${tOrF}${jOrP}`;
}
