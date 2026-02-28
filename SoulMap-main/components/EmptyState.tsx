'use client';

import { ImagePlus } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center shadow-lg">
          <ImagePlus className="w-9 h-9 text-primary" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-3">
        Your Journey Begins Here
      </h3>
      <p className="text-base text-muted-foreground/80 max-w-md leading-relaxed">
        Create your first cinematic moment by describing a memory, dream, or alternate life scenario above.
      </p>
    </div>
  );
}
