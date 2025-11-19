import { cn } from '../../utils/cn';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard = ({ className }: SkeletonCardProps) => {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 overflow-hidden', className)}>
      <div className="animate-pulse">
        {/* 이미지 영역 */}
        <div className="aspect-[4/3] bg-gray-200" />
        
        {/* 내용 영역 */}
        <div className="p-4 space-y-3">
          {/* 제목 */}
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          
          {/* 날짜 */}
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          
          {/* 장소 */}
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          
          {/* 하단 정보 */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="flex gap-2">
              <div className="h-4 bg-gray-200 rounded w-8" />
              <div className="h-4 bg-gray-200 rounded w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};