import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { Event } from '../types';


export const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus('API 연결 시도 중...');
      
      console.log('API 서비스를 통한 데이터 로딩 시작');
      
      // API 서비스를 통한 통합 이벤트 조회 - 모든 카테고리 데이터를 한번에 로딩
      setApiStatus('공공데이터 API에서 대구 행사 정보 불러오는 중...');
      const eventsData = await apiService.getAllEvents({
        category: 'all'
      });
      
      console.log('API 서비스에서 받은 데이터:', eventsData);
      
      if (eventsData && eventsData.length > 0) {
        setAllEvents(eventsData);
        setFilteredEvents(eventsData);
        setApiStatus('✅ 공공데이터 API 연동 성공!');
        setLoading(false);
        return;
      } else {
        setApiStatus('🔄 API에서 데이터를 찾을 수 없음 - 샘플 데이터 표시');
        throw new Error('API에서 데이터를 찾을 수 없음');
      }
      
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setError('API 연결 실패 - 데이터를 불러올 수 없습니다');
      
      // API 실패 시 빈 배열
      setAllEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // 클라이언트 사이드 카테고리 필터링 함수
  const filterEvents = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredEvents(allEvents);
      return;
    }
    
    // 카테고리별 매핑
    const categoryMapping: Record<string, Event['category'][]> = {
      tourist: ['tourist'],
      culture: ['culture'],  
      festival: ['festival'],
      travel: ['travel']
    };
    
    const targetCategories = categoryMapping[category];
    if (!targetCategories) {
      setFilteredEvents(allEvents);
      return;
    }
    
    const filtered = allEvents.filter(event => 
      targetCategories.includes(event.category)
    );
    
    setFilteredEvents(filtered);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('home.loadingTitle')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">{t('home.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('home.subtitle')}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: t('category.all') },
            { id: 'tourist', label: t('category.tourist') },
            { id: 'culture', label: t('category.culture') },
            { id: 'festival', label: t('category.festival') },
            { id: 'travel', label: t('category.travel') },
          ].map(category => (
            <button 
              key={category.id}
              onClick={() => filterEvents(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            onClick={() => navigate(`/events/${event.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
          >
            <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
              {event.image && event.image !== '/placeholder.jpg' ? (
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-gray-500">📷 ${t('home.imageAlt')}</span>`;
                  }}
                />
              ) : (
                <span className="text-gray-500">📷 {t('home.imageAlt')}</span>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.category === 'tourist' ? 'bg-blue-100 text-blue-800' :
                  event.category === 'culture' ? 'bg-green-100 text-green-800' :
                  event.category === 'festival' ? 'bg-purple-100 text-purple-800' :
                  event.category === 'travel' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.category === 'tourist' ? t('category.tourist') :
                   event.category === 'culture' ? t('category.culture') :
                   event.category === 'festival' ? t('category.festival') :
                   event.category === 'travel' ? t('category.travel') :
                   t('category.festival')}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h3>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="mr-1">📍</span>
                  <span className="truncate">{event.place}</span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/events/${event.id}`);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors"
              >
  {t('home.viewDetails')}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};