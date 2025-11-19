import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { firestoreService, Bookmark } from '../services/firestore';
import { Event } from '../types';

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  loading: boolean;
  isBookmarked: (eventId: string) => boolean;
  addBookmark: (event: Event) => Promise<void>;
  removeBookmark: (eventId: string) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

export const useBookmarks = (): UseBookmarksReturn => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  // 북마크 목록 조회
  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    try {
      setLoading(true);
      const userBookmarks = await firestoreService.getUserBookmarks(user.uid);
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error('북마크 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 사용자가 변경되면 북마크 목록 새로 조회
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // 실시간 리스너 설정
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const unsubscribe = firestoreService.subscribeToUserBookmarks(
      user.uid,
      (updatedBookmarks) => {
        setBookmarks(updatedBookmarks);
      }
    );

    return unsubscribe;
  }, [user]);

  // 북마크 여부 확인
  const isBookmarked = useCallback((eventId: string): boolean => {
    return bookmarks.some(bookmark => bookmark.eventId === eventId);
  }, [bookmarks]);

  // 북마크 추가
  const addBookmark = useCallback(async (event: Event): Promise<void> => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (isBookmarked(event.id)) {
      throw new Error('이미 북마크된 행사입니다.');
    }

    try {
      await firestoreService.addBookmark(user.uid, event);
      // 실시간 리스너가 자동으로 상태를 업데이트합니다
    } catch (error) {
      console.error('북마크 추가 실패:', error);
      throw error;
    }
  }, [user, isBookmarked]);

  // 북마크 삭제
  const removeBookmark = useCallback(async (eventId: string): Promise<void> => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      await firestoreService.removeBookmarkByEventId(user.uid, eventId);
      // 실시간 리스너가 자동으로 상태를 업데이트합니다
    } catch (error) {
      console.error('북마크 삭제 실패:', error);
      throw error;
    }
  }, [user]);

  // 북마크 새로고침
  const refreshBookmarks = useCallback(async (): Promise<void> => {
    return fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    refreshBookmarks,
  };
};