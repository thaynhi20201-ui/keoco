import React, { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Question, Team } from '../types';
import { Clock, CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentTeam: Team;
  isComputerTurn?: boolean;
  timeLeft: number;
  maxTime: number;
  selectedAnswer: number | null;
  showResult: boolean;
  onSelectAnswer: (index: number) => void;
  onNextQuestion: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentTeam,
  isComputerTurn = false,
  timeLeft,
  maxTime,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  onNextQuestion,
}) => {
  const letters = ['A', 'B', 'C', 'D'];

  // Keyboard shortcut listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (showResult) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNextQuestion();
        }
        return;
      }
      if (isComputerTurn) return;

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') onSelectAnswer(0);
      else if (key === 'B' || key === '2') onSelectAnswer(1);
      else if (key === 'C' || key === '3') onSelectAnswer(2);
      else if (key === 'D' || key === '4') onSelectAnswer(3);
    },
    [showResult, isComputerTurn, onSelectAnswer, onNextQuestion]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isBlue = currentTeam.id === 'blue';
  const progressRatio = maxTime > 0 ? Math.max(0, timeLeft / maxTime) : 1;

  return (
    <div
      id="question-card"
      className={`w-full rounded-3xl border transition-all duration-300 shadow-xl p-5 sm:p-7 relative overflow-hidden ${
        isBlue
          ? 'bg-slate-900/95 border-blue-500/30'
          : 'bg-slate-900/95 border-rose-500/30'
      }`}
    >
      {/* Turn & Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow ${
              isBlue
                ? 'bg-blue-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <span>LƯỢT CỦA:</span>
            <span className="underline decoration-2 underline-offset-2">
              {currentTeam.name}
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {question.categoryName}
          </span>
        </div>

        {/* Timer Display */}
        {maxTime > 0 && (
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 ${
                timeLeft <= 5 ? 'text-rose-400 animate-bounce' : 'text-amber-400'
              }`}
            />
            <div className="w-24 sm:w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  timeLeft <= 5
                    ? 'bg-rose-500'
                    : timeLeft <= 10
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
            <span
              className={`font-mono font-black text-sm ${
                timeLeft <= 5 ? 'text-rose-400 font-extrabold' : 'text-slate-200'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug tracking-tight">
          {question.question}
        </h3>
      </div>

      {/* Computer Thinking Indicator */}
      {isComputerTurn && !showResult && (
        <div className="flex items-center justify-center gap-3 py-6 bg-slate-950/60 rounded-2xl border border-slate-800 my-2">
          <div className="w-5 h-5 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-rose-300 text-sm font-bold animate-pulse">
            Đối thủ máy tính đang suy nghĩ câu trả lời...
          </span>
        </div>
      )}

      {/* 4 Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === question.correctIndex;

          let optionStyle =
            'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-200 hover:border-slate-500';

          if (showResult) {
            if (isCorrect) {
              optionStyle =
                'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20';
            } else if (isSelected && !isCorrect) {
              optionStyle =
                'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/20';
            } else {
              optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              id={`question-option-${letters[idx].toLowerCase()}`}
              key={idx}
              type="button"
              disabled={showResult || isComputerTurn}
              onClick={() => onSelectAnswer(idx)}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left font-medium transition-all duration-200 cursor-pointer disabled:cursor-default relative group ${optionStyle}`}
            >
              {/* Option Letter Tag */}
              <div
                className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 border transition-colors ${
                  showResult && isCorrect
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                    : showResult && isSelected
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-slate-900 text-slate-300 border-slate-700 group-hover:border-slate-500'
                }`}
              >
                {letters[idx]}
              </div>

              {/* Option Text */}
              <span className="text-sm sm:text-base font-semibold grow leading-snug">
                {option}
              </span>

              {/* Checkmark or Cross icons */}
              {showResult && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-scale-in" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result Explanation & Next Button */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Explanation Box */}
          <div className="grow bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-300 block mb-0.5">
                Kiến thức Địa lý ghi nhớ:
              </span>
              <span>{question.explanation}</span>
            </div>
          </div>

          {/* Next Turn Button */}
          <button
            id="btn-next-question"
            type="button"
            onClick={onNextQuestion}
            className={`w-full sm:w-auto shrink-0 px-6 py-3 rounded-2xl font-black text-sm sm:text-base text-white shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95 ${
              isBlue
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25'
                : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-500/25'
            }`}
          >
            <span>Câu tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
