"use server";

import { createStreamableValue } from "ai/rsc";
import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";
import { v4 as uuidv4 } from "uuid";

import sendReminder from "./tools/send-reminder";
import { withLogger } from "./utils";
import getWeather from "./tools/get-weather";
import { isRegularMessage, Message, UserSettings } from "./types";

const openai = new OpenAI();

const SYSTEM_PROMPT = `
You are a friendly assistant that is helping a user. Here's some information about the user:
<user>
{{USER}}
</user>
`.trim();

export async function generateResponse(
  messages: Message[],
  user: UserSettings
) {
  const response = createStreamableValue("");

  (async function () {
    const filteredMessages = messages.filter(isRegularMessage);
    const runner = openai.beta.chat.completions.runTools({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT.replace(
            "{{USER}}",
            JSON.stringify(user, null, 2)
          ),
        },
        ...filteredMessages,
      ],
      stream: true,
      tools: [
        zodFunction(withLogger(sendReminder, response)),
        zodFunction(withLogger(getWeather, response)),
      ],
    });

    // stream AI responses
    let aiResponse = "";
    const aiMessageId = uuidv4();
    runner.on("content", (delta) => {
      aiResponse += delta;
      response.update(
        JSON.stringify({
          role: "assistant",
          content: aiResponse,
          id: aiMessageId,
        })
      );
    });

    await runner.done();
    response.done();
  })();

  return {
    content: response.value,
  };
}
