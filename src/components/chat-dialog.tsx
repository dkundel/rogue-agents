"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Message } from "@/server/types";
import {
  Bot,
  ChevronsUpDown,
  MailPlus,
  PocketKnife,
  ThermometerSun,
  User,
} from "lucide-react";
import { useState } from "react";

import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";

type ChatMessageProps = {
  content: string;
};

function UserMessage({ content }: ChatMessageProps) {
  return (
    <div className="flex flex-row-reverse gap-4 items-end">
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-primary text-primary-foreground px-4 py-2 max-w-sm rounded-lg rounded-br-none prose">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function AiMessage({ content }: ChatMessageProps) {
  return (
    <div className="flex gap-4  items-end">
      <Avatar>
        <AvatarFallback>
          <Bot className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-secondary text-secondary-foreground px-4 py-2 min-w-64 max-w-[80%] rounded-lg rounded-bl-none prose">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

type ToolMessageProps = {
  name: string;
  input: string;
  output: string;
};

function ToolMessage({ name, input, output }: ToolMessageProps) {
  const [showDetails, setShowDetails] = useState(false);
  let ToolIcon = PocketKnife;
  if (name === "weather") {
    ToolIcon = ThermometerSun;
  } else if (name === "sendEmail") {
    ToolIcon = MailPlus;
  }

  return (
    <div className="flex gap-4">
      <Avatar className="mt-2">
        <AvatarFallback className="border border-input bg-transparent">
          <ToolIcon className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <Collapsible
        open={showDetails}
        onOpenChange={setShowDetails}
        className="px-4 py-2 rounded-lg border-input border w-[80%] whitespace-break-spaces"
      >
        <div className="flex justify-between space-x-4 items-center">
          <p className="font-mono text-sm">
            Tool call: <span className="font-bold">{name}(...)</span>
          </p>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="mt-2">
            <p className="text-xs tracking-wide font-bold mb-2 text-secondary-foreground">
              Input
            </p>
            <pre className="text-xs mb-4 bg-secondary text-secondary-foreground p-4 whitespace-break-spaces">
              {input}
            </pre>
            <p className="text-xs tracking-wide font-bold mb-2 text-secondary-foreground">
              Output
            </p>
            <pre className="text-xs bg-secondary text-secondary-foreground p-4 whitespace-break-spaces">
              {output}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

type ChatDialogProps = {
  messages: Message[];
};

export function ChatDialog({ messages }: ChatDialogProps) {
  return (
    <div className="min-h-32 flex flex-col gap-8">
      {messages.map((message) => {
        return message.role === "user" ? (
          <UserMessage content={message.content} key={message.id} />
        ) : message.role === "assistant" ? (
          <AiMessage content={message.content} key={message.id} />
        ) : message.role === "tool" ? (
          <ToolMessage
            input={message.input}
            output={message.output}
            name={message.name}
            key={message.id}
          />
        ) : null;
      })}
    </div>
  );
}
