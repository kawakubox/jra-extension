const TSV_URL =
  "https://raw.githubusercontent.com/kawakubox/jra-extension/main/data/cushion.tsv";
const CACHE_KEY = "cushionData";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CushionMap = Record<string, Record<string, number>>;

function parseTsv(tsv: string): CushionMap {
  const map: CushionMap = {};
  const lines = tsv.trim().split("\n").slice(1);
  for (const line of lines) {
    const [track, measurement_date, , , cushion_value] = line.split("\t");
    if (!track || !measurement_date) continue;
    const value = parseFloat(cushion_value);
    if (isNaN(value)) continue;
    if (!map[track]) map[track] = {};
    map[track][measurement_date] = value;
  }
  return map;
}

export async function fetchCushionMap(): Promise<CushionMap> {
  const cached = await chrome.storage.local.get(CACHE_KEY);
  const entry = cached[CACHE_KEY];
  if (entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS) {
    return entry.data;
  }
  const res = await fetch(TSV_URL);
  const tsv = await res.text();
  const data = parseTsv(tsv);
  await chrome.storage.local.set({ [CACHE_KEY]: { fetchedAt: Date.now(), data } });
  return data;
}

