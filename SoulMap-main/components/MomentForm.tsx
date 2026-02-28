'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { type MomentType, type CinematicStyle } from '@/lib/types';

const MOMENT_TYPES: { value: MomentType; label: string }[] = [
  { value: 'Memory', label: 'Memory' },
  { value: 'Future Goal', label: 'Future Goal' },
  { value: 'Alternate Life', label: 'Alternate Life' },
];

const CINEMATIC_STYLES: { value: CinematicStyle; label: string }[] = [
  { value: 'Dramatic', label: 'Dramatic' },
  { value: 'Dreamy', label: 'Dreamy' },
  { value: 'Nostalgic', label: 'Nostalgic' },
  { value: 'Epic', label: 'Epic' },
  { value: 'Intimate', label: 'Intimate' },
];

interface MomentFormProps {
  onGenerated: (moment: {
    description: string;
    momentType: MomentType;
    cinematicStyle: CinematicStyle;
    imageUrl: string;
  }) => void;
}

export function MomentForm({ onGenerated }: MomentFormProps) {
  const [description, setDescription] = useState('');
  const [momentType, setMomentType] = useState<MomentType>('Memory');
  const [cinematicStyle, setCinematicStyle] = useState<CinematicStyle>('Dramatic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isGenerating) return;

    setIsGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/generate-moment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          momentType,
          cinematicStyle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to generate image');
      }

      onGenerated({
        description: description.trim(),
        momentType,
        cinematicStyle,
        imageUrl: data.imageUrl,
      });

      setDescription('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const charCount = description.length;
  const maxChars = 500;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="professional-card rounded-xl p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Moment</h2>
          <p className="text-sm text-muted-foreground">Transform your thoughts into stunning visuals</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Description
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                placeholder="Describe a moment from your life in vivid detail..."
                rows={4}
                disabled={isGenerating}
                className="w-full rounded-lg bg-input border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 resize-none px-4 py-3 text-sm outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              />
              <span className="absolute bottom-3 right-4 text-xs text-muted-foreground">
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MOMENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => setMomentType(type.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      momentType === type.value
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Style
              </label>
              <div className="flex flex-wrap gap-2">
                {CINEMATIC_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => setCinematicStyle(style.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      cinematicStyle === style.value
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!description.trim() || isGenerating}
            className={`w-full flex items-center justify-center gap-2 rounded-lg px-6 py-4 text-sm font-semibold transition-all duration-300 transform
              ${
                isGenerating
                  ? 'bg-primary/20 border border-primary/30 text-primary cursor-wait'
                  : description.trim()
                  ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-secondary border border-border text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating your vision...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
