import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

let kuroshiroInstance: Kuroshiro | null = null;
let isInitializing = false;
let isInitialized = false;

/**
 * Initialize Kuroshiro (call this early, ideally on app load)
 */
export async function initKuroshiro(): Promise<void> {
  if (isInitialized || isInitializing) return;

  isInitializing = true;
  try {
    console.log("🔧 Kuroshiro初期化中...");
    kuroshiroInstance = new Kuroshiro();
    await kuroshiroInstance.init(new KuromojiAnalyzer());
    isInitialized = true;
    console.log("✅ Kuroshiro初期化完了");
  } catch (error) {
    console.error("❌ Kuroshiro初期化失敗:", error);
    isInitializing = false;
    throw error;
  }
}

/**
 * Convert kanji/katakana to hiragana
 */
export async function convertToHiragana(text: string): Promise<string> {
  // Ensure kuroshiro is initialized
  if (!isInitialized) {
    await initKuroshiro();
  }

  if (!kuroshiroInstance) {
    console.warn("⚠️ Kuroshiro未初期化 - 元のテキストを返します");
    return text;
  }

  try {
    const result = await kuroshiroInstance.convert(text, {
      to: "hiragana",
      mode: "normal",
    });

    console.log("🔄 変換:", { 入力: text, 出力: result });
    return result;
  } catch (error) {
    console.error("❌ 変換エラー:", error);
    return text;
  }
}

/**
 * Check if kuroshiro is ready
 */
export function isKuroshiroReady(): boolean {
  return isInitialized;
}
