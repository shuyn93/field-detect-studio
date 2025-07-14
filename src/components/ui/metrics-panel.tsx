import React from 'react';
import { Activity, Target, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface MetricsPanelProps {
  processingSpeed?: number; // ms
  map50Pose?: number; // 0-1
  map50Box?: number; // 0-1
  avgConfidence?: number; // 0-1
  className?: string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  processingSpeed = 0,
  map50Pose = 0,
  map50Box = 0,
  avgConfidence = 0,
  className
}) => {
  const metrics = [
    {
      title: 'Tốc độ xử lý',
      value: `${processingSpeed}ms`,
      description: 'Thời gian AI xử lý',
      icon: Zap,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'mAP50 Pose',
      value: `${(map50Pose * 100).toFixed(1)}%`,
      description: 'Độ chính xác nhận diện tư thế',
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'mAP50 Box',
      value: `${(map50Box * 100).toFixed(1)}%`,
      description: 'Độ chính xác khung nhận diện',
      icon: Target,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Độ tin cậy TB',
      value: `${(avgConfidence * 100).toFixed(1)}%`,
      description: 'Độ tin cậy trung bình',
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          Chỉ số hiệu suất
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors duration-200"
          >
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", metric.bgColor)}>
              <metric.icon className={cn("h-5 w-5", metric.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {metric.title}
                </p>
                <Badge variant="outline" className="ml-2 text-xs font-bold">
                  {metric.value}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </div>
          </div>
        ))}

        {/* Performance Indicator */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Hiệu suất tổng thể</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-accent font-medium">Tối ưu</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};