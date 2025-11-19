import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Event } from '../../types';
import { Card, Badge, Button } from '../common';
import { useAuth } from '../../hooks/useAuth';
import { useBookmarks } from '../../hooks/useBookmarks';
import { formatDateRange, getCategoryColor, getEventStatus, getEventStatusLabel } from '../../utils/helpers';
import { cn } from '../../utils/cn';

interface EventCardProps {
  event: Event;
  className?: string;
}

export const EventCard = ({ event, className }: EventCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isBookmarked, addBookmark, removeBookmark, isLoading } = useBookmarks();
  
  const eventStatus = getEventStatus(event.startDate, event.endDate);
  const isEventBookmarked = user ? isBookmarked(event.id) : false;
  
  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };
  
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      // 로그인 모달 열기 (추후 구현)
      console.log('Login required');
      return;
    }
    
    try {
      if (isEventBookmarked) {
        await removeBookmark(event.id);
      } else {
        await addBookmark(event);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/default-event.jpg';
  };
  
  return (
    <Card
      className={cn('cursor-pointer group', className)}
      hover
      padding="none"
      onClick={handleCardClick}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.image || '/images/default-event.jpg'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* 카테고리 뱃지 */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="primary"
            size="sm"
            className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-800"
          >
            {t(`category.${event.category}`, event.category)}
          </Badge>
        </div>
        
        {/* 상태 뱃지 */}
        <div className="absolute top-3 right-3">
          <Badge
            size="sm"
            className={cn(
              'bg-white bg-opacity-90 backdrop-blur-sm',
              eventStatus === 'ongoing' && 'text-green-800',
              eventStatus === 'upcoming' && 'text-blue-800',
              eventStatus === 'ended' && 'text-gray-600'
            )}
          >
            {getEventStatusLabel(eventStatus, t.language)}
          </Badge>
        </div>
        
        {/* 북마크 버튼 */}
        <div className="absolute bottom-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmarkClick}
            disabled={isLoading}
            className={cn(
              'p-2 rounded-full bg-white bg-opacity-90 backdrop-blur-sm hover:bg-opacity-100',
              isEventBookmarked && 'text-primary-600',
              !isEventBookmarked && 'text-gray-600'
            )}
          >
            <svg
              className="w-5 h-5"
              fill={isEventBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* 내용 영역 */}
      <div className="p-4">
        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        
        {/* 날짜 */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDateRange(event.startDate, event.endDate, t.language)}
        </div>
        
        {/* 장소 */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{event.place}</span>
        </div>
        
        {/* 하단 정보 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* 가격 */}
          <span className="text-sm font-medium text-primary-600">
            {event.price || t('event.freeAdmission', '무료')}
          </span>
          
          {/* 통계 정보 (추후 구현) */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              0
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              0
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};