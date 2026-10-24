import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.10.0";
import type { Content, GenerateContentResponse } from "https://esm.sh/@google/genai@^1.10.0";
import type { Context } from "https://edge.netlify.com/v1/edge.ts";

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const apiKey = Deno.env.get("API_KEY");
  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
    return new Response(JSON.stringify({ error: "Server configuration error: API key is missing." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { message, history } = await request.json();

    const ai = new GoogleGenAI({ apiKey });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful and friendly AI assistant named Synapse. Provide clear, concise, and informative answers. Format your responses using markdown where appropriate, such as for code blocks, lists, and emphasis.',
      },
      history: history as Content[],
    });

    const streamResponse = await chat.sendMessageStream({ message });

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamResponse) {
          const text = chunk.text;
          if (text) {
              controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("Error in chat edge function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
