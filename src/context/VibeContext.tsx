import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, QuizQuestion, RecommendationItem, MonthlyStats } from '../types';
import { VIBE_QUESTIONS } from '../data/vibeQuestions';
import { MBTI_QUESTIONS, calculateMbtiType } from '../data/mbtiQuestions';
import { MBTI_PROFILES } from '../data/mbtiDetails';
import { generateDynamicRecommendations, enrichSingleRecommendationSet } from '../services/recommendationService';

interface VibeContextType {
  // Authentication & Profile State
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  registerUser: (email: string, password?: string) => { success: boolean; error?: string };
  updateUserArchetype: (archetype: string) => void;
  updateUserProfile: (profileData: Partial<User>) => void;

  // Onboarding Quiz State (Original VIBE)
  currentQuestionIndex: number;
  answers: Record<number, string>;
  quizQuestions: QuizQuestion[];
  selectAnswer: (questionId: number, optionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  resetQuiz: () => void;
  personality: string;
  recommendations: RecommendationItem[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  generateProfileResults: () => Promise<void>;
  isGeneratingResults: boolean;
  isGeneratingRecs: boolean;

  // Optional MBTI Test State
  mbtiCurrentQuestionIndex: number;
  mbtiAnswers: Record<number, string>;
  mbtiQuestions: QuizQuestion[];
  mbtiSelectAnswer: (questionId: number, optionId: string) => void;
  mbtiNextQuestion: () => void;
  mbtiPrevQuestion: () => void;
  mbtiResetQuiz: () => void;
  mbtiPersonality: string;
  mbtiCompleted: boolean;
  generateMbtiResults: () => Promise<void>;
  mbtiIsGeneratingResults: boolean;

  statsData: MonthlyStats;
  badgeDescriptions: Record<string, { title: string; description: string; icon: string }>;
  toggleLikeRecommendation: (id: string, category: string, title: string) => void;
  toggleDislikeRecommendation: (id: string, category: string, title: string) => void;
  getFeedbackStats: () => { totalLikes: number; totalDislikes: number; likedCategories: Record<string, number> };
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

// Base recommendation lists to avoid duplication
const RECS_INTROSPECTIVO: RecommendationItem[] = [
  { id: "rec1", title: "Phoebe Bridgers", subtitle: "Motion Sickness · Folk", category: "music" },
  { id: "rec2", title: "Eternal Sunshine", subtitle: "Michel Gondry · Drama", category: "cinema" },
  { id: "rec3", title: "Normal People", subtitle: "Sally Rooney · Romance", category: "series" },
  { id: "rec4", title: "Year of Rest & Relaxation", subtitle: "Ottessa Moshfegh · Novela", category: "books" },
  { id: "rec5", title: "Outfit Minimalista de Invierno", subtitle: "Abrigo, suéter, sastrero, botas y bufanda", category: "fashion", image: "/outfits/winter.png" },
  { id: "rec6", title: "Bariloche (Bosques)", subtitle: "Patagonia · Montaña", category: "destination" }
];

const RECS_BOHEMIO: RecommendationItem[] = [
  { id: "rec11", title: "Devendra Banhart", subtitle: "Mi Negrita · Freak Folk", category: "music" },
  { id: "rec12", title: "Amélie", subtitle: "Jean-Pierre Jeunet · Comedia", category: "cinema" },
  { id: "rec13", title: "Fleabag", subtitle: "Phoebe Waller-Bridge · Comedia", category: "series" },
  { id: "rec14", title: "Rayuela", subtitle: "Julio Cortázar · Clásico", category: "books" },
  { id: "rec15", title: "Outfit Bohemio de Verano", subtitle: "Camisa estampada, bermuda y sandalias", category: "fashion", image: "/outfits/summer.png" },
  { id: "rec16", title: "Montevideo (Ciudad Vieja)", subtitle: "Paseo costero y cafés", category: "destination" }
];

const RECS_CURADOR: RecommendationItem[] = [
  { id: "rec21", title: "Fred again..", subtitle: "Delilah (pull me out of this)", category: "music" },
  { id: "rec22", title: "Blade Runner 2049", subtitle: "Denis Villeneuve · Sci-Fi", category: "cinema" },
  { id: "rec23", title: "Succession", subtitle: "Jesse Armstrong · Drama", category: "series" },
  { id: "rec24", title: "Sapiens", subtitle: "Yuval Noah Harari · Ensayo", category: "books" },
  { id: "rec25", title: "Outfit Urbano Techwear", subtitle: "Campera técnica, cargo, sneakers y beanie", category: "fashion", image: "/outfits/techwear.png" },
  { id: "rec26", title: "Tokio (Shibuya)", subtitle: "Tecnología y Neón", category: "destination" }
];

export const RECOMMENDATIONS_DB: Record<string, RecommendationItem[]> = {
  "Melómano Introspectivo": RECS_INTROSPECTIVO,
  "Bohemio Ecléctico": RECS_BOHEMIO,
  "Curador Urbano Moderno": RECS_CURADOR
};

// Mock Badge Descriptions
const BADGE_DESCRIPTIONS = {
  "Indie": { title: "Espíritu Indie", description: "Buscador de sonidos independientes y estéticas auténticas.", icon: "music" },
  "Cinephile": { title: "Mirada Crítica", description: "Capaz de apreciar la fotografía y el ritmo narrativo.", icon: "film" },
  "Cozy": { title: "Modo Coziness", description: "Amante del confort, del café caliente y los buzos oversize.", icon: "home" },
  "Explorer": { title: "Alma Exploradora", description: "Buscador de nuevos paisajes y rincones históricos solitarios.", icon: "compass" }
};

export const ARCHETYPE_DETAILS: Record<string, { description: string; badges: string[] }> = {
  "Melómano Introspectivo": {
    description: "Tenés un fuerte apego por las narrativas profundas y estéticas melancólicas. Te rodeás de ambientes cálidos y valorás el arte independiente en todas sus expresiones.",
    badges: ["Indie", "Cozy", "Cinephile"]
  },
  "Bohemio Ecléctico": {
    description: "Te apasiona la variedad, los clásicos de culto y la mixtura de estilos. Disfrutás de paseos culturales urbanos y conversaciones existenciales con buena música de fondo.",
    badges: ["Indie", "Explorer", "Cinephile"]
  },
  "Curador Urbano Moderno": {
    description: "Tu ritmo es rápido, dinámico y estéticamente pulido. Te atraen los neones, el diseño vanguardista y las tendencias tecnológicas combinadas con un gusto de curaduría selecto.",
    badges: ["Explorer", "Cozy", "Cinephile"]
  }
};

export function VibeProvider({ children }: { children: React.ReactNode }) {
  // Authentication state initialized from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('vibe_current_user');
  });
  const [user, setUser] = useState<User | null>(() => {
    const session = localStorage.getItem('vibe_current_user');
    return session ? JSON.parse(session) : null;
  });

  // Onboarding Quiz state (Original VIBE)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const session = localStorage.getItem('vibe_current_user');
    if (session) {
      const u = JSON.parse(session);
      return u.quizAnswers || {};
    }
    return {};
  });

  // VIBE archetype state
  const [personality, setPersonality] = useState<string>(() => {
    const session = localStorage.getItem('vibe_current_user');
    if (session) {
      const u = JSON.parse(session);
      return u.archetype || "";
    }
    return "";
  });
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(() => {
    const session = localStorage.getItem('vibe_current_user');
    if (session) {
      const u = JSON.parse(session);
      return u.recommendations || [];
    }
    return [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const session = localStorage.getItem('vibe_current_user');
    if (session) {
      const u = JSON.parse(session);
      return u.favorites || [];
    }
    return [];
  });
  const [isGeneratingResults, setIsGeneratingResults] = useState<boolean>(false);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState<boolean>(false);

  // Optional MBTI Test state
  const [mbtiCurrentQuestionIndex, setMbtiCurrentQuestionIndex] = useState<number>(0);
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, string>>(() => {
    const session = localStorage.getItem('vibe_current_user');
    if (session) {
      const u = JSON.parse(session);
      return u.mbtiAnswers || {};
    }
    return {};
  });
  const [mbtiPersonality, setMbtiPersonality] = useState<string>(() => {
    const session = localStorage.getItem('vibe_current_user');
    if (session) {
      const u = JSON.parse(session);
      return u.mbti || "";
    }
    return "";
  });
  const [mbtiCompleted, setMbtiCompleted] = useState<boolean>(() => {
    const session = localStorage.getItem('vibe_current_user');
    if (session) {
      const u = JSON.parse(session);
      return u.mbtiCompleted || false;
    }
    return false;
  });
  const [mbtiIsGeneratingResults, setMbtiIsGeneratingResults] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const checkAndGenerateRecs = async () => {
      if (!user) return;
      const poolExpired = user.recommendationLastRotated ? (Date.now() - user.recommendationLastRotated > 7 * 24 * 60 * 60 * 1000) : false;
      const needsRecs = !user.recommendations || user.recommendations.length === 0 || !user.recommendationPool || poolExpired;

      if (isAuthenticated && user?.profileCompleted && needsRecs) {
        setIsGeneratingRecs(true);
        try {
          const generatedRecs = await generateDynamicRecommendations(user);
          if (generatedRecs && generatedRecs.length > 0 && active) {
            if (import.meta.env.DEV) {
              console.log("--- RECOMENDACIONES GENERADAS POR PRIMERA VEZ O EXPIRADAS ---");
              console.log("Current user ID:", user.id);
              console.log("Whether recommendations were loaded from storage or newly generated: newly generated");
              console.log("Number of stored recommendations:", generatedRecs.length);
            }
            const updatedUser = { 
              ...user, 
              recommendations: generatedRecs,
              recommendationPool: user.recommendationPool,
              recommendationIndex: user.recommendationIndex,
              recommendationLastRotated: user.recommendationLastRotated
            };
            setUser(updatedUser);
            setRecommendations(generatedRecs);
            localStorage.setItem('vibe_current_user', JSON.stringify(updatedUser));
            
            const registeredUsersJson = localStorage.getItem('vibe_registered_users');
            if (registeredUsersJson) {
              const registeredUsers = JSON.parse(registeredUsersJson);
              const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
              if (idx !== -1) {
                registeredUsers[idx] = { 
                  ...registeredUsers[idx], 
                  recommendations: generatedRecs,
                  recommendationPool: user.recommendationPool,
                  recommendationIndex: user.recommendationIndex,
                  recommendationLastRotated: user.recommendationLastRotated
                };
                localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));
              }
            }
          }
        } catch (error) {
          console.error("Auto generation of recommendations failed:", error);
        } finally {
          setIsGeneratingRecs(false);
        }
      }
    };

    checkAndGenerateRecs();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id, user?.profileCompleted, user?.recommendations?.length, user?.recommendationLastRotated]);

  // Rotation effect (checks every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated || !user?.profileCompleted || !user.recommendationPool) {
      return;
    }

    const intervalId = setInterval(async () => {
      const activeSession = localStorage.getItem('vibe_current_user');
      if (!activeSession) return;
      const currentUser = JSON.parse(activeSession);

      if (!currentUser.recommendationPool) return;

      const now = Date.now();
      const lastRotated = currentUser.recommendationLastRotated || 0;
      const rotationThreshold = 10 * 60 * 1000; // 10 minutes

      if (now - lastRotated >= rotationThreshold) {
        try {
          const currentIndex = currentUser.recommendationIndex !== undefined ? currentUser.recommendationIndex : 0;
          const nextIndex = (currentIndex + 1) % 12;
          const archetype = currentUser.archetype || "Melómano Introspectivo";

          if (import.meta.env.DEV) {
            console.log(`--- INICIANDO ROTACIÓN DE RECOMENDACIONES ---`);
            console.log(`Current Index: ${currentIndex} -> Next Index: ${nextIndex}`);
            console.log(`Pool items to enrich next:`, {
              pelicula: currentUser.recommendationPool.peliculas[nextIndex],
              serie: currentUser.recommendationPool.series[nextIndex],
              musica: currentUser.recommendationPool.musica[nextIndex],
              libro: currentUser.recommendationPool.libros[nextIndex],
              lugar: currentUser.recommendationPool.lugares[nextIndex],
              ropa: currentUser.recommendationPool.ropa[nextIndex]
            });
          }

          const newlyEnriched = await enrichSingleRecommendationSet(
            currentUser.recommendationPool,
            nextIndex,
            archetype
          );

          const updatedUser = {
            ...currentUser,
            recommendationIndex: nextIndex,
            recommendationLastRotated: now,
            recommendations: newlyEnriched
          };

          setUser(updatedUser);
          setRecommendations(newlyEnriched);
          localStorage.setItem('vibe_current_user', JSON.stringify(updatedUser));

          const registeredUsersJson = localStorage.getItem('vibe_registered_users');
          if (registeredUsersJson) {
            const registeredUsers = JSON.parse(registeredUsersJson);
            const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === currentUser.email.toLowerCase());
            if (idx !== -1) {
              registeredUsers[idx] = updatedUser;
              localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));
            }
          }

          if (import.meta.env.DEV) {
            console.log(`--- ROTACIÓN COMPLETADA CON ÉXITO ---`);
            console.log(`New Display Items:`, newlyEnriched);
          }
        } catch (error) {
          console.error("Failed to rotate recommendations:", error);
        }
      }
    }, 300000); // 5 minutes

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, user?.id, user?.profileCompleted, user?.recommendationPool]);

  // Dynamic Stats Data based on user archetype
  const currentArchetype = user?.archetype || personality || "Melómano Introspectivo";
  const currentMonth = new Date().toLocaleDateString('es-AR', { month: 'long' });
  const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  let evolutionIcon = "heart";
  if (currentArchetype === "Curador Urbano Moderno") {
    evolutionIcon = "zap";
  } else if (currentArchetype === "Bohemio Ecléctico") {
    evolutionIcon = "coffee";
  }

  const statsData: MonthlyStats = {
    monthName: capitalizedMonth,
    daysActive: 23,
    totalMinutes: 1420,
    topCategory: "Música",
    evolutionHistory: [
      { month: "Abril", archetype: "Bohemio Ecléctico", icon: "coffee" },
      { month: "Mayo", archetype: "Curador Urbano Moderno", icon: "zap" },
      { month: capitalizedMonth, archetype: currentArchetype, icon: evolutionIcon }
    ],
    breakdown: [
      { category: "Música", percentage: 45 },
      { category: "Cine", percentage: 25 },
      { category: "Ropa", percentage: 18 },
      { category: "Libros", percentage: 12 }
    ]
  };

  const validateEmail = (emailStr: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  };

  // Auth Operations
  const login = (email: string, password?: string): any => {
    if (!email || !password) {
      return { success: false, error: "Todos los campos son requeridos." };
    }
    if (!validateEmail(email)) {
      return { success: false, error: "Formato de correo electrónico inválido." };
    }

    const registeredUsersJson = localStorage.getItem('vibe_registered_users');
    const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];

    const foundUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser || foundUser.password !== password) {
      return { success: false, error: "Credenciales inválidas. Verificá tu correo y contraseña." };
    }

    const { password: _, ...sessionUser } = foundUser;

    localStorage.setItem('vibe_current_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    setIsAuthenticated(true);

    if (sessionUser.archetype) {
      setPersonality(sessionUser.archetype);
      setRecommendations(sessionUser.recommendations || RECOMMENDATIONS_DB[sessionUser.archetype] || []);
    } else {
      setPersonality("");
      setRecommendations([]);
    }
    if (sessionUser.quizAnswers) {
      setAnswers(sessionUser.quizAnswers);
    } else {
      setAnswers({});
    }
    if (sessionUser.favorites) {
      setFavorites(sessionUser.favorites);
    } else {
      setFavorites([]);
    }

    // Restore MBTI details
    if (sessionUser.mbti) {
      setMbtiPersonality(sessionUser.mbti);
      setMbtiCompleted(sessionUser.mbtiCompleted || false);
    } else {
      setMbtiPersonality("");
      setMbtiCompleted(false);
    }
    if (sessionUser.mbtiAnswers) {
      setMbtiAnswers(sessionUser.mbtiAnswers);
    } else {
      setMbtiAnswers({});
    }

    if (import.meta.env.DEV) {
      console.log("--- INICIO DE SESIÓN DE USUARIO ---");
      console.log("Current user ID:", sessionUser.id);
      const hasStoredRecs = !!(sessionUser.recommendations && sessionUser.recommendations.length > 0);
      console.log("Whether recommendations were loaded from storage or newly generated:", hasStoredRecs ? "loaded from storage" : "newly generated (empty)");
      console.log("Number of stored recommendations:", sessionUser.recommendations ? sessionUser.recommendations.length : 0);
    }

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('vibe_current_user');
    sessionStorage.removeItem('vibe_loading_shown');
    setIsAuthenticated(false);
    setUser(null);
    setAnswers({});
    setPersonality("");
    setRecommendations([]);
    setFavorites([]);

    // Clear MBTI state
    setMbtiPersonality("");
    setMbtiCompleted(false);
    setMbtiAnswers({});
    setMbtiCurrentQuestionIndex(0);
  };

  const registerUser = (email: string, password?: string): any => {
    if (!email || !password) {
      return { success: false, error: "Todos los campos son requeridos." };
    }
    if (!validateEmail(email)) {
      return { success: false, error: "Formato de correo electrónico inválido." };
    }
    if (password.length < 6) {
      return { success: false, error: "La contraseña debe tener al menos 6 caracteres." };
    }

    const registeredUsersJson = localStorage.getItem('vibe_registered_users');
    const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];

    const exists = registeredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: "El correo electrónico ya está registrado." };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      badges: [],
      profileCompleted: false,
      mbti: null,
      mbtiCompleted: false,
      mbtiAnswers: {},
      mbtiDetails: null
    };

    const fullUserToSave = {
      ...newUser,
      password,
      quizAnswers: {},
      recommendations: [],
      history: [],
      favorites: []
    };

    registeredUsers.push(fullUserToSave);
    localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));
    localStorage.setItem('vibe_current_user', JSON.stringify(newUser));

    setUser(newUser);
    setIsAuthenticated(true);
    setAnswers({});
    setPersonality("");
    setRecommendations([]);

    // Reset MBTI
    setMbtiPersonality("");
    setMbtiCompleted(false);
    setMbtiAnswers({});

    return { success: true };
  };

  const updateUserArchetype = (archetype: string) => {
    if (user) {
      const updated = { ...user, archetype };
      setUser(updated);
      localStorage.setItem('vibe_current_user', JSON.stringify(updated));

      const registeredUsersJson = localStorage.getItem('vibe_registered_users');
      if (registeredUsersJson) {
        const registeredUsers = JSON.parse(registeredUsersJson);
        const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
        if (idx !== -1) {
          registeredUsers[idx] = { ...registeredUsers[idx], archetype };
          localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));
        }
      }
    }
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('vibe_current_user', JSON.stringify(updated));

      const registeredUsersJson = localStorage.getItem('vibe_registered_users');
      if (registeredUsersJson) {
        const registeredUsers = JSON.parse(registeredUsersJson);
        const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
        if (idx !== -1) {
          registeredUsers[idx] = { ...registeredUsers[idx], ...profileData };
          localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));
        }
      }
    }
  };

  // VIBE Quiz Operations
  const selectAnswer = (questionId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < VIBE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  // MBTI Quiz Operations
  const mbtiSelectAnswer = (questionId: number, optionId: string) => {
    setMbtiAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const mbtiNextQuestion = () => {
    if (mbtiCurrentQuestionIndex < MBTI_QUESTIONS.length - 1) {
      setMbtiCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const mbtiPrevQuestion = () => {
    if (mbtiCurrentQuestionIndex > 0) {
      setMbtiCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const mbtiResetQuiz = () => {
    setMbtiCurrentQuestionIndex(0);
    setMbtiAnswers({});
  };

  // VIBE Profile Generation
  const generateProfileResults = async () => {
    setIsGeneratingResults(true);
    
    // Simulate AI loading ring spinning
    await new Promise(resolve => setTimeout(resolve, 3500));

    const choice = answers[1]; // first question answer
    let determinedPersonality = "Melómano Introspectivo";
    
    if (choice === "1b") {
      determinedPersonality = "Curador Urbano Moderno";
    } else if (choice === "1d" || choice === "1a") {
      determinedPersonality = "Bohemio Ecléctico";
    }

    let newRecs: RecommendationItem[] = [];
    const activeSession = localStorage.getItem('vibe_current_user');
    if (activeSession) {
      const currentUser = JSON.parse(activeSession);
      const tempUserObj: User = {
        ...currentUser,
        archetype: determinedPersonality,
        quizAnswers: answers
      };
      setIsGeneratingRecs(true);
      try {
        newRecs = await generateDynamicRecommendations(tempUserObj);
      } finally {
        setIsGeneratingRecs(false);
      }
    } else {
      newRecs = RECOMMENDATIONS_DB[determinedPersonality] || RECOMMENDATIONS_DB["Melómano Introspectivo"];
    }

    setPersonality(determinedPersonality);
    setRecommendations(newRecs);
    setIsGeneratingResults(false);

    // If logged in, update user profile and history
    if (activeSession) {
      const currentUser = JSON.parse(activeSession);
      const todayStr = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
      
      const registeredUsersJson = localStorage.getItem('vibe_registered_users');
      if (registeredUsersJson) {
        const registeredUsers = JSON.parse(registeredUsersJson);
        const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
          const oldHistory = registeredUsers[idx].history || [];
          const updatedHistory = [...oldHistory];
          
          const alreadyInHistory = oldHistory.some((h: any) => h.title === determinedPersonality);
          if (!alreadyInHistory) {
            updatedHistory.forEach((h: any) => { h.result = "Anterior"; });
            updatedHistory.unshift({ title: determinedPersonality, date: todayStr, result: "Actual" });
          }

          const starterBadges = ARCHETYPE_DETAILS[determinedPersonality]?.badges || ["Indie", "Cozy"];

          const updatedFullUser = {
            ...registeredUsers[idx],
            archetype: determinedPersonality,
            badges: starterBadges,
            quizAnswers: answers,
            recommendations: newRecs,
            history: updatedHistory,
            profileCompleted: true
          };
          registeredUsers[idx] = updatedFullUser;
          localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));

          const { password: _, ...sessionUser } = updatedFullUser;
          localStorage.setItem('vibe_current_user', JSON.stringify(sessionUser));
          setUser(sessionUser);
        }
      }
    }
  };

  // Optional MBTI Profile Generation
  const generateMbtiResults = async () => {
    setMbtiIsGeneratingResults(true);
    
    // Simulate AI loading ring spinning
    await new Promise(resolve => setTimeout(resolve, 3500));

    const determinedMbti = calculateMbtiType(mbtiAnswers);
    const profile = MBTI_PROFILES[determinedMbti];

    setMbtiPersonality(determinedMbti);
    setMbtiCompleted(true);
    setMbtiIsGeneratingResults(false);

    // If logged in, update user profile
    const activeSession = localStorage.getItem('vibe_current_user');
    if (activeSession) {
      const currentUser = JSON.parse(activeSession);
      const registeredUsersJson = localStorage.getItem('vibe_registered_users');
      if (registeredUsersJson) {
        const registeredUsers = JSON.parse(registeredUsersJson);
        const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
          const updatedFullUser = {
            ...registeredUsers[idx],
            mbti: determinedMbti,
            mbtiCompleted: true,
            mbtiAnswers: mbtiAnswers,
            mbtiDetails: {
              code: determinedMbti,
              name: profile?.name || determinedMbti,
              description: profile?.description || "",
              strengths: profile?.strengths || [],
              weaknesses: profile?.weaknesses || []
            }
          };
          registeredUsers[idx] = updatedFullUser;
          localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));

          const { password: _, ...sessionUser } = updatedFullUser;
          localStorage.setItem('vibe_current_user', JSON.stringify(sessionUser));
          setUser(sessionUser);
        }
      }
    }
  };

  // Favorites Operations
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const nextFavorites = prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id];
      
      const activeSession = localStorage.getItem('vibe_current_user');
      if (activeSession) {
        const currentUser = JSON.parse(activeSession);
        
        const registeredUsersJson = localStorage.getItem('vibe_registered_users');
        if (registeredUsersJson) {
          const registeredUsers = JSON.parse(registeredUsersJson);
          const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === currentUser.email.toLowerCase());
          if (idx !== -1) {
            registeredUsers[idx] = { ...registeredUsers[idx], favorites: nextFavorites };
            localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));

            const { password: _, ...sessionUser } = registeredUsers[idx];
            localStorage.setItem('vibe_current_user', JSON.stringify(sessionUser));
            setUser(sessionUser);
          }
        }
      }
      return nextFavorites;
    });
  };

  const toggleLikeRecommendation = (id: string, category: string, title: string) => {
    if (!user) return;
    
    const feedback = user.feedbackHistory ? {
      liked: [...(user.feedbackHistory.liked || [])],
      disliked: [...(user.feedbackHistory.disliked || [])]
    } : { liked: [], disliked: [] };

    const likedCats = user.likedCategories ? { ...(user.likedCategories) } : {
      musica: 0, peliculas: 0, series: 0, libros: 0, lugares: 0, ropa: 0
    };

    const alreadyLikedIndex = feedback.liked.findIndex(item => item.id === id);
    const wasDisliked = feedback.disliked.some(item => item.id === id);

    if (wasDisliked) {
      feedback.disliked = feedback.disliked.filter(item => item.id !== id);
    }

    if (alreadyLikedIndex !== -1) {
      feedback.liked.splice(alreadyLikedIndex, 1);
    } else {
      const archetype = user.archetype || "Melómano Introspectivo";
      feedback.liked.push({
        id,
        category,
        title,
        archetype,
        timestamp: Date.now()
      });

      const mapCategoryKey = (cat: string): keyof typeof likedCats => {
        if (cat === 'music') return 'musica';
        if (cat === 'cinema') return 'peliculas';
        if (cat === 'series') return 'series';
        if (cat === 'books') return 'libros';
        if (cat === 'destination') return 'lugares';
        return 'ropa';
      };

      const key = mapCategoryKey(category);
      likedCats[key] = (likedCats[key] || 0) + 1;
    }

    const updatedRecommendations = recommendations.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isFavorite: alreadyLikedIndex === -1,
          isDisliked: false
        };
      }
      return item;
    });

    const updatedUser = {
      ...user,
      feedbackHistory: feedback,
      likedCategories: likedCats,
      recommendations: updatedRecommendations
    };

    setUser(updatedUser);
    setRecommendations(updatedRecommendations);
    localStorage.setItem('vibe_current_user', JSON.stringify(updatedUser));

    const registeredUsersJson = localStorage.getItem('vibe_registered_users');
    if (registeredUsersJson) {
      const registeredUsers = JSON.parse(registeredUsersJson);
      const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        registeredUsers[idx] = {
          ...registeredUsers[idx],
          feedbackHistory: feedback,
          likedCategories: likedCats,
          recommendations: updatedRecommendations
        };
        localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));
      }
    }
  };

  const toggleDislikeRecommendation = (id: string, category: string, title: string) => {
    if (!user) return;

    const feedback = user.feedbackHistory ? {
      liked: [...(user.feedbackHistory.liked || [])],
      disliked: [...(user.feedbackHistory.disliked || [])]
    } : { liked: [], disliked: [] };

    const likedCats = user.likedCategories ? { ...(user.likedCategories) } : {
      musica: 0, peliculas: 0, series: 0, libros: 0, lugares: 0, ropa: 0
    };

    const alreadyDislikedIndex = feedback.disliked.findIndex(item => item.id === id);
    const wasLiked = feedback.liked.some(item => item.id === id);

    if (wasLiked) {
      feedback.liked = feedback.liked.filter(item => item.id !== id);
    }

    if (alreadyDislikedIndex !== -1) {
      feedback.disliked.splice(alreadyDislikedIndex, 1);
    } else {
      const archetype = user.archetype || "Melómano Introspectivo";
      feedback.disliked.push({
        id,
        category,
        title,
        archetype,
        timestamp: Date.now()
      });
    }

    const updatedRecommendations = recommendations.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isFavorite: false,
          isDisliked: alreadyDislikedIndex === -1
        };
      }
      return item;
    });

    const updatedUser = {
      ...user,
      feedbackHistory: feedback,
      likedCategories: likedCats,
      recommendations: updatedRecommendations
    };

    setUser(updatedUser);
    setRecommendations(updatedRecommendations);
    localStorage.setItem('vibe_current_user', JSON.stringify(updatedUser));

    const registeredUsersJson = localStorage.getItem('vibe_registered_users');
    if (registeredUsersJson) {
      const registeredUsers = JSON.parse(registeredUsersJson);
      const idx = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        registeredUsers[idx] = {
          ...registeredUsers[idx],
          feedbackHistory: feedback,
          likedCategories: likedCats,
          recommendations: updatedRecommendations
        };
        localStorage.setItem('vibe_registered_users', JSON.stringify(registeredUsers));
      }
    }
  };

  const getFeedbackStats = () => {
    const totalLikes = user?.feedbackHistory?.liked?.length || 0;
    const totalDislikes = user?.feedbackHistory?.disliked?.length || 0;
    const likedCats = user?.likedCategories || {
      musica: 0, peliculas: 0, series: 0, libros: 0, lugares: 0, ropa: 0
    };
    return {
      totalLikes,
      totalDislikes,
      likedCategories: likedCats
    };
  };

  return (
    <VibeContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        registerUser,
        updateUserArchetype,
        updateUserProfile,
        currentQuestionIndex,
        answers,
        quizQuestions: VIBE_QUESTIONS,
        selectAnswer,
        nextQuestion,
        prevQuestion,
        resetQuiz,
        personality,
        recommendations,
        favorites,
        toggleFavorite,
        toggleLikeRecommendation,
        toggleDislikeRecommendation,
        getFeedbackStats,
        generateProfileResults,
        isGeneratingResults,
        isGeneratingRecs,
        mbtiCurrentQuestionIndex,
        mbtiAnswers,
        mbtiQuestions: MBTI_QUESTIONS,
        mbtiSelectAnswer,
        mbtiNextQuestion,
        mbtiPrevQuestion,
        mbtiResetQuiz,
        mbtiPersonality,
        mbtiCompleted,
        generateMbtiResults,
        mbtiIsGeneratingResults,
        statsData,
        badgeDescriptions: BADGE_DESCRIPTIONS
      }}
    >
      {children}
    </VibeContext.Provider>
  );
}

export function useVibe() {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
}
