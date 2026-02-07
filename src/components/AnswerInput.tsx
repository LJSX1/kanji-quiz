"use client";

import { useState, useRef, FormEvent, useCallback } from "react";

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export default function AnswerInput({ onSubmit, disabled }: AnswerInputProps) {
  const [value, setValue] = useState("");
  const [composing, setComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (composing || disabled || !value.trim()) return;
      onSubmit(value.trim());
      setValue("");
    },
    [composing, disabled, value, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-6">
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
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-amber-500 text-white font-bold text-lg px-6 py-3 rounded-xl hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        こたえる
      </button>
    </form>
  );
}
