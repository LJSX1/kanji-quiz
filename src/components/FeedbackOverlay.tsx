"use client";

import { useEffect, useState } from "react";
import { KanjiEntry } from "@/lib/types";
import { normalizeReading } from "@/lib/hiragana";

interface FeedbackOverlayProps {
  isCorrect: boolean;
  entry: KanjiEntry;
  userAnswer: string;
  onDismiss: () => void;
}

export default function FeedbackOverlay({
  isCorrect,
  entry,
  userAnswer,
  onDismiss,
}: FeedbackOverlayProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(onDismiss, 1500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onDismiss}
    >
      <div
        className={`rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4 animate-pop-in ${
          isCorrect ? "bg-green-50 border-4 border-green-400" : "bg-red-50 border-4 border-red-400"
        }`}
      >
        <p className="text-5xl mb-4">{isCorrect ? "⭕" : "❌"}</p>
        <p
          className={`text-2xl font-bold mb-2 ${
            isCorrect ? "text-green-700" : "text-red-700"
          }`}
        >
          {isCorrect ? "せいかい！" : "ざんねん…"}
        </p>
        {!isCorrect && (
          <div className="mt-3 space-y-1">
            {!showAnswer ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnswer(true);
                }}
                className="bg-amber-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-amber-600 active:scale-95 transition-all"
              >
                こたえを見る
              </button>
            ) : (
              <div className="animate-fade-in space-y-2">
                <div>
                  <p className="text-gray-500 text-sm">あなたの答え：</p>
                  <p className="text-red-600 font-bold text-lg">{userAnswer}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    (正規化: {normalizeReading(userAnswer)})
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm">こたえ：</p>
                  <p className="text-green-700 font-bold text-lg">
                    {entry.readings[0]}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    (正規化: {normalizeReading(entry.readings[0])})
                  </p>
                </div>
                {entry.readings.length > 1 && (
                  <p className="text-gray-500 text-xs">
                    他の読み: {entry.readings.slice(1).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
