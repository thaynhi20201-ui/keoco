import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GameMode, BotDifficulty, QuestionCategory, GameSettings, Team } from '../types';
import {
  Users,
  Bot,
  Zap,
  Volume2,
  VolumeX,
  BookOpen,
  Play,
  Settings2,
  Compass,
  Award,
  Globe2,
  Sparkles,
  Clock,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LobbyScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  blueTeam: Team;
  redTeam: Team;
  onUpdateTeam: (teamId: 'blue' | 'red', updates: Partial<Team>) => void;
  onStartGame: () => void;
  onOpenQuestionManager: () => void;
  totalQuestionsCount: number;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  settings,
  onUpdateSettings,
  blueTeam,
  redTeam,
  onUpdateTeam,
  onStartGame,
  onOpenQuestionManager,
  totalQuestionsCount,
}) => {
  const [soundOn, setSoundOn] = useState(settings.soundEnabled);

  const avatars = ['🦁', '🦅', '🐉', '⚡', '🐯', '🐺', '🦊', '🐻', '🔥', '🚀'];

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.enabled = next;
    onUpdateSettings({ soundEnabled: next });
    if (next) soundManager.playTick();
  };

  const categories: { id: QuestionCategory; name: string; icon: string }[] = [
    { id: 'all', name: 'Tất Cả Chủ Đề', icon: '🌏' },
    { id: 'vietnam_nature', name: 'Địa Lý Tự Nhiên VN', icon: '🏞️' },
    { id: 'vietnam_economy', name: 'Kinh Tế - Dân Cư VN', icon: '🌾' },
    { id: 'world_geo', name: 'Địa Lý Thế Giới', icon: '🏔️' },
    { id: 'climate_earth', name: 'Trái Đất & Bản Đồ', icon: '🧭' },
    { id: 'capitals_flags', name: 'Thủ Đô & Quốc Gia', icon: '🏛️' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      {/* Hero Header */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Đấu Trường Kiến Thức Môn Địa Lý
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight flex items-center justify-center gap-3">
          <span className="text-blue-500 drop-shadow-[0_4px_12px_rgba(59,130,246,0.5)]">KÉO</span>
          <span className="text-amber-400">CO</span>
          <span className="text-rose-500 drop-shadow-[0_4px_12px_rgba(239,68,68,0.5)]">ĐỊA LÝ</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-2 font-medium">
          Trả lời đúng câu hỏi trắc nghiệm Địa lý để tích lũy sức mạnh, kéo căng sợi dây và đánh bại đối thủ!
        </p>
      </div>

      {/* Mode Selector: Chơi Với Máy hoặc Hai Người Cùng Chơi */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-amber-400" />
          1. Chọn Hình Thức Chơi: Chơi Với Máy hoặc Hai Người Cùng Chơi
        </div>

        {/* Primary 2-Mode Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Option 1: CHƠI VỚI MÁY (1 Người) */}
          <button
            id="mode-tab-vs-computer"
            type="button"
            onClick={() => onUpdateSettings({ mode: 'vs_computer' })}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
              settings.mode === 'vs_computer'
                ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/40 text-white shadow-xl shadow-blue-500/10'
                : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              settings.mode === 'vs_computer'
                ? 'bg-blue-600/30 text-blue-400 border-blue-400/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <Bot className="w-6 h-6" />
            </div>
            <div className="grow">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-black text-sm sm:text-base text-white">
                  🤖 Chơi Với Máy (1 Người)
                </span>
                {settings.mode === 'vs_computer' && (
                  <span className="text-[11px] font-black text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                    Đang chọn
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tập luyện hoặc so tài đơn độc cùng AI. Máy tính tự suy nghĩ và đối đầu kịch tính với 3 cấp độ!
              </p>
            </div>
          </button>

          {/* Option 2: HAI NGƯỜI CÙNG CHƠI (2 Người / 2 Đội) */}
          <button
            id="mode-tab-two-players"
            type="button"
            onClick={() => {
              if (settings.mode === 'vs_computer') {
                onUpdateSettings({ mode: 'two_teams_turn' });
              }
            }}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
              settings.mode !== 'vs_computer'
                ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40 text-white shadow-xl shadow-amber-500/10'
                : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              settings.mode !== 'vs_computer'
                ? 'bg-amber-600/30 text-amber-400 border-amber-400/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <Users className="w-6 h-6" />
            </div>
            <div className="grow">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-black text-sm sm:text-base text-white">
                  👥 Hai Người Cùng Chơi (2 Bên)
                </span>
                {settings.mode !== 'vs_computer' && (
                  <span className="text-[11px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                    Đang chọn
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                2 bạn cùng chơi trên 1 máy tính / màn hình. Bảng câu hỏi phân chia Trái - Phải trực quan!
              </p>
            </div>
          </button>
        </div>

        {/* Sub-options for VS COMPUTER */}
        {settings.mode === 'vs_computer' ? (
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-400" />
                Cài đặt độ thông minh của Máy Tính AI:
              </span>
              <div className="flex items-center gap-1.5">
                {(['easy', 'medium', 'hard'] as BotDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onUpdateSettings({ botDifficulty: diff })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      settings.botDifficulty === diff
                        ? 'bg-blue-500 text-slate-950 font-black shadow-md shadow-blue-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff === 'easy' ? 'Dễ (50% đúng)' : diff === 'medium' ? 'Vừa Sức (75% đúng)' : 'Cao Thủ (90% đúng)'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-blue-300/80 leading-relaxed">
              💡 <strong>Cách chơi:</strong> Bạn điều khiển bảng câu hỏi bên <strong>Trái (Đội Xanh)</strong> bằng chuột hoặc phím <strong>[1, 2, 3, 4]</strong> (hoặc <strong>[A, B, C, D]</strong>). Máy tính AI sẽ tự động suy nghĩ và thi đấu ở bảng bên Phải!
            </p>
          </div>
        ) : (
          /* Sub-options for 2 PLAYERS */
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Chọn cách thức so tài giữa 2 người:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ mode: 'two_teams_turn' })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.mode === 'two_teams_turn'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Luân Phiên Từng Người (20s/câu) ⭐
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ mode: 'speed_battle' })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.mode === 'speed_battle'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Đua Tốc Độ (Bấm Chuông) ⚡
                </button>
              </div>
            </div>

            {/* Keyboard layout guide for 2 players */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-amber-500/20">
              <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200">
                <span className="font-black text-blue-300">👤 Người Chơi 1 (Bên Trái):</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Bấm chuột/chạm bảng Trái, hoặc dùng phím <strong className="text-amber-300">[1, 2, 3, 4]</strong> / <strong className="text-amber-300">[A, B, C, D]</strong>
                </p>
              </div>
              <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200">
                <span className="font-black text-rose-300">👤 Người Chơi 2 (Bên Phải):</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Bấm chuột/chạm bảng Phải, hoặc dùng phím <strong className="text-amber-300">[7, 8, 9, 0]</strong> / <strong className="text-amber-300">[U, I, O, P]</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Teams Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blue Team Setup */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              {settings.mode === 'vs_computer'
                ? 'Người Chơi (Bên Trái - Xanh)'
                : 'Người Chơi 1 (Bên Trái - Xanh)'}
            </span>
            <span className="text-xl">{blueTeam.avatar}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Tên Đội / Học Sinh</label>
              <input
                id="input-blue-team-name"
                type="text"
                value={blueTeam.name}
                onChange={(e) => onUpdateTeam('blue', { name: e.target.value })}
                placeholder="Người Chơi 1 / Đội Xanh"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-blue-300 font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Linh Vật Đại Diện</label>
              <div className="flex flex-wrap gap-1.5">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => onUpdateTeam('blue', { avatar: av })}
                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center cursor-pointer transition-transform ${
                      blueTeam.avatar === av
                        ? 'bg-blue-600 scale-110 shadow'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Red Team Setup */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              {settings.mode === 'vs_computer'
                ? '🤖 Đối Thủ Máy Tính AI (Bên Phải)'
                : 'Người Chơi 2 (Bên Phải - Đỏ)'}
            </span>
            <span className="text-xl">{redTeam.avatar}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Tên Đội / Học Sinh</label>
              <input
                id="input-red-team-name"
                type="text"
                value={redTeam.name}
                disabled={settings.mode === 'vs_computer'}
                onChange={(e) => onUpdateTeam('red', { name: e.target.value })}
                placeholder={settings.mode === 'vs_computer' ? 'Máy Tính (AI)' : 'Người Chơi 2 / Đội Đỏ'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-rose-300 font-bold focus:outline-none focus:border-rose-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                {settings.mode === 'vs_computer' ? 'Linh Vật Máy Tính' : 'Linh Vật Đại Diện'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    disabled={settings.mode === 'vs_computer'}
                    onClick={() => onUpdateTeam('red', { avatar: av })}
                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center cursor-pointer transition-transform ${
                      redTeam.avatar === av
                        ? 'bg-rose-600 scale-110 shadow'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
          <Globe2 className="w-4 h-4 text-amber-400" />
          2. Chọn Chủ Đề Môn Địa Lý
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onUpdateSettings({ category: cat.id })}
              className={`p-3 rounded-2xl border text-left font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
                settings.category === cat.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Match Parameters & Rules */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Knockout steps */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Khoảng cách thắng:</span>
          {[3, 5, 7].map((steps) => (
            <button
              key={steps}
              type="button"
              onClick={() => onUpdateSettings({ targetRopeToWin: steps })}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                settings.targetRopeToWin === steps
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {steps} Nấc kéo
            </button>
          ))}
        </div>

        {/* Time per question */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Giới hạn thời gian:
          </span>
          {[
            { value: 20, label: '20 giây (Chuẩn ⭐)' },
            { value: 15, label: '15 giây' },
            { value: 30, label: '30 giây' },
            { value: 0, label: 'Không giới hạn' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onUpdateSettings({ timePerQuestion: item.value })}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                settings.timePerQuestion === item.value
                  ? 'bg-amber-400 text-slate-950 font-black shadow ring-2 ring-amber-300/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Sound toggle */}
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={toggleSound}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
            soundOn
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{soundOn ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
        </button>
      </div>

      {/* Bottom Main Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <button
          id="btn-open-question-manager"
          type="button"
          onClick={onOpenQuestionManager}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Ngân hàng câu hỏi ({totalQuestionsCount})</span>
        </button>

        <button
          id="btn-start-game"
          type="button"
          onClick={onStartGame}
          className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base sm:text-lg tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-transform active:scale-95"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>BẮT ĐẦU TRẬN ĐẤU KÉO CO!</span>
        </button>
      </div>
    </div>
  );
};
