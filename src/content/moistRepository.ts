const TSV_URL =
  "https://raw.githubusercontent.com/kawakubox/jra-extension/main/data/moist.tsv";
const CACHE_KEY = "moistData";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type SurfaceMoisture = { mg: number; m4c: number };
type MoistMap = Record<string, Record<string, { turf: SurfaceMoisture; dirt: SurfaceMoisture }>>;

function parseTsv(tsv: string): MoistMap {
  const map: MoistMap = {};
  const lines = tsv.trim().split("\n").slice(1);
  for (const line of lines) {
    const [track, measurement_date, , , turfMg, turfM4c, dirtMg, dirtM4c] = line.split("\t");
    if (!track || !measurement_date) continue;
    const turf = { mg: parseFloat(turfMg), m4c: parseFloat(turfM4c) };
    const dirt = { mg: parseFloat(dirtMg), m4c: parseFloat(dirtM4c) };
    if (isNaN(turf.mg) || isNaN(turf.m4c) || isNaN(dirt.mg) || isNaN(dirt.m4c)) continue;
    if (!map[track]) map[track] = {};
    map[track][measurement_date] = { turf, dirt };
  }
  return map;
}

export async function fetchMoistMap(): Promise<MoistMap> {
  const cached = await chrome.storage.local.get(CACHE_KEY);
  const entry = cached[CACHE_KEY];
  if (entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS) {
    console.log(
      "[moist] using cached data (age:",
      Math.round((Date.now() - entry.fetchedAt) / 1000 / 60),
      "min), tracks:",
      Object.keys(entry.data),
    );
    return entry.data;
  }
  console.log("[moist] fetching TSV from", TSV_URL);
  const res = await fetch(TSV_URL);
  console.log("[moist] fetch status:", res.status);
  const tsv = await res.text();
  console.log("[moist] TSV length:", tsv.length, "first line:", tsv.split("\n")[0]);
  const data = parseTsv(tsv);
  console.log("[moist] parsed tracks:", Object.keys(data));
  if (!res.ok || Object.keys(data).length === 0) {
    console.log("[moist] fetch failed or empty, not caching");
    return data;
  }
  await chrome.storage.local.set({ [CACHE_KEY]: { fetchedAt: Date.now(), data } });
  return data;
}
