import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

let kuroshiroInstance: Kuroshiro | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Initialize Kuroshiro instance (call this once)
 */
async function initKuroshiro(): Promise<void> {
  if (kuroshiroInstance) return;

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    kuroshiroInstance = new Kuroshiro();
    await kuroshiroInstance.init(new KuromojiAnalyzer());
  })();

  await initPromise;
}

/**
 * Convert any Japanese text (kanji/katakana/mixed) to hiragana
 */
export async function convertToHiragana(text: string): Promise<string> {
  try {
    await initKuroshiro();

    if (!kuroshiroInstance) {
      console.error("Kuroshiro not initialized");
      return text;
    }

    const result = await kuroshiroInstance.convert(text, {
      to: "hiragana",
      mode: "normal",
    });

    console.log("🔄 漢字→ひらがな変換:", { input: text, output: result });

    return result;
  } catch (error) {
    console.error("Kanji to hiragana conversion error:", error);
    return text; // Return original text if conversion fails
  }
}
