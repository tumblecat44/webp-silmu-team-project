## 대구 지역 문화행사 정보 플랫폼

---

## 1. 프로젝트 개요

### 1.1 프로젝트명

**DaeguCulture** (대구컬쳐)

### 1.2 목적

대구 지역의 문화행사(공연, 전시, 축제) 정보를 한 곳에서 조회하고 관리할 수 있는 웹 플랫폼 개발

### 1.3 타겟 유저

- 대구 거주 시민
- 대구 방문 관광객
- 문화생활에 관심 있는 학생/직장인

### 1.4 핵심 가치 제안

- 대구 지역 문화행사 정보 통합 제공
- 관심 행사 북마크 및 후기 공유
- 간편한 일정 관리

---

## 2. 기술 스택 (요구사항 충족)

### 2.1 Frontend

```json
{
  "framework": "React 19 (함수형 컴포넌트 + Hooks)",
  "language": "TypeScript",
  "buildTool": "Vite",
  "styling": "Tailwind CSS 4",
  "routing": "React Router v7",
  "nodeVersion": "22+"
}

```

### 2.2 Backend

```json
{
  "platform": "Firebase",
  "services": [
    "Firestore (Database - CRUD)",
    "Authentication (Google, Email)",
    "Storage (후기 이미지 업로드)"
  ]
}

```

### 2.3 External APIs

- **문화공공데이터광장 공연정보 API**
- **문화공공데이터광장 전시정보 API**
- **한국지역진흥재단 축제정보 API**
- 대구 지역으로 필터링하여 사용

### 2.4 다국어

- **한국어** (기본)
- **영어** (추가)
- 라이브러리: `react-i18next`
- **데이터베이스 데이터는 번역 제외**

---

## 3. 페이지 구조 (3페이지 이상)

### 3.1 페이지 맵

```
/                    → 홈 (대구 행사 목록)
/events/:id          → 행사 상세 페이지
/my-page             → 마이페이지 (북마크 & 후기)

```

### 3.2 각 페이지 상세

### 3.2.1 홈 (`/`)

**목적**: 대구 지역 문화행사 탐색 및 필터링

**레이아웃**:

- Header: 로고, 언어 전환, 로그인/로그아웃
- Filter Bar: 카테고리, 날짜, 검색
- Event Grid: 행사 카드 리스트

**주요 기능**:

- **카테고리 필터**: 전체/공연/전시/축제
- **날짜 필터**: 진행중/예정/종료
- **검색**: 행사 제목 검색
- **정렬**: 최신순, 인기순(북마크 수)
- **카드 클릭**: 상세 페이지 이동

**데이터 소스**:

- 공공데이터 API (대구 지역 필터)
- Firebase (북마크 수, 후기 수)

**반응형**:

```
Mobile (< 640px):   1단 리스트
Tablet (640-1024):  2단 그리드
Desktop (> 1024):   3-4단 그리드

```

---

### 3.2.2 행사 상세 (`/events/:id`)

**목적**: 행사 상세 정보 확인 및 북마크/후기 작성

**레이아웃 (섹션별)**:

1. **행사 정보 섹션**
    - 대표 이미지
    - 제목
    - 카테고리 뱃지
    - 날짜, 시간
    - 장소
    - 가격 정보
    - 상세 설명
2. **액션 섹션**
    - 북마크 버튼 (로그인 필요)
    - 공유 버튼 (URL 복사)
3. **후기 섹션**
    - 후기 작성 버튼 (로그인 필요)
    - 후기 리스트
        - 작성자 정보
        - 별점
        - 내용
        - 이미지 (있을 경우)
        - 작성 날짜
        - 수정/삭제 버튼 (본인 후기만)

**데이터 소스**:

- API: 행사 기본 정보
- Firebase: 북마크 상태, 후기 데이터

**반응형**:

```
Mobile:   Full-width 세로 레이아웃
Desktop:  2단 레이아웃 (정보 | 후기)

```

---

### 3.2.3 마이페이지 (`/my-page`)

