"use client";

import { useEffect } from "react";
import { KanjiEntry } from "@/lib/types";

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
            <p className="text-gray-500 text-sm">
              あなたの答え：<span className="text-red-600 font-bold">{userAnswer}</span>
            </p>
            <p className="text-gray-700 text-lg">
              こたえ：
              <span className="text-green-700 font-bold">
                {entry.readings[0]}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
