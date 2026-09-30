import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Users, MessageSquare, Heart, 
  Film, CheckCircle2, XCircle, FileText, Check, Search, Filter, Lock, 
  Unlock, UserX, UserCheck, Crown, Briefcase, TrendingUp, BarChart3, 
  Eye, Trash2, RefreshCw, AlertOctagon, Sparkles, Clock, Ban, Sliders, 
  Download, PhoneCall, Smartphone, BadgePercent, ChevronRight, Award
} from 'lucide-react';
import { 
  ModerationQueueItem, Language, UserRole, IDVerificationItem, 
  SecurityChatAlert, UserProfile 
} from '../types';
import { translations } from '../i18n/translations';

interface AdminModerationProps {
  queue: ModerationQueueItem[];
  language: Language;
  activeRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export const AdminModeration: React.FC<AdminModerationProps> = ({
  queue,
  language,
  activeRole = 'admin',
  onRoleChange
}) => {
  const t = translations[language];
  const isAdmin = activeRole === 'admin';

  // Sub-tabs depending on whether user is in 'Moderator' or 'Admin' mode
  const [activeTab, setActiveTab] = useState<
    'reports' | 'id_verifications' | 'chat_alerts' | 'content_media' | 'audit_log' | 'analytics' | 'user_management' | 'vendors_control' | 'system_settings'
  >('reports');

  // Interactive state: Reports & Fraud Queue
  const [reports, setReports] = useState<ModerationQueueItem[]>([
    ...queue,
    {
      id: 'mod_momo_1',
      type: 'report',
      priority: 'urgent',
      targetUser: {
        id: 'suspicious_momo',
        name: 'Gaston B. (Compte suspect)',
        avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
        city: 'Douala',
        phone: '+237 650 11 22 33'
      },
      reason: 'Brouteur présumé : a demandé un transfert Orange Money de 45 000 FCFA pour prétendu transport après 3 jours de chat.',
      timestamp: 'Il y a 8 min',
      status: 'pending',
      category: 'scam_momo'
    },
    {
      id: 'mod_fake_2',
      type: 'profile',
      priority: 'priority',
      targetUser: {
        id: 'fake_profile_99',
        name: 'Clarisse Diamond',
        avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
        city: 'Paris / Yaoundé',
        phone: '+33 6 12 34 56 78'
      },
      reason: 'Usurpation d’identité signalée : photos provenant du profil Instagram public d’une influenceuse.',
      timestamp: 'Il y a 32 min',
      status: 'pending',
      category: 'fake_profile'
    }
  ]);

  // Interactive state: ID & Biometric Verification Requests (CNI, Passport, 18+ Selfie)
  const [idRequests, setIdRequests] = useState<IDVerificationItem[]>([
    {
      id: 'id_req_1',
      userId: 'user_cand_1',
      userName: 'Brenda Nguemo',
      userAvatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      userCity: 'Yaoundé',
      docType: 'cni',
      docFrontUrl: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      docBackUrl: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
      selfieUrl: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      biometricMatchScore: 98,
      is18PlusConfirmed: true,
      submittedAt: 'Il y a 22 min',
      status: 'pending'
    },
    {
      id: 'id_req_2',
      userId: 'user_cand_2',
      userName: 'Christian Talla',
      userAvatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      userCity: 'Douala (Bonapriso)',
      docType: 'passport',
      docFrontUrl: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      selfieUrl: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      biometricMatchScore: 94,
      is18PlusConfirmed: true,
      submittedAt: 'Il y a 1h',
      status: 'pending'
    },
    {
      id: 'id_req_3',
      userId: 'user_cand_3',
      userName: 'Stéphane Kamdem (Diaspora)',
      userAvatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      userCity: 'Montréal (Canada)',
      docType: 'residence_permit',
      docFrontUrl: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      selfieUrl: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      biometricMatchScore: 89,
      is18PlusConfirmed: true,
      submittedAt: 'Il y a 3h',
      status: 'pending'
    }
  ]);

  // Interactive state: Automated AI Security Chat Alerts (Anti-Scam / Romance Scam)
  const [chatAlerts, setChatAlerts] = useState<SecurityChatAlert[]>([
    {
      id: 'alert_1',
      senderName: 'Gaston B. (#8491)',
      senderAvatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      receiverName: 'Carole M.',
      messageSnippet: 'Ma chérie, envoie-moi 25 000 FCFA sur mon compte Orange Money 69944... pour que je paye le taxi pour venir te voir au restaurant.',
      flaggedKeywords: ['envoie-moi', 'Orange Money', '25 000 FCFA'],
      severity: 'critical',
      timestamp: 'Il y a 14 min',
      status: 'investigating'
    },
    {
      id: 'alert_2',
      senderName: 'Patrick_Diaspora',
      senderAvatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      receiverName: 'Diane F.',
      messageSnippet: 'Mon compte bancaire canadien est bloqué temporairement, peux-tu faire un Western Union urgent pour dédouaner la bague ?',
      flaggedKeywords: ['compte bloqué', 'Western Union', 'urgent'],
      severity: 'critical',
      timestamp: 'Il y a 40 min',
      status: 'investigating'
    },
    {
      id: 'alert_3',
      senderName: 'Inconnu_Douala',
      senderAvatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      receiverName: 'Brenda N.',
      messageSnippet: 'Donne-moi ton WhatsApp immédiatement pour qu’on quitte l’application sans attendre la vérification CNI.',
      flaggedKeywords: ['quitte l’application', 'sans attendre vérification'],
      severity: 'medium',
      timestamp: 'Il y a 2h',
      status: 'investigating'
    }
  ]);

  // Interactive state: User Management Directory (For Admin)
  const [usersList, setUsersList] = useState<
    Array<{
      id: string;
      name: string;
      city: string;
      role: UserRole;
      verificationLevel: 1 | 2 | 3 | 4;
      status: 'active' | 'suspended' | 'banned';
      joinedDate: string;
      reportsReceived: number;
    }>
  >([
    { id: 'usr_1', name: 'Brenda Nguemo', city: 'Yaoundé', role: 'user', verificationLevel: 3, status: 'active', joinedDate: '2026-04-12', reportsReceived: 0 },
    { id: 'usr_2', name: 'Christian Talla', city: 'Douala', role: 'premium', verificationLevel: 4, status: 'active', joinedDate: '2026-03-20', reportsReceived: 0 },
    { id: 'usr_3', name: 'Atelier Royal Bamiléké', city: 'Bafoussam', role: 'professional', verificationLevel: 4, status: 'active', joinedDate: '2026-01-15', reportsReceived: 0 },
    { id: 'usr_4', name: 'Gaston B. (Signalé)', city: 'Douala', role: 'user', verificationLevel: 1, status: 'suspended', joinedDate: '2026-09-27', reportsReceived: 3 },
    { id: 'usr_5', name: 'Danielle Kouam', city: 'Yaoundé', role: 'moderator', verificationLevel: 4, status: 'active', joinedDate: '2025-11-10', reportsReceived: 0 }
  ]);

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    zeroToleranceScam: true,
    autoBlockMomoNumbers: true,
    requireIdForChat: false,
    strictAntiMinorScan: true,
    anticLegalComplianceMode: true
  });

  // Audit Log History
  const [auditLogs, setAuditLogs] = useState<
    Array<{ id: string; time: string; actor: string; action: string; target: string; reason: string }>
  >([
    { id: 'log_1', time: '10:42', actor: 'Modérateur #04', action: 'Bannissement immédiat', target: 'Gaston B.', reason: 'Tentative d’extorsion Orange Money récidiviste' },
    { id: 'log_2', time: '10:15', actor: 'Modérateur #02', action: 'Certification CNI Niveau 4', target: 'Brenda Nguemo', reason: 'CNI Camerounaise et scan 18+ authentifiés à 98%' },
    { id: 'log_3', time: '09:30', actor: 'Admin Principal', action: 'Promotion rôle Prestataire Pro', target: 'Atelier Royal Bamiléké', reason: 'Kbis et agrément couturier validés' }
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'priority' | 'normal'>('all');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Actions: Reports
  const handleReportAction = (id: string, action: 'approved' | 'rejected' | 'ban_user') => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: action === 'approved' ? 'approved' : 'rejected' } : r));
    const item = reports.find(r => r.id === id);
    if (action === 'ban_user') {
      showToast(`Utilisateur ${item?.targetUser.name} banni définitivement du réseau et numéro mis sur liste noire.`);
      setAuditLogs(prev => [
        { id: `log_${Date.now()}`, time: 'À l’instant', actor: isAdmin ? 'Admin Principal' : 'Modérateur', action: 'Bannissement définitif (Blacklist)', target: item?.targetUser.name || 'Inconnu', reason: item?.reason || 'Sanction modération' },
        ...prev
      ]);
    } else if (action === 'approved') {
      showToast('Signalement classé sans suite (Fausse alerte).');
    } else {
      showToast('Avertissement formel envoyé au compte de l’utilisateur.');
    }
  };

  // Actions: CNI / ID Verification
  const handleIDAction = (id: string, decision: 'approved' | 'rejected') => {
    setIdRequests(prev => prev.map(item => item.id === id ? { ...item, status: decision } : item));
    const req = idRequests.find(r => r.id === id);
    if (decision === 'approved') {
      showToast(`Badge Niveau 4 (Identité Certifiée CNI / 18+) attribué avec succès à ${req?.userName}.`);
      setAuditLogs(prev => [
        { id: `log_${Date.now()}`, time: 'À l’instant', actor: isAdmin ? 'Admin Principal' : 'Modérateur', action: 'Validation CNI Niveau 4', target: req?.userName || '', reason: 'Documents conformes et majorité 18+ vérifiée' },
        ...prev
      ]);
    } else {
      showToast(`Document refusé pour ${req?.userName}. Demande de re-soumission transmise.`);
    }
  };

  // Actions: Chat Alert
  const handleChatAlertAction = (id: string, action: 'ban' | 'clear') => {
    setChatAlerts(prev => prev.map(a => a.id === id ? { ...a, status: action === 'ban' ? 'banned' : 'cleared' } : a));
    const alert = chatAlerts.find(a => a.id === id);
    if (action === 'ban') {
      showToast(`Compte de ${alert?.senderName} suspendu immédiatement pour tentative d'escroquerie.`);
      setAuditLogs(prev => [
        { id: `log_${Date.now()}`, time: 'À l’instant', actor: 'Modération IA / Humaine', action: 'Suspension d’urgence', target: alert?.senderName || '', reason: `Détection de mots-clés d'escroquerie: ${alert?.flaggedKeywords.join(', ')}` },
        ...prev
      ]);
    } else {
      showToast('Alerte analysée et classée non malveillante.');
    }
  };

  // Actions: User Role Switch (Admin Only)
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Rôle mis à jour avec succès : ${newRole.toUpperCase()}`);
  };

  const handleToggleUserBan = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'banned' ? 'active' : 'banned';
        showToast(nextStatus === 'banned' ? `Compte banni avec succès.` : `Compte réactivé.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filteredReports = reports.filter(r => {
    if (filterPriority === 'all') return true;
    return r.priority === filterPriority;
  });

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.city.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER CONSOLE (MODERATEUR VS ADMIN) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-rose-950/40 border border-stone-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
              {isAdmin ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direction & Super-Administration (RBAC Niveau 5)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Console de Modération & Salubrité Matrimoniale (RBAC Niveau 4)</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-brand text-amber-100 flex items-center gap-2">
              {isAdmin ? 'Centre de Pilotage Général Ndolo' : 'Console de Modération & Vigilance'}
            </h1>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              {isAdmin
                ? 'Supervision complète de l’écosystème : métriques matrimoniales en temps réel, attribution des rôles, gestion des prestataires pro et arbitrages suprêmes.'
                : 'Arbitrage impartial des signalements, vérification rigoureuse des pièces d’identité CNI / 18+ et neutralisation immédiate des brouteurs sentimentaux.'}
            </p>
          </div>

          {/* Persona Switch Helper Button */}
          {onRoleChange && (
            <div className="flex items-center gap-2 bg-stone-950/80 border border-stone-800 p-1.5 rounded-2xl shrink-0 self-start md:self-auto">
              <button
                onClick={() => onRoleChange('moderator')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeRole === 'moderator'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Vue Modérateur</span>
              </button>
              <button
                onClick={() => onRoleChange('admin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeRole === 'admin'
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Vue Super-Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Key Indicators (KPIs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 relative z-10">
          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'Signalements en Attente' : 'Pending Reports'}</span>
            <span className="text-2xl font-bold font-mono text-rose-400 mt-1 block">
              {reports.filter(r => r.status === 'pending').length}
            </span>
            <span className="text-[10px] text-rose-300 font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> Délai moyen : 9 min
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'Dossiers CNI & 18+' : 'ID Verifications'}</span>
            <span className="text-2xl font-bold font-mono text-amber-300 mt-1 block">
              {idRequests.filter(i => i.status === 'pending').length}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
              CNI, Passeports, Récépissés
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'Alertes Anti-Scam MoMo' : 'Anti-Scam Alerts'}</span>
            <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
              {chatAlerts.filter(a => a.status === 'investigating').length}
            </span>
            <span className="text-[10px] text-rose-400 mt-0.5 block">Interceptions IA automatiques</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">{language === 'fr' ? 'Membres Inscrits' : 'Total Members'}</span>
            <span className="text-2xl font-bold font-mono text-stone-100 mt-1 block">24 850</span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">+326 nouveaux auj.</span>
          </div>
        </div>
      </div>

      {/* Floating toast notification */}
      {notification && (
        <div className="p-3.5 bg-stone-900 border border-amber-500/50 text-amber-200 text-xs rounded-2xl flex items-center gap-2.5 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NAVIGATION SUB-TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {/* Moderator & Admin common tabs */}
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Signalements & Fraude ({reports.filter(r => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('id_verifications')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'id_verifications'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Vérification CNI & Biométrie 18+ ({idRequests.filter(i => i.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chat_alerts')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'chat_alerts'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>Filtres Chat & Anti-Scam MoMo ({chatAlerts.filter(a => a.status === 'investigating').length})</span>
        </button>

        {/* Admin specific tabs */}
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md'
                  : 'bg-stone-900 border border-amber-500/30 text-amber-300 hover:text-amber-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>KPIs & Analytics Matrimoniaux</span>
            </button>

            <button
              onClick={() => setActiveTab('user_management')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'user_management'
                  ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md'
                  : 'bg-stone-900 border border-amber-500/30 text-amber-300 hover:text-amber-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Gestion Utilisateurs & Rôles ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('system_settings')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'system_settings'
                  ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md'
                  : 'bg-stone-900 border border-amber-500/30 text-amber-300 hover:text-amber-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Gouvernance & Sécurité</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('audit_log')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit_log'
              ? 'bg-stone-700 text-white shadow-md'
              : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Journal d'Audit ({auditLogs.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SIGNALEMENTS & FRAUDES (QUEUE) */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-100">
                File active des signalements d’abus et tentatives d’escroquerie
              </h3>
              <p className="text-xs text-stone-400">
                Tolérance zéro pour les demandes d’argent, les faux profils et le non-respect de la charte de dignité.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setFilterPriority('all')}
                className={`px-2.5 py-1 rounded-lg ${filterPriority === 'all' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-900 text-stone-400'}`}
              >
                Tous ({reports.length})
              </button>
              <button
                onClick={() => setFilterPriority('urgent')}
                className={`px-2.5 py-1 rounded-lg ${filterPriority === 'urgent' ? 'bg-rose-600 text-white font-bold' : 'bg-stone-900 text-rose-400'}`}
              >
                Urgent
              </button>
              <button
                onClick={() => setFilterPriority('priority')}
                className={`px-2.5 py-1 rounded-lg ${filterPriority === 'priority' ? 'bg-amber-600 text-white font-bold' : 'bg-stone-900 text-amber-400'}`}
              >
                Prioritaire
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-2xl border transition-all ${
                  report.status === 'approved'
                    ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                    : report.status === 'rejected'
                    ? 'bg-rose-950/20 border-rose-800/40 opacity-70'
                    : 'bg-stone-900 border-stone-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={report.targetUser.avatar}
                      alt={report.targetUser.name}
                      className="w-12 h-12 rounded-full object-cover border border-stone-700 shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-stone-100">
                          {report.targetUser.name}
                        </span>
                        {report.targetUser.city && (
                          <span className="text-[10px] text-stone-400">
                            📍 {report.targetUser.city}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            report.priority === 'urgent'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : report.priority === 'priority'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {report.priority}
                        </span>
                        {report.category === 'scam_momo' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <Smartphone className="w-2.5 h-2.5" /> Alerte MoMo Scam
                          </span>
                        )}
                        <span className="text-[10px] text-stone-500 font-mono">
                          {report.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-stone-200 leading-relaxed max-w-2xl bg-stone-950/60 p-2 rounded-xl border border-stone-800/70">
                        {report.reason}
                      </p>

                      {report.evidenceUrl && (
                        <div className="pt-1">
                          <span className="text-[10px] text-amber-400 block mb-1">Preuve photo jointe au dossier :</span>
                          <img
                            src={report.evidenceUrl}
                            alt="Preuve"
                            className="w-20 h-20 rounded-xl object-cover border border-stone-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                    {report.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleReportAction(report.id, 'ban_user')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          title="Bannir définitivement et blacklister l'IP / numéro"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Bannir & Blacklist</span>
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'rejected')}
                          className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Envoyer un avertissement officiel"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Avertir le compte</span>
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'approved')}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Classer sans suite"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Classer</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-stone-400 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-800">
                        {report.status === 'approved' ? 'Classé sans suite ✓' : 'Sanctionné & Clôturé ✕'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VÉRIFICATION CNI & BIOMÉTRIE 18+ */}
      {/* ========================================================================= */}
      {activeTab === 'id_verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-100">
                Pôle de Contrôle d’Identité Officielle (CNI Cameroun, Passeport & Majorité 18+)
              </h3>
              <p className="text-xs text-stone-400">
                Attribution manuelle du badge certifié Niveau 4 après comparaison faciale et validation du document légal.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-semibold">
              Biométrie IA intégrée
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {idRequests.map((req) => (
              <div
                key={req.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={req.userAvatar}
                      alt={req.userName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-100">{req.userName}</h4>
                      <span className="text-[10px] text-stone-400">📍 {req.userCity} · Soumis {req.submittedAt}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {req.docType === 'cni' ? 'CNI Cameroun' : req.docType === 'passport' ? 'Passeport' : 'Titre Diaspora'}
                  </span>
                </div>

                {/* Document comparison area: Front Doc + Selfie Scan */}
                <div className="grid grid-cols-2 gap-2 bg-stone-950/80 p-2.5 rounded-xl border border-stone-800">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Pièce officielle soumise</span>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800 bg-stone-900">
                      <img src={req.docFrontUrl} alt="Document" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-stone-950/80 text-[8px] text-stone-200 px-1.5 py-0.5 rounded">
                        Document Recto
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Selfie Direct 18+ (Biométrie)</span>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800 bg-stone-900">
                      <img src={req.selfieUrl} alt="Selfie 18+" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-emerald-950/90 text-[8px] text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700/50">
                        {req.biometricMatchScore}% Concordance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Majorité 18+ vérifiée
                  </span>
                  
                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleIDAction(req.id, 'rejected')}
                        className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Rejeter
                      </button>
                      <button
                        onClick={() => handleIDAction(req.id, 'approved')}
                        className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Valider Niveau 4</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-stone-400">
                      Statut : {req.status === 'approved' ? 'Certifié Niveau 4 ✓' : 'Refusé ✕'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FILTRES CHAT & ALERTES ANTI-SCAM MOMO */}
      {/* ========================================================================= */}
      {activeTab === 'chat_alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-100">
                Surveillance IA des Messageries & Détection des Brouteurs Sentimentaux
              </h3>
              <p className="text-xs text-stone-400">
                Interception préventive des demandes de dépôts d’argent, Western Union et numéros Orange Money / MTN MoMo suspects.
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
              IA Sentinelle Active 24/7
            </div>
          </div>

          <div className="space-y-3">
            {chatAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-3 hover:border-amber-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={alert.senderAvatar}
                      alt={alert.senderName}
                      className="w-8 h-8 rounded-full object-cover border border-rose-500/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-100">{alert.senderName}</span>
                      <span className="text-[10px] text-stone-400"> ➜ vers {alert.receiverName} ({alert.timestamp})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                      Sévérité : {alert.severity}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Mots-clés : {alert.flaggedKeywords.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/80 border border-rose-900/40 text-xs text-rose-200/90 leading-relaxed font-mono">
                  "{alert.messageSnippet}"
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {alert.status === 'investigating' ? (
                    <>
                      <button
                        onClick={() => handleChatAlertAction(alert.id, 'clear')}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Fausse Alerte
                      </button>
                      <button
                        onClick={() => handleChatAlertAction(alert.id, 'ban')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspendre le compte immédiatement</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-stone-400">
                      Statut : {alert.status === 'banned' ? 'Banni du réseau ✕' : 'Classé sans suite ✓'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4 (ADMIN ONLY): METRIQUES & ANALYTICS BUSINESS MATRIMONIAUX */}
      {/* ========================================================================= */}
      {isAdmin && activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-100">
              Métriques de Santé Matrimoniale, Parité & Performance Économique
            </h3>
            <span className="text-xs text-amber-400 font-mono">Actualisation en direct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md space-y-2">
              <span className="text-[11px] text-stone-400 font-semibold block">Équilibre de Parité Hommes / Femmes</span>
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-blue-300">51% Hommes</span>
                <span className="text-rose-300">49% Femmes</span>
              </div>
              <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[51%]" />
                <div className="bg-rose-500 h-full w-[49%]" />
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold pt-1">
                ✓ Ratio idéal pour un taux de mariage optimal
              </p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md space-y-2">
              <span className="text-[11px] text-stone-400 font-semibold block">Taux d’Adoption VIP Premium</span>
              <div className="text-2xl font-bold font-mono text-amber-300">14.2%</div>
              <p className="text-[10px] text-stone-400">
                1 842 membres actifs souscripteurs de l’Alliance VIP
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold block">+3.8% ce mois</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md space-y-2">
              <span className="text-[11px] text-stone-400 font-semibold block">Mariages & Alliances Concrétisés</span>
              <div className="text-2xl font-bold font-mono text-rose-300 flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span>342 couples</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Fiançailles, dots et mariages civils déclarés avec succès
              </p>
              <span className="text-[10px] text-amber-400 font-semibold block">Indice de confiance national : 99.4%</span>
            </div>
          </div>

          {/* Revenue breakdown */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
              Répartition des Flux Économiques (Mois en cours)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Souscriptions VIP Alliance</span>
                <span className="text-lg font-bold text-amber-300 block mt-0.5">22 150 000 FCFA</span>
                <span className="text-[10px] text-stone-500">Orange Money, MTN MoMo, Stripe</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Commissions Boutique & Stylistes</span>
                <span className="text-lg font-bold text-rose-300 block mt-0.5">14 800 000 FCFA</span>
                <span className="text-[10px] text-stone-500">Confection robes, Toghu & duos</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Certifications d'Identité Express</span>
                <span className="text-lg font-bold text-emerald-300 block mt-0.5">5 900 000 FCFA</span>
                <span className="text-[10px] text-stone-500">Frais de dossier vérification CNI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5 (ADMIN ONLY): GESTION DES UTILISATEURS & ROLES RBAC */}
      {/* ========================================================================= */}
      {isAdmin && activeTab === 'user_management' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-100">
                Gestion des Rôles & Accréditations (RBAC Console)
              </h3>
              <p className="text-xs text-stone-400">
                Attribuez les rôles en direct : Membre Premium, Prestataire Pro, Modérateur ou Administrateur.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                placeholder="Rechercher par nom, ville ou rôle..."
                className="pl-8 pr-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 w-64"
              />
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] border-b border-stone-800">
                  <tr>
                    <th className="p-3">Utilisateur</th>
                    <th className="p-3">Ville</th>
                    <th className="p-3">Rôle Actuel</th>
                    <th className="p-3">Identité CNI</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Actions de Supervision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-800/30 transition-colors">
                      <td className="p-3 font-semibold text-stone-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center text-xs">
                          {user.name.charAt(0)}
                        </span>
                        <span>{user.name}</span>
                      </td>

                      <td className="p-3 text-stone-300">
                        {user.city}
                      </td>

                      <td className="p-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole)}
                          className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-xs text-amber-300 font-semibold cursor-pointer focus:outline-none focus:border-amber-500"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="premium">Membre VIP Premium</option>
                          <option value="professional">Prestataire Pro</option>
                          <option value="moderator">Modérateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Niveau {user.verificationLevel}/4
                        </span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {user.status === 'active' ? 'Actif' : 'Banni'}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleUserBan(user.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {user.status === 'active' ? 'Bannir' : 'Réactiver'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6 (ADMIN ONLY): GOUVERNANCE & SYSTEM SECURITY SETTINGS */}
      {/* ========================================================================= */}
      {isAdmin && activeTab === 'system_settings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-100">
                Gouvernance, Sécurité Haute Fréquence & Régulation
              </h3>
              <p className="text-xs text-stone-400">
                Configuration des barrières de sécurité et conformité légale (ANTIC / Protection des données).
              </p>
            </div>
            <button
              onClick={() => showToast('Rapport de conformité légale exporté avec succès.')}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Registre Légal (ANTIC)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Barrières Anti-Brouteurs & Escroqueries</span>
              </h4>

              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-xl hover:bg-stone-950/50">
                  <span className="text-stone-200">Mode « Tolérance Zéro » Fraude Financière</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.zeroToleranceScam}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, zeroToleranceScam: e.target.checked }))}
                    className="accent-rose-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-xl hover:bg-stone-950/50">
                  <span className="text-stone-200">Blocage automatique des numéros Orange Money / MTN MoMo non vérifiés</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.autoBlockMomoNumbers}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, autoBlockMomoNumbers: e.target.checked }))}
                    className="accent-rose-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-xl hover:bg-stone-950/50">
                  <span className="text-stone-200">Exiger la CNI Niveau 4 avant d’activer les appels chiffrés</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.requireIdForChat}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, requireIdForChat: e.target.checked }))}
                    className="accent-rose-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Protection des Mineurs & Pudeur Traditionnelle</span>
              </h4>

              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-xl hover:bg-stone-950/50">
                  <span className="text-stone-200">Scan biométrique strict anti-mineurs (Contrôle 18+ obligatoire)</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.strictAntiMinorScan}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, strictAntiMinorScan: e.target.checked }))}
                    className="accent-rose-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-xl hover:bg-stone-950/50">
                  <span className="text-stone-200">Audit de conformité légale ANTIC Cameroun activé</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.anticLegalComplianceMode}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, anticLegalComplianceMode: e.target.checked }))}
                    className="accent-rose-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: JOURNAL D'AUDIT & HISTORIQUE DES SANCTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'audit_log' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-100">
              Registre Chronologique des Décisions de Modération & Sanctions
            </h3>
            <span className="text-xs text-stone-500">Traçabilité légale infalsifiable</span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-stone-400 bg-stone-950 px-2 py-1 rounded-md text-[10px]">
                    {log.time}
                  </span>
                  <div>
                    <span className="font-bold text-amber-300">{log.action}</span>
                    <span className="text-stone-300"> sur </span>
                    <span className="font-bold text-stone-100">{log.target}</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">{log.reason}</p>
                  </div>
                </div>

                <span className="text-[10px] text-stone-400 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800 self-end sm:self-auto shrink-0">
                  Par : {log.actor}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
