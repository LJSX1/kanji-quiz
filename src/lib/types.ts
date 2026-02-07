export interface KanjiEntry {
  id: string;
  kanji: string;
  readings: string[];
  meaning: string;
  example: string;
  grade: 3 | 4;
}

export type Grade = 3 | 4 | "both";

export type Phase = "select" | "setup" | "playing" | "finished";

export interface QuizQuestion {
  entry: KanjiEntry;
  userAnswer: string;
  isCorrect: boolean | null;
}

export interface GameState {
  phase: Phase;
  grade: Grade | null;
  totalQuestions: number;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  showFeedback: boolean;
}

export type GameAction =
  | { type: "SELECT_GRADE"; grade: Grade }
  | { type: "START_QUIZ"; count: number }
  | { type: "SUBMIT_ANSWER"; answer: string }
  | { type: "DISMISS_FEEDBACK" }
  | { type: "RESET" };
