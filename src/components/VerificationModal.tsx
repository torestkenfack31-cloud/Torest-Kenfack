import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, Phone, Mail, Camera, FileText, 
  X, AlertCircle, ArrowRight, Sparkles 
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../i18n/translations';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpgradeLevel: (newLevel: 1 | 2 | 3 | 4) => void;
  language: Language;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeLevel,
  language
}) => {
  const t = translations[language];
  const [currentLevel, setCurrentLevel] = useState<number>(currentUser.verificationLevel);
  const [phoneInput, setPhoneInput] = useState('+237 6');
  const [otpInput, setOtpInput] = useState('');
  const [step, setStep] = useState<'levels' | 'otp' | 'selfie' | 'id_doc'>('levels');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
    setStatusMessage('Code SMS de validation (4 chiffres) expédié à votre numéro.');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length === 4) {
      setCurrentLevel(2);
      onUpgradeLevel(2);
      setStatusMessage('Numéro de téléphone vérifié avec succès ! Niveau 2 débloqué.');
      setTimeout(() => {
        setStep('levels');
        setStatusMessage(null);
      }, 1500);
    }
  };

  const handleSimulateSelfie = () => {
    setStatusMessage('Analyse biométrique en cours : présence humaine et clignement confirmés...');
    setTimeout(() => {
      setCurrentLevel(3);
      onUpgradeLevel(3);
      setStatusMessage('Selfie vidéo validé avec succès ! Niveau 3 débloqué.');
      setTimeout(() => {
        setStep('levels');
        setStatusMessage(null);
      }, 1500);
    }, 2000);
  };

  const handleSimulateIdDoc = () => {
    setStatusMessage('Transmission sécurisée et analyse de la pièce officielle en cours...');
    setTimeout(() => {
      setCurrentLevel(4);
      onUpgradeLevel(4);
      setStatusMessage('Passeport/CNI authentifié ! Félicitations, vous avez atteint le Niveau 4 (Confiance Maximale).');
      setTimeout(() => {
        setStep('levels');
        setStatusMessage(null);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-200 rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-brand text-amber-100">
              {t.verification.badgeTitle}
            </h2>
            <p className="text-xs text-stone-400">
              Protocole de vérification d'identité à 4 niveaux (Trust & Safety)
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="my-3 p-3 bg-amber-950/60 border border-amber-800 text-amber-200 text-xs rounded-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Levels view */}
        {step === 'levels' && (
          <div className="space-y-4 mt-4">
            <div className="space-y-3">
              {/* Level 1 */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-200">{t.verification.level1}</h4>
                    <span className="text-[10px] text-stone-400">samuel.m***@polytechnique.cm</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validé</span>
                </span>
              </div>

              {/* Level 2 */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-200">{t.verification.level2}</h4>
                    <span className="text-[10px] text-stone-400">Validation par code SMS sécurisé</span>
                  </div>
                </div>
                {currentLevel >= 2 ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validé</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setStep('otp')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Activer
                  </button>
                )}
              </div>

              {/* Level 3 */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-200">{t.verification.level3}</h4>
                    <span className="text-[10px] text-stone-400">Présence faciale en direct anti-usurpation</span>
                  </div>
                </div>
                {currentLevel >= 3 ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validé</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setStep('selfie')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Passer le selfie
                  </button>
                )}
              </div>

              {/* Level 4 */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-200">{t.verification.level4}</h4>
                    <span className="text-[10px] text-stone-400">Contrôle officiel CNI / Passeport</span>
                  </div>
                </div>
                {currentLevel >= 4 ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validé</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setStep('id_doc')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Soumettre CNI
                  </button>
                )}
              </div>
            </div>

            {/* Disclaimer notice from Section 15 of spec */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-xl text-[11px] text-stone-400 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.verification.trustNotice}</span>
            </div>
          </div>
        )}

        {/* Step: OTP Phone */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Numéro de téléphone</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Code reçu par SMS (Code test : 2370)</label>
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="4 chiffres"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm font-mono tracking-widest text-center text-amber-300"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('levels')}
                className="px-4 py-2 bg-stone-800 text-stone-300 text-xs rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl"
              >
                Confirmer le code
              </button>
            </div>
          </form>
        )}

        {/* Step: Selfie Simulation */}
        {step === 'selfie' && (
          <div className="text-center py-6 space-y-4 mt-2">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center mx-auto bg-stone-950">
              <Camera className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-xs text-stone-300 max-w-sm mx-auto">
              Placez votre visage au centre du cadre et effectuez un léger mouvement de tête pour valider la détection de vivacité.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setStep('levels')}
                className="px-4 py-2 bg-stone-800 text-stone-300 text-xs rounded-xl"
              >
                Retour
              </button>
              <button
                onClick={handleSimulateSelfie}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md"
              >
                Démarrer la vérification
              </button>
            </div>
          </div>
        )}

        {/* Step: ID Document Simulation */}
        {step === 'id_doc' && (
          <div className="text-center py-6 space-y-4 mt-2">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-amber-400 flex items-center justify-center mx-auto bg-stone-950">
              <FileText className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-xs text-stone-300 max-w-sm mx-auto">
              Scannez ou importez le recto de votre CNI camerounaise ou de votre Passeport officiel. Ce document reste strictement confidentiel et n'est jamais publié.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setStep('levels')}
                className="px-4 py-2 bg-stone-800 text-stone-300 text-xs rounded-xl"
              >
                Retour
              </button>
              <button
                onClick={handleSimulateIdDoc}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md"
              >
                Télécharger & Certifier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
