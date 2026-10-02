import React from 'react';
import {
  Heart,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Calendar,
  Smile,
  Leaf,
  Award,
} from 'lucide-react';
import type { DiaryEntry, EmotionType } from '../types/diary';
import { EMOTIONS } from '../constants/emotions';

interface EmotionStatsProps {
  entries: DiaryEntry[];
  onGoToWrite: () => void;
}

export const EmotionStats: React.FC<EmotionStatsProps> = ({
  entries,
  onGoToWrite,
}) => {
  const total = entries.length;

  const counts: Record<EmotionType, number> = {
    기쁨: entries.filter((e) => e.emotion === '기쁨').length,
    지침: entries.filter((e) => e.emotion === '지침').length,
    설렘: entries.filter((e) => e.emotion === '설렘').length,
    불안: entries.filter((e) => e.emotion === '불안').length,
  };

  const completedActions = entries.filter((e) => e.actionCompleted).length;

  // Find most frequent emotion
  let dominantEmotion: EmotionType = '기쁨';
  let maxCount = -1;
  (Object.keys(counts) as EmotionType[]).forEach((type) => {
    if (counts[type] > maxCount) {
      maxCount = counts[type];
      dominantEmotion = type;
    }
  });

  const dominantMeta =
    EMOTIONS.find((e) => e.type === dominantEmotion) || EMOTIONS[0];

  const getDominantEncouragement = (emotion: EmotionType) => {
    switch (emotion) {
      case '기쁨':
        return '최근 기쁨과 행복이 가득한 날들을 보내고 계시네요! 이 눈부신 온기가 마음에 오래오래 머물기를 바라요.';
      case '지침':
        return '최근 많이 지치고 에너지를 쏟아낸 시간들이 많으셨군요. 지금은 스스로를 위해 아낌없이 쉬어줄 시간입니다.';
      case '설렘':
        return '새로운 바람과 기분 좋은 두근거림이 당신의 일상을 채우고 있어요! 그 반짝이는 호기심을 마음껏 펼쳐보세요.';
      case '불안':
        return '마음속에 걱정과 물음표가 많았던 날들이었군요. 불안은 소중한 것을 지키려는 마음의 신호예요. 당신은 이미 충분히 잘하고 있습니다.';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Diaries */}
        <div className="bg-white/90 p-4 rounded-3xl border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold">기록한 날들</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-stone-800 font-serif">
              {total}
            </span>
            <span className="text-xs text-stone-500 ml-1">일</span>
          </div>
        </div>

        {/* Completed Actions */}
        <div className="bg-white/90 p-4 rounded-3xl border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold">실천한 긍정 행동</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-800 font-serif">
              {completedActions}
            </span>
            <span className="text-xs text-stone-500 ml-1">개 완료</span>
          </div>
        </div>

        {/* Dominant Mood */}
        <div className="bg-white/90 p-4 rounded-3xl border border-rose-200 shadow-xs flex flex-col justify-between col-span-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold">가장 많이 머문 마음</span>
            <Award className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl">{dominantMeta.emoji}</span>
            <div>
              <div className="font-bold text-stone-800 text-base sm:text-lg">
                {total > 0 ? dominantMeta.label : '첫 일기 대기 중'}
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                {total > 0
                  ? `${dominantMeta.label}의 감정이 ${counts[dominantEmotion]}회 기록되었습니다.`
                  : '일기를 기록하면 감정 지도가 완성됩니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emotion Distribution Bars */}
      <div className="bg-white/95 rounded-3xl border border-amber-200/90 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-800 font-serif flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              마음 감정 분포도
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              기쁨, 지침, 설렘, 불안 네 가지 감정이 머물렀던 비율입니다.
            </p>
          </div>
        </div>

        {total === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            아직 기록된 감정이 없습니다. 오늘 일기를 적어보세요!
          </div>
        ) : (
          <div className="space-y-4">
            {EMOTIONS.map((em) => {
              const count = counts[em.type];
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={em.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-medium text-stone-800">
                      <span>{em.emoji}</span>
                      <span>{em.label}</span>
                      <span className="text-stone-400 text-[11px]">
                        ({count}회)
                      </span>
                    </div>
                    <span className="font-bold text-stone-700 font-mono">
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: em.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Care Letter Based on Dominant Mood */}
      {total > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-100/70 via-orange-50 to-rose-100/60 border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI 비서의 마음 날씨 브리핑</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
            {getDominantEncouragement(dominantEmotion)}
          </p>
          <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-stone-600">
            <span>어떤 감정이든 당신이 느낀 그대로 소중합니다.</span>
            <button
              onClick={onGoToWrite}
              className="text-amber-800 font-bold hover:underline"
            >
              오늘 일기 쓰기 &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
