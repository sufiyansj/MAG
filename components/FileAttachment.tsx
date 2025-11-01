import React from "react";
import { FileAttachment as FileAttachmentType } from "../types";

interface FileAttachmentProps {
  attachment: FileAttachmentType;
  onRemove?: (attachmentId: string) => void;
  showRemoveButton?: boolean;
  isUploading?: boolean;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  attachment,
  onRemove,
  showRemoveButton = false,
  isUploading = false,
}) => {
  const isImage = attachment.type.startsWith("image/");
  const isVideo = attachment.type.startsWith("video/");
  const isAudio = attachment.type.startsWith("audio/");
  const isPdf = attachment.type === "application/pdf";

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderIcon = () => {
    if (isImage) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (isPdf) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {isImage ? (
            <img
              src={attachment.previewUrl || attachment.url}
              alt={attachment.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400">
              {renderIcon()}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {attachment.name}
          </p>
          <p className="text-xs text-gray-400">
            {formatFileSize(attachment.size)}
          </p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Remove Button */}
        {showRemoveButton && onRemove && (
          <button
            onClick={() => onRemove(attachment.id)}
            className="flex-shrink-0 p-1 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Remove attachment"
          >
            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Image Preview Modal */}
      {isImage && (
        <div className="hidden group-hover:block absolute z-10 left-0 top-full mt-2">
          <img
            src={attachment.previewUrl || attachment.url}
            alt={attachment.name}
            className="max-w-xs max-h-64 rounded-lg shadow-xl border border-white/20"
          />
        </div>
      )}
    </div>
  );
};

export default FileAttachment;