import { KanjiEntry } from "@/lib/types";

interface QuestionCardProps {
  entry: KanjiEntry;
}

export default function QuestionCard({ entry }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <p className="text-7xl font-bold text-gray-800 mb-6 tracking-wider">
        {entry.kanji}
      </p>
      <p className="text-lg text-amber-700 mb-2">
        💡 {entry.meaning}
      </p>
      <p className="text-base text-gray-500">
        📖 {entry.example}
      </p>
    </div>
  );
}
