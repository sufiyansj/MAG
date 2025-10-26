// Groq API Service - Comprehensive AI Service with streaming support

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  images?: string[];
  model?: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface ConversationSettings {
  systemPrompt?: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

class GroqAPIService {
  private apiKey: string =
    "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";
  private baseURL: string = "https://api.groq.com/openai/v1";
  private defaultModel: string = "llama-3.1-8b-instant";

  setApiKey(key: string) {
    // API key is hardcoded, this method is kept for compatibility
    this.apiKey = "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";
  }

  getApiKey(): string {
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return true; // Always true since we have hardcoded key
  }

  clearApiKey() {
    // API key cannot be cleared, this method is kept for compatibility
  }

  // Main chat completion method
  async createChatCompletion(
    messages: Message[],
    options: ChatCompletionOptions = {},
  ): Promise<string> {
    const apiKey = this.getApiKey();

    const requestBody = {
      model: options.model || this.defaultModel,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4096,
      top_p: options.top_p ?? 1,
      frequency_penalty: options.frequency_penalty ?? 0,
      presence_penalty: options.presence_penalty ?? 0,
      stream: false,
    };

    console.log("Groq API Request:", {
      url: `${this.baseURL}/chat/completions`,
      model: requestBody.model,
      messageCount: messages.length,
    });

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
        console.error("Groq API Error:", errorJson);
      } catch (e) {
        console.error("Groq API Error (raw):", errorText);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  // Streaming chat completion
  async *createStreamingChatCompletion(
    messages: Message[],
    options: ChatCompletionOptions = {},
  ): AsyncGenerator<string, void, unknown> {
    const apiKey = this.getApiKey();

    const requestBody = {
      model: options.model || this.defaultModel,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4096,
      top_p: options.top_p ?? 1,
      frequency_penalty: options.frequency_penalty ?? 0,
      presence_penalty: options.presence_penalty ?? 0,
      stream: true,
    };

    console.log("Groq API Streaming Request:", {
      url: `${this.baseURL}/chat/completions`,
      model: requestBody.model,
      messageCount: messages.length,
    });

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
        console.error("Groq API Streaming Error:", errorJson);
      } catch (e) {
        console.error("Groq API Streaming Error (raw):", errorText);
      }

      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
          if (trimmedLine.startsWith("data: ")) {
            try {
              const jsonStr = trimmedLine.slice(6);
              const data = JSON.parse(jsonStr);
              const content = data.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              console.error("Error parsing streaming response:", e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Generate conversation title
  async generateTitle(messages: Message[]): Promise<string> {
    try {
      const titleMessages: Message[] = [
        {
          id: "system",
          role: "system",
          content:
            "Generate a short, concise title (max 6 words) for this conversation. Reply with only the title, no quotes or extra text.",
          timestamp: Date.now(),
        },
        ...messages.slice(0, 4),
      ];

      const title = await this.createChatCompletion(titleMessages, {
        max_tokens: 20,
        temperature: 0.7,
      });

      return title.trim().replace(/^["']|["']$/g, "");
    } catch (error) {
      console.error("Error generating title:", error);
      return "New Conversation";
    }
  }

  // Get available models
  async getModels(): Promise<string[]> {
    return [
      "llama-3.1-8b-instant",
      "llama-3.1-70b-versatile",
      "llama-3.2-1b-preview",
      "llama-3.2-3b-preview",
      "llama-3.2-11b-vision-preview",
      "llama-3.2-90b-vision-preview",
      "mixtral-8x7b-32768",
      "gemma2-9b-it",
    ];
  }

  // Code analysis and explanation
  async analyzeCode(code: string, language: string): Promise<string> {
    const messages: Message[] = [
      {
        id: "system",
        role: "system",
        content:
          "You are an expert code analyzer. Provide detailed explanations and suggestions.",
        timestamp: Date.now(),
      },
      {
        id: "user",
        role: "user",
        content: `Analyze this ${language} code and provide:\n1. What it does\n2. Potential improvements\n3. Best practices suggestions\n\n\`\`\`${language}\n${code}\n\`\`\``,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Text summarization
  async summarizeText(text: string, maxLength: number = 200): Promise<string> {
    const messages: Message[] = [
      {
        id: "system",
        role: "system",
        content: `Summarize the following text in approximately ${maxLength} words or less.`,
        timestamp: Date.now(),
      },
      {
        id: "user",
        role: "user",
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
        id: "system",
        role: "system",
        content: `Translate the following text to ${targetLanguage}. Provide only the translation.`,
        timestamp: Date.now(),
      },
      {
        id: "user",
        role: "user",
        content: text,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Writing assistant
  async improveWriting(
    text: string,
    style: "formal" | "casual" | "professional" | "creative" = "professional",
  ): Promise<string> {
    const messages: Message[] = [
      {
        id: "system",
        role: "system",
        content: `Improve the following text to make it more ${style}. Fix grammar, enhance clarity, and improve overall quality.`,
        timestamp: Date.now(),
      },
      {
        id: "user",
        role: "user",
        content: text,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Question answering with context
  async answerWithContext(question: string, context: string): Promise<string> {
    const messages: Message[] = [
      {
        id: "system",
        role: "system",
        content:
          "Answer the question based on the provided context. Be accurate and concise.",
        timestamp: Date.now(),
      },
      {
        id: "user",
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${question}`,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages);
  }

  // Generate creative content
  async generateCreativeContent(
    prompt: string,
    type: "story" | "poem" | "essay" | "article" = "article",
  ): Promise<string> {
    const messages: Message[] = [
      {
        id: "system",
        role: "system",
        content: `You are a creative writer specializing in ${type}s. Write engaging and high-quality content.`,
        timestamp: Date.now(),
      },
      {
        id: "user",
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      },
    ];

    return await this.createChatCompletion(messages, {
      temperature: 0.9,
      max_tokens: 2048,
    });
  }

  // Export conversation
  exportConversation(
    messages: Message[],
    format: "json" | "markdown" | "txt",
  ): string {
    if (format === "json") {
      return JSON.stringify(messages, null, 2);
    }

    if (format === "markdown") {
      let markdown = "# Conversation Export\n\n";
      messages.forEach((msg) => {
        if (msg.role !== "system") {
          const role = msg.role === "user" ? "**You**" : "**AI**";
          const date = new Date(msg.timestamp).toLocaleString();
          markdown += `### ${role} - ${date}\n\n${msg.content}\n\n---\n\n`;
        }
      });
      return markdown;
    }

    // Plain text format
    let text = "Conversation Export\n" + "=".repeat(50) + "\n\n";
    messages.forEach((msg) => {
      if (msg.role !== "system") {
        const role = msg.role === "user" ? "You" : "AI";
        const date = new Date(msg.timestamp).toLocaleString();
        text += `[${role}] - ${date}\n${msg.content}\n\n${"-".repeat(50)}\n\n`;
      }
    });
    return text;
  }

  // Search within conversation
  searchConversation(messages: Message[], query: string): Message[] {
    const lowerQuery = query.toLowerCase();
    return messages.filter((msg) =>
      msg.content.toLowerCase().includes(lowerQuery),
    );
  }

  // Get conversation statistics
  getConversationStats(messages: Message[]) {
    const userMessages = messages.filter((m) => m.role === "user");
    const aiMessages = messages.filter((m) => m.role === "assistant");

    const totalWords = messages.reduce((acc, msg) => {
      return acc + msg.content.split(/\s+/).length;
    }, 0);

    const totalCharacters = messages.reduce((acc, msg) => {
      return acc + msg.content.length;
    }, 0);

    const avgResponseTime =
      aiMessages.length > 1
        ? (aiMessages[aiMessages.length - 1].timestamp -
            messages[0].timestamp) /
          aiMessages.length
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
}

export const groqAPI = new GroqAPIService();
