import { fetchMoistMap } from "./moistRepository";

export class MoistureComponent {
  private track: string;
  private date: string;

  constructor(track: string, date: string) {
    this.track = track;
    this.date = date;
  }

  async render(): Promise<void> {
    console.log("[moist] MoistureComponent.render() track:", this.track, "date:", this.date);

    const babaEl = document.querySelector("div.cell.baba");
    if (!babaEl) {
      console.log("[moist] div.cell.baba not found, skipping");
      return;
    }
    const turfLi = babaEl.querySelector("li.turf");
    // JRAサイト側の表記ゆれで dirt ではなく durt というクラス名になっている
    const dirtLi = babaEl.querySelector("li.durt");
    const surfaceLi = turfLi ?? dirtLi;
    if (!surfaceLi) {
      console.log("[moist] neither li.turf nor li.durt found, skipping");
      return;
    }
    const surface = turfLi ? "turf" : "dirt";
    console.log("[moist] surface:", surface);

    const map = await fetchMoistMap();
    const entry = map[this.track]?.[this.date];
    if (!entry) {
      console.log(
        "[moist] no entry for track/date:",
        this.track,
        this.date,
        "available dates for track:",
        map[this.track] ? Object.keys(map[this.track]) : "(track not in map)",
      );
      return;
    }
    console.log("[moist] found entry:", entry);

    const values = entry[surface];
    const anchor = babaEl.querySelector("li.cushion") ?? surfaceLi;
    const li = document.createElement("li");
    li.className = "moist";
    li.innerHTML = `<span class="inner"><span class="cap">含水率</span><span class="txt">G前 : ${values.mg.toFixed(1)} / 4C : ${values.m4c.toFixed(1)}</span></span>`;
    anchor.insertAdjacentElement("afterend", li);
    console.log("[moist] inserted li.moist after", anchor.className);
  }
}
