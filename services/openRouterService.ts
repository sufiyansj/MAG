// OpenRouter API Service - Access to multiple AI models through unified API

import { Message, ConversationSettings as BaseConversationSettings, ChatCompletionOptions as BaseChatCompletionOptions } from '../types';

export interface ChatCompletionOptions extends BaseChatCompletionOptions {}

export interface ConversationSettings extends BaseConversationSettings {
  provider: 'openrouter';
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  per_request_limits?: Record<string, number>;
  top_provider?: {
    context_length: number;
    max_completion_tokens?: number;
  };
}

class OpenRouterAPIService {
  private apiKey: string = (import.meta as any).env?.VITE_OPENROUTER_API_KEY || '';
  private baseURL: string = 'https://openrouter.ai/api/v1';
  private defaultModel: string = 'minimax/minimax-m2:free';
  private availableModels: OpenRouterModel[] = [];

  constructor() {
    if (!this.apiKey) {
      // Try to load from localStorage as fallback
      this.apiKey = localStorage.getItem('openrouter_api_key') || '';
      if (!this.apiKey) {
        console.warn('⚠️ OpenRouter API Key not found. Please set VITE_OPENROUTER_API_KEY in your .env file or enter it in the app.');
      }
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
  }

  getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openrouter_api_key') || '';
    }
    
