import { readFileSync, writeFileSync } from "node:fs";
import iconv from "iconv-lite";

const SOURCE_URL = "https://www.jra.go.jp/keiba/baba/_data_moist.html";
const TSV_PATH = new URL("../data/moist.tsv", import.meta.url);

function resolveYear(month, day, now) {
  let year = now.getUTCFullYear();
  const candidate = Date.UTC(year, month - 1, day);
  if (candidate - now.getTime() > 3 * 24 * 60 * 60 * 1000) year -= 1;
  return year;
}

function parseScrapedHtml(html, now) {
  const rows = [];
  const blockPattern = /<div id="(rc\w+)" title="([^"]+)">([\s\S]*?)<!--\s*\/\[#\1\]\s*-->/g;
  const unitPattern =
    /<div class="unit">\s*<div class="time">(\d+)月(\d+)日（(.)曜）(\d+)時(\d+)分<\/div>\s*<div class="turf">\s*<span class="mg"[^>]*>([\d.]+)<\/span>\s*<span class="m4c"[^>]*>([\d.]+)<\/span>\s*<\/div>\s*<div class="dirt">\s*<span class="mg"[^>]*>([\d.]+)<\/span>\s*<span class="m4c"[^>]*>([\d.]+)<\/span>\s*<\/div>/g;

  let blockMatch;
  while ((blockMatch = blockPattern.exec(html))) {
    const track = blockMatch[2];
    const body = blockMatch[3];
    let unitMatch;
    while ((unitMatch = unitPattern.exec(body))) {
      const [, month, day, weekday, hour, minute, turfMg, turfM4c, dirtMg, dirtM4c] = unitMatch;
      const year = resolveYear(Number(month), Number(day), now);
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      rows.push({
        track,
        date,
        weekday,
        time: `${Number(hour)}:${minute}`,
        turfMg,
        turfM4c,
        dirtMg,
        dirtM4c,
      });
    }
  }
  return rows;
}

function loadExisting() {
  const text = readFileSync(TSV_PATH, "utf-8");
  const lines = text.trim().split("\n");
  const header = lines[0];
  const trackOrder = [];
  const byTrack = new Map();
  for (const line of lines.slice(1)) {
    const [track, date, weekday, time, turfMg, turfM4c, dirtMg, dirtM4c] = line.split("\t");
    if (!byTrack.has(track)) {
      byTrack.set(track, new Map());
      trackOrder.push(track);
    }
    byTrack.get(track).set(date, { weekday, time, turfMg, turfM4c, dirtMg, dirtM4c });
  }
  return { header, trackOrder, byTrack };
}

function upsert({ trackOrder, byTrack }, scraped) {
  for (const { track, date, weekday, time, turfMg, turfM4c, dirtMg, dirtM4c } of scraped) {
    if (!byTrack.has(track)) {
      byTrack.set(track, new Map());
      trackOrder.push(track);
    }
    byTrack.get(track).set(date, { weekday, time, turfMg, turfM4c, dirtMg, dirtM4c });
  }
}

function serialize({ header, trackOrder, byTrack }) {
  const lines = [header];
  for (const track of trackOrder) {
    const dates = [...byTrack.get(track).keys()].sort();
    for (const date of dates) {
      const { weekday, time, turfMg, turfM4c, dirtMg, dirtM4c } = byTrack.get(track).get(date);
      lines.push([track, date, weekday, time, turfMg, turfM4c, dirtMg, dirtM4c].join("\t"));
    }
  }
  return lines.join("\n") + "\n";
}

async function main() {
  const res = await fetch(SOURCE_URL);
  const buf = Buffer.from(await res.arrayBuffer());
  const html = iconv.decode(buf, "Shift_JIS");

  const now = new Date();
  const scraped = parseScrapedHtml(html, now);
  if (scraped.length === 0) {
    throw new Error("No moisture data parsed from source page");
  }

  const existing = loadExisting();
  upsert(existing, scraped);
  const output = serialize(existing);
  writeFileSync(TSV_PATH, output);
}

main();
