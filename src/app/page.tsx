"use client";

import { generateResponse, Message } from "@/server/agent";
import { v4 as uuidv4 } from "uuid";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { ChatDialog } from "@/components/chat-dialog";
import { UserMenu } from "@/components/user-settings";
import { ChatInput } from "@/components/chat-input";
import { ShieldX } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState({
    name: "Demo User",
    email: "demo@example.com",
  });

  async function handleNewMessage(input: string) {
    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: input,
        id: uuidv4(),
      },
    ];
    setMessages(newMessages);
    // passing in the user here is purely illustrative.
    // You should use a session token instead
    const { content } = await generateResponse(newMessages, user);
    let currentAiMessage = undefined;

    for await (const value of readStreamableValue(content)) {
      if (value) {
        const parsedValue = JSON.parse(value) as Message;
        if (parsedValue.role === "tool") {
          newMessages.push(parsedValue);
          setMessages(
            currentAiMessage
              ? [...newMessages, currentAiMessage]
              : [...newMessages]
          );
        } else {
          currentAiMessage = parsedValue;
          setMessages([...newMessages, currentAiMessage]);
        }
      }
    }
  }

  return (
    <div className="p-8 flex flex-col gap-8 w-full max-w-4xl">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldX className="w-7 h-7" />
          <h1 className="uppercase tracking-wide font-black text-2xl text-primary">
            Rogue Agents
          </h1>
        </div>
        <UserMenu user={user} onUserChanged={setUser} />
      </header>
      <ChatDialog messages={messages} />
      <ChatInput onMessage={handleNewMessage} />
    </div>
  );
}
