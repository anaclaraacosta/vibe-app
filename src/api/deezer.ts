import { getCached, setCached } from '../services/cache';

export interface DeezerDetail {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string | null;
  duration: number; // in seconds
  previewUrl: string | null;
  deezerUrl: string;
}

// JSONP utility specifically to bypass Deezer CORS restrictions in browser environment
function fetchJsonp<T>(url: string, callbackParam = 'callback'): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_deezer_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const script = document.createElement('script');
    
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}${callbackParam}=${callbackName}`;
    
    // Set a timeout of 10 seconds for the request
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`JSONP request to ${url} timed out`));
    }, 10000);

    (window as any)[callbackName] = (data: T) => {
      clearTimeout(timeoutId);
      cleanup();
      resolve(data);
    };
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      reject(new Error(`JSONP request to ${url} failed`));
    };
    
    function cleanup() {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any)[callbackName];
    }
    
    document.body.appendChild(script);
  });
}

export async function getDeezerDetail(artist: string, track: string): Promise<DeezerDetail | null> {
  const cacheKey = `deezer_${artist.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${track.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const cached = getCached<DeezerDetail>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const cleanArtist = artist.trim();
    const cleanTrack = track.trim();

    // 1. Attempt precise search using artist and track filters
    const advancedQuery = `artist:"${cleanArtist}" track:"${cleanTrack}"`;
    const advancedUrl = `https://api.deezer.com/search?q=${encodeURIComponent(advancedQuery)}&output=jsonp`;
    
    let response: any = await fetchJsonp(advancedUrl);
    let results = response.data;

    // 2. Fallback to a loose text search query if precise search returns no results
    if (!results || results.length === 0) {
      const looseQuery = `${cleanArtist} ${cleanTrack}`;
      const looseUrl = `https://api.deezer.com/search?q=${encodeURIComponent(looseQuery)}&output=jsonp`;
      response = await fetchJsonp(looseUrl);
      results = response.data;
    }

    if (!results || results.length === 0) {
      // Fallback: search just for track title
      const trackOnlyUrl = `https://api.deezer.com/search?q=${encodeURIComponent(cleanTrack)}&output=jsonp`;
      response = await fetchJsonp(trackOnlyUrl);
      results = response.data;
    }

    if (!results || results.length === 0) {
      return null;
    }

    const matchedTrack = results[0];
    
    const detail: DeezerDetail = {
      id: matchedTrack.id,
      title: matchedTrack.title,
      artist: matchedTrack.artist.name,
      album: matchedTrack.album.title,
      cover: matchedTrack.album.cover_xl || matchedTrack.album.cover_big || matchedTrack.album.cover_medium || matchedTrack.album.cover || null,
      duration: matchedTrack.duration,
      previewUrl: matchedTrack.preview || null,
      deezerUrl: matchedTrack.link || `https://www.deezer.com/track/${matchedTrack.id}`
    };

    setCached(cacheKey, detail);
    return detail;

  } catch (error) {
    console.error('Error fetching Deezer detail:', error);
    return null;
  }
}
