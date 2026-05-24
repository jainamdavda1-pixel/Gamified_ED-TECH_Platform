import type { Badge } from "@/types";

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const earned = badge.earnedAt !== null;

  return (
    <div
      id={`badge-${badge.id}`}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-150 text-center ${
        earned
          ? "glass border-violet-500/30 hover:border-violet-400/50"
          : "bg-gray-900/30 border-gray-800/40 opacity-50 grayscale"
      }`}
      title={earned ? `Earned on ${badge.earnedAt}` : "Not yet earned"}
    >
      <span className="text-2xl">{badge.icon}</span>
      <p className="text-xs font-semibold text-gray-200 leading-tight">{badge.title}</p>
      <p className="text-[10px] text-gray-500 leading-tight">{badge.description}</p>
      {earned && (
        <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-violet-600/30 text-violet-300 text-[9px] font-medium border border-violet-500/30">
          Earned
        </span>
      )}
    </div>
  );
}
