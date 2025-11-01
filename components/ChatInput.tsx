import React, { useState, useRef, useEffect } from "react";
import { useFileAttachments } from "../hooks/useFileAttachments";
import FilePicker from "./FilePicker";
import FileAttachment from "./FileAttachment";
import AttachmentIcon from "./icons/AttachmentIcon";

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: any[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Message MAG AI...",
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
}) => {
  const [input, setInput] = useState("");
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const filePickerRef = useRef<HTMLDivElement>(null);

  const {
    attachments,
    isUploading,
    addFiles,
    removeAttachment,
    clearAttachments,
    totalSize,
  } = useFileAttachments({
    maxFiles,
    maxFileSize,
  });

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Close file picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filePickerRef.current &&
        !filePickerRef.current.contains(event.target as Node)
      ) {
        setShowFilePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || disabled || isUploading) {
      return;
    }

    try {
      onSendMessage(input, attachments);
      setInput("");
      clearAttachments();
      setError(null);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }

    // Focus back to textarea
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    try {
      await addFiles(files);
      setShowFilePicker(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add files. Please try again."
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const hasContent = input.trim().length > 0 || attachments.length > 0;

  return (
    <div className="border-t border-white/10 bg-dark-900/50 backdrop-blur-sm">
      {/* Error Message */}
      {error && (
        <div className="px-3 sm:px-4 pt-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-400">
              Attachments ({attachments.length})
            </span>
            <span className="text-xs text-gray-500">
              {formatFileSize(totalSize)}
            </span>
          </div>
          <div className="space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
            {attachments.map((attachment) => (
              <FileAttachment
                key={attachment.id}
                attachment={attachment}
                onRemove={removeAttachment}
                showRemoveButton={true}
                isUploading={isUploading}
              />
            ))}
          </div>
        </div>
      )}

      {/* File Picker Modal */}
      {showFilePicker && (
        <div className="absolute bottom-full left-0 right-0 mb-2 mx-4">
          <div
            ref={filePickerRef}
            className="bg-dark-800 border border-white/10 rounded-xl p-4 shadow-xl"
          >
            <FilePicker
              onFilesSelected={handleFilesSelected}
              maxFiles={maxFiles - attachments.length}
              maxFileSize={maxFileSize}
              disabled={isUploading}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-end gap-2">
              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  rows={1}
                  disabled={disabled || isUploading}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 pr-16 sm:pr-20 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none disabled:opacity-50 text-sm sm:text-base"
                  style={{ minHeight: "44px", maxHeight: "200px" }}
                />

                {/* Attachment Button */}
                <div className="absolute right-12 sm:right-16 bottom-2">
                  <div className="relative" ref={filePickerRef}>
                    <button
                      type="button"
                      onClick={() => setShowFilePicker(!showFilePicker)}
                      disabled={disabled || isUploading || attachments.length >= maxFiles}
                      className={`p-2 sm:p-3 rounded-xl transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                        showFilePicker
                          ? "bg-primary-500 text-white"
                          : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Attach files"
                    >
                      <AttachmentIcon size={16} />
                    </button>

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="absolute -top-1 -right-1 w-4 h-4">
                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    {/* Attachment Count Badge */}
                    {attachments.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {attachments.length}
                      </div>
                    )}
                  </div>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!hasContent || disabled || isUploading}
                  className={`absolute right-2 bottom-2 p-2 sm:p-3 rounded-xl transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                    hasContent && !disabled && !isUploading
                      ? "bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white shadow-lg"
                      : "bg-white/5 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Helper Text */}
            <div className="text-center space-y-1 mt-2 sm:mt-3">
              <p className="text-xs text-gray-500 hidden sm:block">
                Press Enter to send, Shift+Enter for new line
              </p>
              <p className="text-xs text-gray-400">
                Attach up to {maxFiles} files • Max {formatFileSize(maxFileSize)} per file
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;