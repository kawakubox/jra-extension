import "./bloodline.css";
import siresData from "../data/sires.json";
import { EntryPageParser } from "./EntryPageParser";

const sires: Record<string, string> = siresData;

function getBloodlineClass(sireName: string): string | null {
  const bloodline = sires[sireName];
  if (!bloodline) return null;
  return `bloodline-${bloodline}`;
}

export function colorizeBloodlines(): void {
  const parser = new EntryPageParser();

  for (const { el, name } of parser.getSireElements()) {
    const cls = getBloodlineClass(name);
    if (cls) el.classList.add(cls);
  }

  for (const { el, name } of parser.getMaternaSireElements()) {
    const cls = getBloodlineClass(name);
    if (cls) el.classList.add(cls);
  }
}
