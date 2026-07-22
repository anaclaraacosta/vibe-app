import { getCached, setCached } from '../services/cache';

export interface BookDetail {
  key: string;
  title: string;
  author: string;
  firstPublishYear: string;
  cover: string | null;
  description: string | null;
  openLibraryUrl: string;
}

export async function getBookDetail(title: string, author?: string): Promise<BookDetail | null> {
  const cacheKey = `openlibrary_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${(author || '').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const cached = getCached<BookDetail>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const cleanTitle = title.trim();
    const cleanAuthor = author ? author.trim() : '';

    // 1. Search Open Library by title and author
    let searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(cleanTitle)}`;
    if (cleanAuthor) {
      searchUrl += `&author=${encodeURIComponent(cleanAuthor)}`;
    }
    
    let searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      throw new Error(`Open Library search failed with status ${searchRes.status}`);
    }
    let searchData = await searchRes.json();
    let docs = searchData.docs;

    // 2. Fallback to searching only title if title + author gave no results
    if ((!docs || docs.length === 0) && cleanAuthor) {
      const fallbackSearchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(cleanTitle)}`;
      searchRes = await fetch(fallbackSearchUrl);
      if (searchRes.ok) {
        searchData = await searchRes.json();
        docs = searchData.docs;
      }
    }

    // 3. Last resort: general query string search
    if (!docs || docs.length === 0) {
      const generalSearchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(cleanTitle + ' ' + cleanAuthor)}`;
      searchRes = await fetch(generalSearchUrl);
      if (searchRes.ok) {
        searchData = await searchRes.json();
        docs = searchData.docs;
      }
    }

    if (!docs || docs.length === 0) {
      return null;
    }

    const matchedDoc = docs[0];
    const key = matchedDoc.key;

    let description: string | null = null;
    if (key) {
      try {
        const workDetailUrl = `https://openlibrary.org${key}.json`;
        const workRes = await fetch(workDetailUrl);
        if (workRes.ok) {
          const workData = await workRes.json();
          if (workData.description) {
            if (typeof workData.description === 'string') {
              description = workData.description;
            } else if (typeof workData.description === 'object' && workData.description.value) {
              description = workData.description.value;
            }
          }
        }
      } catch (workError) {
        console.error('Error fetching Open Library work details:', workError);
      }
    }

    let authorName = 'Autor Desconocido';
    if (matchedDoc.author_name && matchedDoc.author_name.length > 0) {
      authorName = matchedDoc.author_name.join(', ');
    } else if (cleanAuthor) {
      authorName = cleanAuthor;
    }

    const cover = matchedDoc.cover_i 
      ? `https://covers.openlibrary.org/b/id/${matchedDoc.cover_i}-L.jpg` 
      : null;

    const detail: BookDetail = {
      key,
      title: matchedDoc.title || cleanTitle,
      author: authorName,
      firstPublishYear: matchedDoc.first_publish_year ? String(matchedDoc.first_publish_year) : 'Año Desconocido',
      cover,
      description,
      openLibraryUrl: `https://openlibrary.org${key}`
    };

    setCached(cacheKey, detail);
    return detail;

  } catch (error) {
    console.error('Error fetching Open Library details:', error);
    return null;
  }
}
