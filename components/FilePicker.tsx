import React, { useRef, useState } from "react";
import { FileAttachment } from "../types";

interface FilePickerProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

const FilePicker: React.FC<FilePickerProps> = ({
  onFilesSelected,
  acceptedTypes = ["image/*", "application/pdf", "text/*", ".doc", ".docx"],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  disabled = false,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let validationError: string | null = null;

    // Check file count
    if (fileArray.length > maxFiles) {
      validationError = `You can only upload a maximum of ${maxFiles} files at once.`;
    }

    // Check individual files
    for (const file of fileArray) {
      // Check file size
      if (file.size > maxFileSize) {
        validationError = `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`;
        break;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes("*")) {
          const category = type.split("/")[0];
          return file.type.startsWith(category + "/");
        }
        return file.type === type;
      });

      if (!isValidType) {
        validationError = `File "${file.name}" is not a supported file type.`;
        break;
      }

      validFiles.push(file);
    }

    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return [];
    }

    setError(null);
    return validFiles;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (children) {
    return (
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragOver
            ? "border-primary-500 bg-primary-500/10"
            : "border-white/20 hover:border-primary-500/50 hover:bg-white/5"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-white font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Supports: {acceptedTypes.join(", ")} • Max {formatFileSize(maxFileSize)} per file • Up to {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FilePicker;