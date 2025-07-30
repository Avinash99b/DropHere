'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSetFile = (selectedFile: File | null) => {
    setFile(selectedFile);
    onFileSelect(selectedFile);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSetFile(e.target.files[0]);
    }
  };
  
  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const removeFile = () => {
    handleSetFile(null);
  };

  if (file) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
            <FileIcon className="w-6 h-6 text-primary flex-shrink-0" />
            <span className="font-medium truncate" title={file.name}>{file.name}</span>
        </div>
        <button
          onClick={removeFile}
          className="p-1 rounded-full hover:bg-destructive/20 text-destructive flex-shrink-0"
          aria-label="Remove file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={cn(
        'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200',
        isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      )}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer">
        <UploadCloud className="w-12 h-12 text-muted-foreground" />
        <span className="font-semibold text-foreground">Drag & drop a file here</span>
        <span className="text-sm text-muted-foreground">or click to browse</span>
      </label>
    </div>
  );
}
