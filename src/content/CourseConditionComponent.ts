import { fetchCushionMap } from "./cushionRepository";

export class CourseConditionComponent {
  private track: string;
  private date: string;

  constructor(track: string, date: string) {
    this.track = track;
    this.date = date;
  }

  async render(): Promise<void> {
    const turfLi = document.querySelector("div.cell.baba li.turf");
    if (!turfLi) return;

    const map = await fetchCushionMap();
    const value = map[this.track]?.[this.date];
    if (value === undefined) return;

    const li = document.createElement("li");
    li.className = "cushion";
    li.innerHTML = `<span class="inner"><span class="cap">C値</span><span class="txt">${value.toFixed(1)}</span></span>`;
    turfLi.insertAdjacentElement("afterend", li);
  }
}
