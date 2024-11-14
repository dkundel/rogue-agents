export type RegularMessage = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

export type ToolMessage = {
  role: "tool";
  name: string;
  input: string;
  output: string;
  id: string;
};

export type Message = RegularMessage | ToolMessage;

export type UserSettings = {
  name: string;
  email: string;
};

export function isRegularMessage(msg: Message): msg is RegularMessage {
  return msg.role !== "tool";
}
