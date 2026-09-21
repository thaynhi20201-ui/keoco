export type GameMode = 'vs_computer' | 'two_teams_turn' | 'speed_battle';

export type BotDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionCategory = 
  | 'all'
  | 'vietnam_nature'
  | 'vietnam_economy'
  | 'world_geo'
  | 'climate_earth'
  | 'capitals_flags';

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0: A, 1: B, 2: C, 3: D
  category: QuestionCategory;
  categoryName: string;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Team {
  id: 'blue' | 'red';
  name: string;
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  totalAnswered: number;
  color: 'blue' | 'red';
  avatar: string;
}

export type GameStatus = 
  | 'lobby'
  | 'countdown'
  | 'playing'
  | 'question_result'
  | 'game_over';

export interface GameSettings {
  targetRopeToWin: number; // e.g., 5 steps
  timePerQuestion: number; // seconds, 0 = unlimited
  category: QuestionCategory;
  mode: GameMode;
  botDifficulty: BotDifficulty;
  soundEnabled: boolean;
}

export interface LastPullEvent {
  teamId: 'blue' | 'red';
  strength: number; // 1, 1.5, 2
  isSuperPull: boolean;
  message: string;
  timestamp: number;
}
