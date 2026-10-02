import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API endpoint for generating warm encouragement & tomorrow's positive action
app.post('/api/gemini/encourage', async (req, res) => {
  try {
    const { diaryText, emotion, date } = req.body;

    if (!diaryText || !diaryText.trim()) {
      return res.status(400).json({ error: '일기 내용을 입력해주세요.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY가 서버 환경 변수에 설정되어 있지 않습니다.',
      });
    }

    const emotionDescriptions: Record<string, string> = {
      기쁨: '기쁨과 뿌듯함, 행복한 순간을 나누며 함께 축하받고 싶은 상태',
      지침: '하루 동안 많은 에너지를 소진하여 지치고 피곤하며 따뜻한 휴식과 온기가 필요한 상태',
      설렘: '새로운 시작이나 기대감으로 가슴이 두근거리고 긍정적인 기대가 가득한 상태',
      불안: '걱정과 불안으로 마음이 흔들리고 있어 안심과 든든한 지지가 필요한 상태',
    };

    const emotionContext = emotionDescriptions[emotion] || `${emotion}의 감정 상태`;

    const prompt = `사용자가 작성한 오늘 하루 일기입니다:
[날짜]: ${date || '오늘'}
[선택한 감정]: ${emotion} (${emotionContext})
[일기 본문]:
"""
${diaryText}
"""

당신은 사용자의 가장 다정하고 지혜로운 '마음 비서'입니다.
1. 사용자가 털어놓은 일기 내용과 감정을 섬세하게 읽고, 마음에 깊이 닿는 따뜻한 공감과 위로의 편지를 써주세요.
2. 내일을 한 걸음 더 가볍고 행복하게 맞이할 수 있도록 부담 없는 '구체적이고 긍정적인 행동 1가지'를 제안해주세요. (예: 아침 햇살을 받으며 기지개 켜기, 좋아하는 향의 따뜻한 차 한 잔 음미하기 등)
3. 지친 마음에 촛불을 켜주는 따뜻한 한 줄의 격려 문장(mindQuote)과 오늘의 마음 상태를 보듬는 공감 요약(emotionInsight)도 함께 작성해주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          '당신은 다정다감하고 공감 능력이 뛰어난 따뜻한 마음 비서입니다. 사용자의 감정을 온전히 수용하고 존댓말(~해요, ~했어요)로 따뜻한 온기를 전합니다. 비판하거나 섣부른 조언을 하지 않고, 진심 어린 위로와 실천하기 쉬운 작은 긍정 행동 하나를 선물합니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            warmCheerLetter: {
              type: Type.STRING,
              description: '사용자의 일기와 감정에 깊이 공감하고 위로해주는 따뜻한 답장 편지 (3~5문단 내외)',
            },
            positiveAction: {
              type: Type.STRING,
              description: '내일을 위한 구체적이고 부담 없는 긍정적인 행동 1가지 제안',
            },
            mindQuote: {
              type: Type.STRING,
              description: '마음의 온도를 높여주는 따뜻한 한 줄 명언이나 응원 문구',
            },
            emotionInsight: {
              type: Type.STRING,
              description: '사용자의 감정을 읽고 오늘 마음에 필요한 휴식이나 보살핌의 요약',
            },
          },
          required: ['warmCheerLetter', 'positiveAction', 'mindQuote', 'emotionInsight'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('응답을 생성하지 못했습니다.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error?.message || 'AI 비서의 답장을 받아오는 중 오류가 발생했습니다.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve built assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, hook up Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
