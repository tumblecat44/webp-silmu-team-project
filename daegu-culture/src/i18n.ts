import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      // Navigation
      'nav.home': '홈',
      'nav.mypage': '마이페이지',
      'nav.login': '로그인',
      'nav.logout': '로그아웃',

      // Categories
      'category.all': '전체',
      'category.performance': '공연',
      'category.exhibition': '전시',
      'category.festival': '축제',

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
      'nav.login': 'Login',
      'nav.logout': 'Logout',

      // Categories
      'category.all': 'All',
      'category.performance': 'Performance',
      'category.exhibition': 'Exhibition',
      'category.festival': 'Festival',

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