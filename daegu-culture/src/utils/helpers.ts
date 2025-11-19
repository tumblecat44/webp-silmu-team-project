import { Event } from '../types';

// 날짜 포맷팅 함수
export const formatDate = (date: string | Date, locale: string = 'ko-KR'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 날짜 범위 포맷팅
export const formatDateRange = (startDate: string, endDate: string, locale: string = 'ko-KR'): string => {
  const start = formatDate(startDate, locale);
  const end = formatDate(endDate, locale);
  
  if (start === end) return start;
  return `${start} ~ ${end}`;
};

// 상대적 시간 표시 (몇 분 전, 몇 시간 전 등)
export const formatRelativeTime = (date: string | Date, locale: string = 'ko-KR'): string => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - dateObj.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (locale === 'ko-KR') {
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return formatDate(dateObj, locale);
  } else {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(dateObj, locale);
  }
};

// 문자열 자르기 (말줄임표 추가)
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 숫자를 K, M 단위로 포맷팅 (1000 -> 1K)
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
};

// URL 유효성 검증
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 이메일 유효성 검증
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 파일 크기를 읽기 쉬운 형태로 변환
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// 이미지 URL 유효성 검증
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  return imageRegex.test(url) || url.includes('placeholder');
};

// 기본 이미지 URL 반환
export const getDefaultImageUrl = (category?: string): string => {
  const baseUrl = '/images';
  switch (category) {
    case 'performance':
      return `${baseUrl}/default-performance.jpg`;
    case 'exhibition':
      return `${baseUrl}/default-exhibition.jpg`;
    case 'festival':
      return `${baseUrl}/default-festival.jpg`;
    default:
      return `${baseUrl}/default-event.jpg`;
  }
};

// 색상 클래스 반환 (카테고리별)
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'performance':
      return 'bg-blue-100 text-blue-800';
    case 'exhibition':
      return 'bg-purple-100 text-purple-800';
    case 'festival':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 별점을 별 이모지로 변환
export const formatRating = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  let stars = '⭐'.repeat(fullStars);
  if (hasHalfStar) stars += '⭐';
  
  return stars.padEnd(5, '☆');
};

// 검색 키워드 하이라이트
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 스로틀 함수
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 로컬 스토리지 헬퍼
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};

// 클립보드에 텍스트 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 폴백: 구형 브라우저 지원
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};

// 이벤트 상태 확인 (진행중, 예정, 종료)
export const getEventStatus = (startDate: string, endDate: string): 'ongoing' | 'upcoming' | 'ended' => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'ongoing';
};

// 이벤트 상태 라벨 반환
export const getEventStatusLabel = (status: 'ongoing' | 'upcoming' | 'ended', locale: string = 'ko-KR'): string => {
  if (locale === 'ko-KR') {
    switch (status) {
      case 'ongoing': return '진행중';
      case 'upcoming': return '예정';
      case 'ended': return '종료';
    }
  } else {
    switch (status) {
      case 'ongoing': return 'Ongoing';
      case 'upcoming': return 'Upcoming';
      case 'ended': return 'Ended';
    }
  }
};

// 이벤트 상태 색상 반환
export const getEventStatusColor = (status: 'ongoing' | 'upcoming' | 'ended'): string => {
  switch (status) {
    case 'ongoing':
      return 'bg-green-100 text-green-800';
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'ended':
      return 'bg-gray-100 text-gray-600';
  }
};

// 랜덤 ID 생성
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 배열 셞플
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 이벤트 필터링
export const filterEvents = (
  events: Event[],
  filters: {
    category?: string;
    search?: string;
    status?: string;
  }
): Event[] => {
  return events.filter(event => {
    // 카테고리 필터
    if (filters.category && filters.category !== 'all' && event.category !== filters.category) {
      return false;
    }
    
    // 검색 필터
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = event.title.toLowerCase().includes(searchLower);
      const placeMatch = event.place.toLowerCase().includes(searchLower);
      if (!titleMatch && !placeMatch) {
        return false;
      }
    }
    
    // 상태 필터
    if (filters.status && filters.status !== 'all') {
      const eventStatus = getEventStatus(event.startDate, event.endDate);
      if (eventStatus !== filters.status) {
        return false;
      }
    }
    
    return true;
  });
};

// 이벤트 정렬
export const sortEvents = (events: Event[], sortBy: string): Event[] => {
  const sorted = [...events];
  
  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};