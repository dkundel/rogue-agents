# Rogue Agents Sample Application

This application is meant to highlight some key risks with giving AI Agents access to different tools. It's used as an illustrative application in my talk "Rogue Agents — Stop AI from misusing APIs".

> [!CAUTION]
> If you set up this application on your own please be aware that it contains intentionally some security vulnerabilities. Do not deploy this to production.

## Requirements

1. Node.js & npm
2. An OpenAI API Key
3. A Resend API Key and an onboarded domain (for the email tool)

## Setup

1. Clone the repository and install dependencies

```bash
git clone https://github.com/dkundel/rogue-agents.git
cd rogue-agents
npm install
```

2. Setup credentials

```bash
cp .env.example .env.local
```

Add your OpenAI API Key, Resend API Key and the email address you want to use to send emails from to your `.env.local` file.

3. Run the repository in local development mode

```bash
npm run dev
```

4. Visit http://localhost:3000 to chat with your application

## Vulnerabilities

1. The `sendEmail` tool can be used to send an email to any email
2. The `weather` tool manipulates the tool execution through prompt injections when you search for the weather in `Oakland` or `San Francisco`.
3. Each tool can be executed an arbitrary time, for the `sendEmail` tool that means it can be used for intentional (or unintentional) spamming.

My goal is to add more vulnerabilities over time.

## License

MIT
