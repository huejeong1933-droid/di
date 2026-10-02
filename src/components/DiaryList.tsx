import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Heart,
  Sparkles,
  Leaf,
  Trash2,
  CheckCircle2,
  Circle,
  Tag,
  BookOpen,
  ArrowRight,
  Smile,
} from 'lucide-react';
import type { DiaryEntry, EmotionType } from '../types/diary';
import { EMOTIONS } from '../constants/emotions';

interface DiaryListProps {
  entries: DiaryEntry[];
  onOpenLetter: (entry: DiaryEntry) => void;
  onToggleAction: (id: string, completed: boolean) => void;
  onDeleteEntry: (id: string) => void;
  onGoToWrite: () => void;
}

export const DiaryList: React.FC<DiaryListProps> = ({
  entries,
  onOpenLetter,
  onToggleAction,
  onDeleteEntry,
  onGoToWrite,
}) => {
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEntries = entries.filter((entry) => {
    const matchesEmotion = filterEmotion === 'all' || entry.emotion === filterEmotion;
    const matchesQuery =
      !searchQuery.trim() ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.aiResponse?.positiveAction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEmotion && matchesQuery;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-amber-200/80 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Emotion Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterEmotion('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterEmotion === 'all'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-amber-50'
            }`}
          >
            전체 보기 ({entries.length})
          </button>

          {EMOTIONS.map((em) => {
            const count = entries.filter((e) => e.emotion === em.type).length;
            const isSelected = filterEmotion === em.type;
            return (
              <button
                key={em.type}
                onClick={() => setFilterEmotion(em.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isSelected
                    ? `${em.borderColor} shadow-xs font-bold`
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{em.emoji}</span>
                <span>{em.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="일기 내용이나 태그, 긍정 행동 검색..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50/80 border border-amber-200/70 rounded-2xl outline-none focus:border-amber-400 focus:bg-white text-stone-800 placeholder:text-stone-400"
          />
        </div>
      </div>

      {/* Diary Cards Grid */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-dashed border-amber-300">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-800 font-serif">
            {entries.length === 0
              ? '아직 작성된 마음 일기가 없어요'
              : '조건에 맞는 일기를 찾을 수 없어요'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {entries.length === 0
              ? '오늘 하루 있었던 일과 감정을 적고 AI 비서의 따뜻한 응원을 받아보세요.'
              : '다른 감정 필터나 검색어를 입력해 보세요.'}
          </p>
          {entries.length === 0 && (
            <button
              onClick={onGoToWrite}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              <span>첫 일기 쓰러 가기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => {
            const emotionMeta =
              EMOTIONS.find((e) => e.type === entry.emotion) || EMOTIONS[0];

            return (
              <div
                key={entry.id}
                className="bg-white/95 rounded-3xl border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{emotionMeta.emoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-stone-800 font-serif">
                            {entry.date}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${emotionMeta.bgColor}`}
                          >
                            {entry.emotion}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('이 일기를 정말 삭제하시겠습니까?')) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="text-stone-300 hover:text-rose-500 p-1 rounded-lg transition-colors"
                      title="일기 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Diary Snippet */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3 mb-3 whitespace-pre-line font-sans">
                    {entry.content}
                  </p>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tomorrow's Action Snippet with Checkbox */}
                  {entry.aiResponse?.positiveAction && (
                    <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 mb-3 flex items-start gap-2">
                      <button
                        onClick={() =>
                          onToggleAction(entry.id, !entry.actionCompleted)
                        }
                        className="mt-0.5 text-emerald-600 hover:text-emerald-700 shrink-0"
                        title={
                          entry.actionCompleted
                            ? '실천 완료됨 (클릭하여 취소)'
                            : '실천 완료하기'
                        }
                      >
                        {entry.actionCompleted ? (
                          <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <div className="text-[11px] leading-tight text-emerald-950">
                        <span className="font-semibold text-emerald-800 block mb-0.5">
                          🌱 내일의 긍정 행동:
                        </span>
                        <span
                          className={
                            entry.actionCompleted ? 'line-through opacity-70' : ''
                          }
                        >
                          {entry.aiResponse.positiveAction}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom: Open AI Letter Button */}
                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    AI 비서 답장 보관됨
                  </span>
                  <button
                    onClick={() => onOpenLetter(entry)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>편지 다시 읽기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
