import { QuizQuestion } from "@/lib/types";

interface ResultScreenProps {
  score: number;
  total: number;
  questions: QuizQuestion[];
  onReset: () => void;
}

function getResultMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return "パーフェクト！すごい！";
  if (pct >= 0.8) return "とてもよくできました！";
  if (pct >= 0.6) return "よくがんばりました！";
  if (pct >= 0.4) return "もうすこし！";
  return "つぎはもっとできるよ！";
}

function getResultEmoji(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return "🏆";
  if (pct >= 0.8) return "🎉";
  if (pct >= 0.6) return "😊";
  if (pct >= 0.4) return "💪";
  return "📚";
}

export default function ResultScreen({
  score,
  total,
  questions,
  onReset,
}: ResultScreenProps) {
  const wrong = questions.filter((q) => !q.isCorrect);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
        <p className="text-5xl mb-4">{getResultEmoji(score, total)}</p>
        <p className="text-3xl font-bold text-amber-800 mb-2">
          {score} / {total} せいかい
        </p>
        <p className="text-xl text-amber-600">
          {getResultMessage(score, total)}
        </p>
      </div>

      {wrong.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
          <h3 className="text-lg font-bold text-red-600 mb-4">
            まちがえたもんだい
          </h3>
          <ul className="space-y-3">
            {wrong.map((q) => (
              <li
                key={q.entry.id}
                className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3"
              >
                <span className="text-2xl font-bold text-gray-800">
                  {q.entry.kanji}
                </span>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    あなた：<span className="text-red-600">{q.userAnswer}</span>
                  </p>
                  <p className="text-sm font-bold text-green-700">
                    こたえ：{q.entry.readings[0]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onReset}
        className="bg-amber-500 text-white font-bold text-xl py-4 px-10 rounded-2xl shadow-md hover:bg-amber-600 active:scale-95 transition-all"
      >
        もういちど
      </button>
    </div>
  );
}
