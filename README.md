# 따뜻한 하루 일기 & AI 응원 (Warm Daily Diary)

오늘 하루 있었던 일과 감정을 기록하면 Google Gemini AI 비서가 다정한 위로와 내일을 위한 긍정 행동 1가지를 답장해주는 감성 다이어리 웹앱입니다.

Firebase Firestore(`visit-e95d1`) 및 Google Gemini API(`gemini-3.8-flash`)와 연동되어 있습니다.

---

## 🚀 GitHub 업로드 및 Vercel 배포 가이드

### 1. GitHub 저장소(Repository)에 푸시
```bash
git init
git add .
git commit -m "feat: 따뜻한 하루 일기 & AI 응원 앱"
git branch -M main
git remote add origin https://github.com/당신의아이디/warm-daily-diary.git
git push -u origin main
```

### 2. Vercel 배포 설정
1. [Vercel](https://vercel.com) 로그인 후 **"Add New..." > "Project"**를 클릭합니다.
2. 방금 올린 GitHub 저장소를 선택(Import)합니다.
3. **Build and Output Settings**는 Vercel이 자동으로 인식합니다:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables (환경 변수)**에 아래 항목을 추가합니다:
   - **`GEMINI_API_KEY`**: 본인의 Google Gemini API Key 입력 (필수)
   - *(선택 사항)* `VITE_GEMINI_API_KEY`: 클라이언트 직접 통신 백업용
5. **Deploy** 버튼을 누르면 1~2분 내에 배포가 완료됩니다!

---

## 🛠️ 프로젝트 아키텍처 및 보안

- **Vercel Serverless Function (`/api/gemini/encourage.ts`)**:
  - Vercel 배포 시 서버리스 함수로 자동 배포되어, 브라우저에 `GEMINI_API_KEY`가 노출되지 않고 안전하게 처리됩니다.
- **`vercel.json`**:
  - SPA 라우팅 및 `/api/*` 서버리스 라우팅을 매끄럽게 연결합니다.
- **로컬 개발 (`server.ts`)**:
  - 로컬 환경에서는 Express 풀스택 서버가 구동되어 동일한 `/api/gemini/encourage` 엔드포인트를 제공합니다.
- **Firebase Firestore (`visit-e95d1`)**:
  - 일기 및 AI 답장을 실시간으로 클라우드에 저장하고, 오프라인 상황에서도 LocalStorage 백업을 통해 유실 없이 작동합니다.

---

## 💻 로컬 개발 환경 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 파일 생성 (.env)
cp .env.example .env
# .env 파일 내 GEMINI_API_KEY 입력

# 3. 로컬 개발 서버 실행
npm run dev
# 브라우저에서 http://localhost:3000 접속
```
