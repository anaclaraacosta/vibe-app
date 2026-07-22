import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PlusAccents from '../../components/ui/PlusAccents';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, registerUser } = useVibe();

  // Determine initial tab from route state
  const initialTab = (location.state as any)?.initialTab || 'register';
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(initialTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ((location.state as any)?.initialTab) {
      setActiveTab((location.state as any).initialTab);
    }
  }, [location.state]);

  const handleTabChange = (tab: 'register' | 'login') => {
    setActiveTab(tab);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let res;
    if (activeTab === 'register') {
      res = registerUser(email, password);
    } else {
      res = login(email, password);
    }

    if (res && !res.success) {
      setError(res.error || 'Ocurrió un error.');
    } else {
      if (activeTab === 'register') {
        navigate('/home');
      } else {
        navigate('/home');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header */}
      <Header
        showBack={true}
        title={activeTab === 'register' ? 'Crear Cuenta' : 'Iniciar Sesión'}
        rightAction={<PlusAccents count={1} />}
      />

      <div className="flex-grow flex flex-col justify-between overflow-y-auto no-scrollbar pb-8">
        
        {/* Top Header visual area */}
        <div className="h-[200px] relative flex flex-col items-center justify-center shrink-0">
          <div className="absolute w-[180px] h-[180px] rounded-full bg-vibe-volt opacity-[0.05] blur-[40px]" />
          <div className="z-10 flex flex-col gap-1 items-center">
            <span className="font-heading text-4xl text-vibe-volt tracking-widest">VIBE</span>
            <p className="text-[11px] text-vibe-light-gray tracking-wide uppercase font-semibold">
              Tu universo cultural
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-vibe-border/50">
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-grow h-14 font-heading text-xs uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'register'
                ? 'border-vibe-volt text-vibe-volt'
                : 'border-transparent text-vibe-gray'
            }`}
          >
            Registrarse
          </button>
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-grow h-14 font-heading text-xs uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-vibe-volt text-vibe-volt'
                : 'border-transparent text-vibe-gray'
            }`}
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="px-6 pt-8 flex flex-col gap-4">
          
          {error && (
            <div className="text-xs text-red-400 font-medium tracking-wide border border-red-500/20 bg-red-500/10 px-4 py-2.5 rounded-xl text-left">
              {error}
            </div>
          )}

          {/* Email input */}
          <Input
            type="email"
            placeholder="correo@ejemplo.com"
            label="Correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          {/* Password input */}
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            label="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              showPassword ? (
                <EyeOff className="w-4 h-4" onClick={() => setShowPassword(false)} />
              ) : (
                <Eye className="w-4 h-4" onClick={() => setShowPassword(true)} />
              )
            }
            required
          />

          {/* Main Action Button */}
          <Button variant="primary" type="submit" className="mt-4">
            {activeTab === 'register' ? 'REGISTRARSE' : 'INGRESAR'}
          </Button>
        </form>

        {/* Decorative elements / Terms */}
        <div className="px-8 mt-6 text-center flex flex-col gap-1 items-center shrink-0">
          <p className="text-[10px] text-vibe-gray max-w-[260px] leading-normal font-medium uppercase tracking-wide">
            Al continuar aceptás nuestras condiciones de servicio y políticas de privacidad.
          </p>
          <div className="mt-4">
            <PlusAccents count={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
