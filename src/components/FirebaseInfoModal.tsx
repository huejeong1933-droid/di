import React, { useState } from 'react';
import {
  X,
  Database,
  Key,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { firebaseConfig } from '../lib/firebase';

interface FirebaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseInfoModal: React.FC<FirebaseInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const envSample = `# Gemini API 키 (Vercel 환경 변수 또는 로컬 .env)
GEMINI_API_KEY="your-gemini-api-key"
VITE_GEMINI_API_KEY="your-gemini-api-key"

# Firebase 설정 (visit-e95d1)
VITE_FIREBASE_API_KEY="${firebaseConfig.apiKey}"
VITE_FIREBASE_AUTH_DOMAIN="${firebaseConfig.authDomain}"
VITE_FIREBASE_PROJECT_ID="${firebaseConfig.projectId}"
VITE_FIREBASE_STORAGE_BUCKET="${firebaseConfig.storageBucket}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${firebaseConfig.messagingSenderId}"
VITE_FIREBASE_APP_ID="${firebaseConfig.appId}"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-amber-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-amber-100/70 p-5 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-base font-serif">
                데이터베이스 및 API 보안 설정
              </h3>
              <p className="text-xs text-stone-600">
                Firebase Firestore & Google Gemini API 연동 상태
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-stone-700">
          {/* Firebase Connection Card */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Firebase Firestore 연동 정보
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                연결됨
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-3 rounded-xl border border-amber-100 text-stone-600">
              <div>
                <span className="text-stone-400 block">Project ID:</span>
                <span className="font-semibold text-stone-800">{firebaseConfig.projectId}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Auth Domain:</span>
                <span className="truncate block font-semibold text-stone-800">{firebaseConfig.authDomain}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Collection:</span>
                <span className="font-semibold text-amber-900">diaries (일기 & AI 답장)</span>
              </div>
              <div>
                <span className="text-stone-400 block">오프라인 백업:</span>
                <span className="font-semibold text-emerald-700">LocalStorage 자동 동기화</span>
              </div>
            </div>
          </div>

          {/* Vercel & Security Notice */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Key className="w-4 h-4 text-amber-600" />
              <span>Vercel 배포 및 환경 변수 안전 가이드</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              API 키가 코드에 노출되지 않도록 안전하게 분리되어 있습니다. Vercel 배포 시에는{' '}
              <strong className="text-stone-900 font-mono">Project Settings &gt; Environment Variables</strong>에{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">GEMINI_API_KEY</code> 또는{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">VITE_GEMINI_API_KEY</code>를
              등록하시면 됩니다.
            </p>

            <div className="relative mt-2">
              <pre className="p-3 bg-stone-900 text-amber-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                {envSample}
              </pre>
              <button
                onClick={handleCopyEnv}
                className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-[10px] flex items-center gap-1 transition-colors"
              >
                {copiedEnv ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>.env 예시 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};
