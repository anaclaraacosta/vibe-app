import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PlusAccents from '../../components/ui/PlusAccents';
import { BarChart2, Calendar, Clock, Share2, Award, Zap, Heart, ChevronRight } from 'lucide-react';
import { generateWrappedImage } from '../../services/geminiService';

export default function WrappedScreen() {
  const navigate = useNavigate();
  const { statsData, user } = useVibe();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // States for Image Generation
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast automatic dismiss effect
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const categoryColors: Record<string, string> = {
    music: '#a78bfa',
    cinema: '#f472b6',
    series: '#fb923c',
    books: '#38bdf8',
    destination: '#2dd4bf',
    fashion: '#c8f55a'
  };

  const categoryLabels: Record<string, string> = {
    music: 'Música',
    cinema: 'Cine',
    series: 'Series',
    books: 'Libros',
    destination: 'Destino',
    fashion: 'Ropa'
  };

  // Section 1 - Tus Favoritos calculations
  const likedList = [...(user?.feedbackHistory?.liked || [])].sort((a, b) => b.timestamp - a.timestamp);
  const top3Likes = likedList.slice(0, 3);

  // Section 2 - Tu Género calculations
  const categoryCounts: Record<string, number> = {
    music: 0, cinema: 0, series: 0, books: 0, destination: 0, fashion: 0
  };
  (user?.feedbackHistory?.liked || []).forEach(item => {
    if (categoryCounts[item.category] !== undefined) {
      categoryCounts[item.category]++;
    }
  });

  let favoriteCategory = '';
  let maxLikes = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxLikes) {
      maxLikes = count;
      favoriteCategory = cat;
    }
  });

  // Section 3 - completed tests
  const completedTests: { key: string; label: string; name: string; color: string; route: string }[] = [];
  if (user?.mbtiCompleted && user.mbti) {
    completedTests.push({ key: 'mbti', label: 'MBTI', name: user.mbti, color: '#A78BFA', route: '/mbti-result' });
  }
  if (user?.astralCompatibility) {
    completedTests.push({ key: 'astral', label: 'Compatibilidad Astral', name: user.astralCompatibility.name, color: '#60A5FA', route: '/astral-quiz' });
  }
  if (user?.aestheticTaste) {
    completedTests.push({ key: 'aesthetic', label: 'Gusto Estético', name: user.aestheticTaste.name, color: '#F472B6', route: '/aesthetic-quiz' });
  }
  if (user?.enneagram) {
    completedTests.push({ key: 'enneagram', label: 'Eneagrama', name: user.enneagram.name, color: '#FB923C', route: '/enneagram-quiz' });
  }
  if (user?.temperament) {
    completedTests.push({ key: 'temperament', label: 'Temperamentos', name: user.temperament.name, color: '#34D399', route: '/temperament-quiz' });
  }

  // Section 4 - Lo que Evitaste
  const dislikedList = user?.feedbackHistory?.disliked || [];

  // Copy Summary handler
  const handleCopySummary = () => {
    const testNames = completedTests.map(t => `${t.label} (${t.name})`);
    const summaryText = `Mi VIBE Wrapped 🎵
Arquetipo: ${user?.archetype || 'Melómano Introspectivo'}
Categoría favorita: ${favoriteCategory ? categoryLabels[favoriteCategory] : 'Ninguna'}
Tests completados: ${completedTests.length}
Tests: ${testNames.join(', ') || 'Ninguno'}
— VIBE app`;

    navigator.clipboard.writeText(summaryText)
      .then(() => alert("¡Resumen copiado al portapapeles!"))
      .catch(err => console.error("Could not copy summary:", err));
  };

  // Image Generation handler
  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    try {
      const testNamesStr = completedTests.map(t => `${t.label} (${t.name})`).join(', ') || 'Ninguno';
      const topLikedTitlesStr = likedList.slice(0, 3).map(item => item.title).join(', ') || 'Ninguno';
      
      const promptText = `Create a stylized, dark-background digital art poster for a music and culture personality app called VIBE. The poster is a monthly Wrapped summary for a user with the following profile:
- Cultural archetype: ${user?.archetype || 'Melómano Introspectivo'}
- Favorite category: ${favoriteCategory ? categoryLabels[favoriteCategory] : 'Ninguna'}
- Top liked items: ${topLikedTitlesStr}
- Personality tests results: ${testNamesStr}
Style: dark background (#0D0D0D), acid green (#C8F55A) as primary accent, bold typography feel, abstract geometric shapes in purple, orange and pink as decorative elements. The word VIBE in large bold text at the top. Include the archetype name prominently. Modern, editorial, Gen Z aesthetic. No photorealistic faces. Abstract and graphic.`;

      const { base64, mimeType } = await generateWrappedImage(promptText);
      
      const blob = await fetch(
        `data:${mimeType};base64,${base64}`
      ).then(r => r.blob());
      const blobUrl = URL.createObjectURL(blob);

      setGeneratedImgUrl(blobUrl);
      setIsImgModalOpen(true);

      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'vibe-wrapped.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Image generation failed:", error);
      setToastMessage("No se pudo generar la imagen, intentá de nuevo");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header */}
      <Header
        title="VIBE Wrapped"
        rightAction={<PlusAccents count={1} />}
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-32 flex flex-col gap-8 overflow-y-auto no-scrollbar relative">
        {/* Background Atmosphere Blobs */}
        <div className="absolute top-[300px] left-0 w-72 h-72 bg-[#a78bfa]/5 blur-[90px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[800px] right-0 w-72 h-72 bg-[#c8f55a]/5 blur-[90px] rounded-full pointer-events-none z-0" />

        {/* Monthly Recap Stat Hero Card */}
        <div className="bg-vibe-card border border-vibe-border rounded-3xl p-5 flex flex-col justify-between text-left relative overflow-hidden h-[260px] w-full z-10">
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-vibe-volt opacity-5 blur-[35px]" />
          
          <div className="z-10 flex flex-col gap-1.5">
            <span className="text-[9px] font-bold tracking-widest text-vibe-volt uppercase">
              TU MES EN NÚMEROS
            </span>
            <h2 className="font-heading text-4xl text-vibe-offwhite leading-none mt-2">
              {statsData.daysActive} días
            </h2>
            <p className="text-xs text-vibe-light-gray">
              conectando con tu cultura en {statsData.monthName}.
            </p>
          </div>

          <div className="z-10 grid grid-cols-2 gap-4 border-t border-vibe-border/40 pt-4 mt-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-vibe-volt" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-vibe-offwhite leading-tight">{statsData.totalMinutes} min</span>
                <span className="text-[9px] text-vibe-light-gray uppercase tracking-wider">Escuchados</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-category-cinema" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-vibe-offwhite leading-tight">{statsData.topCategory}</span>
                <span className="text-[9px] text-vibe-light-gray uppercase tracking-wider">Top Enfoque</span>
              </div>
            </div>
          </div>
        </div>

        {/* Evolution history timeline */}
        <div className="flex flex-col gap-3 text-left z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Cómo evolucionaste
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 relative overflow-hidden flex justify-between gap-2">
            <div className="absolute top-11 left-10 right-10 h-0.5 bg-vibe-border/60 z-0" />

            {statsData.evolutionHistory.map((node, index) => {
              const isActive = index === statsData.evolutionHistory.length - 1;
              return (
                <div key={index} className="flex flex-col items-center gap-2 text-center z-10 w-24 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                    isActive
                      ? 'bg-vibe-volt text-[#0d0f0c] border-vibe-volt shadow-md scale-110'
                      : 'bg-vibe-bg text-vibe-light-gray border-vibe-border'
                  }`}>
                    {node.icon === 'heart' ? (
                      <Heart className="w-5 h-5 fill-current" />
                    ) : node.icon === 'zap' ? (
                      <Zap className="w-5 h-5 fill-current" />
                    ) : (
                      <Award className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[10px] font-bold text-vibe-offwhite truncate max-w-[85px] leading-tight">
                      {node.archetype.split(' ')[0]}
                    </span>
                    <span className="text-[8px] text-vibe-light-gray uppercase font-semibold">
                      {node.month}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown bar graph percentages */}
        <div className="flex flex-col gap-3 text-left z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Desglose cultural
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col gap-4">
            {statsData.breakdown.map((row, index) => (
              <div key={index} className="flex flex-col gap-1.5 w-full">
                <div className="flex justify-between items-center text-[10px] tracking-wide text-vibe-light-gray uppercase font-semibold">
                  <span>{row.category}</span>
                  <span className="text-vibe-offwhite font-bold">{row.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-vibe-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all`}
                    style={{
                      width: `${row.percentage}%`,
                      backgroundColor: index === 0 ? '#c8f55a' : index === 1 ? '#a78bfa' : index === 2 ? '#fb923c' : '#f472b6'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 1 — TUS FAVORITOS DEL MES */}
        <div className="flex flex-col gap-3 text-left z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Tus favoritos del mes
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="flex flex-col gap-4">
            {top3Likes.length > 0 ? (
              top3Likes.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[14px] p-4 flex flex-col text-left relative overflow-hidden"
                  style={{ borderLeftWidth: '3px', borderLeftColor: categoryColors[item.category] || '#c8f55a' }}
                >
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: categoryColors[item.category] || '#c8f55a' }}
                  >
                    {categoryLabels[item.category] || item.category}
                  </span>
                  <h4 className="font-heading text-base text-[#F5F5F0] mt-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-3 text-[#666666]">
                    <Heart className="w-3.5 h-3.5 fill-[#E53E3E] text-[#E53E3E]" />
                    <span className="text-xs">Te gustó</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[14px] p-8 flex items-center justify-center text-center">
                <p className="text-sm text-[#555555] font-normal leading-relaxed">
                  Todavía no marcaste favoritos — dale ❤️ a las recomendaciones
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2 — TU GÉNERO FAVORITO */}
        <div className="flex flex-col gap-3 text-left z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Tu género favorito
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          {favoriteCategory ? (
            <div 
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[16px] p-6 flex flex-col text-left relative overflow-hidden"
              style={{ borderTopWidth: '3px', borderTopColor: categoryColors[favoriteCategory] }}
            >
              <span 
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: categoryColors[favoriteCategory] }}
              >
                TU CATEGORÍA FAVORITA
              </span>
              <h2 className="font-heading text-4xl text-[#F5F5F0] mt-2 leading-none" style={{ fontFamily: "'Paytone One', sans-serif" }}>
                {categoryLabels[favoriteCategory]}
              </h2>

              <div className="flex flex-wrap gap-2 mt-5">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <div 
                    key={cat}
                    className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-3 py-1.5 flex items-center gap-2 text-[#888888] text-xs font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                    <span>{categoryLabels[cat]} · {count} ❤️</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[16px] p-8 flex items-center justify-center text-center">
              <p className="text-sm text-[#555555] font-normal">
                Empezá a marcar favoritos para descubrir tu categoría dominante
              </p>
            </div>
          )}
        </div>

        {/* SECTION 3 — TUS RESULTADOS DE TESTS */}
        <div className="flex flex-col gap-3 text-left z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-[#555555] tracking-wide uppercase">
              Tus tests
            </h3>
            <div className="flex-grow h-px bg-[#2A2A2A] ml-4" />
          </div>

          <div className="flex flex-col gap-3">
            {completedTests.length > 0 ? (
              completedTests.map((test) => (
                <div
                  key={test.key}
                  onClick={() => navigate(test.route)}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[14px] p-4 flex items-center justify-between cursor-pointer hover:border-vibe-volt/30 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[#0d0f0c] shadow-inner font-bold"
                      style={{ backgroundColor: test.color }}
                    >
                      <span className="font-heading text-lg" style={{ fontFamily: "'Paytone One', sans-serif" }}>
                        {test.name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex flex-col text-left">
                      <span 
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: test.color }}
                      >
                        {test.label}
                      </span>
                      <span className="font-heading text-base text-[#F5F5F0] mt-0.5 leading-snug">
                        {test.name}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#333333]" />
                </div>
              ))
            ) : (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[14px] p-8 flex items-center justify-center text-center">
                <p className="text-sm text-[#555555] font-normal">
                  Completá los tests para ver tu perfil completo aquí
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4 — LO QUE EVITASTE */}
        {dislikedList.length > 0 && (
          <div className="flex flex-col gap-3 text-left z-10 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
                Lo que evitaste
              </h3>
              <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[14px] p-5 flex flex-col gap-4 text-left">
              <span className="text-[10px] font-bold text-[#555555] uppercase tracking-wider">
                LO QUE NO ERA PARA VOS
              </span>

              <div className="flex flex-wrap gap-2">
                {dislikedList.slice(0, 6).map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[#444444] text-xs"
                  >
                    <span className="text-[#555555] font-bold">—</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#444444] italic mt-1">
                La IA ya tomó nota — no vas a volver a verlos
              </p>
            </div>
          </div>
        )}

        {/* SECTION 5 — COMPARTIR WRAPPED */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[20px] p-6 flex flex-col text-center relative overflow-hidden z-10 mt-4 min-h-[220px] justify-center items-center">
          {/* Internal overlapping soft atmosphere blobs */}
          <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full bg-[#a78bfa] opacity-[0.08] blur-[40px] pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-[#c8f55a] opacity-[0.08] blur-[40px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-[#f472b6] opacity-[0.08] blur-[45px] pointer-events-none" />

          <h2 className="font-heading text-3xl text-[#F5F5F0] leading-none mb-2 z-10" style={{ fontFamily: "'Paytone One', sans-serif" }}>
            ¿Lo compartís?
          </h2>
          <p className="text-sm text-[#666666] leading-normal mb-6 max-w-[260px] z-10">
            Tu Wrapped resume quién sos culturalmente este mes
          </p>

          <div className="flex gap-4 justify-center w-full z-10">
            <div className="flex-grow flex flex-col items-center">
              {isGeneratingImg ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <button
                    disabled
                    className="bg-[#2A2A2A] text-[#555555] text-xs font-bold px-5 py-3 rounded-[12px] shadow-md w-full cursor-not-allowed"
                  >
                    Generando…
                  </button>
                  <div className="flex gap-1.5 items-center h-4 justify-center">
                    {['#C8F55A', '#A78BFA', '#FB923C', '#F472B6', '#34D399', '#60A5FA'].map((color, i) => (
                      <div
                        key={color}
                        className="w-1.5 h-1.5 rounded-full animate-pulse-sequential"
                        style={{
                          backgroundColor: color,
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateImage}
                  className="bg-[#C8F55A] text-[#0D0D0D] text-xs font-bold px-5 py-3 rounded-[12px] hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer w-full"
                >
                  Generar imagen
                </button>
              )}
            </div>

            <button
              onClick={handleCopySummary}
              className="border border-[#2A2A2A] bg-transparent text-[#F5F5F0] text-xs font-bold px-5 py-3 rounded-[12px] hover:border-vibe-volt/40 active:scale-[0.98] transition-all cursor-pointer flex-grow self-start"
            >
              Copiar resumen
            </button>
          </div>
        </div>

      </div>

      {/* Share Modal popup */}
      <Modal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title="Compartir Wrapped">
        <div className="flex flex-col gap-4 text-center items-center py-4">
          <div className="w-12 h-12 rounded-full bg-vibe-volt/10 flex items-center justify-center text-vibe-volt border border-vibe-volt/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-sm text-vibe-offwhite">Compartir estadísticas</h3>
            <p className="text-xs text-vibe-light-gray">Demostrá tus {statsData.daysActive} días de actividad en VIBE.</p>
          </div>
          <div className="w-full flex flex-col gap-2 mt-4">
            <Button variant="primary" onClick={() => setIsShareOpen(false)}>
              Compartir en Instagram Stories
            </Button>
            <Button variant="secondary" onClick={() => setIsShareOpen(false)}>
              Copiar enlace de recapitulación
            </Button>
          </div>
        </div>
      </Modal>

      {/* Generated Image Preview Modal */}
      {isImgModalOpen && generatedImgUrl && (
        <div className="fixed inset-0 bg-[#0D0D0D]/95 flex flex-col items-center justify-center z-[999] p-6 text-center select-none animate-fade-in">
          <div className="flex flex-col items-center gap-6 max-w-sm w-full">
            <img 
              src={generatedImgUrl} 
              alt="VIBE Wrapped" 
              className="w-full aspect-[3/4] object-cover rounded-2xl border border-[#2A2A2A] shadow-2xl" 
            />
            <div className="flex gap-4 justify-center w-full">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImgUrl;
                  link.download = 'vibe-wrapped.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-[#C8F55A] text-[#0D0D0D] text-sm font-bold px-5 py-3 rounded-[12px] hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex-grow"
              >
                Descargar
              </button>
              <button
                onClick={() => setIsImgModalOpen(false)}
                className="border border-[#2A2A2A] bg-transparent text-[#F5F5F0] text-sm font-bold px-5 py-3 rounded-[12px] hover:border-vibe-volt/40 active:scale-[0.98] transition-all cursor-pointer flex-grow"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-6 right-6 bg-[#1A1A1A] border-l-4 border-l-[#E53E3E] text-vibe-offwhite p-4 rounded-xl shadow-lg z-[9999] text-xs font-medium text-left animate-slide-up">
          {toastMessage}
        </div>
      )}

      <style>{`
        @keyframes pulse-sequential {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
        }
        .animate-pulse-sequential {
          animation: pulse-sequential 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
