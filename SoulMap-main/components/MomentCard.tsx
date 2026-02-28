'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import { type Moment } from '@/lib/types';
import { MomentTypeBadge, CinematicStyleBadge } from '@/components/MomentBadges';
import { formatDate } from '@/lib/formatDate';

interface MomentCardProps {
  moment: Moment;
  index: number;
  onClick: (moment: Moment) => void;
}

export function MomentCard({ moment, index, onClick }: MomentCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = Math.min(index * 50, 300);
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="animate-fade-in"
      style={{
        opacity: visible ? 1 : 0,
        animationDelay: visible ? '0ms' : '9999s',
      }}
    >
      <button
        onClick={() => onClick(moment)}
        className="w-full text-left professional-card rounded-xl overflow-hidden group cursor-pointer"
      >
        <div className="relative overflow-hidden aspect-video bg-secondary">
          <img
            src={moment.image_url}
            alt={moment.user_description}
            className="w-full h-full object-cover moment-image"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <MomentTypeBadge type={moment.moment_type} />
          </div>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-foreground/90 leading-relaxed line-clamp-2 group-hover:text-foreground transition-colors">
            {moment.user_description}
          </p>
          <div className="flex items-center justify-between text-xs">
            <CinematicStyleBadge style={moment.cinematic_style} />
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground/70 transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(moment.created_at)}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
