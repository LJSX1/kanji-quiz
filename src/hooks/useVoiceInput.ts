"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { convertToHiragana, initKuroshiro } from "@/lib/kanjiToHiragana";

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

  // Initialize kuroshiro in the background when voice input hook is used
  // (only runs once, doesn't block UI)
  useEffect(() => {
    if (isSupported) {
      // Use requestIdleCallback if available, otherwise setTimeout
      const initInBackground = () => {
        initKuroshiro().catch((err) => {
          console.warn("Kuroshiro初期化失敗 - 漢字変換なしで動作します:", err);
        });
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(initInBackground);
      } else {
        setTimeout(initInBackground, 1000);
      }
    }
  }, [isSupported]);

  useEffect(() => {
    console.log('🔵 [DEBUG] useVoiceInput useEffect running', { isSupported });

    if (!isSupported) {
      console.log('🔴 [DEBUG] Speech recognition not supported');
      return;
    }

    // Initialize SpeechRecognition
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.error('🔴 [DEBUG] SpeechRecognitionAPI not found');
      return;
    }

    console.log('✅ [DEBUG] Creating SpeechRecognition instance');
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Handle speech recognition result
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('🔵 [DEBUG] onresult fired', event);
      const result = event.results[0];
      if (result.isFinal) {
        const transcriptText = result[0].transcript;
        console.log('🎤 [DEBUG] 音声認識結果 (変換前):', {
          original: transcriptText,
          confidence: result[0].confidence,
          language: recognition.lang,
        });

        // First show the original text immediately (no blocking)
        setTranscript(transcriptText);
        setError(null);
        console.log('✅ [DEBUG] Transcript set:', transcriptText);

        // Then convert kanji to hiragana in the background
        convertToHiragana(transcriptText)
          .then((hiraganaText) => {
            console.log('✅ [DEBUG] ひらがな変換完了:', hiraganaText);
            setTranscript(hiraganaText);
          })
          .catch((err) => {
            console.error('❌ [DEBUG] 変換失敗:', err);
            // Keep original text if conversion fails
          });
      }
    };

    // Add onstart handler for debugging
    recognition.onstart = () => {
      console.log('✅ [DEBUG] Recognition started successfully');
    };

    // Add onaudiostart handler
    recognition.onaudiostart = () => {
      console.log('🎙️ [DEBUG] Audio capture started');
    };

    // Add onspeechstart handler
    recognition.onspeechstart = () => {
      console.log('🗣️ [DEBUG] Speech detected');
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
    console.log('✅ [DEBUG] Recognition stored in ref', {
      hasRecognition: !!recognitionRef.current,
    });

    return () => {
      console.log('🔵 [DEBUG] useVoiceInput cleanup');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    console.log('🔵 [DEBUG] startListening called', {
      hasRecognition: !!recognitionRef.current,
      isListening,
      isSupported,
    });

    if (!recognitionRef.current) {
      console.error('🔴 [DEBUG] recognitionRef.current is null!');
      setError("音声認識が初期化されていません");
      return;
    }

    if (isListening) {
      console.log('🟡 [DEBUG] Already listening, returning');
      return;
    }

    setError(null);
    setTranscript("");

    try {
      console.log('🎤 [DEBUG] 音声認識開始:', {
        language: recognitionRef.current.lang,
        continuous: recognitionRef.current.continuous,
        interimResults: recognitionRef.current.interimResults,
      });
      recognitionRef.current.start();
      console.log('✅ [DEBUG] recognition.start() called successfully');
      setIsListening(true);
    } catch (err) {
      console.error('🔴 [DEBUG] 音声認識エラー:', err);
      setError("音声認識を開始できませんでした: " + (err as Error).message);
      setIsListening(false);
    }
  }, [isListening, isSupported]);

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
