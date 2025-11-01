import React, { useState, useCallback } from "react";
import { FileAttachment } from "../types";

interface UseFileAttachmentsOptions {
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

interface UseFileAttachmentsReturn {
  attachments: FileAttachment[];
  isUploading: boolean;
  addFiles: (files: File[]) => Promise<void>;
  removeAttachment: (attachmentId: string) => void;
  clearAttachments: () => void;
  updateAttachment: (attachmentId: string, updates: Partial<FileAttachment>) => void;
  totalSize: number;
}

export const useFileAttachments = (
  options: UseFileAttachmentsOptions = {}
): UseFileAttachmentsReturn => {
  const {
    maxFiles = 5,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    acceptedTypes = ["image/*", "application/pdf", "text/*", ".doc", ".docx"],
  } = options;

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Generate preview URL for images
  const generatePreviewUrl = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  }, []);

  // Convert File to FileAttachment
  const fileToAttachment = useCallback(
    async (file: File): Promise<FileAttachment> => {
      const previewUrl = await generatePreviewUrl(file);
      
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        previewUrl,
      };
    },
    [generatePreviewUrl]
  );

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`;
    }

    // Check file type
    const isValidType = acceptedTypes.some((type) => {
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
      return `File "${file.name}" is not a supported file type.`;
    }

    return null;
  }, [maxFileSize, acceptedTypes]);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Add files
  const addFiles = useCallback(async (files: File[]) => {
    setIsUploading(true);

    try {
      // Check if adding these files would exceed the max limit
      if (attachments.length + files.length > maxFiles) {
        throw new Error(`You can only have a maximum of ${maxFiles} files.`);
      }

      // Validate all files first
      const validationErrors: string[] = [];
      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(error);
        }
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
      }

      // Convert files to attachments
      const newAttachments = await Promise.all(files.map(fileToAttachment));

      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [attachments.length, maxFiles, validateFile, fileToAttachment]);

  // Remove attachment
  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((att) => att.id === attachmentId);
      if (attachment) {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(attachment.url);
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      }
      return prev.filter((att) => att.id !== attachmentId);
    });
  }, []);

  // Clear all attachments
  const clearAttachments = useCallback(() => {
    // Revoke all object URLs to prevent memory leaks
    attachments.forEach((attachment) => {
      URL.revokeObjectURL(attachment.url);
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    });
    setAttachments([]);
  }, [attachments]);

  // Update attachment
  const updateAttachment = useCallback(
    (attachmentId: string, updates: Partial<FileAttachment>) => {
      setAttachments((prev) =>
        prev.map((att) =>
          att.id === attachmentId ? { ...att, ...updates } : att
        )
      );
    },
    []
  );

  // Calculate total size
  const totalSize = attachments.reduce((sum, attachment) => sum + attachment.size, 0);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Revoke all object URLs to prevent memory leaks
      attachments.forEach((attachment) => {
        URL.revokeObjectURL(attachment.url);
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      });
    };
  }, [attachments]);

  return {
    attachments,
    isUploading,
    addFiles,
    removeAttachment,
    clearAttachments,
    updateAttachment,
    totalSize,
  };
};

export default useFileAttachments;