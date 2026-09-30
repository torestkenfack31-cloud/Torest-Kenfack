import React from 'react';
import { Home, Compass, Film, HeartHandshake, MessageSquare, Plus, User, ShieldCheck, Crown, Briefcase } from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../i18n/translations';

export type TabType = 'home' | 'discover' | 'reels' | 'marriage' | 'chat' | 'community' | 'profile' | 'admin';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenCreate: () => void;
  onOpenPremium?: () => void;
  language: Language;
  unreadCount?: number;
  activeRole: UserRole;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenCreate,
  onOpenPremium,
  language,
  unreadCount = 1,
  activeRole
}) => {
  const t = translations[language];

  const isStaff = activeRole === 'admin' || activeRole === 'moderator';

  return (
    <>
      {/* Desktop & Tablet Top Secondary Bar */}
      <div className="hidden lg:block border-b border-stone-800 bg-stone-950/80 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-12">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'home'
                  ? 'bg-rose-500/15 text-rose-300 font-semibold border-b border-rose-500'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => onTabChange('discover')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'discover'
                  ? 'bg-rose-500/15 text-rose-300 font-semibold border-b border-rose-500'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{t.nav.discover}</span>
              <span className="text-[10px] bg-rose-500/25 text-rose-200 px-1.5 py-0.2 rounded font-semibold">Cœurs</span>
            </button>
            <button
              onClick={() => onTabChange('reels')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'reels'
                  ? 'bg-rose-500/15 text-rose-300 font-semibold border-b border-rose-500'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {t.nav.reels}
            </button>
            <button
              onClick={() => onTabChange('marriage')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'marriage'
                  ? 'bg-rose-500/15 text-rose-300 font-semibold border-b border-rose-500'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{t.nav.marriage}</span>
              <span className="text-[10px] bg-amber-500/25 text-amber-200 px-1.5 py-0.2 rounded font-semibold">
                Boutique
              </span>
            </button>
            <button
              onClick={() => onTabChange('chat')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                activeTab === 'chat'
                  ? 'bg-rose-500/15 text-rose-300 font-semibold border-b border-rose-500'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{t.nav.chat}</span>
              {unreadCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-rose-500 text-[10px] text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('community')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'community'
                  ? 'bg-rose-500/15 text-rose-300 font-semibold border-b border-rose-500'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {t.nav.community}
            </button>
            {isStaff && (
              <button
                onClick={() => onTabChange('admin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? activeRole === 'admin'
                      ? 'bg-amber-500/25 text-amber-200 border border-amber-500/60 shadow-sm'
                      : 'bg-rose-600/30 text-rose-200 border border-rose-500/60 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {activeRole === 'admin' ? (
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <span>{activeRole === 'admin' ? 'Administration' : 'Modération'}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                  activeRole === 'admin'
                    ? 'bg-amber-400/30 text-amber-200'
                    : 'bg-emerald-500/30 text-emerald-200'
                }`}>
                  {activeRole === 'admin' ? 'ADMIN' : 'MOD'}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {activeRole === 'professional' && (
              <button
                onClick={() => onTabChange('marriage')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 transition-all cursor-pointer"
                title="Accéder à l'Espace Prestataire Pro"
              >
                <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                <span>Espace Pro</span>
              </button>
            )}
            {onOpenPremium && (
              <button
                onClick={onOpenPremium}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeRole === 'premium'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                    : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30'
                }`}
                title="Espace VIP Premium"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>{activeRole === 'premium' ? 'VIP' : 'Premium'}</span>
              </button>
            )}
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white rounded-md transition-all shadow-sm shadow-rose-950"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>{t.nav.create}</span>
            </button>
            <button
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-rose-950/60 text-rose-200 border border-rose-800/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <User className="h-3.5 w-3.5 text-rose-400" />
              <span>{t.nav.profile}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 from constitution) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-rose-950/40 h-16 pb-safe">
        <div className="grid grid-cols-5 items-center h-full max-w-md mx-auto px-2">
          {/* 1. Accueil */}
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center min-h-[44px] ${
              activeTab === 'home' ? 'text-rose-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">{t.nav.home}</span>
          </button>

          {/* 2. Découvrir */}
          <button
            onClick={() => onTabChange('discover')}
            className={`flex flex-col items-center justify-center min-h-[44px] ${
              activeTab === 'discover' ? 'text-rose-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">{t.nav.discover}</span>
          </button>

          {/* 3. Bouton central Créer (+) */}
          <div className="flex items-center justify-center">
            <button
              onClick={onOpenCreate}
              className="h-11 w-11 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-950/60 active:scale-95 transition-transform"
              aria-label="Créer"
            >
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>

          {/* 4. Chat */}
          <button
            onClick={() => onTabChange('chat')}
            className={`relative flex flex-col items-center justify-center min-h-[44px] ${
              activeTab === 'chat' ? 'text-rose-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-3 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            )}
            <span className="text-[10px] font-medium tracking-tight mt-1">{t.nav.chat}</span>
          </button>

          {/* 5. Profil / Mariage */}
          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center justify-center min-h-[44px] ${
              activeTab === 'profile' ? 'text-rose-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">{t.nav.profile}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
