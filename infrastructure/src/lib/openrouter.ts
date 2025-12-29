/**
 * OpenRouter API Client
 *
 * Handles all LLM calls with:
 * - Zero Data Retention (ZDR) mode
 * - Rate limiting
 * - Retry with exponential backoff
 */

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'deepseek/deepseek-chat'; // DeepSeek v3.2

interface OpenRouterConfig {
  apiKey: string;
  maxRetries?: number;
  retryDelayMs?: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callOpenRouter(
  messages: ChatMessage[],
  config: OpenRouterConfig
): Promise<string> {
  const { apiKey, maxRetries = 3, retryDelayMs = 2000 } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-ZDR': 'true', // Zero Data Retention
          'HTTP-Referer': 'https://reflections.local',
          'X-Title': 'Reflections Pipeline',
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.3, // Lower for more consistent extractions
          response_format: { type: 'json_object' },
        }),
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const delay = retryDelayMs * Math.pow(2, attempt);
        console.log(`Rate limited, waiting ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      if (!response.ok) {
        throw new Error(`OpenRouter error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as ChatResponse;
      return data.choices[0].message.content;
    } catch (error) {
      lastError = error as Error;
      const delay = retryDelayMs * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, waiting ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseJsonResponse<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${content.slice(0, 200)}...`);
  }
}
