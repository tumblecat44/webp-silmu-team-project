import { Timestamp } from 'firebase/firestore';

// Event 타입 정의
export interface Event {
  id: string;
  title: string;
  category: 'performance' | 'exhibition' | 'festival' | 'all';
  date: string;
  startDate: string;
  endDate: string;
  place: string;
  price: string;
  image: string;
  description: string;
  tel?: string;
  playtime?: string;
  ageLimit?: string;
  source?: string; // API 소스 (performance, exhibition, festival)
}

// User 타입 정의
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
}

// Bookmark 타입 정의
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

// Review 타입 정의
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  eventId: string;
  eventTitle: string;
  rating: number; // 1-5
  content: string;
  images?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// API Response 타입들
export interface ApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: T[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 공연 정보 API 응답 타입
export interface PerformanceItem {
  mt20id: string; // 공연ID
  prfnm: string; // 공연명
  prfpdfrom: string; // 공연시작일
  prfpdto: string; // 공연종료일
  fcltynm: string; // 공연시설명
  poster: string; // 포스터이미지
  area: string; // 지역
  genrenm: string; // 공연장르
  prfstate: string; // 공연상태
  openrun?: string; // 오픈런
}

// 전시 정보 API 응답 타입 (예시)
export interface ExhibitionItem {
  seq: string; // 전시ID
  title: string; // 전시명
  startDate: string; // 전시시작일
  endDate: string; // 전시종료일
  place: string; // 전시장소
  thumbnail: string; // 썸네일
  area: string; // 지역
  description: string; // 설명
}

// 축제 정보 API 응답 타입 (예시)
export interface FestivalItem {
  contentid: string; // 축제ID
  title: string; // 축제명
  eventstartdate: string; // 축제시작일
  eventenddate: string; // 축제종료일
  addr1: string; // 주소
  firstimage: string; // 대표이미지
  areacode: string; // 지역코드
  overview: string; // 개요
}

// 필터 타입
export interface EventFilters {
  category: 'all' | 'performance' | 'exhibition' | 'festival';
  search: string;
  dateFilter?: 'ongoing' | 'upcoming' | 'ended';
  sortBy?: 'latest' | 'popular';
}

// 로딩 상태 타입
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Toast 타입
export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// 언어 타입
export type Language = 'ko' | 'en';

// 페이지네이션 타입
export interface Pagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

// 모달 상태 타입
export interface ModalState {
  isOpen: boolean;
  type?: 'login' | 'review' | 'confirmation';
  data?: any;
}