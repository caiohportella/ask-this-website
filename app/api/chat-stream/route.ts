"use server";

import { ragChat } from "@/app/lib/ragchat";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { messages, sessionId } = await req.json();

  const lastMessage = messages[messages.length - 1].content;

  const res = await ragChat.chat(lastMessage, { sessionId, streaming: true });

  return aiUseChatAdapter(res);
};
