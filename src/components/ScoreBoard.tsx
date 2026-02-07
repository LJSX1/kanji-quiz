interface ScoreBoardProps {
  score: number;
  current: number;
}

export default function ScoreBoard({ score, current }: ScoreBoardProps) {
  return (
    <div className="text-right text-amber-700 font-bold">
      <span className="text-lg">
        {score} / {current} せいかい
      </span>
    </div>
  );
}
