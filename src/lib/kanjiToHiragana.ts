import { toHiragana } from "wanakana";

/**
 * Convert katakana to hiragana (lightweight, synchronous)
 * Note: This does not convert kanji. For kanji conversion, the speech
 * recognition result is shown to the user before submission.
 */
export function convertToHiragana(text: string): string {
  // Use wanakana to convert any katakana to hiragana
  const result = toHiragana(text);
  console.log("🔄 カタカナ→ひらがな変換:", { input: text, output: result });
  return result;
}
