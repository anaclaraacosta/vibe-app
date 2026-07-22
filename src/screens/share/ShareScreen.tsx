import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PlusAccents from '../../components/ui/PlusAccents';
import { Share2, Link, Copy, Check } from 'lucide-react';

export default function ShareScreen() {
  const navigate = useNavigate();
  const { personality } = useVibe();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header */}
      <Header
        showBack={true}
        title="Compartir"
        rightAction={<PlusAccents count={1} />}
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
              VIBE CARD
            </span>
            <p className="text-xs text-vibe-light-gray">
              Tu esencia cultural en una sola tarjeta.
            </p>
          </div>

          {/* Visual VIBE Shareable Card Preview */}
          <div className="w-full h-[280px] bg-vibe-card border border-vibe-border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between text-left shadow-xl select-none">
            {/* Volt accent background blob */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-vibe-volt opacity-15 blur-[35px]" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-category-cinema opacity-15 blur-[35px]" />

            {/* Top Logo */}
            <div className="flex justify-between items-center z-10">
              <span className="font-heading text-lg text-vibe-volt tracking-widest">VIBE</span>
              <PlusAccents count={1} />
            </div>

            {/* Middle Profile */}
            <div className="z-10 mt-4">
              <span className="text-[9px] font-bold tracking-widest text-vibe-light-gray uppercase">
                ARQUETIPO CULTURAL
              </span>
              <h2 className="font-heading text-2xl text-vibe-offwhite leading-tight mt-1">
                {personality}
              </h2>
            </div>

            {/* Bottom tags */}
            <div className="z-10 flex flex-wrap gap-2 mt-4">
              <span className="bg-vibe-bg border border-vibe-border px-3 py-1 rounded-full text-[9px] font-bold tracking-wider text-category-music uppercase">
                #Música
              </span>
              <span className="bg-vibe-bg border border-vibe-border px-3 py-1 rounded-full text-[9px] font-bold tracking-wider text-category-cinema uppercase">
                #Cine
              </span>
              <span className="bg-vibe-bg border border-vibe-border px-3 py-1 rounded-full text-[9px] font-bold tracking-wider text-category-series uppercase">
                #Series
              </span>
            </div>
          </div>

          {/* Share Actions */}
          <div className="flex gap-4 w-full mt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-grow h-14 bg-vibe-card border border-vibe-border rounded-xl flex items-center justify-center gap-3 font-semibold text-sm hover:border-vibe-volt/30 active:scale-[0.98] transition-all"
            >
              <Share2 className="w-4 h-4 text-vibe-volt" />
              Compartir
            </button>
            <button
              onClick={handleCopyLink}
              className="w-14 h-14 bg-vibe-card border border-vibe-border rounded-xl flex items-center justify-center hover:border-vibe-volt/30 active:scale-[0.98] transition-all"
              aria-label="Copiar enlace"
            >
              {copied ? (
                <Check className="w-5 h-5 text-vibe-volt animate-scale-in" />
              ) : (
                <Link className="w-5 h-5 text-vibe-light-gray" />
              )}
            </button>
          </div>
        </div>

        {/* Footer CTAs (Continue to Authentication) */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex flex-col gap-2">
            <Button variant="primary" onClick={() => navigate('/register')}>
              CREAR CUENTA
            </Button>
            <button
              onClick={() => navigate('/register', { state: { initialTab: 'login' } })}
              className="text-xs text-vibe-light-gray hover:text-vibe-offwhite font-medium py-2 transition-colors select-none"
            >
              ¿Ya tenés cuenta? Iniciar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Share Dialog Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Compartir Perfil">
        <div className="flex flex-col gap-4 text-center items-center py-4">
          <div className="w-12 h-12 rounded-full bg-vibe-volt/10 flex items-center justify-center text-vibe-volt border border-vibe-volt/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-sm text-vibe-offwhite">¡Listo para enviar!</h3>
            <p className="text-xs text-vibe-light-gray">Elegí la red social para presumir tu vibe arquetipo.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full mt-4">
            {['Instagram', 'WhatsApp', 'Twitter'].map((platform) => (
              <button
                key={platform}
                onClick={() => setIsModalOpen(false)}
                className="h-20 bg-vibe-bg border border-vibe-border rounded-xl flex flex-col items-center justify-center gap-2 font-semibold text-xs text-vibe-offwhite hover:border-vibe-volt/20 active:scale-95 transition-all"
              >
                <div className="w-6 h-6 bg-vibe-card border border-vibe-border rounded-full flex items-center justify-center" />
                {platform}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
