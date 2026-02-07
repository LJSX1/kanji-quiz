"use client";

import { useReducer, useCallback } from "react";
import { GameState, GameAction, Grade } from "@/lib/types";
import { getKanjiByGrade } from "@/data";
import { pickQuestions, checkAnswer } from "@/lib/quiz-utils";

const initialState: GameState = {
  phase: "select",
  grade: null,
  totalQuestions: 0,
  questions: [],
  currentIndex: 0,
  score: 0,
  showFeedback: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT_GRADE":
      return {
        ...state,
        phase: "setup",
        grade: action.grade,
      };

    case "START_QUIZ": {
      const pool = getKanjiByGrade(state.grade!);
      const questions = pickQuestions(pool, action.count);
      return {
        ...state,
        phase: "playing",
        totalQuestions: action.count,
        questions,
        currentIndex: 0,
        score: 0,
        showFeedback: false,
      };
    }

    case "SUBMIT_ANSWER": {
      const current = state.questions[state.currentIndex];
      const isCorrect = checkAnswer(current.entry, action.answer);
      const updatedQuestions = [...state.questions];
      updatedQuestions[state.currentIndex] = {
        ...current,
        userAnswer: action.answer,
        isCorrect,
      };
      return {
        ...state,
        questions: updatedQuestions,
        score: isCorrect ? state.score + 1 : state.score,
        showFeedback: true,
      };
    }

    case "DISMISS_FEEDBACK": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.totalQuestions) {
        return {
          ...state,
          phase: "finished",
          showFeedback: false,
        };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        showFeedback: false,
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function useQuizGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const selectGrade = useCallback(
    (grade: Grade) => dispatch({ type: "SELECT_GRADE", grade }),
    []
  );

  const startQuiz = useCallback(
    (count: number) => dispatch({ type: "START_QUIZ", count }),
    []
  );

  const submitAnswer = useCallback(
    (answer: string) => dispatch({ type: "SUBMIT_ANSWER", answer }),
    []
  );

  const dismissFeedback = useCallback(
    () => dispatch({ type: "DISMISS_FEEDBACK" }),
    []
  );

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return {
    state,
    selectGrade,
    startQuiz,
    submitAnswer,
    dismissFeedback,
    reset,
  };
}
