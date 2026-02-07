interface QuizSetupProps {
  onStart: (count: number) => void;
}

const counts = [10, 20];

export default function QuizSetup({ onStart }: QuizSetupProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-2xl font-bold text-amber-800">
        もんだいの数をえらんでね
      </h2>
      <div className="flex gap-4">
        {counts.map((n) => (
          <button
            key={n}
            onClick={() => onStart(n)}
            className="bg-white border-2 border-amber-300 text-amber-800 font-bold text-xl py-4 px-8 rounded-2xl shadow-md hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all"
          >
            {n}もん
          </button>
        ))}
      </div>
    </div>
  );
}
