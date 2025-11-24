"use client";

import React, { useState, useMemo, useEffect } from "react";
import { players } from "../data";

// Types
type PlayerData = {
  behavior: string;
  level: number;
  description: string;
  statistics: Record<string, number>;
};

type Player = {
  id: string;
  name: string;
  data: PlayerData;
};

// Normalize player data
// The data structure in data.ts is an array containing a single object
const allPlayersObj = players[0] as unknown as Record<string, PlayerData>;
const normalizedPlayers: Player[] = Object.entries(allPlayersObj).map(
  ([name, data]) => ({
    id: name,
    name,
    data,
  }),
);

// Formations (positions as top/left percentages)
// Indexes correspond to specific slots. 0 is usually GK.
const FORMATIONS: Record<
  string,
  { name: string; positions: { top: number; left: number; role?: string }[] }
> = {
  "4-4-2": {
    name: "4-4-2",
    positions: [
      { top: 88, left: 50, role: "GK" }, // GK
      { top: 70, left: 15, role: "LB" },
      { top: 70, left: 38, role: "CB" },
      { top: 70, left: 62, role: "CB" },
      { top: 70, left: 85, role: "RB" }, // DEF
      { top: 45, left: 15, role: "LM" },
      { top: 45, left: 38, role: "CM" },
      { top: 45, left: 62, role: "CM" },
      { top: 45, left: 85, role: "RM" }, // MID
      { top: 20, left: 35, role: "ST" },
      { top: 20, left: 65, role: "ST" }, // FWD
    ],
  },
  "4-3-3": {
    name: "4-3-3",
    positions: [
      { top: 88, left: 50, role: "GK" },
      { top: 70, left: 15, role: "LB" },
      { top: 70, left: 38, role: "CB" },
      { top: 70, left: 62, role: "CB" },
      { top: 70, left: 85, role: "RB" },
      { top: 50, left: 30, role: "CM" },
      { top: 50, left: 50, role: "CM" },
      { top: 50, left: 70, role: "CM" },
      { top: 20, left: 20, role: "LW" },
      { top: 20, left: 50, role: "ST" },
      { top: 20, left: 80, role: "RW" },
    ],
  },
  "3-5-2": {
    name: "3-5-2",
    positions: [
      { top: 88, left: 50, role: "GK" },
      { top: 70, left: 30, role: "CB" },
      { top: 70, left: 50, role: "CB" },
      { top: 70, left: 70, role: "CB" },
      { top: 50, left: 10, role: "LWB" },
      { top: 50, left: 30, role: "CM" },
      { top: 50, left: 50, role: "CDM" },
      { top: 50, left: 70, role: "CM" },
      { top: 50, left: 90, role: "RWB" },
      { top: 20, left: 35, role: "ST" },
      { top: 20, left: 65, role: "ST" },
    ],
  },
  "5-3-2": {
    name: "5-3-2",
    positions: [
      { top: 88, left: 50, role: "GK" },
      { top: 70, left: 10, role: "LWB" },
      { top: 70, left: 30, role: "CB" },
      { top: 70, left: 50, role: "CB" },
      { top: 70, left: 70, role: "CB" },
      { top: 70, left: 90, role: "RWB" },
      { top: 50, left: 30, role: "CM" },
      { top: 50, left: 50, role: "CM" },
      { top: 50, left: 70, role: "CM" },
      { top: 20, left: 35, role: "ST" },
      { top: 20, left: 65, role: "ST" },
    ],
  },
  "4-1-2-1-2": {
    name: "4-1-2-1-2",
    positions: [
      { top: 88, left: 50, role: "GK" },
      { top: 75, left: 15, role: "LB" },
      { top: 75, left: 38, role: "CB" },
      { top: 75, left: 62, role: "CB" },
      { top: 75, left: 85, role: "RB" },
      { top: 60, left: 50, role: "CDM" },
      { top: 45, left: 30, role: "LM" },
      { top: 45, left: 70, role: "RM" },
      { top: 35, left: 50, role: "CAM" },
      { top: 15, left: 35, role: "ST" },
      { top: 15, left: 65, role: "ST" },
    ],
  },
};

