# Vercel 환경 변수 설정 가이드

프로젝트가 정상 작동하려면 Vercel에 다음 환경 변수를 설정해야 합니다.

## 환경 변수 설정 방법

1. Vercel 대시보드 접속: https://vercel.com
2. 프로젝트 `my-fourtune` 선택
3. Settings → Environment Variables 이동
4. 아래 변수들을 하나씩 추가

## 필수 환경 변수

### Clerk (인증)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev
```

### Convex (데이터베이스)
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Google AI
```
GOOGLE_API_KEY=your_google_api_key
```

## 환경 변수 추가 후

1. "Save" 버튼 클릭
2. "Redeploy" 버튼으로 재배포
3. 배포 완료 후 앱 확인

## 값 확인 방법

- **Clerk**: https://dashboard.clerk.com → API Keys
- **Convex**: `npx convex dev` 실행 후 .env.local 확인
- **Google AI**: https://makersuite.google.com/app/apikey
