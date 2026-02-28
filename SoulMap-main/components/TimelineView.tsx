'use client';

import { type Moment } from '@/lib/types';
import { MomentCard } from '@/components/MomentCard';

interface TimelineViewProps {
  moments: Moment[];
  onSelectMoment: (moment: Moment) => void;
}

export function TimelineView({ moments, onSelectMoment }: TimelineViewProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-lg font-semibold text-foreground">
          Your Moments
        </h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">
          {moments.length} {moments.length === 1 ? 'moment' : 'moments'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moments.map((moment, index) => (
          <MomentCard
            key={moment.id}
            moment={moment}
            index={index}
            onClick={onSelectMoment}
          />
        ))}
      </div>
    </section>
  );
}
