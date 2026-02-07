import { Grade } from "@/lib/types";

interface GradeSelectorProps {
  onSelect: (grade: Grade) => void;
}

const options: { label: string; value: Grade }[] = [
  { label: "3年生", value: 3 },
  { label: "4年生", value: 4 },
  { label: "3年生＋4年生", value: "both" },
];

export default function GradeSelector({ onSelect }: GradeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-2xl font-bold text-amber-800">
        学年をえらんでね
      </h2>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onSelect(opt.value)}
            className="bg-white border-2 border-amber-300 text-amber-800 font-bold text-xl py-4 px-6 rounded-2xl shadow-md hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
