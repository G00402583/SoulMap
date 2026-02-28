import { type MomentType, type CinematicStyle } from '@/lib/types';

const TYPE_CLASSES: Record<MomentType, string> = {
  Memory: 'badge-memory',
  'Future Goal': 'badge-future',
  'Alternate Life': 'badge-alternate',
};

const STYLE_CLASSES: Record<CinematicStyle, string> = {
  Dramatic: 'badge-dramatic',
  Dreamy: 'badge-dreamy',
  Nostalgic: 'badge-nostalgic',
  Epic: 'badge-epic',
  Intimate: 'badge-intimate',
};

export function MomentTypeBadge({ type }: { type: MomentType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${TYPE_CLASSES[type]}`}
    >
      {type}
    </span>
  );
}

export function CinematicStyleBadge({ style }: { style: CinematicStyle }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLE_CLASSES[style]}`}
    >
      {style}
    </span>
  );
}