**목적**: 북마크한 행사 및 작성한 후기 관리

**인증**: 로그인 필요 (미로그인 시 로그인 페이지로 리다이렉트)

**탭 구조**:

**Tab 1: 북마크한 행사**

- 북마크 목록 (카드 그리드)
- 각 카드:
    - 행사 이미지, 제목, 날짜
    - 북마크 해제 버튼
    - 클릭 시 상세 페이지 이동
- 빈 상태: "북마크한 행사가 없습니다"

**Tab 2: 내가 쓴 후기**

- 후기 목록 (리스트)
- 각 후기:
    - 행사 제목
    - 별점, 내용 미리보기
    - 작성 날짜
    - 수정/삭제 버튼
- 수정 모달:
    - 별점 수정
    - 내용 수정
    - 이미지 추가/삭제
- 빈 상태: "작성한 후기가 없습니다"

**반응형**:

```
Mobile:   탭 전환, 1단 리스트
Desktop:  탭 전환, 2-3단 그리드 (북마크)

```

---

## 4. Firebase 데이터베이스 구조

### 4.1 Firestore Collections

```tsx
// users 컬렉션
{
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
}

// bookmarks 컬렉션 (CREATE, READ, DELETE)
{
  id: string;                     // auto-generated
  userId: string;                 // FK to users
  eventId: string;                // API 행사 ID
  eventTitle: string;             // 행사 제목 (캐싱)
  eventImage: string;             // 이미지 URL (캐싱)
  eventDate: string;              // 행사 날짜 (캐싱)
  category: string;               // 카테고리
  createdAt: Timestamp;
}

// reviews 컬렉션 (CREATE, READ, UPDATE, DELETE)
{
  id: string;                     // auto-generated
  userId: string;                 // FK to users
  userName: string;               // 작성자 이름 (캐싱)
  userPhoto?: string;             // 작성자 프로필 (캐싱)
  eventId: string;                // API 행사 ID
  eventTitle: string;             // 행사 제목 (캐싱)
  rating: number;                 // 1-5
  content: string;                // 후기 내용
  images?: string[];              // Storage URLs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

```

### 4.2 Firebase Storage 구조

```
/reviews/{reviewId}/image1.jpg
/reviews/{reviewId}/image2.jpg

```

---

## 5. CRUD 기능 상세

### 5.1 북마크 (Bookmarks Collection)

### CREATE - 북마크 추가

```tsx
const addBookmark = async (event) => {
  const bookmark = {
    userId: currentUser.uid,
    eventId: event.id,
    eventTitle: event.title,
    eventImage: event.image,
    eventDate: event.date,
    category: event.category,
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, 'bookmarks'), bookmark);
  toast.success('북마크에 추가되었습니다');
};

```

### READ - 북마크 목록 조회

```tsx
const getMyBookmarks = async () => {
  const q = query(
    collection(db, 'bookmarks'),
    where('userId', '==', currentUser.uid),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

```

### DELETE - 북마크 삭제

```tsx
const removeBookmark = async (bookmarkId) => {
  await deleteDoc(doc(db, 'bookmarks', bookmarkId));
  toast.success('북마크가 삭제되었습니다');
};

```

---

### 5.2 후기 (Reviews Collection)

### CREATE - 후기 작성

```tsx
const createReview = async (eventId, eventTitle, rating, content, images) => {
  // 1. 이미지 업로드 (있을 경우)
  const imageUrls = await uploadImages(images);

  // 2. 후기 문서 생성
  const review = {
    userId: currentUser.uid,
    userName: currentUser.displayName,
    userPhoto: currentUser.photoURL,
    eventId,
    eventTitle,
    rating,
    content,
    images: imageUrls,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'reviews'), review);
  toast.success('후기가 작성되었습니다');
};

```

### READ - 후기 목록 조회

```tsx
// 특정 행사의 후기
const getEventReviews = async (eventId) => {
  const q = query(
    collection(db, 'reviews'),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 내가 쓴 후기
const getMyReviews = async () => {
  const q = query(
    collection(db, 'reviews'),
    where('userId', '==', currentUser.uid),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

```

