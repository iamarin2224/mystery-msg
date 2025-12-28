import { streamText, UIMessage } from 'ai';
import { google } from "@ai-sdk/google";
import { aiPromptSchema } from '@/schemas/aiPromptSchema';

const SYSTEM_PROMPT = `
Create a list of three open-ended and engaging questions formatted as a single string.
Each question should be separated by '||'.

These questions are for an anonymous social messaging platform like Qooh.me.
They must be suitable for a diverse audience.
Avoid personal, sensitive, or controversial topics.
Focus on universal themes that encourage friendly interaction.

Example output format:
"What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?"

Ensure the questions are intriguing, foster curiosity, and create a positive, welcoming tone.
`;

export async function POST(req: Request) {
    const body = await req.json();

    const parsed = aiPromptSchema.safeParse(body);

    if (!parsed.success) {
    return Response.json(
        {
        success: false,
        message: parsed.error.issues[0].message,
        },
        { status: 400 }
    );
    }

    const { prompt } = parsed.data;

    try {        
        const result = streamText({
                model: google("gemini-2.5-flash-lite"),
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
            });
        
        return result.toUIMessageStreamResponse();
        
    } catch (error) {
        console.error("Error while generating messages: ", error)
        return Response.json({
            success: false,
            message: "Can't suggest messages"
        },{status: 500})
    }

}