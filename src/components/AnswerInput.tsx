"use client";

import { useState, useRef, FormEvent, useCallback, useEffect } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

type InputMode = "text" | "voice";

export default function AnswerInput({ onSubmit, disabled }: AnswerInputProps) {
  const [value, setValue] = useState("");
  const [composing, setComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice input hook
  const {
    isSupported: isVoiceSupported,
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  // Input mode state with localStorage persistence
  const [inputMode, setInputMode] = useState<InputMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kanji-quiz-input-mode");
      return (saved as InputMode) || "text";
    }
    return "text";
  });

  // Save input mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kanji-quiz-input-mode", inputMode);
    }
  }, [inputMode]);

  // Auto-submit when voice transcript is ready (with a small delay to show the transcript)
  useEffect(() => {
    if (transcript && inputMode === "voice" && !disabled) {
      // Show the transcript for 1 second before submitting
      const timer = setTimeout(() => {
        onSubmit(transcript);
        resetTranscript();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [transcript, inputMode, disabled, onSubmit, resetTranscript]);

  // Stop listening when disabled
  useEffect(() => {
    if (disabled && isListening) {
      stopListening();
    }
  }, [disabled, isListening, stopListening]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (composing || disabled || !value.trim()) return;
      onSubmit(value.trim());
      setValue("");
    },
    [composing, disabled, value, onSubmit]
  );

  const handleVoiceClick = useCallback(() => {
    if (disabled) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [disabled, isListening, startListening, stopListening]);

  const handleModeToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    }
    setInputMode((prev) => (prev === "text" ? "voice" : "text"));
    setValue("");
    resetTranscript();
  }, [isListening, stopListening, resetTranscript]);

  return (
    <div className="mt-6 space-y-2">
      {/* Voice error display */}
      {voiceError && inputMode === "voice" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {voiceError}
        </div>
      )}

      {/* Voice transcript display */}
      {transcript && inputMode === "voice" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg animate-fade-in">
          <div className="text-sm text-blue-600 mb-1">認識された言葉：</div>
          <div className="text-2xl font-bold">{transcript}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        {inputMode === "text" ? (
          // Text input mode
          <input
            ref={inputRef}
            type="text"
            lang="ja"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            disabled={disabled}
            placeholder="ひらがなで入力"
            className="flex-1 text-xl px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white text-gray-800 placeholder:text-gray-400"
            autoFocus
          />
        ) : (
          // Voice input mode
          <button
            type="button"
            onClick={handleVoiceClick}
            disabled={disabled}
            className={`flex-1 text-xl px-4 py-3 border-2 rounded-xl font-bold transition-all ${
              isListening
                ? "bg-red-500 text-white border-red-600 animate-pulse"
                : "bg-white text-gray-800 border-amber-300 hover:border-amber-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <span className="flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                聞いています...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🎤 タップして話す
              </span>
            )}
          </button>
        )}

        {/* Mode toggle button (only show if voice is supported) */}
        {isVoiceSupported && (
          <button
            type="button"
            onClick={handleModeToggle}
            disabled={disabled}
            className="bg-gray-100 text-gray-700 font-bold text-lg px-4 py-3 rounded-xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={inputMode === "text" ? "音声入力に切り替え" : "テキスト入力に切り替え"}
          >
            {inputMode === "text" ? "🎤" : "⌨️"}
          </button>
        )}

        {/* Submit button (only for text mode) */}
        {inputMode === "text" && (
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="bg-amber-500 text-white font-bold text-lg px-6 py-3 rounded-xl hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            こたえる
          </button>
        )}
      </form>
    </div>
  );
}
