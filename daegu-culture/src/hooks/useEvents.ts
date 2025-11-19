import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { Event } from '../types';
import { CATEGORIES } from '../utils/constants';

interface UseEventsParams {
  category?: keyof typeof CATEGORIES;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  autoFetch?: boolean;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  searchEvents: (keyword: string) => Promise<void>;
  getEventById: (id: string) => Promise<Event | null>;
  refreshEvents: () => Promise<void>;
}

export const useEvents = (params: UseEventsParams = {}): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = {
        category: params.category === 'all' ? 'all' as const : params.category,
        keyword: params.keyword,
        startDate: params.startDate,
        endDate: params.endDate,
      };

      const fetchedEvents = await apiService.getAllEvents(apiParams);
      setEvents(fetchedEvents);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('이벤트 조회 실패:', err);
      
      // 에러 발생 시 빈 배열로 설정
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [params.category, params.keyword, params.startDate, params.endDate]);

  const searchEvents = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      // 빈 키워드일 경우 전체 조회
      return fetchEvents();
    }

    try {
      setLoading(true);
      setError(null);

      const searchResults = await apiService.searchEvents(keyword);
      setEvents(searchResults);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '검색에 실패했습니다.';
      setError(errorMessage);
      console.error('이벤트 검색 실패:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const getEventById = useCallback(async (id: string): Promise<Event | null> => {
    try {
      // 먼저 현재 로드된 이벤트에서 찾기
      const existingEvent = events.find(event => event.id === id);
      if (existingEvent) {
        return existingEvent;
      }

      // API에서 상세 정보 조회
      const event = await apiService.getEventDetail(id);
      return event;
      
    } catch (err) {
      console.error('이벤트 상세 조회 실패:', err);
      return null;
    }
  }, [events]);

  const refreshEvents = useCallback(async () => {
    return fetchEvents();
  }, [fetchEvents]);

  // 초기 로딩
  useEffect(() => {
    if (params.autoFetch !== false) {
      fetchEvents();
    }
  }, [fetchEvents, params.autoFetch]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    searchEvents,
    getEventById,
    refreshEvents,
  };
};

// 특정 카테고리만 조회하는 훅
export const useEventsByCategory = (category: keyof typeof CATEGORIES) => {
  return useEvents({ category, autoFetch: true });
};

// 검색 전용 훅
export const useEventSearch = () => {
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);

      const results = await apiService.searchEvents(keyword);
      setSearchResults(results);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '검색에 실패했습니다.';
      setSearchError(errorMessage);
      console.error('검색 실패:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    search,
    clearSearch,
  };
};

// 단일 이벤트 상세 조회 훅
export const useEventDetail = (eventId: string | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventDetail = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const eventDetail = await apiService.getEventDetail(id);
      setEvent(eventDetail);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트 정보를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('이벤트 상세 조회 실패:', err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      fetchEventDetail(eventId);
    } else {
      setEvent(null);
      setError(null);
    }
  }, [eventId, fetchEventDetail]);

  const refetch = useCallback(() => {
    if (eventId) {
      return fetchEventDetail(eventId);
    }
    return Promise.resolve();
  }, [eventId, fetchEventDetail]);

  return {
    event,
    loading,
    error,
    refetch,
  };
};