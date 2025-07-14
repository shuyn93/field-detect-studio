import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Play, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface FileUploadProps {
  onFileUpload: (files: UploadedFile[]) => void;
  maxFiles?: number;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  maxFiles = 5,
  className
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => {
      const isVideo = file.type.startsWith('video/');
      return {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image'
      };
    });

    const updatedFiles = [...uploadedFiles, ...newFiles].slice(0, maxFiles);
    setUploadedFiles(updatedFiles);
    onFileUpload(updatedFiles);
  }, [uploadedFiles, maxFiles, onFileUpload]);

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onFileUpload(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
    },
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles
  });

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
          "hover:border-primary hover:bg-primary/5 cursor-pointer",
          "bg-gradient-secondary shadow-card",
          isDragActive && "border-primary bg-primary/10 animate-upload-bounce",
          uploadedFiles.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-primary rounded-full shadow-glow">
            <Upload className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isDragActive 
                ? "Thả file vào đây..." 
                : uploadedFiles.length >= maxFiles
                  ? `Đã đạt giới hạn ${maxFiles} file`
                  : "Tải lên ảnh hoặc video"
              }
            </h3>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ định dạng: JPEG, PNG, GIF, MP4, AVI, MOV
            </p>
            <p className="text-xs text-muted-foreground">
              Tối đa {maxFiles} file | Kéo thả hoặc click để chọn
            </p>
          </div>
        </div>
      </div>

      {/* File Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            File đã tải lên ({uploadedFiles.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                key={index}
                className="relative bg-card rounded-lg p-3 shadow-card animate-fade-in"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {uploadedFile.type === 'video' ? (
                      <div className="relative">
                        <video
                          src={uploadedFile.preview}
                          className="h-12 w-12 object-cover rounded"
                          muted
                        />
                        <Play className="absolute inset-0 m-auto h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <img
                        src={uploadedFile.preview}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {uploadedFile.type === 'video' ? (
                        <Play className="h-3 w-3" />
                      ) : (
                        <ImageIcon className="h-3 w-3" />
                      )}
                      <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(1)}MB</span>
                      <span className="capitalize">{uploadedFile.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};