interface ProgressBarProps {
  value: number; // 0–100
  colorClass?: string;
  height?: string;
  showLabel?: boolean;
  id?: string;
}

export default function ProgressBar({
  value,
  colorClass = "bg-gradient-to-r from-violet-500 to-indigo-500",
  height = "h-2",
  showLabel = false,
  id,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full" id={id}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-violet-300">{clamped}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-800 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorClass} rounded-full progress-bar-fill`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
