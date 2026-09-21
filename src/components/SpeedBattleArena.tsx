import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Team } from '../types';
import { Zap, Clock, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

interface SpeedBattleArenaProps {
  question: Question;
  blueTeam: Team;
  redTeam: Team;
  timeLeft: number;
  maxTime: number;
  onSpeedAnswer: (winnerTeamId: 'blue' | 'red', strength: number) => void;
  onNextQuestion: () => void;
}

export const SpeedBattleArena: React.FC<SpeedBattleArenaProps> = ({
  question,
  blueTeam,
  redTeam,
  timeLeft,
  maxTime,
  onSpeedAnswer,
  onNextQuestion,
}) => {
  const [blueSelected, setBlueSelected] = useState<number | null>(null);
  const [redSelected, setRedSelected] = useState<number | null>(null);
  const [roundWinner, setRoundWinner] = useState<'blue' | 'red' | 'none' | null>(null);
  const [resultMessage, setResultMessage] = useState<string>('');

  const letters = ['A', 'B', 'C', 'D'];
  const blueKeys = ['Q', 'W', 'E', 'R'];
  const redKeys = ['U', 'I', 'O', 'P'];

  // Reset local states on question change
  useEffect(() => {
    setBlueSelected(null);
    setRedSelected(null);
    setRoundWinner(null);
    setResultMessage('');
  }, [question.id]);

  const handleChoice = useCallback(
    (team: 'blue' | 'red', choiceIdx: number) => {
      if (roundWinner !== null) return; // already resolved

      const isCorrect = choiceIdx === question.correctIndex;

      if (team === 'blue') {
        setBlueSelected(choiceIdx);
        if (isCorrect) {
          setRoundWinner('blue');
          setResultMessage(`${blueTeam.name} bấm chuông chuẩn xác và nhanh nhất!`);
          onSpeedAnswer('blue', 1.5);
        } else {
          // Blue made a mistake, advantage to Red
          setResultMessage(`${blueTeam.name} trả lời sai! ${redTeam.name} được đà kéo tới!`);
          setRoundWinner('red');
          onSpeedAnswer('red', 1);
        }
      } else {
        setRedSelected(choiceIdx);
        if (isCorrect) {
          setRoundWinner('red');
          setResultMessage(`${redTeam.name} bấm chuông chuẩn xác và nhanh nhất!`);
          onSpeedAnswer('red', 1.5);
        } else {
          // Red made a mistake, advantage to Blue
          setResultMessage(`${redTeam.name} trả lời sai! ${blueTeam.name} được đà kéo tới!`);
          setRoundWinner('blue');
          onSpeedAnswer('blue', 1);
        }
      }
    },
    [roundWinner, question.correctIndex, blueTeam.name, redTeam.name, onSpeedAnswer]
  );

  // Keyboard hotkeys for 2 players
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (roundWinner !== null) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNextQuestion();
        }
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'Q') handleChoice('blue', 0);
      else if (key === 'W') handleChoice('blue', 1);
      else if (key === 'E') handleChoice('blue', 2);
      else if (key === 'R') handleChoice('blue', 3);
      else if (key === 'U') handleChoice('red', 0);
      else if (key === 'I') handleChoice('red', 1);
      else if (key === 'O') handleChoice('red', 2);
      else if (key === 'P') handleChoice('red', 3);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [roundWinner, handleChoice, onNextQuestion]);

  return (
    <div
      id="speed-battle-arena"
      className="w-full bg-slate-900/95 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Top Bar: Speed Battle Tag & Timer */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1.5 uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            ĐUA TỐC ĐỘ / BẤM CHUÔNG
          </span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold">
            {question.categoryName}
          </span>
        </div>

        {maxTime > 0 && (
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 ${
                timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}
            />
            <span
              className={`font-mono font-black text-sm ${
                timeLeft <= 5 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Central Question Display */}
      <div className="text-center py-2 px-2 sm:px-6 mb-6">
        <h3 className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight">
          {question.question}
        </h3>
      </div>

      {/* Central Result Banner if already buzzed */}
      <AnimatePresence>
        {roundWinner && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3.5 rounded-2xl mb-5 text-center font-black text-sm sm:text-base border shadow-lg flex items-center justify-center gap-2 ${
              roundWinner === 'blue'
                ? 'bg-blue-950/80 border-blue-400 text-blue-200'
                : 'bg-rose-950/80 border-rose-400 text-rose-200'
            }`}
          >
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>{resultMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split Duel Pads: Left (Blue Team) vs Right (Red Team) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* BLUE TEAM BUZZER PAD */}
        <div className="bg-slate-950/70 border border-blue-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-900/40">
            <div className="flex items-center gap-2 font-black text-blue-400 text-sm sm:text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              {blueTeam.name}
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Phím tắt: [Q, W, E, R]
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {question.options.map((opt, idx) => {
              const isSelected = blueSelected === idx;
              const isCorrect = idx === question.correctIndex;
              const isWinnerChoice = roundWinner === 'blue' && isSelected;

              return (
                <button
                  id={`btn-speed-blue-${idx}`}
                  key={idx}
                  type="button"
                  disabled={roundWinner !== null}
                  onClick={() => handleChoice('blue', idx)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all cursor-pointer disabled:cursor-default ${
                    roundWinner !== null
                      ? isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-bold'
                        : isSelected
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-600'
                      : 'bg-slate-900/90 hover:bg-blue-950/60 border-slate-700 hover:border-blue-400 text-slate-200'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-blue-900/80 text-blue-200 font-black text-xs flex items-center justify-center shrink-0 border border-blue-700">
                    {blueKeys[idx]}
                  </span>
                  <span className="grow leading-snug">{opt}</span>
                  {isWinnerChoice && <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* RED TEAM BUZZER PAD */}
        <div className="bg-slate-950/70 border border-rose-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-900/40">
            <div className="flex items-center gap-2 font-black text-rose-400 text-sm sm:text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              {redTeam.name}
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Phím tắt: [U, I, O, P]
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {question.options.map((opt, idx) => {
              const isSelected = redSelected === idx;
              const isCorrect = idx === question.correctIndex;
              const isWinnerChoice = roundWinner === 'red' && isSelected;

              return (
                <button
                  id={`btn-speed-red-${idx}`}
                  key={idx}
                  type="button"
                  disabled={roundWinner !== null}
                  onClick={() => handleChoice('red', idx)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all cursor-pointer disabled:cursor-default ${
                    roundWinner !== null
                      ? isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-bold'
                        : isSelected
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-600'
                      : 'bg-slate-900/90 hover:bg-rose-950/60 border-slate-700 hover:border-rose-400 text-slate-200'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-rose-900/80 text-rose-200 font-black text-xs flex items-center justify-center shrink-0 border border-rose-700">
                    {redKeys[idx]}
                  </span>
                  <span className="grow leading-snug">{opt}</span>
                  {isWinnerChoice && <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explanation & Next Turn button */}
      {roundWinner !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="grow bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-300 block">Kiến thức Địa lý:</span>
              <span>{question.explanation}</span>
            </div>
          </div>

          <button
            id="btn-speed-next"
            type="button"
            onClick={onNextQuestion}
            className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>Câu tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
