import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Bookmark, Music, ShieldCheck, 
  Send, X, Sparkles, Volume2, VolumeX, Plus, Play, Pause
} from 'lucide-react';
import { ReelItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface ReelsViewProps {
  reels: ReelItem[];
  onOpenCreateReel: () => void;
  language: Language;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  onOpenCreateReel,
  language
}) => {
  const t = translations[language];
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    const initial: Record<string, { count: number; liked: boolean }> = {};
    reels.forEach((r) => {
      initial[r.id] = { count: r.likesCount, liked: !!r.hasLiked };
    });
    return initial;
  });
  const [savedState, setSavedState] = useState<Record<string, boolean>>({});
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsList, setCommentsList] = useState<Record<string, string[]>>({
    'reel_1': [
      "Amen, c'est tellement vrai. Les fondations spirituelles sont la clé.",
      "Merci pasteur pour ce rappel indispensable pour notre génération !"
    ],
    'reel_2': [
      "La beauté de nos traditions camerounaises ! Que les ancêtres bénissent ce couple.",
      "Magnifique cérémonie, félicitations aux deux familles."
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [shareToast, setShareToast] = useState<string | null>(null);

  const currentReel = reels[activeReelIndex] || reels[0];

  const handleToggleLike = (reelId: string) => {
    setLikesState((prev) => {
      const cur = prev[reelId] || { count: 0, liked: false };
      return {
        ...prev,
        [reelId]: {
          count: cur.liked ? cur.count - 1 : cur.count + 1,
          liked: !cur.liked
        }
      };
    });
  };

  const handleToggleSave = (reelId: string) => {
    setSavedState((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  const handleShare = () => {
    setShareToast('Lien du Reel copié dans le presse-papier !');
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentReel) return;

    setCommentsList((prev) => ({
      ...prev,
      [currentReel.id]: [...(prev[currentReel.id] || []), newCommentText.trim()]
    }));
    setNewCommentText('');
  };

  return (
    <div className="max-w-md mx-auto px-2 sm:px-4 py-3 sm:py-6">
      {/* Top Bar with Filter & Upload Button */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h1 className="text-xl font-bold font-brand text-amber-100">
            {t.reels.title}
          </h1>
          <p className="text-xs text-stone-400">
            Vidéos inspirantes de notre communauté
          </p>
        </div>

        <button
          onClick={onOpenCreateReel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{t.reels.createReel}</span>
        </button>
      </div>

      {shareToast && (
        <div className="mb-2 py-2 px-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs text-amber-200 text-center animate-fade-in">
          {shareToast}
        </div>
      )}

      {/* Main Vertical Video Container */}
      <div className="relative aspect-[9/16] w-full bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
        {/* Reel Background Video Visual */}
        <img
          src={currentReel.videoThumbnail}
          alt={currentReel.caption}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* Video Scrim Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

        {/* Play/Pause Center Tap Area */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-stone-950/60 backdrop-blur-md flex items-center justify-center text-amber-300">
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </div>
        </button>

        {/* Top Controls: Sound toggle & Category */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <span className="text-[11px] bg-stone-900/80 backdrop-blur-md text-amber-300 font-semibold px-2.5 py-1 rounded-full border border-stone-800">
            {currentReel.category === 'advice' ? '💡 Conseils Matrimoniaux' : currentReel.category === 'wedding' ? '💍 Cérémonie & Dot' : '❤️ Témoignage Foyer'}
          </span>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 flex items-center justify-center hover:text-amber-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Vertical Action Bar */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20">
          {/* Like Button */}
          <button
            onClick={() => handleToggleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-125 ${
              likesState[currentReel.id]?.liked
                ? 'bg-rose-600 text-white'
                : 'bg-stone-900/70 text-stone-200 group-hover:text-rose-400'
            }`}>
              <Heart className={`w-5 h-5 ${likesState[currentReel.id]?.liked ? 'fill-white stroke-none' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold font-mono">
              {likesState[currentReel.id]?.count ?? currentReel.likesCount}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className="w-11 h-11 rounded-full bg-stone-900/70 backdrop-blur-md text-stone-200 flex items-center justify-center group-hover:text-amber-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold font-mono">
              {(commentsList[currentReel.id]?.length ?? 0) + currentReel.commentsCount}
            </span>
          </button>

          {/* Save / Bookmark Button */}
          <button
            onClick={() => handleToggleSave(currentReel.id)}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              savedState[currentReel.id]
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-900/70 text-stone-200 group-hover:text-amber-400'
            }`}>
              <Bookmark className={`w-5 h-5 ${savedState[currentReel.id] ? 'fill-stone-950' : ''}`} />
            </div>
            <span className="text-[10px] font-medium">Sauvegarder</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className="w-11 h-11 rounded-full bg-stone-900/70 backdrop-blur-md text-stone-200 flex items-center justify-center group-hover:text-emerald-400 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Partager</span>
          </button>
        </div>

        {/* Bottom Author & Info Details */}
        <div className="absolute bottom-4 left-4 right-16 z-20 text-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={currentReel.creator.avatar}
              alt={currentReel.creator.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-amber-400"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-amber-200 truncate">
                  {currentReel.creator.name}
                </span>
                {currentReel.creator.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <span className="text-[10px] text-stone-300">
                {currentReel.creator.role === 'professional' ? 'Prestataire Agréé' : 'Membre certifié'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed mb-2 font-normal">
            {currentReel.caption}
          </p>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 text-[11px] text-amber-300 font-medium mb-2">
            {currentReel.hashtags.map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>

          {/* Audio Title */}
          <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
            <Music className="w-3 h-3 text-amber-400 animate-spin" />
            <span className="truncate">{currentReel.audioTitle}</span>
          </div>
        </div>

        {/* Video Stepper Navigation (Previous / Next Reel) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30">
          {activeReelIndex > 0 && (
            <button
              onClick={() => setActiveReelIndex((prev) => prev - 1)}
              className="w-8 h-8 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center text-xs"
            >
              ↑
            </button>
          )}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-30">
          {activeReelIndex < reels.length - 1 && (
            <button
              onClick={() => setActiveReelIndex((prev) => prev + 1)}
              className="w-8 h-8 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center text-xs"
            >
              ↓
            </button>
          )}
        </div>
      </div>

      {/* Slide-Up Comments Drawer */}
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-stone-900 border-t border-stone-800 rounded-t-3xl p-4 max-h-[70vh] flex flex-col text-stone-100">
            <div className="w-10 h-1 bg-stone-700 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
              <h3 className="text-sm font-bold font-brand text-amber-100">
                Commentaires ({((commentsList[currentReel.id] || []).length) + currentReel.commentsCount})
              </h3>
              <button
                onClick={() => setIsCommentsOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {(commentsList[currentReel.id] || []).map((cmt, idx) => (
                <div key={idx} className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                  <span className="text-amber-400 font-semibold block text-[11px] mb-1">
                    Membre Alliance
                  </span>
                  <p className="text-stone-200">{cmt}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="pt-3 border-t border-stone-800 flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={t.reels.writeComment}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-xs rounded-xl"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
