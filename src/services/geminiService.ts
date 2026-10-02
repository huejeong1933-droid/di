import type { AIEncouragement, EmotionType } from '../types/diary';

export async function requestAIEncouragement(
  diaryText: string,
  emotion: EmotionType,
  date: string
): Promise<AIEncouragement> {
  // 1. First attempt: Full-stack server proxy route (keeps API key secure on server)
  try {
    const res = await fetch('/api/gemini/encourage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diaryText, emotion, date }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        warmCheerLetter: data.warmCheerLetter,
        positiveAction: data.positiveAction,
        mindQuote: data.mindQuote,
        emotionInsight: data.emotionInsight,
        createdAt: new Date().toISOString(),
      };
    } else {
      const errJson = await res.json().catch(() => null);
      console.warn('API route error response:', res.status, errJson);
    }
  } catch (serverErr) {
    console.warn('Backend /api/gemini/encourage request failed, attempting direct fallback...', serverErr);
  }

  // 2. Second attempt: Direct Gemini REST API using VITE_GEMINI_API_KEY (for static Vercel deployment)
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (clientKey) {
    try {
      const prompt = `사용자가 작성한 일기입니다:
[날짜]: ${date}
[감정]: ${emotion}
[내용]:
${diaryText}

당신은 다정하고 지혜로운 '따뜻한 마음 비서'입니다.
1. 일기 내용을 깊이 공감하고 위로해주는 존댓말의 다정한 답장 편지(warmCheerLetter)
2. 내일을 가볍고 행복하게 만들어줄 부담 없는 작은 긍정 행동 1가지(positiveAction)
3. 마음의 온도를 높여주는 한 줄 문장(mindQuote)
4. 오늘의 감정 케어 요약(emotionInsight)

반드시 아래 JSON 형식으로만 반환해주세요:
{
  "warmCheerLetter": "...",
  "positiveAction": "...",
  "mindQuote": "...",
  "emotionInsight": "..."
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${clientKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (res.ok) {
        const raw = await res.json();
        const text = raw.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            warmCheerLetter: parsed.warmCheerLetter,
            positiveAction: parsed.positiveAction,
            mindQuote: parsed.mindQuote,
            emotionInsight: parsed.emotionInsight,
            createdAt: new Date().toISOString(),
          };
        }
      }
    } catch (directErr) {
      console.error('Direct Gemini REST API call failed:', directErr);
    }
  }

  // 3. Fallback: Thoughtfully crafted warm responses tailored to the emotion
  return generateComfortingFallback(diaryText, emotion);
}

function generateComfortingFallback(
  _diaryText: string,
  emotion: EmotionType
): AIEncouragement {
  const fallbacks: Record<
    EmotionType,
    { letter: string; action: string; quote: string; insight: string }
  > = {
    기쁨: {
      letter:
        '오늘 하루 반짝이는 행복과 기쁨을 마주하셨군요! 일기를 읽는 저의 마음까지 따뜻한 온기로 가득 차오릅니다. 당신이 느낀 이 소중한 순간은 마음에 오래도록 머물며 내일의 밝은 빛이 되어줄 거예요. 오늘 있었던 기분 좋은 일을 소중히 간직하며, 오늘 밤은 뿌듯한 미소와 함께 편안한 잠자리에 들기를 바라요.',
      action: '내일 아침 거울을 보며 오늘 느꼈던 행복한 기운을 담아 스스로에게 활짝 웃어주기',
      quote: '행복은 우리가 일상 속에서 발견하는 작고 다정한 반짝임들 속에 있습니다.',
      insight: '오늘의 기쁨 에너지가 내일의 활력을 채워주고 있어요.',
    },
    지침: {
      letter:
        '오늘 정말 많은 일들을 해내느라 몸도 마음도 참 많이 고단하셨죠. 당신이 흘린 땀과 애쓴 마음들이 얼마나 컸을지 가만히 헤아려봅니다. 아무것도 하지 않아도 괜찮아요. 지금 이 순간만큼은 모든 짐을 내려놓고 오직 당신 자신만을 위해 편안히 숨을 쉬어주세요. 오늘도 끝까지 하루를 살아낸 당신은 그 자체로 충분히 눈부시고 대단합니다.',
      action: '내일은 나를 위해 따뜻한 차나 물을 한 잔 마시며, 딱 3분간 아무 생각 없이 편안히 기지개 켜기',
      quote: '지친 나에게 건네는 가장 다정한 선물은, 스스로를 다그치지 않는 온전한 쉼입니다.',
      insight: '지금 필요한 것은 자책이 아닌, 스스로를 보듬어주는 따뜻한 위로와 휴식입니다.',
    },
    설렘: {
      letter:
        '가슴이 콩닥거리고 기분 좋은 기대감이 피어오르는 하루를 보내셨네요! 무언가를 기다리고 두근거리는 마음은 우리 삶을 가장 생동감 있게 만들어주는 마법 같아요. 이 설레는 에너지와 호기심을 마음에 품고, 내일 다가올 새로운 순간들도 당신의 걸음걸음마다 반갑게 맞이해보세요. 늘 당신의 반짝이는 도전을 응원할게요!',
      action: '내일 기분 좋은 플레이리스트의 첫 곡을 들으며 좋아하는 길로 산책해보기',
      quote: '설렘이란 새로운 계절의 꽃이 피어나듯, 내 안에서 시작되는 새로운 가능성의 신호입니다.',
      insight: '두근거리는 마음이 새로운 긍정적 기운을 활짝 열어주고 있어요.',
    },
    불안: {
      letter:
        '마음속에 파도가 일렁이고 생각들이 꼬리를 물어 참 많이 버겁고 불안하셨지요. 불안은 당신이 삶을 진심으로 소중히 여기고 있기에 찾아오는 자연스러운 감정이에요. 아직 오지 않은 내일의 걱정에 지금의 당신을 내어주지 마세요. 발을 바닥에 가만히 붙이고 천천히 깊은숨을 들이마셔 보세요. 당신은 생각보다 훨씬 더 단단하고 지혜로운 사람입니다. 괜찮아요, 잘 지나갈 거예요.',
      action: '내일 아침 창문을 활짝 열어 신선한 바람을 맞으며 천천히 4초 들이쉬고 6초 내쉬는 호흡 3번 하기',
      quote: '폭풍우 치는 하늘 너머에도 별은 여전히 빛나고 있고, 불안 너머엔 언제나 당신의 평온이 기다리고 있습니다.',
      insight: '스스로를 안심시켜 주세요. 지금 여기의 당신은 온전히 안전합니다.',
    },
  };

  const item = fallbacks[emotion] || fallbacks['지침'];
  return {
    warmCheerLetter: item.letter,
    positiveAction: item.action,
    mindQuote: item.quote,
    emotionInsight: item.insight,
    createdAt: new Date().toISOString(),
  };
}
