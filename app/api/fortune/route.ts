import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// API 키 확인 (여러 가능한 환경 변수 이름 지원)
const API_KEY = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

if (!API_KEY) {
  console.error('⚠️  GOOGLE_API_KEY 또는 GOOGLE_GENERATIVE_AI_API_KEY가 설정되지 않았습니다.');
}

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(API_KEY);

const topicNames: Record<string, string> = {
  career: '커리어/진로',
  wealth: '재물/금전운',
  love: '연애/인간관계',
  health: '건강',
  study: '학업/성장',
  overall: '종합운세',
};

export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!API_KEY) {
      console.error('❌ API 키가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다. 서버 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    const { name, birthDate, topic } = await request.json();

    // 입력 검증
    if (!name || !birthDate || !topic) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Gemini 모델 초기화 (요청하신 gemini-2.5-flash 모델 사용)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 프롬프트 생성
    const topicName = topicNames[topic] || topic;
    const prompt = `당신은 전문 운세 상담가입니다. 다음 정보를 바탕으로 2026년 신년 운세를 작성해주세요.

이름: ${name}
생년월일: ${birthDate}
관심 주제: ${topicName}

요구사항:
1. 구체적이고 긍정적인 톤으로 작성
2. 3-4개의 문단으로 구성
3. 각 문단은 다음과 같은 구조로 작성:
   - 첫 번째 문단: 2026년 ${topicName}의 전반적인 흐름과 기운
   - 두 번째 문단: 상반기의 구체적인 조언과 기회
   - 세 번째 문단: 하반기의 변화와 성장 포인트
   - 네 번째 문단: 한 해를 마무리하는 격려와 실천 사항
4. 각 문단은 4-5문장 정도로 작성
5. 구체적인 조언과 실천 가능한 팁 포함
6. 희망적이고 동기부여가 되는 메시지로 마무리

운세를 작성할 때는 일반적인 내용보다는 ${name}님의 생년월일과 선택한 주제에 맞춤화된 내용으로 작성해주세요.`;

    // AI 응답 생성
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fortune = response.text();

    return NextResponse.json({ fortune });
  } catch (error) {
    console.error('Fortune generation error:', error);
    
    // 에러 타입별 메시지 처리
    let errorMessage = '운세 생성 중 오류가 발생했습니다.';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('429')) {
        errorMessage = '일시적으로 요청이 많습니다. 잠시 후 다시 시도해주세요.';
        statusCode = 429;
      } else if (error.message.includes('API key')) {
        errorMessage = 'API 인증에 문제가 있습니다. 관리자에게 문의하세요.';
        statusCode = 401;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
