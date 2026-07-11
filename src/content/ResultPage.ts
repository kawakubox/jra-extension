import { ResultPageParser } from "./ResultPageParser";
import { CourseConditionComponent } from "./CourseConditionComponent";
import { RaceTimeComponent } from "./RaceTimeComponent";
import { parseTrackAndDate } from "./racePageUtils";

export class ResultPage {
  private raceTime: RaceTimeComponent;
  private courseCondition: CourseConditionComponent | null;

  constructor() {
    const parser = new ResultPageParser();
    this.raceTime = new RaceTimeComponent(parser);
    const info = parseTrackAndDate();
    this.courseCondition = info ? new CourseConditionComponent(info.track, info.date) : null;
  }

  async render(): Promise<void> {
    await this.raceTime.render();
    await this.courseCondition?.render();
  }
}
