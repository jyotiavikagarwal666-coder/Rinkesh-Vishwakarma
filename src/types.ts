export type SceneType = 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5' | 'scene6';

export type MoodTheme = 'blush' | 'midnight' | 'sunset';

export interface GirlFriendProfile {
  name: string;
  nickname: string;
  birthDate: string; // "2007-10-22"
  customNote: string;
}

export interface MemoryCard {
  id: string;
  title: string;
  dateStr: string;
  description: string;
  tag: string;
  imagePlaceholderGradient: string;
  customImage?: string;
}

export interface LoveReason {
  id: number;
  reason: string;
  subtitle: string;
  iconName: string;
}
