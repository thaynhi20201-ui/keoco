import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Team, LastPullEvent } from '../types';
import { Flame, Zap, Shield, Flag, Award, Lightbulb, Sparkles } from 'lucide-react';

interface CenterTugArenaProps {
  blueTeam: Team;
  redTeam: Team;
  ropePosition: number; // -target to +target
  targetRopeToWin: number;
  lastPullEvent: LastPullEvent | null;
  activeTeamId?: 'blue' | 'red' | 'both' | null;
}

export const CenterTugArena: React.FC<CenterTugArenaProps> = ({
  blueTeam,
  redTeam,
  ropePosition,
  targetRopeToWin,
  lastPullEvent,
  activeTeamId,
}) => {
  // Clamped rope position
  const clamped = Math.max(-targetRopeToWin, Math.min(targetRopeToWin, ropePosition));
  // Ratio from -1 to +1
  const ratio = clamped / targetRopeToWin;
  // Percentage across the track: 50% = center
  const markerPercent = 50 + ratio * 38; // 12% to 88%

  // Offset in pixels for character groups
  const ropeOffsetPx = ratio * 70; // -70px to +70px

  const blueAdvantage = ropePosition < 0;
  const redAdvantage = ropePosition > 0;

  return (
    <div
      id="center-tug-arena"
      className="w-full h-full bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden"
    >
      {/* Stadium ambient lights */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90 pointer-events-none" />
      <div className="absolute top-0 left-0 w-36 h-36 bg-blue-500/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/15 blur-3xl rounded-full pointer-events-none" />

      {/* Arena Header: Balance Status */}
      <div className="relative z-10 flex flex-col items-center gap-2 mb-2">
        {/* Prominent Center Board Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black tracking-wider uppercase shadow-sm">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>BẢN KÉO CO Ở GIỮA</span>
        </div>

        <div className="w-full flex items-center justify-between text-xs font-bold px-1 sm:px-2">
          {/* Blue Team Header Indicator */}
          <div
            className={`transition-all duration-300 rounded-full px-2.5 py-1 flex items-center gap-1.5 ${
              activeTeamId === 'blue' || activeTeamId === 'both'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-pulse'
                : 'text-blue-400 opacity-60'
            }`}
          >
            {activeTeamId === 'blue' || activeTeamId === 'both' ? (
              <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400 animate-bounce" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
            <span className="font-extrabold">{blueTeam.name}</span>
            {activeTeamId === 'blue' && (
              <span className="text-[10px] font-black uppercase text-amber-400">
                [Đèn Vàng Sáng]
              </span>
            )}
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Mục tiêu: {targetRopeToWin} nấc</span>
          </div>

          {/* Red Team Header Indicator */}
          <div
            className={`transition-all duration-300 rounded-full px-2.5 py-1 flex items-center gap-1.5 ${
              activeTeamId === 'red' || activeTeamId === 'both'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-pulse'
                : 'text-rose-400 opacity-60'
            }`}
          >
            {activeTeamId === 'red' && (
              <span className="text-[10px] font-black uppercase text-amber-400">
                [Đèn Vàng Sáng]
              </span>
            )}
            <span className="font-extrabold">{redTeam.name}</span>
            {activeTeamId === 'red' || activeTeamId === 'both' ? (
              <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400 animate-bounce" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
        </div>

        {/* Tension Meter Track */}
        <div className="relative w-full h-6 bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden flex items-center">
          {/* Blue pull side */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
            style={{
              width: `${Math.max(0, -ropePosition / targetRopeToWin) * 50}%`,
              opacity: blueAdvantage ? 0.9 : 0.2,
            }}
          />
          {/* Red pull side */}
          <div
            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-rose-600 to-amber-400 transition-all duration-300"
            style={{
              width: `${Math.max(0, ropePosition / targetRopeToWin) * 50}%`,
              opacity: redAdvantage ? 0.9 : 0.2,
            }}
          />

          {/* Goal Lines */}
          <div className="absolute left-[12%] top-0 bottom-0 w-0.5 bg-blue-400 z-10 opacity-70 flex items-center justify-center">
            <span className="absolute -top-4 text-[9px] font-black text-blue-400">
              ĐÍCH
            </span>
          </div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-400/80 z-10" />
          <div className="absolute right-[12%] top-0 bottom-0 w-0.5 bg-rose-400 z-10 opacity-70 flex items-center justify-center">
            <span className="absolute -top-4 text-[9px] font-black text-rose-400">
              ĐÍCH
            </span>
          </div>

          {/* Floating Tension Needle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
            animate={{ left: `${markerPercent}%` }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            <div className="w-3.5 h-7 bg-amber-400 rounded-sm border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-0.5 h-4 bg-amber-900" />
            </div>
          </motion.div>
        </div>

        {/* Current status banner */}
        <div className="text-center text-xs font-bold text-slate-300 mt-1">
          {ropePosition === 0 ? (
            <span className="text-slate-400">⚖️ Thế trận đang cân bằng</span>
          ) : ropePosition < 0 ? (
            <span className="text-blue-300">
              ⚡ {blueTeam.name} đang dẫn trước {Math.abs(ropePosition).toFixed(1)} nấc
            </span>
          ) : (
            <span className="text-rose-300">
              ⚡ {redTeam.name} đang dẫn trước {ropePosition.toFixed(1)} nấc
            </span>
          )}
        </div>
      </div>

      {/* Main Pitch Field */}
      <div className="relative w-full grow min-h-[220px] rounded-2xl bg-gradient-to-b from-emerald-950/60 via-emerald-900/40 to-emerald-950/80 border border-emerald-700/40 overflow-hidden flex items-center justify-center select-none my-2 shadow-inner">
        {/* Grass field stripes */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 ${i % 2 === 0 ? 'bg-emerald-400/10' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {/* Center line & Circle on ground */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/40 -translate-x-1/2" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-dashed border-white/20 pointer-events-none" />

        {/* ACTIVE YELLOW SPOTLIGHTS ON ARENA PITCH */}
        {(activeTeamId === 'blue' || activeTeamId === 'both') && (
          <div className="absolute top-0 left-0 w-1/2 bottom-0 bg-gradient-to-r from-amber-400/25 via-amber-400/10 to-transparent pointer-events-none z-10 border-r-2 border-amber-400/50 shadow-[inset_0_0_30px_rgba(251,191,36,0.3)] animate-pulse" />
        )}
        {(activeTeamId === 'red' || activeTeamId === 'both') && (
          <div className="absolute top-0 right-0 w-1/2 bottom-0 bg-gradient-to-l from-amber-400/25 via-amber-400/10 to-transparent pointer-events-none z-10 border-l-2 border-amber-400/50 shadow-[inset_0_0_30px_rgba(251,191,36,0.3)] animate-pulse" />
        )}

        {/* Turn Spotlight Beacons */}
        {activeTeamId === 'blue' && (
          <div className="absolute top-2 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-[0_0_15px_#fde047] animate-pulse">
            <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
            <span>ĐÈN VÀNG: LƯỢT {blueTeam.name.toUpperCase()}</span>
          </div>
        )}
        {activeTeamId === 'red' && (
          <div className="absolute top-2 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-[0_0_15px_#fde047] animate-pulse">
            <span>ĐÈN VÀNG: LƯỢT {redTeam.name.toUpperCase()}</span>
            <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
          </div>
        )}
        {activeTeamId === 'both' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-[0_0_15px_#fde047] animate-pulse">
            <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
            <span>ĐÈN VÀNG CẢ 2 BÊN: ĐUA TỐC ĐỘ</span>
          </div>
        )}

        {/* Dynamic Action Notification */}
        <AnimatePresence>
          {lastPullEvent && (
            <motion.div
              key={lastPullEvent.timestamp}
              initial={{ scale: 0.6, y: -15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              className={`absolute top-2 z-30 px-3 py-1 rounded-full font-black text-xs tracking-wide shadow-lg flex items-center gap-1 ${
                lastPullEvent.teamId === 'blue'
                  ? 'bg-blue-600 text-white border border-blue-300'
                  : 'bg-rose-600 text-white border border-rose-300'
              }`}
            >
              {lastPullEvent.isSuperPull ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
                  <span>KÉO SIÊU CẤP! +{lastPullEvent.strength} NẤC</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>+{lastPullEvent.strength} VỀ {lastPullEvent.teamId === 'blue' ? blueTeam.name : redTeam.name}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* THE ROPE LAYER */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 pointer-events-none z-10 flex items-center">
          <motion.div
            className="w-full relative h-3.5"
            animate={{ x: ropeOffsetPx }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            {/* The Rope */}
            <div className="w-full h-3.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full shadow border border-amber-900 flex items-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #451a03 0, #451a03 5px, transparent 5px, transparent 10px)',
                }}
              />
            </div>

            {/* Red Center Ribbon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <motion.div
                animate={{
                  rotate: [0, -8, 8, 0],
                  scale: lastPullEvent ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 0.35 }}
                className="w-4 h-6 bg-red-600 rounded-sm shadow border border-white flex items-center justify-center font-black text-[8px] text-white"
              >
                ▼
              </motion.div>
              <div className="w-2 h-4 bg-red-600 -mt-1 rounded-b shadow-sm" />
            </div>
          </motion.div>
        </div>

        {/* BLUE TEAM ATHLETES (LEFT) */}
        <motion.div
          className="absolute left-[2%] top-1/2 -translate-y-1/2 z-20 flex items-end gap-1"
          animate={{ x: ropeOffsetPx * 0.85 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        >
          <CenterAthlete
            team="blue"
            role="lead"
            isStraining={activeTeamId === 'blue' || activeTeamId === 'both'}
            isWinning={blueAdvantage}
            height={95}
          />
          <CenterAthlete
            team="blue"
            role="anchor"
            isStraining={activeTeamId === 'blue' || activeTeamId === 'both'}
            isWinning={blueAdvantage}
            height={90}
          />
        </motion.div>

        {/* RED TEAM ATHLETES (RIGHT) */}
        <motion.div
          className="absolute right-[2%] top-1/2 -translate-y-1/2 z-20 flex flex-row-reverse items-end gap-1"
          animate={{ x: ropeOffsetPx * 0.85 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        >
          <CenterAthlete
            team="red"
            role="lead"
            isStraining={activeTeamId === 'red' || activeTeamId === 'both'}
            isWinning={redAdvantage}
            height={95}
          />
          <CenterAthlete
            team="red"
            role="anchor"
            isStraining={activeTeamId === 'red' || activeTeamId === 'both'}
            isWinning={redAdvantage}
            height={90}
          />
        </motion.div>
      </div>

      {/* Footer Scores Comparison */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-blue-300">
          <span className="font-bold">Đúng: {blueTeam.score}</span>
          {blueTeam.streak >= 2 && (
            <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300 font-extrabold flex items-center">
              🔥 x{blueTeam.streak}
            </span>
          )}
        </div>

        <div className="text-[11px] font-extrabold text-amber-400 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>SÂN ĐẤU KÉO CO</span>
        </div>

        <div className="flex items-center gap-1.5 text-rose-300 flex-row-reverse">
          <span className="font-bold">Đúng: {redTeam.score}</span>
          {redTeam.streak >= 2 && (
            <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300 font-extrabold flex items-center">
              🔥 x{redTeam.streak}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface CenterAthleteProps {
  team: 'blue' | 'red';
  role: 'lead' | 'anchor';
  isStraining: boolean;
  isWinning: boolean;
  height: number;
}

const CenterAthlete: React.FC<CenterAthleteProps> = ({
  team,
  role,
  isStraining,
  isWinning,
  height,
}) => {
  const isBlue = team === 'blue';
  const leanAngle = isBlue
    ? isStraining
      ? -18
      : isWinning
      ? -13
      : -7
    : isStraining
    ? 18
    : isWinning
    ? 13
    : 7;

  const primaryColor = isBlue ? '#2563eb' : '#dc2626';
  const secondaryColor = isBlue ? '#60a5fa' : '#f87171';
  const headbandColor = isBlue ? '#93c5fd' : '#fca5a5';

  return (
    <motion.div
      className="flex flex-col items-center relative"
      animate={{
        rotate: leanAngle,
        y: isStraining ? [0, -2.5, 0] : 0,
      }}
      transition={{
        rotate: { type: 'spring', stiffness: 200, damping: 18 },
        y: { repeat: isStraining ? Infinity : 0, duration: 0.3 },
      }}
    >
      {isStraining && (
        <motion.div
          className="absolute -top-3 text-[10px]"
          animate={{ y: [-2, -6, -2], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          {isWinning ? '🔥' : '💦'}
        </motion.div>
      )}

      <svg
        width={height * 0.62}
        height={height}
        viewBox="0 0 70 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow"
      >
        <ellipse cx="35" cy="24" rx="15" ry="16" fill="#fed7aa" />
        <path
          d="M20 18 C22 8, 48 8, 50 18 C50 18, 45 13, 35 13 C25 13, 20 18, 20 18 Z"
          fill="#1e293b"
        />
        <rect x="19" y="19" width="32" height="5" rx="2.5" fill={headbandColor} />

        {isStraining ? (
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
          <>
            <circle cx="29" cy="26" r="2" fill="#1e293b" />
            <circle cx="41" cy="26" r="2" fill="#1e293b" />
          </>
        )}
        <path
          d={isStraining ? 'M30 33 Q35 29 40 33' : 'M30 31 Q35 36 40 31'}
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path d="M23 41 L47 41 L45 74 L25 74 Z" fill={primaryColor} />
        <rect x="30" y="48" width="10" height="10" rx="2" fill="#ffffff" opacity="0.9" />
        <text
          x="35"
          y="56"
          fill={primaryColor}
          fontSize="8"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {role === 'lead' ? '1' : '2'}
        </text>

        <path
          d={isBlue ? 'M23 46 Q12 60 28 66' : 'M47 46 Q58 60 42 66'}
          stroke={secondaryColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx={isBlue ? 28 : 42} cy="66" r="4.5" fill="#fed7aa" />
        <path d="M25 74 L45 74 L47 88 L37 88 L35 80 L33 88 L23 88 Z" fill="#0f172a" />
        <ellipse cx="26" cy="98" rx="6" ry="4" fill="#334155" />
        <ellipse cx="44" cy="98" rx="6" ry="4" fill="#334155" />
      </svg>
    </motion.div>
  );
};
