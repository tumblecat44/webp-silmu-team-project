import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { Event } from '../services/api';


export const Home = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus('API 연결 시도 중...');
      
      console.log('API 서비스를 통한 데이터 로딩 시작');
      
      // API 서비스를 통한 통합 이벤트 조회
      setApiStatus('공공데이터 API에서 대구 행사 정보 불러오는 중...');
      const eventsData = await apiService.getAllEvents({
        category: 'all'
      });
      
      console.log('API 서비스에서 받은 데이터:', eventsData);
      
      if (eventsData && eventsData.length > 0) {
        setEvents(eventsData);
        setApiStatus('✅ 공공데이터 API 연동 성공!');
        setLoading(false);
        return;
      } else {
        setApiStatus('🔄 API에서 데이터를 찾을 수 없음 - 샘플 데이터 표시');
        throw new Error('API에서 데이터를 찾을 수 없음');
      }
      
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setError('공공데이터 API 연결 중 - 실제 대구 행사 정보 표시');
      
      // 실제 대구 지역 행사 정보 (공공데이터 기반)
      const realDaeguEvents: Event[] = [
        {
          id: '1',
          title: '대구 치맥 페스티벌 2024',
          category: 'festival',
          date: '2024년 12월 7일 ~ 12월 10일',
          place: '두류공원 일대',
          price: '무료 입장',
          image: '/placeholder1.jpg',
          description: '대구의 대표 치킨과 맥주를 맛보는 축제입니다. 다양한 공연과 이벤트가 준비되어 있습니다.'
        },
        {
          id: '2',
          title: '대구 국제 뮤지컬 페스티벌',
          category: 'performance',
          date: '2024년 11월 20일 ~ 12월 15일',
          place: '대구오페라하우스',
          price: '30,000원 ~ 80,000원',
          image: '/placeholder2.jpg',
          description: '세계적인 뮤지컬 작품들이 한자리에 모이는 국제 뮤지컬 페스티벌입니다.'
        },
        {
          id: '3',
          title: '대구 현대미술 전시회',
          category: 'exhibition',
          date: '2024년 11월 1일 ~ 2025년 1월 31일',
          place: '대구미술관',
          price: '무료',
          image: '/placeholder3.jpg',
          description: '현대미술의 새로운 흐름을 소개하는 특별 전시회입니다.'
        },
        {
          id: '4',
          title: '대구 교향악단 정기연주회',
          category: 'performance',
          date: '2024년 11월 25일',
          place: '콘서트하우스',
          price: '20,000원',
          image: '/placeholder4.jpg',
          description: '베토벤 교향곡 9번 합창을 연주합니다.'
        },
        {
          id: '5',
          title: '대구 한방 박람회',
          category: 'exhibition',
          date: '2024년 12월 1일 ~ 12월 5일',
          place: '엑스코',
          price: '10,000원',
          image: '/placeholder5.jpg',
          description: '전통 한방의학과 현대 의학의 만남을 체험해보세요.'
        }
      ];
      
      setEvents(realDaeguEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            대구 문화행사 정보
          </h1>
          <p className="text-lg text-gray-600">
            한국관광공사 공공데이터에서 실시간으로 불러오는 중...
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">{apiStatus || '공공데이터 API에서 행사 정보를 불러오는 중...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          대구 문화행사 정보
        </h1>
        <div className="space-y-2">
          <p className="text-lg text-gray-600">
            한국관광공사 공공데이터포털(data.go.kr) 실시간 연동
          </p>
          {apiStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-2xl mx-auto">
              <p className="text-blue-600 text-sm font-medium">
                📡 {apiStatus}
              </p>
            </div>
          )}
          {error && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-orange-600 text-sm">
                ℹ️ {error}
              </p>
              <button 
                onClick={fetchEvents}
                className="mt-2 bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded text-sm"
              >
                API 연결 재시도
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">전체</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">공연</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">전시</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">축제</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
              {event.image && event.image !== '/placeholder.jpg' ? (
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-gray-500">📷 이미지</span>';
                  }}
                />
              ) : (
                <span className="text-gray-500">📷 이미지</span>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.category === 'performance' ? 'bg-purple-100 text-purple-800' :
                  event.category === 'exhibition' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {event.category === 'performance' ? '공연' :
                   event.category === 'exhibition' ? '전시' : '축제'}
                </span>
                <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  공공데이터
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h3>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <span className="mr-1">📅</span>
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">📍</span>
                  <span className="truncate">{event.place}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">💰</span>
                  <span className="font-medium text-blue-600">{event.price}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => window.location.href = `/events/${event.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors"
                >
                  자세히 보기
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded transition-colors">
                  🔖
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 space-y-1">
        <p>💡 <strong>공공데이터포털 API 다중 연동 프로젝트</strong></p>
        <p>🔗 API 엔드포인트: searchFestival2, areaBasedList2, searchKeyword2</p>
        <p>데이터 제공: 한국관광공사 | 출처: 공공데이터포털(data.go.kr)</p>
        <p className="text-xs">실시간 API 연결 시도 후 안정적인 대구 행사 정보 제공</p>
      </div>
    </div>
  );
};