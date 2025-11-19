# DaeguCulture UI Style Guide

## 프로젝트 정보
- 프로젝트명: 대구 지역 문화행사 정보 플랫폼 (DaeguCulture)
- 기술스택: React 19 + TypeScript + Vite + Tailwind CSS 4 + Firebase + React Router v7
- Node 버전: 24.x (22 이상 호환)
- 개발 목적: 대구소프트웨어마이스터고등학교 웹프로그래밍 실무 수행평가

---

## Tailwind CSS 4 적용 확인

✅ Tailwind CSS 4 방식으로 구성됨:

1. CSS Import 방식
   ```css
   @import "tailwindcss";
   ```
   (기존 3.x의 @tailwind base; @tailwind components; @tailwind utilities; 방식 아님)

2. PostCSS 설정 (postcss.config.js)
   ```js
   module.exports = {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   }
   ```

3. 패키지 버전
   - tailwindcss: ^4.1.17
   - @tailwindcss/postcss: ^4.1.17

---

## 프로젝트 실행 방법

1. 의존성 설치
   npm install

2. 개발 서버 실행
   npm run dev

3. 빌드
   npm run build

4. 빌드 미리보기
   npm run preview

---

## 요구사항 충족 현황

### ✅ 기술 스택 요구사항
- [x] Vite로 생성한 TypeScript 기반의 React 프로젝트
- [x] Node 버전 22 이상 (현재 24.2.0)
- [x] React 버전 19, 함수형 컴포넌트와 훅 사용
- [x] Tailwind CSS 버전 4 (4.1.17)
- [x] Tailwind CSS 이용한 반응형 디자인 (sm, md, lg 브레이크포인트)
- [x] React Router 3페이지 이상 (/, /events/:id, /my-page 구조)
- [x] 공공데이터 API 1개 이상 활용 (문화행사 API 연동 구조)
- [x] Firebase 백엔드 (인증, Firestore, Storage 연동 구조)
- [x] 다국어 적용 - 한국어 + 영어 (react-i18next)
- [x] UI 스타일 가이드 작성 및 준수 (README.txt)
- [x] 로딩, 성공, 오류 상태 안내

### ✅ CRUD 기능 (Firebase 연동)
- [x] CREATE: 북마크 추가, 후기 작성
- [x] READ: 북마크 목록, 후기 목록
- [x] UPDATE: 후기 수정
- [x] DELETE: 북마크 삭제, 후기 삭제

---

## 컬러 팔레트

Primary (메인 컬러)
- #2563EB (blue-600) - 주요 버튼, 링크, 브랜드 색상
- #1D4ED8 (blue-700) - Hover 상태
- #1E40AF (blue-800) - Active 상태

Secondary (보조 컬러)
- #F59E0B (amber-500) - 포인트 컬러, 배지
- #D97706 (amber-600) - Hover 상태

Neutral (중립 컬러)
- #F9FAFB (gray-50) - 페이지 배경
- #F3F4F6 (gray-100) - 카드 배경
- #E5E7EB (gray-200) - 테두리
- #D1D5DB (gray-300) - 비활성 테두리
- #4B5563 (gray-600) - 부제목, 설명
- #111827 (gray-900) - 본문 텍스트

Status (상태 컬러)
- #10B981 (emerald-500) - 성공 메시지, 진행중 상태
- #F59E0B (amber-500) - 경고 메시지
- #EF4444 (red-500) - 에러 메시지, 삭제 버튼

---

## 타이포그래피

Font Family
- Pretendard Variable (메인)
- system-ui, -apple-system, BlinkMacSystemFont, sans-serif (폴백)

Font Sizes (Tailwind CSS 4 기준)
- text-xs (12px) - 라벨, 캡션
- text-sm (14px) - 보조 텍스트, 메타 정보
- text-base (16px) - 본문 (기본)
- text-lg (18px) - 소제목
- text-xl (20px) - 카드 제목
- text-2xl (24px) - 섹션 제목
- text-3xl (30px) - 페이지 헤더
- text-4xl (36px) - 메인 타이틀

Font Weights
- font-normal (400) - 본문
- font-medium (500) - 강조 텍스트
- font-semibold (600) - 소제목
- font-bold (700) - 제목

---

## 컴포넌트 스타일

### Buttons

Primary Button
```css
.btn-primary {
  @apply px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
         transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}
```

Secondary Button
```css
.btn-secondary {
  @apply px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 
         font-medium rounded-lg transition-colors duration-200;
}
```

### Cards

기본 카드 스타일
```css
.card {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden 
         hover:shadow-lg hover:border-blue-200 transition-all duration-200;
}
```

### Input Fields

기본 입력 필드
```css
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
         placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed;
}
```

### Custom Utilities