### UPDATE - 후기 수정

```tsx
const updateReview = async (reviewId, updates) => {
  const reviewRef = doc(db, 'reviews', reviewId);
  await updateDoc(reviewRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  toast.success('후기가 수정되었습니다');
};

```

### DELETE - 후기 삭제

```tsx
const deleteReview = async (reviewId, imageUrls) => {
  // 1. Storage 이미지 삭제
  if (imageUrls?.length) {
    await deleteImages(imageUrls);
  }

  // 2. Firestore 문서 삭제
  await deleteDoc(doc(db, 'reviews', reviewId));
  toast.success('후기가 삭제되었습니다');
};

```

---

## 6. UI/UX 디자인 가이드

### 6.1 컬러 팔레트

```css
/* Primary - 대구 테마 블루 */
--primary-500: #2563EB;
--primary-600: #1D4ED8;
--primary-700: #1E40AF;

/* Secondary - 포인트 컬러 */
--secondary-500: #F59E0B;
--secondary-600: #D97706;

/* Neutral */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-600: #4B5563;
--gray-900: #111827;

/* Semantic */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;

```

### 6.2 타이포그래피

```css
/* Font Family */
font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - 라벨 */
--text-sm: 0.875rem;     /* 14px - 본문 보조 */
--text-base: 1rem;       /* 16px - 본문 */
--text-lg: 1.125rem;     /* 18px - 소제목 */
--text-xl: 1.25rem;      /* 20px - 제목 */
--text-2xl: 1.5rem;      /* 24px - 큰 제목 */
--text-3xl: 1.875rem;    /* 30px - 헤더 */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

```

### 6.3 컴포넌트 스타일

### Header

```tsx
<header className="sticky top-0 z-50 bg-white border-b border-gray-200">
  <div className="container mx-auto px-4 h-16 flex items-center justify-between">
    <h1 className="text-2xl font-bold text-primary-600">DaeguCulture</h1>
    <nav className="flex items-center gap-4">
      {/* 언어 전환, 로그인 버튼 */}
    </nav>
  </div>
</header>

```

### Button

```tsx
// Primary Button
<button className="
  px-4 py-2
  bg-primary-500 hover:bg-primary-600
  text-white font-medium
  rounded-lg
  transition-colors duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
">
  버튼
</button>

// Secondary Button
<button className="
  px-4 py-2
  bg-white hover:bg-gray-50
  border border-gray-300
  text-gray-700 font-medium
  rounded-lg
  transition-colors duration-200
">
  버튼
</button>

// Icon Button (북마크)
<button className="
  p-2 rounded-full
  hover:bg-gray-100
  transition-colors
">
  <BookmarkIcon className={isBookmarked ? 'fill-primary-500' : 'fill-none'} />
</button>

```

### Event Card

```tsx
<div className="
  bg-white rounded-xl
  border border-gray-200
  overflow-hidden
  hover:shadow-lg hover:border-primary-200
  transition-all duration-200
  cursor-pointer
">
  {/* 이미지 */}
  <div className="relative aspect-[4/3] overflow-hidden">
    <img
      src={event.image}
      alt={event.title}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    <div className="absolute top-2 right-2">
      <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded">
        {event.category}
      </span>
    </div>
  </div>

  {/* 내용 */}
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
      {event.title}
    </h3>
    <p className="mt-2 text-sm text-gray-600">
      📅 {event.date}
    </p>
    <p className="text-sm text-gray-600">
      📍 {event.place}
    </p>
    <div className="mt-3 flex items-center justify-between">
      <span className="text-sm font-medium text-primary-600">
        {event.price}
      </span>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>💬 {reviewCount}</span>
        <span>🔖 {bookmarkCount}</span>
      </div>
    </div>
  </div>
</div>

```

