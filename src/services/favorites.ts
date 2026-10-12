interface FavoritesResponse {
  savedAdIds?: string[];
  error?: string;
}

async function requestFavorites(method = 'GET', savedAdIds?: string[]) {
  const response = await fetch('/api/auth/favorites', {
    method,
    credentials: 'include',
    headers: savedAdIds ? { 'Content-Type': 'application/json' } : undefined,
    body: savedAdIds ? JSON.stringify({ savedAdIds }) : undefined
  });

  const result = (await response.json()) as FavoritesResponse;
  if (!response.ok) throw new Error(result.error || 'Could not update saved listings.');
  return result.savedAdIds ?? [];
}

export function getSavedAdIds() {
  return requestFavorites();
}

export function saveAdIds(savedAdIds: string[]) {
  return requestFavorites('PUT', savedAdIds);
}
