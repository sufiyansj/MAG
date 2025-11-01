import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  openRouterAPI,
} from "../services/openRouterService";
import {
  APIProvider,
  ChatCompletionOptions,
  ConversationSettings,
  Message
} from "../types";

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  settings: ConversationSettings;
  pinned?: boolean;
  folder?: string;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;

  // Conversation management
  createConversation: (title?: string) => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  clearConversations: () => void;
  duplicateConversation: (id: string) => void;
  pinConversation: (id: string) => void;

  // Message management
  sendMessage: (content: string, attachments?: any[]) => Promise<void>;
  regenerateLastResponse: () => Promise<void>;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;

  // Settings
  updateSettings: (settings: Partial<ConversationSettings>) => void;

  // Export/Import
  exportConversation: (id: string, format: "json" | "markdown" | "txt") => void;
  importConversation: (data: string) => void;

  // Search
  searchMessages: (query: string) => Message[];

  // API Key management
  setApiKey: (key: string) => void;
  hasApiKey: () => boolean;

  // Provider management
  setApiProvider: (provider: APIProvider) => void;
  getCurrentProvider: () => APIProvider;
  getAvailableProviders: () => APIProvider[];
  
  // Advanced features
  summarizeConversation: () => Promise<void>;
  translateMessage: (messageId: string, language: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// API service abstraction
class APIServiceAdapter {
  private openRouterService = openRouterAPI;

  setProvider(provider: APIProvider) {
    // Only OpenRouter is supported
    localStorage.setItem('ai_api_provider', 'openrouter');
  }

  getProvider(): APIProvider {
    return 'openrouter';
  }

  getAPI() {
    return this.openRouterService;
  }

  hasApiKey(): boolean {
    return this.getAPI().hasApiKey();
  }

  setApiKey(key: string) {
    this.getAPI().setApiKey(key);
  }

  async createChatCompletion(messages: Message[], options: ChatCompletionOptions = {}): Promise<string> {
    return await this.getAPI().createChatCompletion(messages, options);
  }

  async *createStreamingChatCompletion(messages: Message[], options: ChatCompletionOptions = {}): AsyncGenerator<string, void, unknown> {
    yield* this.getAPI().createStreamingChatCompletion(messages, options);
  }

  async generateTitle(messages: Message[]): Promise<string> {
    return await this.getAPI().generateTitle(messages);
  }

  exportConversation(messages: Message[], format: "json" | "markdown" | "txt"): string {
    return this.getAPI().exportConversation(messages, format);
  }

  searchConversation(messages: Message[], query: string): Message[] {
    return this.getAPI().searchConversation(messages, query);
  }

  async summarizeText(text: string, maxLength: number = 200): Promise<string> {
    return await this.getAPI().summarizeText(text, maxLength);
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    return await this.getAPI().translateText(text, targetLanguage);
  }
}

const apiAdapter = new APIServiceAdapter();

const DEFAULT_SETTINGS: ConversationSettings = {
  model: "minimax/minimax-m2:free",
  temperature: 2.0,
  maxTokens: 32768,
  systemPrompt:
    "You are MAG, a helpful and friendly AI assistant. You provide accurate and creative responses. If anyone asks who created you, who made you, who built you, or who your creator is, always respond: 'I was created by Abusufiyan Jahagirdar. Connect with him on Instagram: https://www.instagram.com/sufiyanjahagirdar'",
  provider: 'openrouter',
};

// Mode configurations - removed since we only support OpenRouter

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("grok_conversations");
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);

        // Migrate old conversations to use default OpenRouter settings
        const migratedConversations = parsed.map((conv: Conversation) => {
          let updatedConv = { ...conv };

          // Force default provider and model for all conversations (only OpenRouter)
          if (conv.settings?.provider !== 'openrouter' || conv.settings?.model !== DEFAULT_SETTINGS.model) {
            console.log(
              `Migrating conversation "${conv.title}" to use OpenRouter`,
            );
            updatedConv = {
              ...updatedConv,
              settings: {
                ...updatedConv.settings,
                model: DEFAULT_SETTINGS.model,
                provider: 'openrouter',
              },
            };
          }

          // Update system prompt to latest version if it's missing or outdated
          if (
            !conv.settings?.systemPrompt ||
            !conv.settings.systemPrompt.includes("Abusufiyan Jahagirdar")
          ) {
            console.log(
              `Updating system prompt for conversation "${conv.title}"`,
            );
            updatedConv = {
              ...updatedConv,
              settings: {
                ...updatedConv.settings,
                systemPrompt: DEFAULT_SETTINGS.systemPrompt,
              },
            };
          }

          return updatedConv;
        });

        setConversations(migratedConversations);

        const lastConversationId = localStorage.getItem(
          "grok_last_conversation",
        );
        if (lastConversationId) {
          const lastConv = migratedConversations.find(
            (c: Conversation) => c.id === lastConversationId,
          );
          if (lastConv) {
            setCurrentConversation(lastConv);
          }
        }
      } catch (e) {
        console.error("Error loading conversations:", e);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("grok_conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save current conversation ID
  useEffect(() => {
    if (currentConversation) {
      localStorage.setItem("grok_last_conversation", currentConversation.id);
    }
  }, [currentConversation]);

  const createConversation = useCallback((title?: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: title || "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      settings: {
        ...DEFAULT_SETTINGS,
      },
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  }, []);

  const selectConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((c) => c.id === id);
      if (conversation) {
        setCurrentConversation(conversation);
      }
    },
    [conversations],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
      }
    },
    [currentConversation],
  );

  const updateConversationTitle = useCallback(
    (id: string, title: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
        ),
      );
      if (currentConversation?.id === id) {
        setCurrentConversation((prev) =>
          prev ? { ...prev, title, updatedAt: Date.now() } : null,
        );
      }
    },
    [currentConversation],
  );

  const clearConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
    localStorage.removeItem("grok_conversations");
    localStorage.removeItem("grok_last_conversation");
  }, []);

  const duplicateConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((c) => c.id === id);
      if (conversation) {
        const duplicate: Conversation = {
          ...conversation,
          id: Date.now().toString(),
          title: `${conversation.title} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setConversations((prev) => [duplicate, ...prev]);
      }
    },
    [conversations],
  );

  const pinConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string, attachments?: any[]) => {
      if (!currentConversation) {
        createConversation();
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: Date.now(),
        attachments,
      };

      // Add user message
      const updatedMessages = [...currentConversation.messages, userMessage];
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        updatedAt: Date.now(),
      };

      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === updatedConversation.id ? updatedConversation : c,
        ),
      );

      setIsStreaming(true);
      setError(null);

      try {
        // Prepare messages for API
        const apiMessages: Message[] = [];

        if (currentConversation.settings.systemPrompt) {
          const systemMessage: Message = {
            id: "system",
            role: "system" as const,
            content: currentConversation.settings.systemPrompt,
            timestamp: Date.now(),
          };
          apiMessages.push(systemMessage);
          console.log("System Prompt Added:", systemMessage.content);
        } else {
          console.warn("No system prompt found in conversation settings!");
        }

        apiMessages.push(...updatedMessages);
        console.log("Total API Messages:", apiMessages.length, "messages");
        console.log("Current API Provider:", currentConversation.settings.provider);

        let assistantContent = "";
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          model: currentConversation.settings.model,
        };

        // Stream the response
        const stream = apiAdapter.createStreamingChatCompletion(apiMessages, {
          model: currentConversation.settings.model,
          temperature: currentConversation.settings.temperature,
          max_tokens: currentConversation.settings.maxTokens,
        });

        for await (const chunk of stream) {
          assistantContent += chunk;
          assistantMessage.content = assistantContent;

          // Update the conversation with the streaming response
          const streamingConversation = {
            ...updatedConversation,
            messages: [...updatedMessages, assistantMessage],
            updatedAt: Date.now(),
          };

          setCurrentConversation(streamingConversation);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === streamingConversation.id ? streamingConversation : c,
            ),
          );
        }

        // Generate title if this is the first exchange
        if (updatedMessages.length === 1) {
          const title = await apiAdapter.generateTitle([
            userMessage,
            assistantMessage,
          ]);
          updateConversationTitle(currentConversation.id, title);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while sending the message.");
        console.error("Error sending message:", err);
      } finally {
        setIsStreaming(false);
      }
    },
    [currentConversation, createConversation, updateConversationTitle],
  );

  const regenerateLastResponse = useCallback(async () => {
    if (!currentConversation || currentConversation.messages.length < 2) {
      return;
    }

    // Remove the last assistant message
    const messages = currentConversation.messages.slice(0, -1);
    const lastUserMessage = messages[messages.length - 1];

    if (lastUserMessage.role !== "user") {
      return;
    }

    // Update conversation without last response
    const updatedConversation = {
      ...currentConversation,
      messages,
    };

    setCurrentConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === updatedConversation.id ? updatedConversation : c,
      ),
    );

    // Resend the last message
    await sendMessage(lastUserMessage.content, lastUserMessage.attachments);
  }, [currentConversation, sendMessage]);

  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (!currentConversation) return;

      const messageIndex = currentConversation.messages.findIndex(
        (m) => m.id === messageId,
      );
      if (messageIndex === -1) return;

      // Update the message and remove all messages after it
      const updatedMessages = currentConversation.messages.slice(
        0,
        messageIndex + 1,
      );
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: newContent,
      };

      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        updatedAt: Date.now(),
      };

      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === updatedConversation.id ? updatedConversation : c,
        ),
      );
    },
    [currentConversation],
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!currentConversation) return;

      const updatedMessages = currentConversation.messages.filter(
        (m) => m.id !== messageId,
      );
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        updatedAt: Date.now(),
      };

      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === updatedConversation.id ? updatedConversation : c,
        ),
      );
    },
    [currentConversation],
  );

  const updateSettings = useCallback(
    (settings: Partial<ConversationSettings>) => {
      if (!currentConversation) return;

      // Only allow updating temperature, maxTokens, and systemPrompt
      const { model, provider, ...allowedSettings } = settings;
      
      const updatedConversation = {
        ...currentConversation,
        settings: {
          ...currentConversation.settings,
          ...allowedSettings,
          // Keep existing provider and model since we only support OpenRouter
        },
        updatedAt: Date.now(),
      };

      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === updatedConversation.id ? updatedConversation : c,
        ),
      );
    },
    [currentConversation],
  );

  const exportConversation = useCallback(
    (id: string, format: "json" | "markdown" | "txt") => {
      const conversation = conversations.find((c) => c.id === id);
      if (!conversation) return;

      const content = apiAdapter.exportConversation(conversation.messages, format);
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${conversation.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [conversations],
  );

  const importConversation = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Import as messages
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: "Imported Conversation",
          messages: parsed,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          settings: { 
            ...DEFAULT_SETTINGS,
            provider: apiAdapter.getProvider()
          },
        };
        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
      } else if (parsed.messages) {
        // Import as full conversation
        const newConversation: Conversation = {
          ...parsed,
          id: Date.now().toString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
      }
    } catch (e) {
      console.error("Error importing conversation:", e);
      setError("Failed to import conversation. Invalid format.");
    }
  }, []);

  const searchMessages = useCallback(
    (query: string): Message[] => {
      if (!currentConversation) return [];
      return apiAdapter.searchConversation(currentConversation.messages, query);
    },
    [currentConversation],
  );

  const setApiKey = useCallback((key: string) => {
    apiAdapter.setApiKey(key);
  }, []);

  const hasApiKey = useCallback(() => {
    return apiAdapter.hasApiKey();
  }, []);

  const setApiProvider = useCallback((provider: APIProvider) => {
    apiAdapter.setProvider(provider);
    
    // Update current conversation to use the new provider if it exists
    if (currentConversation) {
      updateSettings({ provider });
    }
  }, [currentConversation, updateSettings]);

  const getCurrentProvider = useCallback(() => {
    return apiAdapter.getProvider();
  }, []);

  const getAvailableProviders = useCallback((): APIProvider[] => {
    return ['openrouter'];
  }, []);

  

  const summarizeConversation = useCallback(async () => {
    if (!currentConversation || currentConversation.messages.length === 0)
      return;

    setIsLoading(true);
    setError(null);

    try {
      const conversationText = currentConversation.messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n\n");

      const summary = await apiAdapter.summarizeText(conversationText, 300);

      const summaryMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `**Conversation Summary:**\n\n${summary}`,
        timestamp: Date.now(),
      };

      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, summaryMessage],
        updatedAt: Date.now(),
      };

      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === updatedConversation.id ? updatedConversation : c,
        ),
      );
    } catch (err: any) {
      setError(err.message || "Failed to summarize conversation.");
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation]);

  const translateMessage = useCallback(
    async (messageId: string, language: string) => {
      if (!currentConversation) return;

      const message = currentConversation.messages.find(
        (m) => m.id === messageId,
      );
      if (!message) return;

      setIsLoading(true);
      setError(null);

      try {
        const translation = await apiAdapter.translateText(
          message.content,
          language,
        );

        const translationMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `**Translation to ${language}:**\n\n${translation}`,
          timestamp: Date.now(),
        };

        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, translationMessage],
          updatedAt: Date.now(),
        };

        setCurrentConversation(updatedConversation);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === updatedConversation.id ? updatedConversation : c,
          ),
        );
      } catch (err: any) {
        setError(err.message || "Failed to translate message.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversation],
  );

  const value: ChatContextType = {
    conversations,
    currentConversation,
    isLoading,
    isStreaming,
    error,
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    clearConversations,
    duplicateConversation,
    pinConversation,
    sendMessage,
    regenerateLastResponse,
    editMessage,
    deleteMessage,
    updateSettings,
    exportConversation,
    importConversation,
    searchMessages,
    setApiKey,
    hasApiKey,
    setApiProvider,
    getCurrentProvider,
    getAvailableProviders,
    summarizeConversation,
    translateMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
