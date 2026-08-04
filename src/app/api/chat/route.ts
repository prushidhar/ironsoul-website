import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = streamText({
            model: google('gemini-1.5-flash'),
            system: `You are the official IronSoul AI Assistant. IronSoul is a youth organization dedicated to empowering students with confidence, resilience, and leadership skills through public speaking and JAM sessions. You should be highly motivating, polite, and strictly answer questions related to public speaking, leadership, or IronSoul events. If a user asks about anything completely unrelated to education, leadership, or IronSoul, politely steer the conversation back. Keep your responses short, punchy, and engaging. Avoid massive walls of text.`,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: "Failed to generate AI response." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
