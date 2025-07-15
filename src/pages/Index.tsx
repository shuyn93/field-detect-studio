import React, { useState } from 'react';
import { Brain, Zap, Target } from 'lucide-react';
import { FileUpload, UploadedFile } from '@/components/ui/file-upload';
import { ResultsPanel, ProcessedFile } from '@/components/ui/results-panel';
import { EvaluationSidebar } from '@/components/ui/evaluation-sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentResult, setCurrentResult] = useState<ProcessedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: UploadedFile): Promise<ProcessedFile> => {
  const formData = new FormData();
  formData.append("file", file.file);

  const response = await fetch("http://localhost:8000/process", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Processing failed");
  }

  const data = await response.json();
  const processedUrl = `http://localhost:8000${data.output_url}`;
  const downloadUrl = `http://localhost:8000${data.download_url}`;  // ✅ Thêm dòng này

  return {
    originalFile: file.file,
    processedUrl,
    downloadUrl, // ✅ Gán vào đây
    detections: [], // Nếu chưa hỗ trợ bbox
    processingTime: data.processing_time || 0,
    isVideo: file.type === "video",
    counts: data.counts || {},
    confidenceAvg: data.confidence_avg ?? null,
  };
};



  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setCurrentResult(null);
  };

  const handleStartProcessing = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải lên ít nhất một file để xử lý",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Process the first file (in real app, you might process all files)
      const result = await processFile(uploadedFiles[0]);
      setCurrentResult(result);
      
      toast({
        title: "Thành công!",
        description: `Đã nhận diện được ${result.detections.length} đối tượng`,
      });
    } catch (error) {
      toast({
        title: "Lỗi xử lý",
        description: "Không thể xử lý file. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
  if (!currentResult) return;

  const downloadUrl = currentResult.downloadUrl || currentResult.processedUrl;

  const link = document.createElement('a');
  link.href = downloadUrl;

  const baseName = currentResult.originalFile.name.replace(/\.[^/.]+$/, '');
  const extension = currentResult.isVideo ? '.mp4' : '.jpg';
  link.download = `${baseName}_processed${extension}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  const handleEvaluation = (evaluation: any) => {
    console.log('Evaluation submitted:', evaluation);
    toast({
      title: "Cảm ơn đánh giá!",
      description: "Phản hồi của bạn giúp chúng tôi cải thiện hệ thống",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Sports Vision</h1>
                <p className="text-sm text-muted-foreground">Nhận diện thông minh sân bóng, cầu thủ và bóng</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="hidden sm:flex">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
              <Badge variant="secondary" className="hidden sm:flex">
                <Target className="h-3 w-3 mr-1" />
                High Accuracy
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Upload & Results */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upload Section */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      Tải lên và nhận diện
                    </h2>
                    <p className="text-muted-foreground">
                      Tải lên ảnh hoặc video để AI nhận diện sân bóng, cầu thủ và bóng
                    </p>
                  </div>
                  
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    maxFiles={3}
                    result={currentResult}
                    isProcessing={isProcessing}
                    onDownload={handleDownload}
                    onStartProcessing={handleStartProcessing}
                  />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Evaluation Sidebar - moved to bottom on mobile */}
          <div className="lg:col-span-4">
            <EvaluationSidebar
              onSubmitEvaluation={handleEvaluation}
              className="shadow-field"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>AI Sports Vision - Công nghệ nhận diện thông minh cho thể thao</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