    return this.apiKey;
  }

  hasApiKey(): boolean {
    const key = this.getApiKey();
    const result = !!key && key.length > 0;
    return result;
  }

  clearApiKey() {
    this.apiKey = '';
    localStorage.removeItem('openrouter_api_key');
  }

  // Main chat completion method
  async createChatCompletion(
    messages: Message[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('❌ OpenRouter API key is missing. Please set it in your .env file or enter it in the app.');
    }

    const model = options.model || this.defaultModel;

    // Add referer header for tracking
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Chat Application',
    };

    const requestBody = {
      model: model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 32768,
      top_p: options.top_p ?? 1.0,
      frequency_penalty: options.frequency_penalty ?? 2.0,
      presence_penalty: options.presence_penalty ?? 2.0,
      stream: false,
    };

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMessage = error.error?.message || error.message || `OpenRouter API Error: ${response.status} ${response.statusText}`;
      console.error('❌ API Error Response:', error);
      
      // Special handling for 401 errors
      if (response.status === 401) {
        if (errorMessage.includes('Invalid API Key')) {
          throw new Error('🔐 Invalid API Key: Your API key is not valid. Please get a new key from https://openrouter.ai/keys');
        } else {
          throw new Error('🔐 Authentication Failed: Please check your API key at https://openrouter.ai/keys');
        }
      }
      
      throw new Error(`OpenRouter Error: ${response.status} ${errorMessage}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '⚠️ No response from OpenRouter API.';
  }

  // Streaming chat completion
  async *createStreamingChatCompletion(
    messages: Message[],
    options: ChatCompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('❌ OpenRouter API key is missing. Please set it in your .env file or enter it in the app.');
    }

    const model = options.model || this.defaultModel;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Chat Application',
    };

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 32768,
        top_p: options.top_p ?? 1.0,
        frequency_penalty: options.frequency_penalty ?? 2.0,
        presence_penalty: options.presence_penalty ?? 2.0,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMessage = error.error?.message || error.message || `OpenRouter API Error: ${response.status} ${response.statusText}`;
      console.error('❌ Streaming API Error Response:', error);
      
      // Special handling for 401 errors
      if (response.status === 401) {
        if (errorMessage.includes('Invalid API Key')) {
          throw new Error('🔐 Invalid API Key: Your API key is not valid. Please get a new key from https://openrouter.ai/keys');
        } else {
          throw new Error('🔐 Authentication Failed: Please check your API key at https://openrouter.ai/keys');
        }
      }
      
      throw new Error(`OpenRouter Stream Error: ${response.status} ${errorMessage}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonStr = trimmedLine.slice(6);
              const data = JSON.parse(jsonStr);
              const content = data.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              console.error('Error parsing streaming response:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Get available models (only free models)
  async getModels(category: 'all' | 'free' | 'paid' = 'free'): Promise<OpenRouterModel[]> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        return this.getDefaultModels();
      }

      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
        },
      });

      if (!response.ok) {
        console.warn('Failed to fetch models from OpenRouter, using defaults');
        return this.getDefaultModels();
      }

      const data = await response.json();
      this.availableModels = data.data || [];

      // Always filter to only free models
      return this.availableModels.filter(model =>
        model.per_request_limits &&
        Object.values(model.per_request_limits).some(limit => limit === 0)
      );
    } catch (error) {
      console.error('Error fetching models:', error);
      return this.getDefaultModels();
    }
  }

  private getDefaultModels(): OpenRouterModel[] {
    return [
      {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        name: 'Phi-3 Mini 128K (Free)',
        description: 'Microsoft\'s efficient Phi-3 model with 128K context',
        context_length: 131072,
      },
      {
        id: 'microsoft/wizardlm-2-8x22b:free',
        name: 'WizardLM 2 8x22B (Free)',
        description: 'Microsoft\'s mixture of experts model',
        context_length: 65536,
      },
      {
        id: 'meta-llama/llama-3.2-3b-instruct:free',
        name: 'Llama 3.2 3B Instruct (Free)',
        description: 'Meta\'s efficient Llama 3.2 model for instruction following',
        context_length: 131072,
      },
      {
        id: 'qwen/qwen-2.5-coder-32b-instruct:free',
        name: 'Qwen 2.5 Coder 32B (Free)',
        description: 'Alibaba\'s Qwen 2.5 coder model optimized for programming',
        context_length: 32768,
      },
      {
        id: 'google/gemini-flash-1.5:free',
        name: 'Gemini Flash 1.5 (Free)',
        description: 'Google\'s fast Gemini Flash model with 1M token context',
        context_length: 1048576,
      },
    ];
  }

  // Generate conversation title
  async generateTitle(messages: Message[]): Promise<string> {
    try {
      const titleMessages: Message[] = [
        {
          id: 'system',
          role: 'system',
          content: 'Generate a short, concise title (max 6 words) for this conversation. Reply with only the title, no quotes or extra text.',
          timestamp: Date.now(),
        },
        ...messages.slice(0, 4),
      ];

      const title = await this.createChatCompletion(titleMessages, {
        max_tokens: 20,
        temperature: 0.7,
      });

      return title.trim().replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('Error generating title:', error);
      return 'New Conversation';
    }
  }

  // Code analysis and explanation
  async analyzeCode(code: string, language: string): Promise<string> {
    const messages: Message[] = [
      {
        id: 'system',
        role: 'system',
        content: 'You are an expert code analyzer. Provide detailed explanations and suggestions.',
        timestamp: Date.now(),
      },
      {
        id: 'user',
        role: 'user',
        content: `Analyze this ${language} code and provide:
1. What it does
2. Potential improvements
3. Best practices suggestions

\`\`\`${language}
${code}
\`\`\``,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Text summarization
  async summarizeText(text: string, maxLength: number = 200): Promise<string> {
    const messages: Message[] = [
      {
        id: 'system',
        role: 'system',
        content: `Summarize the following text in approximately ${maxLength} words or less.`,
        timestamp: Date.now(),
      },
      {
        id: 'user',
        role: 'user',
        content: text,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages, {
      max_tokens: Math.ceil(maxLength * 1.5),
    });
  }

  // Translation
  async translateText(text: string, targetLanguage: string): Promise<string> {
    const messages: Message[] = [
      {
        id: 'system',
        role: 'system',
        content: `Translate the following text to ${targetLanguage}. Provide only the translation.`,
        timestamp: Date.now(),
      },
      {
        id: 'user',
        role: 'user',
        content: text,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Writing assistant
  async improveWriting(
    text: string,
    style: 'formal' | 'casual' | 'professional' | 'creative' = 'professional'
  ): Promise<string> {
    const messages: Message[] = [
      {
        id: 'system',
        role: 'system',
        content: `Improve the following text to make it more ${style}. Fix grammar, enhance clarity, and improve overall quality.`,
        timestamp: Date.now(),
      },
      {
        id: 'user',
        role: 'user',
        content: text,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Question answering with context
  async answerWithContext(
    question: string,
    context: string
  ): Promise<string> {
    const messages: Message[] = [
      {
        id: 'system',
        role: 'system',
        content: 'Answer the question based on the provided context. Be accurate and concise.',
        timestamp: Date.now(),
      },
      {
        id: 'user',
        role: 'user',
        content: `Context: ${context}\n\nQuestion: ${question}`,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Generate creative content
  async generateCreativeContent(
    prompt: string,
    type: 'story' | 'poem' | 'essay' | 'article' = 'article'
  ): Promise<string> {
    const messages: Message[] = [
      {
        id: 'system',
        role: 'system',
        content: `You are a creative writer specializing in ${type}s. Write engaging and high-quality content.`,
        timestamp: Date.now(),
      },
      {
        id: 'user',
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages, {
      temperature: 0.9,
      max_tokens: 2048,
    });
  }

  // Get model information
  getModelInfo(modelId: string): OpenRouterModel | null {
    return this.availableModels.find(model => model.id === modelId) || null;
  }

  // Get pricing information
  getModelPricing(modelId: string): { input: number; output: number } | null {
    const model = this.getModelInfo(modelId);
    if (!model?.per_request_limits) return null;

    // This is a simplified pricing structure - actual pricing varies
    const pricing: Record<string, { input: number; output: number }> = {
      'microsoft/phi-3-mini-128k-instruct:free': { input: 0, output: 0 },
      'microsoft/wizardlm-2-8x22b:free': { input: 0, output: 0 },
      'meta-llama/llama-3.2-3b-instruct:free': { input: 0, output: 0 },
      'qwen/qwen-2.5-coder-32b-instruct:free': { input: 0, output: 0 },
      'google/gemini-flash-1.5:free': { input: 0, output: 0 },
    };

    return pricing[modelId] || null;
  }

  // Export conversation
  exportConversation(messages: Message[], format: 'json' | 'markdown' | 'txt'): string {
    if (format === 'json') {
      return JSON.stringify(messages, null, 2);
    }

    if (format === 'markdown') {
      let markdown = '# Conversation Export\n\n';
      messages.forEach(msg => {
        if (msg.role !== 'system') {
          const role = msg.role === 'user' ? '**You**' : '**OpenRouter AI**';
          const date = new Date(msg.timestamp).toLocaleString();
          markdown += `### ${role} - ${date}

${msg.content}

---

`;
        }
      });
      return markdown;
    }

    // Plain text format
    let text = 'Conversation Export\n' + '='.repeat(50) + '\n\n';
    messages.forEach(msg => {
      if (msg.role !== 'system') {
        const role = msg.role === 'user' ? 'You' : 'OpenRouter AI';
        const date = new Date(msg.timestamp).toLocaleString();
        text += `[${role}] - ${date}
${msg.content}

${'-'.repeat(50)}

`;
      }
    });
    return text;
  }

  // Search within conversation
  searchConversation(messages: Message[], query: string): Message[] {
    const lowerQuery = query.toLowerCase();
    return messages.filter(msg =>
      msg.content.toLowerCase().includes(lowerQuery)
    );
  }

  // Get conversation statistics
  getConversationStats(messages: Message[]) {
    const userMessages = messages.filter(m => m.role === 'user');
    const aiMessages = messages.filter(m => m.role === 'assistant');

    const totalWords = messages.reduce((acc, msg) => {
      return acc + msg.content.split(/\s+/).length;
    }, 0);

    const totalCharacters = messages.reduce((acc, msg) => {
      return acc + msg.content.length;
    }, 0);

    const avgResponseTime = aiMessages.length > 1
      ? (aiMessages[aiMessages.length - 1].timestamp - messages[0].timestamp) / aiMessages.length
      : 0;

    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      totalWords,
      totalCharacters,
      avgWordsPerMessage: Math.round(totalWords / messages.length),
      avgResponseTime: Math.round(avgResponseTime / 1000), // in seconds
    };
  }

  // Simple chat response method (backward compatibility)
  async generateChatResponse(prompt: string, model: string = this.defaultModel): Promise<string> {
    const messages: Message[] = [
      {
        id: 'user',
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages, { model });
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/key`, {
        headers: {
          'Authorization': `Bearer ${this.getApiKey()}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Get current rate limits
  async getRateLimits(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/limits`, {
        headers: {
          'Authorization': `Bearer ${this.getApiKey()}`,
        },
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching rate limits:', error);
      return null;
    }
  }
}

export const openRouterAPI = new OpenRouterAPIService();