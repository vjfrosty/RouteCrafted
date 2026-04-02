import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://routecrafted.com",
        "X-Title": "RouteCrafted",
      },
    });
  }
  return _client;
}

export async function generateJSON<T>(prompt: string, model?: string): Promise<T> {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: model ?? process.env.OPENROUTER_MODEL ?? "deepseek/deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  const content = completion.choices[0].message.content;
  if (!content) throw new Error("OpenRouter returned empty response");
  return JSON.parse(content) as T;
}
