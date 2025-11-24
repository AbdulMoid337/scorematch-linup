import React from "react";

interface Statistics {
  Speed: number;
  Height: number;
  Strength: number;
  Power: number;
  Skill: number;
  Response: number;
}

interface PlayerData {
  behavior: string;
  level: number;
  description: string;
  statistics: Statistics;
}

interface PlayerCardProps {
  name: string;
  data: PlayerData;
}

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500 group-hover:shadow-[0_0_8px_rgba(56,189,248,0.6)]"
        style={{ width: `${Math.min(Math.max(value, 0), 50) * 2}%` }} // Assuming stats go up to roughly 50 based on data
      />
    </div>
  </div>
);

const PlayerCard: React.FC<PlayerCardProps> = ({ name, data }) => {
  const { behavior, level, description, statistics } = data;

  return (
    <div className="group relative flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900 cursor-pointer hover:ring-2 hover:ring-blue-500/20 active:scale-95">
      {/* Card Header */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold capitalize tracking-tight">
            {name}
          </h2>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-lg font-bold text-slate-900 shadow-lg ring-2 ring-yellow-300">
            {level}
          </div>
        </div>
        <div className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-yellow-400 backdrop-blur-md">
          {behavior}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300 italic">
          &ldquo;{description}&rdquo;
        </p>

        <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-4">
          {Object.entries(statistics).map(([key, value]) => (
            <StatBar key={key} label={key} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
