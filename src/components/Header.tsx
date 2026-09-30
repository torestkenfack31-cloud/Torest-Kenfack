import React from 'react';
import { Shield, Sparkles, User, Globe, CheckCircle, Heart, Camera, LogOut, Crown } from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { NdoloLogo } from './NdoloLogo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSafety: () => void;
  onOpenVerification: () => void;
  onOpenCreateProfile: () => void;
  onOpenPremium?: () => void;
  onLogout: () => void;
  verificationLevel: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeRole,
  onRoleChange,
  onOpenSafety,
  onOpenVerification,
  onOpenCreateProfile,
  onOpenPremium,
  onLogout,
  verificationLevel
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-950/40 bg-stone-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single brand logo and wordmark */}
        <div className="flex items-center gap-3">
          <a href="#" className="hover:opacity-95 transition-opacity">
            <NdoloLogo size="md" showSubtitle={false} />
          </a>
          <span className="hidden lg:inline-block text-xs text-rose-300/70 border-l border-rose-900/40 pl-3">
            {t.appSubtitle}
          </span>
        </div>

        {/* Zone 2: Editorial Navigation Status & Safety Quick Access */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          {/* VIP Premium CTA button in Top Bar */}
          <button
            onClick={onOpenPremium}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
              activeRole === 'premium'
                ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 border-amber-500/60 text-amber-300'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 hover:from-amber-400 hover:to-rose-500 shadow-amber-950/40'
            }`}
            title="Découvrir les avantages du Mode Premium"
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>{activeRole === 'premium' ? 'VIP Actif ★' : 'Passer Premium'}</span>
          </button>

          {/* Quick Profile Creation & Selfie verification trigger */}
          <button
            onClick={onOpenCreateProfile}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-200 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
            title="Créer un profil avec contrôle selfie anti-mineur"
          >
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>Nouveau Profil (Selfie 18+)</span>
          </button>

          <button
            onClick={onOpenSafety}
            className="flex items-center gap-1.5 text-rose-200/80 hover:text-rose-100 transition-colors py-1.5 px-2.5 rounded-md hover:bg-stone-900 border border-rose-900/30"
            title="Centre de Sécurité"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sécurité & Vérité</span>
          </button>

          <button
            onClick={onOpenVerification}
            className="flex items-center gap-1.5 text-amber-200/90 hover:text-amber-100 transition-colors py-1.5 px-2.5 rounded-md bg-rose-950/30 border border-amber-800/40"
            title="Badges de confiance"
          >
            <CheckCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Niveau {verificationLevel}/4</span>
          </button>
        </div>

        {/* Zone 3: Interactive Controls (Language Switch, Role Selector, Auth logout) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Explicit Bilingual Language Switcher (FR / EN) */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                language === 'fr'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Passer en Français"
            >
              FR 🇫🇷
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                language === 'en'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Switch to English"
            >
              EN 🇬🇧
            </button>
          </div>

          {/* Role Switcher Dropdown (for testing all platform personas from spec) */}
          <div className="relative group">
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="text-xs bg-stone-900 border border-stone-800 rounded-md py-1.5 px-2 text-stone-300 hover:border-rose-700/60 focus:outline-none focus:border-rose-500 cursor-pointer"
              title="Tester les rôles de la plateforme"
            >
              <option value="user">Mode : Utilisateur</option>
              <option value="premium">Mode : Premium ♥</option>
              <option value="professional">Mode : Prestataire Pro</option>
              <option value="moderator">Mode : Modérateur</option>
              <option value="admin">Mode : Administrateur</option>
            </select>
          </div>

          {/* Auth Switcher: Aller à la page Inscription & Connexion */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-rose-300 hover:border-rose-900/50 transition-colors"
            title="Aller à la page Inscription & Connexion"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Connexion / Sortie</span>
          </button>

          {/* Safety icon on mobile */}
          <button
            onClick={onOpenSafety}
            className="md:hidden p-2 text-stone-400 hover:text-rose-300 transition-colors"
            aria-label="Sécurité"
          >
            <Shield className="h-5 w-5 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
