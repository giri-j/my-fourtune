import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  fortunes: defineTable({
    userId: v.string(),
    name: v.string(),
    birthDate: v.string(),
    topic: v.string(),
    topicLabel: v.string(),
    fortune: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_created", ["userId", "createdAt"]),
});
