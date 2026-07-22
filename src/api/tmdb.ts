import { getCached, setCached } from '../services/cache';

export interface TMDBDetail {
  id: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  releaseYear: string;
  rating: number;
  genres: string[];
  runtimeOrSeasons: string;
  overview: string;
  tmdbUrl: string;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function getTMDBDetail(category: 'cinema' | 'series', title: string): Promise<TMDBDetail | null> {
  if (!TMDB_API_KEY) {
    console.error('TMDB API Key (VITE_TMDB_API_KEY) is missing in environment.');
    return null;
  }

  const cacheKey = `tmdb_${category}_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const cached = getCached<TMDBDetail>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const isMovie = category === 'cinema';
    const searchType = isMovie ? 'movie' : 'tv';
    const cleanTitle = title.trim();
    
    // 1. Search for the title
    const searchUrl = `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=es-AR`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      throw new Error(`TMDB Search failed with status ${searchRes.status}`);
    }
    const searchData = await searchRes.json();
    const results = searchData.results;

    if (!results || results.length === 0) {
      // Try searching with English language fallback in case title is in English and Spanish search failed
      const fallbackSearchUrl = `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=en-US`;
      const fallbackSearchRes = await fetch(fallbackSearchUrl);
      if (fallbackSearchRes.ok) {
        const fallbackSearchData = await fallbackSearchRes.json();
        if (fallbackSearchData.results && fallbackSearchData.results.length > 0) {
          return await fetchDetails(searchType, fallbackSearchData.results[0].id, cacheKey);
        }
      }
      return null;
    }

    const firstResult = results[0];
    return await fetchDetails(searchType, firstResult.id, cacheKey);

  } catch (error) {
    console.error('Error fetching TMDB details:', error);
    return null;
  }
}

async function fetchDetails(type: 'movie' | 'tv', id: number, cacheKey: string): Promise<TMDBDetail | null> {
  try {
    // Fetch details in Spanish (es-AR)
    const detailUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-AR`;
    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) {
      throw new Error(`TMDB Detail fetch failed with status ${detailRes.status}`);
    }
    let data = await detailRes.json();

    // If overview is missing in Spanish, fetch detail in English (en-US) to fill it
    if (!data.overview) {
      const fallbackDetailUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=en-US`;
      const fallbackDetailRes = await fetch(fallbackDetailUrl);
      if (fallbackDetailRes.ok) {
        const fallbackData = await fallbackDetailRes.json();
        data.overview = fallbackData.overview || data.overview;
      }
    }

    const isMovie = type === 'movie';
    const rawDate = isMovie ? data.release_date : data.first_air_date;
    const releaseYear = rawDate ? rawDate.split('-')[0] : 'Desconocido';

    let runtimeOrSeasons = '';
    if (isMovie) {
      const runtime = data.runtime;
      runtimeOrSeasons = runtime ? `${runtime} min` : 'Duración desconocida';
    } else {
      const seasons = data.number_of_seasons;
      runtimeOrSeasons = seasons ? `${seasons} ${seasons === 1 ? 'temporada' : 'temporadas'}` : 'Temporadas desconocidas';
    }

    const detail: TMDBDetail = {
      id: data.id,
      title: isMovie ? (data.title || data.original_title) : (data.name || data.original_name),
      poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
      releaseYear,
      rating: data.vote_average || 0,
      genres: data.genres ? data.genres.map((g: any) => g.name) : [],
      runtimeOrSeasons,
      overview: data.overview || 'Sin sinopsis disponible.',
      tmdbUrl: `https://www.themoviedb.org/${type}/${data.id}`
    };

    setCached(cacheKey, detail);
    return detail;
  } catch (error) {
    console.error(`Error in TMDB fetchDetails for ${type} id ${id}:`, error);
    return null;
  }
}
