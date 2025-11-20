import { API_ENDPOINTS, DAEGU_AREA_CODES, API_LIMITS } from '../utils/constants';
import type { Event } from '../types';

export interface APIEvent {
  contentid: string;
  title: string;
  contenttypeid: string;
  eventstartdate: string;
  eventenddate: string;
  addr1: string;
  firstimage: string;
  firstimage2: string;
  mapx: string;
  mapy: string;
  tel: string;
  overview: string;
  playtime: string;
  usetimefestival: string;
  agelimit: string;
  bookingplace: string;
  placeinfo: string;
  subevent: string;
  program: string;
  discountinfofestival: string;
  spendtimefestival: string;
  sponsor1: string;
  sponsor1tel: string;
  sponsor2: string;
  sponsor2tel: string;
}


class APIService {
  private readonly baseURL = API_ENDPOINTS.TOUR_API_BASE_URL;
  private readonly apiKey = import.meta.env.VITE_PUBLIC_DATA_API_KEY;
  
  constructor() {
    if (!this.apiKey) {
      console.error('VITE_PUBLIC_DATA_API_KEY is not defined');
    }
  }

  private async fetchWithRetry(url: string, retryCount = 0): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_LIMITS.TIMEOUT);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      if (retryCount < API_LIMITS.RETRY_COUNT) {
        console.warn(`API 요청 실패, 재시도 중... (${retryCount + 1}/${API_LIMITS.RETRY_COUNT})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.fetchWithRetry(url, retryCount + 1);
      }
      throw error;
    }
  }

  private buildURL(endpoint: string, params: Record<string, string>): string {
    const defaultParams = {
      serviceKey: this.apiKey,
      MobileOS: 'ETC',
      MobileApp: 'DaeguCulture',
      _type: 'json',
      numOfRows: '50',
      pageNo: '1',
      arrange: 'A', // 제목순
      areaCode: DAEGU_AREA_CODES.DAEGU_CITY,
    };

    const allParams = { ...defaultParams, ...params };
    const searchParams = new URLSearchParams(allParams);
    
    return `${this.baseURL}${endpoint}?${searchParams.toString()}`;
  }

  private transformAPIEvent(apiEvent: APIEvent, category: Event['category']): Event {
    const startDate = apiEvent.eventstartdate || '';
    const endDate = apiEvent.eventenddate || startDate;
    
    return {
      id: apiEvent.contentid,
      title: apiEvent.title || '제목 없음',
      category,
      date: this.formatDateRange(startDate, endDate),
      startDate,
      endDate,
      place: apiEvent.addr1 || '장소 미정',
      price: this.extractPrice(apiEvent.overview) || '가격 문의',
      image: apiEvent.firstimage || apiEvent.firstimage2 || '',
      description: this.cleanHTML(apiEvent.overview) || '상세 정보가 없습니다.',
      tel: apiEvent.tel,
      playtime: apiEvent.playtime,
      ageLimit: apiEvent.agelimit,
    };
  }

  private formatDateRange(start: string, end: string): string {
    if (!start) return '날짜 미정';
    
    const startFormatted = this.formatDate(start);
    
    if (!end || start === end) {
      return startFormatted;
    }
    
    const endFormatted = this.formatDate(end);
    return `${startFormatted} ~ ${endFormatted}`;
  }

  private formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}.${month}.${day}`;
  }

  private extractPrice(overview: string): string | null {
    if (!overview) return null;
    
    const pricePatterns = [
      /입장료[:\s]*([0-9,]+원)/i,
      /관람료[:\s]*([0-9,]+원)/i,
      /가격[:\s]*([0-9,]+원)/i,
      /요금[:\s]*([0-9,]+원)/i,
      /무료/i,
      /(\d{1,3}(,\d{3})*원)/g
    ];
    
    for (const pattern of pricePatterns) {
      const match = overview.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    
    return null;
  }

  private cleanHTML(html: string): string {
    if (!html) return '';
    
    return html
      .replace(/<[^>]*>/g, '') // HTML 태그 제거
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
  }

  // 행사/축제 정보 조회
  async getEvents(params?: {
    eventStartDate?: string;
    eventEndDate?: string;
    keyword?: string;
    contentTypeId?: string;
  }): Promise<Event[]> {
    try {
      const searchParams: Record<string, string> = {};
      
      if (params?.eventStartDate) {
        searchParams.eventStartDate = params.eventStartDate;
      }
      
      if (params?.eventEndDate) {
        searchParams.eventEndDate = params.eventEndDate;
      }
      
      if (params?.keyword) {
        searchParams.keyword = encodeURIComponent(params.keyword);
      }

      if (params?.contentTypeId) {
        searchParams.contentTypeId = params.contentTypeId;
      }

      const url = this.buildURL('/searchFestival2', searchParams);
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      
      if (data.response?.header?.resultCode !== '0000') {
        throw new Error(data.response?.header?.resultMsg || 'API 응답 오류');
      }
      
      const items = data.response?.body?.items?.item || [];
      const eventsArray = Array.isArray(items) ? items : [items];
      
      return eventsArray
        .filter((item: APIEvent) => item.contentid && item.title)
        .map((item: APIEvent) => this.transformAPIEvent(item, 'festival'));
        
    } catch (error) {
      console.info('일부 API 데이터 조회 실패 (다른 데이터 소스 사용 중):', error);
      throw new Error('행사 정보를 불러오는데 실패했습니다.');
    }
  }

  // 관광지 기반 리스트 조회 (공연장, 전시관 등)
  async getAreaBasedEvents(params?: {
    contentTypeId?: string;
    sigunguCode?: string;
    keyword?: string;
  }): Promise<Event[]> {
    try {
      const searchParams: Record<string, string> = {
        areaCode: '4', // 대구광역시 지역코드
        arrange: 'A' // 제목순 정렬
      };
      
      if (params?.contentTypeId) {
        searchParams.contentTypeId = params.contentTypeId;
      }
      
      if (params?.sigunguCode) {
        searchParams.sigunguCode = params.sigunguCode;
      }

      const url = this.buildURL('/areaBasedList2', searchParams);
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      
      if (data.response?.header?.resultCode !== '0000') {
        throw new Error(data.response?.header?.resultMsg || 'API 응답 오류');
      }
      
      const items = data.response?.body?.items?.item || [];
      const eventsArray = Array.isArray(items) ? items : [items];
      
      return eventsArray
        .filter((item: APIEvent) => item.contentid && item.title)
        .map((item: APIEvent) => {
          // 실제 API 응답의 contenttypeid 사용
          const actualContentTypeId = item.contenttypeid || params?.contentTypeId || '';
          const category = this.getContentTypeCategory(actualContentTypeId);
          return this.transformAPIEvent(item, category);
        });
        
    } catch (error) {
      console.info('일부 지역 기반 데이터 조회 실패 (다른 데이터 소스 사용 중):', error);
      throw new Error('지역 행사 정보를 불러오는데 실패했습니다.');
    }
  }

  // 키워드 검색
  async searchEvents(keyword: string, contentTypeId?: string): Promise<Event[]> {
    try {
      const searchParams: Record<string, string> = {
        keyword: encodeURIComponent(keyword),
      };
      
      if (contentTypeId) {
        searchParams.contentTypeId = contentTypeId;
      }

      const url = this.buildURL('/searchKeyword2', searchParams);
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      
      if (data.response?.header?.resultCode !== '0000') {
        throw new Error(data.response?.header?.resultMsg || 'API 응답 오류');
      }
      
      const items = data.response?.body?.items?.item || [];
      const eventsArray = Array.isArray(items) ? items : [items];
      
      return eventsArray
        .filter((item: APIEvent) => item.contentid && item.title)
        .map((item: APIEvent) => {
          // 실제 API 응답의 contenttypeid 사용 (하드코딩 제거)
          const actualContentTypeId = item.contenttypeid || contentTypeId || '';
          const category = this.getContentTypeCategory(actualContentTypeId);
          return this.transformAPIEvent(item, category);
        });
        
    } catch (error) {
      console.error('이벤트 검색 실패:', error);
      throw new Error('검색에 실패했습니다.');
    }
  }

  // 특정 이벤트 상세 정보 조회
  async getEventDetail(contentId: string): Promise<Event | null> {
    try {
      const url = this.buildURL('/detailCommon2', {
        contentId,
        defaultYN: 'Y',
        firstImageYN: 'Y',
        areacodeYN: 'Y',
        catcodeYN: 'Y',
        addrinfoYN: 'Y',
        mapinfoYN: 'Y',
        overviewYN: 'Y',
      });
      
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      
      if (data.response?.header?.resultCode !== '0000') {
        throw new Error(data.response?.header?.resultMsg || 'API 응답 오류');
      }
      
      const item = data.response?.body?.items?.item;
      if (!item) return null;
      
      const eventData = Array.isArray(item) ? item[0] : item;
      const category = this.getContentTypeCategory(eventData.contenttypeid || '');
      
      return this.transformAPIEvent(eventData, category);
      
    } catch (error) {
      console.info('이벤트 상세 데이터 조회 실패:', error);
      return null;
    }
  }

  private getContentTypeCategory(contentTypeId: string): Event['category'] {
    // 디버깅용 로그
    console.log('카테고리 매핑 - contentTypeId:', contentTypeId);
    
    // 문화행사 관련 콘텐츠 타입별 분류
    switch (contentTypeId) {
      case '12': // 관광지 (문화유적, 문화관광지)
        console.log('→ tourist로 매핑');
        return 'tourist';
      case '14': // 문화시설 (박물관, 미술관, 공연장)
        console.log('→ culture로 매핑');
        return 'culture';
      case '15': // 축제공연행사 (문화축제, 공연, 행사)
        console.log('→ festival로 매핑');
        return 'festival';
      case '25': // 여행코스 (문화탐방 코스)
        console.log('→ travel로 매핑');
        return 'travel';
      default:
        console.log('→ 기본값 festival로 매핑 (알 수 없는 contentTypeId)');
        return 'festival'; // 기본값
    }
  }

  // 통합 이벤트 조회 (문화행사 카테고리)
  async getAllEvents(params?: {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    category?: 'all' | 'tourist' | 'culture' | 'festival' | 'travel';
  }): Promise<Event[]> {
    try {
      const allEvents: Event[] = [];
      
      // 카테고리별 contentTypeId 매핑
      const categoryMapping = {
        tourist: ['12'], // 관광지
        culture: ['14'], // 문화시설  
        festival: ['15'], // 축제공연행사
        travel: ['25'], // 여행코스
        all: ['12', '14', '15', '25'] // 전체
      };
      
      // 요청된 카테고리에 따라 contentTypeId 결정
      const targetCategory = params?.category || 'all';
      const contentTypeIds = categoryMapping[targetCategory];
      
      // 각 contentTypeId별로 개별 API 호출
      for (const contentTypeId of contentTypeIds) {
        try {
          const events = await this.getAreaBasedEvents({
            contentTypeId,
            keyword: params?.keyword,
          });
          allEvents.push(...events);
        } catch (error) {
          console.info(`contentTypeId ${contentTypeId} 조회 실패 (다른 데이터는 정상):`, error);
        }
      }
      
      // 중복 제거 (contentId 기준)
      const uniqueEvents = allEvents.filter(
        (event, index, self) => 
          self.findIndex(e => e.id === event.id) === index
      );
      
      // 시작 날짜 기준 정렬
      return uniqueEvents.sort((a, b) => {
        if (a.startDate && b.startDate) {
          return a.startDate.localeCompare(b.startDate);
        }
        return 0;
      });
      
    } catch (error) {
      console.error('모든 데이터 소스 조회 실패:', error);
      throw new Error('행사 정보를 불러오는데 실패했습니다.');
    }
  }
}

export const apiService = new APIService();
export default apiService;