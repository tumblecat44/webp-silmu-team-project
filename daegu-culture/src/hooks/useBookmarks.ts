import { useState } from 'react';
import { Event } from '../types';

// 임시 북마크 훅 (Firebase 연동 전)
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const isBookmarked = (eventId: string) => {
    return bookmarks.includes(eventId);
  };
  
  const addBookmark = async (event: Event) => {
    setIsLoading(true);
    try {
      setBookmarks(prev => [...prev, event.id]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeBookmark = async (eventId: string) => {
    setIsLoading(true);
    try {
      setBookmarks(prev => prev.filter(id => id !== eventId));
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    isLoading,
  };
};