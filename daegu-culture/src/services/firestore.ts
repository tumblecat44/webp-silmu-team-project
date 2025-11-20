import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase';
import type { Event, Review } from '../types';

// 타입 정의


class FirestoreService {
  // === 후기 CRUD ===

  // 후기 작성
  async createReview(
    userId: string,
    userName: string,
    userPhoto: string | undefined,
    eventId: string,
    eventTitle: string,
    rating: number,
    content: string,
    imageFiles?: File[]
  ): Promise<void> {
    try {
      let imageUrls: string[] = [];

      // 이미지 업로드
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await this.uploadReviewImages(eventId, imageFiles);
      }

      const reviewData: Omit<Review, 'id'> = {
        userId,
        userName,
        userPhoto,
        eventId,
        eventTitle,
        rating,
        content,
        images: imageUrls,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      // 토스트는 컴포넌트에서 처리
    } catch (error) {
      console.error('후기 작성 실패:', error);
      throw error;
    }
  }

  // 특정 이벤트의 모든 후기 조회
  async getEventReviews(eventId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('eventId', '==', eventId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('후기 조회 실패:', error);
      throw error;
    }
  }

  // 사용자가 작성한 모든 후기 조회
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
      
      // 클라이언트 사이드에서 생성일 기준으로 정렬
      return reviews.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    } catch (error) {
      console.error('사용자 후기 조회 실패:', error);
      throw error;
    }
  }

  // 후기 수정
  async updateReview(
    reviewId: string,
    updates: {
      rating?: number;
      content?: string;
      images?: string[];
    }
  ): Promise<void> {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      
      await updateDoc(reviewRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      toast.success('후기가 수정되었습니다');
    } catch (error) {
      console.error('후기 수정 실패:', error);
      toast.error('후기 수정에 실패했습니다');
      throw error;
    }
  }

  // 후기 삭제
  async deleteReview(reviewId: string, imageUrls?: string[]): Promise<void> {
    try {
      // 이미지 먼저 삭제
      if (imageUrls && imageUrls.length > 0) {
        await this.deleteReviewImages(imageUrls);
      }

      // 후기 문서 삭제
      await deleteDoc(doc(db, 'reviews', reviewId));
      toast.success('후기가 삭제되었습니다');
    } catch (error) {
      console.error('후기 삭제 실패:', error);
      toast.error('후기 삭제에 실패했습니다');
      throw error;
    }
  }

  // 특정 이벤트의 후기 수 조회
  async getReviewCount(eventId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('eventId', '==', eventId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('후기 수 조회 실패:', error);
      return 0;
    }
  }

  // 특정 이벤트의 평균 별점 조회
  async getAverageRating(eventId: string): Promise<number> {
    try {
      const reviews = await this.getEventReviews(eventId);
      
      if (reviews.length === 0) return 0;

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return Math.round((totalRating / reviews.length) * 10) / 10;
    } catch (error) {
      console.error('평균 별점 조회 실패:', error);
      return 0;
    }
  }

  // === 이미지 관련 ===

  // 후기 이미지 업로드
  private async uploadReviewImages(eventId: string, files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${index}.${file.name.split('.').pop()}`;
        const imageRef = ref(storage, `reviews/${eventId}/${fileName}`);
        
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw new Error('이미지 업로드에 실패했습니다');
    }
  }

  // 후기 이미지 삭제
  private async deleteReviewImages(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map(async (url) => {
        const imageRef = ref(storage, url);
        return await deleteObject(imageRef);
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      // 이미지 삭제 실패는 치명적이지 않으므로 에러를 던지지 않음
    }
  }

  // === 실시간 리스너 ===

  // 이벤트 후기 실시간 리스너
  subscribeToEventReviews(eventId: string, callback: (reviews: Review[]) => void) {
    const q = query(
      collection(db, 'reviews'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
      
      callback(reviews);
    });
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService;