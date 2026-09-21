import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Team } from '../types';
import { Clock, CheckCircle2, XCircle, ArrowRight, HelpCircle, Flame, Bot, Lock, Lightbulb, Sparkles, Keyboard } from 'lucide-react';

interface TeamSideQuestionBoardProps {
  team: Team;
  question: Question | null;
  isActive: boolean;
  isComputer?: boolean;
  selectedAnswer: number | null;
  showResult: boolean;
  timeLeft: number;
  maxTime: number;
  hotkeys: [string, string, string, string]; // e.g. ['Q','W','E','R'] or ['U','I','O','P'] or ['1','2','3','4']
  onSelectAnswer: (index: number) => void;
  onNextQuestion: () => void;
  isTurnBased?: boolean;
  nextButtonLabel?: string;
}

export const TeamSideQuestionBoard: React.FC<TeamSideQuestionBoardProps> = ({
  team,
  question,
  isActive,
  isComputer = false,
  selectedAnswer,
  showResult,
  timeLeft,
  maxTime,
  hotkeys,
  onSelectAnswer,
  onNextQuestion,
  isTurnBased = false,
  nextButtonLabel,
}) => {
  const letters = ['A', 'B', 'C', 'D'];
  const isBlue = team.id === 'blue';

  // Keyboard shortcut listener for active human player
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is currently focused on an input element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (!isActive || isComputer) return;

      if (showResult) {
        // Press Enter or Space to continue to next turn
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          onNextQuestion();
        }
        return;
      }

      const key = e.key ? e.key.toUpperCase() : '';
      const code = e.code || '';
      let matchIdx = -1;

      // 1. Direct check for Letters A, B, C, D (supports code KeyA..KeyD, key A..D, and Vietnamese typing)
      if (
        code === 'KeyA' ||
        key === 'A' ||
        key === 'Á' ||
        key === 'À' ||
        key === 'Ả' ||
        key === 'Ã' ||
        key === 'Ạ' ||
        key === 'Â' ||
        key === 'Ă'
      ) {
        matchIdx = 0;
      } else if (code === 'KeyB' || key === 'B') {
        matchIdx = 1;
      } else if (code === 'KeyC' || key === 'C') {
        matchIdx = 2;
      } else if (code === 'KeyD' || key === 'D' || key === 'Đ') {
        matchIdx = 3;
      }

      // 2. In simultaneous 2-player Speed Battle, Red uses U, I, O, P (or 7, 8, 9, 0)
      // to prevent conflict with Blue's A, B, C, D on the shared keyboard.
      if (!isTurnBased && !isBlue) {
        if (code === 'KeyU' || key === 'U') matchIdx = 0;
        else if (code === 'KeyI' || key === 'I') matchIdx = 1;
        else if (code === 'KeyO' || key === 'O') matchIdx = 2;
        else if (code === 'KeyP' || key === 'P') matchIdx = 3;
        else if (code === 'Digit7' || code === 'Numpad7' || key === '7') matchIdx = 0;
        else if (code === 'Digit8' || code === 'Numpad8' || key === '8') matchIdx = 1;
        else if (code === 'Digit9' || code === 'Numpad9' || key === '9') matchIdx = 2;
        else if (code === 'Digit0' || code === 'Numpad0' || key === '0') matchIdx = 3;
      } else {
        // For Blue (all modes) AND for Red (when turn-based / solo):
        // Also support numbers 1, 2, 3, 4
        if (matchIdx === -1) {
          if (code === 'Digit1' || code === 'Numpad1' || key === '1') matchIdx = 0;
          else if (code === 'Digit2' || code === 'Numpad2' || key === '2') matchIdx = 1;
          else if (code === 'Digit3' || code === 'Numpad3' || key === '3') matchIdx = 2;
          else if (code === 'Digit4' || code === 'Numpad4' || key === '4') matchIdx = 3;
        }
        // In addition, if Red has alternate keys like U,I,O,P or 7,8,9,0 in turn-based, still support them
        if (matchIdx === -1 && !isBlue) {
          if (code === 'KeyU' || key === 'U' || code === 'Digit7' || code === 'Numpad7' || key === '7') matchIdx = 0;
          else if (code === 'KeyI' || key === 'I' || code === 'Digit8' || code === 'Numpad8' || key === '8') matchIdx = 1;
          else if (code === 'KeyO' || key === 'O' || code === 'Digit9' || code === 'Numpad9' || key === '9') matchIdx = 2;
          else if (code === 'KeyP' || key === 'P' || code === 'Digit0' || code === 'Numpad0' || key === '0') matchIdx = 3;
        }
      }

      if (matchIdx !== -1) {
        e.preventDefault();
        onSelectAnswer(matchIdx);
      }
    },
    [isActive, isComputer, showResult, isTurnBased, isBlue, onSelectAnswer, onNextQuestion]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const progressRatio = maxTime > 0 ? Math.max(0, timeLeft / maxTime) : 1;

  return (
    <div
      id={`team-side-board-${team.id}`}
      className={`w-full h-full rounded-3xl transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden ${
        isActive
          ? 'bg-slate-900 border-2 border-amber-400 ring-4 ring-amber-400/35 shadow-[0_0_35px_rgba(251,191,36,0.35)]'
          : 'bg-slate-950/80 border-2 border-slate-800/80 opacity-65 grayscale-[35%]'
      }`}
    >
      {/* Yellow Spotlight Aura when Active */}
      {isActive && (
        <>
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-amber-400/20 via-yellow-400/5 to-transparent pointer-events-none" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-400/35 blur-3xl rounded-full pointer-events-none animate-pulse" />
        </>
      )}

      {/* Background corner light */}
      <div
        className={`absolute -top-12 ${
          isBlue ? '-left-12 bg-blue-500/10' : '-right-12 bg-rose-500/10'
        } w-44 h-44 rounded-full blur-3xl pointer-events-none`}
      />

      {/* Top Section */}
      <div>
        {/* PROMINENT YELLOW LIGHT STATUS BANNER */}
        {isActive ? (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-yellow-400/35 to-amber-500/25 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] mb-3 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping absolute" />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-300 shadow-[0_0_12px_#fde047] relative z-10" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 tracking-wide uppercase">
                <Lightbulb className="w-4 h-4 text-yellow-300 fill-yellow-400" />
                <span>ĐÈN VÀNG SÁNG: ĐANG TỚI LƯỢT {team.name.toUpperCase()}!</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow">
              ĐANG THI ĐẤU
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 py-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-3 text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-[11px] font-bold text-slate-400">Đèn Tắt • Đang chờ đối thủ trả lời</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Chờ lượt</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black shadow-md border ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
                    : isBlue
                    ? 'bg-blue-600/30 border-blue-500/50 text-white'
                    : 'bg-rose-600/30 border-rose-500/50 text-white'
                }`}
              >
                {isComputer ? <Bot className="w-5 h-5 text-rose-300" /> : team.avatar}
              </div>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-900 shadow-[0_0_8px_#fde047] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </span>
              )}
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <span>{isBlue ? '⬅️ BẢNG CÂU HỎI BÊN TRÁI' : 'BẢNG CÂU HỎI BÊN PHẢI ➡️'}</span>
                {isActive && (
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-amber-400" /> [Sáng Đèn Vàng]
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <h3
                  className={`font-black text-sm sm:text-base tracking-wide ${
                    isActive ? 'text-amber-300' : isBlue ? 'text-blue-400' : 'text-rose-400'
                  }`}
                >
                  {team.name}
                </h3>
                {team.streak >= 2 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    x{team.streak}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                Điểm: <strong className="text-white">{team.score}</strong> câu đúng
              </span>
            </div>
          </div>

          {/* Turn indicator or Timer */}
          {isActive && maxTime > 0 && !showResult ? (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-300 ${
                timeLeft <= 5
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/30 animate-pulse'
                  : timeLeft <= 10
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                  : 'bg-slate-950 border-slate-700 text-slate-200'
              }`}
            >
              <Clock
                className={`w-4 h-4 shrink-0 ${
                  timeLeft <= 5 ? 'text-rose-400 animate-spin' : 'text-amber-400'
                }`}
              />
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-base font-black leading-none tracking-tight">
                  {timeLeft}s
                </span>
                <span className="text-[10px] font-bold text-slate-400 leading-none">
                  / {maxTime}s
                </span>
              </div>
            </div>
          ) : isTurnBased && !isActive ? (
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Chờ lượt (20s/câu)</span>
            </div>
          ) : null}
        </div>

        {/* 20-Second Countdown Progress Bar */}
        {isActive && maxTime > 0 && !showResult && (
          <div className="mb-3 bg-slate-950/90 p-2 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-300 mb-1.5 px-0.5">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Giới hạn thời gian: 20 giây</span>
              </span>
              <span
                className={`font-mono font-extrabold ${
                  timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                }`}
              >
                {timeLeft === 0 ? 'HẾT GIỜ!' : `Còn ${timeLeft} giây`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  timeLeft <= 5
                    ? 'bg-gradient-to-r from-rose-600 to-red-400'
                    : timeLeft <= 10
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : isBlue
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
                    : 'bg-gradient-to-r from-rose-600 to-amber-400'
                }`}
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question Area */}
        {question ? (
          <div className="space-y-3">
            {/* Category and Keyboard Hint Tag */}
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-950 text-slate-400 border border-slate-800">
                {question.categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono">
                {isComputer ? (
                  <span className="text-slate-400 text-[10px]">🤖 Máy tự động trả lời</span>
                ) : isActive ? (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(251,191,36,0.3)] animate-pulse">
                    <Keyboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {!isTurnBased && !isBlue
                        ? 'Bấm phím: [U, I, O, P] hoặc [7, 8, 9, 0]'
                        : 'Bấm phím: [A, B, C, D] hoặc [1, 2, 3, 4]'}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[10px]">Chờ lượt đối thủ...</span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug min-h-[52px]">
              {question.question}
            </h4>

            {/* Computer thinking state */}
            {isComputer && isActive && !showResult && (
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-rose-300 animate-pulse">
                  Máy tính đang suy nghĩ đáp án...
                </span>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {question.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === question.correctIndex;

                let optClass =
                  'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600';

                if (showResult) {
                  if (isCorrect) {
                    optClass =
                      'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400/50 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optClass =
                      'bg-rose-950/90 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                  } else {
                    optClass = 'bg-slate-950/40 border-slate-900 text-slate-600';
                  }
                } else if (!isActive) {
                  optClass = 'bg-slate-950/50 border-slate-900 text-slate-500 cursor-not-allowed';
                }

                const showStandardAKey = isTurnBased || isBlue;
                const keyLetter = showStandardAKey ? letters[idx] : ['U', 'I', 'O', 'P'][idx];
                const keyNumber = showStandardAKey ? String(idx + 1) : ['7', '8', '9', '0'][idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isActive || showResult || isComputer}
                    onClick={() => onSelectAnswer(idx)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left font-medium text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-150 cursor-pointer disabled:cursor-default relative group ${optClass}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105 ${
                        showResult && isCorrect
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black'
                          : showResult && isSelected
                          ? 'bg-rose-500 text-white border-rose-400'
                          : isActive
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      {letters[idx]}
                    </span>

                    <span className="grow leading-snug">{opt}</span>

                    {/* Hotkey preview tag for keyboard players */}
                    {isActive && !isComputer && !showResult && (
                      <span className="shrink-0 text-[11px] font-mono font-black px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 shadow-sm flex items-center gap-1 group-hover:border-amber-400 group-hover:bg-amber-400/10">
                        <Keyboard className="w-3 h-3 text-amber-400" />
                        <span>Phím {keyLetter}</span>
                        <span className="text-[9px] text-slate-400">({keyNumber})</span>
                      </span>
                    )}

                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-xs">
            Đang nạp câu hỏi...
          </div>
        )}
      </div>

      {/* Bottom Result & Next Action */}
      {showResult && question && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-3 mt-3 border-t border-slate-800 flex flex-col gap-2"
        >
          {/* Timeout Alert if time expired (selectedAnswer === -1) */}
          {selectedAnswer === -1 && (
            <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
              <span>⏰ HẾT THỜI GIAN 20 GIÂY! Không kịp chọn đáp án (bị tính là sai và mất lượt).</span>
            </div>
          )}

          {/* Explanation */}
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] sm:text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Ghi nhớ: </span>
              {question.explanation}
            </div>
          </div>

          {/* Next Button for this team */}
          <button
            type="button"
            onClick={onNextQuestion}
            className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm text-white shadow-md cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95 ${
              isBlue
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/25'
            }`}
          >
            <span>{nextButtonLabel || (isTurnBased ? (isBlue ? 'Chuyển lượt sang Đội Đỏ' : 'Chuyển lượt sang Đội Xanh') : 'Câu tiếp theo')}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 border border-white/20 text-slate-200 hidden sm:inline">
              [Phím Cách / Enter ↵]
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
