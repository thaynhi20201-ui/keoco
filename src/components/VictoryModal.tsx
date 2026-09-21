import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Team } from '../types';
import { Trophy, Flame, RotateCcw, Home, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VictoryModalProps {
  winner: Team;
  loser: Team;
  ropePosition: number;
  onRestart: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  loser,
  ropePosition,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    // Play victory sound
    soundManager.playVictory();

    // Trigger confetti cannon
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const isBlue = winner.id === 'blue';

  return (
    <div
      id="victory-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center"
      >
        {/* Glow behind trophy */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isBlue ? 'bg-blue-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Trophy Icon */}
        <div className="relative z-10 mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/25 mb-4 animate-bounce">
          <Trophy className="w-14 h-14 sm:w-16 sm:h-16 text-slate-950 stroke-[2.2]" />
        </div>

        {/* Title */}
        <div className="relative z-10 mb-5">
          <span className="text-xs font-black tracking-widest text-amber-400 uppercase px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            CHIẾN THẮNG KNOCKOUT!
          </span>
          <h2
            className={`text-2xl sm:text-4xl font-black mt-2 tracking-tight ${
              isBlue ? 'text-blue-400' : 'text-rose-400'
            }`}
          >
            {winner.name.toUpperCase()} VÔ ĐỊCH!
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Đã kéo hoàn toàn sợi dây chiến thắng về phía mình!
          </p>
        </div>

        {/* Match Statistics Card */}
        <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 text-left">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Tổng kết trận đấu kéo co
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Winner Column */}
            <div
              className={`p-3 rounded-xl border ${
                isBlue
                  ? 'bg-blue-950/40 border-blue-600/40 text-blue-200'
                  : 'bg-rose-950/40 border-rose-600/40 text-rose-200'
              }`}
            >
              <div className="font-extrabold text-sm mb-1 flex items-center gap-1.5">
                <span>{winner.name}</span>
                <span className="text-amber-400 text-xs">👑 Thắng</span>
              </div>
              <div className="text-xs text-slate-300">
                Trả lời đúng:{' '}
                <span className="font-bold text-white text-sm">{winner.score}</span> câu
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                Chuỗi đúng đỉnh cao:
                <span className="font-bold text-amber-400 flex items-center">
                  <Flame className="w-3 h-3 fill-amber-400" /> {winner.maxStreak}
                </span>
              </div>
            </div>

            {/* Loser Column */}
            <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 text-slate-400">
              <div className="font-extrabold text-sm mb-1 text-slate-300">{loser.name}</div>
              <div className="text-xs">
                Trả lời đúng:{' '}
                <span className="font-bold text-white text-sm">{loser.score}</span> câu
              </div>
              <div className="text-xs flex items-center gap-1 mt-0.5">
                Chuỗi đúng đỉnh cao:
                <span className="font-bold text-slate-300">{loser.maxStreak}</span>
              </div>
            </div>
          </div>

          {/* Rope Offset Info */}
          <div className="mt-3 text-center text-xs text-slate-400 font-medium">
            Lực kéo cách biệt:{' '}
            <span className="text-amber-400 font-bold">
              {Math.abs(ropePosition).toFixed(1)} nấc kéo
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <button
            id="btn-play-again"
            type="button"
            onClick={onRestart}
            className="flex-1 py-3 px-5 rounded-2xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại trận mới</span>
          </button>
          <button
            id="btn-return-lobby"
            type="button"
            onClick={onHome}
            className="sm:w-auto py-3 px-5 rounded-2xl font-bold text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về phòng chờ</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
