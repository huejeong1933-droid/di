import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Send,
  Hash,
  Lightbulb,
  HeartHandshake,
  RotateCcw,
} from 'lucide-react';
import { EMOTIONS, PRESET_TAGS, WRITING_PROMPTS } from '../constants/emotions';
import type { EmotionType, DiaryEntry } from '../types/diary';

interface DiaryFormProps {
  onSubmit: (diary: {
    date: string;
    emotion: EmotionType;
    content: string;
    tags: string[];
  }) => Promise<void>;
  isLoading: boolean;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit, isLoading }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(todayStr);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('지침');
  const [content, setContent] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#혼자만의시간']);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [promptIndex, setPromptIndex] = useState<number>(0);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const formatted = customTagInput.startsWith('#')
      ? customTagInput.trim()
      : `#${customTagInput.trim()}`;
    if (!selectedTags.includes(formatted) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, formatted]);
    }
    setCustomTagInput('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit({
      date,
      emotion: selectedEmotion,
      content: content.trim(),
      tags: selectedTags,
    });
  };

  const handleCyclePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % WRITING_PROMPTS.length);
  };

  const applyPromptToContent = () => {
    const promptText = WRITING_PROMPTS[promptIndex];
    if (content.trim()) {
      setContent((prev) => `${prev}\n\n[생각거리]: ${promptText}\n`);
    } else {
      setContent(`[오늘의 생각]: ${promptText}\n\n`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Warm Card Container */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-amber-200/80 shadow-xl shadow-amber-900/5 overflow-hidden transition-all">
        {/* Card Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-100/60 via-orange-50/50 to-rose-50/50 border-b border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2 font-serif">
              <HeartHandshake className="w-5 h-5 text-amber-600" />
              오늘의 마음 일기 쓰기
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              마음속에 머무는 생각과 감정을 편안하게 털어놓아 보세요.
            </p>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-2xl border border-amber-200 shadow-xs self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-amber-700" />
            <input
              type="date"
              value={date}
              max={todayStr}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs sm:text-sm font-medium text-stone-700 bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {/* Step 1: Emotion Selection (기쁨, 지침, 설렘, 불안) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                오늘 나의 주된 감정은 어떤가요?
              </label>
              <span className="text-[11px] text-stone-400">하나를 선택해주세요</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EMOTIONS.map((emotion) => {
                const isSelected = selectedEmotion === emotion.type;
                return (
                  <button
                    type="button"
                    key={emotion.type}
                    onClick={() => setSelectedEmotion(emotion.type)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? emotion.borderColor
                        : `${emotion.bgColor} border-stone-200/80 hover:border-amber-300`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl select-none">{emotion.emoji}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="font-bold text-sm sm:text-base flex items-center gap-1">
                        {emotion.label}
                      </div>
                      <p className="text-[11px] opacity-80 line-clamp-1 leading-tight mt-0.5">
                        {emotion.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Today's Tags / Mood Keywords */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                오늘의 키워드 태그 (선택)
              </label>
              <span className="text-[11px] text-stone-400">최대 5개</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-amber-50 hover:border-amber-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}

              {/* Custom Tag Input */}
              <div className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-full px-2 py-0.5 text-xs focus-within:border-amber-400 focus-within:bg-white">
                <Hash className="w-3 h-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="직접 입력 후 Enter"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  className="bg-transparent outline-none w-24 text-xs text-stone-700"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Diary Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                오늘 있었던 일과 내 마음
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {content.length}자
              </span>
            </div>

            {/* Prompt Helper Bar */}
            <div className="mb-2 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between gap-2 text-xs text-stone-700">
              <div className="flex items-center gap-2 overflow-hidden">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate italic text-stone-600">
                  💡 {WRITING_PROMPTS[promptIndex]}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCyclePrompt}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-amber-100"
                  title="다른 생각거리 보기"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={applyPromptToContent}
                  className="px-2 py-0.5 text-[11px] font-medium bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-lg transition-colors"
                >
                  질문 넣기
                </button>
              </div>
            </div>

            {/* Writing Area */}
            <div className="relative rounded-2xl border border-amber-200 bg-amber-50/20 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all shadow-inner">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                placeholder="오늘 하루 있었던 사소한 순간, 기분 좋았던 일이나 나를 지치게 했던 일들을 자유롭게 적어보세요. 길지 않아도 괜찮습니다. 당신의 솔직한 마음이면 충분해요..."
                className="w-full p-4 bg-transparent outline-none text-stone-800 placeholder:text-stone-400 text-sm leading-relaxed resize-y font-sans"
                required
              />

              {content.length > 0 && (
                <div className="flex justify-end p-2 border-t border-amber-100/60">
                  <button
                    type="button"
                    onClick={() => setContent('')}
                    className="text-[11px] text-stone-400 hover:text-rose-500 transition-colors"
                  >
                    지우기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all duration-300 ${
                isLoading || !content.trim()
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>AI 비서가 일기를 읽고 다정한 편지를 작성 중입니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                  <span>AI 비서에게 일기 보여주기</span>
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2.5">
              일기를 보여주면 Google Gemini AI가 다정한 위로와 내일을 위한 긍정 행동 1가지를 답장해 드립니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
