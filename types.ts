export type MessageRole = 'user' | 'assistant' | 'system';

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
  images?: string[];
  attachments?: FileAttachment[];
  model?: string;
}

export type APIProvider = 'openrouter';

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
  provider: APIProvider;
}

export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  provider: APIProvider;
  pricing?: {
    input: number;
    output: number;
  };
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export interface RateLimitInfo {
  remaining?: number;
  resetTime?: number;
  total?: number;
}

export interface APIConfig {
  apiKey?: string;
  baseURL?: string;
  provider: APIProvider;
}

// Utility type for API responses
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
}

// Type for export formats
export type ExportFormat = 'json' | 'markdown' | 'txt';

// Type for creative content types
export type CreativeContentType = 'story' | 'poem' | 'essay' | 'article';

// Type for writing styles
export type WritingStyle = 'formal' | 'casual' | 'professional' | 'creative';

// Type for model categories
export type ModelCategory = 'all' | 'free' | 'paid';
