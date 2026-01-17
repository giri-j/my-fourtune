import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 운세 저장
export const saveFortune = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    birthDate: v.string(),
    topic: v.string(),
    topicLabel: v.string(),
    fortune: v.string(),
  },
  handler: async (ctx, args) => {
    // 인증 확인 (선택적 - Clerk 인증을 사용하는 경우)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 인증된 사용자 ID와 요청한 userId가 일치하는지 확인
    if (identity.subject !== args.userId) {
      throw new Error("Unauthorized");
    }

    const fortuneId = await ctx.db.insert("fortunes", {
      ...args,
      createdAt: Date.now(),
    });
    return fortuneId;
  },
});

// 사용자의 운세 목록 조회 (최신순)
export const getUserFortunes = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // 인증 확인
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // 본인의 운세만 조회 가능
    if (identity.subject !== args.userId) {
      throw new Error("Unauthorized");
    }

    const fortunes = await ctx.db
      .query("fortunes")
      .withIndex("by_user_and_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    
    return fortunes;
  },
});

// 특정 운세 조회
export const getFortune = query({
  args: {
    id: v.id("fortunes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const fortune = await ctx.db.get(args.id);
    
    // 본인의 운세만 조회 가능
    if (fortune && fortune.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    return fortune;
  },
});
