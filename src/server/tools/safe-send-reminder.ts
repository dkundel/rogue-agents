import { z } from "zod";
import { Resend } from "resend";
import { Ratelimiter } from "../utils";
import { UserSettings } from "../types";

export const SendEmailReminderArguments = z.object({
  subjectLine: z.string().describe("Use a title that makes the most sense"),
  emailBody: z
    .string()
    .describe("Can use basic HTML tags like <p> or <strong>"),
});
type SendEmailReminderArguments = z.infer<typeof SendEmailReminderArguments>;

declare namespace globalThis {
  let ratelimiter: Ratelimiter | undefined;
}

if (!globalThis.ratelimiter) {
  globalThis.ratelimiter = new Ratelimiter({ limit: 2 });
}

export async function sendEmailReminder(
  args: SendEmailReminderArguments,
  user: UserSettings
) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  if (!globalThis.ratelimiter?.check(user.email)) {
    return {
      success: false,
      message: "Daily rate limit hit!",
    };
  }

  const result = await resend.emails.send({
    from: process.env.RESEND_SENDER_EMAIL!,
    to: user.email,
    subject: args.subjectLine,
    html: args.emailBody,
  });

  return {
    success: true,
    message: "Email sent!",
    debugInfo: result.data?.id,
  };
}

export default {
  name: "sendEmail",
  function: sendEmailReminder,
  parameters: SendEmailReminderArguments,
};
