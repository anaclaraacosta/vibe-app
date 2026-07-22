import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import PlusAccents from '../../components/ui/PlusAccents';
import { LogOut, ChevronRight, Award, Music, Film, Home, Compass } from 'lucide-react';

interface HistoryEntry {
  type: 'archetype' | 'test';
  title: string;
  date: string;
  result: string;
  testKey?: string;
  label?: string;
  color?: string;
  route?: string;
  description?: string;
  tags?: string[];
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout, badgeDescriptions, updateUserProfile } = useVibe();
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [selectedTestHistory, setSelectedTestHistory] = useState<HistoryEntry | null>(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // redirect to landing
  };

  const badgeIcons: Record<string, any> = {
    music: Music,
    film: Film,
    home: Home,
    compass: Compass
  };

  // Build mixed history entries
  const mixedHistory: HistoryEntry[] = [];

  // 1. Archetype entries
  const archetypeItems = (user as any)?.history || (user?.archetype ? [
    { title: user.archetype, date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }), result: "Actual" }
  ] : []);

  archetypeItems.forEach((item: any) => {
    mixedHistory.push({
      type: 'archetype',
      title: item.title,
      date: item.date,
      result: item.result
    });
  });

  // 2. Completed tests
  if (user?.mbtiCompleted && user.mbti) {
    mixedHistory.push({
      type: 'test',
      testKey: 'mbti',
      label: 'MBTI',
      title: `Personalidad ${user.mbti}`,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
      result: user.mbti,
      color: '#A78BFA',
      route: '/mbti-result',
      description: `Tu tipo de personalidad es ${user.mbti}. Las siglas representan tu preferencia por la Extraversión/Introversión, Sensación/Intuición, Pensamiento/Sentimiento y Juicio/Percepción.`,
      tags: [user.mbti, 'MBTI', 'Personalidad']
    });
  }

  if (user?.astralCompatibility) {
    mixedHistory.push({
      type: 'test',
      testKey: 'astral',
      label: 'Compatibilidad Astral',
      title: user.astralCompatibility.name,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
      result: 'Astral',
      color: '#60A5FA',
      route: '/astral-quiz',
      description: user.astralCompatibility.description,
      tags: user.astralCompatibility.tags
    });
  }

  if (user?.aestheticTaste) {
    mixedHistory.push({
      type: 'test',
      testKey: 'aesthetic',
      label: 'Gusto Estético',
      title: user.aestheticTaste.name,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
      result: 'Estética',
      color: '#F472B6',
      route: '/aesthetic-quiz',
      description: user.aestheticTaste.description,
      tags: user.aestheticTaste.tags
    });
  }

  if (user?.enneagram) {
    mixedHistory.push({
      type: 'test',
      testKey: 'enneagram',
      label: 'Eneagrama',
      title: user.enneagram.name,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
      result: 'Eneagrama',
      color: '#FB923C',
      route: '/enneagram-quiz',
      description: user.enneagram.description,
      tags: user.enneagram.tags
    });
  }

  if (user?.temperament) {
    mixedHistory.push({
      type: 'test',
      testKey: 'temperament',
      label: 'Temperamentos',
      title: user.temperament.name,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
      result: 'Temperamento',
      color: '#34D399',
      route: '/temperament-quiz',
      description: user.temperament.description,
      tags: user.temperament.tags
    });
  }

  const handleRepeatTest = (testKey: string, route: string) => {
    setSelectedTestHistory(null);
    if (testKey === 'mbti') {
      updateUserProfile({ mbti: undefined, mbtiCompleted: false, mbtiAnswers: {} });
    } else if (testKey === 'astral') {
      updateUserProfile({ astralCompatibility: undefined });
    } else if (testKey === 'aesthetic') {
      updateUserProfile({ aestheticTaste: undefined });
    } else if (testKey === 'enneagram') {
      updateUserProfile({ enneagram: undefined });
    } else if (testKey === 'temperament') {
      updateUserProfile({ temperament: undefined });
    }
    navigate(route);
  };

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header */}
      <Header
        title="Mi Perfil"
        rightAction={
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-vibe-border bg-vibe-card text-vibe-light-gray hover:text-red-400 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        }
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-32 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        
        {/* User Card Area */}
        <div className="bg-vibe-card border border-vibe-border rounded-3xl p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden shrink-0">
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-vibe-volt opacity-5 blur-[30px]" />
          
          <Avatar name={user?.name || 'Matias'} size="lg" src={user?.photoUrl || undefined} />

          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-xl text-vibe-offwhite">{user?.name || 'Matias'}</h2>
            <p className="text-xs text-vibe-volt font-bold uppercase tracking-wider">{user?.archetype || 'Sin Personalidad'}</p>
            {user?.bio && <p className="text-xs text-vibe-light-gray mt-1 max-w-[240px] leading-relaxed">{user.bio}</p>}
          </div>

          <button
            onClick={() => navigate('/profile/edit')}
            className="px-4 py-1.5 rounded-full border border-vibe-border hover:border-vibe-volt/40 text-[10px] uppercase font-bold tracking-wider hover:text-vibe-volt transition-all animate-fade-in"
          >
            Editar Perfil
          </button>
        </div>

        {/* Badges Section */}
        <div className="flex flex-col gap-3 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Insignias obtenidas
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(user?.badges || ['Indie', 'Cozy', 'Cinephile']).map((badgeKey) => {
              const badge = (badgeDescriptions as any)[badgeKey] || {
                title: badgeKey,
                description: "Insignia de arquetipo obtenida por respuestas de quiz.",
                icon: "compass"
              };
              const BadgeIcon = badgeIcons[badge.icon] || Award;
              
              return (
                <div
                  key={badgeKey}
                  onClick={() => setSelectedBadge(badgeKey)}
                  className="bg-vibe-card border border-vibe-border rounded-2xl p-4 flex flex-col items-start gap-3 cursor-pointer hover:border-vibe-volt/30 active:scale-[0.98] transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-vibe-bg border border-vibe-border flex items-center justify-center text-vibe-volt">
                    <BadgeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-heading text-xs text-vibe-offwhite leading-tight">
                      {badge.title}
                    </h4>
                    <span className="text-[8px] text-vibe-light-gray uppercase font-semibold">
                      VER DETALLE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* History Section */}
        <div className="flex flex-col gap-3 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Historial de Vibes
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="bg-vibe-card border border-vibe-border rounded-2xl divide-y divide-vibe-border/50 overflow-hidden">
            {mixedHistory.map((item, index) => {
              const isTest = item.type === 'test';
              return (
                <div
                  key={index}
                  onClick={() => isTest && setSelectedTestHistory(item)}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isTest ? 'hover:bg-[#1a1a1a]/50 cursor-pointer' : 'select-none'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isTest ? (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-[#0D0D0D]"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.label?.charAt(0)}
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-vibe-volt" />
                    )}
                    <div className="flex flex-col">
                      {isTest && (
                        <span 
                          className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                          style={{ color: item.color }}
                        >
                          {item.label}
                        </span>
                      )}
                      <span className="text-xs font-bold text-vibe-offwhite leading-tight">{item.title}</span>
                      <span className="text-[9px] text-vibe-light-gray">{item.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold tracking-wider text-vibe-light-gray uppercase bg-vibe-bg border border-vibe-border px-2 py-0.5 rounded-full">
                      {item.result}
                    </span>
                    {isTest && <ChevronRight className="w-4 h-4 text-[#333333]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <PlusAccents count={1} />
        </div>
      </div>

      {/* Badge Description Modal */}
      <Modal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title="Detalle de Insignia"
      >
        {selectedBadge && (() => {
          const badge = (badgeDescriptions as any)[selectedBadge] || {
            title: selectedBadge,
            description: "Insignia de arquetipo.",
            icon: "compass"
          };
          const BadgeIcon = badgeIcons[badge.icon] || Award;
          
          return (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-vibe-volt/10 flex items-center justify-center text-vibe-volt border border-vibe-volt/20 shadow-md">
                <BadgeIcon className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-lg text-vibe-offwhite">{badge.title}</h3>
                <p className="text-xs text-vibe-light-gray leading-relaxed">{badge.description}</p>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Test Result Detail Modal */}
      {selectedTestHistory && (
        <div className="fixed inset-0 bg-[#0D0D0D] z-[999] flex flex-col justify-between p-6 overflow-y-auto">
          <div className="flex flex-col gap-6 text-left mt-8">
            <div className="flex flex-col gap-1.5">
              <span 
                className="text-[11px] font-bold tracking-[2.2px] uppercase"
                style={{ color: selectedTestHistory.color }}
              >
                {selectedTestHistory.label}
              </span>
              <h1 className="font-heading text-4xl text-[#F5F5F0] leading-none" style={{ fontFamily: "'Paytone One', sans-serif" }}>
                {selectedTestHistory.title}
              </h1>
            </div>

            <p className="text-sm text-[#888888] leading-relaxed max-w-md">
              {selectedTestHistory.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTestHistory.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#888888] text-[10px] font-semibold uppercase px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-12 mb-8">
            <button
              onClick={() => handleRepeatTest(selectedTestHistory.testKey || '', selectedTestHistory.route || '')}
              className="w-full h-12 border border-[#2A2A2A] bg-transparent text-[#F5F5F0] rounded-xl flex items-center justify-center font-bold text-xs hover:border-vibe-volt/40 active:scale-[0.99] transition-all cursor-pointer"
            >
              Repetir test
            </button>
            <button
              onClick={() => setSelectedTestHistory(null)}
              className="w-full text-center text-xs text-[#555555] font-semibold py-2 cursor-pointer hover:text-vibe-offwhite transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
