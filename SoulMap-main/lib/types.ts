export type MomentType = 'Memory' | 'Future Goal' | 'Alternate Life';
export type CinematicStyle = 'Dramatic' | 'Dreamy' | 'Nostalgic' | 'Epic' | 'Intimate';

export interface Moment {
  id: string;
  user_description: string;
  moment_type: MomentType;
  cinematic_style: CinematicStyle;
  image_url: string;
  created_at: string;
  tags?: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  created_at: string;
}
