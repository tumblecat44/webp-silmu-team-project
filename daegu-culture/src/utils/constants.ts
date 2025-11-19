// API 관련 상수
export const API_ENDPOINTS = {
  // 공연예술통합전산망 API
  KOPIS: 'https://www.kopis.or.kr/openApi/restful',
  
  // 문화체육관광부 공공데이터
  CULTURE_BASE_URL: '/api/B551011/KorService2',
  
  // 한국관광공사 TourAPI
  TOUR_API_BASE_URL: '/api/B551011/KorService2',
} as const;

// 카테고리 상수
export const CATEGORIES = {
  ALL: 'all',
  PERFORMANCE: 'performance',
  EXHIBITION: 'exhibition',
  FESTIVAL: 'festival',
} as const;

// 카테고리 라벨 (한국어)
export const CATEGORY_LABELS = {
  [CATEGORIES.ALL]: '전체',
  [CATEGORIES.PERFORMANCE]: '공연',
  [CATEGORIES.EXHIBITION]: '전시',
  [CATEGORIES.FESTIVAL]: '축제',
} as const;

// 카테고리 라벨 (영어)
export const CATEGORY_LABELS_EN = {
  [CATEGORIES.ALL]: 'All',
  [CATEGORIES.PERFORMANCE]: 'Performance',
  [CATEGORIES.EXHIBITION]: 'Exhibition',
  [CATEGORIES.FESTIVAL]: 'Festival',
} as const;

// 날짜 필터 상수
export const DATE_FILTERS = {
  ALL: 'all',
  ONGOING: 'ongoing',
  UPCOMING: 'upcoming',
  ENDED: 'ended',
} as const;

// 정렬 옵션
export const SORT_OPTIONS = {
  LATEST: 'latest',
  POPULAR: 'popular',
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
} as const;

// 페이지네이션 상수
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
  DEFAULT_PAGE: 1,
} as const;

// 스켈레톤 로딩 개수
export const SKELETON_COUNT = 8;

// 이미지 관련 상수
export const IMAGE_SETTINGS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILES: 3,
  PLACEHOLDER: '/placeholder-event.jpg',
} as const;

// 별점 관련 상수
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 5,
} as const;

// 리뷰 관련 상수
export const REVIEW_SETTINGS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 1000,
} as const;

// Toast 설정
export const TOAST_SETTINGS = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 4000,
    WARNING: 3500,
    INFO: 3000,
  },
  POSITION: 'bottom-center' as const,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  LANGUAGE: 'language',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// 애니메이션 duration
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
} as const;

// 브레이크포인트 (Tailwind 기준)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// 대구 지역 코드 (공공데이터 API용)
export const DAEGU_AREA_CODES = {
  DAEGU_CITY: '4', // 대구광역시 지역코드
  DISTRICTS: [
    '4.1', // 중구
    '4.2', // 동구
    '4.3', // 서구
    '4.4', // 남구
    '4.5', // 북구
    '4.6', // 수성구
    '4.7', // 달서구
    '4.8', // 달성군
    '4.9', // 군위군
  ],
} as const;

// API 요청 제한
export const API_LIMITS = {
  RETRY_COUNT: 3,
  TIMEOUT: 10000, // 10초
  DEBOUNCE_DELAY: 300, // 검색 디바운스
} as const;

// 컴포넌트 크기 상수
export const COMPONENT_SIZES = {
  AVATAR: {
    SM: 'w-8 h-8',
    MD: 'w-12 h-12',
    LG: 'w-16 h-16',
  },
  BUTTON: {
    SM: 'px-3 py-1.5 text-sm',
    MD: 'px-4 py-2 text-base',
    LG: 'px-6 py-3 text-lg',
  },
} as const;

// 정규표현식 패턴
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/,
  URL: /^https?:\/\/[^\s$.?#].[^\s]*$/,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다',
  API_ERROR: 'API 요청 중 오류가 발생했습니다',
  AUTH_REQUIRED: '로그인이 필요한 서비스입니다',
  PERMISSION_DENIED: '권한이 없습니다',
  NOT_FOUND: '요청하신 페이지를 찾을 수 없습니다',
  VALIDATION_ERROR: '입력 정보를 확인해주세요',
  FILE_SIZE_ERROR: '파일 크기는 5MB 이하로 업로드해주세요',
  FILE_TYPE_ERROR: '지원하지 않는 파일 형식입니다',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  BOOKMARK_ADDED: '북마크에 추가되었습니다',
  BOOKMARK_REMOVED: '북마크가 삭제되었습니다',
  REVIEW_CREATED: '후기가 작성되었습니다',
  REVIEW_UPDATED: '후기가 수정되었습니다',
  REVIEW_DELETED: '후기가 삭제되었습니다',
  LOGIN_SUCCESS: '로그인되었습니다',
  LOGOUT_SUCCESS: '로그아웃되었습니다',
  SHARE_SUCCESS: 'URL이 클립보드에 복사되었습니다',
} as const;