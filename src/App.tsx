import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GameMode,
  GameSettings,
  GameStatus,
  LastPullEvent,
  Question,
  Team,
} from './types';
import { getStoredQuestions } from './data/geographyQuestions';
import { CenterTugArena } from './components/CenterTugArena';
import { TeamSideQuestionBoard } from './components/TeamSideQuestionBoard';
import { LobbyScreen } from './components/LobbyScreen';
import { VictoryModal } from './components/VictoryModal';
import { QuestionManagerModal } from './components/QuestionManagerModal';
import { soundManager } from './utils/audio';
import {
  Volume2,
  VolumeX,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Clock,
} from 'lucide-react';

export default function App() {
  // Game Settings
  const [settings, setSettings] = useState<GameSettings>({
    targetRopeToWin: 5,
    timePerQuestion: 20,
    category: 'all',
    mode: 'two_teams_turn',
    botDifficulty: 'medium',
    soundEnabled: true,
  });

  // Teams State
  const [blueTeam, setBlueTeam] = useState<Team>({
    id: 'blue',
    name: 'Đội Xanh',
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    totalAnswered: 0,
    color: 'blue',
    avatar: '🦁',
  });

  const [redTeam, setRedTeam] = useState<Team>({
    id: 'red',
    name: 'Đội Đỏ',
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    totalAnswered: 0,
    color: 'red',
    avatar: '🦅',
  });

  // Game Arena State
  const [status, setStatus] = useState<GameStatus>('lobby');
  const [ropePosition, setRopePosition] = useState<number>(0); // -target (Blue wins) to +target (Red wins)
  const [lastPullEvent, setLastPullEvent] = useState<LastPullEvent | null>(null);

  // Turn tracking for turn-based mode
  const [currentTurn, setCurrentTurn] = useState<'blue' | 'red'>('blue');

  // Questions Pools
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestionDeck, setActiveQuestionDeck] = useState<Question[]>([]);

  // Independent question index pointers for Blue & Red (for parallel or synchronized play)
  const [blueQIndex, setBlueQIndex] = useState<number>(0);
  const [redQIndex, setRedQIndex] = useState<number>(1);

  // Blue Side Question State
  const [blueSelected, setBlueSelected] = useState<number | null>(null);
  const [blueShowResult, setBlueShowResult] = useState<boolean>(false);
  const [blueTimeLeft, setBlueTimeLeft] = useState<number>(20);

  // Red Side Question State
  const [redSelected, setRedSelected] = useState<number | null>(null);
  const [redShowResult, setRedShowResult] = useState<boolean>(false);
  const [redTimeLeft, setRedTimeLeft] = useState<number>(20);

  // Ready Countdown State
  const [countdownNum, setCountdownNum] = useState<number | string>(3);

  // Modals & Sound
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(false);
  const [winnerTeam, setWinnerTeam] = useState<Team | null>(null);
  const [loserTeam, setLoserTeam] = useState<Team | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  // Bot timer ref
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions on mount
  useEffect(() => {
    const list = getStoredQuestions();
    setAllQuestions(list);
  }, []);

  const refreshQuestionsList = useCallback(() => {
    const list = getStoredQuestions();
    setAllQuestions(list);
    setActiveQuestionDeck((prevDeck) => {
      if (prevDeck.length === 0) return list;
      let deck = list;
      if (settings.category !== 'all') {
        const filtered = list.filter((q) => q.category === settings.category);
        if (filtered.length > 0) deck = filtered;
      }
      return deck;
    });
  }, [settings.category]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.enabled = next;
    setSettings((prev) => ({ ...prev, soundEnabled: next }));
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.mode === 'vs_computer') {
        setRedTeam((r) => ({ ...r, name: 'Máy Tính (AI)', avatar: '🤖' }));
      } else if (newSettings.mode && prev.mode === 'vs_computer') {
        setRedTeam((r) => ({ ...r, name: 'Người Chơi 2 (Đỏ)', avatar: '🦅' }));
      }
      return updated;
    });
  };

  const handleUpdateTeam = (teamId: 'blue' | 'red', updates: Partial<Team>) => {
    if (teamId === 'blue') {
      setBlueTeam((prev) => ({ ...prev, ...updates }));
    } else {
      setRedTeam((prev) => ({ ...prev, ...updates }));
    }
  };

  // Start match & initialize both side boards
  const startMatch = () => {
    let filtered = allQuestions;
    if (settings.category !== 'all') {
      filtered = allQuestions.filter((q) => q.category === settings.category);
    }
    if (filtered.length < 2) {
      filtered = allQuestions;
    }
    // Shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setActiveQuestionDeck(shuffled);

    setBlueQIndex(0);
    setRedQIndex(settings.mode === 'speed_battle' ? 0 : 1 % shuffled.length);

    setRopePosition(0);
    setCurrentTurn('blue');
    setLastPullEvent(null);
    setWinnerTeam(null);
    setLoserTeam(null);

    // Reset boards
    setBlueSelected(null);
    setBlueShowResult(false);
    setBlueTimeLeft(settings.timePerQuestion > 0 ? settings.timePerQuestion : 0);

    setRedSelected(null);
    setRedShowResult(false);
    setRedTimeLeft(settings.timePerQuestion > 0 ? settings.timePerQuestion : 0);

    // Reset scores & streaks
    setBlueTeam((b) => ({
      ...b,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      totalAnswered: 0,
    }));
    setRedTeam((r) => ({
      ...r,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      totalAnswered: 0,
    }));

    // Start 3-second ready countdown
    setStatus('countdown');
    setCountdownNum(3);
    soundManager.playTick();

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        soundManager.playTick();
      } else if (count === 0) {
        setCountdownNum('KÉO!');
        soundManager.playWhistle();
      } else {
        clearInterval(interval);
        setStatus('playing');
        const limit = settings.timePerQuestion > 0 ? settings.timePerQuestion : 20;
        setBlueTimeLeft(limit);
        setRedTimeLeft(limit);
      }
    }, 1000);
  };

  // Check victory condition
  const checkKnockout = useCallback(
    (newRopePos: number) => {
      if (Math.abs(newRopePos) >= settings.targetRopeToWin) {
        setTimeout(() => {
          const winner = newRopePos <= -settings.targetRopeToWin ? blueTeam : redTeam;
          const loser = newRopePos <= -settings.targetRopeToWin ? redTeam : blueTeam;
          setWinnerTeam(winner);
          setLoserTeam(loser);
          setStatus('game_over');
        }, 600);
      }
    },
    [settings.targetRopeToWin, blueTeam, redTeam]
  );

  // BLUE TEAM SELECT ANSWER
  const handleBlueAnswer = useCallback(
    (selectedIndex: number) => {
      if (status !== 'playing' || blueShowResult) return;

      const currentQ = activeQuestionDeck[blueQIndex];
      if (!currentQ) return;

      setBlueSelected(selectedIndex);
      setBlueShowResult(true);

      const isCorrect = selectedIndex === currentQ.correctIndex;

      if (isCorrect) {
        const newStreak = blueTeam.streak + 1;
        const isSuper = newStreak >= 2 || (settings.timePerQuestion > 0 && blueTimeLeft >= settings.timePerQuestion * 0.7);
        const strength = isSuper ? 1.5 : 1;

        soundManager.playCorrect();
        setTimeout(() => soundManager.playPull(isSuper), 180);

        setLastPullEvent({
          teamId: 'blue',
          strength,
          isSuperPull: isSuper,
          message: isSuper ? 'KÉO SIÊU CẤP!' : 'KÉO MẠNH!',
          timestamp: Date.now(),
        });

        const newPos = ropePosition - strength; // Blue pulls left (-)
        setRopePosition(newPos);

        setBlueTeam((b) => ({
          ...b,
          score: b.score + 1,
          streak: newStreak,
          maxStreak: Math.max(b.maxStreak, newStreak),
          correctCount: b.correctCount + 1,
          totalAnswered: b.totalAnswered + 1,
        }));

        checkKnockout(newPos);

        // If speed_battle mode, red gets locked out as blue answered correctly first
        if (settings.mode === 'speed_battle') {
          setRedShowResult(true);
        }
      } else {
        soundManager.playWrong();
        setBlueTeam((b) => ({
          ...b,
          streak: 0,
          totalAnswered: b.totalAnswered + 1,
        }));
      }
    },
    [
      status,
      blueShowResult,
      activeQuestionDeck,
      blueQIndex,
      blueTeam.streak,
      settings.timePerQuestion,
      settings.mode,
      blueTimeLeft,
      ropePosition,
      checkKnockout,
    ]
  );

  // RED TEAM SELECT ANSWER
  const handleRedAnswer = useCallback(
    (selectedIndex: number) => {
      if (status !== 'playing' || redShowResult) return;

      const currentQ = activeQuestionDeck[redQIndex];
      if (!currentQ) return;

      setRedSelected(selectedIndex);
      setRedShowResult(true);

      const isCorrect = selectedIndex === currentQ.correctIndex;

      if (isCorrect) {
        const newStreak = redTeam.streak + 1;
        const isSuper = newStreak >= 2 || (settings.timePerQuestion > 0 && redTimeLeft >= settings.timePerQuestion * 0.7);
        const strength = isSuper ? 1.5 : 1;

        soundManager.playCorrect();
        setTimeout(() => soundManager.playPull(isSuper), 180);

        setLastPullEvent({
          teamId: 'red',
          strength,
          isSuperPull: isSuper,
          message: isSuper ? 'KÉO SIÊU CẤP!' : 'KÉO MẠNH!',
          timestamp: Date.now(),
        });

        const newPos = ropePosition + strength; // Red pulls right (+)
        setRopePosition(newPos);

        setRedTeam((r) => ({
          ...r,
          score: r.score + 1,
          streak: newStreak,
          maxStreak: Math.max(r.maxStreak, newStreak),
          correctCount: r.correctCount + 1,
          totalAnswered: r.totalAnswered + 1,
        }));

        checkKnockout(newPos);

        if (settings.mode === 'speed_battle') {
          setBlueShowResult(true);
        }
      } else {
        soundManager.playWrong();
        setRedTeam((r) => ({
          ...r,
          streak: 0,
          totalAnswered: r.totalAnswered + 1,
        }));
      }
    },
    [
      status,
      redShowResult,
      activeQuestionDeck,
      redQIndex,
      redTeam.streak,
      settings.timePerQuestion,
      settings.mode,
      redTimeLeft,
      ropePosition,
      checkKnockout,
    ]
  );

  // Advance Blue Question
  const handleNextBlueQuestion = useCallback(() => {
    if (activeQuestionDeck.length === 0) return;
    const nextIdx = (blueQIndex + 1) % activeQuestionDeck.length;
    setBlueQIndex(nextIdx);
    setBlueSelected(null);
    setBlueShowResult(false);
    const limit = settings.timePerQuestion > 0 ? settings.timePerQuestion : 20;
    setBlueTimeLeft(limit);

    if (settings.mode === 'two_teams_turn' || settings.mode === 'vs_computer') {
      setCurrentTurn('red');
      setRedTimeLeft(limit);
    }
  }, [blueQIndex, activeQuestionDeck.length, settings.timePerQuestion, settings.mode]);

  // Advance Red Question
  const handleNextRedQuestion = useCallback(() => {
    if (activeQuestionDeck.length === 0) return;
    const nextIdx = (redQIndex + 1) % activeQuestionDeck.length;
    setRedQIndex(nextIdx);
    setRedSelected(null);
    setRedShowResult(false);
    const limit = settings.timePerQuestion > 0 ? settings.timePerQuestion : 20;
    setRedTimeLeft(limit);

    if (settings.mode === 'two_teams_turn' || settings.mode === 'vs_computer') {
      setCurrentTurn('blue');
      setBlueTimeLeft(limit);
    }
  }, [redQIndex, activeQuestionDeck.length, settings.timePerQuestion, settings.mode]);

  // Shared next question for speed battle
  const handleNextSharedQuestion = useCallback(() => {
    handleNextBlueQuestion();
    handleNextRedQuestion();
  }, [handleNextBlueQuestion, handleNextRedQuestion]);

  // Blue timer loop
  useEffect(() => {
    if (status !== 'playing' || blueShowResult || settings.timePerQuestion === 0) return;
    if (settings.mode === 'two_teams_turn' && currentTurn !== 'blue') return;

    const timer = setInterval(() => {
      setBlueTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleBlueAnswer(-1); // timeout wrong answer
          return 0;
        }
        if (prev <= 4) soundManager.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    status,
    blueShowResult,
    settings.timePerQuestion,
    settings.mode,
    currentTurn,
    handleBlueAnswer,
  ]);

  // Red timer loop
  useEffect(() => {
    if (status !== 'playing' || redShowResult || settings.timePerQuestion === 0) return;
    if (settings.mode === 'two_teams_turn' && currentTurn !== 'red') return;
    if (settings.mode === 'vs_computer' && currentTurn !== 'red') return;

    const timer = setInterval(() => {
      setRedTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    status,
    redShowResult,
    settings.timePerQuestion,
    settings.mode,
    currentTurn,
    handleRedAnswer,
  ]);

  // Bot logic when playing against computer
  useEffect(() => {
    if (
      status === 'playing' &&
      !redShowResult &&
      settings.mode === 'vs_computer' &&
      currentTurn === 'red'
    ) {
      const currentQ = activeQuestionDeck[redQIndex];
      if (!currentQ) return;

      let accuracy = 0.55;
      if (settings.botDifficulty === 'medium') accuracy = 0.75;
      if (settings.botDifficulty === 'hard') accuracy = 0.92;

      const isBotCorrect = Math.random() < accuracy;
      let chosenIndex = currentQ.correctIndex;
      if (!isBotCorrect) {
        const wrongs = [0, 1, 2, 3].filter((i) => i !== currentQ.correctIndex);
        chosenIndex = wrongs[Math.floor(Math.random() * wrongs.length)];
      }

      // Thinking delay: 1.6 - 2.8s
      const delay = Math.floor(Math.random() * 1200) + 1600;

      botTimerRef.current = setTimeout(() => {
        handleRedAnswer(chosenIndex);

        // Auto advance computer after viewing result for 2 seconds
        setTimeout(() => {
          handleNextRedQuestion();
        }, 2200);
      }, delay);

      return () => {
        if (botTimerRef.current) clearTimeout(botTimerRef.current);
      };
    }
  }, [
    status,
    redShowResult,
    settings.mode,
    settings.botDifficulty,
    currentTurn,
    activeQuestionDeck,
    redQIndex,
    handleRedAnswer,
    handleNextRedQuestion,
  ]);

  const blueQuestion = activeQuestionDeck[blueQIndex] || null;
  const redQuestion =
    settings.mode === 'speed_battle'
      ? blueQuestion
      : activeQuestionDeck[redQIndex] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {status !== 'lobby' && (
              <button
                id="btn-nav-lobby"
                type="button"
                onClick={() => setStatus('lobby')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Về sảnh trò chơi"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xl">🇻🇳</span>
              <h2 className="font-black text-sm sm:text-base text-white tracking-wide">
                ĐẤU TRÍ KÉO CO <span className="text-amber-400">ĐỊA LÝ</span>
              </h2>
            </div>
          </div>

          {/* Center mode & timer badge */}
          {status !== 'lobby' && (
            <div className="hidden md:flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {settings.mode === 'vs_computer'
                    ? `🤖 Chơi Với Máy (${settings.botDifficulty === 'easy' ? 'Dễ' : settings.botDifficulty === 'medium' ? 'Vừa' : 'Cao Thủ'})`
                    : settings.mode === 'speed_battle'
                    ? '👥 2 Người Cùng Chơi (Đua Tốc Độ)'
                    : '👥 2 Người Cùng Chơi (Luân Phiên)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Giới hạn: {settings.timePerQuestion > 0 ? `${settings.timePerQuestion}s / câu` : 'Tự do'}</span>
              </div>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-top-question-bank"
              type="button"
              onClick={() => setIsQuestionManagerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ngân hàng</span> ({allQuestions.length})
            </button>

            <button
              id="btn-top-sound"
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="grow max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col justify-center">
        {status === 'lobby' ? (
          <LobbyScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            blueTeam={blueTeam}
            redTeam={redTeam}
            onUpdateTeam={handleUpdateTeam}
            onStartGame={startMatch}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
            totalQuestionsCount={allQuestions.length}
          />
        ) : status === 'countdown' ? (
          /* Ready Countdown Overlay */
          <div className="w-full max-w-lg mx-auto py-16 px-6 bg-slate-900/90 border border-slate-800 rounded-3xl flex flex-col items-center justify-center shadow-2xl text-center">
            <span className="text-xs font-black uppercase text-amber-400 tracking-widest mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              CHUẨN BỊ BƯỚC VÀO SÂN ĐẤU
            </span>
            <motion.div
              key={countdownNum}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className={`text-7xl sm:text-9xl font-black my-4 ${
                countdownNum === 'KÉO!' ? 'text-amber-400 animate-pulse' : 'text-white'
              }`}
            >
              {countdownNum}
            </motion.div>
            <div className="text-sm text-slate-400 font-bold">
              Bản kéo co ở giữa — Hai đội hai bên sẵn sàng giật dây!
            </div>
          </div>
        ) : (
          /* 3-COLUMN BATTLE LAYOUT:
             [ BẢNG CÂU HỎI BÊN TRÁI ] --- [ BẢN KÉO CO Ở GIỮA ] --- [ BẢNG CÂU HỎI BÊN PHẢI ]
          */
          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[980px] xl:min-w-full grid grid-cols-12 gap-3 lg:gap-4 items-stretch">
              {/* 1. CỘT BÊN TRÁI: BẢNG CÂU HỎI ĐỘI XANH */}
              <div className="col-span-4 flex flex-col">
                <TeamSideQuestionBoard
                  team={blueTeam}
                  question={blueQuestion}
                  isActive={
                    settings.mode !== 'two_teams_turn' || currentTurn === 'blue'
                  }
                  isComputer={false}
                  selectedAnswer={blueSelected}
                  showResult={blueShowResult}
                  timeLeft={blueTimeLeft}
                  maxTime={settings.timePerQuestion}
                  hotkeys={['1', '2', '3', '4']}
                  onSelectAnswer={handleBlueAnswer}
                  onNextQuestion={
                    settings.mode === 'speed_battle'
                      ? handleNextSharedQuestion
                      : handleNextBlueQuestion
                  }
                  isTurnBased={settings.mode === 'two_teams_turn'}
                  nextButtonLabel={
                    settings.mode === 'two_teams_turn'
                      ? `Chuyển lượt sang ${redTeam.name} ➡️`
                      : settings.mode === 'vs_computer'
                      ? 'Chuyển lượt sang Máy (AI) ➡️'
                      : 'Câu tiếp theo ➡️'
                  }
                />
              </div>

              {/* 2. CỘT Ở GIỮA: BẢN KÉO CO (SÂN ĐẤU & DÂY THỪNG) */}
              <div className="col-span-4 flex flex-col">
                <CenterTugArena
                  blueTeam={blueTeam}
                  redTeam={redTeam}
                  ropePosition={ropePosition}
                  targetRopeToWin={settings.targetRopeToWin}
                  lastPullEvent={lastPullEvent}
                  activeTeamId={
                    settings.mode === 'two_teams_turn' || settings.mode === 'vs_computer'
                      ? currentTurn
                      : 'both'
                  }
                />
              </div>

              {/* 3. CỘT BÊN PHẢI: BẢNG CÂU HỎI ĐỘI ĐỎ (HOẶC MÁY TÍNH AI) */}
              <div className="col-span-4 flex flex-col">
                <TeamSideQuestionBoard
                  team={redTeam}
                  question={redQuestion}
                  isActive={
                    settings.mode !== 'two_teams_turn' || currentTurn === 'red'
                  }
                  isComputer={settings.mode === 'vs_computer'}
                  selectedAnswer={redSelected}
                  showResult={redShowResult}
                  timeLeft={redTimeLeft}
                  maxTime={settings.timePerQuestion}
                  hotkeys={['7', '8', '9', '0']}
                  onSelectAnswer={handleRedAnswer}
                  onNextQuestion={
                    settings.mode === 'speed_battle'
                      ? handleNextSharedQuestion
                      : handleNextRedQuestion
                  }
                  isTurnBased={settings.mode === 'two_teams_turn' || settings.mode === 'vs_computer'}
                  nextButtonLabel={
                    settings.mode === 'two_teams_turn' || settings.mode === 'vs_computer'
                      ? `⬅️ Chuyển lượt sang ${blueTeam.name}`
                      : 'Câu tiếp theo ➡️'
                  }
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-2.5 text-center text-xs text-slate-500">
        Trò chơi Kéo Co Môn Địa Lý — Bản kéo co ở giữa hai bảng câu hỏi đối kháng
      </footer>

      {/* Question Manager Modal */}
      {isQuestionManagerOpen && (
        <QuestionManagerModal
          questions={allQuestions}
          onClose={() => setIsQuestionManagerOpen(false)}
          onRefreshQuestions={refreshQuestionsList}
        />
      )}

      {/* Victory Celebration Modal */}
      {status === 'game_over' && winnerTeam && loserTeam && (
        <VictoryModal
          winner={winnerTeam}
          loser={loserTeam}
          ropePosition={ropePosition}
          onRestart={startMatch}
          onHome={() => setStatus('lobby')}
        />
      )}
    </div>
  );
}
