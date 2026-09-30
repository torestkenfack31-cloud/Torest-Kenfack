import React, { useState, useRef } from 'react';
import { 
  HeartHandshake, CheckSquare, Square, Calculator, Phone, 
  MapPin, Star, ShieldCheck, Sparkles, Filter, ExternalLink,
  ShoppingBag, Scissors, Plus, X, Search, Clock, MessageCircle,
  ThumbsUp, CheckCircle2, ChevronRight, User, Eye, Send, Award,
  Upload, Image as ImageIcon, Camera, Trash2, Check, RefreshCw
} from 'lucide-react';
import { WeddingVendor, BridalDesign, Language, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { weddingChecklistItems, sampleBridalDesigns } from '../data/mockData';
import { ProDashboard } from './ProDashboard';
import { Briefcase } from 'lucide-react';

interface WeddingEcosystemProps {
  vendors: WeddingVendor[];
  language: Language;
  activeRole?: UserRole;
}

export const WeddingEcosystem: React.FC<WeddingEcosystemProps> = ({
  vendors,
  language,
  activeRole = 'user'
}) => {
  const t = translations[language];
  const isProfessional = activeRole === 'professional';
  const [activeSubTab, setActiveSubTab] = useState<'boutique' | 'vendors' | 'checklist' | 'budget' | 'pro_dashboard'>(
    isProfessional ? 'pro_dashboard' : 'boutique'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checklist, setChecklist] = useState(weddingChecklistItems);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  // Boutique Designs State
  const [designs, setDesigns] = useState<BridalDesign[]>(sampleBridalDesigns);
  const [selectedDesignCategory, setSelectedDesignCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedDesigns, setLikedDesigns] = useState<Record<string, boolean>>({});
  const [selectedDetailDesign, setSelectedDetailDesign] = useState<BridalDesign | null>(null);

  // Booking Modal for Bride / Groom
  const [bookingDesign, setBookingDesign] = useState<BridalDesign | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-15');
  const [bookingLocation, setBookingLocation] = useState<'atelier' | 'domicile'>('atelier');
  const [bookingNotes, setBookingNotes] = useState('Pour confection sur-mesure pour notre mariage coutumier et civil.');

  // Stylist New Design Publication Modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'bride_traditional' | 'bride_white' | 'groom_tuxedo' | 'groom_traditional' | 'couple_duo'>('bride_traditional');
  const [newFabric, setNewFabric] = useState('Toghu Royal & Soie');
  const [newPrice, setNewPrice] = useState('350 000 FCFA');
  const [newDelay, setNewDelay] = useState('3 semaines');
  const [newStylistBrand, setNewStylistBrand] = useState('Atelier Création Nuptiale');
  const [newStylistPhone, setNewStylistPhone] = useState('+237 670 00 11 22');
  const [newStylistCity, setNewStylistCity] = useState('Douala');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/couple_wedding_hero_1790589910589.jpg');
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local photo upload (from phone camera or gallery, or PC)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoUploadError(language === 'fr' ? 'Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).' : 'Please select a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoUploadError(language === 'fr' ? 'L’image ne doit pas dépasser 10 Mo.' : 'Image size must be under 10MB.');
      return;
    }

    setPhotoUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Budget Calculator interactive state in FCFA
  const [budgetItems, setBudgetItems] = useState({
    venue: 1200000,
    caterer: 1500000,
    attire: 600000,
    jewelry: 350000,
    photoVideo: 500000,
    decor: 800000
  });

  const totalEstimatedBudget = Object.values(budgetItems).reduce((acc, curr) => acc + curr, 0);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const filteredVendors = selectedCategory === 'all'
    ? vendors
    : vendors.filter((v) => v.category === selectedCategory);

  // Filter Boutique Designs
  const filteredDesigns = designs.filter((design) => {
    const matchesCat = selectedDesignCategory === 'all' || design.category === selectedDesignCategory;
    const matchesSearch = 
      design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.fabricType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.stylist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.stylist.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.stylist.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Toggle Like on bridal design
  const toggleLikeDesign = (designId: string) => {
    setLikedDesigns((prev) => {
      const isCurrentlyLiked = !!prev[designId];
      const nextState = !isCurrentlyLiked;
      setDesigns((current) =>
        current.map((d) =>
          d.id === designId ? { ...d, likesCount: nextState ? d.likesCount + 1 : Math.max(0, d.likesCount - 1) } : d
        )
      );
      return { ...prev, [designId]: nextState };
    });
  };

  const handleContactVendor = (vendorName: string) => {
    setContactSuccess(language === 'fr' ? `Mise en relation prioritaire effectuée avec ${vendorName}.` : `Direct connection initiated with ${vendorName}.`);
    setTimeout(() => setContactSuccess(null), 3500);
  };

  // Submit new bridal model
  const handlePublishModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDesign: BridalDesign = {
      id: `design_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      fabricType: newFabric,
      price: newPrice.includes('FCFA') ? newPrice : `${newPrice} FCFA`,
      creationTime: newDelay,
      imageUrl: newImageUrl,
      stylist: {
        id: `stylist_${Date.now()}`,
        name: newStylistBrand,
        brandName: newStylistBrand,
        city: newStylistCity,
        country: 'Cameroun',
        avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
        phone: newStylistPhone,
        whatsapp: newStylistPhone.replace(/\s+/g, ''),
        isVerifiedCouturier: true,
        rating: 5.0,
        experienceYears: 8
      },
      description: newDescription || 'Confection sur-mesure d’exception pour célébrer votre alliance sacrée.',
      likesCount: 1,
      tags: ['Nouveauté', 'Sur-mesure', 'Créateur Agréé'],
      isCustomTailored: true,
      fittingsAvailable: true
    };

    setDesigns([newDesign, ...designs]);
    setIsPublishModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setContactSuccess(language === 'fr' ? "Votre modèle de mariage a été publié avec succès dans la boutique des stylistes !" : "Your bridal design was successfully posted in the Boutique!");
    setTimeout(() => setContactSuccess(null), 4000);
  };

  // Confirm fitting booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDesign) return;
    setContactSuccess(
      language === 'fr'
        ? `Rendez-vous d'essayage confirmé le ${bookingDate} avec ${bookingDesign.stylist.brandName} (${bookingLocation === 'atelier' ? 'En Atelier' : 'À domicile'}). Un SMS et message WhatsApp de confirmation vous a été envoyé !`
        : `Fitting appointment confirmed on ${bookingDate} with ${bookingDesign.stylist.brandName}. Confirmation sent via SMS & WhatsApp!`
    );
    setBookingDesign(null);
    setTimeout(() => setContactSuccess(null), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-brand text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-100 to-amber-200 flex items-center gap-2">
            <span>💍</span>
            <span>{t.marriage.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {t.marriage.subtitle}
          </p>
        </div>

        {/* Action Button: Stylist publish model */}
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 flex items-center gap-2 active:scale-95 self-start sm:self-auto shrink-0"
        >
          <Scissors className="w-4 h-4" />
          <span>{t.marriage.postModelBtn}</span>
        </button>
      </div>

      {/* Sub-tab Navigation (Boutique Stylistes, Prestataires, Checklist, Budget) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-900 border border-stone-800 rounded-2xl w-full sm:w-fit">
        <button
          onClick={() => setActiveSubTab('boutique')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeSubTab === 'boutique'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-rose-300" />
          <span>{t.marriage.boutiqueTab}</span>
          <span className="text-[10px] bg-rose-950/80 text-rose-200 px-1.5 py-0.5 rounded-full border border-rose-500/40">
            {designs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('vendors')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeSubTab === 'vendors'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{t.marriage.vendorsTab}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeSubTab === 'checklist'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{t.marriage.checklistTab}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('budget')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeSubTab === 'budget'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{t.marriage.budgetTab}</span>
        </button>

        {/* Tab Espace Pro Prestataire */}
        <button
          onClick={() => setActiveSubTab('pro_dashboard')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeSubTab === 'pro_dashboard'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 font-extrabold shadow-md'
              : 'text-amber-400 hover:text-amber-200 border border-amber-500/30'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{language === 'fr' ? 'Espace Prestataire Pro' : 'Pro Partner Space'}</span>
          {isProfessional && (
            <span className="text-[9px] bg-amber-400/30 text-stone-950 px-1.5 py-0.5 rounded-full font-extrabold">
              PRO
            </span>
          )}
        </button>
      </div>

      {contactSuccess && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs rounded-2xl text-center shadow-lg flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{contactSuccess}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. ESPACE TABLEAU DE BORD PRESTATAIRE PRO */}
      {/* ========================================================================= */}
      {activeSubTab === 'pro_dashboard' && (
        <ProDashboard
          language={language}
          onOpenPublishModel={() => setIsPublishModalOpen(true)}
          designs={designs}
          onDeleteDesign={(id) => setDesigns(prev => prev.filter(d => d.id !== id))}
        />
      )}

      {/* ========================================================================= */}
      {/* 1. BOUTIQUE DES STYLISTES : MODÈLES DE MARIAGE (ROBES, DUOS, SMOKINGS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'boutique' && (
        <div className="space-y-6">
          
          {/* Search bar & Category filters */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.marriage.searchStylistPlaceholder}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'all', label: t.marriage.allCategories },
                { id: 'bride_traditional', label: t.marriage.brideTraditional },
                { id: 'couple_duo', label: t.marriage.coupleDuo },
                { id: 'bride_white', label: t.marriage.brideWhite },
                { id: 'groom_tuxedo', label: t.marriage.groomTuxedo },
                { id: 'groom_traditional', label: t.marriage.groomTraditional }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDesignCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    selectedDesignCategory === cat.id
                      ? 'bg-rose-500 text-white font-semibold shadow-md'
                      : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Bridal Models */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDesigns.map((design) => {
              const isLiked = !!likedDesigns[design.id];

              return (
                <div
                  key={design.id}
                  className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl hover:border-rose-500/50 transition-all flex flex-col justify-between group"
                >
                  {/* Image with Badges */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                    {/* Like button on top right */}
                    <button
                      onClick={() => toggleLikeDesign(design.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        isLiked
                          ? 'bg-rose-500 text-white'
                          : 'bg-black/50 text-stone-200 hover:text-rose-400'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                    </button>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3 bg-stone-950/90 border border-rose-500/40 text-rose-200 text-xs font-extrabold px-3 py-1 rounded-xl backdrop-blur-md shadow-md">
                      {design.price}
                    </div>

                    {/* Likes counter */}
                    <div className="absolute bottom-3 right-3 bg-stone-950/80 text-stone-300 text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <span>♥ {design.likesCount}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                        <span>{design.fabricType}</span>
                        <span>·</span>
                        <span>{design.creationTime}</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold font-brand text-stone-100 group-hover:text-rose-300 transition-colors line-clamp-2">
                        {design.title}
                      </h3>

                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {design.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {design.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded-md border border-stone-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stylist Profile Card */}
                    <div className="pt-3 border-t border-stone-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={design.stylist.avatar}
                            alt={design.stylist.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-rose-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-stone-100 block truncate">
                              {design.stylist.brandName}
                            </span>
                            <span className="text-[10px] text-stone-400 block truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                              <span>{design.stylist.city}</span>
                              <span>·</span>
                              <span>★ {design.stylist.rating} ({design.stylist.experienceYears} ans exp.)</span>
                            </span>
                          </div>
                        </div>

                        {design.stylist.isVerifiedCouturier && (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold shrink-0">
                            Agréé
                          </span>
                        )}
                      </div>

                      {/* Contact & Fitting Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <button
                          onClick={() => setBookingDesign(design)}
                          className="py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Scissors className="w-3.5 h-3.5 text-amber-400" />
                          <span>Prendre RDV</span>
                        </button>

                        <button
                          onClick={() => {
                            const message = encodeURIComponent(
                              `Bonjour ${design.stylist.brandName}, j'ai vu votre modèle « ${design.title} » (${design.price}) sur la boutique Ndolo Mariage et je souhaite échanger pour notre confection nuptiale.`
                            );
                            window.open(`https://wa.me/${design.stylist.whatsapp}?text=${message}`, '_blank');
                          }}
                          className="py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDesigns.length === 0 && (
            <div className="text-center py-12 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-500 mx-auto" />
              <h3 className="text-sm font-bold text-stone-200">Aucun modèle ne correspond à votre recherche</h3>
              <p className="text-xs text-stone-400">Essayez d’élargir vos filtres ou publiez votre propre création en tant que styliste.</p>
              <button
                onClick={() => { setSelectedDesignCategory('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-stone-800 text-rose-300 text-xs font-semibold rounded-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ANNUAIRE DES PRESTATAIRES (Photographes, Traiteurs, Salles, etc.)    */}
      {/* ========================================================================= */}
      {activeSubTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            {['all', 'wedding_planner', 'photographer', 'caterer', 'venue', 'jewelry'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white font-semibold'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                {cat === 'all' && t.discover.filterAll}
                {cat === 'wedding_planner' && t.marriage.weddingPlanner}
                {cat === 'photographer' && t.marriage.photographers}
                {cat === 'caterer' && t.marriage.caterers}
                {cat === 'venue' && t.marriage.venues}
                {cat === 'jewelry' && t.marriage.jewelry}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                  <img
                    src={vendor.coverImage}
                    alt={vendor.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 bg-stone-950/90 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      {t.marriage.startingFrom} {vendor.startingPrice}
                    </span>
                    <span className="text-xs text-stone-200 bg-stone-950/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{vendor.rating} ({vendor.reviewsCount})</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-brand text-stone-100">{vendor.name}</h3>
                    {vendor.isVerifiedPro && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                        {t.marriage.verifiedPro}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">{vendor.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{vendor.city}</span>
                    </span>

                    <button
                      onClick={() => handleContactVendor(vendor.name)}
                      className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold rounded-xl transition-colors"
                    >
                      {t.marriage.contactVendor}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CHECKLIST MATRIMONIALE (Étapes de la Dot au Mariage Civil/Religieux) */}
      {/* ========================================================================= */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                Progression des Préparatifs
              </span>
              <span className="text-sm font-bold text-rose-400 font-mono">
                {progressPercent}% ({completedCount}/{checklist.length} {t.marriage.itemsCompleted})
              </span>
            </div>

            <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-3xl divide-y divide-stone-800/80 overflow-hidden shadow-xl">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className="w-full text-left p-4 hover:bg-stone-850 transition-colors flex items-start gap-3.5 group"
              >
                <div className="mt-0.5 text-rose-400">
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 fill-rose-500/20" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-500 group-hover:text-stone-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${item.done ? 'line-through text-stone-500' : 'text-stone-100'}`}>
                      {item.text}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CALCULATEUR DE BUDGET EN FCFA                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'budget' && (
        <div className="space-y-5">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-400 block">{t.marriage.budgetTotal}</span>
              <strong className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-amber-200 to-amber-400">
                {totalEstimatedBudget.toLocaleString()} FCFA
              </strong>
            </div>
            <span className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30 font-semibold">
              Estimation Automatisée
            </span>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-5 text-xs shadow-xl">
            {/* 1. Salle */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-stone-300">Salle & Espaces de Réception</span>
                <span className="font-mono text-amber-300">{budgetItems.venue.toLocaleString()} FCFA</span>
              </div>
              <input
                type="range"
                min="300000"
                max="3000000"
                step="50000"
                value={budgetItems.venue}
                onChange={(e) => setBudgetItems({ ...budgetItems, venue: Number(e.target.value) })}
                className="w-full accent-rose-500"
              />
            </div>

            {/* 2. Traiteur */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-stone-300">Traiteur & Boissons (Buffet d’honneur)</span>
                <span className="font-mono text-amber-300">{budgetItems.caterer.toLocaleString()} FCFA</span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="100000"
                value={budgetItems.caterer}
                onChange={(e) => setBudgetItems({ ...budgetItems, caterer: Number(e.target.value) })}
                className="w-full accent-rose-500"
              />
            </div>

            {/* 3. Tenues nuptiales */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-stone-300">Robes de mariée, Smoking & Tenues traditionnelles (Toghu/Ndop)</span>
                <span className="font-mono text-amber-300">{budgetItems.attire.toLocaleString()} FCFA</span>
              </div>
              <input
                type="range"
                min="200000"
                max="2500000"
                step="50000"
                value={budgetItems.attire}
                onChange={(e) => setBudgetItems({ ...budgetItems, attire: Number(e.target.value) })}
                className="w-full accent-rose-500"
              />
            </div>

            {/* 4. Alliances */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-stone-300">Alliances en or 18 carats gravées</span>
                <span className="font-mono text-amber-300">{budgetItems.jewelry.toLocaleString()} FCFA</span>
              </div>
              <input
                type="range"
                min="150000"
                max="1000000"
                step="25000"
                value={budgetItems.jewelry}
                onChange={(e) => setBudgetItems({ ...budgetItems, jewelry: Number(e.target.value) })}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PRENDRE RENDEZ-VOUS D'ESSAYAGE AVEC LE STYLISTE                  */}
      {/* ========================================================================= */}
      {bookingDesign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setBookingDesign(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-brand text-stone-100">
                  Prendre Rendez-vous pour Essayage & Mesures
                </h3>
                <p className="text-xs text-stone-400">
                  Avec {bookingDesign.stylist.brandName} · {bookingDesign.stylist.city}
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl flex items-center gap-3">
              <img
                src={bookingDesign.imageUrl}
                alt={bookingDesign.title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-200 truncate">{bookingDesign.title}</h4>
                <span className="text-[11px] text-rose-300 font-bold block">{bookingDesign.price}</span>
                <span className="text-[10px] text-stone-400 block">{bookingDesign.fabricType}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Date souhaitée pour l'essayage</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Lieu du rendez-vous</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingLocation('atelier')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      bookingLocation === 'atelier'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    En Atelier ({bookingDesign.stylist.city})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingLocation('domicile')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      bookingLocation === 'domicile'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    À domicile / Hôtel
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Notes et mensurations approximatives</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer la demande d'essayage</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PUBLIER UN MODÈLE DE MARIAGE (RÉSERVÉ AUX STYLISTES / CRÉATEURS) */}
      {/* ========================================================================= */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-brand text-stone-100">
                  {t.marriage.postModelBtn}
                </h3>
                <p className="text-xs text-stone-400">
                  Exposez vos créations aux futurs mariés de la communauté Ndolo.
                </p>
              </div>
            </div>

            <form onSubmit={handlePublishModelSubmit} className="space-y-3.5 text-xs">
              {/* SECTION PHOTO DU MODÈLE (UPLOAD TÉLÉPHONE / PC & PRÉSÉLECTIONS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-200 font-bold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-rose-400" />
                    <span>Photo de votre tenue / modèle</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {newImageUrl && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <Check className="w-3 h-3" /> Photo chargée
                    </span>
                  )}
                </div>

                {/* Cadre d'upload interactif */}
                <div className="bg-stone-950 border-2 border-dashed border-stone-750 hover:border-rose-500/60 rounded-2xl p-3.5 transition-colors">
                  {newImageUrl ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3.5">
                      <div className="relative w-full sm:w-28 h-32 rounded-xl overflow-hidden border border-stone-700 shrink-0 bg-stone-900 shadow-md">
                        <img
                          src={newImageUrl}
                          alt="Aperçu modèle sélectionné"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                        <p className="text-xs text-stone-200 font-semibold">
                          Photo prête pour publication
                        </p>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          Cette photo sera mise en avant sur la fiche de votre création dans la Boutique Ndolo.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-medium text-[11px] rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-rose-400" />
                            <span>Changer la photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewImageUrl('')}
                            className="px-3 py-1.5 bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-[11px] rounded-xl border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer py-6 flex flex-col items-center justify-center text-center space-y-2.5 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center transition-all shadow-inner">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-100 group-hover:text-rose-300">
                          Cliquez pour ajouter une photo depuis votre appareil
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Depuis la galerie photo de votre téléphone ou votre ordinateur (PNG, JPG, WEBP)
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-[11px] rounded-xl shadow-md">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Parcourir mes photos</span>
                      </span>
                    </div>
                  )}

                  {/* Input HTML caché déclenché au clic */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {photoUploadError && (
                  <p className="text-[11px] text-rose-400 font-medium">{photoUploadError}</p>
                )}

                {/* Exemples de styles prédéfinis prêts à l'emploi */}
                <div className="pt-1">
                  <div className="text-[10px] text-stone-400 mb-1.5 flex items-center justify-between">
                    <span>Ou choisir une tenue d’inspiration :</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      {
                        title: 'Toghu Nuptial',
                        url: '/src/assets/images/couple_wedding_hero_1790589910589.jpg'
                      },
                      {
                        title: 'Robe Sawa',
                        url: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg'
                      },
                      {
                        title: 'Costume Élégant',
                        url: '/src/assets/images/profile_man_douala_1790589937179.jpg'
                      },
                      {
                        title: 'Alliance & Décor',
                        url: '/src/assets/images/wedding_rings_planning_1790589966684.jpg'
                      }
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setNewImageUrl(preset.url);
                          setPhotoUploadError(null);
                        }}
                        className={`relative rounded-xl overflow-hidden border aspect-[4/3] group transition-all cursor-pointer ${
                          newImageUrl === preset.url
                            ? 'border-rose-500 ring-2 ring-rose-500/50'
                            : 'border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-600'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/75 text-[9px] text-stone-200 text-center py-0.5 font-medium truncate px-1">
                          {preset.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Nom du modèle / Création</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Robe de Mariée Sirène en Toghu & Tulle brodé"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                  >
                    <option value="bride_traditional">Mariée Traditionnelle</option>
                    <option value="couple_duo">Duo Nuptial Assorti</option>
                    <option value="bride_white">Robe Blanche Féerique</option>
                    <option value="groom_tuxedo">Smoking / Tailleur Homme</option>
                    <option value="groom_traditional">Tenue Traditionnelle Homme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Tissu & Matières</label>
                  <input
                    type="text"
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                    placeholder="Toghu, Ndop, Soie sauvage..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1">Prix de confection (FCFA)</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Ex : 350 000 FCFA"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Délai de réalisation</label>
                  <input
                    type="text"
                    value={newDelay}
                    onChange={(e) => setNewDelay(e.target.value)}
                    placeholder="Ex : 3 à 4 semaines"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1">Nom de votre Maison / Marque</label>
                  <input
                    type="text"
                    value={newStylistBrand}
                    onChange={(e) => setNewStylistBrand(e.target.value)}
                    placeholder="Ex : Maison Kengne Haute Couture"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Ville de l'Atelier</label>
                  <select
                    value={newStylistCity}
                    onChange={(e) => setNewStylistCity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                  >
                    <option value="Douala">Douala (Cameroun)</option>
                    <option value="Yaoundé">Yaoundé (Cameroun)</option>
                    <option value="Bafoussam">Bafoussam (Cameroun)</option>
                    <option value="Paris">Paris (Diaspora)</option>
                    <option value="Bruxelles">Bruxelles (Diaspora)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Numéro WhatsApp professionnel</label>
                <input
                  type="text"
                  value={newStylistPhone}
                  onChange={(e) => setNewStylistPhone(e.target.value)}
                  placeholder="+237 6..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Description du modèle</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  placeholder="Décrivez les finitions, la traîne, les détails des broderies..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-[11px] text-stone-400">
                Votre création sera directement visible dans la <strong>Boutique des Stylistes</strong> et consultable par tous les couples engagés.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                <span>Publier mon modèle dans la Boutique</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
