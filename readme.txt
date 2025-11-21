================================================================================
                    대구 문화 행사 웹 애플리케이션
                       UI 스타일 가이드 문서
================================================================================

작성일: 2025-11-21
프로젝트: 대구 문화 행사 정보 플랫폼
기술 스택: React 19 + TypeScript + Tailwind CSS 4


================================================================================
1. 컬러 팔렛트 (Color Palette)
================================================================================

■ 주요 브랜드 색상 (Primary Colors)
  - Primary:
    * blue-600 (#2563EB) - 주요 CTA, 로고
    * blue-500 (#3B82F6) - 버튼, 배지
    * blue-700 (#1D4ED8) - 호버 상태
    * blue-800 (#1E40AF) - 액티브 상태

  - Primary Semantic:
    * primary-500 - Button, Badge 등에서 참조
    * primary-600 - 호버 상태

■ 배경색 (Background Colors)
  - Body: #F9FAFB (gray-50)
  - Card: #FFFFFF (white)
  - Secondary Button: gray-100 (#F3F4F6)
  - Disabled: gray-50 (#F9FAFB)

■ 텍스트 색상 (Text Colors)
  - Primary Text: gray-900 (#111827)
  - Secondary Text: gray-700 (#374151)
  - Tertiary Text: gray-600 (#4B5563)
  - Placeholder: gray-400 (#9CA3AF)

■ 상태 색상 (Status Colors)
  - 성공 (Success):
    * green-100 (#DCFCE7) - 배경
    * green-800 (#166534) - 텍스트

  - 경고 (Warning):
    * yellow-100 (#FEF3C7) - 배경
    * yellow-800 (#854D0E) - 텍스트

  - 오류 (Error):
    * red-100 (#FEE2E2) - 배경
    * red-500 (#EF4444) - 버튼, 경고
    * red-600 (#DC2626) - 호버
    * red-800 (#991B1B) - 텍스트

  - 진행중 (Ongoing):
    * green-100/green-800 - 이벤트 상태

■ 경계선 색상 (Border Colors)
  - Default: gray-200 (#E5E7EB)
  - Hover: gray-300 (#D1D5DB)
  - Focus: primary-500 (blue-500)
  - Error: red-300 (#FCA5A5)


================================================================================
2. 타이포그래피 (Typography)
================================================================================

■ 폰트 패밀리 (Font Family)
  - 주 폰트: 'Pretendard Variable'
  - 웹 폰트: Google Fonts 사용
  - 폴백: -apple-system, BlinkMacSystemFont, system-ui, sans-serif

■ 폰트 웨이트 (Font Weights)
  - Regular: 400 - 본문 텍스트
  - Medium: 500 - 라벨, 강조 텍스트
  - Semibold: 600 - 소제목, 버튼
  - Bold: 700 - 대제목

■ 폰트 크기 (Font Sizes)
  - text-xs: 0.75rem (12px)
  - text-sm: 0.875rem (14px)
  - text-base: 1rem (16px) - 기본
  - text-lg: 1.125rem (18px)
  - text-xl: 1.25rem (20px)
  - text-2xl: 1.5rem (24px)
  - text-3xl: 1.875rem (30px)

■ 라인 높이 (Line Height)
  - 기본: 1.5
  - 타이틀: 1.2 (권장)
  - 본문: 1.6 (권장)


================================================================================
3. 버튼 스타일 (Button Styles)
================================================================================

■ 버튼 Variants

  [Primary Button]
  - 배경: primary-500
  - 호버: primary-600
  - 텍스트: white
  - 사용처: 주요 액션 (로그인, 제출, 생성)

  [Secondary Button]
  - 배경: gray-100
  - 호버: gray-200
  - 텍스트: gray-900
  - 사용처: 보조 액션 (취소, 이전)

  [Outline Button]
  - 배경: white
  - 테두리: gray-300
  - 호버: gray-50
  - 텍스트: gray-700
  - 사용처: 선택적 액션

  [Ghost Button]
  - 배경: transparent
  - 호버: gray-100
  - 텍스트: gray-700
  - 사용처: 최소한의 강조

  [Danger Button]
  - 배경: red-500
  - 호버: red-600
  - 텍스트: white
  - 사용처: 삭제, 파괴적 액션

■ 버튼 크기 (Sizes)
  - Small (sm): px-3 py-1.5, text-sm
  - Medium (md): px-4 py-2, text-base [기본]
  - Large (lg): px-6 py-3, text-lg

■ 버튼 상태
  - 기본: 위 variant 색상
  - 호버: hover:bg-{color}
  - 포커스: focus:ring-2 focus:ring-offset-2
  - 비활성화: opacity-50, cursor-not-allowed
  - 로딩: SVG 스피너 + disabled

■ 공통 속성
  - 모서리: rounded-lg (8px)
  - 전환: transition-colors duration-200
  - 폰트: font-medium


================================================================================
4. 입력 필드 스타일 (Input Field Styles)
================================================================================

■ 기본 Input
  - 배경: white
  - 테두리: gray-300 (1px)
  - 패딩: px-4 py-2
  - 모서리: rounded-lg
  - 포커스: ring-2 ring-primary-500

■ Input 상태
  - 기본: border-gray-300
  - 포커스: focus:ring-2 focus:ring-primary-500
  - 에러: border-red-300, focus:ring-red-500
  - 비활성화: bg-gray-50, cursor-not-allowed

■ Label
  - 크기: text-sm
  - 폰트: font-medium
  - 색상: text-gray-700

■ 에러 메시지
  - 크기: text-sm
  - 색상: text-red-600
  - 위치: input 아래

■ Hint 텍스트
  - 크기: text-sm
  - 색상: text-gray-600
  - 위치: input 아래

■ Placeholder
  - 색상: text-gray-400

■ 아이콘 포함 Input
  - 아이콘 크기: h-5 w-5
  - 아이콘 색상: text-gray-400
  - 왼쪽 패딩: pl-10 (아이콘 있을 때)


================================================================================
5. 카드 스타일 (Card Styles)
================================================================================

■ 기본 Card
  - 배경: white
  - 테두리: border border-gray-200
  - 모서리: rounded-xl (12px)
  - 오버플로우: overflow-hidden

■ 호버 상태 Card
  - 그림자: hover:shadow-lg
  - 테두리: hover:border-primary-200
  - 전환: transition-all duration-200
  - 커서: cursor-pointer

■ 사용 사례
  - EventCard: 이벤트 목록
  - ReviewCard: 리뷰 카드
  - 정보 표시 영역


================================================================================
6. 배지 스타일 (Badge Styles)
================================================================================

■ Badge Variants
  - default: bg-gray-100, text-gray-800
  - primary: bg-primary-500, text-white
  - secondary: bg-secondary-500, text-white
  - success: bg-green-100, text-green-800
  - warning: bg-yellow-100, text-yellow-800
  - error: bg-red-100, text-red-800

■ Badge 크기
  - Small (sm): px-2 py-1, text-xs
  - Medium (md): px-2.5 py-1.5, text-sm [기본]
  - Large (lg): px-3 py-2, text-base

■ 특징
  - 모서리: rounded-full 또는 rounded-md
  - 폰트: font-medium


================================================================================
7. 모달 스타일 (Modal Styles)
================================================================================

■ 백드롭 (Backdrop)
  - 배경: bg-black bg-opacity-50
  - 위치: fixed inset-0
  - z-index: z-50

■ 모달 컨테이너
  - 배경: white
  - 모서리: rounded-xl
  - 그림자: shadow-xl
  - 너비: w-full (최대 제약 있음)

■ 모달 섹션
  - 헤더: p-6, border-b border-gray-200
  - 본문: p-6
  - 푸터: p-6, border-t border-gray-200 (선택)


================================================================================
8. 간격 및 레이아웃 (Spacing & Layout)
================================================================================

■ 기본 간격 (Base Spacing)
  - space-1: 0.25rem (4px)
  - space-2: 0.5rem (8px)
  - space-4: 1rem (16px)
  - space-6: 1.5rem (24px)
  - space-8: 2rem (32px)

■ 컨테이너 패딩
  - 모바일: px-4
  - 데스크탑: px-6 ~ px-8

■ 섹션 간격
  - 작은 간격: space-y-2
  - 중간 간격: space-y-4
  - 큰 간격: space-y-6

■ 그리드 간격
  - 카드 그리드: gap-4 ~ gap-6


================================================================================
9. 상호작용 스타일 (Interactive States)
================================================================================

■ 호버 (Hover)
  - 버튼: hover:bg-{color-darker}
  - 카드: hover:shadow-lg, hover:border-primary-200
  - 링크: hover:text-blue-700
  - 전환: transition-colors duration-200

■ 포커스 (Focus)
  - Ring: focus:ring-2 focus:ring-offset-2
  - 색상: focus:ring-primary-500
  - Outline: focus:outline-none

■ 비활성화 (Disabled)
  - 투명도: opacity-50
  - 커서: cursor-not-allowed
  - 배경: bg-gray-50 (input)

■ 로딩 (Loading)
  - 스피너: animate-spin
  - 버튼: disabled 상태 + 스피너
  - 텍스트: "로딩 중..." 또는 "처리 중..."


================================================================================
10. 애니메이션 및 전환 (Animations & Transitions)
================================================================================

■ 전환 시간
  - 빠름: duration-100 (100ms)
  - 기본: duration-200 (200ms)
  - 느림: duration-300 (300ms)

■ 전환 속성
  - 색상: transition-colors
  - 전체: transition-all
  - 변형: transition-transform

■ 애니메이션
  - 스피너: animate-spin
  - 페이드인: animate-fadeIn (커스텀)
  - 슬라이드: animate-slideIn (커스텀)


================================================================================
11. 반응형 디자인 (Responsive Design)
================================================================================

■ 브레이크포인트 (Tailwind 기본값)
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

■ 사용 예시
  - 모바일: 기본 스타일
  - 태블릿: md:grid-cols-2
  - 데스크탑: lg:grid-cols-3


================================================================================
12. 그림자 (Shadows)
================================================================================

■ 그림자 레벨
  - shadow-sm: 작은 그림자 (기본 카드)
  - shadow: 중간 그림자
  - shadow-md: 중간-큰 그림자
  - shadow-lg: 큰 그림자 (호버 카드)
  - shadow-xl: 매우 큰 그림자 (모달)


================================================================================
13. 기타 유틸리티 클래스 (Utility Classes)
================================================================================

■ 텍스트 자르기
  - line-clamp-2: 2줄 자르기 + 말줄임표
  - line-clamp-3: 3줄 자르기 + 말줄임표

■ 스크롤바 숨김
  - body, html에 적용됨
  - scrollbar-width: none (Firefox)
  - ::-webkit-scrollbar { display: none } (Chrome/Safari)


================================================================================
14. 접근성 가이드라인 (Accessibility Guidelines)
================================================================================

■ 색상 대비
  - 텍스트: 최소 4.5:1 대비율
  - 큰 텍스트: 최소 3:1 대비율
  - UI 요소: 최소 3:1 대비율

■ 포커스 인디케이터
  - 모든 인터랙티브 요소에 focus:ring 적용
  - 키보드 네비게이션 지원

■ 버튼 라벨
  - 명확한 텍스트 제공
  - 아이콘만 있을 경우 aria-label 추가

■ 이미지 대체 텍스트
  - 모든 이미지에 alt 속성 필수


================================================================================
15. 사용 예시 (Usage Examples)
================================================================================

■ Primary Button
```tsx
<Button variant="primary" size="md">
  저장하기
</Button>
```

■ Input with Label
```tsx
<Input
  label="이메일"
  type="email"
  placeholder="example@email.com"
  error={errors.email}
/>
```

■ Card with Hover
```tsx
<Card hover className="p-6">
  {/* 카드 내용 */}
</Card>
```

■ Badge
```tsx
<Badge variant="success" size="sm">
  진행중
</Badge>
```


================================================================================
16. 로딩/성공/오류 상태 처리 (Status Handling)
================================================================================

■ 로딩 상태
  - 버튼: isLoading prop 사용 + 스피너 표시
  - 페이지: Spinner 컴포넌트 또는 SkeletonCard 사용
  - 텍스트: "로딩 중..." 메시지

■ 성공 상태
  - Toast 메시지: toast.success("작업이 완료되었습니다")
  - 색상: green-500 계열
  - 아이콘: 체크마크

■ 오류 상태
  - Toast 메시지: toast.error("오류가 발생했습니다")
  - Input: border-red-300 + 에러 메시지 표시
  - 색상: red-500 계열
  - 아이콘: X 또는 느낌표

■ Toast 라이브러리
  - 사용: react-hot-toast
  - 위치: 화면 상단 중앙 권장
  - 지속시간: 3-5초


================================================================================
17. 구현 파일 위치 (Implementation Files)
================================================================================

■ 컴포넌트
  - Button: src/components/common/Button.tsx
  - Input: src/components/common/Input.tsx
  - Card: src/components/common/Card.tsx
  - Badge: src/components/common/Badge.tsx
  - Modal: src/components/common/Modal.tsx
  - Spinner: src/components/common/Spinner.tsx

■ 스타일
  - Tailwind Config: tailwind.config.js
  - 전역 CSS: src/index.css

■ 유틸리티
  - 클래스 병합: src/utils/cn.ts


================================================================================
18. 개발 팁 (Development Tips)
================================================================================

■ 일관성 유지
  - 새 컴포넌트는 기존 스타일 가이드 준수
  - 색상은 정의된 팔렛트만 사용
  - 임의의 값 사용 지양 (예: w-[123px])

■ 재사용성
  - 공통 컴포넌트 활용 (Button, Input 등)
  - variant, size prop 활용
  - cn() 함수로 클래스 병합

■ 성능
  - Tailwind의 JIT 모드 활용
  - 사용하지 않는 클래스 자동 제거
  - 프로덕션 빌드 시 최적화

■ 유지보수
  - 컴포넌트 단위로 스타일 캡슐화
  - @layer 활용해 커스텀 클래스 정의
  - 문서화된 가이드 참조


================================================================================
19. 주요 의존성 (Dependencies)
================================================================================

- React: 19.x
- TypeScript: 5.x
- Tailwind CSS: 4.x
- react-hot-toast: 최신 버전
- Google Fonts: Pretendard Variable


================================================================================
20. 문의 및 업데이트 (Contact & Updates)
================================================================================

본 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.
스타일 가이드 관련 문의사항이나 제안사항이 있으면 팀에 공유해주세요.

마지막 업데이트: 2025-11-21

================================================================================
