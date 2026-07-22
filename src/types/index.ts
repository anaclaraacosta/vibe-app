export interface User {
  id: string;
  email: string;
  name?: string;
  archetype?: string;
  badges: string[];
  profileCompleted?: boolean;
  username?: string;
  bio?: string;
  gender?: string;
  birthDate?: string;
  location?: string;
  photoUrl?: string;
  mbti?: string | null;
  mbtiCompleted?: boolean;
  mbtiAnswers?: Record<number, string>;
  mbtiDetails?: {
    code: string;
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  } | null;
  recommendations?: RecommendationItem[];
  quizAnswers?: Record<number, string>;
  recommendationPool?: {
    peliculas: string[];
    series: string[];
    musica: string[];
    libros: string[];
    lugares: string[];
    ropa: string[];
  };
  recommendationIndex?: number;
  recommendationLastRotated?: number;
  feedbackHistory?: {
    liked: { id: string; category: string; title: string; archetype: string; timestamp: number }[];
    disliked: { id: string; category: string; title: string; archetype: string; timestamp: number }[];
  };
  likedCategories?: {
    musica: number;
    peliculas: number;
    series: number;
    libros: number;
    lugares: number;
    ropa: number;
  };
  astralCompatibility?: { name: string; description: string; tags: string[] };
  aestheticTaste?: { name: string; description: string; tags: string[] };
  enneagram?: { name: string; description: string; tags: string[] };
  temperament?: { name: string; description: string; tags: string[] };
}

export interface QuizOption {
  id: string;
  text: string;
  subtext?: string;
  icon?: string;
  mbtiValue?: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  weight?: number;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  category: string;
  options: QuizOption[];
  dimension?: 'EI' | 'SN' | 'TF' | 'JP';
}

export interface RecommendationItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'music' | 'cinema' | 'books' | 'fashion' | 'series' | 'destination';
  image?: string;
  icon?: string;
  isFavorite?: boolean;
  isViewed?: boolean;
  isDisliked?: boolean;
}

export interface MonthlyStats {
  monthName: string;
  daysActive: number;
  totalMinutes: number;
  topCategory: string;
  evolutionHistory: {
    month: string;
    archetype: string;
    icon: string;
  }[];
  breakdown: {
    category: string;
    percentage: number;
  }[];
}
