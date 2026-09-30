import React, { useState } from 'react';
import { Heart, X, Star, Info, ShieldCheck, MapPin, Sparkles, SlidersHorizontal, RotateCcw, Crown, Zap, Eye } from 'lucide-react';
import { UserProfile, Language, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { ProfileDetailModal } from './ProfileDetailModal';

interface DiscoveryProps {
  candidates: UserProfile[];
  onLikeCandidate: (user: UserProfile) => void;
  onPassCandidate: (user: UserProfile) => void;
  onReportCandidate: (user: UserProfile) => void;
  onOpenPremium?: () => void;
  activeRole?: UserRole;
  language: Language;
}

export const Discovery: React.FC<DiscoveryProps> = ({
  candidates,
  onLikeCandidate,
  onPassCandidate,
  onReportCandidate,
  onOpenPremium,
  activeRole,
  language
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'verified' | 'proximity' | 'diaspora' | 'whoLikedMe'>('all');
  const [selectedProfileForDetail, setSelectedProfileForDetail] = useState<UserProfile | null>(null);

  const isPremium = activeRole === 'premium';

  // Filter candidates
  const filteredCandidates = candidates.filter((cand) => {
    if (filter === 'verified') return cand.isVerified;
    if (filter === 'proximity') return cand.city.toLowerCase().includes('douala') || cand.city.toLowerCase().includes('yaoundé');
    if (filter === 'diaspora') return cand.country.toLowerCase().includes('france') || cand.city.toLowerCase().includes('diaspora');
    if (filter === 'whoLikedMe') {
      // Premium feature: profiles with >90% match who "liked" you
      return (cand.compatibilityScore || 0) >= 90;
    }
    return true;
  });

  const currentProfile = filteredCandidates[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredCandidates.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(filteredCandidates.length);
    }
  };

  const handleLike = () => {
    if (!currentProfile) return;
    onLikeCandidate(currentProfile);
    handleNext();
  };

  const handlePass = () => {
    if (!currentProfile) return;
    onPassCandidate(currentProfile);
    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      {/* Title & Filter Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-brand text-amber-100">
              {t.discover.title}
            </h1>
            <p className="text-xs text-stone-400">
              {t.discover.subtitle}
            </p>
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => { setFilter('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {t.discover.filterAll}
          </button>
          <button
            onClick={() => { setFilter('verified'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'verified'
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.discover.filterVerified}</span>
          </button>
          <button
            onClick={() => { setFilter('proximity'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'proximity'
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {t.discover.filterProximity}
          </button>
          <button
            onClick={() => { setFilter('diaspora'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'diaspora'
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {t.discover.filterDiaspora}
          </button>

          {/* Premium-Only Filter: Who Liked Me */}
          <button
            onClick={() => {
              if (!isPremium && onOpenPremium) {
                onOpenPremium();
              } else {
                setFilter('whoLikedMe');
                setCurrentIndex(0);
              }
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              filter === 'whoLikedMe'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md'
                : isPremium
                ? 'text-amber-300 hover:text-amber-200 border border-amber-500/40 bg-amber-500/10'
                : 'text-stone-400 hover:text-amber-300 border border-dashed border-amber-500/30'
            }`}
            title="Fonctionnalité Premium : Découvrir qui a flashé sur votre profil"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{language === 'fr' ? 'M’ont liké(e) (VIP)' : 'Liked Me (VIP)'}</span>
            {!isPremium && (
              <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1 rounded font-bold">🔒</span>
            )}
          </button>
        </div>
      </div>

      {/* Discovery Card or Empty State */}
      {currentProfile ? (
        <div className="relative bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
          {/* Main Portrait with Rich Scrim */}
          <div className="relative aspect-[3/4] w-full bg-stone-950 overflow-hidden">
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

            {/* Compatibility Score Top Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="bg-stone-950/80 backdrop-blur-md border border-amber-500/40 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-300 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentProfile.compatibilityScore}% {t.discover.compatibility}</span>
              </div>
            </div>

            {/* Verification Status Top Right */}
            {currentProfile.isVerified && (
              <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 rounded-full px-2.5 py-1 flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Niv. {currentProfile.verificationLevel}</span>
              </div>
            )}

            {/* Bottom Overlay info on Photo */}
            <div className="absolute bottom-4 left-4 right-4 text-stone-100">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold font-brand text-amber-100 flex items-center gap-2">
                  <span>{currentProfile.name}, {currentProfile.age}</span>
                </h2>
                <button
                  onClick={() => setSelectedProfileForDetail(currentProfile)}
                  className="p-2 bg-stone-900/80 hover:bg-stone-800 text-stone-300 rounded-full backdrop-blur-md transition-colors"
                  aria-label="Voir les détails complets"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-300 mb-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentProfile.city}, {currentProfile.country}</span>
                <span>·</span>
                <span>{currentProfile.profession}</span>
              </div>

              {/* Life Project Snippet */}
              <div className="bg-stone-900/90 backdrop-blur-md p-3 rounded-xl border border-stone-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-amber-200 font-semibold">
                  <span>Projet Matrimonial :</span>
                  <span>{currentProfile.lifeProject.marriageTimeline === 'under_1_year' ? 'Dans l’année' : '1 à 2 ans'}</span>
                </div>
                <p className="text-stone-300 line-clamp-2 text-[11px]">
                  "{currentProfile.bio}"
                </p>
                <div className="flex items-center gap-2 text-[10px] text-stone-400 pt-1 border-t border-stone-800/80">
                  <span>Famille : {currentProfile.lifeProject.familyPriority}/5</span>
                  <span>·</span>
                  <span>Stabilité financière : {currentProfile.lifeProject.financialStabilityPriority}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ergonomic Floating Action Button Bar */}
          <div className="p-4 bg-stone-950 border-t border-rose-950/40 flex items-center justify-center gap-6">
            {/* Pass ❌ */}
            <button
              onClick={handlePass}
              className="w-14 h-14 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center transition-transform active:scale-95 shadow-md"
              title={t.discover.pass}
            >
              <X className="w-6 h-6 stroke-[2]" />
            </button>

            {/* Favorite ⭐ */}
            <button
              onClick={handleLike}
              className="w-12 h-12 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-800/40 text-amber-400 flex items-center justify-center transition-transform active:scale-95 shadow-md"
              title={t.discover.favorite}
            >
              <Star className="w-5 h-5 fill-amber-400" />
            </button>

            {/* VIP Coup de Foudre Direct ⚡ */}
            <button
              onClick={() => {
                if (!isPremium && onOpenPremium) {
                  onOpenPremium();
                } else {
                  handleLike();
                }
              }}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-transform active:scale-95 shadow-md ${
                isPremium
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-stone-900 border-amber-500/30 text-amber-400/80 hover:text-amber-300'
              }`}
              title={language === 'fr' ? 'Coup de foudre VIP (Direct Note Vocale)' : 'VIP Instant Crush'}
            >
              <Zap className="w-5 h-5 fill-amber-400" />
            </button>

            {/* Like ❤️ - Ndolo Charte de l'Amour button */}
            <button
              onClick={handleLike}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 hover:from-rose-500 hover:to-amber-300 text-white flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-rose-950/80 group"
              title={t.discover.interested}
            >
              <Heart className="w-8 h-8 fill-white stroke-none group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-12 text-center text-stone-100 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-brand text-amber-100 mb-2">
            {t.discover.noMoreProfiles}
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mb-6">
            Revenez régulièrement pour découvrir de nouveaux profils vérifiés ou élargissez vos critères de localisation.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.discover.resetDeck}</span>
          </button>
        </div>
      )}

      {/* Full Profile Detail Modal */}
      {selectedProfileForDetail && (
        <ProfileDetailModal
          user={selectedProfileForDetail}
          isOpen={true}
          onClose={() => setSelectedProfileForDetail(null)}
          onLike={(user) => {
            onLikeCandidate(user);
            handleNext();
          }}
          onReport={onReportCandidate}
          language={language}
        />
      )}
    </div>
  );
};
