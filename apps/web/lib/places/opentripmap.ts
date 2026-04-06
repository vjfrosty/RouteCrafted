// OpenTripMap POI enrichment — optional (requires OPENTRIPMAP_KEY env var)
// If key is absent, all functions return null without throwing.

interface OtmSearchResult {
  xid: string;
  name: string;
  dist: number;
  kinds: string;
  point: { lon: number; lat: number };
}

interface OtmDetail {
  name: string;
  kinds: string;
  preview?: { source?: string };
  image?: string | { url?: string };
  point?: { lon: number; lat: number };
}

export interface PoiInfo {
  category: string;
  lat: number;
  lon: number;
  imageUrl?: string;
}

function normalizeCategory(kinds: string): string {
  const k = kinds.split(",")[0].toLowerCase();
  if (k.includes("museum")) return "museum";
  if (k.includes("restaurant") || k.includes("food")) return "restaurant";
  if (k.includes("park") || k.includes("garden")) return "park";
  if (k.includes("church") || k.includes("cathedral") || k.includes("religion"))
    return "religious_site";
  if (k.includes("castle") || k.includes("fort")) return "historic";
  if (k.includes("beach") || k.includes("lake")) return "nature";
  if (k.includes("shop") || k.includes("market")) return "shopping";
  return "attraction";
}

/**
 * Search for a POI by name near trip coordinates.
 * Returns enrichment data or null if unavailable.
 */
export async function searchPoi(
  name: string,
  tripLat: number,
  tripLon: number,
): Promise<PoiInfo | null> {
  const key = process.env.OPENTRIPMAP_KEY;
  if (!key) return null;

  try {
    // Search by name near the trip's coordinates
    const searchUrl =
      `https://api.opentripmap.com/0.1/en/places/autosuggest` +
      `?name=${encodeURIComponent(name)}` +
      `&radius=10000&lon=${tripLon}&lat=${tripLat}` +
      `&limit=1&format=json&apikey=${key}`;

    const res = await fetch(searchUrl, {
      next: { revalidate: 86400 }, // cache POI for 24h
    });
    if (!res.ok) return null;

    const results: OtmSearchResult[] = await res.json();
    const top = results?.[0];
    if (!top?.xid) return null;

    // Fetch detail for image + authoritative coords
    const detailUrl = `https://api.opentripmap.com/0.1/en/places/xid/${top.xid}?apikey=${key}`;
    const detailRes = await fetch(detailUrl, {
      next: { revalidate: 86400 },
    });
    if (!detailRes.ok) {
      return {
        category: normalizeCategory(top.kinds),
        lat: top.point.lat,
        lon: top.point.lon,
      };
    }

    const detail: OtmDetail = await detailRes.json();

    let imageUrl: string | undefined;
    if (typeof detail.preview?.source === "string") {
      imageUrl = detail.preview.source;
    } else if (typeof detail.image === "string") {
      imageUrl = detail.image;
    } else if (typeof (detail.image as { url?: string })?.url === "string") {
      imageUrl = (detail.image as { url: string }).url;
    }

    return {
      category: normalizeCategory(detail.kinds ?? top.kinds),
      lat: detail.point?.lat ?? top.point.lat,
      lon: detail.point?.lon ?? top.point.lon,
      imageUrl,
    };
  } catch {
    return null;
  }
}
