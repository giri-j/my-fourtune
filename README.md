# 2026 AI 신년운세 서비스

AI가 전하는 당신만의 특별한 새해 운세 서비스입니다.

## 주요 기능

- 🔐 **사용자 인증**: Clerk를 통한 안전한 회원가입/로그인
- 💾 **운세 저장**: Convex DB에 운세 기록 자동 저장
- 📜 **운세 기록**: 과거 생성한 운세 목록 조회 및 재확인
- 🎴 **맞춤형 운세**: 이름과 생년월일 기반 개인화된 운세
- 🔮 **다양한 주제**: 커리어, 재물운, 연애운, 건강, 학업, 종합운세
- ✨ **AI 기반**: Google Gemini 2.5 Flash 모델 사용
- 📱 **모바일 최적화**: 반응형 디자인 (max-width: 450px)
- 🎨 **토스 스타일 UI**: 깔끔하고 현대적인 디자인

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: Convex (Real-time DB)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Animation**: Framer Motion
- **AI Model**: Google Gemini 2.5 Flash
- **Dependencies**: 
  - `@clerk/nextjs` - 사용자 인증
  - `convex` - 실시간 데이터베이스
  - `@google/generative-ai` - Gemini AI SDK
  - `date-fns` - 날짜 포맷팅
  - `lucide-react` - 아이콘
  - `framer-motion` - 애니메이션

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 추가하세요:

```env
# Clerk (https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Clerk Frontend API (Convex 연동용)
CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev

# Clerk 리디렉션 경로
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/fortune
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/fortune

# Convex (https://dashboard.convex.dev)
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Google AI
GOOGLE_API_KEY=your_google_api_key
```

**Clerk API 키 발급:**
1. https://dashboard.clerk.com 에서 프로젝트 생성
2. **API Keys** 메뉴에서 다음 정보 확인:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`
3. **JWT Templates** 탭 클릭 → "Convex" 템플릿 선택/생성
4. **Issuer** 필드 값 복사 (예: `https://your-app.clerk.accounts.dev`) → `CLERK_FRONTEND_API_URL`
5. `.env.local`에 모두 복사/붙여넣기

**Convex 설정:**
1. https://dashboard.convex.dev 에서 프로젝트 생성
2. `npx convex dev` 명령으로 개발 환경 연결
3. Deployment URL을 `.env.local`에 추가

**Google AI API 키 발급:**
- Google AI Studio에서 발급: https://makersuite.google.com/app/apikey

### 3. Convex 개발 서버 실행

별도 터미널에서 Convex 개발 서버를 실행하세요:

```bash
npx convex dev
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
my-fourtune/
├── app/
│   ├── page.tsx              # 랜딩 페이지
│   ├── fortune/
│   │   └── page.tsx          # 운세 입력/결과 페이지
│   ├── api/
│   │   └── fortune/
│   │       └── route.ts      # AI 운세 생성 API
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # 글로벌 스타일
├── components/
│   └── ui/                   # Shadcn UI 컴포넌트
└── lib/
    └── utils.ts              # 유틸리티 함수
```

## 주요 페이지

### 랜딩 페이지 (`/`)
- 서비스 소개
- 6가지 운세 주제 안내
- 로그인/회원가입 버튼 (우측 상단)
- "나의 운세 보러가기" CTA 버튼
- **비로그인 사용자도 접근 가능**

### 운세 페이지 (`/fortune`)
- **로그인 필수** (Clerk Middleware로 보호)
- 사용자 정보 입력 폼
  - 이름 (자동 입력 - Clerk 사용자 정보)
  - 생년월일 (데이트피커)
  - 궁금한 주제 (카드 선택)
- AI 운세 결과 표시
- **운세 자동 저장** (Convex DB)
- **과거 운세 기록 조회**
  - 날짜별 운세 목록
  - 카드 형태로 표시
  - 클릭하면 전체 내용 보기
  - 최신순 정렬
- 사용자 프로필 버튼 (우측 상단)
- 다시하기 기능

## API 엔드포인트

### POST `/api/fortune`

**Request Body:**
```json
{
  "name": "홍길동",
  "birthDate": "1990-01-01",
  "topic": "career"
}
```

**Response:**
```json
{
  "fortune": "2026년 홍길동님의 커리어/진로 운세입니다..."
}
```

**지원하는 주제:**
- `career` - 커리어/진로
- `wealth` - 재물/금전운
- `love` - 연애/인간관계
- `health` - 건강
- `study` - 학업/성장
- `overall` - 종합운세

## 디자인 특징

- **그라디언트 배경**: 보라-핑크-노란색 그라디언트
- **카드 기반 레이아웃**: 깔끔한 카드 UI
- **부드러운 애니메이션**: fade-in, slide-in 효과
- **반응형 디자인**: 모바일 우선 디자인
- **접근성**: 시맨틱 HTML과 적절한 ARIA 속성

## 배포

### Vercel (권장)

```bash
npm run build
vercel deploy
```

환경 변수(`GOOGLE_API_KEY`)를 Vercel 프로젝트 설정에 추가하세요.

## 라이선스

MIT

## 개발자

AI 기반 맞춤형 운세 서비스
