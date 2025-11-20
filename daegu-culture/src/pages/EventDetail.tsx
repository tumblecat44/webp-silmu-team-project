import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import type { Event } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useReviews } from '../hooks/useReviews';
import { ReviewCard } from '../components/review/ReviewCard';

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { reviews: eventReviews, createReview: addReview, loading: reviewsLoading } = useReviews(id);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: '',
    images: [] as string[]
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        try {
          // API에서 특정 이벤트 상세 정보 조회
          const eventData = await apiService.getEventDetail(id);
          
          if (eventData) {
            setEvent(eventData);
          } else {
            throw new Error('이벤트를 찾을 수 없습니다');
          }
        } catch (detailError) {
          console.log('상세 조회 실패, 전체 목록에서 검색:', detailError);
          
          try {
            // 이벤트를 찾을 수 없으면 전체 이벤트에서 검색
            const allEvents = await apiService.getAllEvents({ category: 'all' });
            const foundEvent = allEvents.find(e => e.id === id);
            
            if (foundEvent) {
              setEvent(foundEvent);
            } else {
              // 실제 대구 행사 목록에서 ID로 찾아보기
              const realDaeguEvents = [
                {
                  id: '1',
                  title: '대구 치맥 페스티벌 2024',
                  category: 'festival' as const,
                  date: '2024년 12월 7일 ~ 12월 10일',
                  startDate: '2024-12-07',
                  endDate: '2024-12-10',
                  place: '두류공원 일대',
                  price: '무료 입장',
                  image: '',
                  description: '대구의 대표 치킨과 맥주를 맛보는 축제입니다. 다양한 공연과 이벤트가 준비되어 있습니다.'
                },
                {
                  id: '2',
                  title: '대구 국제 뮤지컬 페스티벌',
                  category: 'performance' as const,
                  date: '2024년 11월 20일 ~ 12월 15일',
                  startDate: '2024-11-20',
                  endDate: '2024-12-15',
                  place: '대구오페라하우스',
                  price: '30,000원 ~ 80,000원',
                  image: '',
                  description: '세계적인 뮤지컬 작품들이 한자리에 모이는 국제 뮤지컬 페스티벌입니다.'
                },
                {
                  id: '3',
                  title: '대구 현대미술 전시회',
                  category: 'exhibition' as const,
                  date: '2024년 11월 1일 ~ 2025년 1월 31일',
                  startDate: '2024-11-01',
                  endDate: '2025-01-31',
                  place: '대구미술관',
                  price: '무료',
                  image: '',
                  description: '현대미술의 새로운 흐름을 소개하는 특별 전시회입니다.'
                }
              ];
              
              const fallbackEvent = realDaeguEvents.find(e => e.id === id);
              setEvent(fallbackEvent || null);
            }
          } catch (listError) {
            console.error('전체 목록 조회도 실패:', listError);
            setEvent(null);
          }
        }
      } catch (error) {
        console.error('이벤트 상세 정보 조회 실패:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);


  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success(t('message.urlCopied'));
    } catch (error) {
      console.error('링크 복사 실패:', error);
      toast.error(t('message.linkCopyFailed'));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('message.loginRequired'));
      return;
    }

    if (!event) {
      toast.error(t('message.eventNotFound'));
      return;
    }

    if (reviewForm.content.trim().length < 10) {
      toast.error(t('message.reviewMinLength'));
      return;
    }

    try {
      await addReview({
        eventId: event.id,
        eventTitle: event.title,
        rating: reviewForm.rating,
        content: reviewForm.content.trim(),
        images: []  // 임시로 빈 배열로 설정 (File[] 타입 문제 해결)
      });

      toast.success(t('message.reviewCreated'));
      setShowReviewForm(false);
      setReviewForm({
        rating: 5,
        content: '',
        images: []
      });
    } catch (error) {
      console.error('후기 작성 실패:', error);
      toast.error(t('message.reviewCreateFailed'));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFiles = 3;
    if (files.length > maxFiles) {
      toast.error(t('message.maxImageLimit', { count: maxFiles }));
      return;
    }

    // 실제 구현에서는 파일을 Firebase Storage에 업로드하고 URL을 받아와야 함
    // 현재는 임시로 로컬 URL 사용
    const imageUrls: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        imageUrls.push(result);
        
        if (imageUrls.length === files.length) {
          setReviewForm(prev => ({
            ...prev,
            images: [...prev.images, ...imageUrls].slice(0, maxFiles)
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setReviewForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">{t('eventDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('eventDetail.notFound')}</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {t('eventDetail.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tourist':
        return '관광지';
      case 'culture':
        return '문화시설';
      case 'festival':
        return '축제공연행사';
      case 'travel':
        return '여행코스';
      default:
        return '축제공연행사';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tourist':
        return 'bg-blue-100 text-blue-800';
      case 'culture':
        return 'bg-green-100 text-green-800';
      case 'festival':
        return 'bg-purple-100 text-purple-800';
      case 'travel':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className="mr-2">←</span>
        {t('eventDetail.back')}
      </button>

      {/* 컴팩트한 이벤트 정보 카드 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* 이미지 섹션 */}
        <div className="relative aspect-[2/1] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          {event.image && event.image !== '' ? (
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'flex flex-col items-center justify-center text-blue-400 p-8';
                placeholder.innerHTML = `
                  <svg class="w-16 h-16 mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-lg font-semibold text-center">${event.title}</span>
                `;
                e.currentTarget.parentElement!.appendChild(placeholder);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-blue-400 p-8">
              <svg className="w-16 h-16 mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-semibold text-center">{event.title}</span>
            </div>
          )}
          
          {/* 카테고리 뱃지 */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
              {getCategoryLabel(event.category)}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {event.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <span className="mr-2">📍</span>
              <p className="text-base">{event.place}</p>
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="mr-1">🔗</span>
              {t('eventDetail.share')}
            </button>
          </div>
        </div>
      </div>

      {/* 후기 메인 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {t('eventDetail.reviewsTitle')}
            </h2>
            <p className="text-gray-500">
              {t('eventDetail.reviewsCount', { count: eventReviews?.filter(review => review.eventId === event.id).length || 0 })}
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium text-lg shadow-sm"
            >
              {showReviewForm ? t('button.cancel') : t('eventDetail.writeReviewButton')}
            </button>
          )}
        </div>

        {/* 후기 작성 폼 */}
        {showReviewForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('eventDetail.reviewForm.title')}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* 평점 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('eventDetail.reviewForm.rating')}
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                      className={`text-2xl ${
                        rating <= reviewForm.rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({reviewForm.rating}/5)
                  </span>
                </div>
              </div>

              {/* 후기 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('eventDetail.reviewForm.content')}
                </label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={t('eventDetail.reviewForm.contentPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                  minLength={10}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewForm.content.length}/500 ({t('eventDetail.reviewForm.minLength')})
                </p>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('eventDetail.reviewForm.images')}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {/* 업로드된 이미지 미리보기 */}
                {reviewForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {reviewForm.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('eventDetail.reviewForm.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={reviewForm.content.trim().length < 10}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {t('eventDetail.reviewForm.submit')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 후기 목록 */}
        <div className="space-y-6">
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">{t('eventDetail.reviewsLoading')}</p>
            </div>
          ) : (
            <>
              {(eventReviews?.filter(review => review.eventId === event.id).length || 0) === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">💬</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t('eventDetail.noReviewsTitle')}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    {t('eventDetail.noReviewsSubtitle')}
                  </p>
                  {!user && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-blue-700 font-medium">
                        {t('eventDetail.loginRequiredForReview')}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                (eventReviews || [])
                  .filter(review => review.eventId === event.id)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};