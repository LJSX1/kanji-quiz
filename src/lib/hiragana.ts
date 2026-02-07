/** Convert katakana to hiragana */
function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/** Convert fullwidth alphanumeric to halfwidth */
function fullwidthToHalfwidth(str: string): string {
  return str.replace(/[\uFF01-\uFF5E]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
}

/** Normalize an answer string for comparison */
export function normalizeReading(input: string): string {
  let s = input.trim();
  s = katakanaToHiragana(s);
  s = fullwidthToHalfwidth(s);
  // Remove spaces and middot
  s = s.replace(/[\s\u3000・]/g, "");
  return s;
}
