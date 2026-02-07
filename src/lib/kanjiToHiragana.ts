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
    // Configure kuromoji to use dictionary files from public folder
    await kuroshiroInstance.init(
      new KuromojiAnalyzer({ dictPath: "/dict" })
    );
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
 * Non-blocking: Returns original text immediately if not ready
 */
export async function convertToHiragana(text: string): Promise<string> {
  // If not initialized yet, try to initialize but don't wait
  if (!isInitialized && !isInitializing) {
    initKuroshiro().catch(() => {}); // Fire and forget
  }

  // If still not ready, return original text immediately
  if (!isInitialized || !kuroshiroInstance) {
    console.log("⏭️ Kuroshiro未準備 - 元のテキストを使用:", text);
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
