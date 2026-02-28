'use client';

import { Images, Folder, Clock } from 'lucide-react';
import { type Moment } from '@/lib/types';

interface StatsBarProps {
  moments: Moment[];
  collectionsCount: number;
}

export function StatsBar({ moments, collectionsCount }: StatsBarProps) {
  const recentCount = moments.filter((m) => {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(m.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceCreation <= 7;
  }).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-6 shadow-lg border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
              <Images className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-0.5">{moments.length}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Moments</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-lg border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
              <Folder className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-0.5">{collectionsCount}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Collections</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-lg border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-0.5">{recentCount}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">This Week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
