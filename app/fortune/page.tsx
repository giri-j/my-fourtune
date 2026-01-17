'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Loader2, ArrowLeft, Share2, CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUser, UserButton } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

const topics = [
  { value: 'career', label: '커리어/진로', emoji: '💼' },
  { value: 'wealth', label: '재물/금전운', emoji: '💰' },
  { value: 'love', label: '연애/인간관계', emoji: '💕' },
  { value: 'health', label: '건강', emoji: '🏥' },
  { value: 'study', label: '학업/성장', emoji: '📚' },
  { value: 'overall', label: '종합운세', emoji: '🌟' },
];

export default function FortunePage() {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [topic, setTopic] = useState('');
  const [fortune, setFortune] = useState('');
  const [currentFortuneId, setCurrentFortuneId] = useState<Id<"fortunes"> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const currentYear = new Date().getFullYear();

  // Convex hooks
  const saveFortune = useMutation(api.fortunes.saveFortune);
  const userFortunes = useQuery(
    api.fortunes.getUserFortunes,
    user?.id ? { userId: user.id } : "skip"
  );

  // 사용자 정보가 로드되면 자동으로 이름 채우기
  React.useEffect(() => {
    if (user?.firstName) {
      setName(user.firstName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate || !topic) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const formattedDate = format(birthDate, 'yyyy-MM-dd');
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate: formattedDate, topic }),
      });
      if (!response.ok) throw new Error('운세를 생성하는데 실패했습니다.');
      const data = await response.json();
      setFortune(data.fortune);

      // Convex에 저장
      if (user?.id) {
        const selectedTopic = topics.find(t => t.value === topic);
        const fortuneId = await saveFortune({
          userId: user.id,
          name,
          birthDate: formattedDate,
          topic,
          topicLabel: selectedTopic?.label || topic,
          fortune: data.fortune,
        });
        setCurrentFortuneId(fortuneId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryFortune = (historyFortune: any) => {
    setName(historyFortune.name);
    setBirthDate(new Date(historyFortune.birthDate));
    setTopic(historyFortune.topic);
    setFortune(historyFortune.fortune);
    setCurrentFortuneId(historyFortune._id);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 pb-12 font-sans">
      <div className="w-full max-w-[450px] space-y-6">
        {/* 네비게이션 */}
        <div className="flex items-center justify-between py-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <span className="font-bold text-slate-800 text-lg">신년 운세</span>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!fortune ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  운세를 보는데 필요한<br />정보를 입력해주세요
                </h2>
                <p className="text-slate-500 font-medium text-sm">정보는 운세 생성에만 사용됩니다</p>
              </div>

              <div className="space-y-8 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                {/* 이름 */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-slate-500 font-bold ml-1">이름</Label>
                  <Input
                    id="name"
                    placeholder="성함을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-slate-50 border-none rounded-2xl text-lg font-medium px-5 focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>

                {/* 생년월일 */}
                <div className="space-y-3">
                  <Label className="text-slate-500 font-bold ml-1">생년월일</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-14 bg-slate-50 border-none rounded-2xl text-lg font-medium px-5 justify-start text-left",
                          !birthDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5 text-slate-400" />
                        {birthDate ? (
                          format(birthDate, "yyyy년 MM월 dd일", { locale: ko })
                        ) : (
                          <span>생년월일을 선택하세요</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-[24px] border-slate-100 shadow-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={birthDate}
                        onSelect={setBirthDate}
                        locale={ko}
                        fromYear={1950}
                        toYear={currentYear}
                        captionLayout="dropdown"
                        initialFocus
                        className="p-4"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 주제 */}
                <div className="space-y-3">
                  <Label className="text-slate-500 font-bold ml-1">관심 주제</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {topics.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTopic(t.value)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                          topic === t.value 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-slate-50 bg-slate-50 text-slate-500'
                        }`}
                      >
                        <span className="text-2xl mb-1">{t.emoji}</span>
                        <span className="text-sm font-bold">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-16 text-lg font-bold rounded-2xl bg-[#0050ff] hover:bg-[#0040cc] text-white shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:bg-slate-200"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : '운세 생성하기'}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pt-4"
            >
              <div className="space-y-2 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  {topics.find(t => t.value === topic)?.emoji}
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {name}님에게 찾아올<br />2026년 행운의 메시지
                </h2>
              </div>

              <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                <CardContent className="p-8 space-y-6">
                  {birthDate && (
                    <div className="text-center pb-4 border-b border-slate-50">
                      <p className="text-slate-400 font-bold text-sm">
                        {format(birthDate, "yyyy년 MM월 dd일", { locale: ko })} 생
                      </p>
                    </div>
                  )}
                  <div className="prose prose-slate prose-lg max-w-none">
                    <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap break-keep">
                      {fortune}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  onClick={() => { setFortune(''); setTopic(''); setCurrentFortuneId(null); }}
                  className="w-full h-16 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-95"
                >
                  다시 보기
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full h-14 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl"
                >
                  <Clock className="w-5 h-5 mr-2" /> 내 운세 기록 보기
                </Button>
              </div>

              {/* 운세 기록 */}
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 mt-6"
                >
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    과거 운세 기록
                  </h3>
                  
                  {userFortunes && userFortunes.length > 0 ? (
                    <div className="space-y-3">
                      {userFortunes.map((historyItem) => {
                        const historyTopic = topics.find(t => t.value === historyItem.topic);
                        const isCurrentFortune = currentFortuneId === historyItem._id;
                        
                        return (
                          <Card 
                            key={historyItem._id}
                            className={cn(
                              "rounded-2xl border transition-all cursor-pointer hover:shadow-lg",
                              isCurrentFortune 
                                ? "border-blue-500 bg-blue-50" 
                                : "border-slate-100 hover:border-slate-200"
                            )}
                            onClick={() => !isCurrentFortune && loadHistoryFortune(historyItem)}
                          >
                            <CardContent className="p-5">
                              <div className="flex items-start gap-4">
                                <div className="text-3xl">{historyTopic?.emoji}</div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-900">
                                      {historyItem.topicLabel}
                                    </h4>
                                    <span className="text-xs text-slate-400 font-medium">
                                      {format(new Date(historyItem.createdAt), 'MM월 dd일', { locale: ko })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 line-clamp-2">
                                    {historyItem.fortune.substring(0, 100)}...
                                  </p>
                                  {isCurrentFortune && (
                                    <span className="inline-block text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                      현재 보는 중
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card className="rounded-2xl border-slate-100">
                      <CardContent className="p-8 text-center">
                        <div className="text-4xl mb-3">🔮</div>
                        <p className="text-slate-500 font-medium">
                          아직 운세를 생성하지 않았습니다
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 운세 폼 하단에도 기록 버튼 추가 */}
        {!fortune && userFortunes && userFortunes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 font-bold"
            >
              <Clock className="w-5 h-5 mr-2" /> 
              과거 운세 {userFortunes.length}개 보기
            </Button>

            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 mt-4"
              >
                {userFortunes.map((historyItem) => {
                  const historyTopic = topics.find(t => t.value === historyItem.topic);
                  
                  return (
                    <Card 
                      key={historyItem._id}
                      className="rounded-2xl border-slate-100 hover:border-slate-200 transition-all cursor-pointer hover:shadow-md"
                      onClick={() => loadHistoryFortune(historyItem)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{historyTopic?.emoji}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900">
                                {historyItem.topicLabel}
                              </h4>
                              <span className="text-xs text-slate-400 font-medium">
                                {format(new Date(historyItem.createdAt), 'MM월 dd일', { locale: ko })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {historyItem.fortune.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
