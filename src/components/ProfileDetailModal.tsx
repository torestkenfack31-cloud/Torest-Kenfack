import React from 'react';
import { X, ShieldCheck, Heart, MapPin, Briefcase, GraduationCap, Languages, Calendar, AlertOctagon } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { translations } from '../i18n/translations';

interface ProfileDetailModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLike: (user: UserProfile) => void;
  onReport: (user: UserProfile) => void;
  language: Language;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onLike,
  onReport,
  language
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl text-stone-100 my-8 max-h-[90vh] flex flex-col">
        {/* Sticky top action row */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => onReport(user)}
            className="p-2 bg-stone-950/70 hover:bg-rose-950/80 text-stone-400 hover:text-rose-300 rounded-full backdrop-blur-md transition-colors"
            title="Signaler ce profil"
          >
            <AlertOctagon className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-stone-950/70 hover:bg-stone-800 text-stone-300 rounded-full backdrop-blur-md transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Main Photo & Identification Header */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] bg-stone-950">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold font-brand text-amber-100">
                    {user.name}, {user.age}
                  </h2>
                  {user.isVerified && (
                    <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Vérifié Niv. {user.verificationLevel}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user.city}, {user.country}</span>
                  </span>
                  <span>·</span>
                  <span>{user.maritalStatus === 'single' ? 'Célibataire' : 'Divorcé(e)'}</span>
                </div>
              </div>

              {user.compatibilityScore && (
                <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl px-3 py-2 text-right">
                  <span className="text-xs text-amber-300 block font-medium">Compatibilité</span>
                  <span className="text-xl font-bold text-amber-200">{user.compatibilityScore}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Photo Gallery if available */}
          {user.secondaryPhotos && user.secondaryPhotos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {user.secondaryPhotos.map((photo, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
                  <img
                    src={photo}
                    alt={`${user.name} gallery ${i}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bio */}
          <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
              Présentation
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              {user.bio}
            </p>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-950/40 border border-stone-800">
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px]">Profession</span>
                <span className="text-stone-200 font-medium">{user.profession}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-950/40 border border-stone-800">
              <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px]">Formation</span>
                <span className="text-stone-200 font-medium">{user.education}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-950/40 border border-stone-800">
              <Languages className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px]">Langues parlées</span>
                <span className="text-stone-200 font-medium">{user.languages.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-950/40 border border-stone-800">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px]">Dernière activité</span>
                <span className="text-stone-200 font-medium">{user.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Central Section: Projet de Vie & Valeurs */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-800/30 pb-3">
              <h3 className="font-brand text-base font-bold text-amber-200 flex items-center gap-2">
                <span>✦</span>
                <span>Projet de Vie & Foyer</span>
              </h3>
              <span className="text-xs text-amber-400/90 font-medium">Priorité Matrimoniale</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block mb-1">Horizon pour le mariage :</span>
                <span className="font-semibold text-stone-200">
                  {user.lifeProject.marriageTimeline === 'under_1_year' ? 'Dans l’année (< 1 an)' : 'Dans 1 à 2 ans'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block mb-1">Désir d’enfants :</span>
                <span className="font-semibold text-stone-200">
                  {user.lifeProject.childrenDesire === 'wants_children' ? 'Souhaite fonder une famille' : 'Ouvert à la discussion'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block mb-1">Mobilité géographique :</span>
                <span className="font-semibold text-stone-200">
                  {user.lifeProject.relocationWillingness === 'stay_in_city' ? 'Souhaite vivre dans sa ville' : 'Prêt(e) à la mobilité'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block mb-1">Valeurs spirituelles :</span>
                <span className="font-semibold text-stone-200">
                  {user.lifeProject.spiritualValues}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-stone-400 block text-xs mb-2">Centres d'intérêt & Loisirs :</span>
              <div className="flex flex-wrap gap-1.5">
                {user.lifeProject.lifestyleInterests.map((interest, i) => (
                  <span key={i} className="text-xs text-stone-300 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center gap-3">
          <button
            onClick={() => {
              onLike(user);
              onClose();
            }}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-stone-950" />
            <span>Manifester mon intérêt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
