import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Team, LastPullEvent } from '../types';
import { Flame, Zap, Shield, Flag } from 'lucide-react';

interface TugOfWarArenaProps {
  blueTeam: Team;
  redTeam: Team;
  ropePosition: number; // -target to +target (negative = Blue leads, positive = Red leads)
  targetRopeToWin: number;
  lastPullEvent: LastPullEvent | null;
  activeTeamId?: 'blue' | 'red' | null;
}

export const TugOfWarArena: React.FC<TugOfWarArenaProps> = ({
  blueTeam,
  redTeam,
  ropePosition,
  targetRopeToWin,
  lastPullEvent,
  activeTeamId,
}) => {
  // Normalize percentage for the marker: 0 = center (50%), -target = 10% (Blue wins), +target = 90% (Red wins)
  const markerPercent = useMemo(() => {
    const clamped = Math.max(-targetRopeToWin, Math.min(targetRopeToWin, ropePosition));
    const ratio = clamped / targetRopeToWin; // -1 to +1
    return 50 + ratio * 38; // 12% to 88%
  }, [ropePosition, targetRopeToWin]);

  const ropeOffsetPx = useMemo(() => {
    // Offset in pixels for character groups
    const clamped = Math.max(-targetRopeToWin, Math.min(targetRopeToWin, ropePosition));
    return (clamped / targetRopeToWin) * 90; // -90px to +90px
  }, [ropePosition, targetRopeToWin]);

  const blueAdvantage = ropePosition < 0;
  const redAdvantage = ropePosition > 0;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background Ambience / Stadium Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-72 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-40 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header: Teams Summary & Tension Meter */}
      <div className="relative z-10 flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-3">
          {/* Blue Team Badge */}
          <div
            id="team-card-blue"
            className={`flex items-center gap-3 px-3 py-2 rounded-2xl border transition-all duration-300 ${
              activeTeamId === 'blue'
                ? 'bg-blue-950/70 border-blue-400 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-md font-black text-white">
              {blueTeam.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-blue-300 tracking-wide">
                  {blueTeam.name}
                </span>
                {blueTeam.streak >= 2 && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    x{blueTeam.streak}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Đúng: <span className="text-white font-bold">{blueTeam.score}</span> câu
              </div>
            </div>
          </div>

          {/* Center VS & Rope Balance Badge */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 shadow">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {ropePosition === 0
                  ? 'Thế trận cân bằng'
                  : ropePosition < 0
                  ? `${blueTeam.name} dẫn ${Math.abs(ropePosition).toFixed(1)} nấc`
                  : `${redTeam.name} dẫn ${ropePosition.toFixed(1)} nấc`}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Cần {targetRopeToWin} nấc để thắng Knockout
            </div>
          </div>

          {/* Red Team Badge */}
          <div
            id="team-card-red"
            className={`flex items-center gap-3 px-3 py-2 rounded-2xl border transition-all duration-300 flex-row-reverse text-right ${
              activeTeamId === 'red'
                ? 'bg-red-950/70 border-red-400 ring-2 ring-red-500/40 shadow-lg shadow-red-500/20'
                : 'bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-xl shadow-md font-black text-white">
              {redTeam.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-row-reverse">
                <span className="font-extrabold text-sm sm:text-base text-rose-300 tracking-wide">
                  {redTeam.name}
                </span>
                {redTeam.streak >= 2 && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    x{redTeam.streak}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Đúng: <span className="text-white font-bold">{redTeam.score}</span> câu
              </div>
            </div>
          </div>
        </div>

        {/* Tension Meter Track */}
        <div className="relative w-full h-5 bg-slate-950/90 rounded-full border border-slate-800 p-0.5 overflow-hidden flex items-center">
          {/* Blue pull progress (left) */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
            style={{
              width: `${Math.max(0, -ropePosition / targetRopeToWin) * 50}%`,
              opacity: blueAdvantage ? 0.75 : 0.2,
            }}
          />
          {/* Red pull progress (right) */}
          <div
            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-rose-600 to-amber-400 transition-all duration-300"
            style={{
              width: `${Math.max(0, ropePosition / targetRopeToWin) * 50}%`,
              opacity: redAdvantage ? 0.75 : 0.2,
            }}
          />

          {/* Goal Lines Markers */}
          <div className="absolute left-[12%] top-0 bottom-0 w-1 bg-blue-400 z-10 opacity-70 flex items-center justify-center">
            <span className="absolute -top-5 text-[10px] font-extrabold text-blue-400 flex items-center gap-0.5">
              <Flag className="w-2.5 h-2.5" /> ĐÍCH XANH
            </span>
          </div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-400 z-10 opacity-80" />
          <div className="absolute right-[12%] top-0 bottom-0 w-1 bg-rose-400 z-10 opacity-70 flex items-center justify-center">
            <span className="absolute -top-5 text-[10px] font-extrabold text-rose-400 flex items-center gap-0.5">
              ĐÍCH ĐỎ <Flag className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Floating Indicator Needle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
            animate={{ left: `${markerPercent}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <div className="w-4 h-7 bg-amber-400 rounded-sm border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-0.5 h-4 bg-amber-800" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Tug Of War Visual Field */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-emerald-900/40 via-emerald-800/30 to-emerald-950/60 border border-emerald-700/30 overflow-hidden shadow-inner flex items-center justify-center select-none">
        {/* Stadium Field Stripes */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 ${i % 2 === 0 ? 'bg-emerald-400/10' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {/* Center line & Circle on ground */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/40 -translate-x-1/2" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-dashed border-white/20 pointer-events-none" />

        {/* Boundary marks for Knockout win */}
        <div className="absolute left-[14%] top-0 bottom-0 border-l-2 border-blue-400/50 flex flex-col justify-between py-2">
          <span className="text-[10px] font-extrabold text-blue-300/80 bg-blue-950/60 px-1.5 py-0.5 rounded">
            VẠCH THẮNG
          </span>
          <span className="text-[10px] font-extrabold text-blue-300/80 bg-blue-950/60 px-1.5 py-0.5 rounded">
            XANH
          </span>
        </div>
        <div className="absolute right-[14%] top-0 bottom-0 border-r-2 border-rose-400/50 flex flex-col justify-between py-2 text-right">
          <span className="text-[10px] font-extrabold text-rose-300/80 bg-rose-950/60 px-1.5 py-0.5 rounded">
            VẠCH THẮNG
          </span>
          <span className="text-[10px] font-extrabold text-rose-300/80 bg-rose-950/60 px-1.5 py-0.5 rounded">
            ĐỎ
          </span>
        </div>

        {/* Action feedback banner overlay (e.g., KÉO MẠNH! +2) */}
        <AnimatePresence>
          {lastPullEvent && (
            <motion.div
              key={lastPullEvent.timestamp}
              initial={{ scale: 0.5, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -25, opacity: 0 }}
              className={`absolute top-3 z-30 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm tracking-wide shadow-xl flex items-center gap-1.5 ${
                lastPullEvent.teamId === 'blue'
                  ? 'bg-blue-600 text-white border border-blue-300 ring-2 ring-blue-400/50'
                  : 'bg-rose-600 text-white border border-rose-300 ring-2 ring-rose-400/50'
              }`}
            >
              {lastPullEvent.isSuperPull ? (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
                  <span>KÉO SIÊU CẤP! +{lastPullEvent.strength} NẤC</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>+{lastPullEvent.strength} NẤC VỀ PHÍA {lastPullEvent.teamId === 'blue' ? blueTeam.name.toUpperCase() : redTeam.name.toUpperCase()}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROPE SVG LAYER */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 pointer-events-none z-10 flex items-center">
          <motion.div
            className="w-full relative h-4"
            animate={{ x: ropeOffsetPx }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* The Rope itself */}
            <div className="w-full h-4 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full shadow-lg border border-amber-900 flex items-center relative overflow-hidden">
              {/* Rope fiber twist pattern */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #451a03 0, #451a03 6px, transparent 6px, transparent 12px)',
                }}
              />
            </div>

            {/* Red Center Ribbon attached to the rope */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <motion.div
                animate={{
                  rotate: [0, -6, 6, 0],
                  scale: lastPullEvent ? [1, 1.25, 1] : 1,
                }}
                transition={{ duration: 0.4 }}
                className="w-5 h-7 bg-red-600 rounded-sm shadow-md border-2 border-white flex items-center justify-center font-black text-[9px] text-white"
              >
                ▼
              </motion.div>
              {/* Hanging red streamer tails */}
              <div className="w-2.5 h-6 bg-red-600 -mt-1 rounded-b shadow-sm animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* BLUE TEAM ATHLETES (LEFT SIDE) */}
        <motion.div
          className="absolute left-[3%] sm:left-[8%] top-1/2 -translate-y-1/2 z-20 flex items-end gap-1 sm:gap-2.5"
          animate={{ x: ropeOffsetPx * 0.85 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {/* Player 1 (Lead puller) */}
          <PullerCharacter
            team="blue"
            role="lead"
            isStraining={activeTeamId === 'blue'}
            isWinning={blueAdvantage}
            height={110}
            name="Tiên Phong"
          />
          {/* Player 2 (Middle power) */}
          <PullerCharacter
            team="blue"
            role="middle"
            isStraining={activeTeamId === 'blue'}
            isWinning={blueAdvantage}
            height={100}
            name="Cố Thủ"
          />
          {/* Player 3 (Anchor back) */}
          <PullerCharacter
            team="blue"
            role="anchor"
            isStraining={activeTeamId === 'blue'}
            isWinning={blueAdvantage}
            height={115}
            name="Mỏ Neo"
          />
        </motion.div>

        {/* RED TEAM ATHLETES (RIGHT SIDE) */}
        <motion.div
          className="absolute right-[3%] sm:right-[8%] top-1/2 -translate-y-1/2 z-20 flex flex-row-reverse items-end gap-1 sm:gap-2.5"
          animate={{ x: ropeOffsetPx * 0.85 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {/* Player 1 (Lead puller) */}
          <PullerCharacter
            team="red"
            role="lead"
            isStraining={activeTeamId === 'red'}
            isWinning={redAdvantage}
            height={110}
            name="Tiên Phong"
          />
          {/* Player 2 (Middle power) */}
          <PullerCharacter
            team="red"
            role="middle"
            isStraining={activeTeamId === 'red'}
            isWinning={redAdvantage}
            height={100}
            name="Cố Thủ"
          />
          {/* Player 3 (Anchor back) */}
          <PullerCharacter
            team="red"
            role="anchor"
            isStraining={activeTeamId === 'red'}
            isWinning={redAdvantage}
            height={115}
            name="Mỏ Neo"
          />
        </motion.div>
      </div>
    </div>
  );
};

interface PullerCharacterProps {
  team: 'blue' | 'red';
  role: 'lead' | 'middle' | 'anchor';
  isStraining: boolean;
  isWinning: boolean;
  height: number;
  name: string;
}

const PullerCharacter: React.FC<PullerCharacterProps> = ({
  team,
  role,
  isStraining,
  isWinning,
  height,
}) => {
  const isBlue = team === 'blue';
  // Lean back angle: pulling hard causes leaning backwards
  // For Blue (pulling left), negative rotate leans left
  // For Red (pulling right), positive rotate leans right
  const leanAngle = isBlue
    ? isStraining
      ? -20
      : isWinning
      ? -14
      : -8
    : isStraining
    ? 20
    : isWinning
    ? 14
    : 8;

  const primaryColor = isBlue ? '#2563eb' : '#dc2626';
  const secondaryColor = isBlue ? '#60a5fa' : '#f87171';
  const headbandColor = isBlue ? '#93c5fd' : '#fca5a5';

  return (
    <motion.div
      className="flex flex-col items-center relative"
      animate={{
        rotate: leanAngle,
        y: isStraining ? [0, -3, 0] : 0,
      }}
      transition={{
        rotate: { type: 'spring', stiffness: 200, damping: 18 },
        y: { repeat: isStraining ? Infinity : 0, duration: 0.3 },
      }}
    >
      {/* Sweat drops or Fire emotion */}
      {isStraining && (
        <motion.div
          className="absolute -top-3 text-xs"
          animate={{ y: [-2, -8, -2], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          {isWinning ? '🔥' : '💦'}
        </motion.div>
      )}

      {/* Cute Stylized SVG Character */}
      <svg
        width={height * 0.65}
        height={height}
        viewBox="0 0 70 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md"
      >
        {/* Headband / Hair */}
        <ellipse cx="35" cy="24" rx="16" ry="17" fill="#fed7aa" />
        <path
          d="M20 18 C22 8, 48 8, 50 18 C50 18, 45 13, 35 13 C25 13, 20 18, 20 18 Z"
          fill="#1e293b"
        />
        {/* Headband */}
        <rect x="19" y="19" width="32" height="5" rx="2.5" fill={headbandColor} />

        {/* Eyes & Face Expression */}
        {isStraining ? (
          // Determined / Strain squint eyes
          <path
            d={
              isBlue
                ? 'M26 25 L32 27 M38 27 L44 25'
                : 'M26 27 L32 25 M38 25 L44 27'
            }
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : (
          // Confident eyes
          <>
            <circle cx="29" cy="26" r="2" fill="#1e293b" />
            <circle cx="41" cy="26" r="2" fill="#1e293b" />
          </>
        )}
        {/* Mouth */}
        <path
          d={isStraining ? 'M30 33 Q35 29 40 33' : 'M30 31 Q35 36 40 31'}
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Torso / Sport Shirt */}
        <path
          d="M23 41 L47 41 L45 74 L25 74 Z"
          fill={primaryColor}
        />
        {/* Jersey Number / Badge */}
        <rect x="29" y="47" width="12" height="12" rx="3" fill="#ffffff" opacity="0.9" />
        <text
          x="35"
          y="56"
          fill={primaryColor}
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {role === 'lead' ? '1' : role === 'middle' ? '2' : '3'}
        </text>

        {/* Sturdy Arms gripping the rope */}
        <path
          d={
            isBlue
              ? 'M23 46 Q12 60 28 66'
              : 'M47 46 Q58 60 42 66'
          }
          stroke={secondaryColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Hands */}
        <circle cx={isBlue ? 28 : 42} cy="66" r="4.5" fill="#fed7aa" />

        {/* Shorts */}
        <path d="M25 74 L45 74 L47 88 L37 88 L35 80 L33 88 L23 88 Z" fill="#0f172a" />

        {/* Sturdy Boots digging into turf */}
        <ellipse cx="26" cy="98" rx="6" ry="4" fill="#334155" />
        <ellipse cx="44" cy="98" rx="6" ry="4" fill="#334155" />
      </svg>
    </motion.div>
  );
};
