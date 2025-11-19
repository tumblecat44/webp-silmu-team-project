import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Review } from '../../types';
import { Card, Button, Modal } from '../common';
import { ReviewForm } from './ReviewForm';
import { useAuth } from '../../hooks/useAuth';
import { useReviews } from '../../hooks/useReviews';
import { formatRelativeTime, formatRating } from '../../utils/helpers';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  className?: string;
  showEventTitle?: boolean;
}

export const ReviewCard = ({
  review,
  onEdit,
  onDelete,
  className,
  showEventTitle = false
}: ReviewCardProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { deleteReview, isLoading } = useReviews();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const isOwner = user?.uid === review.userId;
  
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };
  
  const handleEditSuccess = (updatedReview: Review) => {
    setIsEditModalOpen(false);
    onEdit?.(updatedReview);
    toast.success(t('message.reviewUpdated', '후기가 수정되었습니다'));
  };
  
  const handleDelete = async () => {
    try {
      await deleteReview(review.id, review.images);
      onDelete?.(review.id);
      setIsDeleteModalOpen(false);
      toast.success(t('message.reviewDeleted', '후기가 삭제되었습니다'));
    } catch (error) {
      toast.error(t('message.error', '오류가 발생했습니다'));
    }
  };
  
  return (
    <>
      <Card className={cn('space-y-4', className)} padding="lg">
        {/* 헤더: 사용자 정보 및 액션 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
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
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{review.userName}</span>
                <div className="flex items-center">
                  {formatRating(review.rating)}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatRelativeTime(review.createdAt.toDate(), t.language)}</span>
                {review.updatedAt && review.updatedAt !== review.createdAt && (
                  <span>• {t('review.edited', '수정됨')}</span>
                )}\n              </div>\n            </div>\n          </div>\n          \n          {/* 액션 버튼 (작성자만) */}\n          {isOwner && (\n            <div className="flex items-center space-x-2">\n              <Button\n                variant="ghost"\n                size="sm"\n                onClick={handleEdit}\n                className="text-gray-500 hover:text-gray-700"\n              >\n                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />\n                </svg>\n              </Button>\n              <Button\n                variant="ghost"\n                size="sm"\n                onClick={() => setIsDeleteModalOpen(true)}\n                className="text-gray-500 hover:text-red-600"\n              >\n                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />\n                </svg>\n              </Button>\n            </div>\n          )}\n        </div>\n        \n        {/* 행사 제목 (필요한 경우) */}\n        {showEventTitle && (\n          <div className="text-sm text-gray-600">\n            <span className="font-medium">{t('review.eventTitle', '행사:')} </span>\n            {review.eventTitle}\n          </div>\n        )}\n        \n        {/* 후기 내용 */}\n        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">\n          {review.content}\n        </div>\n        \n        {/* 이미지들 */}\n        {review.images && review.images.length > 0 && (\n          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">\n            {review.images.map((image, index) => (\n              <div\n                key={index}\n                className="aspect-square overflow-hidden rounded-lg bg-gray-100"\n              >\n                <img\n                  src={image}\n                  alt={`Review image ${index + 1}`}\n                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"\n                  onClick={() => {\n                    // 이미지 뷰어 모달 열기 (추후 구현)\n                    window.open(image, '_blank');\n                  }}\n                />\n              </div>\n            ))}\n          </div>\n        )}\n      </Card>\n      \n      {/* 수정 모달 */}\n      <Modal\n        isOpen={isEditModalOpen}\n        onClose={() => setIsEditModalOpen(false)}\n        title={t('review.editTitle', '후기 수정')}\n        size="lg"\n      >\n        <ReviewForm\n          eventId={review.eventId}\n          eventTitle={review.eventTitle}\n          initialData={{\n            rating: review.rating,\n            content: review.content,\n            images: review.images\n          }}\n          reviewId={review.id}\n          onSuccess={handleEditSuccess}\n          onCancel={() => setIsEditModalOpen(false)}\n        />\n      </Modal>\n      \n      {/* 삭제 확인 모달 */}\n      <Modal\n        isOpen={isDeleteModalOpen}\n        onClose={() => setIsDeleteModalOpen(false)}\n        title={t('review.deleteTitle', '후기 삭제')}\n        size="sm"\n      >\n        <div className="space-y-4">\n          <p className="text-gray-700">\n            {t('review.deleteConfirm', '정말로 이 후기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')}\n          </p>\n          \n          <div className="flex justify-end space-x-3">\n            <Button\n              variant="outline"\n              onClick={() => setIsDeleteModalOpen(false)}\n              disabled={isLoading}\n            >\n              {t('button.cancel', '취소')}\n            </Button>\n            <Button\n              variant="danger"\n              onClick={handleDelete}\n              isLoading={isLoading}\n            >\n              {t('button.delete', '삭제')}\n            </Button>\n          </div>\n        </div>\n      </Modal>\n    </>\n  );\n};