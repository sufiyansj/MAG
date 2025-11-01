import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onRegenerate?: () => void;
  onCopy?: (content: string) => void;
  onTranslate?: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onEdit,
  onDelete,
  onRegenerate,
  onCopy,
  onTranslate,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // Entrance animation with react-spring
  const springProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px) scale(0.95)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { tension: 280, friction: 60 },
  });

  // Hover animation
  const hoverSpring = useSpring({
    transform: isHovered ? "scale(1.01)" : "scale(1)",
    boxShadow: isHovered
      ? "0 20px 40px rgba(0, 0, 0, 0.2)"
      : "0 4px 6px rgba(0, 0, 0, 0.1)",
    config: { tension: 300, friction: 20 },
  });

  // Avatar animation with CSS
  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.style.animation =
        "avatarEntrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    onCopy?.(message.content);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <animated.div
      style={springProps}
      className={`flex gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } group relative`}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setTimeout(() => setShowActions(false), 300);
      }}
    >
      {/* Avatar with CSS animation */}
      <div
        ref={avatarRef}
        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white animate-fade-in ${
          isUser
            ? "bg-gradient-to-br from-primary-500 to-purple-600 anime-glow"
            : "bg-gradient-to-br from-anime-cyan to-anime-blue anime-glow-pink"
        }`}
        style={{ animationDuration: "0.8s" }}
      >
        {isUser ? (
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <animated.div
        style={hoverSpring}
        className={`flex-1 max-w-[calc(100vw-120px)] sm:max-w-3xl ${
          isUser ? "chat-bubble-user" : "chat-bubble-ai"
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-semibold text-xs sm:text-sm">
              {isUser ? "You" : "MAG AI"}
            </span>
          </div>
          <span className="text-xs opacity-60 hidden sm:block">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message Body */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={messageRef}
            className="markdown-content prose prose-invert max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }: any) {
                  const inline = !className;
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="relative group/code my-4">
                      <div className="absolute top-2 right-2 flex gap-2">
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {match[1]}
                        </span>
                        <button
                          onClick={handleCopy}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg opacity-0 group-hover/code:opacity-100 transition-opacity"
                        >
                          {isCopied ? (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code
                      className="bg-primary-500/20 px-1.5 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Attachments if any */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  {/* File Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400">
                    {attachment.type.startsWith("image/") ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : attachment.type === "application/pdf" ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {attachment.type} • {(attachment.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  {/* Download/Preview Button */}
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Open file"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
                
                {/* Image Preview */}
                {attachment.type.startsWith("image/") && (
                  <div className="mt-3">
                    <img
                      src={attachment.previewUrl || attachment.url}
                      alt={attachment.name}
                      className="rounded-lg max-h-32 sm:max-h-48 lg:max-h-64 object-cover w-full"
                      style={{ maxWidth: '100%', height: 'auto' }}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </animated.div>

      {/* Action Buttons */}
      {showActions && !isEditing && (
        <div
          className={`absolute ${
            isUser ? "right-2 sm:right-6" : "left-2 sm:left-6"
          } bottom-2 flex gap-1 bg-dark-800/90 backdrop-blur-sm rounded-lg p-1 shadow-xl animate-fade-in`}
        >
          <button
            onClick={handleCopy}
            className="copy-icon p-2 hover:bg-white/10 rounded-md transition-colors group/btn min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Copy"
          >
            {isCopied ? (
              <svg
                className="w-4 h-4 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>

          {isUser && onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-white/10 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}

          {isAssistant && onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-2 hover:bg-white/10 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Regenerate"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {onTranslate && (
            <button
              onClick={() => onTranslate(message.id)}
              className="p-2 hover:bg-white/10 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Translate"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </animated.div>
  );
};

export default ChatMessage;
