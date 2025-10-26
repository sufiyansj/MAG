import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated, useTrail } from "@react-spring/web";
import { ChatProvider, useChat } from "./contexts/ChatContext";
import ChatMessage from "./components/ChatMessage";
import "./index.css";

// Sidebar Component
const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    conversations,
    currentConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    exportConversation,
    clearConversations,
  } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const sidebarSpring = useSpring({
    transform: isOpen ? "translateX(0%)" : "translateX(-100%)",
    config: { tension: 280, friction: 60 },
  });

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.pinned);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <animated.div
        style={sidebarSpring}
        className="fixed lg:relative top-0 left-0 h-full w-80 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border-r border-white/10 z-50 flex flex-col lg:translate-x-0"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              MAG AI
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              createConversation();
              onClose();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Chat
          </button>

          {/* Search */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {pinnedConversations.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-400 mb-2">
                PINNED
              </h3>
              {pinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={currentConversation?.id === conv.id}
                  onSelect={() => {
                    selectConversation(conv.id);
                    onClose();
                  }}
                  onDelete={() => deleteConversation(conv.id)}
                  onRename={(title) => updateConversationTitle(conv.id, title)}
                  onExport={(format) => exportConversation(conv.id, format)}
                />
              ))}
            </div>
          )}

          {unpinnedConversations.length > 0 ? (
            unpinnedConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={currentConversation?.id === conv.id}
                onSelect={() => {
                  selectConversation(conv.id);
                  onClose();
                }}
                onDelete={() => deleteConversation(conv.id)}
                onRename={(title) => updateConversationTitle(conv.id, title)}
                onExport={(format) => exportConversation(conv.id, format)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-2">Start a new chat to begin</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
          >
            Clear All Conversations
          </button>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-xl p-6 max-w-sm w-full border border-white/10">
              <h3 className="text-lg font-bold mb-2">
                Clear All Conversations?
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                This action cannot be undone. All your conversations will be
                permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    clearConversations();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </animated.div>
    </>
  );
};

// Conversation Item Component
const ConversationItem: React.FC<{
  conversation: any;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onExport: (format: "json" | "markdown" | "txt") => void;
}> = ({ conversation, isActive, onSelect, onDelete, onRename, onExport }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`relative group p-3 rounded-lg cursor-pointer transition-all ${
        isActive
          ? "bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <div onClick={onSelect}>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === "Enter" && handleRename()}
            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-sm"
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex-1 truncate">
              <h4 className="text-sm font-medium truncate">
                {conversation.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {conversation.messages.length} messages
              </p>
            </div>
            {conversation.pinned && (
              <svg
                className="w-4 h-4 text-primary-400 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-opacity"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute right-0 top-8 w-48 bg-dark-800 border border-white/10 rounded-lg shadow-xl z-10 py-1">
          <button
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
          >
            Rename
          </button>
          <button
            onClick={() => {
              onExport("json");
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
          >
            Export as JSON
          </button>
          <button
            onClick={() => {
              onExport("markdown");
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors"
          >
            Export as Markdown
          </button>
          <button
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// Settings Modal

// Main Chat Interface
const ChatInterface: React.FC = () => {
  const {
    currentConversation,
    sendMessage,
    isStreaming,
    regenerateLastResponse,
    editMessage,
    deleteMessage,
  } = useChat();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const message = input;
    setInput("");
    setIsTyping(true);

    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }

    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {!currentConversation || currentConversation.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl flex items-center justify-center anime-glow float-animation">
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome to MAG AI
                </h1>
                <p className="text-gray-400 text-lg">
                  Your powerful AI assistant. Ask me anything!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  {
                    icon: "💡",
                    title: "Creative Ideas",
                    desc: "Brainstorm and generate innovative solutions",
                  },
                  {
                    icon: "💻",
                    title: "Code Assistant",
                    desc: "Write, debug, and explain code",
                  },
                  {
                    icon: "✍️",
                    title: "Writing Help",
                    desc: "Create content, essays, and articles",
                  },
                  {
                    icon: "🌐",
                    title: "Translations",
                    desc: "Translate text to any language",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-primary-500/50 transition-all hover:transform hover:-translate-y-1"
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Creator Credits */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Created by{" "}
                  <a
                    href="https://www.instagram.com/sufiyanjahagirdar?utm_source=qr&igsh=MWpwdmJ6bHBybHVleg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 transition-colors font-semibold"
                  >
                    Abusufiyan Jahagirdar
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {currentConversation.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onEdit={editMessage}
                onDelete={deleteMessage}
                onRegenerate={regenerateLastResponse}
              />
            ))}
            {isStreaming && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="typing-indicator flex gap-1">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 bg-dark-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message MAG AI..."
              rows={1}
              className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              style={{ minHeight: "56px", maxHeight: "200px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className={`absolute right-2 bottom-2 p-3 rounded-xl transition-all ${
                input.trim() && !isStreaming
                  ? "bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white shadow-lg"
                  : "bg-white/5 text-gray-500 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </p>
            <p className="text-xs text-gray-400">
              Made by{" "}
              <a
                href="https://www.instagram.com/sufiyanjahagirdar?utm_source=qr&igsh=MWpwdmJ6bHBybHVleg=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Abusufiyan Jahagirdar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { createConversation } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Animated background particles
    const canvas = document.getElementById("particles") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(102, 126, 234, 0.5)";

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 text-white overflow-hidden relative">
      {/* Animated Background */}
      <canvas
        id="particles"
        className="absolute inset-0 opacity-20 pointer-events-none"
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-dark-900/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
            MAG AI
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              createConversation();
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            title="Start a new chat"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>New Chat</span>
          </button>
          <button
            onClick={() => {
              createConversation();
            }}
            className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="New chat"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col pt-16">
        <ChatInterface />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default App;
