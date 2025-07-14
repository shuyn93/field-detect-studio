import React, { useState } from 'react';
import { MessageSquare, Send, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Textarea } from './textarea';
import { Rating } from './rating';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface EvaluationData {
  qualityRating: number;
  accuracyRating: number;
  speedRating: number;
  comment: string;
}

interface EvaluationSidebarProps {
  onSubmitEvaluation: (evaluation: EvaluationData) => void;
  className?: string;
}

export const EvaluationSidebar: React.FC<EvaluationSidebarProps> = ({
  onSubmitEvaluation,
  className
}) => {
  const [evaluation, setEvaluation] = useState<EvaluationData>({
    qualityRating: 0,
    accuracyRating: 0,
    speedRating: 0,
    comment: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (evaluation.qualityRating > 0) {
      onSubmitEvaluation(evaluation);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 2000);
    }
  };

  const hasMinimumRating = evaluation.qualityRating > 0;
  const averageRating = hasMinimumRating 
    ? ((evaluation.qualityRating + evaluation.accuracyRating + evaluation.speedRating) / 3).toFixed(1)
    : '0.0';

  return (
    <Card className={cn("w-full h-fit", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>Đánh giá chất lượng</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Rating Display */}
        {hasMinimumRating && (
          <div className="text-center p-4 bg-gradient-secondary rounded-lg shadow-card">
            <div className="text-3xl font-bold text-primary mb-1">
              {averageRating}
            </div>
            <div className="text-sm text-muted-foreground">
              Điểm trung bình
            </div>
            <div className="flex justify-center mt-2">
              <Badge 
                variant={parseFloat(averageRating) >= 7 ? 'default' : 'outline'}
                className="text-xs"
              >
                {parseFloat(averageRating) >= 8 ? 'Xuất sắc' :
                 parseFloat(averageRating) >= 7 ? 'Tốt' :
                 parseFloat(averageRating) >= 5 ? 'Khá' : 'Cần cải thiện'}
              </Badge>
            </div>
          </div>
        )}

        {/* Quality Rating */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-primary" />
            <label className="text-sm font-medium text-foreground">
              Chất lượng tổng thể
            </label>
          </div>
          <Rating
            value={evaluation.qualityRating}
            onChange={(rating) => setEvaluation(prev => ({ ...prev, qualityRating: rating }))}
            className="justify-center"
          />
        </div>

        {/* Accuracy Rating */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-secondary rounded-full" />
            <label className="text-sm font-medium text-foreground">
              Độ chính xác nhận diện
            </label>
          </div>
          <Rating
            value={evaluation.accuracyRating}
            onChange={(rating) => setEvaluation(prev => ({ ...prev, accuracyRating: rating }))}
            className="justify-center"
          />
        </div>

        {/* Speed Rating */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent rounded-full" />
            <label className="text-sm font-medium text-foreground">
              Tốc độ xử lý
            </label>
          </div>
          <Rating
            value={evaluation.speedRating}
            onChange={(rating) => setEvaluation(prev => ({ ...prev, speedRating: rating }))}
            className="justify-center"
          />
        </div>

        {/* Comment Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <label className="text-sm font-medium text-foreground">
              Nhận xét chi tiết
            </label>
          </div>
          <Textarea
            placeholder="Chia sẻ nhận xét của bạn về chất lượng nhận diện, độ chính xác, hoặc đề xuất cải thiện..."
            value={evaluation.comment}
            onChange={(e) => setEvaluation(prev => ({ ...prev, comment: e.target.value }))}
            className="min-h-[100px] resize-none"
          />
          <div className="text-xs text-muted-foreground text-right">
            {evaluation.comment.length} ký tự
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!hasMinimumRating || isSubmitted}
          variant={isSubmitted ? "default" : "gradient"}
          className={cn(
            "w-full transition-all duration-300",
            isSubmitted && "bg-green-600 hover:bg-green-600"
          )}
        >
          {isSubmitted ? (
            <>
              <span className="mr-2">✓</span>
              Đã gửi đánh giá
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Gửi đánh giá
            </>
          )}
        </Button>

        {!hasMinimumRating && (
          <p className="text-xs text-muted-foreground text-center">
            Vui lòng đánh giá chất lượng tổng thể để gửi
          </p>
        )}

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            💡 Mẹo đánh giá
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 8-10: Rất chính xác, nhận diện tốt</li>
            <li>• 6-7: Khá tốt, có thể cải thiện</li>
            <li>• 4-5: Trung bình, cần điều chỉnh</li>
            <li>• 1-3: Cần cải thiện nhiều</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};