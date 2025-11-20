import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      // Navigation
      'nav.home': '홈',
      'nav.mypage': '마이페이지',
      'nav.reviews': '내 후기',
      'nav.login': '로그인',
      'nav.logout': '로그아웃',

      // Categories
      'category.all': '전체',
      'category.tourist': '관광지',
      'category.culture': '문화시설',
      'category.festival': '축제공연행사',
      'category.travel': '여행코스',

      // Filter
      'filter.all': '전체',
      'filter.ongoing': '진행중',
      'filter.upcoming': '예정',
      'filter.ended': '종료',
      'filter.searchPlaceholder': '행사 검색...',
      'filter.reset': '초기화',

      // Sort
      'sort.latest': '최신순',
      'sort.dateAsc': '날짜순',
      'sort.popular': '인기순',

      // Buttons
      'button.bookmark': '북마크',
      'button.addBookmark': '북마크 추가',
      'button.removeBookmark': '북마크 해제',
      'button.share': '공유',
      'button.writeReview': '후기 작성',
      'button.edit': '수정',
      'button.delete': '삭제',
      'button.submit': '제출',
      'button.cancel': '취소',
      'button.save': '저장',

      // Event
      'event.date': '행사 날짜',
      'event.location': '장소',
      'event.price': '가격',
      'event.freeAdmission': '무료',
      'event.description': '상세 정보',
      'event.status.ongoing': '진행중',
      'event.status.upcoming': '예정',
      'event.status.ended': '종료',

      // Review
      'review.title': '후기',
      'review.writeTitle': '후기 작성',
      'review.editTitle': '후기 수정',
      'review.deleteTitle': '후기 삭제',
      'review.deleteConfirm': '정말로 이 후기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      'review.rating': '별점',
      'review.content': '후기 내용',
      'review.images': '사진',
      'review.eventTitle': '행사',
      'review.edited': '수정됨',

      // Messages
      'message.loginRequired': '로그인이 필요한 서비스입니다',
      'message.bookmarkAdded': '북마크에 추가되었습니다',
      'message.bookmarkRemoved': '북마크가 삭제되었습니다',
      'message.reviewCreated': '후기가 작성되었습니다',
      'message.reviewUpdated': '후기가 수정되었습니다',
      'message.reviewDeleted': '후기가 삭제되었습니다',
      'message.shareSuccess': 'URL이 클립보드에 복사되었습니다',
      'message.shareError': '링크 복사에 실패했습니다',
      'message.error': '오류가 발생했습니다',
      'message.noResults': '검색 결과가 없습니다',

      // Empty states
      'empty.noEvents': '행사가 없습니다',
      'empty.noBookmarks': '북마크한 행사가 없습니다',
      'empty.noReviews': '작성한 후기가 없습니다',

      // Home page
      'home.title': '대구 문화행사 정보',
      'home.subtitle': '한국관광공사 공공데이터포털(data.go.kr) 실시간 연동',
      'home.loading': '공공데이터 API에서 행사 정보를 불러오는 중...',
      'home.loadingTitle': '한국관광공사 공공데이터에서 실시간으로 불러오는 중...',
      'home.retryButton': 'API 연결 재시도',
      'home.viewDetails': '자세히 보기',
      'home.imageAlt': '이미지',
      'home.dataSource': '공공데이터',
      'home.apiProject': '공공데이터포털 API 다중 연동 프로젝트',
      'home.apiEndpoints': 'API 엔드포인트: searchFestival2, areaBasedList2, searchKeyword2',
      'home.dataProvider': '데이터 제공: 한국관광공사 | 출처: 공공데이터포털(data.go.kr)',
      'home.apiDescription': '실시간 API 연결 시도 후 안정적인 대구 행사 정보 제공',

      // Event Detail page
      'eventDetail.loading': '행사 정보를 불러오는 중...',
      'eventDetail.notFound': '행사를 찾을 수 없습니다',
      'eventDetail.backToHome': '홈으로 돌아가기',
      'eventDetail.back': '뒤로가기',
      'eventDetail.detailInfo': '상세 정보',
      'eventDetail.date': '날짜',
      'eventDetail.location': '장소',
      'eventDetail.price': '가격',
      'eventDetail.contact': '연락처',
      'eventDetail.share': '공유하기',
      'eventDetail.reviewCount': '후기',
      'eventDetail.writeReview': '후기 작성',
      'eventDetail.reviewForm.title': '후기 작성',
      'eventDetail.reviewForm.rating': '평점',
      'eventDetail.reviewForm.content': '후기 내용 (최소 10자)',
      'eventDetail.reviewForm.contentPlaceholder': '행사에 대한 후기를 작성해주세요...',
      'eventDetail.reviewForm.images': '사진 첨부 (최대 3장)',
      'eventDetail.reviewForm.submit': '후기 등록',
      'eventDetail.reviewForm.cancel': '취소',
      'eventDetail.reviewForm.minLength': '최소 10자 필요',
      'eventDetail.noReviews.title': '아직 후기가 없습니다',
      'eventDetail.noReviews.subtitle': '이 행사에 대한 첫 번째 후기를 작성해보세요',
      'eventDetail.noReviews.loginRequired': '후기 작성을 하려면 로그인이 필요합니다',
      'eventDetail.reviewsLoading': '후기를 불러오는 중...',

      // Common
      'common.user': '사용자',

      // MyPage
      'myPage.title': '님',
      'myPage.loginRequired': '로그인이 필요합니다',
      'myPage.loginMessage': '후기 기능을 사용하려면 로그인해주세요',
      'myPage.myReviews': '내가 작성한 후기',
      'myPage.reviewsLoading': '후기 목록을 불러오는 중...',
      'myPage.noReviewsTitle': '작성한 후기가 없습니다',
      'myPage.noReviewsMessage': '다녀온 행사에 대한 후기를 작성해보세요',
      'myPage.browseEvents': '행사 둘러보기',
      'myPage.edited': '수정됨',
      'myPage.writtenOn': '작성일',

      // Footer
      'footer.description': '대구 지역의 문화행사 정보를 한 곳에서 확인하고 관리할 수 있는 플랫폼입니다.',
      'footer.links': '링크',
      'footer.kopis': '공연예술통합전산망',
      'footer.openData': '공공데이터포털',
      'footer.daegu': '대구광역시',
      'footer.techStack': '기술 스택',
      'footer.rights': '대구소프트웨어마이스터고등학교 웹프로그래밍 실무 수행평가 프로젝트',
    }
  },
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.mypage': 'My Page',
      'nav.reviews': 'My Reviews',
      'nav.login': 'Login',
      'nav.logout': 'Logout',

      // Categories
      'category.all': 'All',
      'category.tourist': 'Tourist Attractions',
      'category.culture': 'Cultural Facilities',
      'category.festival': 'Festivals & Events',
      'category.travel': 'Travel Courses',

      // Filter
      'filter.all': 'All',
      'filter.ongoing': 'Ongoing',
      'filter.upcoming': 'Upcoming',
      'filter.ended': 'Ended',
      'filter.searchPlaceholder': 'Search events...',
      'filter.reset': 'Reset',

      // Sort
      'sort.latest': 'Latest',
      'sort.dateAsc': 'Date',
      'sort.popular': 'Popular',

      // Buttons
      'button.bookmark': 'Bookmark',
      'button.addBookmark': 'Add Bookmark',
      'button.removeBookmark': 'Remove Bookmark',
      'button.share': 'Share',
      'button.writeReview': 'Write Review',
      'button.edit': 'Edit',
      'button.delete': 'Delete',
      'button.submit': 'Submit',
      'button.cancel': 'Cancel',
      'button.save': 'Save',

      // Event
      'event.date': 'Event Date',
      'event.location': 'Location',
      'event.price': 'Price',
      'event.freeAdmission': 'Free',
      'event.description': 'Description',
      'event.status.ongoing': 'Ongoing',
      'event.status.upcoming': 'Upcoming',
      'event.status.ended': 'Ended',

      // Review
      'review.title': 'Reviews',
      'review.writeTitle': 'Write Review',
      'review.editTitle': 'Edit Review',
      'review.deleteTitle': 'Delete Review',
      'review.deleteConfirm': 'Are you sure you want to delete this review? This action cannot be undone.',
      'review.rating': 'Rating',
      'review.content': 'Review Content',
      'review.images': 'Photos',
      'review.eventTitle': 'Event',
      'review.edited': 'Edited',

      // Messages
      'message.loginRequired': 'Login required',
      'message.bookmarkAdded': 'Added to bookmarks',
      'message.bookmarkRemoved': 'Removed from bookmarks',
      'message.reviewCreated': 'Review created',
      'message.reviewUpdated': 'Review updated',
      'message.reviewDeleted': 'Review deleted',
      'message.shareSuccess': 'URL copied to clipboard',
      'message.shareError': 'Failed to copy link',
      'message.error': 'An error occurred',
      'message.noResults': 'No results found',

      // Empty states
      'empty.noEvents': 'No events found',
      'empty.noBookmarks': 'No bookmarked events',
      'empty.noReviews': 'No reviews written',

      // Home page
      'home.title': 'Daegu Cultural Events',
      'home.subtitle': 'Real-time integration with Korea Tourism Organization Public Data Portal (data.go.kr)',
      'home.loading': 'Loading event information from Public Data API...',
      'home.loadingTitle': 'Loading real-time data from Korea Tourism Organization Public Data...',
      'home.retryButton': 'Retry API Connection',
      'home.viewDetails': 'View Details',
      'home.imageAlt': 'Image',
      'home.dataSource': 'Public Data',
      'home.apiProject': 'Public Data Portal Multiple API Integration Project',
      'home.apiEndpoints': 'API Endpoints: searchFestival2, areaBasedList2, searchKeyword2',
      'home.dataProvider': 'Data Provider: Korea Tourism Organization | Source: Public Data Portal (data.go.kr)',
      'home.apiDescription': 'Providing stable Daegu event information after real-time API connection attempts',

      // Event Detail page
      'eventDetail.loading': 'Loading event information...',
      'eventDetail.notFound': 'Event not found',
      'eventDetail.backToHome': 'Back to Home',
      'eventDetail.back': 'Back',
      'eventDetail.detailInfo': 'Details',
      'eventDetail.date': 'Date',
      'eventDetail.location': 'Location',
      'eventDetail.price': 'Price',
      'eventDetail.contact': 'Contact',
      'eventDetail.share': 'Share',
      'eventDetail.reviewCount': 'Reviews',
      'eventDetail.writeReview': 'Write Review',
      'eventDetail.reviewForm.title': 'Write Review',
      'eventDetail.reviewForm.rating': 'Rating',
      'eventDetail.reviewForm.content': 'Review Content (minimum 10 characters)',
      'eventDetail.reviewForm.contentPlaceholder': 'Please write your review about the event...',
      'eventDetail.reviewForm.images': 'Attach Photos (maximum 3 photos)',
      'eventDetail.reviewForm.submit': 'Submit Review',
      'eventDetail.reviewForm.cancel': 'Cancel',
      'eventDetail.reviewForm.minLength': 'Minimum 10 characters required',
      'eventDetail.noReviews.title': 'No reviews yet',
      'eventDetail.noReviews.subtitle': 'Be the first to write a review for this event',
      'eventDetail.noReviews.loginRequired': 'Login required to write a review',
      'eventDetail.reviewsLoading': 'Loading reviews...',

      // Common
      'common.user': 'User',

      // MyPage
      'myPage.title': '',
      'myPage.loginRequired': 'Login Required',
      'myPage.loginMessage': 'Please log in to use the review features',
      'myPage.myReviews': 'My Reviews',
      'myPage.reviewsLoading': 'Loading reviews...',
      'myPage.noReviewsTitle': 'No reviews written',
      'myPage.noReviewsMessage': 'Write reviews for events you\'ve attended',
      'myPage.browseEvents': 'Browse Events',
      'myPage.edited': 'Edited',
      'myPage.writtenOn': 'Written on',

      // Footer
      'footer.description': 'A platform to discover and manage cultural events in Daegu region.',
      'footer.links': 'Links',
      'footer.kopis': 'Korea Performing Arts Information System',
      'footer.openData': 'Public Data Portal',
      'footer.daegu': 'Daegu Metropolitan City',
      'footer.techStack': 'Tech Stack',
      'footer.rights': 'Daegu Software Meister High School Web Programming Performance Assessment Project',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;