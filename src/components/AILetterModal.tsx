import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  X,
  Share2,
  Leaf,
  Quote,
  Calendar,
  BookmarkCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DiaryEntry } from '../types/diary';
import { EMOTIONS } from '../constants/emotions';
import { speakText, stopSpeaking } from '../utils/audio';

interface AILetterModalProps {
  entry: DiaryEntry;
  onClose: () => void;
  onToggleAction: (id: string, completed: boolean) => void;
}

export const AILetterModal: React.FC<AILetterModalProps> = ({
  entry,
  onClose,
  onToggleAction,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionDone, setActionDone] = useState(!!entry.actionCompleted);

  const emotionMeta = EMOTIONS.find((e) => e.type === entry.emotion) || EMOTIONS[0];
  const aiData = entry.aiResponse;

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      if (aiData?.warmCheerLetter) {
        setIsPlayingAudio(true);
        const fullSpeech = `${entry.emotion}의 하루를 보낸 당신에게 드리는 마음 편지입니다. ${aiData.warmCheerLetter}. 내일을 위한 긍정 행동 하나. ${aiData.positiveAction}.`;
        speakText(fullSpeech, () => {
          setIsPlayingAudio(false);
        });
      }
    }
  };

  const handleCopy = () => {
    if (!aiData) return;
    const textToCopy = `[${entry.date} 따뜻한 하루 일기 - AI 비서의 편지]\n\n나의 감정: ${entry.emotion}\n\n💌 다정한 위로:\n${aiData.warmCheerLetter}\n\n🌱 내일을 위한 긍정 행동:\n${aiData.positiveAction}\n\n✨ 마음의 한 줄:\n"${aiData.mindQuote}"`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActionPledge = () => {
    const nextState = !actionDone;
    setActionDone(nextState);
    onToggleAction(entry.id, nextState);

    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#EC4899', '#10B981', '#6366F1'],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border border-amber-200/90 shadow-2xl shadow-stone-900/20 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              {emotionMeta.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  AI 마음 비서의 답장
                </span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                  {emotionMeta.label}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif">
                당신의 오늘 하루를 보듬는 다정한 편지
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto font-sans leading-relaxed text-stone-800">
          {/* Original Diary Context Snippet */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/60 text-xs text-stone-600">
            <div className="flex items-center justify-between mb-1 text-[11px] font-semibold text-amber-800">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {entry.date} 작성한 일기
              </span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                {entry.emotion}
              </span>
            </div>
            <p className="line-clamp-2 italic text-stone-700">"{entry.content}"</p>
          </div>

          {/* 1. Warm Empathy & Comforting Letter */}
          <div className="relative p-5 sm:p-6 rounded-3xl bg-white border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <h4 className="text-sm font-bold text-amber-950 font-serif flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                다정한 위로와 공감의 편지
              </h4>
            </div>

            <div className="text-sm sm:text-base leading-relaxed text-stone-700 whitespace-pre-line font-serif space-y-3">
              {aiData?.warmCheerLetter || '당신의 오늘 하루를 따뜻하게 안아드립니다.'}
            </div>

            {aiData?.emotionInsight && (
              <div className="mt-4 pt-3 border-t border-amber-100 flex items-center gap-2 text-xs text-amber-800 font-medium bg-amber-50/50 p-2.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>오늘의 마음 케어: {aiData.emotionInsight}</span>
              </div>
            )}
          </div>

          {/* 2. Tomorrow's Positive Action Suggestion */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border border-emerald-200/80 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <h4 className="text-sm font-bold text-emerald-950 font-serif flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                내일을 위한 긍정 행동 1가지
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                작은 실천
              </span>
            </div>

            <p className="text-sm sm:text-base text-stone-800 font-medium leading-relaxed mb-4">
              {aiData?.positiveAction || '내일 아침 따뜻한 차 한 잔과 함께 기지개 켜기'}
            </p>

            {/* Action Pledge Button */}
            <button
              onClick={handleActionPledge}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                actionDone
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {actionDone ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>내일 실천하기로 약속했어요! ✨</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>내일 꼭 실천해볼게요 (약속하기)</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Mind Quote */}
          {aiData?.mindQuote && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/60 border border-amber-200 text-center relative">
              <Quote className="w-6 h-6 text-amber-400 mx-auto mb-1 opacity-70" />
              <p className="text-xs sm:text-sm font-serif italic text-amber-950 font-medium">
                "{aiData.mindQuote}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-white/95 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Audio Read Aloud */}
            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isPlayingAudio
                  ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  : 'bg-stone-50 hover:bg-amber-50 text-stone-700 border-stone-200'
              }`}
              title="다정한 음성으로 읽어주기"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600" />
                  <span>듣기 멈추기</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>음성으로 듣기</span>
                </>
              )}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-50 hover:bg-amber-50 text-stone-700 border border-stone-200 transition-all"
              title="편지 내용 복사"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>편지 복사</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
          >
            마음에 간직하기 (확인)
          </button>
        </div>
      </div>
    </div>
  );
};
