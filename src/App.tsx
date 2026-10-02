/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { DiaryForm } from './components/DiaryForm';
import { DiaryList } from './components/DiaryList';
import { EmotionStats } from './components/EmotionStats';
import { AILetterModal } from './components/AILetterModal';
import { FirebaseInfoModal } from './components/FirebaseInfoModal';
import {
  fetchDiaryEntries,
  saveDiaryEntry,
  toggleActionCompleted,
  deleteDiaryEntry as removeDiaryEntry,
} from './lib/firebase';
import { requestAIEncouragement } from './services/geminiService';
import type { DiaryEntry, EmotionType } from './types/diary';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'list' | 'stats'>('write');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [activeLetterEntry, setActiveLetterEntry] = useState<DiaryEntry | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load diaries on mount
  useEffect(() => {
    async function loadData() {
      const data = await fetchDiaryEntries();
      if (data.length === 0) {
        // Provide a lovely welcoming sample entry so the user sees the warm AI letter right away
        const sampleEntry: DiaryEntry = {
          id: 'welcome_sample',
          date: new Date().toISOString().split('T')[0],
          emotion: '설렘',
          content:
            '따뜻한 하루 일기를 처음 열어보았다. 오늘 하루 있었던 일들을 솔직하게 적고 나만을 위한 AI 비서의 다정한 응원을 받을 수 있다니 벌써부터 마음이 편안해진다.',
          tags: ['#새로운시작', '#마음의쉼', '#첫일기'],
          actionCompleted: false,
          createdAt: Date.now() - 3600000,
          aiResponse: {
            warmCheerLetter:
              '새로운 일기장에 첫 발을 내딛으신 것을 진심으로 환영해요! 자신의 하루와 감정을 기록하는 일은 나 자신에게 건넬 수 있는 가장 다정한 보살핌입니다. 당신의 기쁨도, 지침도, 설렘과 불안도 모두 있는 그대로 소중한 마음의 날씨예요. 오늘부터 당신 곁에서 마음에 따뜻한 온기를 선물하는 든든한 AI 비서가 되어드릴게요.',
            positiveAction:
              '오늘 밤 잠들기 전, 오늘 하루를 살아낸 나 자신을 위해 양팔로 내 어깨를 토닥여주기',
            mindQuote:
              '나의 하루를 기록하는 것은, 나를 온전히 사랑하겠다는 다정한 약속입니다.',
            emotionInsight:
              '새로운 시작에 대한 설렘이 마음속 긍정의 에너지를 깨우고 있어요.',
            createdAt: new Date().toISOString(),
          },
        };
        setEntries([sampleEntry]);
      } else {
        setEntries(data);
      }
    }
    loadData();
  }, []);

  // Handle Diary Submission and AI Generation
  const handleDiarySubmit = async ({
    date,
    emotion,
    content,
    tags,
  }: {
    date: string;
    emotion: EmotionType;
    content: string;
    tags: string[];
  }) => {
    setIsLoadingAI(true);
    try {
      // 1. Call Gemini AI
      const aiResponse = await requestAIEncouragement(content, emotion, date);

      // 2. Save to Firebase (and local storage)
      const saved = await saveDiaryEntry({
        date,
        emotion,
        content,
        tags,
        aiResponse,
        actionCompleted: false,
      });

      // 3. Update State
      setEntries((prev) => [saved, ...prev.filter((e) => e.id !== saved.id)]);

      // 4. Celebration confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F43F5E', '#10B981', '#FBBF24'],
      });

      // 5. Open AI Letter Modal immediately
      setActiveLetterEntry(saved);
      showToast('AI 비서의 따뜻한 답장 편지가 도착했습니다! 💌');
    } catch (err: any) {
      console.error('Error creating diary entry:', err);
      showToast('일기를 처리하는 중 문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleToggleAction = async (id: string, completed: boolean) => {
    await toggleActionCompleted(id, completed);
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, actionCompleted: completed } : e))
    );
    if (activeLetterEntry?.id === id) {
      setActiveLetterEntry({ ...activeLetterEntry, actionCompleted: completed });
    }
    if (completed) {
      showToast('긍정 행동 실천 약속을 응원합니다! ✨');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    await removeDiaryEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showToast('일기가 삭제되었습니다.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/70 via-stone-50/50 to-orange-50/40 text-stone-800">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        diaryCount={entries.length}
        onOpenInfo={() => setShowInfoModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'write' && (
          <DiaryForm onSubmit={handleDiarySubmit} isLoading={isLoadingAI} />
        )}

        {activeTab === 'list' && (
          <DiaryList
            entries={entries}
            onOpenLetter={(entry) => setActiveLetterEntry(entry)}
            onToggleAction={handleToggleAction}
            onDeleteEntry={handleDeleteEntry}
            onGoToWrite={() => setActiveTab('write')}
          />
        )}

        {activeTab === 'stats' && (
          <EmotionStats
            entries={entries}
            onGoToWrite={() => setActiveTab('write')}
          />
        )}
      </main>

      {/* AI Letter Modal */}
      {activeLetterEntry && (
        <AILetterModal
          entry={activeLetterEntry}
          onClose={() => setActiveLetterEntry(null)}
          onToggleAction={handleToggleAction}
        />
      )}

      {/* Firebase & Environment Info Modal */}
      <FirebaseInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-stone-900/90 text-amber-200 text-xs sm:text-sm font-medium shadow-xl border border-amber-300/30 flex items-center gap-2 backdrop-blur-md animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Gentle Footer */}
      <footer className="py-6 border-t border-amber-200/50 text-center text-xs text-stone-500 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <span>따뜻한 하루 일기 &bull; Powered by Google Gemini AI & Firebase Firestore</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
        </p>
        <p className="text-[11px] text-stone-400">
          오늘 있었던 모든 감정은 당신을 지켜주는 소중한 이야기입니다.
        </p>
      </footer>
    </div>
  );
}
