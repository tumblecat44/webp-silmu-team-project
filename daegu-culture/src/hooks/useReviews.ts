import { useState } from 'react';
import { Review } from '../types';

// 임시 후기 훅 (Firebase 연동 전)
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const createReview = async (
    eventId: string,
    eventTitle: string,
    rating: number,
    content: string,
    images?: string[]
  ) => {
    setIsLoading(true);
    try {
      console.log('Creating review:', { eventId, eventTitle, rating, content, images });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateReview = async (
    reviewId: string,
    rating: number,
    content: string,
    images?: string[]
  ) => {
    setIsLoading(true);
    try {
      console.log('Updating review:', { reviewId, rating, content, images });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteReview = async (reviewId: string, images?: string[]) => {
    setIsLoading(true);
    try {
      console.log('Deleting review:', reviewId, images);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    reviews,
    createReview,
    updateReview,
    deleteReview,
    isLoading,
  };
};