### Input Field

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    라벨
  </label>
  <input
    type="text"
    className="
      w-full px-4 py-2
      border border-gray-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      placeholder:text-gray-400
      disabled:bg-gray-50 disabled:cursor-not-allowed
    "
    placeholder="입력하세요"
  />
</div>

```

### Filter Bar

```tsx
<div className="bg-white border-b border-gray-200 sticky top-16 z-40">
  <div className="container mx-auto px-4 py-4">
    <div className="flex flex-col md:flex-row gap-4">
      {/* 카테고리 */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(cat => (
          <button className={`
            px-4 py-2 rounded-lg whitespace-nowrap
            ${selected === cat
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}>
            {cat}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <div className="flex-1 max-w-md">
        <input
          type="search"
          placeholder="행사 검색..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  </div>
</div>

```

### Rating (별점)

```tsx
<div className="flex items-center gap-1">
  {[1, 2, 3, 4, 5].map(star => (
    <button
      key={star}
      onClick={() => setRating(star)}
      className="text-2xl transition-colors"
    >
      {star <= rating ? '⭐' : '☆'}
    </button>
  ))}
</div>

```

### 6.4 반응형 디자인

### 브레이크포인트

```jsx
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile Large
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large Desktop
    }
  }
}

```

### 반응형 그리드

```tsx
// 홈 페이지 행사 그리드
<div className="
  grid
  grid-cols-1           /* Mobile: 1단 */
  sm:grid-cols-2        /* Mobile Large: 2단 */
  lg:grid-cols-3        /* Desktop: 3단 */
  xl:grid-cols-4        /* Large Desktop: 4단 */
  gap-4 md:gap-6
">
  {events.map(event => <EventCard key={event.id} event={event} />)}
</div>

```

### 반응형 레이아웃 (상세 페이지)

```tsx
<div className="
  container mx-auto px-4 py-8
  grid
  grid-cols-1           /* Mobile: 세로 */
  lg:grid-cols-2        /* Desktop: 2단 */
  gap-8
">
  {/* 왼쪽: 행사 정보 */}
  <section>{/* ... */}</section>

  {/* 오른쪽: 후기 */}
  <section>{/* ... */}</section>
</div>

```

### 반응형 Header

```tsx
<header className="h-14 md:h-16">
  <div className="flex items-center justify-between">
    {/* 로고 */}
    <h1 className="text-xl md:text-2xl">DaeguCulture</h1>

    {/* 네비게이션 */}
    <nav className="flex items-center gap-2 md:gap-4">
      {/* 버튼들 */}
    </nav>
  </div>
</header>

```

---

## 7. 로딩 & 에러 & 빈 상태 처리

### 7.1 로딩 상태

### Skeleton Card (행사 카드 로딩)

```tsx
<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
  <div className="animate-pulse">
    {/* 이미지 영역 */}
    <div className="aspect-[4/3] bg-gray-200" />

    {/* 내용 영역 */}
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
</div>

```

### Spinner (전체 페이지 로딩)

```tsx
<div className="flex items-center justify-center min-h-[400px]">
  <div className="
    w-12 h-12
    border-4 border-gray-200 border-t-primary-500
    rounded-full
    animate-spin
  " />
</div>

```

### Button Loading State

```tsx
<button
  disabled={isLoading}
  className="px-4 py-2 bg-primary-500 text-white rounded-lg"
>
  {isLoading ? (
    <>
      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      처리 중...
    </>
  ) : (
    '저장'
  )}
</button>

```

### 7.2 에러 처리

### Toast 알림

```tsx
// 라이브러리: react-hot-toast
import toast from 'react-hot-toast';

// 성공
toast.success('북마크에 추가되었습니다', {
  duration: 3000,
  position: 'bottom-center',
});

// 에러
toast.error('로그인이 필요한 서비스입니다', {
  duration: 4000,
  position: 'bottom-center',
});

// 로딩
const toastId = toast.loading('처리 중...');
// ... 작업 완료 후
toast.success('완료되었습니다', { id: toastId });

```

### API 에러 처리

```tsx
const fetchEvents = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API 요청 실패');
    const data = await response.json();
    setEvents(data);
  } catch (error) {
    setError('행사 정보를 불러오는데 실패했습니다');
    toast.error('행사 정보를 불러올 수 없습니다');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

```

### Error Boundary

```tsx
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            오류가 발생했습니다
          </h1>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg"
          >
            홈으로 돌아가기
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

```

### 7.3 빈 상태 (Empty State)

### 검색 결과 없음

```tsx
{events.length === 0 && !loading && (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      검색 결과가 없습니다
    </h3>
    <p className="text-gray-600">
      다른 키워드로 검색해보세요
    </p>
  </div>
)}

```

### 북마크 없음

```tsx
{bookmarks.length === 0 && (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">📌</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      북마크한 행사가 없습니다
    </h3>
    <p className="text-gray-600 mb-4">
      관심있는 행사를 북마크해보세요
    </p>
    <button
      onClick={() => navigate('/')}
      className="px-4 py-2 bg-primary-500 text-white rounded-lg"
    >
      행사 둘러보기
    </button>
  </div>
)}

```

### 후기 없음

```tsx
{reviews.length === 0 && (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <div className="text-4xl mb-2">✍️</div>
    <p className="text-gray-600">
      아직 작성된 후기가 없습니다. 첫 후기를 남겨보세요!
    </p>
  </div>
)}

```

---

## 8. 다국어 (i18n)

### 8.1 구현

### 설정 파일

```tsx
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      // Navigation
      "nav.home": "홈",
      "nav.mypage": "마이페이지",
      "nav.login": "로그인",
      "nav.logout": "로그아웃",

      // Filter
      "filter.all": "전체",
      "filter.performance": "공연",
      "filter.exhibition": "전시",
      "filter.festival": "축제",
      "filter.search": "행사 검색...",

      // Buttons
      "button.bookmark": "북마크",
      "button.share": "공유",
      "button.writeReview": "후기 작성",
      "button.edit": "수정",
      "button.delete": "삭제",
      "button.submit": "제출",
      "button.cancel": "취소",

      // Labels
      "label.date": "날짜",
      "label.location": "장소",
      "label.price": "가격",
      "label.rating": "별점",

      // Messages
      "message.loginRequired": "로그인이 필요한 서비스입니다",
      "message.bookmarkAdded": "북마크에 추가되었습니다",
      "message.bookmarkRemoved": "북마크가 삭제되었습니다",
      "message.reviewSubmitted": "후기가 작성되었습니다",
      "message.noResults": "검색 결과가 없습니다",

      // Tabs
      "tab.bookmarks": "북마크",
      "tab.reviews": "내 후기",
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.mypage": "My Page",
      "nav.login": "Login",
      "nav.logout": "Logout",

      // Filter
      "filter.all": "All",
      "filter.performance": "Performance",
      "filter.exhibition": "Exhibition",
      "filter.festival": "Festival",
      "filter.search": "Search events...",

      // Buttons
      "button.bookmark": "Bookmark",
      "button.share": "Share",
      "button.writeReview": "Write Review",
      "button.edit": "Edit",
      "button.delete": "Delete",
      "button.submit": "Submit",
      "button.cancel": "Cancel",

      // Labels
      "label.date": "Date",
      "label.location": "Location",
      "label.price": "Price",
      "label.rating": "Rating",

      // Messages
      "message.loginRequired": "Login required",
      "message.bookmarkAdded": "Added to bookmarks",
      "message.bookmarkRemoved": "Removed from bookmarks",
      "message.reviewSubmitted": "Review submitted",
      "message.noResults": "No results found",

      // Tabs
      "tab.bookmarks": "Bookmarks",
      "tab.reviews": "My Reviews",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

```

### 사용 예시

```tsx
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <header>
      <h1>DaeguCulture</h1>
      <nav>
        <Link to="/">{t('nav.home')}</Link>
        <Link to="/my-page">{t('nav.mypage')}</Link>
        <button onClick={toggleLanguage}>
          {i18n.language === 'ko' ? '🇬🇧 EN' : '🇰🇷 KO'}
        </button>
      </nav>
    </header>
  );
};

```

### 8.2 번역 제외 항목

- Firebase에 저장된 데이터:
    - 행사 제목 (API 원본 데이터)
    - 후기 내용
    - 사용자 이름
    - 장소명

---

## 9. 프로젝트 구조

```
daegu-culture/
├── public/
├── src/
│   ├── assets/            # 이미지, 폰트
│   ├── components/        # 재사용 컴포넌트
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Spinner.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── event/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventGrid.tsx
│   │   │   └── FilterBar.tsx
│   │   └── review/
│   │       ├── ReviewCard.tsx
│   │       ├── ReviewForm.tsx
│   │       └── RatingInput.tsx
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── EventDetail.tsx
│   │   └── MyPage.tsx
│   ├── hooks/             # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   ├── useBookmarks.ts
│   │   └── useReviews.ts
│   ├── services/          # API & Firebase
│   │   ├── api.ts         # 공공데이터 API
│   │   ├── firebase.ts    # Firebase config
│   │   ├── auth.ts        # Authentication
│   │   └── firestore.ts   # Firestore CRUD
│   ├── types/             # TypeScript 타입
│   │   └── index.ts
│   ├── utils/             # 유틸리티 함수
│   │   └── helpers.ts
│   ├── i18n.ts            # 다국어 설정
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                   # 환경변수
├── .env.example
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.txt             # UI 스타일 가이드

```

---

## 10. README.txt (제출용 UI 가이드)

```
# DaeguCulture UI Style Guide

## 프로젝트 정보
- 프로젝트명: 대구 지역 문화행사 정보 플랫폼
- 기술스택: React 19 + TypeScript + Vite + Tailwind CSS 4 + Firebase

---

## 컬러 팔레트

Primary (메인 컬러)
- #2563EB - 주요 버튼, 링크, 강조
- #1D4ED8 - Hover 상태
- #1E40AF - Active 상태

Secondary (보조 컬러)
- #F59E0B - 포인트 컬러, 배지
- #D97706 - Hover 상태

Neutral (중립 컬러)
- #F9FAFB - 배경
- #F3F4F6 - 카드 배경
- #E5E7EB - 테두리
- #4B5563 - 부제목, 설명
- #111827 - 본문 텍스트

Status (상태 컬러)
- #10B981 - 성공 메시지
- #F59E0B - 경고 메시지
- #EF4444 - 에러 메시지

---

## 타이포그래피

Font Family
- Pretendard Variable (웹폰트)
- Fallback: system-ui, -apple-system, sans-serif

Font Sizes
- 12px - 라벨, 캡션
- 14px - 보조 텍스트
- 16px - 본문 (기본)
- 18px - 소제목
- 20px - 제목
- 24px - 큰 제목
- 30px - 페이지 헤더

Font Weights
- 400 - 본문
- 500 - 강조
- 600 - 소제목
- 700 - 제목

---

## 컴포넌트 스타일

Buttons
- Border Radius: 8px (rounded-lg)
- Padding: 16px 가로, 8px 세로
- Transition: 200ms
- Disabled: 50% opacity

Cards
- Border Radius: 12px (rounded-xl)
- Border: 1px solid #E5E7EB
- Shadow: hover 시 shadow-lg
- Transition: 200ms

Input Fields
- Border Radius: 8px (rounded-lg)
- Border: 1px solid #D1D5DB
- Focus: 2px ring, primary color
- Padding: 16px 가로, 8px 세로

---

## 반응형 브레이크포인트

Mobile: < 640px
- 1단 레이아웃
- Bottom sheet 필터
- 작은 패딩

Tablet: 640px ~ 1024px
- 2단 그리드
- 사이드 패널

Desktop: > 1024px
- 3-4단 그리드
- 전체 레이아웃

---

## 로딩 & 에러 상태

Loading
- Skeleton screens for cards
- Spinner for full page
- Button loading state with spinner

Error
- Toast notifications (react-hot-toast)
- Error boundary for fatal errors
- Inline error messages

Empty States
- Icon + Message + CTA button
- Centered layout

---

## 애니메이션

Transitions
- Color changes: 200ms
- Shadow changes: 200ms
- Transform: 200ms

Hover Effects
- Scale: 1.02
- Shadow increase
- Color change

---

## 접근성

- Semantic HTML tags
- Alt text for images
- ARIA labels for buttons
- Keyboard navigation support
- Focus visible styles

---

## 다크모드
현재 버전에서는 지원하지 않음 (추후 추가 예정)

```

---

## 11. 개발 우선순위

### Week 1: 기본 설정 & 홈 페이지

- [ ]  Vite + React + TypeScript 프로젝트 생성
- [ ]  Tailwind CSS 4 설정
- [ ]  Firebase 프로젝트 생성 및 연동
- [ ]  공공데이터 API 연동 테스트
- [ ]  홈 페이지 레이아웃
- [ ]  행사 카드 컴포넌트
- [ ]  카테고리 필터 구현

### Week 2: 상세 페이지 & 인증

- [ ]  Firebase Authentication 구현
- [ ]  행사 상세 페이지
- [ ]  북마크 기능 (CREATE, DELETE)
- [ ]  후기 작성 폼 (CREATE)
- [ ]  후기 목록 조회 (READ)

### Week 3: 마이페이지 & CRUD 완성

- [ ]  마이페이지 레이아웃
- [ ]  북마크 목록 (READ)
- [ ]  후기 수정 (UPDATE)
- [ ]  후기 삭제 (DELETE)
- [ ]  이미지 업로드 (Storage)

### Week 4: 다국어 & 최종 마무리

- [ ]  react-i18next 설정
- [ ]  모든 UI 텍스트 번역
- [ ]  반응형 디자인 점검
- [ ]  로딩/에러 처리 보완
- [ ]  성능 최적화
- [ ]  README.txt 작성
- [ ]  배포 (Vercel/Netlify)

---

## 12. 체크리스트 (요구사항 충족)

### 필수 요구사항

- [x]  Vite로 생성한 TypeScript 기반 React 프로젝트
- [x]  Node 버전 22 이상
- [x]  React 19, 함수형 컴포넌트와 훅 사용
- [x]  Tailwind CSS 4
- [x]  Tailwind CSS 반응형 디자인 (sm, md, lg)
- [x]  React Router 3페이지 이상 (`/`, `/events/:id`, `/my-page`)
- [x]  공공데이터 API 1개 이상 (공연/전시/축제 통합 사용)
- [x]  Firebase 백엔드
- [x]  CRUD 각 1개 이상:
    - Create: 북마크 추가, 후기 작성
    - Read: 북마크 목록, 후기 목록
    - Update: 후기 수정
    - Delete: 북마크 삭제, 후기 삭제
- [x]  다국어 (한국어 + 영어, DB 데이터 제외)
- [x]  UI 스타일 가이드 (README.txt)
- [x]  로딩/성공/오류 상태 안내

---

## 13. 환경변수 설정

```
# .env.example
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_PUBLIC_DATA_API_KEY=your_public_data_api_key

```

```bash
VITE_API_KEY=AIzaSyA36ZsJ6bsXnSUmtKK7MWd8BTzsE0bIE1M
VITE_AUTH_DOMAIN=react-class-8d6b4.firebaseapp.com
VITE_PROJECT_ID=react-class-8d6b4
VITE_STORAGE_BUCKET=react-class-8d6b4.firebasestorage.app
VITE_MESSAGE_SENDER_ID=822231387624
VITE_APP_ID=1:822231387624:web:714b6c020bac2b7e32e85d
```

---

이 PRD로 수행평가 요구사항 100% 충족 가능해. 필요한 컴포넌트나 코드 예시 더 필요하면 말해줘!