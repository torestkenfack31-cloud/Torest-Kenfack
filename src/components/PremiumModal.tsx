import React, { useState } from 'react';
import { 
  Crown, Check, Sparkles, Heart, Zap, Eye, ShieldCheck, 
  MapPin, MessageSquare, Flame, Star, X, Smartphone, CreditCard,
  Lock, PhoneCall, ShoppingBag, Award, UserCheck, EyeOff, FileText, CheckCircle2
} from 'lucide-react';
import { Language, UserRole } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  onUpgradeToPremium: () => void;
  language: Language;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onUpgradeToPremium,
  language
}) => {
  if (!isOpen) return null;

  const isAlreadyPremium = activeRole === 'premium';
  const [selectedPlan, setSelectedPlan] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'om' | 'card'>('om');
  const [phoneInput, setPhoneInput] = useState('699 00 11 22');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const plans = [
    {
      id: 'month' as const,
      name: language === 'fr' ? '1 Mois Découverte' : '1 Month Discovery',
      price: '4 900 FCFA',
      period: language === 'fr' ? '/mois' : '/mo',
      badge: null,
      savings: null
    },
    {
      id: 'quarter' as const,
      name: language === 'fr' ? '3 Mois Alliance (Idéal)' : '3 Months Alliance (Best)',
      price: '11 900 FCFA',
      period: language === 'fr' ? 'soit ~3 960 F/mois' : '~3,960 F/mo',
      badge: language === 'fr' ? 'LE PLUS POPULAIRE' : 'MOST POPULAR',
      savings: language === 'fr' ? 'Économisez 20%' : 'Save 20%'
    },
    {
      id: 'year' as const,
      name: language === 'fr' ? '1 An Mariage & Sérénité' : '1 Year Marriage & Peace',
      price: '29 900 FCFA',
      period: language === 'fr' ? 'soit ~2 490 F/mois' : '~2,490 F/mo',
      badge: language === 'fr' ? 'MEILLEURE OFFRE' : 'BEST VALUE',
      savings: language === 'fr' ? 'Économisez 50%' : 'Save 50%'
    }
  ];

  const premiumFeatures = [
    {
      icon: Eye,
      title: language === 'fr' ? 'Découvrir qui a visité & liké votre profil' : 'See who viewed & liked your profile',
      desc: language === 'fr' ? 'Consultez la liste secrète de tous les cœurs qui vous admirent en temps réel avant même de matcher.' : 'View the real-time secret list of admirers before matching.'
    },
    {
      icon: Heart,
      title: language === 'fr' ? 'Likes et Coups de Foudre illimités' : 'Unlimited Likes & Instant Crushes',
      desc: language === 'fr' ? 'Plus aucun quota journalier. Manifestez votre intérêt sans aucune restriction.' : 'No daily limit on showing interest to marriage-ready candidates.'
    },
    {
      icon: Zap,
      title: language === 'fr' ? 'Boost Prioritaire Mensuel (Visibilité x10)' : 'Monthly Priority Boost (10x Views)',
      desc: language === 'fr' ? 'Votre profil est propulsé en tête des recherches à Douala, Yaoundé ou dans la Diaspora.' : 'Your profile gets featured at the top of searches in Cameroon & diaspora.'
    },
    {
      icon: Crown,
      title: language === 'fr' ? 'Badge Doré Couronne « Ndolo VIP »' : 'Golden Crown VIP Badge',
      desc: language === 'fr' ? 'Symbole d’honneur et de sérieux matrimonial certifié pour inspirer une confiance immédiate.' : 'Badge of honor and matrimonial seriousness inspiring immediate trust.'
    },
    {
      icon: MessageSquare,
      title: language === 'fr' ? 'Notes Vocales & Messages Directs avant match' : 'Direct Voice Notes & Priority Messaging',
      desc: language === 'fr' ? 'Envoyez un message d’approche audio respectueux pour briser la glace avec votre voix.' : 'Send a personal audio note to introduce yourself respectfully.'
    },
    {
      icon: MapPin,
      title: language === 'fr' ? 'Passeport Diaspora & Villes Internationales' : 'Diaspora Passport & Global Search',
      desc: language === 'fr' ? 'Changez de localisation à volonté : Paris, Bruxelles, Montréal, Washington, Abidjan.' : 'Change location freely: Paris, Brussels, Montreal, Washington, Abidjan.'
    },
    {
      icon: EyeOff,
      title: language === 'fr' ? 'Mode Furtif & Confidentialité Totale' : 'Stealth & Incognito Mode',
      desc: language === 'fr' ? 'Visitez les profils sans laisser de trace et masquez votre statut en ligne ou votre âge.' : 'Browse profiles completely anonymously without notifying anyone.'
    },
    {
      icon: PhoneCall,
      title: language === 'fr' ? 'Appels Audio Sécurisés In-App' : 'In-App Encrypted Audio Calls',
      desc: language === 'fr' ? 'Appelez vos correspondants directement sans jamais divulguer votre numéro de téléphone.' : 'Make encrypted voice calls without sharing your private phone number.'
    },
    {
      icon: ShoppingBag,
      title: language === 'fr' ? 'Réduction VIP -15% Boutique Mariage & Stylistes' : 'VIP 15% Discount on Wedding Stylists',
      desc: language === 'fr' ? 'Avantages exclusifs sur la confection de robes, costumes 3 pièces et tenues traditionnelles Toghu.' : 'Special discounts with top bridal dressmakers, Toghu designers and tailors.'
    },
    {
      icon: UserCheck,
      title: language === 'fr' ? 'Conciergerie & Conseil Matrimonial Dédié' : 'Dedicated Matrimonial Concierge',
      desc: language === 'fr' ? 'Accès direct à nos conseillers matrimoniaux pour des conseils personnalisés sur la dot et le foyer.' : 'Personal guidance from matrimonial advisors on bride wealth, family & marriage.'
    }
  ];

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeToPremium();
      setSuccessMessage(
        language === 'fr'
          ? '🎉 Félicitations ! Votre compte est maintenant activé en Mode Premium.'
          : '🎉 Congratulations! Your account is now upgraded to Premium.'
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 rounded-3xl border border-amber-500/40 shadow-2xl p-5 sm:p-7 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full bg-stone-900 border border-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-inner">
            <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{language === 'fr' ? 'Expérience Matrimoniale VIP' : 'VIP Matrimonial Experience'}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-brand text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-400">
            {language === 'fr' ? 'Ndolo Premium Alliance' : 'Ndolo Premium Alliance'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            {language === 'fr'
              ? 'Multipliez par 5 vos chances de concrétiser une alliance noble et durable grâce aux outils d’élite.'
              : 'Multiply by 5 your chances of entering a holy and lasting marriage with elite matrimonial features.'}
          </p>
        </div>

        {/* Current Status pill */}
        {isAlreadyPremium && (
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>{language === 'fr' ? 'Votre abonnement Premium est actuellement actif.' : 'Your Premium subscription is currently active.'}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-bold text-center animate-pulse">
            {successMessage}
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {premiumFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className="p-3 rounded-2xl bg-stone-900/70 border border-stone-800/90 flex items-start gap-3 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs font-bold text-stone-100">{feat.title}</h4>
                  <p className="text-[11px] text-stone-400 leading-tight">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            {language === 'fr' ? '1. Choisissez votre formule :' : '1. Choose your plan:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-950/40 to-stone-900 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 right-3 text-[9px] font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 px-2 py-0.5 rounded-full shadow">
                      {plan.badge}
                    </span>
                  )}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-stone-200 block">{plan.name}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-amber-300">{plan.price}</span>
                      <span className="text-[10px] text-stone-400">{plan.period}</span>
                    </div>
                  </div>
                  {plan.savings && (
                    <span className="text-[10px] font-semibold text-emerald-400 mt-2 block">
                      {plan.savings}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods (Cameroon Local Focus: Orange Money, MTN MoMo, Card) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            {language === 'fr' ? '2. Mode de paiement sécurisé :' : '2. Secure Payment Method:'}
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('om')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'om'
                  ? 'bg-orange-500/20 border-orange-500 text-orange-200 shadow-md'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Smartphone className="w-4 h-4 text-orange-400" />
              <span>Orange Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('momo')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'momo'
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-200 shadow-md'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Smartphone className="w-4 h-4 text-yellow-400" />
              <span>MTN Mobile Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-200 shadow-md'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Carte Visa/Master</span>
            </button>
          </div>

          {(paymentMethod === 'om' || paymentMethod === 'momo') && (
            <div className="pt-1 space-y-1">
              <label className="text-[11px] text-stone-400">
                {language === 'fr' ? 'Numéro de téléphone pour le prompt de paiement :' : 'Phone number for payment push prompt:'}
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="6XX XX XX XX"
                className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-stone-500">
                {language === 'fr' 
                  ? 'Un code USSD sécurisé apparaîtra sur votre téléphone pour valider la transaction.'
                  : 'A secure USSD push prompt will appear on your phone to confirm.'}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>{language === 'fr' ? 'Validation en cours...' : 'Processing...'}</span>
            ) : (
              <>
                <Crown className="w-5 h-5 text-stone-950 fill-stone-950" />
                <span>
                  {language === 'fr' 
                    ? `Activer le Mode Premium (${plans.find(p => p.id === selectedPlan)?.price})`
                    : `Activate Premium Mode (${plans.find(p => p.id === selectedPlan)?.price})`}
                </span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === 'fr' 
                ? 'Paiement sans engagement · Annulation en 1 clic · Confidentialité garantie.'
                : 'No long-term commitment · 1-click cancel · 100% privacy protected.'}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};
