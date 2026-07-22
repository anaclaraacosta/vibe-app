import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close wrapper */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide up modal content card */}
      <div className="bg-vibe-card border-t border-vibe-border rounded-t-3xl w-full max-h-[85%] flex flex-col z-10 relative overflow-hidden animate-slide-up pb-8">
        
        {/* Drag handle decoration */}
        <div className="w-10 h-1 bg-vibe-border rounded-full mx-auto my-3 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-vibe-border/50">
          <h2 className="font-heading text-lg text-vibe-offwhite">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-vibe-bg flex items-center justify-center text-vibe-light-gray hover:text-vibe-offwhite border border-vibe-border transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-grow text-left">
          {children}
        </div>
      </div>
    </div>
  );
}
