import { useTranslation } from 'react-i18next';
import { Review } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface ReviewCardProps {
  review: Review;
  className?: string;
  showEventTitle?: boolean;
}

export const ReviewCard = ({
  review,
  className,
  showEventTitle = false
}: ReviewCardProps) => {
  const { t } = useTranslation();
  
  const formatDate = (timestamp: unknown) => {
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString(t.language === 'ko' ? 'ko-KR' : 'en-US');
    } catch {
      return '';
    }
  };

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-6 space-y-4', className)}>
      {/* 헤더: 사용자 정보 */}
      <div className="flex items-start space-x-3">
        {/* 프로필 이미지 */}
        {review.userPhoto ? (
          <img
            src={review.userPhoto}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {review.userName?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        
        {/* 사용자 정보 */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{review.userName}</span>
            <div className="flex items-center">
              {'⭐'.repeat(review.rating)}
              <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(review.createdAt)}
            {review.updatedAt && review.updatedAt !== review.createdAt && (
              <span> • {t('review.edited', '수정됨')}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* 행사 제목 (필요한 경우) */}
      {showEventTitle && (
        <div className="text-sm text-gray-600 border-l-2 border-blue-200 pl-3">
          <span className="font-medium">{t('review.eventTitle', '행사:')} </span>
          {review.eventTitle}
        </div>
      )}
      
      {/* 후기 내용 */}
      <div className="text-gray-700 leading-relaxed">
        {review.content}
      </div>
      
      {/* 이미지들 */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => window.open(image, '_blank')}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};