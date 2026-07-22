import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { User as UserIcon, Calendar, Globe, AlignLeft, Smile, Camera } from 'lucide-react';

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useVibe();

  // Form states initialized from user context
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [location, setLocation] = useState(user?.location || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');

  // Validation feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Leave Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigatePath, setPendingNavigatePath] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if form is modified compared to original user values
  const isDirty =
    name !== (user?.name || '') ||
    username !== (user?.username || '') ||
    bio !== (user?.bio || '') ||
    gender !== (user?.gender || '') ||
    birthDate !== (user?.birthDate || '') ||
    location !== (user?.location || '') ||
    photoUrl !== (user?.photoUrl || '');

  // Handle file upload and convert to Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen es demasiado grande. El tamaño máximo es 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError('El nombre de pantalla es requerido.');
      return;
    }

    updateUserProfile({
      name: name.trim(),
      username: username.trim() || undefined,
      bio: bio.trim() || undefined,
      gender: gender || undefined,
      birthDate: birthDate || undefined,
      location: location.trim() || undefined,
      photoUrl: photoUrl || undefined
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  // Safe navigation wrapper: warn if changes are unsaved
  const handleBack = () => {
    if (isDirty) {
      setPendingNavigatePath('/profile');
      setShowConfirmModal(true);
    } else {
      navigate('/profile');
    }
  };

  // Confirm leave and discard changes
  const handleConfirmLeave = () => {
    setShowConfirmModal(false);
    if (pendingNavigatePath) {
      navigate(pendingNavigatePath);
    }
  };

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header with safe back handler */}
      <Header
        title="Editar Perfil"
        showBack={true}
        onBack={handleBack}
      />

      <div className="flex-grow px-6 pt-4 pb-32 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        {/* Photo Uploader */}
        <div className="flex flex-col items-center gap-3 py-4 shrink-0 relative">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar name={name || 'V'} size="lg" src={photoUrl || undefined} />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-vibe-volt" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-vibe-volt text-black flex items-center justify-center border border-vibe-bg shadow">
              <Camera className="w-3 h-3" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-bold text-vibe-light-gray uppercase tracking-wider hover:text-vibe-volt transition-colors"
          >
            Cambiar foto de perfil
          </button>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="text-xs text-red-400 font-medium tracking-wide border border-red-500/20 bg-red-500/10 px-4 py-2.5 rounded-xl text-left">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs text-vibe-volt font-medium tracking-wide border border-vibe-volt/20 bg-vibe-volt/10 px-4 py-2.5 rounded-xl text-left">
            ¡Perfil actualizado con éxito! Redirigiendo...
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Nombre de pantalla"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label="Nombre de usuario"
            placeholder="@usuario (opcional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftIcon={<Smile className="w-4 h-4" />}
          />

          {/* Bio Textarea */}
          <div className="flex flex-col text-left gap-1">
            <label className="text-xs text-vibe-light-gray font-medium tracking-wide uppercase">
              Biografía
            </label>
            <div className="relative flex items-start w-full bg-vibe-card border border-vibe-border rounded-xl px-4 py-3 focus-within:border-vibe-volt/50 transition-colors">
              <div className="flex items-center justify-center text-vibe-gray mr-3 mt-1 shrink-0">
                <AlignLeft className="w-4 h-4" />
              </div>
              <textarea
                rows={3}
                placeholder="Contanos algo sobre vos..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-transparent text-vibe-offwhite placeholder-vibe-gray text-sm focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Gender dropdown */}
          <div className="flex flex-col text-left gap-1">
            <label className="text-xs text-vibe-light-gray font-medium tracking-wide uppercase">
              Género
            </label>
            <div className="relative flex items-center w-full h-14 bg-vibe-card border border-vibe-border rounded-xl px-4 focus-within:border-vibe-volt/50 transition-colors">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-transparent text-vibe-offwhite text-sm focus:outline-none h-full outline-none [&>option]:bg-vibe-card [&>option]:text-vibe-offwhite"
              >
                <option value="">Seleccionar género (opcional)</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No binario">No binario</option>
                <option value="Otro">Otro / Prefiero no decirlo</option>
              </select>
            </div>
          </div>

          <Input
            label="Fecha de nacimiento"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />

          <Input
            label="País / Ubicación"
            placeholder="Ciudad, País"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            leftIcon={<Globe className="w-4 h-4" />}
          />

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <Button variant="primary" type="submit">
              GUARDAR CAMBIOS
            </Button>
            <Button variant="outline" type="button" onClick={handleBack}>
              CANCELAR
            </Button>
          </div>
        </form>
      </div>

      {/* Discard confirmation dialog */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Cambios sin guardar"
      >
        <div className="flex flex-col gap-4 text-center items-center py-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-heading text-sm text-vibe-offwhite">¿Descartar cambios?</h3>
            <p className="text-xs text-vibe-light-gray leading-relaxed px-4">
              Realizaste cambios en tu perfil que no fueron guardados. ¿Querés salir de todos modos?
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-4">
            <Button variant="secondary" onClick={handleConfirmLeave}>
              SÍ, DESCARTAR CAMBIOS
            </Button>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              SEGUIR EDITANDO
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
