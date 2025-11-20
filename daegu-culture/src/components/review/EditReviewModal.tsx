import { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Review } from '../../types';
import toast from 'react-hot-toast';

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onUpdate: (reviewId: string, updates: { rating: number; content: string }) => Promise<void>;
}

export const EditReviewModal = ({ isOpen, onClose, review, onUpdate }: EditReviewModalProps) => {
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim().length < 10) {
      toast.error('후기는 최소 10자 이상 작성해주세요');
      return;
    }

    if (content.trim() === review.content && rating === review.rating) {
      toast.error('변경된 내용이 없습니다');
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdate(review.id, {
        rating,
        content: content.trim(),
      });
      onClose();
    } catch (error) {
      console.error('후기 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">후기 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 행사 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              행사
            </label>
            <p className="text-gray-900 font-semibold">{review.eventTitle}</p>
          </div>

          {/* 평점 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평점
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  disabled={isSubmitting}
                  className={`text-3xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors disabled:cursor-not-allowed`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({rating}/5)
              </span>
            </div>
          </div>

          {/* 후기 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              후기 내용 (최소 10자)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="행사에 대한 후기를 작성해주세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={6}
              required
              minLength={10}
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              {content.length}/500 (최소 10자 필요)
            </p>
          </div>

          {/* 기존 이미지 표시 */}
          {review.images && review.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                첨부된 이미지
              </label>
              <div className="flex flex-wrap gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`후기 이미지 ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * 이미지 수정 기능은 추후 업데이트 예정입니다
              </p>
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || content.trim().length < 10}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
