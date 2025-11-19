import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useBookmarks } from '../hooks/useBookmarks';
import { useReviews } from '../hooks/useReviews';

export const MyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarks, loading: bookmarksLoading, removeBookmark } = useBookmarks();
  const { userReviews, loading: reviewsLoading, deleteReview } = useReviews();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'reviews'>('bookmarks');

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
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 mb-6">
            북마크와 후기 기능을 사용하려면 로그인해주세요
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            홈으로 돌아가기
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
              {user.displayName || '사용자'}님
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bookmarks'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🔖 북마크 ({bookmarks.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✍️ 내 후기 ({userReviews.length})
        </button>
      </div>

      {/* 북마크 탭 */}
      {activeTab === 'bookmarks' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">북마크한 행사</h2>
          
          {bookmarksLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">북마크 목록을 불러오는 중...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📌</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                북마크한 행사가 없습니다
              </h3>
              <p className="text-gray-600 mb-4">
                관심 있는 행사를 북마크해보세요
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                행사 둘러보기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div 
                    onClick={() => navigate(`/events/${bookmark.eventId}`)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                      {bookmark.eventImage ? (
                        <img
                          src={bookmark.eventImage}
                          alt={bookmark.eventTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">📷 이미지</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {bookmark.eventTitle}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        📅 {bookmark.eventDate}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        bookmark.category === 'performance' ? 'bg-purple-100 text-purple-800' :
                        bookmark.category === 'exhibition' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {bookmark.category === 'performance' ? '공연' :
                         bookmark.category === 'exhibition' ? '전시' : '축제'}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
                    >
                      북마크 해제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 후기 탭 */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">내가 작성한 후기</h2>
          
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">후기 목록을 불러오는 중...</p>
            </div>
          ) : userReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✍️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                작성한 후기가 없습니다
              </h3>
              <p className="text-gray-600 mb-4">
                다녀온 행사에 대한 후기를 작성해보세요
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                행사 둘러보기
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userReviews.map((review) => (
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
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id, review.images)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        삭제
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
                    작성일: {review.createdAt?.toDate?.()?.toLocaleDateString() || '날짜 정보 없음'}
                    {review.updatedAt && review.updatedAt !== review.createdAt && (
                      <span className="ml-2">
                        (수정됨: {review.updatedAt?.toDate?.()?.toLocaleDateString()})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};