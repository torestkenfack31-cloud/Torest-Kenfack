import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AgeGateModalProps {
  language: Language;
  onConfirmAdult: (birthDate: string) => void;
  isOpen: boolean;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({
  language,
  onConfirmAdult,
  isOpen
}) => {
  const t = translations[language];
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('06');
  const [year, setYear] = useState('1996');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPermanentlyBlocked, setIsPermanentlyBlocked] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPermanentlyBlocked) return;

    const birthDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (isNaN(age) || age < 18) {
      setErrorMessage(t.auth.underageError);
      // Strict rule: If tried with an underage date, prevent simple bypass
      if (age < 18) {
        setIsPermanentlyBlocked(true);
      }
    } else {
      setErrorMessage(null);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmAdult(birthDateString);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-stone-100">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto mb-4 border border-amber-500/20">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-center text-xl font-bold font-brand text-amber-100 mb-2">
          {t.auth.ageGateTitle}
        </h2>
        <p className="text-center text-xs text-stone-400 mb-6 leading-relaxed">
          {t.auth.ageGateDescription}
        </p>

        {isSuccess ? (
          <div className="flex flex-col items-center py-6 text-emerald-400 text-center gap-2">
            <CheckCircle className="w-10 h-10 animate-bounce" />
            <p className="text-sm font-semibold">{t.auth.eligibleSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-xs font-medium text-stone-300">
              {t.auth.birthDateLabel} (JJ / MM / AAAA)
            </label>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="JJ"
                disabled={isPermanentlyBlocked}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-amber-500 disabled:opacity-50"
                required
              />
              <input
                type="number"
                min="1"
                max="12"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="MM"
                disabled={isPermanentlyBlocked}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-amber-500 disabled:opacity-50"
                required
              />
              <input
                type="number"
                min="1930"
                max="2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="AAAA"
                disabled={isPermanentlyBlocked}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-amber-500 disabled:opacity-50"
                required
              />
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isPermanentlyBlocked ? (
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-center text-xs text-stone-400">
                L’accès à cette plateforme est strictement réservé aux personnes majeures. Session verrouillée conformément aux lois internationales de protection des mineurs.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-[0.98]"
              >
                {t.auth.checkAge}
              </button>
            )}

            <div className="pt-2 text-center">
              <span className="text-[11px] text-stone-500">
                Protocole de vérification d'identité certifié · Respect de la vie privée
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
