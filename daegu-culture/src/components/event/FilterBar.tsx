import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../common';
import { EventFilters } from '../../types';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_LABELS_EN } from '../../utils/constants';
import { debounce } from '../../utils/helpers';
import { cn } from '../../utils/cn';

interface FilterBarProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  className?: string;
}

export const FilterBar = ({ filters, onFiltersChange, className }: FilterBarProps) => {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState(filters.search);
  
  const categoryLabels = i18n.language === 'ko' ? CATEGORY_LABELS : CATEGORY_LABELS_EN;
  
  const categories = [
    { value: CATEGORIES.ALL, label: categoryLabels[CATEGORIES.ALL] },
    { value: CATEGORIES.PERFORMANCE, label: categoryLabels[CATEGORIES.PERFORMANCE] },
    { value: CATEGORIES.EXHIBITION, label: categoryLabels[CATEGORIES.EXHIBITION] },
    { value: CATEGORIES.FESTIVAL, label: categoryLabels[CATEGORIES.FESTIVAL] },
  ];
  
  const dateFilters = [
    { value: 'all', label: t('filter.all', '전체') },
    { value: 'ongoing', label: t('filter.ongoing', '진행중') },
    { value: 'upcoming', label: t('filter.upcoming', '예정') },
    { value: 'ended', label: t('filter.ended', '종료') },
  ];
  
  const sortOptions = [
    { value: 'latest', label: t('sort.latest', '최신순') },
    { value: 'date_asc', label: t('sort.dateAsc', '날짜순') },
    { value: 'popular', label: t('sort.popular', '인기순') },
  ];
  
  // 검색어 디바운스 처리
  const debouncedSearch = debounce((value: string) => {
    onFiltersChange({ ...filters, search: value });
  }, 300);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };
  
  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category as any });
  };
  
  const handleDateFilterChange = (dateFilter: string) => {
    onFiltersChange({ ...filters, dateFilter: dateFilter as any });
  };
  
  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as any });
  };
  
  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({
      category: 'all',
      search: '',
      dateFilter: undefined,
      sortBy: 'latest',
    });
  };
  
  return (
    <div className={cn('bg-white border-b border-gray-200 sticky top-16 z-40', className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* 상단: 검색 및 정렬 */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder={t('filter.searchPlaceholder', '행사 검색...')}
                value={searchValue}
                onChange={handleSearchChange}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            
            {/* 정렬 */}
            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy || 'latest'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {/* 필터 초기화 */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                {t('filter.reset', '초기화')}
              </Button>
            </div>
          </div>
          
          {/* 하단: 카테고리 및 날짜 필터 */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={filters.category === category.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category.value)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>
            
            {/* 날짜 필터 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {dateFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={filters.dateFilter === filter.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleDateFilterChange(filter.value === 'all' ? undefined : filter.value)}
                  className="whitespace-nowrap"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};