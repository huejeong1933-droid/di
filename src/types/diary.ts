export type EmotionType = '기쁨' | '지침' | '설렘' | '불안';

export interface AIEncouragement {
  warmCheerLetter: string;
  positiveAction: string;
  mindQuote: string;
  emotionInsight: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  emotion: EmotionType;
  content: string;
  tags?: string[];
  aiResponse?: AIEncouragement;
  actionCompleted?: boolean;
  createdAt: number;
}

export interface EmotionMeta {
  type: EmotionType;
  label: string;
  englishLabel: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}
