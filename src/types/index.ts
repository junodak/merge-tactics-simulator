// 언어 타입 정의 - Language
export type Language = 'ko' | 'en';

// 유닛 스탯 정보 타입
export interface StarStat {
  stat_name: string;
  values: (string | number)[];
}

// 유닛 타입 - Troops
export interface Troop {
  name: string;
  origin_trait: string; // 출신 특성 - Origin Traits
  role_trait: string;   // 역할 특성 - Role Traits
  description: string;
  image: string;
  elixir: number;
  star_stats: StarStat[];
}

// 특성 효과 타입 - Traits Effects
export interface TraitEffect {
  count: number;
  effect: string;
}

// 특성 타입 - Traits
export interface Trait {
  name: string;
  type: string;
  troops: string[];
  description: string;
  effects: TraitEffect[];
  image: string;
}

// 엘릭서 타입
export interface Elixir {
  elixir: number;
  color: string;
  image: string;
} 