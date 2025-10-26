export type MessageRole = 'user' | 'model';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  isLoading?: boolean;
  isError?: boolean;
}
