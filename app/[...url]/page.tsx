"use server";

import { cookies } from "next/headers";
import ChatWrapper from "../components/ChatWrapper";
import { ragChat } from "../lib/ragchat";
import { redis } from "../lib/redis";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

const reconstructUrl = ({ url }: { url: string[] }) => {
  const decodedComponents = url.map((component) =>
    decodeURIComponent(component)
  );

  return decodedComponents.join("/");
};

const ChatbotPage = async ({ params }: PageProps) => {
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });

  const sessionCookie = cookies().get("sessionId")?.value || "mock-session";

  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(
    /\//g,
    ""
  );

  const initialMessages = await ragChat.history.getMessages({
    amount: 10,
    sessionId,
  });

  const isAlreadyIndexed = await redis.sismember(
    "indexed-urls",
    reconstructedUrl
  );

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: {
        chunkOverlap: 50,
        chunkSize: 200,
      },
    });

    await redis.sadd("indexed-urls", reconstructedUrl);
  }

  return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages}></ChatWrapper>;
};

export default ChatbotPage;
