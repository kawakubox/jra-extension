export class EntryPageParser {
  getSireElements(): { el: HTMLElement; name: string }[] {
    return Array.from(document.querySelectorAll<HTMLElement>("li.sire")).map((el) => {
      const fullText = el.textContent ?? "";
      const name = fullText.replace(/^父：/, "").trim();
      return { el, name };
    });
  }

  getMaternaSireElements(): { el: HTMLElement; name: string }[] {
    return Array.from(document.querySelectorAll<HTMLElement>("span.bloodmare")).map((el) => {
      const name = (el.textContent ?? "").replace(/^\(母の父：/, "").replace(/\)$/, "").trim();
      return { el, name };
    });
  }
}
