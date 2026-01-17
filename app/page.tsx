'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6 pb-12 font-sans overflow-hidden">
      {/* 상단 장식 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      {/* 우측 상단 사용자 버튼 */}
      <div className="absolute top-6 right-6 z-10">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="rounded-full font-bold border-slate-200 hover:bg-slate-50">
              로그인
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </SignedIn>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[400px] space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-7xl mb-6 inline-block"
          >
            🔮
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            2026년 나의 행운은<br />어떤 모습일까요?
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            AI가 들려주는 당신의 신년 이야기
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {[
            { label: '재물운', emoji: '💰' },
            { label: '연애운', emoji: '💖' },
            { label: '커리어', emoji: '🚀' },
            { label: '건강운', emoji: '🍀' },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 rounded-2xl p-4 flex items-center space-x-3 border border-slate-100/50"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="font-semibold text-slate-700">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </main>

      {/* 하단 버튼 (토스 스타일의 고정 버튼 느낌) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        <Link href="/fortune">
          <Button 
            className="w-full h-16 text-lg font-bold rounded-2xl bg-[#0050ff] hover:bg-[#0040cc] text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            내 운세 확인하기
          </Button>
        </Link>
        <p className="text-center mt-4 text-slate-400 text-sm font-medium">
          이미 1,240명이 확인했어요
        </p>
      </motion.div>
    </div>
  );
}
