import React, { useState, useRef } from 'react';
import { 
  Heart, ShieldCheck, Sparkles, MessageSquare, Film, 
  HeartHandshake, ChevronRight, CheckCircle2, Star, Users, Camera,
  Image as ImageIcon, Smile, Send, MoreHorizontal, ThumbsUp, 
  Share2, MessageCircle, Bookmark, Compass, UserCheck, Search,
  Calendar, Gift, Bell, Play, Award, HelpCircle, ShoppingBag, Scissors,
  Upload, Trash2, Check, X, Tag, Globe, Lock, Copy, Link2, Volume2, Pause, Crown, Briefcase
} from 'lucide-react';
import { Language, UserProfile, MatchItem, ReelItem, CommunityPost, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { TabType } from './Navigation';
import { sampleCommunityPosts, sampleReels, sampleMatches, sampleBridalDesigns } from '../data/mockData';

interface HomeOverviewProps {
  currentUser: UserProfile;
  onNavigate: (tab: TabType) => void;
  onOpenLifeProject: () => void;
  onOpenVerification: () => void;
  onOpenCreateProfile: () => void;
  onOpenCreateReel?: () => void;
  onOpenPremium?: () => void;
  activeRole?: UserRole;
  language: Language;
  posts?: CommunityPost[];
  reels?: ReelItem[];
  onAddPost?: (post: CommunityPost) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  currentUser,
  onNavigate,
  onOpenLifeProject,
  onOpenVerification,
  onOpenCreateProfile,
  onOpenCreateReel,
  onOpenPremium,
  activeRole,
  language,
  posts: externalPosts,
  reels: externalReels,
  onAddPost
}) => {
  const t = translations[language];

  // Reels list (from props or mockData)
  const displayReels = externalReels && externalReels.length > 0 ? externalReels : sampleReels;
  const [activePreviewReel, setActivePreviewReel] = useState<ReelItem | null>(null);
  const [isPlayingInlineReel, setIsPlayingInlineReel] = useState(false);

  // News Feed Posts State (with interactive like & comments)
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>(sampleCommunityPosts);
  const posts = externalPosts || localPosts;
  const setPosts = (newPostsOrFn: CommunityPost[] | ((prev: CommunityPost[]) => CommunityPost[])) => {
    if (typeof newPostsOrFn === 'function') {
      setLocalPosts((prev) => newPostsOrFn(externalPosts || prev));
    } else {
      setLocalPosts(newPostsOrFn);
    }
  };
  const [newPostText, setNewPostText] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [postPhotoUrl, setPostPhotoUrl] = useState<string | null>(null);
  const [postCategory, setPostCategory] = useState<'discussion' | 'advice' | 'testimony' | 'event'>('discussion');
  const [selectedTagPerson, setSelectedTagPerson] = useState<string | null>(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isPostBoxFocused, setIsPostBoxFocused] = useState(false);
  const [postUploadError, setPostUploadError] = useState<string | null>(null);
  const feedFileInputRef = useRef<HTMLInputElement>(null);

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [shareToastMessage, setShareToastMessage] = useState<string | null>(null);

  // Handle post link copy & share (without window.alert which is restricted in iframes)
  const handleSharePost = (post: CommunityPost) => {
    const postUrl = `${window.location.origin}/#post-${post.id}`;
    const shareText = `« ${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''} » par ${post.author.name} sur Ndolo`;

    // Try modern navigator.clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(postUrl).then(
        () => {
          setCopiedPostId(post.id);
          setShareToastMessage(
            language === 'fr'
              ? 'Lien de la publication copié dans le presse-papier !'
              : 'Post link copied to clipboard!'
          );
          setTimeout(() => {
            setCopiedPostId(null);
            setShareToastMessage(null);
          }, 3000);
        },
        () => fallbackCopy(postUrl, post.id)
      );
    } else {
      fallbackCopy(postUrl, post.id);
    }
  };

  const fallbackCopy = (text: string, postId: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setCopiedPostId(postId);
      setShareToastMessage(
        language === 'fr'
          ? 'Lien de la publication copié dans le presse-papier !'
          : 'Post link copied to clipboard!'
      );
      setTimeout(() => {
        setCopiedPostId(null);
        setShareToastMessage(null);
      }, 3000);
    } catch (err) {
      setShareToastMessage(
        language === 'fr'
          ? 'Impossible de copier automatiquement le lien.'
          : 'Could not copy link automatically.'
      );
      setTimeout(() => setShareToastMessage(null), 3000);
    }
  };

  // Handle local photo upload for Facebook-style feed post
  const handleFeedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPostUploadError(language === 'fr' ? 'Format image non valide (JPG, PNG, WEBP).' : 'Invalid image format.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPostUploadError(language === 'fr' ? 'L’image dépasse 10 Mo.' : 'Image exceeds 10MB.');
      return;
    }

    setPostUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPostPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Stories (Ndolo Reels & Verified Profiles as Facebook Stories)
  const stories = [
    {
      id: 'story_me',
      isMe: true,
      name: t.feed.yourStory,
      avatar: currentUser.avatar,
      bgImage: currentUser.avatar,
      isVerified: true
    },
    {
      id: 'story_1',
      name: 'Brenda N.',
      avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      bgImage: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
      isVerified: true,
      city: 'Yaoundé'
    },
    {
      id: 'story_2',
      name: 'Kevin Fotso',
      avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      bgImage: '/src/assets/images/reel_traditional_attire_1790589945041.jpg',
      isVerified: true,
      city: 'Douala'
    },
    {
      id: 'story_3',
      name: 'Palais des Noces',
      avatar: '/src/assets/images/wedding_rings_planning_1790589966684.jpg',
      bgImage: '/src/assets/images/reel_wedding_decor_1790589955131.jpg',
      isVerified: true,
      city: 'Bastos'
    },
    {
      id: 'story_4',
      name: 'Diane & Marc',
      avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      bgImage: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
      isVerified: true,
      city: 'Diaspora'
    }
  ];

  // Handle post creation on Feed (with text, photo, sentiment, tag)
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !postPhotoUrl) return;

    let composedContent = newPostText.trim();
    if (selectedFeeling) {
      composedContent += `\n\n✨ Sentiment : ${selectedFeeling}`;
    }
    if (selectedTagPerson) {
      composedContent += `\n👥 Avec : ${selectedTagPerson}`;
    }

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
      content: composedContent,
      imageUrl: postPhotoUrl || undefined,
      category: postCategory,
      likesCount: 1,
      commentsCount: 0,
      createdAt: language === 'fr' ? 'À l’instant' : 'Just now'
    };

    if (onAddPost) {
      onAddPost(newPost);
    }
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setPostPhotoUrl(null);
    setSelectedFeeling(null);
    setSelectedTagPerson(null);
    setShowFeelingPicker(false);
    setShowTagPicker(false);
    setIsPostBoxFocused(false);
    setPostUploadError(null);
  };

  // Toggle Like on post
  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isCurrentlyLiked = !!prev[postId];
      const nextState = !isCurrentlyLiked;

      setPosts((currentPosts) =>
        currentPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              likesCount: nextState ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
            };
          }
          return p;
        })
      );

      return { ...prev, [postId]: nextState };
    });
  };

  // Add Comment to post
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), text]
    }));

    setPosts((currentPosts) =>
      currentPosts.map((p) =>
        p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
      )
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 relative">
      {/* Toast notification when link is copied */}
      {shareToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-stone-900/95 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{shareToastMessage}</span>
        </div>
      )}

      {/* Inline Reel Player Modal Overlay when user clicks any Reel from Home */}
      {activePreviewReel && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-sm sm:max-w-md bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col aspect-[9/16] max-h-[85vh]">
            {/* Close button */}
            <button
              onClick={() => {
                setActivePreviewReel(null);
                setIsPlayingInlineReel(false);
              }}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Background / Thumbnail with simulated motion */}
            <div className="relative flex-1 w-full h-full overflow-hidden bg-black">
              <img
                src={activePreviewReel.videoThumbnail}
                alt={activePreviewReel.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95" />

              {/* Center Play/Pause button */}
              <div
                onClick={() => setIsPlayingInlineReel(!isPlayingInlineReel)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              >
                {!isPlayingInlineReel && (
                  <div className="w-16 h-16 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm animate-pulse">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                )}
              </div>

              {/* Progress bar simulation */}
              <div className="absolute top-0 inset-x-0 h-1 bg-stone-800">
                <div className="h-full bg-rose-500 w-2/3 animate-pulse" />
              </div>

              {/* Right Side Social Actions */}
              <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-4 text-white">
                <button
                  onClick={() => {
                    // Update likes locally
                    setActivePreviewReel((prev) =>
                      prev ? { ...prev, likesCount: prev.likesCount + 1 } : null
                    );
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-rose-500/80 transition-colors">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  </div>
                  <span className="text-[10px] font-bold drop-shadow">
                    {activePreviewReel.likesCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActivePreviewReel(null);
                    onNavigate('reels');
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-amber-500/80 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold drop-shadow">
                    {activePreviewReel.commentsCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setShareToastMessage(language === 'fr' ? 'Lien du Reel copié !' : 'Reel link copied!');
                    setTimeout(() => setShareToastMessage(null), 2500);
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-blue-500/80 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold drop-shadow">
                    {language === 'fr' ? 'Partager' : 'Share'}
                  </span>
                </button>
              </div>

              {/* Bottom Creator Info & Caption */}
              <div className="absolute inset-x-0 bottom-0 p-4 space-y-2.5 z-10">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activePreviewReel.creator.avatar}
                    alt={activePreviewReel.creator.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-rose-500 shadow-md"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block drop-shadow">
                      {activePreviewReel.creator.name}
                    </span>
                    <span className="text-[10px] text-rose-300 font-mono">
                      🎵 {activePreviewReel.audioTitle || 'Son original · Alliance'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-100 leading-relaxed drop-shadow line-clamp-3">
                  {activePreviewReel.caption}
                </p>

                {activePreviewReel.hashtags && (
                  <div className="flex flex-wrap gap-1">
                    {activePreviewReel.hashtags.map((h, i) => (
                      <span key={i} className="text-[10px] text-amber-300 font-semibold drop-shadow">
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Open full reels player button */}
                <button
                  onClick={() => {
                    setActivePreviewReel(null);
                    onNavigate('reels');
                  }}
                  className="w-full py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Ouvrir en plein écran & défiler' : 'Open Fullscreen & Scroll'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facebook 3-Column Layout: Left Sidebar + Central News Feed + Right Contacts/Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Facebook-Style Shortcuts & Navigation (3 cols) */}
        {/* ========================================================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 h-fit">
          {/* User mini profile badge */}
          <div 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-900/80 cursor-pointer transition-colors border border-transparent hover:border-rose-950/40"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-rose-500/50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-stone-950" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-stone-100 truncate">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-stone-400 truncate">
                {currentUser.profession} · {currentUser.city}
              </span>
            </div>
          </div>

          {/* Facebook Left Menu Shortcuts */}
          <div className="space-y-1 text-xs">
            <button
              onClick={() => onNavigate('discover')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-900 text-stone-300 hover:text-stone-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4 fill-rose-500/30 text-rose-400" />
                </div>
                <span className="font-medium">{t.feed.shortcuts.matches}</span>
              </div>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full">
                {language === 'fr' ? 'Nouveau' : 'New'}
              </span>
            </button>

            <button
              onClick={() => onNavigate('reels')}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-900 text-stone-300 hover:text-stone-100 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Film className="w-4 h-4" />
              </div>
              <span className="font-medium">{t.feed.shortcuts.reels}</span>
            </button>

            <button
              onClick={() => onNavigate('marriage')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-900 text-stone-300 hover:text-stone-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <span className="font-medium">Boutique Stylistes & Mariage</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                Robes & Duos
              </span>
            </button>

            <button
              onClick={() => onNavigate('community')}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-900 text-stone-300 hover:text-stone-100 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-medium">{t.feed.shortcuts.community}</span>
            </button>

            <button
              onClick={onOpenLifeProject}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-900 text-stone-300 hover:text-stone-100 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-medium">{t.feed.shortcuts.lifeProject}</span>
            </button>
          </div>

          <hr className="border-stone-800/80 my-3" />

          {/* Prestataire Pro Dashboard Shortcut Card */}
          {activeRole === 'professional' && (
            <div className="p-3.5 bg-gradient-to-b from-amber-950/30 via-stone-900 to-stone-900 border border-amber-500/50 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-bold text-amber-200">
                    {language === 'fr' ? 'Espace Prestataire Pro' : 'Pro Business Space'}
                  </span>
                </div>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-stone-300 leading-relaxed">
                {language === 'fr' 
                  ? 'Gérez vos essayages, vos créations en vitrine et répondez aux futurs mariés.'
                  : 'Manage client fittings, showcase creations and respond to brides & grooms.'}
              </p>
              <button
                onClick={() => onNavigate('marriage')}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-[11px] font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Ouvrir mon Tableau de Bord' : 'Open Pro Dashboard'}</span>
              </button>
            </div>
          )}

          {/* Moderator Console Shortcut Card */}
          {activeRole === 'moderator' && (
            <div className="p-3.5 bg-gradient-to-b from-rose-950/30 via-stone-900 to-stone-900 border border-rose-500/50 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-bold text-rose-200">
                    {language === 'fr' ? 'Console de Modération' : 'Moderation Console'}
                  </span>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                  MOD
                </span>
              </div>
              <p className="text-[10px] text-stone-300 leading-relaxed">
                {language === 'fr' 
                  ? 'Dossiers urgents, contrôle CNI & biométrie 18+, alertes anti-brouteurs Orange Money.'
                  : 'Urgent reports, national ID & 18+ biometric verification, anti-scam alerts.'}
              </p>
              <button
                onClick={() => onNavigate('admin')}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Ouvrir la Console Modérateur' : 'Open Moderator Console'}</span>
              </button>
            </div>
          )}

          {/* Admin Suite Shortcut Card */}
          {activeRole === 'admin' && (
            <div className="p-3.5 bg-gradient-to-b from-amber-950/30 via-stone-900 to-stone-900 border border-amber-500/60 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-bold text-amber-200">
                    {language === 'fr' ? 'Centre d’Administration' : 'Admin Control Center'}
                  </span>
                </div>
                <span className="text-[9px] bg-amber-400/25 text-amber-300 px-1.5 py-0.5 rounded-full font-extrabold">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[10px] text-stone-300 leading-relaxed">
                {language === 'fr' 
                  ? 'Pilotage global, métriques matrimoniales, attribution des rôles RBAC et conformité.'
                  : 'Global supervision, matrimonial analytics, RBAC role management and compliance.'}
              </p>
              <button
                onClick={() => onNavigate('admin')}
                className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-stone-950 font-extrabold rounded-xl text-[11px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Accéder au Centre Admin' : 'Open Admin Suite'}</span>
              </button>
            </div>
          )}

          {/* Premium VIP Matrimonial Shortcut Card */}
          <div className="p-3.5 bg-gradient-to-b from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/40 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold text-amber-200">
                  {language === 'fr' ? 'Ndolo VIP Alliance' : 'Ndolo VIP Alliance'}
                </span>
              </div>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                {activeRole === 'premium' ? 'ACTIF' : 'PREMIUM'}
              </span>
            </div>
            <p className="text-[10px] text-stone-300 leading-relaxed">
              {language === 'fr' 
                ? 'Découvrez qui visite votre profil, likes illimités, boost prioritaire et notes audio directes.'
                : 'See who viewed your profile, unlimited likes, priority boost and direct audio notes.'}
            </p>
            <button
              onClick={onOpenPremium}
              className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-[11px] font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 fill-stone-950" />
              <span>{activeRole === 'premium' ? 'Gérer mon abonnement VIP' : 'Passer au Mode Premium'}</span>
            </button>
          </div>

          {/* Anti-Minor Biometric Verification Shortcut Card */}
          <div className="p-3.5 bg-gradient-to-b from-rose-950/40 to-stone-900 border border-rose-900/40 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="text-[11px] font-bold text-rose-100">
                {t.feed.shortcuts.antiMinorCardTitle}
              </span>
            </div>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              {t.feed.shortcuts.antiMinorCardDesc}
            </p>
            <button
              onClick={onOpenCreateProfile}
              className="w-full py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-xl text-[11px] font-semibold transition-colors"
            >
              {t.feed.shortcuts.verifySelfieBtn}
            </button>
          </div>

          {/* Quick Footer Links */}
          <div className="text-[10px] text-stone-400 px-2 space-y-1">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenVerification(); }} className="hover:underline">{t.feed.shortcuts.privacy}</a>
              <span>·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenLifeProject(); }} className="hover:underline">{t.feed.shortcuts.charter}</a>
              <span>·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('marriage'); }} className="hover:underline">{t.feed.shortcuts.advertising}</a>
            </div>
            <div>Ndolo Cameroon © 2026</div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Facebook News Feed & Stories (6 cols)     */}
        {/* ========================================================= */}
        <main className="col-span-1 lg:col-span-6 space-y-4">
          
          {/* 1. FACEBOOK STORIES / STATUTS CAROUSEL */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => onNavigate('reels')}
                className="relative shrink-0 w-28 sm:w-32 h-44 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-lg snap-start border border-stone-800 hover:border-rose-500/60 transition-all select-none"
              >
                {/* Story Background Image */}
                <img
                  src={story.bgImage}
                  alt={story.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

                {/* Top Avatar Lockup */}
                <div className="absolute top-2.5 left-2.5">
                  {story.isMe ? (
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center border-2 border-stone-950 shadow-md">
                      <span className="text-base font-bold">+</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border-2 border-rose-500"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-stone-950" />
                    </div>
                  )}
                </div>

                {/* Story Bottom Label */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[11px] font-bold text-white block truncate drop-shadow-md">
                    {story.isMe ? t.feed.createStory : story.name}
                  </span>
                  {story.city && (
                    <span className="text-[9px] text-rose-200 block truncate drop-shadow">
                      {story.city}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 2. FACEBOOK-STYLE "QU'AVEZ-VOUS EN TÊTE ?" (FEED CREATOR COMPLET) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3 transition-all">
            {/* User row with Privacy badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/50 shrink-0"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-100 block">
                    {currentUser.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5">
                    <span className="inline-flex items-center gap-1 bg-stone-800/80 px-2 py-0.5 rounded-full border border-stone-700/60">
                      <Globe className="w-2.5 h-2.5 text-stone-400" />
                      <span>{language === 'fr' ? 'Public (Membres)' : 'Public (Members)'}</span>
                    </span>
                    {selectedFeeling && (
                      <span className="inline-flex items-center gap-1 text-rose-300 font-medium">
                        · {selectedFeeling}
                      </span>
                    )}
                    {selectedTagPerson && (
                      <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                        · avec {selectedTagPerson}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value as any)}
                className="bg-stone-950 border border-stone-800 hover:border-stone-700 text-[10px] text-stone-300 rounded-xl px-2.5 py-1 focus:outline-none focus:border-rose-500"
              >
                <option value="discussion">💬 {language === 'fr' ? 'Discussion' : 'Discussion'}</option>
                <option value="advice">💡 {language === 'fr' ? 'Conseil & Sagesse' : 'Advice'}</option>
                <option value="testimony">💍 {language === 'fr' ? 'Témoignage Mariage' : 'Testimony'}</option>
                <option value="event">🎉 {language === 'fr' ? 'Dot & Célébration' : 'Celebration'}</option>
              </select>
            </div>

            {/* Post Textarea */}
            <div className="relative">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                onFocus={() => setIsPostBoxFocused(true)}
                rows={isPostBoxFocused || postPhotoUrl || newPostText.length > 50 ? 3 : 2}
                placeholder={
                  language === 'fr'
                    ? `Que voulez-vous partager avec la communauté, ${currentUser.name.split(' ')[0]} ?`
                    : `What's on your mind, ${currentUser.name.split(' ')[0]}?`
                }
                className="w-full bg-stone-950/80 hover:bg-stone-950 focus:bg-stone-950 border border-stone-800 focus:border-rose-500/60 rounded-2xl p-3 text-xs text-stone-100 placeholder-stone-400 transition-all focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Photo Attached Preview Area */}
            {postPhotoUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-stone-700 bg-stone-950 group">
                <img
                  src={postPhotoUrl}
                  alt="Aperçu publication"
                  className="w-full max-h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPostPhotoUrl(null)}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-black/75 hover:bg-black text-white rounded-full transition-colors backdrop-blur-sm cursor-pointer shadow-lg"
                  title="Supprimer la photo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-emerald-300 flex items-center gap-1 border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                  <span>Photo prête à publier</span>
                </div>
              </div>
            )}

            {/* Upload Error display */}
            {postUploadError && (
              <p className="text-[11px] text-rose-400 font-medium px-1">{postUploadError}</p>
            )}

            {/* Hidden File Input for Image Upload */}
            <input
              ref={feedFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFeedPhotoUpload}
              className="hidden"
            />

            {/* Feelings & Tag Badges Bar */}
            {(selectedFeeling || selectedTagPerson) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selectedFeeling && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/15 border border-rose-500/30 rounded-full text-[11px] text-rose-200">
                    <Smile className="w-3 h-3 text-rose-400" />
                    <span>{selectedFeeling}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFeeling(null)}
                      className="hover:text-white ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTagPerson && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-[11px] text-amber-200">
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span>avec {selectedTagPerson}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedTagPerson(null)}
                      className="hover:text-white ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Feelings Picker Popover */}
            {showFeelingPicker && (
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
                <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
                  {language === 'fr' ? 'Comment vous sentez-vous ?' : 'How are you feeling?'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '❤️ Amoureux(se)',
                    '💍 Prêt(e) au Mariage',
                    '✨ Béni(e) & Confiant(e)',
                    '🌟 Heureux(se)',
                    '🙏 Reconnaissant(e)',
                    '🎉 En fête',
                    '👑 Épanoui(e)'
                  ].map((feeling) => (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => {
                        setSelectedFeeling(feeling);
                        setShowFeelingPicker(false);
                      }}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-rose-500/20 text-stone-200 hover:text-rose-200 border border-stone-800 hover:border-rose-500/40 rounded-xl text-[11px] transition-colors"
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Person Picker Popover */}
            {showTagPicker && (
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
                <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
                  {language === 'fr' ? 'Identifier une personne :' : 'Tag someone:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Brenda N.', 'Kevin Fotso', 'Diane Mbida', 'Marc Ondoua', 'Palais des Noces'].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setSelectedTagPerson(name);
                        setShowTagPicker(false);
                      }}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-amber-500/20 text-stone-200 hover:text-amber-200 border border-stone-800 hover:border-amber-500/40 rounded-xl text-[11px] transition-colors"
                    >
                      @{name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-stone-800/80" />

            {/* Facebook Action Buttons Bar (Photo / Sentiment / Identifier / Reel) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
                {/* 1. Bouton Photo / Image */}
                <button
                  type="button"
                  onClick={() => feedFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-stone-100 transition-colors text-[11px] font-medium"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Photo / Image</span>
                </button>

                {/* 2. Bouton Sentiment */}
                <button
                  type="button"
                  onClick={() => {
                    setShowFeelingPicker(!showFeelingPicker);
                    setShowTagPicker(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-stone-100 transition-colors text-[11px] font-medium"
                >
                  <Smile className="w-4 h-4 text-amber-400" />
                  <span>{language === 'fr' ? 'Humeur / Sentiment' : 'Feeling'}</span>
                </button>

                {/* 3. Bouton Identifier / Tag */}
                <button
                  type="button"
                  onClick={() => {
                    setShowTagPicker(!showTagPicker);
                    setShowFeelingPicker(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-stone-100 transition-colors text-[11px] font-medium"
                >
                  <Tag className="w-4 h-4 text-blue-400" />
                  <span>{language === 'fr' ? 'Identifier' : 'Tag'}</span>
                </button>

                {/* 4. Bouton Reel Vidéo */}
                <button
                  type="button"
                  onClick={() => onNavigate('reels')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-stone-100 transition-colors text-[11px] font-medium hidden sm:flex"
                >
                  <Film className="w-4 h-4 text-rose-500" />
                  <span>Reel</span>
                </button>
              </div>

              {/* Bouton Publier style Facebook */}
              <button
                type="button"
                onClick={handlePublishPost}
                disabled={!newPostText.trim() && !postPhotoUrl}
                className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 disabled:opacity-40 disabled:hover:from-rose-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Publier' : 'Post'}</span>
              </button>
            </div>
          </div>

          {/* 3. SUGGESTION CAROUSEL: "Personnes compatibles avec votre projet de vie" */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <h3 className="text-xs font-bold text-stone-100">
                  {t.feed.compatibleSouls}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('discover')}
                className="text-[11px] text-rose-400 hover:underline font-semibold"
              >
                {language === 'fr' ? 'Voir tout →' : 'See all →'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'sugg_1',
                  name: 'Brenda Nguemo',
                  age: 28,
                  city: 'Yaoundé',
                  score: 95,
                  avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
                  bio: language === 'fr' ? 'Auditrice financière' : 'Financial Auditor'
                },
                {
                  id: 'sugg_2',
                  name: 'Carole Mbarga',
                  age: 26,
                  city: 'Douala',
                  score: 91,
                  avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
                  bio: language === 'fr' ? 'Médecin pédiatre' : 'Pediatric Doctor'
                },
                {
                  id: 'sugg_3',
                  name: 'Vanessa Tchoupi',
                  age: 29,
                  city: 'Diaspora Paris',
                  score: 88,
                  avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
                  bio: language === 'fr' ? 'Architecte d’intérieur' : 'Interior Architect'
                }
              ].map((person) => (
                <div
                  key={person.id}
                  onClick={() => onNavigate('discover')}
                  className="bg-stone-950 border border-stone-800 hover:border-rose-500/50 rounded-xl overflow-hidden cursor-pointer group transition-all p-2 flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-1 right-1 bg-stone-950/80 text-rose-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-rose-500/30">
                      {person.score}%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-stone-100 truncate group-hover:text-rose-300">
                      {person.name}, {person.age}
                    </h4>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {person.city}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('discover');
                    }}
                    className="w-full mt-2 py-1 bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white rounded-lg text-[10px] font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>{t.feed.meet}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3b. RUBRIQUE REELS : PLACÉE DIRECTEMENT EN BAS DE 'CŒURS COMPATIBLES AVEC VOTRE PROJET DE VIE' */}
          <div className="bg-stone-900 border border-stone-800 hover:border-rose-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold font-brand text-stone-100">
                      {language === 'fr' ? 'Reels & Sagesse Matrimoniale' : 'Marriage Reels & Wisdom'}
                    </h3>
                    <span className="text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      {language === 'fr' ? 'Vidéos' : 'Videos'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    {language === 'fr' 
                      ? 'Témoignages réels, conseils de pasteurs & cérémonies de dot en vidéo courte'
                      : 'Real testimonies, pastor advice & bride wealth ceremonies in short videos'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('reels')}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>{language === 'fr' ? 'Tout regarder' : 'View all'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid of Reels Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {displayReels.slice(0, 3).map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => {
                    setActivePreviewReel(reel);
                    setIsPlayingInlineReel(true);
                  }}
                  className="group relative bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 hover:border-rose-500/60 cursor-pointer transition-all aspect-[9/13] flex flex-col justify-between shadow-lg"
                >
                  {/* Thumbnail */}
                  <img
                    src={reel.videoThumbnail}
                    alt={reel.caption}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

                  {/* Top Bar: Creator badge */}
                  <div className="relative z-10 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-stone-700/60">
                      <img
                        src={reel.creator.avatar}
                        alt={reel.creator.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="text-[10px] font-semibold text-stone-200 truncate max-w-[90px]">
                        {reel.creator.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                      <Play className="w-3 h-3 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Center Play Overlay on Hover */}
                  <div className="relative z-10 my-auto self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-xl backdrop-blur-sm scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>

                  {/* Bottom Caption & Stats */}
                  <div className="relative z-10 p-2.5 space-y-1 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="text-[11px] font-medium text-stone-100 line-clamp-2 leading-tight">
                      {reel.caption}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-stone-300 pt-0.5">
                      <span className="flex items-center gap-1 text-rose-300 font-semibold">
                        ♥ {reel.likesCount}
                      </span>
                      <span className="text-stone-400">
                        💬 {reel.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Action */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => onOpenCreateReel ? onOpenCreateReel() : onNavigate('reels')}
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'fr' ? 'Partager ma vidéo Reel' : 'Share my Reel video'}</span>
              </button>

              <button
                onClick={() => onNavigate('reels')}
                className="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Film className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Ouvrir l’espace Reels' : 'Open Reels Space'}</span>
              </button>
            </div>
          </div>

          {/* 3c. NOUVELLE SECTION VITRINE : BOUTIQUE DES STYLISTES & CRÉATEURS DE MARIAGE */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-rose-950/30 border border-stone-800 hover:border-rose-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold font-brand text-stone-100">
                      Boutique des Stylistes & Tenues de Mariage
                    </h3>
                    <span className="text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Vitrine
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Robes féeriques, ensembles Toghu & costumes 3 pièces des créateurs africains
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('marriage')}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 shrink-0"
              >
                <span>Voir la boutique</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Aperçu des 3 modèles phares de mariage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {sampleBridalDesigns.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('marriage')}
                  className="group bg-stone-950/80 border border-stone-800 hover:border-rose-500/50 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-300 border border-rose-500/30">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-stone-100 line-clamp-1 group-hover:text-rose-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{item.stylist.brandName} ({item.stylist.city})</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-[10px]">
                      <span className="text-stone-400 truncate max-w-[120px]">{item.fabricType}</span>
                      <span className="text-rose-400 font-semibold group-hover:underline">Essayer →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action footer */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-stone-400 hidden sm:inline">
                ✨ Essayage en atelier ou à domicile avec prise de mensurations.
              </span>
              <button
                onClick={() => onNavigate('marriage')}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-2 transition-all ml-auto"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ouvrir la Boutique & Prendre RDV</span>
              </button>
            </div>
          </div>

          {/* 4. THE INTERACTIVE FACEBOOK NEWS FEED (Posts with Likes & Comments) */}
          <div className="space-y-4">
            {posts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              const comments = commentsMap[post.id] || [];
              const isCommentsOpen = openCommentsPostId === post.id;

              return (
                <article
                  key={post.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3"
                >
                  {/* Post Header: Avatar, Author, Time, Menu */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-rose-500/40"
                        />
                        {post.author.isVerified && (
                          <span className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-100">
                            {post.author.name}
                          </span>
                          {post.author.role === 'professional' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                              {language === 'fr' ? 'Pro Mariage' : 'Wedding Pro'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                          <span>{post.author.city}</span>
                          <span>·</span>
                          <span>{post.createdAt}</span>
                          <span>·</span>
                          <span title="Visible by members">🌍</span>
                        </div>
                      </div>
                    </div>

                    <button className="text-stone-400 hover:text-stone-200 p-1 rounded-full hover:bg-stone-800">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Body: Text Content */}
                  <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Post Media: Optional Attached Picture */}
                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-stone-800 mt-2 max-h-96">
                      <img
                        src={post.imageUrl}
                        alt="Image partagée"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Social Counters: Likes count and Comments count */}
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-b border-stone-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                        ♥
                      </div>
                      <span>{post.likesCount} {t.feed.peopleLike}</span>
                    </div>

                    <button
                      onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                      className="hover:underline"
                    >
                      {post.commentsCount + comments.length} {t.feed.comments}
                    </button>
                  </div>

                  {/* Facebook Action Bar: J'aime, Commenter, Partager */}
                  <div className="grid grid-cols-3 gap-1 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-colors font-medium ${
                        isLiked
                          ? 'text-rose-400 bg-rose-500/10'
                          : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
                      <span>{t.feed.like}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                      className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.feed.comment}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSharePost(post)}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-medium cursor-pointer ${
                        copiedPostId === post.id
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {copiedPostId === post.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">
                            {language === 'fr' ? 'Lien copié !' : 'Link copied!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>{t.feed.share}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expandable Comments Section */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-stone-800 space-y-3">
                      {/* Comments List */}
                      {comments.map((c, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs">
                          <img
                            src={currentUser.avatar}
                            alt="Moi"
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="bg-stone-950 border border-stone-800 rounded-2xl px-3 py-2 text-stone-200 flex-1">
                            <span className="font-bold text-[11px] text-rose-300 block">
                              {currentUser.name}
                            </span>
                            <p className="text-[11px] leading-relaxed">{c}</p>
                          </div>
                        </div>
                      ))}

                      {/* Comment Input Box */}
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={currentUser.avatar}
                          alt="Moi"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 flex items-center bg-stone-950 border border-stone-800 rounded-full px-3 py-1.5 focus-within:border-rose-500">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            placeholder={t.feed.writeCommentPlaceholder}
                            className="w-full bg-transparent text-xs text-stone-100 placeholder-stone-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            className="text-rose-400 hover:text-rose-300 text-xs font-bold pl-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Facebook Contacts, Matches & Wedding Ads (3 cols) */}
        {/* ========================================================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 h-fit">
          
          {/* 1. Facebook-Style "Sponsorisé / À la Une" (Wedding & Venues) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-1">
              {t.feed.sponsored}
            </span>

            <div 
              onClick={() => onNavigate('marriage')}
              className="p-3 bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all space-y-2 group shadow-lg"
            >
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden relative">
                <img
                  src="/src/assets/images/wedding_rings_planning_1790589966684.jpg"
                  alt="Alliances en or 18K"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-stone-950/80 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  {language === 'fr' ? 'Or 18K Certifié' : '18K Gold Certified'}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                  Maison Royale Joaillerie Douala
                </h4>
                <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5">
                  {language === 'fr'
                    ? 'Alliances de mariage gravées sur-mesure pour les fiancés de Ndolo. Remise exclusive de 15%.'
                    : 'Custom engraved wedding rings for Ndolo engaged couples. Exclusive 15% discount.'}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-stone-800/80" />

          {/* 2. Facebook-Style "Contacts & Affinités en ligne" */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                {t.feed.onlineAffinites} ({sampleMatches.length})
              </span>
              <button 
                onClick={() => onNavigate('chat')}
                className="text-[10px] text-rose-400 hover:underline"
              >
                {t.nav.chat}
              </button>
            </div>

            <div className="space-y-1">
              {sampleMatches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onNavigate('chat')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-900 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={m.user.avatar}
                        alt={m.user.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-rose-500/30"
                      />
                      {m.user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-stone-950" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-stone-200 block truncate group-hover:text-rose-300">
                        {m.user.name}
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate">
                        {m.compatibilityScore}% {t.discover.compatibility}
                      </span>
                    </div>
                  </div>

                  <MessageSquare className="w-3.5 h-3.5 text-stone-500 group-hover:text-rose-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-stone-800/80" />

          {/* 3. Community Group Invitation */}
          <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Prochain Cercle de Prière & Conseil' : 'Upcoming Prayer & Advice Circle'}</span>
            </div>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              {language === 'fr'
                ? '« Réussir sa dot traditionnelle au Cameroun » ce dimanche à 18h avec les aînés.'
                : '« Mastering your traditional bride price & dowry » this Sunday at 6 PM with elders.'}
            </p>
            <button
              onClick={() => onNavigate('community')}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold underline"
            >
              {language === 'fr' ? 'Rejoindre le cercle communautaire →' : 'Join community circle →'}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
