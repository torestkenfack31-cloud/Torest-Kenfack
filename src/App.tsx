import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { HomeOverview } from './components/HomeOverview';
import { Discovery } from './components/Discovery';
import { ChatView } from './components/ChatView';
import { ReelsView } from './components/ReelsView';
import { WeddingEcosystem } from './components/WeddingEcosystem';
import { CommunityView } from './components/CommunityView';
import { ProfileView } from './components/ProfileView';
import { AdminModeration } from './components/AdminModeration';
import { AgeGateModal } from './components/AgeGateModal';
import { SafetyCenterModal } from './components/SafetyCenterModal';
import { VerificationModal } from './components/VerificationModal';
import { LifeProjectModal } from './components/LifeProjectModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { CreateModal } from './components/CreateModal';
import { ProfileCreationModal } from './components/ProfileCreationModal';
import { PremiumModal } from './components/PremiumModal';
import { AuthView } from './components/AuthView';

import { 
  currentUserMock, 
  sampleCandidates, 
  sampleMatches, 
  sampleReels, 
  sampleVendors, 
  sampleCommunityPosts, 
  sampleModerationQueue 
} from './data/mockData';

import { Language, UserRole, UserProfile, LifeProject, MatchItem, ReelItem, CommunityPost } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('fr');
  const [activeRole, setActiveRole] = useState<UserRole>('user');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Authentication State (defaults to true so app is ready, but user can log out / access auth anytime)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Age verification state (18+ gate)
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);
  const [showAgeGate, setShowAgeGate] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile>(currentUserMock);
  const [candidates, setCandidates] = useState<UserProfile[]>(sampleCandidates);
  const [matches, setMatches] = useState<MatchItem[]>(sampleMatches);
  const [reels, setReels] = useState<ReelItem[]>(sampleReels);
  const [posts, setPosts] = useState<CommunityPost[]>(sampleCommunityPosts);

  // Modals state
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isLifeProjectOpen, setIsLifeProjectOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [celebratedMatch, setCelebratedMatch] = useState<UserProfile | null>(null);

  // Selected chat candidate id for deep linking from Match Celebration
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | undefined>(undefined);

  // Handlers
  const handleLoginSuccess = (user: UserProfile, role?: UserRole) => {
    setCurrentUser(user);
    if (role) setActiveRole(role);
    setIsAuthenticated(true);
    setActiveTab('home');
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'moderator' || role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'professional') {
      setActiveTab('marriage');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleProfileCreated = (newProfileData: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...newProfileData,
      isVerified: true,
      verificationLevel: 3,
      verifiedDetails: {
        ...prev.verifiedDetails,
        emailVerified: true,
        phoneVerified: true,
        selfieVerified: true,
        idDocumentVerified: false
      }
    }));
  };
  const handleLikeCandidate = (candidate: UserProfile) => {
    // When user likes candidate, trigger match celebration!
    setCelebratedMatch(candidate);

    // Add candidate to matches if not already in
    if (!matches.some((m) => m.user.id === candidate.id)) {
      const newMatch: MatchItem = {
        id: `match_${Date.now()}`,
        user: candidate,
        matchedAt: 'À l’instant',
        compatibilityScore: candidate.compatibilityScore ?? 92,
        lastMessageSnippet: 'Nouveau match ! Engagez la conversation.',
        unreadCount: 1
      };
      setMatches((prev) => [newMatch, ...prev]);
    }
  };

  const handlePassCandidate = (candidate: UserProfile) => {
    // Remove from temporary candidate pool
    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
  };

  const handleReportCandidate = (candidate: UserProfile) => {
    setIsSafetyOpen(true);
  };

  const handleStartChatFromMatch = (user: UserProfile) => {
    setCelebratedMatch(null);
    setSelectedChatUserId(user.id);
    setActiveTab('chat');
  };

  const handleUpgradeVerification = (newLevel: 1 | 2 | 3 | 4) => {
    setCurrentUser((prev) => ({
      ...prev,
      verificationLevel: newLevel,
      isVerified: true
    }));
  };

  const handleSaveLifeProject = (updated: LifeProject) => {
    setCurrentUser((prev) => ({
      ...prev,
      lifeProject: updated
    }));

    // Dynamically adjust candidate scores based on life project synergy
    setCandidates((prev) =>
      prev.map((c) => {
        let delta = 0;
        if (c.lifeProject.marriageTimeline === updated.marriageTimeline) delta += 4;
        if (c.lifeProject.childrenDesire === updated.childrenDesire) delta += 3;
        const newScore = Math.min(99, Math.max(75, (c.compatibilityScore ?? 88) + delta));
        return { ...c, compatibilityScore: newScore };
      })
    );
  };

  const handlePostCreated = (type: 'reel' | 'post' | 'ad', data: any) => {
    if (type === 'reel') {
      const newReel: ReelItem = {
        id: `reel_${Date.now()}`,
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          isVerified: currentUser.isVerified,
          role: currentUser.role
        },
        videoThumbnail: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
        caption: data.caption,
        hashtags: ['#Alliance', '#MariageSérieux', '#Cameroun'],
        category: data.category || 'advice',
        audioTitle: 'Voix Originale · Alliance',
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        status: 'published'
      };
      setReels((prev) => [newReel, ...prev]);
      setActiveTab('reels');
    } else if (type === 'post') {
      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          city: currentUser.city,
          isVerified: currentUser.isVerified,
          role: currentUser.role
        },
        content: data.caption,
        imageUrl: data.imageUrl || undefined,
        category: data.category || 'advice',
        likesCount: 1,
        commentsCount: 0,
        createdAt: 'À l’instant'
      };
      setPosts((prev) => [newPost, ...prev]);
      setActiveTab('home');
    }
  };

  // If user is not authenticated (or has logged out), show dedicated Auth Page
  if (!isAuthenticated) {
    return (
      <AuthView
        onLoginSuccess={handleLoginSuccess}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200 pb-20 lg:pb-8">
      {/* Mandatory Top Bar Contract */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onLogout={handleLogout}
        verificationLevel={currentUser.verificationLevel}
      />

      {/* Secondary Desktop & Tablet Nav Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        language={language}
        unreadCount={matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0)}
        activeRole={activeRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeOverview
            currentUser={currentUser}
            onNavigate={setActiveTab}
            onOpenLifeProject={() => setIsLifeProjectOpen(true)}
            onOpenVerification={() => setIsVerificationOpen(true)}
            onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
            onOpenCreateReel={() => setIsCreateOpen(true)}
            onOpenPremium={() => setIsPremiumOpen(true)}
            activeRole={activeRole}
            language={language}
            posts={posts}
            reels={reels}
            onAddPost={(newP) => setPosts((prev) => [newP, ...prev])}
          />
        )}

        {activeTab === 'discover' && (
          <Discovery
            candidates={candidates}
            onLikeCandidate={handleLikeCandidate}
            onPassCandidate={handlePassCandidate}
            onReportCandidate={handleReportCandidate}
            onOpenPremium={() => setIsPremiumOpen(true)}
            activeRole={activeRole}
            language={language}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            matches={matches}
            currentUser={currentUser}
            initialSelectedUserId={selectedChatUserId}
            onOpenSafety={() => setIsSafetyOpen(true)}
            onOpenPremium={() => setIsPremiumOpen(true)}
            activeRole={activeRole}
            language={language}
          />
        )}

        {activeTab === 'reels' && (
          <ReelsView
            reels={reels}
            onOpenCreateReel={() => setIsCreateOpen(true)}
            language={language}
          />
        )}

        {activeTab === 'marriage' && (
          <WeddingEcosystem
            vendors={sampleVendors}
            language={language}
            activeRole={activeRole}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView
            posts={posts}
            onOpenCreatePost={() => setIsCreateOpen(true)}
            language={language}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onOpenLifeProject={() => setIsLifeProjectOpen(true)}
            onOpenVerification={() => setIsVerificationOpen(true)}
            onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
            onOpenPremium={() => setIsPremiumOpen(true)}
            activeRole={activeRole}
            language={language}
          />
        )}

        {activeTab === 'admin' && (
          <AdminModeration
            queue={sampleModerationQueue}
            language={language}
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
          />
        )}
      </main>

      {/* Footer info with Ndolo branding and love charter */}
      <footer className="border-t border-rose-950/40 py-6 text-center text-xs text-stone-300 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-brand font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-amber-200 text-sm">Ndolo ♥</span>
            <span aria-hidden="true" className="text-rose-900">·</span>
            <span className="text-stone-400">L'Amour Vrai & Mariage · Cameroun & Diaspora</span>
            <span aria-hidden="true" className="text-rose-900">·</span>
            <span className="text-emerald-400">18+ Vérifié</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <button onClick={() => setIsSafetyOpen(true)} className="hover:text-rose-300 transition-colors">
              Centre de Sécurité
            </button>
            <button onClick={() => setIsVerificationOpen(true)} className="hover:text-rose-300 transition-colors">
              Vérification d'Identité
            </button>
            <button onClick={() => setShowAgeGate(true)} className="hover:text-rose-300 transition-colors">
              Contrôle 18+
            </button>
            <button onClick={handleLogout} className="hover:text-rose-300 transition-colors text-rose-300 font-semibold">
              Connexion / Inscription
            </button>
            <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} className="hover:text-rose-300 transition-colors font-medium">
              {language === 'fr' ? 'English (EN)' : 'Français (FR)'}
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {/* 1. Age Gate (18+ strict) */}
      <AgeGateModal
        isOpen={showAgeGate}
        language={language}
        onConfirmAdult={() => {
          setIsAdultConfirmed(true);
          setShowAgeGate(false);
        }}
      />

      {/* 2. Match Celebration Modal */}
      {celebratedMatch && (
        <MatchCelebrationModal
          currentUser={currentUser}
          matchedUser={celebratedMatch}
          onStartChat={handleStartChatFromMatch}
          onClose={() => setCelebratedMatch(null)}
          language={language}
        />
      )}

      {/* 3. Safety Center Modal */}
      <SafetyCenterModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        language={language}
      />

      {/* 4. Verification 4-Tier Modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentUser={currentUser}
        onUpgradeLevel={handleUpgradeVerification}
        language={language}
      />

      {/* 5. Life Project & Values Questionnaire Modal */}
      <LifeProjectModal
        isOpen={isLifeProjectOpen}
        onClose={() => setIsLifeProjectOpen(false)}
        lifeProject={currentUser.lifeProject}
        onSave={handleSaveLifeProject}
        language={language}
      />

      {/* 6. Create Reel / Post Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handlePostCreated}
        language={language}
        activeRole={activeRole}
      />

      {/* 7. Profile Creation & Biometric Anti-Minor Live Selfie Check */}
      <ProfileCreationModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onProfileCreated={handleProfileCreated}
        language={language}
      />

      {/* 8. Ndolo Premium VIP Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        activeRole={activeRole}
        onUpgradeToPremium={() => {
          setActiveRole('premium');
          setCurrentUser((prev) => ({ ...prev, role: 'premium' }));
        }}
        language={language}
      />
    </div>
  );
}
