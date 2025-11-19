import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const MyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          마이페이지
        </h1>
        <p className="text-lg text-gray-600">
          로그인 후 이용 가능합니다
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">로그인이 필요한 페이지입니다</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};