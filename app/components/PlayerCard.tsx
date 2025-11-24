import React from "react";
import {
  Zap,
  Shield,
  Crosshair,
  Swords,
  Wand2,
  Hammer,
  Map,
  Ghost,
  Medal,
  Plane,
  User,
  Scale,
  Bird,
  TriangleRight,
  Car,
  TriangleAlert,
  Star,
  CloudRain,
  Forklift,
  Flag,
  Skull,
  Panda,
  Clapperboard,
  Siren,
  Cog,
  Music4,
  BicepsFlexed,
  Wallet,
  Ship,
  HatGlasses,
  HardHat,
  BrickWall,
} from "lucide-react";

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

const StatBar = ({ label, value }: { label: string; value: number }) => {
  // Calculate percentage based on a max of 50
  const percentage = Math.min(Math.max(value, 0), 50) * 2;

  return (
    <div className="group/stat flex flex-col gap-1.5">
      <div className="flex justify-between items-end text-xs font-bold uppercase tracking-wider text-gray-400 group-hover/stat:text-gray-200 transition-colors">
        <span>{label}</span>
        <span className="text-blue-400">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-white/5">
        <div
          className="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-1000 ease-out group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const getBehaviorIcon = (behavior: string) => {
  const size = 14;
  const b = behavior.toLowerCase();

  if (b.includes("jet") || b.includes("rocket")) return <Plane size={size} />;
  if (b.includes("lightning")) return <Zap size={size} />;
  if (b.includes("poacher")) return <Bird size={size} />;
  if (b.includes("architect")) return <TriangleRight size={size} />;
  if (b.includes("speedster")) return <Car size={size} />;
  if (b.includes("gatecrasher")) return <TriangleAlert size={size} />;
  if (b.includes("hero")) return <Star size={size} />;
  if (b.includes("thunder")) return <CloudRain size={size} />;
  if (b.includes("invader")) return <Ghost size={size} />;
  if (b.includes("finisher")) return <Flag size={size} />;
  if (b.includes("infiltrator")) return <Skull size={size} />;
  if (b.includes("prowler")) return <Panda size={size} />;
  if (b.includes("intruder")) return <Siren size={size} />;
  if (b.includes("composer")) return <Music4 size={size} />;
  if (b.includes("juggernaut")) return <BicepsFlexed size={size} />;
  if (b.includes("pickpocket")) return <Wallet size={size} />;
  if (b.includes("voyager")) return <Ship size={size} />;
  if (b.includes("villain")) return <HatGlasses size={size} />;
  if (b.includes("protector")) return <HardHat size={size} />;
  if (b.includes("warrior")) return <Swords size={size} />;
  if (b.includes("gk-stopper")) return <BrickWall size={size} />;
  if (b.includes("bulldozer")) return <Forklift size={size} />;
  if (b.includes("guard") || b.includes("commander"))
    return <Shield size={size} />;
  if (b.includes("hitman") || b.includes("marksman"))
    return <Crosshair size={size} />;
  if (b.includes("menace") || b.includes("raider"))
    return <Swords size={size} />;
  if (b.includes("wizard") || b.includes("magician"))
    return <Wand2 size={size} />;
  if (b.includes("hammer")) return <Hammer size={size} />;
  if (b.includes("explorer")) return <Map size={size} />;
  if (b.includes("engine")) return <Cog size={size} />;
  if (b.includes("producer")) return <Clapperboard size={size} />;
  if (b.includes("major")) return <Medal size={size} />;
  if (b.includes("judge")) return <Scale size={size} />;

  return <User size={size} />;
};

const PlayerCard: React.FC<PlayerCardProps> = ({ name, data }) => {
  const { behavior, level, description, statistics } = data;

  return (
    <div className="group relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30 cursor-default">
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-600/20 blur-3xl transition-all duration-500 group-hover:bg-blue-500/30" />
      <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-purple-600/20 blur-3xl transition-all duration-500 group-hover:bg-purple-500/30" />

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between p-6 pb-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-sm">
            {name}
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-400 ring-1 ring-inset ring-blue-500/20 transition-colors group-hover:bg-blue-500/20 group-hover:text-blue-300">
            {getBehaviorIcon(behavior)}
            {behavior}
          </div>
        </div>

        {/* Level Badge */}
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-linear-to-br from-yellow-400 to-amber-600 shadow-lg rotate-3 group-hover:rotate-6 transition-transform" />
          <div className="absolute inset-0.5 rounded-[10px] bg-slate-900 flex items-center justify-center">
            <span className="text-xl font-black text-white">{level}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pb-6">
        <div className="mb-6 min-h-[12]">
          <p className="text-sm font-medium leading-relaxed text-gray-400 italic border-l-2 border-blue-500/30 pl-3">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="mb-5 h-px w-full from-transparent via-white/10 to-transparent" />

        <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-5">
          {Object.entries(statistics).map(([key, value]) => (
            <StatBar key={key} label={key} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
