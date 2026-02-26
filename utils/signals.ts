import { signal } from "@preact/signals";

export const activeSection = signal("hero");
export const isClassifying = signal(false);
export const classificationResult = signal<{ species: string; confidence: number } | null>(null);
export const isSoundEnabled = signal(false);
export const highlightedMz = signal<number | null>(null);
export const depth = signal(0);
export const mousePos = signal({ x: 0, y: 0 });
export const lastSonarPing = signal<{ x: number; y: number; timestamp: number } | null>(null);
