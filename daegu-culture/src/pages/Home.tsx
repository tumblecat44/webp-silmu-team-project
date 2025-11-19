import { useTranslation } from 'react-i18next';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('nav.home', '홈')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            대구 지역의 다양한 문화행사를 만나보세요
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold mb-2">공연</h3>
              <p className="text-gray-600">뮤지컬, 연극, 콘서트 등 다양한 공연 정보</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">전시</h3>
              <p className="text-gray-600">미술관, 갤러리의 다양한 전시회 정보</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-4xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold mb-2">축제</h3>
              <p className="text-gray-600">지역 축제와 이벤트 정보</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};