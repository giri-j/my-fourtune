"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

// 환경 변수 체크
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Convex URL이 없으면 더미 클라이언트 사용
const convex = convexUrl 
  ? new ConvexReactClient(convexUrl)
  : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Convex URL이 없으면 경고 표시하지만 앱은 계속 작동
  if (!convex) {
    console.warn('NEXT_PUBLIC_CONVEX_URL is not set. Convex features will be disabled.');
    return <>{children}</>;
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
