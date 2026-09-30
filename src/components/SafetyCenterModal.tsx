import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, Eye, AlertOctagon, X, CheckCircle, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface SafetyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SafetyCenterModal: React.FC<SafetyCenterModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const t = translations[language];
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState('scam');
  const [reportDetails, setReportDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportDetails('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-200 rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-brand text-amber-100">
              {t.safety.title}
            </h2>
            <p className="text-xs text-stone-400">
              {t.safety.subtitle}
            </p>
          </div>
        </div>

        {/* 4 Golden Rules Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t.safety.tip1Title}</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {t.safety.tip1Text}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Eye className="w-4 h-4 shrink-0" />
              <span>{t.safety.tip2Title}</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {t.safety.tip2Text}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
              <HeartHandshake className="w-4 h-4 shrink-0" />
              <span>{t.safety.tip3Title}</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {t.safety.tip3Text}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>{t.safety.tip4Title}</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {t.safety.tip4Text}
            </p>
          </div>
        </div>

        {/* Interactive Signalement / Report Form */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold font-brand text-amber-200 mb-2 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>{t.safety.reportTitle}</span>
          </h3>

          {reportSubmitted ? (
            <div className="py-4 text-center text-emerald-400 flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 animate-bounce" />
              <p className="text-xs font-semibold">Signalement transmis en priorité à l'équipe de modération humaine.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Motif de l'alerte</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="scam">Tentative d'extorsion ou demande d'argent</option>
                  <option value="fake">Faux profil ou usurpation d'identité</option>
                  <option value="harassment">Propos irrespectueux, harcèlement ou indécence</option>
                  <option value="underage">Suspicion de mineur</option>
                  <option value="other">Autre comportement suspect</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Détails ou précisions</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Décrivez les faits constatés pour permettre une intervention rapide de notre équipe..."
                  rows={2}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
                >
                  Transmettre le signalement
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
