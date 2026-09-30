import React, { useState } from 'react';
import { 
  ShieldCheck, MapPin, Briefcase, GraduationCap, Languages, 
  Calendar, Edit3, Lock, Eye, Trash2, Heart, Sparkles, CheckCircle2, Camera, Crown, Zap 
} from 'lucide-react';
import { UserProfile, Language, UserRole } from '../types';
import { translations } from '../i18n/translations';

interface ProfileViewProps {
  currentUser: UserProfile;
  onOpenLifeProject: () => void;
  onOpenVerification: () => void;
  onOpenCreateProfile?: () => void;
  onOpenPremium?: () => void;
  activeRole?: UserRole;
  language: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onOpenLifeProject,
  onOpenVerification,
  onOpenCreateProfile,
  onOpenPremium,
  activeRole,
  language
}) => {
  const t = translations[language];

  const isPremium = activeRole === 'premium';

  // Privacy toggles from Section 41
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    showAgePublicly: true,
    allowDirectMessages: true
  });

  const [accountActionMessage, setAccountActionMessage] = useState<string | null>(null);

  const handleDeactivate = () => {
    setAccountActionMessage('Compte suspendu temporairement. Vos données restent protégées.');
    setTimeout(() => setAccountActionMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Top Banner & Avatar Lockup */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-rose-500/60 shadow-lg"
            />
            {currentUser.isVerified && (
              <span className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-brand text-amber-100">
                {currentUser.name}, {currentUser.age} ans
              </h1>
              
              <div className="flex items-center gap-2 self-center sm:self-auto">
                <button
                  onClick={onOpenVerification}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Niveau {currentUser.verificationLevel}/4</span>
                </button>

                {onOpenCreateProfile && (
                  <button
                    onClick={onOpenCreateProfile}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold hover:bg-rose-500/30 transition-colors"
                    title="Prendre un nouveau selfie avec vérification biométrique anti-gamin"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Selfie 18+</span>
                  </button>
                )}

                {onOpenPremium && (
                  <button
                    onClick={onOpenPremium}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                      isPremium
                        ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>{isPremium ? 'VIP Actif' : 'VIP Mode'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.city}, {currentUser.country}</span>
              <span>·</span>
              <span>{currentUser.maritalStatus === 'single' ? 'Célibataire' : 'Divorcé(e)'}</span>
            </div>

            <p className="text-xs text-stone-300 pt-2 leading-relaxed">
              "{currentUser.bio}"
            </p>
          </div>
        </div>
      </div>

      {accountActionMessage && (
        <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 text-xs rounded-xl text-center">
          {accountActionMessage}
        </div>
      )}

      {/* VIP Matrimonial Membership Status Card */}
      <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-rose-950/30 border border-amber-500/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-stone-950 flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-brand text-amber-100">
                  {language === 'fr' ? 'Abonnement Ndolo VIP Alliance' : 'Ndolo VIP Alliance Status'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isPremium
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isPremium ? (language === 'fr' ? 'ACTIF (Illimité)' : 'ACTIVE') : (language === 'fr' ? 'GRATUIT' : 'FREE')}
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                {isPremium 
                  ? (language === 'fr' ? 'Vous bénéficiez des likes illimités, du boost x10 et de la visibilité sur vos visiteurs.' : 'You have unlimited likes, 10x boost and viewer insights.')
                  : (language === 'fr' ? 'Passez au statut VIP pour débloquer les notes vocales directes et voir qui visite votre profil.' : 'Upgrade to VIP to unlock direct voice notes and profile viewers.')}
              </p>
            </div>
          </div>

          {onOpenPremium && (
            <button
              onClick={onOpenPremium}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 ml-2"
            >
              {isPremium ? (language === 'fr' ? 'Gérer' : 'Manage') : (language === 'fr' ? 'Activer VIP' : 'Get VIP')}
            </button>
          )}
        </div>

        {/* VIP Perks Micro-Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-300 flex items-center gap-1.5">
            <span className="text-amber-400">👑</span>
            <span className="truncate">Badge Couronne</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-300 flex items-center gap-1.5">
            <span className="text-rose-400">♥</span>
            <span className="truncate">Likes Illimités</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-300 flex items-center gap-1.5">
            <span className="text-amber-400">⚡</span>
            <span className="truncate">Boost x10 Ville</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-950/60 border border-stone-800 text-stone-300 flex items-center gap-1.5">
            <span className="text-blue-400">🎙️</span>
            <span className="truncate">Audio Direct</span>
          </div>
        </div>
      </div>

      {/* Projet de Vie Block */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold font-brand text-amber-100">
              {t.lifeProject.title}
            </h2>
          </div>

          <button
            onClick={onOpenLifeProject}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block mb-1">Objectif relationnel :</span>
            <span className="font-semibold text-stone-200">Mariage & construction de foyer</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block mb-1">Horizon pour le mariage :</span>
            <span className="font-semibold text-stone-200">
              {currentUser.lifeProject.marriageTimeline === 'under_1_year' ? 'Dans l’année' : '1 à 2 ans'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block mb-1">Priorité Famille :</span>
            <span className="font-semibold text-stone-200">{currentUser.lifeProject.familyPriority}/5</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] text-stone-400 block mb-1">Stabilité Financière :</span>
            <span className="font-semibold text-stone-200">{currentUser.lifeProject.financialStabilityPriority}/5</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-stone-400 block mb-1.5 font-medium">
            Valeurs & Principes spirituels :
          </span>
          <p className="text-xs text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-800">
            {currentUser.lifeProject.spiritualValues}
          </p>
        </div>
      </div>

      {/* Professional & Academic Profile */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold font-brand text-amber-100">
          Parcours & Centres d'Intérêt
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Profession : <strong className="text-stone-100">{currentUser.profession}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-stone-300">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Formation : <strong className="text-stone-100">{currentUser.education}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-stone-300">
            <Languages className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Langues : <strong className="text-stone-100">{currentUser.languages.join(', ')}</strong></span>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-[11px] text-stone-400 block mb-2 font-medium">Loisirs & Centres d'intérêt :</span>
          <div className="flex flex-wrap gap-1.5">
            {currentUser.lifeProject.lifestyleInterests.map((interest, i) => (
              <span
                key={i}
                className="text-xs bg-stone-950 text-stone-300 px-3 py-1 rounded-lg border border-stone-800"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Settings (Section 41) */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold font-brand text-amber-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Paramètres de Confidentialité & Discrétion</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-stone-300">Afficher mon statut en ligne</span>
            <input
              type="checkbox"
              checked={privacySettings.showOnlineStatus}
              onChange={(e) =>
                setPrivacySettings({ ...privacySettings, showOnlineStatus: e.target.checked })
              }
              className="accent-amber-500 w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-stone-300">Afficher mon âge sur mon profil public</span>
            <input
              type="checkbox"
              checked={privacySettings.showAgePublicly}
              onChange={(e) =>
                setPrivacySettings({ ...privacySettings, showAgePublicly: e.target.checked })
              }
              className="accent-amber-500 w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-stone-300">Autoriser les messages des profils compatibles</span>
            <input
              type="checkbox"
              checked={privacySettings.allowDirectMessages}
              onChange={(e) =>
                setPrivacySettings({ ...privacySettings, allowDirectMessages: e.target.checked })
              }
              className="accent-amber-500 w-4 h-4 rounded"
            />
          </label>
        </div>
      </div>

      {/* Account Deactivation / Deletion (Section 42) */}
      <div className="bg-stone-950 border border-stone-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-stone-300 font-semibold block">Gestion du compte</span>
          <span className="text-stone-500 text-[11px]">Désactivez ou supprimez définitivement vos données</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDeactivate}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg text-xs"
          >
            Désactiver mon compte
          </button>
          <button
            onClick={handleDeactivate}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-900/60 rounded-lg text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
