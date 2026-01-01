import { streamText } from 'ai';
import { google } from "@ai-sdk/google";
import { groq } from '@ai-sdk/groq';
import { aiPromptSchema } from '@/schemas/aiPromptSchema';

const SYSTEM_PROMPT = `
Create a list of three open-ended and engaging questions formatted as a single string.
Each question should be separated by '||'.

These questions are for an anonymous social messaging platform like Qooh.me.
They must be suitable for a diverse audience.
Avoid personal, sensitive, or controversial topics.
Focus on universal themes that encourage friendly interaction.

Example output format:
What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?

Ensure the questions are intriguing, foster curiosity, and create a positive, welcoming tone.
`;

let geminiBlockedUntil:number = 0;

function isGeminiAvailable() {
    return Date.now() > geminiBlockedUntil;
}

function blockGemini(seconds: number) {
    geminiBlockedUntil = Date.now() + seconds * 1000;
}

function isGeminiQuotaError(err: any) {
    const msg =
        err?.message ||
        err?.cause?.message ||
        err?.error?.message ||
        "";

    return (
        err?.status === 429 ||
        err?.code === "RESOURCE_EXHAUSTED" ||
        msg.includes("generativelanguage.googleapis.com") ||
        msg.includes("generate_content_free_tier_requests") ||
        msg.includes("ai.dev/usage")
    );
}

export async function POST(req: Request) {
    const body = await req.json();

    const parsed = aiPromptSchema.safeParse(body);

    if (!parsed.success) {
    return Response.json({
        success: false,
        message: parsed.error.issues[0].message,
        }, { status: 400 } );
    }

    const { prompt } = parsed.data;

    const useGemini = isGeminiAvailable();

    const model = useGemini
        ? google("gemini-2.5-flash-lite")
        : groq("llama-3.3-70b-versatile");


    try {        
        const result = streamText({
            model,
            maxOutputTokens: 200,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: `Generate questions based on this theme: ${prompt}`,
                },
            ],
            onError: async (event) => {
                const err = event.error;

                if (isGeminiQuotaError(err)) {
                    blockGemini(24 * 60 * 60);
                    console.warn("Gemini blocked due to quota exhaustion");
                }
            },
        });
        
        return result.toUIMessageStreamResponse();
        
    } catch (error: any) {
        return Response.json({
            success: false,
            message: "Invalid request. Unable to generate suggestions.",
        }, { status: 400 } );
    }
}