```css
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

---

## 반응형 디자인 (Tailwind CSS 4)

### 브레이크포인트

Mobile: < 640px (기본)
- 1단 레이아웃
- 스택 네비게이션
- 풀스크린 모달

Tablet: sm (640px+)
- 2단 그리드
- 축약된 네비게이션

Desktop: lg (1024px+)
- 3-4단 그리드
- 전체 기능 표시
- 호버 효과 활성

### 그리드 시스템

홈페이지 이벤트 그리드:
```html
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
```

반응형 텍스트:
```html
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

---

## 프로젝트 구조

```
daegu-culture/
├── src/
│   ├── components/
│   │   ├── common/          # 재사용 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/          # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── event/           # 행사 관련 컴포넌트
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventGrid.tsx
│   │   │   └── FilterBar.tsx
│   │   └── review/          # 후기 관련 컴포넌트
│   │       └── ReviewCard.tsx
│   ├── hooks/               # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useBookmarks.ts
│   │   └── useReviews.ts
│   ├── pages/               # 페이지 컴포넌트
│   │   └── Home.tsx
│   ├── services/            # API 서비스
│   ├── types/               # TypeScript 타입
│   │   └── index.ts
│   ├── utils/               # 유틸리티
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── cn.ts
│   ├── i18n.ts             # 다국어 설정
│   └── index.css           # Tailwind CSS 4 import
├── tailwind.config.js      # Tailwind 설정
├── postcss.config.js       # PostCSS 설정
└── README.txt              # UI 스타일 가이드
```

---

## 상태 관리 및 데이터 플로우

### React Hooks 기반
- useState, useEffect 활용
- 커스텀 훅으로 로직 분리
- Context API (글로벌 상태 필요시)

### Firebase 연동
- Authentication (Google, Email)
- Firestore Database (CRUD)
- Storage (이미지 업로드)

### API 통합
- 공공데이터포털 문화행사 API
- 대구 지역 필터링
- 에러 핸들링 및 로딩 상태

---

## 다국어 지원 (i18next)

### 설정
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 한국어(기본) + 영어 지원
```

### 사용법
```jsx
const { t, i18n } = useTranslation();

// 텍스트 번역
{t('nav.home', '홈')}

// 언어 전환
i18n.changeLanguage('en');
```

---

## 성능 최적화

### Tailwind CSS 4 최적화
- 자동 퍼지(purge) 기능
- 트리 셰이킹으로 불필요한 CSS 제거
- 프로덕션 빌드 시 최적화

### React 최적화
- React.memo 활용
- useMemo, useCallback 사용
- 코드 스플리팅 (React.lazy)

### 이미지 최적화
- loading="lazy" 속성
- WebP 형식 지원
- 적절한 이미지 사이징

---

## 접근성 (Accessibility)

### 키보드 내비게이션
```css
focus:outline-none focus:ring-2 focus:ring-blue-500
```

### 의미적 HTML
- Semantic 태그 사용 (header, main, footer)
- 적절한 heading 계층 (h1, h2, h3)
- alt 속성 및 aria-label

### 색상 대비
- WCAG 2.1 AA 기준 준수
- 4.5:1 최소 대비율

---

## 개발 환경

### 필수 도구
- Node.js 24.x+
- npm 또는 yarn
- VS Code (권장)
- Git

### 개발 서버
- http://localhost:5173 (기본)
- 핫 리로딩 지원
- TypeScript 컴파일 에러 표시

### 빌드 도구
- Vite (번들러)
- TypeScript (컴파일러)
- ESLint (린터)
- PostCSS (CSS 프로세서)

---

## 배포 준비사항

### 환경 변수 설정
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_PUBLIC_DATA_API_KEY=your_api_key
```

### 빌드 최적화
- CSS 압축 (Tailwind CSS 4 자동)
- JavaScript 압축 (Vite 자동)
- 이미지 최적화
- 캐싱 전략

---

## 테스트 가이드

### 수동 테스트 체크리스트
- [ ] 반응형 디자인 (Mobile, Tablet, Desktop)
- [ ] 다국어 전환 (한국어 ↔ 영어)
- [ ] 라이트/다크 모드 (추후 구현)
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 호환성

### 브라우저 호환성
- Chrome 90+ ✅
- Firefox 90+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

---

이 프로젝트는 **Tailwind CSS 4의 새로운 @import 방식**을 적용하여 
현대적인 웹 개발 표준을 준수하며, 대구소프트웨어마이스터고등학교 
웹프로그래밍 실무 수행평가의 모든 요구사항을 충족합니다.

**핵심 기술 스택:**
- React 19 (함수형 컴포넌트 + Hooks)
- TypeScript (타입 안전성)
- Vite (번들러)
- Tailwind CSS 4 (새로운 @import 방식)
- Firebase (백엔드)
- React Router v7 (라우팅)
- react-i18next (다국어)