import type { EmotionMeta, EmotionType } from '../types/diary';

export const EMOTIONS: EmotionMeta[] = [
  {
    type: '기쁨',
    label: '기쁨',
    englishLabel: 'Joy & Delight',
    emoji: '😊',
    color: '#F59E0B',
    bgColor: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900',
    borderColor: 'border-amber-400 ring-2 ring-amber-300 bg-amber-100/90 text-amber-950',
    textColor: 'text-amber-800',
    description: '행복하고 뿌듯했던 순간',
  },
  {
    type: '지침',
    label: '지침',
    englishLabel: 'Tired & Exhausted',
    emoji: '🥱',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200 text-purple-900',
    borderColor: 'border-purple-400 ring-2 ring-purple-300 bg-purple-100/90 text-purple-950',
    textColor: 'text-purple-800',
    description: '에너지를 쏟아 쉼이 필요한 하루',
  },
  {
    type: '설렘',
    label: '설렘',
    englishLabel: 'Flutter & Excitement',
    emoji: '✨',
    color: '#EC4899',
    bgColor: 'bg-pink-50 hover:bg-pink-100/80 border-pink-200 text-pink-900',
    borderColor: 'border-pink-400 ring-2 ring-pink-300 bg-pink-100/90 text-pink-950',
    textColor: 'text-pink-800',
    description: '기대감으로 가슴 두근거리는 마음',
  },
  {
    type: '불안',
    label: '불안',
    englishLabel: 'Anxious & Worried',
    emoji: '🌿',
    color: '#10B981',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900',
    borderColor: 'border-emerald-400 ring-2 ring-emerald-300 bg-emerald-100/90 text-emerald-950',
    textColor: 'text-emerald-800',
    description: '걱정되고 마음이 일렁일 때',
  },
];

export const PRESET_TAGS = [
  '#퇴근길',
  '#따뜻한차',
  '#친구와대화',
  '#혼자만의시간',
  '#작은성취',
  '#산책',
  '#맛있는음식',
  '#새로운도전',
  '#마음의쉼',
];

export const WRITING_PROMPTS = [
  '오늘 가장 기억에 남거나 마음에 머문 순간은 언제였나요?',
  '나를 웃음 짓게 하거나 조금 서운하게 했던 일은 무엇인가요?',
  '오늘 하루 열심히 살아낸 나 자신에게 해주고 싶은 한마디는?',
];
