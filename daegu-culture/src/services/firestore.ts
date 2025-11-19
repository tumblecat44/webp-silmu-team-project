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
import { Event } from '../types';
import toast from 'react-hot-toast';

// 타입 정의
export interface Bookmark {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  category: string;
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  eventId: string;
  eventTitle: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class FirestoreService {
  // === 북마크 CRUD ===

  // 북마크 추가
  async addBookmark(userId: string, event: Event): Promise<void> {
    try {
      const bookmarkData: Omit<Bookmark, 'id'> = {
        userId,
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image || '',
        eventDate: event.date,
        category: event.category,
        createdAt: serverTimestamp() as Timestamp,
      };

      await addDoc(collection(db, 'bookmarks'), bookmarkData);
      toast.success('북마크에 추가되었습니다');
    } catch (error) {
      console.error('북마크 추가 실패:', error);
      toast.error('북마크 추가에 실패했습니다');
      throw error;
    }
  }

  // 사용자의 모든 북마크 조회
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bookmark));
    } catch (error) {
      console.error('북마크 조회 실패:', error);
      throw error;
    }
  }

  // 특정 이벤트가 북마크되어 있는지 확인
  async isBookmarked(userId: string, eventId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId),
        where('eventId', '==', eventId),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('북마크 확인 실패:', error);
      return false;
    }
  }

  // 북마크 삭제 (이벤트 ID로)
  async removeBookmarkByEventId(userId: string, eventId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId),
        where('eventId', '==', eventId)
      );

      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
      }

      toast.success('북마크가 삭제되었습니다');
    } catch (error) {
      console.error('북마크 삭제 실패:', error);
      toast.error('북마크 삭제에 실패했습니다');
      throw error;
    }
  }

  // 북마크 삭제 (북마크 ID로)
  async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'bookmarks', bookmarkId));
      toast.success('북마크가 삭제되었습니다');
    } catch (error) {
      console.error('북마크 삭제 실패:', error);
      toast.error('북마크 삭제에 실패했습니다');
      throw error;
    }
  }

  // 특정 이벤트의 북마크 수 조회
  async getBookmarkCount(eventId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('eventId', '==', eventId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('북마크 수 조회 실패:', error);
      return 0;
    }
  }

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
      toast.success('후기가 작성되었습니다');
    } catch (error) {
      console.error('후기 작성 실패:', error);
      toast.error('후기 작성에 실패했습니다');
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
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
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

  // 사용자 북마크 실시간 리스너
  subscribeToUserBookmarks(userId: string, callback: (bookmarks: Bookmark[]) => void) {
    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const bookmarks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bookmark));
      
      callback(bookmarks);
    });
  }

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