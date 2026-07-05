import { ResultPageParser } from "./ResultPageParser";
import { CourseConditionComponent } from "./CourseConditionComponent";
import { parseTrackAndDate } from "./racePageUtils";

export class ResultPage {
  private parser: ResultPageParser;
  private courseCondition: CourseConditionComponent | null;

  constructor() {
    this.parser = new ResultPageParser();
    const info = parseTrackAndDate();
    this.courseCondition = info ? new CourseConditionComponent(info.track, info.date) : null;
  }

  async render(): Promise<void> {
    this.insertLapRows();
    await this.courseCondition?.render();
  }

  private insertLapRows(): void {
    const lapRow = this.parser.getLapRow();
    if (!lapRow) return;

    const cumulative = this.parser.getCumulative();
    if (cumulative.length === 0) return;

    const cumulativeRow = document.createElement("tr");
    cumulativeRow.className = lapRow.className;
    cumulativeRow.innerHTML = `
      <th scope="row">累計タイム</th>
      <td>${cumulative.map((t) => t.toFixed(1)).join(" - ")}</td>
    `;
    lapRow.insertAdjacentElement("afterend", cumulativeRow);

    const start3F = this.parser.getStart3F();
    if (start3F !== null) {
      const start3FRow = document.createElement("tr");
      start3FRow.className = lapRow.className;
      start3FRow.innerHTML = `
        <th scope="row">テン3F</th>
        <td>${start3F.toFixed(1)}</td>
      `;
      cumulativeRow.insertAdjacentElement("afterend", start3FRow);
    }
  }
}
