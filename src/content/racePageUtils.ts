export function parseTrackAndDate(): { track: string; date: string } | null {
  const dateEl = document.querySelector("div.cell.date");
  if (!dateEl) {
    console.log("[moist] div.cell.date not found");
    return null;
  }
  const text = dateEl.textContent ?? "";
  console.log("[moist] div.cell.date text:", text);
  // "2026年7月4日（土曜） 2回福島3日"
  const dateMatch = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  const trackMatch = text.match(/\d+回(.+?)\d+日/);
  if (!dateMatch || !trackMatch) {
    console.log("[moist] failed to parse track/date from:", text);
    return null;
  }
  const year = dateMatch[1];
  const month = dateMatch[2].padStart(2, "0");
  const day = dateMatch[3].padStart(2, "0");
  const result = { track: trackMatch[1], date: `${year}-${month}-${day}` };
  console.log("[moist] parsed track/date:", result);
  return result;
}
