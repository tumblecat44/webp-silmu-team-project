import { useTranslation } from 'react-i18next';
import { Event } from '../../types';
import { Card, Badge, Button } from '../common';
import { useAuth } from '../../hooks/useAuth';
import { useBookmarks } from '../../hooks/useBookmarks';
import { formatDateRange, getEventStatus, getEventStatusLabel } from '../../utils/helpers';
import { copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface EventDetailInfoProps {
  event: Event;
  className?: string;
}

export const EventDetailInfo = ({ event, className }: EventDetailInfoProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isBookmarked, addBookmark, removeBookmark, isLoading } = useBookmarks();
  
  const eventStatus = getEventStatus(event.startDate, event.endDate);
  const isEventBookmarked = user ? isBookmarked(event.id) : false;
  
  const handleBookmarkClick = async () => {
    if (!user) {
      toast.error(t('message.loginRequired', '로그인이 필요한 서비스입니다'));
      return;
    }
    
    try {
      if (isEventBookmarked) {
        await removeBookmark(event.id);
        toast.success(t('message.bookmarkRemoved', '북마크가 삭제되었습니다'));
      } else {
        await addBookmark(event);
        toast.success(t('message.bookmarkAdded', '북마크에 추가되었습니다'));
      }
    } catch {
      toast.error(t('message.error', '오류가 발생했습니다'));
    }
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);
    
    if (success) {
      toast.success(t('message.shareSuccess', 'URL이 클립보드에 복사되었습니다'));
    } else {
      toast.error(t('message.shareError', '링크 복사에 실패했습니다'));
    }
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/default-event.jpg';
  };
  
  return (
    <Card className={cn('overflow-hidden', className)} padding="none">
      <div className="relative aspect-[16/9] lg:aspect-[2/1] overflow-hidden">
        <img
          src={event.image || '/images/default-event.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            size="md"
            className={cn(
              'bg-white bg-opacity-90 backdrop-blur-sm',
              eventStatus === 'ongoing' && 'text-green-800',
              eventStatus === 'upcoming' && 'text-blue-800',
              eventStatus === 'ended' && 'text-gray-600'
            )}
          >
            {getEventStatusLabel(eventStatus, t.language)}
          </Badge>
          
          <Badge
            variant="primary"
            size="md"
            className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-800"
          >
            {t(`category.${event.category}`, event.category)}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">
                  {t('event.date', '행사 날짜')}
                </dt>
                <dd className="text-gray-900">
                  {formatDateRange(event.startDate, event.endDate, t.language)}
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">
                  {t('event.price', '가격')}
                </dt>
                <dd className="text-primary-600 font-medium">
                  {event.price || t('event.freeAdmission', '무료')}
                </dd>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">
                  {t('event.location', '장소')}
                </dt>
                <dd className="text-gray-900">
                  {event.place}
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        {event.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('event.description', '상세 정보')}
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={isEventBookmarked ? 'outline' : 'primary'}
            onClick={handleBookmarkClick}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
            icon={
              <svg className="w-5 h-5" fill={isEventBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            }
          >
            {isEventBookmarked ? t('button.removeBookmark', '북마크 해제') : t('button.addBookmark', '북마크')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1 sm:flex-none"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            }
          >
            {t('button.share', '공유')}
          </Button>
        </div>
      </div>
    </Card>
  );
};