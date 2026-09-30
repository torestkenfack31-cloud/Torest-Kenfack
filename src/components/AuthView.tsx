import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, Lock, Mail, Phone, Eye, EyeOff, Camera, ShieldCheck, 
  AlertTriangle, CheckCircle2, RefreshCw, Calendar, MapPin, 
  Briefcase, ArrowRight, Sparkles, User, ShieldAlert 
} from 'lucide-react';
import { Language, UserProfile, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { NdoloLogo } from './NdoloLogo';
import { currentUserMock } from '../data/mockData';

interface AuthViewProps {
  onLoginSuccess: (user: UserProfile, role?: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  language,
  onLanguageChange
}) => {
  const t = translations[language];

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('samuel.m@polytechnique.cm');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register wizard state (Steps: 1 = Info & Account, 2 = Age Gate 18+, 3 = Live Selfie & Anti-Minor AI, 4 = Life Project)
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3 | 4>(1);

  // Register Form Data
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regGender, setRegGender] = useState<'female' | 'male'>('female');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+237 6');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('Douala');
  const [regCountry, setRegCountry] = useState('Cameroun');
  const [regProfession, setRegProfession] = useState('');

  // Age Gate (Step 2)
  const [birthDay, setBirthDay] = useState('18');
  const [birthMonth, setBirthMonth] = useState('08');
  const [birthYear, setBirthYear] = useState('1997');
  const [ageError, setAgeError] = useState<string | null>(null);

  // Live Camera Selfie & Anti-Minor AI (Step 3)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [capturedSelfieUrl, setCapturedSelfieUrl] = useState<string | null>(null);
  const [isAnalyzingSelfie, setIsAnalyzingSelfie] = useState(false);
  const [selfieAnalysis, setSelfieAnalysis] = useState<{
    status: 'idle' | 'adult_verified' | 'child_detected';
    estimatedAge?: number;
    confidence?: number;
    message?: string;
  }>({ status: 'idle' });

  // Life Project (Step 4)
  const [marriageTimeline, setMarriageTimeline] = useState<'under_1_year' | '1_to_2_years' | 'open'>('under_1_year');
  const [childrenDesire, setChildrenDesire] = useState<'wants_children' | 'already_has_wants_more'>('wants_children');
  const [spiritualValues, setSpiritualValues] = useState('Foi chrétienne, respect mutuel et sanctification');

  // Webcam lifecycle on Step 3
  useEffect(() => {
    if (authMode === 'register' && registerStep === 3 && !capturedSelfieUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [authMode, registerStep, capturedSelfieUrl]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
        });
        setCameraStream(stream);
        setHasCameraAccess(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch {
      setHasCameraAccess(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    setTimeout(() => {
      setIsLoading(false);
      // Logged in with default mock user
      onLoginSuccess(currentUserMock, 'user');
    }, 800);
  };

  // Demo accounts instant login
  const handleQuickDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin' || role === 'moderator') {
        onLoginSuccess({
          ...currentUserMock,
          name: 'Superviseur Modération',
          role
        }, role);
      } else if (role === 'professional') {
        onLoginSuccess({
          ...currentUserMock,
          name: 'Palais des Noces Douala',
          role: 'professional',
          profession: 'Organisateur & Traiteur Agréé'
        }, 'professional');
      } else {
        onLoginSuccess(currentUserMock, role);
      }
    }, 500);
  };

  // Register Step 1 -> Step 2
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regEmail.trim()) return;
    setRegisterStep(2);
  };

  // Register Step 2 -> Step 3 (Strict 18+ Age calculation)
  const handleValidateAgeStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const bDate = new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay));
    const now = new Date();
    let computedAge = now.getFullYear() - bDate.getFullYear();
    const mDiff = now.getMonth() - bDate.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < bDate.getDate())) {
      computedAge--;
    }

    if (isNaN(computedAge) || computedAge < 18) {
      setAgeError("Inscription impossible : Ndolo est strictement interdit aux personnes de moins de 18 ans.");
      return;
    }

    setAgeError(null);
    setRegisterStep(3);
  };

  // Register Step 3: Capture Selfie & Run AI Anti-Minor Scan
  const handleCaptureSelfie = (forceMinorTest?: boolean) => {
    setIsAnalyzingSelfie(true);
    setSelfieAnalysis({ status: 'idle' });

    if (videoRef.current && hasCameraAccess) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 400;
        canvas.height = videoRef.current.videoHeight || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          setCapturedSelfieUrl(canvas.toDataURL('image/jpeg'));
        }
      } catch {
        setCapturedSelfieUrl('/src/assets/images/profile_woman_yaounde_1790589925857.jpg');
      }
    } else {
      setCapturedSelfieUrl('/src/assets/images/profile_woman_yaounde_1790589925857.jpg');
    }

    stopCamera();

    // Biometric AI analysis simulation
    setTimeout(() => {
      setIsAnalyzingSelfie(false);
      if (forceMinorTest) {
        setSelfieAnalysis({
          status: 'child_detected',
          estimatedAge: 15,
          confidence: 97.2,
          message: "Alerte Sécurité Enfance : les traits biométriques indiquent une personne mineure. Inscription bloquée."
        });
      } else {
        const declaredAge = new Date().getFullYear() - Number(birthYear);
        const estAge = Math.max(22, declaredAge);
        setSelfieAnalysis({
          status: 'adult_verified',
          estimatedAge: estAge,
          confidence: 98.9,
          message: `Majorité 18+ confirmée avec succès (Âge biométrique estimé : ~${estAge} ans). Présence de mineur exclue.`
        });
      }
    }, 1800);
  };

  const handleRetakeSelfie = () => {
    setCapturedSelfieUrl(null);
    setSelfieAnalysis({ status: 'idle' });
    startCamera();
  };

  // Register Final Step: Create account and log in
  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: `${regFirstName.trim()} ${regLastName.trim()}`.trim() || 'Membre Ndolo',
      age: new Date().getFullYear() - Number(birthYear),
      birthDate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
      gender: regGender,
      city: regCity,
      country: regCountry,
      profession: regProfession || 'Cadre & Entrepreneur',
      education: 'Enseignement Supérieur',
      languages: ['Français', 'Anglais'],
      maritalStatus: 'single',
      hasChildren: childrenDesire === 'already_has_wants_more',
      secondaryPhotos: [],
      bio: "À la recherche d'une personne sincère et respectueuse pour fonder un foyer durable dans l'amour et la piété.",
      avatar: capturedSelfieUrl || '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      isVerified: true,
      verificationLevel: 3,
      verifiedDetails: {
        emailVerified: true,
        phoneVerified: true,
        selfieVerified: true,
        idDocumentVerified: false
      },
      lifeProject: {
        goal: 'serious_marriage',
        marriageTimeline,
        childrenDesire,
        relocationWillingness: 'stay_in_city',
        familyPriority: 5,
        financialStabilityPriority: 5,
        spiritualValues,
        lifestyleInterests: ['Valeurs traditionnelles', 'Foyer & Famille', 'Voyages']
      },
      role: 'user',
      isOnline: true,
      lastActive: 'En ligne maintenant'
    };

    onLoginSuccess(newUser, 'user');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Bar with Logo & Language Selector */}
      <header className="border-b border-rose-950/40 bg-stone-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <NdoloLogo size="md" showSubtitle={true} />

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                language === 'fr'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Passer en Français"
            >
              FR 🇫🇷
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                language === 'en'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Switch to English"
            >
              EN 🇬🇧
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-stone-900 border border-rose-950/60 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero Column: Brand Story & Romantic Charte */}
          <div className="lg:col-span-5 bg-gradient-to-b from-stone-950 via-rose-950/40 to-stone-950 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-rose-950/50 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <span>♥</span>
                <span>Sanctuaire 18+ · Cameroun & Diaspora</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-brand text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-rose-200 to-amber-200 leading-tight">
                L'Amour Pur & le Mariage Sacré.
              </h1>

              <p className="text-xs text-rose-100/70 leading-relaxed">
                Rejoignez des milliers d'hommes et de femmes engagés vers le mariage. 
                Une communauté d'honneur protégée par le contrôle d'âge 18+ et la vérification faciale anti-mineur.
              </p>

              {/* Guarantees List */}
              <div className="space-y-2.5 pt-4 text-xs">
                <div className="flex items-center gap-2 text-stone-200">
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>100% de profils majeurs vérifiés par selfie IA</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Compatibilité basée sur le projet de vie & valeurs</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Protection financière & zéro tolérance aux arnaques</span>
                </div>
              </div>
            </div>

            {/* Quote of Love */}
            <div className="mt-8 pt-4 border-t border-rose-950/50 text-[11px] text-rose-300/80 italic">
              « Le Ndolo est patient, plein de bonté et recherche la vérité du cœur. »
            </div>
          </div>

          {/* Right Column: Interactive Login & Register Forms */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            
            {/* Tab Switcher: Connexion / Inscription */}
            <div className="flex items-center gap-2 p-1 bg-stone-950 border border-stone-800 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Créer un compte (18+)
              </button>
            </div>

            {/* ----------------- MODE CONNEXION ----------------- */}
            {authMode === 'login' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold font-brand text-stone-100">
                    Bon retour sur Ndolo
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Connectez-vous pour retrouver vos messages et vos affinités.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">
                      Email ou Numéro de téléphone (+237...)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="Ex : samuel@exemple.com ou +237 6..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-stone-300 font-medium">Mot de passe</label>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Un lien sécurisé de réinitialisation vous a été envoyé par email/SMS."); }} className="text-[11px] text-rose-400 hover:underline">
                        Mot de passe oublié ?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-10 py-2.5 text-stone-100 focus:outline-none focus:border-rose-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/60 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Accéder à mon espace Ndolo</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Instant Demo Accounts Picker for testing all profiles */}
                <div className="pt-4 border-t border-stone-800 space-y-2">
                  <span className="text-[10px] text-stone-400 block font-semibold uppercase tracking-wider text-center">
                    Comptes Démo en 1 clic
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('user')}
                      className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 text-left transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate">Samuel (Célibataire Douala)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('premium')}
                      className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-amber-800/40 text-amber-200 text-left transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate">Membre Premium ♥</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('professional')}
                      className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 text-left transition-colors flex items-center gap-2"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="truncate">Prestataire Mariage</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('admin')}
                      className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/60 text-rose-200 text-left transition-colors flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate">Modérateur / Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- MODE INSCRIPTION (WIZARD 4 ÉTAPES) ----------------- */}
            {authMode === 'register' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Stepper Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-[11px]">
                  <span className={`font-semibold ${registerStep >= 1 ? 'text-rose-400' : 'text-stone-500'}`}>
                    1. Identité
                  </span>
                  <span>→</span>
                  <span className={`font-semibold ${registerStep >= 2 ? 'text-rose-400' : 'text-stone-500'}`}>
                    2. Âge 18+
                  </span>
                  <span>→</span>
                  <span className={`font-semibold ${registerStep >= 3 ? 'text-rose-400' : 'text-stone-500'}`}>
                    3. Selfie Anti-Gamin
                  </span>
                  <span>→</span>
                  <span className={`font-semibold ${registerStep >= 4 ? 'text-rose-400' : 'text-stone-500'}`}>
                    4. Projet
                  </span>
                </div>

                {/* REGISTER STEP 1 : Identité & Mot de passe */}
                {registerStep === 1 && (
                  <form onSubmit={handleNextStep1} className="space-y-3.5 text-xs">
                    <div>
                      <h3 className="text-base font-bold font-brand text-stone-100">
                        Créer votre profil d'honneur
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Vos informations sont protégées et traitées avec discrétion.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-300 mb-1">Prénom</label>
                        <input
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Danielle"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Nom / Initiale</label>
                        <input
                          type="text"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="K."
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-300 mb-1">Genre</label>
                        <select
                          value={regGender}
                          onChange={(e) => setRegGender(e.target.value as any)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                        >
                          <option value="female">Femme</option>
                          <option value="male">Homme</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-300 mb-1">Ville de résidence</label>
                        <select
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                        >
                          <option value="Douala">Douala (Cameroun)</option>
                          <option value="Yaoundé">Yaoundé (Cameroun)</option>
                          <option value="Bafoussam">Bafoussam (Cameroun)</option>
                          <option value="Paris & Diaspora">Paris (Diaspora)</option>
                          <option value="Bruxelles & Diaspora">Bruxelles (Diaspora)</option>
                          <option value="Montréal & Diaspora">Montréal (Diaspora)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Email personnel</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="danielle@exemple.com"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Mot de passe de sécurité</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimum 8 caractères"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Continuer vers le Contrôle d'Âge (18+)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {/* REGISTER STEP 2 : CONTRÔLE D'ÂGE MATHÉMATIQUE STRICT (18+) */}
                {registerStep === 2 && (
                  <form onSubmit={handleValidateAgeStep2} className="space-y-4 text-xs">
                    <div>
                      <h3 className="text-base font-bold font-brand text-stone-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-400" />
                        <span>Contrôle d'Âge Réglementaire (18+)</span>
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Entrez votre date de naissance légale. Ndolo interdit strictement l'accès aux mineurs.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
                      <label className="block text-rose-200 font-semibold text-[11px]">
                        Date de naissance (Jour / Mois / Année)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={birthDay}
                          onChange={(e) => setBirthDay(e.target.value)}
                          placeholder="JJ"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-center text-stone-100 focus:border-rose-500"
                          required
                        />
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={birthMonth}
                          onChange={(e) => setBirthMonth(e.target.value)}
                          placeholder="MM"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-center text-stone-100 focus:border-rose-500"
                          required
                        />
                        <input
                          type="number"
                          min="1935"
                          max="2026"
                          value={birthYear}
                          onChange={(e) => setBirthYear(e.target.value)}
                          placeholder="AAAA"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-center text-stone-100 focus:border-rose-500"
                          required
                        />
                      </div>
                    </div>

                    {ageError && (
                      <div className="p-3 bg-rose-950 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{ageError}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRegisterStep(1)}
                        className="px-4 py-2.5 bg-stone-800 text-stone-300 rounded-xl"
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl shadow-md"
                      >
                        Valider mon âge et passer au Selfie Caméra →
                      </button>
                    </div>
                  </form>
                )}

                {/* REGISTER STEP 3 : LE SELFIE BIOMÉTRIQUE CAMÉRA EN DIRECT ANTI-GAMIN */}
                {registerStep === 3 && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <h3 className="text-base font-bold font-brand text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-amber-200 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-rose-400" />
                        <span>Vérification Faciale par Selfie (Anti-Mineur)</span>
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Pour que personne ne triche sur son âge et qu'aucun gamin ne s'infiltre, activez votre caméra pour certifier votre majorité.
                      </p>
                    </div>

                    {/* Camera Viewport */}
                    <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-black border-2 border-dashed border-rose-500/50 shadow-xl flex items-center justify-center">
                      {!capturedSelfieUrl ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover mirror"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-44 h-56 border-2 border-rose-400 rounded-[50%] animate-pulse" />
                          </div>
                        </>
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={capturedSelfieUrl}
                            alt="Selfie capturé"
                            className="w-full h-full object-cover"
                          />
                          {isAnalyzingSelfie && (
                            <div className="absolute inset-0 bg-rose-500/20 flex flex-col items-center justify-center p-3 text-center">
                              <RefreshCw className="w-6 h-6 animate-spin text-rose-300 mb-2" />
                              <span className="text-xs font-bold text-white bg-stone-950/80 px-2 py-1 rounded-full">
                                Analyse biométrique anti-gamin...
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Analysis result status */}
                    {selfieAnalysis.status === 'adult_verified' && (
                      <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Majeur 18+ Certifié</span>
                        </div>
                        <p className="text-[11px] leading-tight text-emerald-300/90">
                          {selfieAnalysis.message}
                        </p>
                      </div>
                    )}

                    {selfieAnalysis.status === 'child_detected' && (
                      <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-300">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>Profil Mineur Détecté : Accès Refusé</span>
                        </div>
                        <p className="text-[11px] leading-tight">
                          {selfieAnalysis.message}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    {!capturedSelfieUrl ? (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleCaptureSelfie(false)}
                          className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Prendre le selfie & Vérifier la majorité</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCaptureSelfie(true)}
                          className="text-[10px] text-rose-400/80 hover:text-rose-300 underline text-center block w-full"
                        >
                          [Test Démo : Simuler la détection d'un enfant pour tester le blocage]
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {selfieAnalysis.status === 'child_detected' ? (
                          <button
                            type="button"
                            onClick={handleRetakeSelfie}
                            className="w-full py-2 bg-stone-800 text-stone-200 rounded-xl font-medium"
                          >
                            Reprendre la photo
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={handleRetakeSelfie}
                              disabled={isAnalyzingSelfie}
                              className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-medium"
                            >
                              Reprendre
                            </button>
                            <button
                              type="button"
                              disabled={selfieAnalysis.status !== 'adult_verified'}
                              onClick={() => setRegisterStep(4)}
                              className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 disabled:opacity-40 text-white font-bold rounded-xl shadow-md"
                            >
                              Valider et passer au Projet de Vie →
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* REGISTER STEP 4 : PROJET DE VIE & CONFIRMATION */}
                {registerStep === 4 && (
                  <form onSubmit={handleCompleteRegistration} className="space-y-3.5 text-xs">
                    <div>
                      <h3 className="text-base font-bold font-brand text-stone-100">
                        Votre Projet Matrimonial
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Sur Ndolo, l'engagement commence par des visions claires et partagées.
                      </p>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Horizon pour le mariage</label>
                      <select
                        value={marriageTimeline}
                        onChange={(e) => setMarriageTimeline(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                      >
                        <option value="under_1_year">Dans l'année (Prêt(e) à célébrer les noces)</option>
                        <option value="1_to_2_years">D'ici 1 à 2 ans (Temps des fiançailles)</option>
                        <option value="open">Prendre le temps de bien se connaître</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Désir d’enfants</label>
                      <select
                        value={childrenDesire}
                        onChange={(e) => setChildrenDesire(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                      >
                        <option value="wants_children">Oui, fonder une belle et grande famille</option>
                        <option value="already_has_wants_more">A déjà des enfants, en désire d'autres</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Valeurs spirituelles & Principes</label>
                      <input
                        type="text"
                        value={spiritualValues}
                        onChange={(e) => setSpiritualValues(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                      />
                    </div>

                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-[11px] text-rose-200">
                      Félicitations ! Vous obtiendrez le <strong>Badge Niveau 3 (Selfie & Âge Vérifié 18+)</strong> dès votre entrée sur la plateforme.
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Terminer mon inscription & Découvrir le Ndolo</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-950/30 py-4 px-6 text-center text-xs text-stone-400 bg-stone-950">
        <span>Ndolo ♥ · Plateforme réservée aux personnes majeures (+18 ans) · Cameroun & Diaspora</span>
      </footer>
    </div>
  );
};
