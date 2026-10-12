import { AdItem } from '../types';

export type NewAdInput = Pick<AdItem,
  'title' | 'description' | 'price' | 'isNegotiable' | 'categoryId' |
  'subcategory' | 'images' | 'location' | 'condition' | 'urgent' | 'specs'
>;

interface AdsResponse {
  ads?: AdItem[];
  ad?: AdItem;
  error?: string;
}

async function request(path: string, method = 'GET', body?: unknown) {
  const response = await fetch(`/api/ads${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 204) return null;
  const result = (await response.json()) as AdsResponse;
  if (!response.ok) throw new Error(result.error || 'Could not load listings.');
  return result;
}

export async function getAds() {
  const result = await request('');
  return result?.ads ?? [];
}

export async function createAd(ad: NewAdInput) {
  const result = await request('', 'POST', ad);
  if (!result?.ad) throw new Error('The listing was not returned by the server.');
  return result.ad;
}

export async function updateAd(adId: string, changes: { price?: number; status?: AdItem['status'] }) {
  const result = await request(`/${encodeURIComponent(adId)}`, 'PATCH', changes);
  if (!result?.ad) throw new Error('The updated listing was not returned by the server.');
  return result.ad;
}

export async function deleteAd(adId: string) {
  await request(`/${encodeURIComponent(adId)}`, 'DELETE');
}
