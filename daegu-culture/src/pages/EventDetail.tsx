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
  const [isBookmarked, setIsBookmarked] = useState(false);
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

  const handleBookmark = () => {
    // TODO: Firebase 인증과 연결 후 구현
    toast.success(isBookmarked ? '북마크가 해제되었습니다' : '북마크에 추가되었습니다');
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('URL이 클립보드에 복사되었습니다');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      toast.error('링크 복사에 실패했습니다');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (!event) {
      toast.error('행사 정보를 찾을 수 없습니다');
      return;
    }

    if (reviewForm.content.trim().length < 10) {
      toast.error('후기는 최소 10자 이상 작성해주세요');
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

      toast.success('후기가 작성되었습니다');
      setShowReviewForm(false);
      setReviewForm({
        rating: 5,
        content: '',
        images: []
      });
    } catch (error) {
      console.error('후기 작성 실패:', error);
      toast.error('후기 작성에 실패했습니다');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFiles = 3;
    if (files.length > maxFiles) {
      toast.error(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다`);
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
          <p className="mt-2">행사 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">행사를 찾을 수 없습니다</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'performance':
        return '공연';
      case 'exhibition':
        return '전시';
      case 'festival':
        return '축제';
      default:
        return '행사';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance':
        return 'bg-purple-100 text-purple-800';
      case 'exhibition':
        return 'bg-green-100 text-green-800';
      case 'festival':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
        뒤로가기
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 이미지 섹션 */}
        <div className="relative aspect-[16/9] bg-gray-200 flex items-center justify-center">
          {event.image && event.image !== '' ? (
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-gray-500 text-lg">📷 이미지</span>';
              }}
            />
          ) : (
            <span className="text-gray-500 text-lg">📷 이미지</span>
          )}
          
          {/* 카테고리 뱃지 */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
              {getCategoryLabel(event.category)}
            </span>
          </div>
        </div>
        
        <div className="p-8">
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {event.title}
          </h1>
          
          {/* 행사 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center font-semibold text-gray-700 mb-2">
                  <span className="mr-2">📅</span>
                  날짜
                </h3>
                <p className="text-gray-600 ml-6">{event.date}</p>
              </div>
              <div>
                <h3 className="flex items-center font-semibold text-gray-700 mb-2">
                  <span className="mr-2">📍</span>
                  장소
                </h3>
                <p className="text-gray-600 ml-6">{event.place}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center font-semibold text-gray-700 mb-2">
                  <span className="mr-2">💰</span>
                  가격
                </h3>
                <p className="text-gray-600 ml-6 font-medium">{event.price}</p>
              </div>
              {event.tel && (
                <div>
                  <h3 className="flex items-center font-semibold text-gray-700 mb-2">
                    <span className="mr-2">📞</span>
                    연락처
                  </h3>
                  <p className="text-gray-600 ml-6">{event.tel}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* 설명 */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-4 text-lg">상세 정보</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleBookmark}
              className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                isBookmarked 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <span className="mr-2">{isBookmarked ? '❤️' : '🔖'}</span>
              {isBookmarked ? '북마크 해제' : '북마크 추가'}
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              <span className="mr-2">🔗</span>
              공유하기
            </button>
          </div>
        </div>
      </div>

      {/* 후기 섹션 */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            후기 ({eventReviews?.filter(review => review.eventId === event.id).length || 0})
          </h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showReviewForm ? '취소' : '후기 작성'}
            </button>
          )}
        </div>

        {/* 후기 작성 폼 */}
        {showReviewForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">후기 작성</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* 평점 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  평점
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
                  후기 내용 (최소 10자)
                </label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="행사에 대한 후기를 작성해주세요..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                  minLength={10}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewForm.content.length}/500 (최소 10자 필요)
                </p>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사진 첨부 (최대 3장)
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
                  취소
                </button>
                <button
                  type="submit"
                  disabled={reviewForm.content.trim().length < 10}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                  후기 등록
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
              <p className="mt-2 text-gray-500">후기를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {(eventReviews?.filter(review => review.eventId === event.id).length || 0) === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    아직 후기가 없습니다
                  </h3>
                  <p className="text-gray-600 mb-4">
                    이 행사에 대한 첫 번째 후기를 작성해보세요
                  </p>
                  {!user && (
                    <p className="text-sm text-gray-500">
                      후기 작성을 하려면 로그인이 필요합니다
                    </p>
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