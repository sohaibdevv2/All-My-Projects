
import { GoogleGenAI, Chat } from '@google/genai';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function startChat(): Chat {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and friendly AI assistant named Synapse. Provide clear, concise, and informative answers. Format your responses using markdown where appropriate, such as for code blocks, lists, and emphasis.',
        },
    });
}
