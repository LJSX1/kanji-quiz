import { KanjiEntry, QuizQuestion } from "./types";
import { normalizeReading } from "./hiragana";

/** Fisher-Yates shuffle (returns new array) */
export function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `count` random entries from a pool */
export function pickQuestions(
  pool: KanjiEntry[],
  count: number
): QuizQuestion[] {
  const shuffled = shuffle(pool);
  return shuffled.slice(0, count).map((entry) => ({
    entry,
    userAnswer: "",
    isCorrect: null,
  }));
}

/** Check if the user's answer matches any accepted reading */
export function checkAnswer(entry: KanjiEntry, answer: string): boolean {
  const normalized = normalizeReading(answer);
  return entry.readings.some((r) => normalizeReading(r) === normalized);
}
