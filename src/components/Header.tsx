import React, { useState } from 'react';
import {
  BookHeart,
  Sparkles,
  BarChart3,
  Volume2,
  VolumeX,
  CloudCheck,
  Info,
  PenTool,
} from 'lucide-react';
import { playAmbientSound, stopAmbientSound, type AmbientSoundType } from '../utils/audio';

interface HeaderProps {
  activeTab: 'write' | 'list' | 'stats';
  setActiveTab: (tab: 'write' | 'list' | 'stats') => void;
  diaryCount: number;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  diaryCount,
  onOpenInfo,
}) => {
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const handleSelectSound = (type: AmbientSoundType) => {
    setAmbientSound(type);
    if (type === 'none') {
      stopAmbientSound();
    } else {
      playAmbientSound(type);
    }
    setShowSoundMenu(false);
  };

  const soundLabels: Record<AmbientSoundType, string> = {
    none: '소리 끄기',
    rain: '토닥토닥 빗소리 🌧️',
    campfire: '따뜻한 모닥불 🔥',
    night: '고요한 밤바람 🌙',
  };

  return (
    <header className="w-full bg-gradient-to-b from-amber-100/70 via-amber-50/50 to-transparent border-b border-amber-200/60 pb-5 pt-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-md shadow-amber-200 text-white shrink-0">
            <BookHeart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-stone-800 font-serif">
                따뜻한 하루 일기
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 border border-amber-300">
                <Sparkles className="w-3 h-3 text-amber-700" />
                Gemini AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              오늘 하루도 애쓴 당신에게 건네는 AI 비서의 다정한 온기와 응원
            </p>
          </div>
        </div>

        {/* Action Controls & Sound */}
        <div className="flex items-center gap-2 relative">
          {/* Ambient Sound Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                ambientSound !== 'none'
                  ? 'bg-amber-200/90 text-amber-950 border-amber-400 shadow-sm'
                  : 'bg-white/80 text-stone-600 border-amber-200 hover:bg-amber-50'
              }`}
              title="마음을 편안하게 해주는 힐링 배경음"
            >
              {ambientSound !== 'none' ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-800 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              )}
              <span>{ambientSound === 'none' ? '배경음' : soundLabels[ambientSound].split(' ')[0]}</span>
            </button>

            {showSoundMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 border-b border-amber-100">
                  마음 쉼 배경음 선택
                </div>
                {(['none', 'rain', 'campfire', 'night'] as AmbientSoundType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSelectSound(type)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-amber-50 transition-colors ${
                      ambientSound === type ? 'text-amber-900 font-semibold bg-amber-50/70' : 'text-stone-700'
                    }`}
                  >
                    <span>{soundLabels[type]}</span>
                    {ambientSound === type && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cloud / Info Button */}
          <button
            onClick={onOpenInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-stone-600 border border-amber-200 hover:bg-amber-50 transition-all"
            title="Firebase DB & Gemini API 안내"
          >
            <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Firebase DB</span>
            <Info className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-amber-200/50 backdrop-blur-sm border border-amber-200/80 shadow-inner">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'write'
                ? 'bg-white text-stone-800 shadow-sm shadow-amber-900/5 ring-1 ring-amber-300/40'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-amber-600" />
            <span>오늘 일기 쓰기</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-white text-stone-800 shadow-sm shadow-amber-900/5 ring-1 ring-amber-300/40'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookHeart className="w-3.5 h-3.5 text-rose-500" />
            <span>마음 보관함</span>
            {diaryCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
                {diaryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-stone-800 shadow-sm shadow-amber-900/5 ring-1 ring-amber-300/40'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>감정 통계</span>
          </button>
        </div>
      </div>
    </header>
  );
};
