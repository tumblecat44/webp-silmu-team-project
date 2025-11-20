import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useReviews } from '../hooks/useReviews';

export const MyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userReviews, loading: reviewsLoading, deleteReview } = useReviews();

  useEffect(() => {
    // 로그인하지 않은 사용자는 홈으로 리디렉션
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('myPage.loginRequired')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('myPage.loginMessage')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {t('eventDetail.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteReview = async (reviewId: string, imageUrls?: string[]) => {
    if (window.confirm('정말로 이 후기를 삭제하시겠습니까?')) {
      await deleteReview(reviewId, imageUrls);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 사용자 정보 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || ''}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.displayName || t('common.user', '사용자')}{t('myPage.title')}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 후기 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('myPage.myReviews')}</h2>
        
        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">{t('myPage.reviewsLoading')}</p>
          </div>
        ) : !userReviews || userReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('myPage.noReviewsTitle')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('myPage.noReviewsMessage')}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              {t('myPage.browseEvents')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
              {(userReviews || []).map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 
                        onClick={() => navigate(`/events/${review.eventId}`)}
                        className="font-semibold text-lg text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {review.eventTitle}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < review.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* TODO: 수정 기능 */}}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {t('button.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id, review.images)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {t('button.delete')}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.content}
                  </p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`후기 이미지 ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {t('myPage.writtenOn')}: {review.createdAt?.toDate?.()?.toLocaleDateString() || '날짜 정보 없음'}
                    {review.updatedAt && review.updatedAt !== review.createdAt && (
                      <span className="ml-2">
                        ({t('myPage.edited')}: {review.updatedAt?.toDate?.()?.toLocaleDateString()})
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};