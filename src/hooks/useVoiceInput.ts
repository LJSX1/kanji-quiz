"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { convertToHiragana } from "@/lib/kanjiToHiragana";

interface UseVoiceInputReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Browser compatibility check
const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
};

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    if (!isSupported) return;

    // Initialize SpeechRecognition
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Handle speech recognition result
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0];
      if (result.isFinal) {
        const transcriptText = result[0].transcript;
        console.log('🎤 音声認識結果:', {
          original: transcriptText,
          confidence: result[0].confidence,
          language: recognition.lang,
        });

        // Convert katakana to hiragana (synchronous, lightweight)
        const hiraganaText = convertToHiragana(transcriptText);

        setTranscript(hiraganaText);
        setError(null);
      }
    };

    // Handle errors
    recognition.onerror = (event: any) => {
      setIsListening(false);

      switch (event.error) {
        case "not-allowed":
          setError("マイクのアクセス許可が必要です");
          break;
        case "no-speech":
          setError("音声が検出されませんでした");
          break;
        case "network":
          setError("インターネット接続を確認してください");
          break;
        case "aborted":
          // User stopped, not an error
          setError(null);
          break;
        default:
          setError("音声認識エラーが発生しました");
      }
    };

    // Handle end of recognition
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setError(null);
    setTranscript("");

    try {
      console.log('🎤 音声認識開始:', {
        language: recognitionRef.current.lang,
        continuous: recognitionRef.current.continuous,
        interimResults: recognitionRef.current.interimResults,
      });
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error('音声認識エラー:', err);
      setError("音声認識を開始できませんでした");
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      // Ignore errors when stopping
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
