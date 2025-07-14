import React from 'react';
import { Download, Eye, Play, Pause } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface DetectionResult {
  id: string;
  type: 'field' | 'player' | 'ball';
  confidence: number;
  bbox: [number, number, number, number]; // x, y, width, height
  label: string;
}

export interface ProcessedFile {
  originalFile: File;
  processedUrl: string;
  detections: DetectionResult[];
  processingTime: number;
  isVideo: boolean;
}

interface ResultsPanelProps {
  result: ProcessedFile | null;
  isProcessing: boolean;
  onDownload: () => void;
  className?: string;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  isProcessing,
  onDownload,
  className
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isProcessing) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-glow-pulse w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-primary-foreground animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Đang xử lý bằng AI...
              </h3>
              <p className="text-sm text-muted-foreground">
                Hệ thống đang nhận diện sân bóng, cầu thủ và bóng
              </p>
            </div>
            <div className="w-full max-w-xs bg-muted rounded-full h-2">
              <div className="bg-gradient-primary h-2 rounded-full animate-pulse w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Chưa có kết quả
              </h3>
              <p className="text-sm text-muted-foreground">
                Tải lên file để bắt đầu nhận diện
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fieldDetections = result.detections.filter(d => d.type === 'field');
  const playerDetections = result.detections.filter(d => d.type === 'player');
  const ballDetections = result.detections.filter(d => d.type === 'ball');

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Kết quả nhận diện</CardTitle>
          <Button
            onClick={onDownload}
            variant="gradient"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Tải xuống
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Media Display */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-card">
          {result.isVideo ? (
            <div className="relative">
              <video
                ref={videoRef}
                src={result.processedUrl}
                className="w-full h-auto max-h-96 object-contain"
                controls={false}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-black/50 hover:bg-black/70 text-white"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <img
              src={result.processedUrl}
              alt="Processed result"
              className="w-full h-auto max-h-96 object-contain"
            />
          )}
        </div>

        {/* Detection Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              {fieldDetections.length}
            </div>
            <Badge variant="secondary" className="text-xs">
              Sân bóng
            </Badge>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-secondary">
              {playerDetections.length}
            </div>
            <Badge variant="outline" className="text-xs">
              Cầu thủ
            </Badge>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-accent">
              {ballDetections.length}
            </div>
            <Badge variant="default" className="text-xs">
              Bóng
            </Badge>
          </div>
        </div>

        {/* Detection Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Chi tiết nhận diện</h4>
          
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {result.detections.map((detection, index) => (
              <div
                key={detection.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      detection.type === 'field' ? 'secondary' :
                      detection.type === 'player' ? 'outline' : 'default'
                    }
                    className="capitalize"
                  >
                    {detection.type === 'field' ? 'Sân' :
                     detection.type === 'player' ? 'Cầu thủ' : 'Bóng'}
                  </Badge>
                  <span className="text-sm text-foreground">
                    {detection.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {(detection.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Độ tin cậy
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Info */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Thời gian xử lý: {result.processingTime}ms</span>
            <span>File: {result.originalFile.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};