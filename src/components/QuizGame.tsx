"use client";

import { useQuizGame } from "@/hooks/useQuizGame";
import Header from "./Header";
import GradeSelector from "./GradeSelector";
import QuizSetup from "./QuizSetup";
import ProgressBar from "./ProgressBar";
import ScoreBoard from "./ScoreBoard";
import QuestionCard from "./QuestionCard";
import AnswerInput from "./AnswerInput";
import FeedbackOverlay from "./FeedbackOverlay";
import ResultScreen from "./ResultScreen";

export default function QuizGame() {
  const { state, selectGrade, startQuiz, submitAnswer, dismissFeedback, reset } =
    useQuizGame();

  // Don't initialize kuroshiro here - it blocks the UI
  // Initialize it lazily when voice input is first used

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-lg mx-auto px-4 pb-12">
        <Header />

        {state.phase === "select" && (
          <GradeSelector onSelect={selectGrade} />
        )}

        {state.phase === "setup" && (
          <QuizSetup onStart={startQuiz} />
        )}

        {state.phase === "playing" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <ProgressBar
                  current={state.currentIndex + 1}
                  total={state.totalQuestions}
                />
              </div>
              <ScoreBoard
                score={state.score}
                current={state.currentIndex + (state.showFeedback ? 1 : 0)}
              />
            </div>

            <QuestionCard
              entry={state.questions[state.currentIndex].entry}
            />

            <AnswerInput
              onSubmit={submitAnswer}
              disabled={state.showFeedback}
            />

            {state.showFeedback && (
              <FeedbackOverlay
                isCorrect={state.questions[state.currentIndex].isCorrect!}
                entry={state.questions[state.currentIndex].entry}
                userAnswer={state.questions[state.currentIndex].userAnswer}
                onDismiss={dismissFeedback}
              />
            )}
          </div>
        )}

        {state.phase === "finished" && (
          <ResultScreen
            score={state.score}
            total={state.totalQuestions}
            questions={state.questions}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
