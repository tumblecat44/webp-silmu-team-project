import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { firestoreService } from '../services/firestore';
import type { Review } from '../types';

interface CreateReviewParams {
  eventId: string;
  eventTitle: string;
  rating: number;
  content: string;
  images?: File[];
}

interface UpdateReviewParams {
  rating?: number;
  content?: string;
  images?: string[];
}

interface UseReviewsReturn {
  reviews: Review[];
  userReviews: Review[];
  loading: boolean;
  createReview: (params: CreateReviewParams) => Promise<void>;
  updateReview: (reviewId: string, params: UpdateReviewParams) => Promise<void>;
  deleteReview: (reviewId: string, imageUrls?: string[]) => Promise<void>;
  getEventReviews: (eventId: string) => Promise<Review[]>;
  getUserReviews: () => Promise<Review[]>;
  refreshReviews: () => Promise<void>;
}

export const useReviews = (eventId?: string): UseReviewsReturn => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // 후기 목록 조회 (이벤트별 또는 사용자별)
  const fetchReviews = useCallback(async () => {
    if (!eventId && !user) {
      setReviews([]);
      return;
    }

    try {
      setLoading(true);
      let fetchedReviews: Review[];

      if (eventId) {
        // 특정 이벤트의 모든 후기
        fetchedReviews = await firestoreService.getEventReviews(eventId);
      } else if (user) {
        // 사용자가 작성한 모든 후기
        fetchedReviews = await firestoreService.getUserReviews(user.uid);
      } else {
        fetchedReviews = [];
      }

      setReviews(fetchedReviews);
    } catch (error) {
      console.error('후기 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId, user]);

  // 초기 로딩
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 실시간 리스너 설정 (이벤트별 또는 사용자별)
  useEffect(() => {
    if (eventId) {
      // 이벤트별 후기 실시간 리스너
      const unsubscribe = firestoreService.subscribeToEventReviews(
        eventId,
        (updatedReviews) => {
          setReviews(updatedReviews);
        }
      );
      return unsubscribe;
    } else if (user) {
      // 사용자별 후기 실시간 리스너
      const unsubscribe = firestoreService.subscribeToUserReviews(
        user.uid,
        (updatedReviews) => {
          setReviews(updatedReviews);
        }
      );
      return unsubscribe;
    }
  }, [eventId, user]);

  // 후기 작성
  const createReview = useCallback(async (params: CreateReviewParams): Promise<void> => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      setLoading(true);

      await firestoreService.createReview(
        user.uid,
        user.displayName || '익명 사용자',
        user.photoURL,
        params.eventId,
        params.eventTitle,
        params.rating,
        params.content,
        params.images
      );

      // 실시간 리스너가 자동으로 업데이트
    } catch (error) {
      console.error('후기 작성 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 후기 수정
  const updateReview = useCallback(async (
    reviewId: string,
    params: UpdateReviewParams
  ): Promise<void> => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      setLoading(true);

      await firestoreService.updateReview(reviewId, params);

      // 실시간 리스너가 자동으로 업데이트
    } catch (error) {
      console.error('후기 수정 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 후기 삭제
  const deleteReview = useCallback(async (reviewId: string, imageUrls?: string[]): Promise<void> => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      setLoading(true);

      // imageUrls가 없으면 reviews에서 찾기
      if (!imageUrls) {
        const reviewToDelete = reviews.find(r => r.id === reviewId);
        imageUrls = reviewToDelete?.images;
      }

      await firestoreService.deleteReview(reviewId, imageUrls);

      // 실시간 리스너가 자동으로 업데이트
    } catch (error) {
      console.error('후기 삭제 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, reviews]);

  // 특정 이벤트 후기 조회
  const getEventReviews = useCallback(async (targetEventId: string): Promise<Review[]> => {
    try {
      return await firestoreService.getEventReviews(targetEventId);
    } catch (error) {
      console.error('이벤트 후기 조회 실패:', error);
      return [];
    }
  }, []);

  // 사용자 후기 조회
  const getUserReviews = useCallback(async (): Promise<Review[]> => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      return await firestoreService.getUserReviews(user.uid);
    } catch (error) {
      console.error('사용자 후기 조회 실패:', error);
      return [];
    }
  }, [user]);

  // 후기 새로고침
  const refreshReviews = useCallback(async (): Promise<void> => {
    return fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    userReviews: reviews,
    loading,
    createReview,
    updateReview,
    deleteReview,
    getEventReviews,
    getUserReviews,
    refreshReviews,
  };
};