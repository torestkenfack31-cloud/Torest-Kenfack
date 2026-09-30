import React, { useState } from 'react';
import { 
  Briefcase, Plus, CheckCircle2, Star, Calendar, MessageSquare, 
  DollarSign, TrendingUp, Scissors, Camera, Utensils, Music,
  Eye, Phone, Mail, Clock, ShieldCheck, MapPin, Award, Filter,
  Trash2, Edit, AlertCircle, Sparkles
} from 'lucide-react';
import { Language, BridalDesign, WeddingVendor } from '../types';

interface ProDashboardProps {
  language: Language;
  onOpenPublishModel: () => void;
  designs: BridalDesign[];
  onDeleteDesign?: (id: string) => void;
}

export const ProDashboard: React.FC<ProDashboardProps> = ({
  language,
  onOpenPublishModel,
  designs,
  onDeleteDesign
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'bookings' | 'reviews'>('overview');

  // Simulated real incoming appointments/bookings from brides & grooms
  const [appointments, setAppointments] = useState([
    {
      id: 'apt_1',
      clientName: 'Carole Mbarga',
      clientPhone: '+237 699 12 34 56',
      service: 'Robe de Mariée Princesse Blanche & Voile Dentelle',
      date: '2026-10-12',
      time: '14:30',
      location: 'Atelier Douala (Akwa)',
      budget: '450 000 FCFA',
      status: 'confirmed' as 'confirmed' | 'pending' | 'completed'
    },
    {
      id: 'apt_2',
      clientName: 'Kevin Fotso & Diane',
      clientPhone: '+237 677 88 99 00',
      service: 'Duo Royal Mariage Coutumier Toghu Bamiléké',
      date: '2026-10-18',
      time: '11:00',
      location: 'Prise de mesures à domicile',
      budget: '600 000 FCFA',
      status: 'pending' as 'confirmed' | 'pending' | 'completed'
    },
    {
      id: 'apt_3',
      clientName: 'Samuel Eto’o Jr',
      clientPhone: '+237 690 44 22 11',
      service: 'Costume 3 Pièces Sur-Mesure Smoking Italien',
      date: '2026-10-05',
      time: '16:00',
      location: 'Atelier Douala',
      budget: '250 000 FCFA',
      status: 'completed' as 'confirmed' | 'pending' | 'completed'
    }
  ]);

  const handleUpdateStatus = (id: string, newStatus: 'confirmed' | 'pending' | 'completed') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Pro Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Espace Prestataire Pro Vérifié' : 'Verified Pro Partner Space'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-brand text-amber-100">
              {language === 'fr' ? 'Tableau de Bord Commercial & Réservations' : 'Business Dashboard & Bookings'}
            </h2>
            <p className="text-xs text-stone-300 max-w-xl">
              {language === 'fr'
                ? 'Gérez vos modèles en vitrine, recevez les demandes d’essayage des futurs mariés et suivez votre chiffre d’affaires généré sur Ndolo.'
                : 'Manage your showcase catalog, accept bride & groom fitting appointments and track your revenue.'}
            </p>
          </div>

          <button
            onClick={onOpenPublishModel}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'fr' ? 'Publier une Création' : 'Add Creation'}</span>
          </button>
        </div>

        {/* Pro Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 relative z-10">
          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'Vues Vitrine (30j)' : 'Showcase Views'}</span>
            <span className="text-xl font-bold text-amber-300 mt-1 block">4 820</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +28% vs mois passé
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'RDV Essayages' : 'Fittings Booked'}</span>
            <span className="text-xl font-bold text-rose-300 mt-1 block">{appointments.length}</span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">2 confirmés cette semaine</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'Modèles Exposés' : 'Active Catalog'}</span>
            <span className="text-xl font-bold text-stone-100 mt-1 block">{designs.length}</span>
            <span className="text-[10px] text-amber-400 mt-0.5 block">Visibilité nationale & diaspora</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'Note de Confiance' : 'Client Rating'}</span>
            <span className="text-xl font-bold text-amber-400 mt-1 block flex items-center gap-1">
              4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">32 avis vérifiés</span>
          </div>
        </div>
      </div>

      {/* Pro Subtabs */}
      <div className="flex items-center gap-2 p-1 bg-stone-900 border border-stone-800 rounded-2xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {language === 'fr' ? 'RDV & Commandes' : 'Bookings'} ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {language === 'fr' ? 'Gestion du Catalogue' : 'Catalog Manager'} ({designs.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {language === 'fr' ? 'Avis & Témoignages' : 'Client Reviews'} (32)
        </button>
      </div>

      {/* Tab 1: Appointments / Bookings list */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-200">
              {language === 'fr' ? 'Demandes d’essayages et commandes en cours' : 'Incoming Fitting & Tailoring Inquiries'}
            </h3>
            <span className="text-xs text-stone-400">
              {language === 'fr' ? 'Trié par date d’intervention' : 'Sorted by date'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-3 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-500/30">
                      {apt.clientName.charAt(0)}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-100">{apt.clientName}</h4>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" /> {apt.clientPhone}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    apt.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : apt.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {apt.status === 'confirmed' ? 'Confirmé' : apt.status === 'pending' ? 'En Attente' : 'Terminé'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-1 text-xs">
                  <p className="text-amber-200 font-semibold truncate">{apt.service}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-300 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-400" /> {apt.date} à {apt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" /> {apt.location}
                    </span>
                    <span className="font-bold text-emerald-400">{apt.budget}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {apt.status !== 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                      className="flex-1 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Accepter RDV' : 'Confirm'}</span>
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'completed')}
                      className="flex-1 py-1.5 bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Marquer Terminé' : 'Mark Completed'}</span>
                    </button>
                  )}
                  <a
                    href={`https://wa.me/${apt.clientPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Catalog Management */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-200">
              {language === 'fr' ? 'Vos créations exposées dans la Boutique Ndolo' : 'Your Creations in Ndolo Boutique'}
            </h3>
            <button
              onClick={onOpenPublishModel}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Ajouter une pièce' : 'New piece'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-stone-950/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    {design.price}
                  </div>
                </div>

                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-stone-100 truncate">{design.title}</h4>
                  <p className="text-[11px] text-stone-400">{design.fabricType} · Délai : {design.creationTime}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[11px]">
                    <span className="text-rose-300 font-semibold">♥ {design.likesCount ?? 14} favoris</span>
                    {onDeleteDesign && (
                      <button
                        onClick={() => onDeleteDesign(design.id)}
                        className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                        title="Retirer de la vitrine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-200">
              {language === 'fr' ? 'Témoignages & Évaluations des mariés' : 'Couple Testimonials'}
            </h3>
            
            <div className="space-y-3">
              {[
                {
                  client: 'Diane & Marc (Douala)',
                  rating: 5,
                  comment: 'La robe Toghu perlée sur-mesure était splendide ! Tout le village a salué la finition royale. Merci pour le respect des délais.',
                  date: 'Il y a 3 semaines'
                },
                {
                  client: 'Kevin & Brenda (Yaoundé)',
                  rating: 5,
                  comment: 'Costume 3 pièces ajusté à la perfection pour la dot et la mairie. Très grand professionnalisme !',
                  date: 'Il y a 1 mois'
                }
              ].map((rev, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200">{rev.client}</span>
                    <div className="flex items-center text-amber-400">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-stone-300">"{rev.comment}"</p>
                  <span className="text-[10px] text-stone-500">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
