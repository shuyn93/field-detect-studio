import React from 'react';
import { Download, Eye, Play, Pause } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { MetricsPanel } from './metrics-panel';
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

  // Calculate metrics
  const avgConfidence = result.detections.reduce((sum, d) => sum + d.confidence, 0) / result.detections.length;
  const mockMap50Pose = 0.85 + (Math.random() * 0.10); // Mock data
  const mockMap50Box = 0.82 + (Math.random() * 0.12); // Mock data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Results Panel */}
      <div className="lg:col-span-2">
        <Card className={cn("w-full", className)}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/football-artistic.png" 
                  alt="Football" 
                  className="w-8 h-8 object-contain filter drop-shadow-md"
                />
                <CardTitle className="text-xl">Kết quả nhận diện</CardTitle>
              </div>
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
            <div className="relative bg-gradient-secondary rounded-lg overflow-hidden shadow-field">
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
                      className="bg-primary/20 hover:bg-primary/40 text-white border border-primary/50"
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
              <div className="text-center space-y-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">
                  {fieldDetections.length}
                </div>
                <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                  Sân bóng
                </Badge>
              </div>
              <div className="text-center space-y-2 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="text-2xl font-bold text-secondary">
                  {playerDetections.length}
                </div>
                <Badge variant="outline" className="text-xs border-secondary text-secondary">
                  Cầu thủ
                </Badge>
              </div>
              <div className="text-center space-y-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent">
                  {ballDetections.length}
                </div>
                <Badge variant="default" className="text-xs bg-accent text-accent-foreground">
                  Bóng
                </Badge>
              </div>
            </div>

            {/* Detection Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <img 
                  src="/football-artistic.png" 
                  alt="Football" 
                  className="w-5 h-5 object-contain filter drop-shadow-sm"
                />
                Chi tiết nhận diện
              </h4>
              
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {result.detections.map((detection, index) => (
                  <div
                    key={detection.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={
                          detection.type === 'field' ? 'secondary' :
                          detection.type === 'player' ? 'outline' : 'default'
                        }
                        className={cn(
                          "capitalize",
                          detection.type === 'field' && "bg-primary text-primary-foreground",
                          detection.type === 'player' && "border-secondary text-secondary",
                          detection.type === 'ball' && "bg-accent text-accent-foreground"
                        )}
                      >
                        {detection.type === 'field' ? 'Sân' :
                         detection.type === 'player' ? 'Cầu thủ' : 'Bóng'}
                      </Badge>
                      <span className="text-sm text-foreground">
                        {detection.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
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
            <div className="pt-4 border-t border-primary/20">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Thời gian xử lý: <span className="text-primary font-medium">{result.processingTime}ms</span></span>
                <span>File: <span className="text-primary font-medium">{result.originalFile.name}</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Panel */}
      <div className="lg:col-span-1">
        <MetricsPanel
          processingSpeed={result.processingTime}
          map50Pose={mockMap50Pose}
          map50Box={mockMap50Box}
          avgConfidence={avgConfidence}
          className="sticky top-4"
        />
      </div>
    </div>
  );
};