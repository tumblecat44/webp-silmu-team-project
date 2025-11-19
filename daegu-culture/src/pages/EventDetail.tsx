import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Event {
  id: string;
  title: string;
  category: 'performance' | 'exhibition' | 'festival';
  date: string;
  startDate: string;
  endDate: string;
  place: string;
  price: string;
  image: string;
  description: string;
}

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Mock event data for now
    setTimeout(() => {
      setEvent({
        id: id,
        title: '샘플 행사',
        category: 'festival',
        date: '2024-01-01',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        place: '대구 시민공원',
        price: '무료',
        image: '/placeholder.jpg',
        description: '샘플 행사 설명입니다.'
      });
      setLoading(false);
    }, 1000);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">행사 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">행사를 찾을 수 없습니다</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">이미지</span>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {event.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {event.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">날짜</h3>
              <p className="text-gray-600">{event.date}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">장소</h3>
              <p className="text-gray-600">{event.place}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">가격</h3>
              <p className="text-gray-600">{event.price}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">설명</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              북마크
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
              공유
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};