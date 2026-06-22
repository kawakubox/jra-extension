export class ResultPageParser {
  private lapRow: HTMLTableRowElement | null;
  private laps: number[];
  private distance: number | null;

  constructor() {
    this.lapRow = this.findLapRow();
    this.laps = this.parseLaps();
    this.distance = this.parseDistance();
  }

  private findLapRow(): HTMLTableRowElement | null {
    const timeSection = Array.from(document.querySelectorAll("div.main")).find(
      (el) => el.textContent?.trim() === "タイム"
    );
    if (!timeSection) return null;

    const table = timeSection.closest("table");
    if (!table) return null;

    const rows = Array.from(table.querySelectorAll("tr"));
    return (rows.find((row) => row.cells[0]?.textContent?.trim() === "ハロンタイム") ?? null) as HTMLTableRowElement | null;
  }

  private parseLaps(): number[] {
    const text = this.lapRow?.cells[1]?.textContent?.trim() ?? "";
    const laps = text.split("-").map((s) => parseFloat(s.trim()));
    return laps.some(isNaN) ? [] : laps;
  }

  private parseDistance(): number | null {
    const courseEl = document.querySelector("div.cell.course");
    if (!courseEl) return null;
    const unitEl = courseEl.querySelector("span.unit");
    if (!unitEl) return null;
    const textNode = unitEl.previousSibling;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null;
    const distance = parseInt(textNode.textContent?.replace(/,/g, "") ?? "", 10);
    return isNaN(distance) ? null : distance;
  }

  getLapRow(): HTMLTableRowElement | null {
    return this.lapRow;
  }

  getLaps(): number[] {
    return this.laps;
  }

  getDistance(): number | null {
    return this.distance;
  }

  getCumulative(): number[] {
    return this.laps.reduce<number[]>((acc, lap) => {
      const prev = acc[acc.length - 1] ?? 0;
      return [...acc, Math.round((prev + lap) * 10) / 10];
    }, []);
  }

  getStart3F(): number | null {
    if (this.laps.length < 3 || this.distance === null) return null;
    const firstSection = this.distance % 200 === 0 ? 200 : this.distance % 200;
    const remainder = 200 - firstSection;
    const base = this.laps[0] + this.laps[1] + this.laps[2];
    if (remainder === 0) {
      return Math.round(base * 10) / 10;
    }
    if (this.laps.length < 4) return null;
    return Math.round((base + this.laps[3] * (remainder / 200)) * 10) / 10;
  }
}
