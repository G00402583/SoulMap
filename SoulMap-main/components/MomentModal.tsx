'use client';

import { X, Calendar, Download, Trash2 } from 'lucide-react';
import { type Moment } from '@/lib/types';
import { MomentTypeBadge, CinematicStyleBadge } from '@/components/MomentBadges';
import { formatDateLong } from '@/lib/formatDate';
import { AddToCollection } from '@/components/AddToCollection';
import { useEffect, useState } from 'react';

interface MomentModalProps {
  moment: Moment | null;
  onClose: () => void;
  onDelete?: (momentId: string) => void;
}

export function MomentModal({ moment, onClose, onDelete }: MomentModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!moment) {
      setIsDeleting(false);
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [moment, onClose]);

  const handleDelete = async () => {
    if (!moment || !onDelete || isDeleting) return;

    if (!confirm('Are you sure you want to delete this moment? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(moment.id);
    } catch (error) {
      console.error('Delete failed:', error);
      setIsDeleting(false);
    }
  };

  if (!moment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto professional-card rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 hover:border-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative overflow-hidden rounded-t-2xl bg-secondary aspect-video md:aspect-[16/9]">
          <img
            src={moment.image_url}
            alt={moment.user_description}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <MomentTypeBadge type={moment.moment_type} />
            <CinematicStyleBadge style={moment.cinematic_style} />
          </div>

          <p className="text-base text-foreground/90 leading-relaxed">
            {moment.user_description}
          </p>

          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDateLong(moment.created_at)}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <AddToCollection momentId={moment.id} />
              <a
                href={moment.image_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-secondary/80 border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20 hover:border-destructive/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
