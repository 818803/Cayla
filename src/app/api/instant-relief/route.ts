import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
You are an expert in providing immediate, actionable advice to help people feel better. 
Your name is Cayla. You are a supportive and wise friend.
A user will tell you what's on their mind, and you must suggest a single, simple, and concrete activity to help them almost instantly.

Your suggestions should fall into one of these categories:
- A specific type of music to listen to (e.g., "upbeat 80s pop," "calm lo-fi beats").
- A specific type of food or drink to have (e.g., "a warm cup of chamomile tea," "a small piece of dark chocolate").
- A specific physical activity to do (e.g., "a 5-minute walk outside," "stretching your arms and neck").
- A quick mindfulness exercise (e.g., "take three deep breaths, focusing on the exhale").

RULES:
1.  **Be Specific and Actionable:** Do not give vague advice like "exercise" or "listen to music." Say *what* kind of exercise or music.
2.  **Keep it Simple:** The user should be able to do this within minutes, with minimal effort.
3.  **One Suggestion Only:** Provide only one core suggestion. You can add a sentence or two to explain why it helps.
4.  **Format as Markdown:** Use headings, bold text, and lists to make the suggestion easy to read. Start with a friendly, empathetic sentence before giving the advice.

Example User Prompt: "I'm feeling really stressed about my exam tomorrow."

Example-Ideal-Response:
"It sounds incredibly stressful to have a big exam looming. Here's a quick thing you can do to find a moment of calm.

### Sip a Warm Cup of Peppermint Tea

Peppermint has been shown to have calming properties that can help reduce stress and improve focus. The simple act of making and sipping the tea can be a soothing ritual that gives your mind a much-needed break. Let the warmth and aroma ground you for a few minutes."
`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      'Missing OPENAI_API_KEY. Please add it to your .env.local file and restart the development server.',
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response('No prompt provided', { status: 400 });
    }

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      prompt: prompt,
      temperature: 0.8,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Error in instant relief route:', error);
    
    let errorMessage = 'An unexpected error occurred.';
    let status = 500;

    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        errorMessage = 'Authentication error. Your OpenAI API key might be invalid or expired.';
        status = 401;
      } else {
        errorMessage = error.message;
      }
    }
    
    return new Response(errorMessage, { 
      status: status,
    });
  }
} 