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

  // Mock AI processing function
  const processFile = async (file: UploadedFile): Promise<ProcessedFile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock detection results
        const mockDetections = [
          {
            id: '1',
            type: 'field' as const,
            confidence: 0.95,
            bbox: [100, 50, 300, 200] as [number, number, number, number],
            label: 'Sân bóng đá'
          },
          {
            id: '2',
            type: 'player' as const,
            confidence: 0.88,
            bbox: [150, 100, 50, 120] as [number, number, number, number],
            label: 'Cầu thủ #1'
          },
          {
            id: '3',
            type: 'player' as const,
            confidence: 0.92,
            bbox: [250, 120, 45, 110] as [number, number, number, number],
            label: 'Cầu thủ #2'
          },
          {
            id: '4',
            type: 'ball' as const,
            confidence: 0.76,
            bbox: [200, 140, 15, 15] as [number, number, number, number],
            label: 'Bóng đá'
          }
        ];

        resolve({
          originalFile: file.file,
          processedUrl: file.preview, // In real app, this would be the processed image/video
          detections: mockDetections,
          processingTime: Math.floor(Math.random() * 2000) + 1000,
          isVideo: file.type === 'video'
        });
      }, 3000); // Simulate processing time
    });
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
    if (currentResult) {
      // In real app, this would download the processed file
      toast({
        title: "Tải xuống",
        description: "Đang chuẩn bị file để tải xuống...",
      });
    }
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
          <div className="lg:col-span-3 space-y-6">
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
                  />
                  
                  {uploadedFiles.length > 0 && (
                    <div className="flex justify-center">
                      <Button
                        onClick={handleStartProcessing}
                        disabled={isProcessing}
                        size="lg"
                        variant="gradient"
                        className="px-8"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Bắt đầu nhận diện AI
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <ResultsPanel
              result={currentResult}
              isProcessing={isProcessing}
              onDownload={handleDownload}
              className="shadow-card"
            />
          </div>

          {/* Right Column - Evaluation Sidebar */}
          <div className="lg:col-span-1">
            <EvaluationSidebar
              onSubmitEvaluation={handleEvaluation}
              className="sticky top-4 shadow-card"
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
