export function getCached<T>(key: string): T | null {
  const cached = localStorage.getItem(`vibe_detail_cache_${key}`);
  if (!cached) return null;
  try {
    const { data, expiry } = JSON.parse(cached);
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(`vibe_detail_cache_${key}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, data: T, ttlMs = 1000 * 60 * 60 * 24): void { // Default 24 hours
  try {
    const item = {
      data,
      expiry: Date.now() + ttlMs
    };
    localStorage.setItem(`vibe_detail_cache_${key}`, JSON.stringify(item));
  } catch (e) {
    console.error('Failed to set cache', e);
  }
}
