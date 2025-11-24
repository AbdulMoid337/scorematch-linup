"use client";

import React, { useState } from "react";
import Link from "next/link";
import { players } from "../data";

export default function ComparePage() {
  const allPlayers = players[0];
  // Sort names alphabetically for the dropdowns
  const playerNames = Object.keys(allPlayers).sort();

  const [player1, setPlayer1] = useState<string>(playerNames[0] || "");
  const [player2, setPlayer2] = useState<string>(playerNames[1] || "");

  // Helper to safely get player data
  // We cast keyof typeof allPlayers because the keys are dynamic strings in the source data
  const p1Data = player1
    ? allPlayers[player1 as keyof typeof allPlayers]
    : null;
  const p2Data = player2
    ? allPlayers[player2 as keyof typeof allPlayers]
    : null;

  const statsKeys = [
    "Speed",
    "Height",
    "Strength",
    "Power",
    "Skill",
    "Response",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="flex flex-col items-center mb-12">
          <Link
            href="/"
            className="mb-6 flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Collection
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500 drop-shadow-lg">
            Versus Mode
          </h1>
          <p className="mt-2 text-slate-400 font-medium">
            Compare stats side by side
          </p>
        </header>

        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Player 1 Selector */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-xl">
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              Player 1
            </label>
            <select
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:bg-slate-800/80 transition-colors"
            >
              {playerNames.map((name) => (
                <option key={`p1-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Player 2 Selector */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-xl">
            <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">
              Player 2
            </label>
            <select
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:bg-slate-800/80 transition-colors"
            >
              {playerNames.map((name) => (
                <option key={`p2-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Area */}
        {p1Data && p2Data && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Players Header Info */}
            <div className="grid grid-cols-2 border-b border-white/5">
              <div className="p-8 border-r border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-4 ring-4 ring-blue-500/20 shadow-lg">
                  <span className="text-3xl font-black text-white">
                    {p1Data.level}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-1">
                  {player1}
                </h2>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                  {p1Data.behavior}
                </span>
              </div>

              <div className="p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-4 ring-4 ring-purple-500/20 shadow-lg">
                  <span className="text-3xl font-black text-white">
                    {p2Data.level}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-1">
                  {player2}
                </h2>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                  {p2Data.behavior}
                </span>
              </div>
            </div>

            {/* Stats Comparison */}
            <div className="p-8 space-y-8">
              {statsKeys.map((stat) => {
                // @ts-expect-error - The type definition in data.ts might need strictly typed keys, but in runtime this is fine
                const val1 = p1Data.statistics[stat] || 0;
                // @ts-expect-error - The type definition in data.ts might need strictly typed keys, but in runtime this is fine
                const val2 = p2Data.statistics[stat] || 0;

                // Calculate percentage (assuming 50 is max)
                const maxStat = 50;
                const p1Percent = Math.min((val1 / maxStat) * 100, 100);
                const p2Percent = Math.min((val2 / maxStat) * 100, 100);

                return (
                  <div key={stat} className="relative">
                    <div className="flex justify-between items-end mb-2 px-2">
                      <span
                        className={`font-bold text-lg ${
                          val1 > val2
                            ? "text-blue-400"
                            : val1 < val2
                              ? "text-slate-500"
                              : "text-white"
                        }`}
                      >
                        {val1}
                      </span>
                      <span className=" font-bold uppercase tracking-widest text-white absolute left-1/2 -translate-x-1/2 bottom-5">
                        {stat}
                      </span>
                      <span
                        className={`font-bold text-lg ${
                          val2 > val1
                            ? "text-purple-400"
                            : val2 < val1
                              ? "text-slate-500"
                              : "text-white"
                        }`}
                      >
                        {val2}
                      </span>
                    </div>

                    <div className="flex h-3 w-full rounded-full bg-slate-800 overflow-hidden relative">
                      {/* Center Divider */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-900 z-10" />

                      {/* Player 1 Bar (Right to Left) */}
                      <div className="flex-1 flex justify-end relative">
                        <div
                          className={`h-full rounded-l-full transition-all duration-700 ${
                            val1 > val2
                              ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                              : "bg-blue-900/40"
                          }`}
                          style={{ width: `${p1Percent}%` }}
                        />
                      </div>

                      {/* Player 2 Bar (Left to Right) */}
                      <div className="flex-1 flex justify-start relative">
                        <div
                          className={`h-full rounded-r-full transition-all duration-700 ${
                            val2 > val1
                              ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                              : "bg-purple-900/40"
                          }`}
                          style={{ width: `${p2Percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison Summary Text */}
            <div className="p-6 bg-slate-950/30 border-t border-white/5 text-center">
              <p className="text-sm text-slate-400 italic">
                Select different players above to compare their attributes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
