import { signal } from "@preact/signals";

export const activeSection = signal("hero");
export const isClassifying = signal(false);
export const classificationResult = signal<{ species: string; confidence: number } | null>(null);
export const isSoundEnabled = signal(false);