export default function LineupBuilder() {
  const [formation, setFormation] = useState("4-4-2");
  // Lineup stores which player (by ID) is in which position index (0-10)
  const [lineup, setLineup] = useState<Record<number, string>>({});
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [draggedFromPos, setDraggedFromPos] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLineup = localStorage.getItem("scorematch-lineup");
    const savedFormation = localStorage.getItem("scorematch-formation");
    if (savedLineup) {
      try {
        setLineup(JSON.parse(savedLineup));
      } catch (e) {
        console.error("Failed to parse saved lineup", e);
      }
    }
    if (savedFormation) {
      setFormation(savedFormation);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("scorematch-lineup", JSON.stringify(lineup));
      localStorage.setItem("scorematch-formation", formation);
    }
  }, [lineup, formation, isInitialized]);

  // Players not in the starting 11
  const availablePlayers = useMemo(() => {
    const usedPlayerIds = new Set(Object.values(lineup));
    return normalizedPlayers
      .filter((p) => !usedPlayerIds.has(p.id))
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [lineup, searchQuery]);

  const teamStats = useMemo(() => {
    const playersInLineup = Object.values(lineup)
      .map((id) => normalizedPlayers.find((p) => p.id === id))
      .filter((p): p is Player => !!p);

    if (playersInLineup.length === 0) return { rating: "0.0", count: 0 };

    const totalLevel = playersInLineup.reduce(
      (acc, p) => acc + p.data.level,
      0,
    );
    return {
      rating: (totalLevel / playersInLineup.length).toFixed(1),
      count: playersInLineup.length,
    };
  }, [lineup]);

  const clearLineup = () => {
    if (
      Object.keys(lineup).length > 0 &&
      window.confirm("Clear current lineup?")
    ) {
      setLineup({});
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    playerId: string,
    fromPos: number | null = null,
  ) => {
    setDraggedPlayer(playerId);
    setDraggedFromPos(fromPos);
    // Set data transfer for compatibility
    e.dataTransfer.setData("text/plain", playerId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPosIndex: number) => {
    e.preventDefault();

    if (!draggedPlayer) return;

    setLineup((prev) => {
      const newLineup = { ...prev };

      // Check if target position is occupied
      const existingPlayerInTarget = newLineup[targetPosIndex];

      // If dragging from the bench (fromPos === null)
      if (draggedFromPos === null) {
        newLineup[targetPosIndex] = draggedPlayer;
        // Note: If someone was there, they get overwritten (effectively removed from lineup map, thus back to available)
      }
      // If dragging from another position on pitch
      else {
        // Swap logic
        newLineup[targetPosIndex] = draggedPlayer;
        if (existingPlayerInTarget) {
          newLineup[draggedFromPos] = existingPlayerInTarget;
        } else {
          delete newLineup[draggedFromPos];
        }
      }

      return newLineup;
    });

    setDraggedPlayer(null);
    setDraggedFromPos(null);
  };

  const removeFromLineup = (posIndex: number) => {
    setLineup((prev) => {
      const next = { ...prev };
      delete next[posIndex];
      return next;
    });
  };

  const currentPositions = FORMATIONS[formation].positions;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-150px)]">
      {/* Main Pitch Area */}
      <div className="flex-1 flex flex-col min-h-[600px]">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <span className="text-green-600">⚽</span> Starting XI
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              <span>⭐ Avg Lvl: {teamStats.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearLineup}
              className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              title="Clear all players"
            >
              Clear
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <label className="text-sm text-gray-500 font-medium hidden sm:block">
              Formation:
            </label>
            <select
              value={formation}
              onChange={(e) => {
                setFormation(e.target.value);
              }}
              className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer hover:border-blue-400"
            >
              {Object.keys(FORMATIONS).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative flex-1 bg-linear-to-b from-green-600 to-green-700 rounded-xl shadow-2xl border-4 border-white/20 overflow-hidden mx-auto w-full max-w-2xl ring-1 ring-black/10">
          {/* Pitch Pattern (Stripes) */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 50%, #000 50%)",
              backgroundSize: "100% 10%",
            }}
          ></div>

          {/* Pitch markings */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            {/* Center Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/80"></div>
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/80 rounded-full"></div>
            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full"></div>

            {/* Top Box (Opponent) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-b-2 border-x-2 border-white/80 rounded-b-sm"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-8 border-b-2 border-x-2 border-white/80 rounded-b-sm"></div>
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full"></div>

            {/* Bottom Box (Home) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-x-2 border-white/80 rounded-t-sm"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 border-t-2 border-x-2 border-white/80 rounded-t-sm"></div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full"></div>

            {/* Corner Arcs */}
            <div className="absolute top-0 left-0 w-6 h-6 border-b-2 border-r-2 border-white/80 rounded-br-full"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-b-2 border-l-2 border-white/80 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-t-2 border-r-2 border-white/80 rounded-tr-full"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-t-2 border-l-2 border-white/80 rounded-tl-full"></div>
          </div>

          {/* Positions */}
          {currentPositions.map((pos, index) => {
            const playerId = lineup[index];
            const player = normalizedPlayers.find((p) => p.id === playerId);

            const isDragTarget = draggedPlayer && !player;
            return (
              <div
                key={index}
                className={`absolute w-20 h-24 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-500 ease-in-out z-10 ${
                  isDragTarget ? "animate-pulse scale-105" : ""
                }`}
                style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {player ? (
                  <div
                    className="group relative w-full h-full flex flex-col items-center cursor-grab active:cursor-grabbing animate-in zoom-in duration-300 hover:z-50"
                    draggable
                    onDragStart={(e) => handleDragStart(e, player.id, index)}
                  >
                    {/* Remove Button (Visible on Hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromLineup(index);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 hover:scale-110 cursor-pointer z-20"
                      title="Remove"
                    >
                      ×
                    </button>

                    {/* Player Circle */}
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 border-2 border-yellow-500 flex flex-col items-center justify-center shadow-lg ring-2 ring-black/20 z-10 transition-transform group-hover:scale-110 group-hover:ring-4 group-hover:ring-yellow-400/50">
                      <span className="font-extrabold text-lg leading-none text-slate-800 dark:text-white">
                        {player.data.level}
                      </span>
                    </div>

                    {/* Name Tag */}
                    <div className="mt-1 px-2 py-0.5 bg-slate-900/90 backdrop-blur-sm rounded-md border border-white/10 shadow-md max-w-[120%]">
                      <div className="text-[10px] text-white font-semibold truncate text-center leading-tight capitalize">
                        {player.name}
                      </div>
                    </div>

                    {/* Behavior Tag */}
                    <div className="mt-0.5 text-[8px] font-bold text-yellow-300 drop-shadow-md uppercase tracking-wider">
                      {player.data.behavior}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                      draggedPlayer
                        ? "border-yellow-400/70 bg-yellow-400/10 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                        : "border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50"
                    }`}
                  >
                    <span className="text-white/70 text-[10px] font-bold tracking-widest">
                      {pos.role}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Bench */}
      <div className="w-full lg:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden max-h-[400px] lg:max-h-none">
        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex justify-between items-baseline mb-3">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
              Squad
            </h3>
            <span className="text-xs font-medium px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
              {availablePlayers.length}
            </span>
          </div>
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex justify-between">
            <span>Drag players to positions</span>
            {searchQuery && (
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </span>
            )}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-gray-50/50 dark:bg-slate-950/30">
          {availablePlayers.map((player) => (
            <div
              key={player.id}
              draggable
              onDragStart={(e) => handleDragStart(e, player.id)}
              className="group flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-grab active:cursor-grabbing border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700/50 transition-all duration-200 select-none shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-100 to-yellow-200 text-yellow-800 flex items-center justify-center font-bold text-sm border border-yellow-300 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {player.data.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate capitalize">
                  {player.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 rounded-sm">
                    {player.data.behavior}
                  </span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
          ))}

          {availablePlayers.length === 0 && (
            <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-gray-400 dark:text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm">All players selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
