// chat/model.ts

import { OpenAI } from "openai"; // adjust based on your setup

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ensure this is set in your environment
});

export async function getCaylaResponse(userMessage: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4", // or gpt-3.5-turbo, depending on your plan
    messages: [
      {
        role: "system",
        content: "You are Cayla, a friendly and intelligent AI chatbot. You help users in a warm and professional tone.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
