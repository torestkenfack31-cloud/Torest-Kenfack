import React, { useState } from 'react';
import { Sparkles, X, Heart, Users, DollarSign, Compass, Check } from 'lucide-react';
import { LifeProject, Language } from '../types';
import { translations } from '../i18n/translations';

interface LifeProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  lifeProject: LifeProject;
  onSave: (updated: LifeProject) => void;
  language: Language;
}

export const LifeProjectModal: React.FC<LifeProjectModalProps> = ({
  isOpen,
  onClose,
  lifeProject,
  onSave,
  language
}) => {
  const t = translations[language];
  const [formData, setFormData] = useState<LifeProject>(lifeProject);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-200 rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-brand text-amber-100">
              {t.lifeProject.title}
            </h2>
            <p className="text-xs text-stone-400">
              {t.lifeProject.subtitle}
            </p>
          </div>
        </div>

        {savedSuccess ? (
          <div className="py-12 text-center text-emerald-400 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold">Projet de vie mis à jour ! L'algorithme affine vos compatibilités.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4 text-xs">
            {/* Goal */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                {t.lifeProject.goalLabel}
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="serious_marriage">{t.lifeProject.goalMarriage}</option>
                <option value="long_term">{t.lifeProject.goalLongTerm}</option>
                <option value="explore_matrimonial">{t.lifeProject.goalExplore}</option>
              </select>
            </div>

            {/* Marriage Timeline */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                {t.lifeProject.timelineLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'under_1_year', label: t.lifeProject.timeline1Year },
                  { id: '1_to_2_years', label: t.lifeProject.timeline2Years },
                  { id: '2_to_3_years', label: t.lifeProject.timeline3Years },
                  { id: 'open', label: t.lifeProject.timelineOpen },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, marriageTimeline: item.id as any })}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      formData.marriageTimeline === item.id
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Children Desire */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                {t.lifeProject.childrenLabel}
              </label>
              <select
                value={formData.childrenDesire}
                onChange={(e) => setFormData({ ...formData, childrenDesire: e.target.value as any })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="wants_children">{t.lifeProject.childrenYes}</option>
                <option value="already_has_wants_more">{t.lifeProject.childrenMore}</option>
                <option value="already_has_enough">{t.lifeProject.childrenEnough}</option>
              </select>
            </div>

            {/* Relocation */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                {t.lifeProject.relocationLabel}
              </label>
              <select
                value={formData.relocationWillingness}
                onChange={(e) => setFormData({ ...formData, relocationWillingness: e.target.value as any })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="stay_in_city">{t.lifeProject.relocationStay}</option>
                <option value="same_country">{t.lifeProject.relocationCountry}</option>
                <option value="international_diaspora">{t.lifeProject.relocationDiaspora}</option>
              </select>
            </div>

            {/* Sliders: Family and Financial Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
              <div>
                <div className="flex justify-between mb-1 text-stone-300 font-semibold">
                  <span>Priorité Famille</span>
                  <span className="font-mono text-amber-300">{formData.familyPriority} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.familyPriority}
                  onChange={(e) => setFormData({ ...formData, familyPriority: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-stone-300 font-semibold">
                  <span>Stabilité Financière</span>
                  <span className="font-mono text-amber-300">{formData.financialStabilityPriority} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.financialStabilityPriority}
                  onChange={(e) => setFormData({ ...formData, financialStabilityPriority: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Spiritual Values */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Principes et valeurs spirituelles
              </label>
              <input
                type="text"
                value={formData.spiritualValues}
                onChange={(e) => setFormData({ ...formData, spiritualValues: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                placeholder="Ex : Foi chrétienne, respect mutuel, bienveillance..."
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                {t.lifeProject.saveChanges}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
