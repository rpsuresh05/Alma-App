"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  leadId?: string;
  onUploadSuccess?: (url: string) => void;
}

export function FileUpload({
  onChange,
  value,
  leadId,
  onUploadSuccess,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    // Validate file type
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or Word document");
        return;
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
    }

    setFile(selectedFile);
    onChange(selectedFile);
    setError(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !leadId) {
      setError("File and lead ID are required");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("leadId", leadId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload file");
      }

      const data = await response.json();
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }
      setFile(null);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {!file ? (
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
        </div>
      ) : (
        <div className="flex items-center justify-between border rounded-md p-3">
          <div className="flex items-center space-x-2">
            <FileIcon className="h-5 w-5 text-primary" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="h-8 w-8 p-0"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}

      {error && <div className="text-sm text-red-500">{error}</div>}

      {file && leadId && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full mt-2"
        >
          {isUploading ? "Uploading..." : "Upload Resume"}
        </Button>
      )}

      <input
        type="file"
        id="resume"
        name="resume"
        ref={inputRef}
        onChange={handleFileChange}
        required
        className="hidden"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
    </div>
  );
}
