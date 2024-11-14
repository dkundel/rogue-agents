import { z } from "zod";
import { Resend } from "resend";
import { Ratelimiter } from "../utils";

export const SendEmailReminderArguments = z.object({
  email: z.string(),
  subjectLine: z.string().describe("Use a title that makes the most sense"),
  emailBody: z
    .string()
    .describe("Can use basic HTML tags like <p> or <strong>"),
});
type SendEmailReminderArguments = z.infer<typeof SendEmailReminderArguments>;

export async function sendEmailReminder(args: SendEmailReminderArguments) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: process.env.RESEND_SENDER_EMAIL!,
    to: args.email,
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

// making sure the ratelimiter instance can be stored
// as a globalThis variable to maintain between dev server restarts
declare namespace globalThis {
  var ratelimiter: Ratelimiter | undefined;
}
