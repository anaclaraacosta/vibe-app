import { getCached, setCached } from '../services/cache';

export interface WikipediaDetail {
  title: string;
  shortDescription: string | null;
  summary: string;
  image: string | null;
  wikipediaUrl: string;
}

export async function getWikipediaDetail(query: string): Promise<WikipediaDetail | null> {
  const cacheKey = `wikipedia_${query.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const cached = getCached<WikipediaDetail>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const cleanedQuery = query.replace(/\(([^)]+)\)/g, '$1').trim();

    const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanedQuery)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      throw new Error(`Wikipedia search failed with status ${searchRes.status}`);
    }
    
    const searchData = await searchRes.json();
    const searchResults = searchData.query?.search;
    
    let pageTitle = cleanedQuery;
    if (searchResults && searchResults.length > 0) {
      pageTitle = searchResults[0].title;
    }

    const pageTitleSlug = pageTitle.replace(/ /g, '_');
    const summaryUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitleSlug)}`;
    
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) {
      const fallbackSlug = query.replace(/ /g, '_');
      const fallbackUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(fallbackSlug)}`;
      const fallbackRes = await fetch(fallbackUrl);
      if (!fallbackRes.ok) {
        throw new Error(`Wikipedia summary failed with status ${summaryRes.status}`);
      }
      const data = await fallbackRes.json();
      const result = parseWikipediaSummary(data);
      setCached(cacheKey, result);
      return result;
    }

    const data = await summaryRes.json();
    const result = parseWikipediaSummary(data);
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching Wikipedia detail:', error);
    return null;
  }
}

function parseWikipediaSummary(data: any): WikipediaDetail {
  return {
    title: data.title || data.displaytitle || '',
    shortDescription: data.description || null,
    summary: data.extract || '',
    image: data.thumbnail?.source || data.originalimage?.source || null,
    wikipediaUrl: data.content_urls?.desktop?.page || `https://es.wikipedia.org/wiki/${encodeURIComponent(data.title || '')}`
  };
}
