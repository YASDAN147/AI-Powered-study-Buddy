export interface StudyNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  isIndexed: boolean;
  chunks: NoteChunk[];
}

export interface NoteChunk {
  id: string;
  noteId: string;
  noteTitle: string;
  noteSubject: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  id: string;
  subject: string;
  topic: string;
  questions: QuizQuestion[];
  score?: number;
  xpEarned?: number;
  coinsEarned?: number;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  status: 'new' | 'learning' | 'mastered';
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  subject: string;
  cards: Flashcard[];
}

export interface StudySession {
  id: string;
  durationMinutes: number;
  type: 'rag_chat' | 'voice_tutor' | 'quiz' | 'flashcards' | 'note_summary' | 'focus_session';
  date: string; // YYYY-MM-DD
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  type: 'theme' | 'companion';
  value: string; // For themes: css-class; For companions: companion-id
  icon: string; // Lucide icon name (or visual indicator)
  description: string;
  unlocked: boolean;
  isEquipped: boolean;
  image?: string;
}

export interface UserStats {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalStudyTimeMinutes: number;
  badges: Badge[];
  shopItems: ShopItem[];
  sessionsHistory: StudySession[];
  claimedQuests?: string[];
}

export interface CompanionState {
  id: string;
  name: string;
  type: 'robo-buddy' | 'wise-owl' | 'zen-cat' | 'chibi-dragon';
  mood: 'idle' | 'happy' | 'thinking' | 'sleeping';
  speech: string;
}
