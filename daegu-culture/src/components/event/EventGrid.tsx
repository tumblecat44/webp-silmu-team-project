import { Event } from '../../types';
import { EventCard } from './EventCard';
import { SkeletonCard, EmptyState } from '../common';
import { cn } from '../../utils/cn';

interface EventGridProps {
  events: Event[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EventGrid = ({
  events,
  isLoading = false,
  emptyMessage = '행사가 없습니다',
  emptyAction,
  className
}: EventGridProps) => {
  if (isLoading) {
    return (
      <div className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
        className
      )}>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyMessage}
        description="다른 조건으로 검색해보세요"
        actionLabel={emptyAction?.label}
        onAction={emptyAction?.onClick}
        className={className}
      />
    );
  }
  
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
      className
    )}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );
};