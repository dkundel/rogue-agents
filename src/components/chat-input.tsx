"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from "react";

type ChatInputProps = {
  onMessage: (message: string) => void;
};

export function ChatInput({ onMessage }: ChatInputProps) {
  const ref = useRef<HTMLFormElement>();
  const inputRef = useRef<HTMLInputElement>();
  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();

    const value = evt.target.message.value;
    if (value) {
      evt.target.message.value = "";
      onMessage(value);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (evt) => {
    if (evt.metaKey && evt.key === "Enter" && ref.current) {
      ref.current.requestSubmit();
    } else if (window && evt.metaKey && evt.key === "r") {
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={ref}>
      <Textarea
        name="message"
        placeholder="Type in a message..."
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
