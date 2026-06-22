function insertCumulativeLapTime(): void {
  const timeSection = Array.from(document.querySelectorAll("div.main")).find(
    (el) => el.textContent?.trim() === "タイム"
  );
  if (!timeSection) return;

  const table = timeSection.closest("table");
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tr"));
  const lapRow = rows.find((row) => row.cells[0]?.textContent?.trim() === "ハロンタイム");
  if (!lapRow) return;

  const lapText = lapRow.cells[1]?.textContent?.trim() ?? "";
  const laps = lapText.split("-").map((s) => parseFloat(s.trim()));
  if (laps.some(isNaN)) return;

  const cumulative = laps.reduce<number[]>((acc, lap) => {
    const prev = acc[acc.length - 1] ?? 0;
    return [...acc, Math.round((prev + lap) * 10) / 10];
  }, []);

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <th scope="row">累計タイム</th>
    <td>${cumulative.map((t) => t.toFixed(1)).join(" - ")}</td>
  `;
  newRow.className = lapRow.className;

  lapRow.insertAdjacentElement("afterend", newRow);
}

insertCumulativeLapTime();
