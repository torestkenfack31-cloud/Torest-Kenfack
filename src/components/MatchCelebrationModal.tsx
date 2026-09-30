import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MessageSquare, Heart, Sparkles, X } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { translations } from '../i18n/translations';

interface MatchCelebrationModalProps {
  currentUser: UserProfile;
  matchedUser: UserProfile;
  onStartChat: (user: UserProfile) => void;
  onClose: () => void;
  language: Language;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  currentUser,
  matchedUser,
  onStartChat,
  onClose,
  language
}) => {
  const t = translations[language];

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ec4899', '#ffffff']
      });
    } catch {
      // ignore in environments without canvas support
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl text-stone-100 overflow-hidden">
        {/* Subtle romantic ambient glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-200 transition-colors rounded-full hover:bg-stone-800"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold mb-4">
          <span className="text-rose-400">♥</span>
          <span>{matchedUser.compatibilityScore ?? 92}% d'affinité d'âme</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-brand text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-rose-200 to-amber-200 mb-2">
          C'est le Ndolo !
        </h2>
        <p className="text-xs sm:text-sm text-rose-100/70 mb-8 max-w-sm mx-auto leading-relaxed">
          Vos cœurs et vos projets de vie s'harmonisent. Un amour véritable et sincère commence par cet échange.
        </p>

        {/* Dual Avatars with Heart Nexus */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-rose-500/80 shadow-lg shadow-rose-950/60"
            />
            <span className="absolute bottom-0 right-0 bg-stone-900 text-rose-200 text-[10px] px-2 py-0.5 rounded-full border border-rose-800">
              Vous
            </span>
          </div>

          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/60 animate-pulse">
            <Heart className="w-6 h-6 fill-white stroke-none" />
          </div>

          <div className="relative">
            <img
              src={matchedUser.avatar}
              alt={matchedUser.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-rose-500/80 shadow-lg shadow-rose-950/60"
            />
            <span className="absolute bottom-0 right-0 bg-stone-900 text-rose-200 text-[10px] px-2 py-0.5 rounded-full border border-rose-800">
              {matchedUser.name.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Primary and secondary CTAs */}
        <div className="space-y-3">
          <button
            onClick={() => onStartChat(matchedUser)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Engager la conversation</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs rounded-xl transition-colors"
          >
            {t.discover.continueBrowsing}
          </button>
        </div>
      </div>
    </div>
  );
};
