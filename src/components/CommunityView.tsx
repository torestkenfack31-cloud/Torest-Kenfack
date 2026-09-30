import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Sparkles, Plus, ShieldCheck, MapPin, Send, Check } from 'lucide-react';
import { CommunityPost, Language, UserRole } from '../types';
import { translations } from '../i18n/translations';

interface CommunityViewProps {
  posts: CommunityPost[];
  onOpenCreatePost: () => void;
  language: Language;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  onOpenCreatePost,
  language
}) => {
  const t = translations[language];
  const [postList, setPostList] = useState<CommunityPost[]>(posts);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [localComments, setLocalComments] = useState<Record<string, string[]>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/#post-${postId}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedPostId(postId);
        setTimeout(() => setCopiedPostId(null), 2500);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  const handleLike = (postId: string) => {
    setPostList((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.hasLiked;
          return {
            ...p,
            hasLiked: liked,
            likesCount: liked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setLocalComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput.trim()]
    }));

    setPostList((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    setCommentInput('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4">
      {/* Header & Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-brand text-amber-100">
            {t.community.title}
          </h1>
          <p className="text-xs text-stone-400">
            {t.community.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenCreatePost}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Partager</span>
        </button>
      </div>

      {/* Feed of Posts */}
      <div className="space-y-4">
        {postList.map((post) => (
          <div
            key={post.id}
            className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl text-stone-100 space-y-3"
          >
            {/* Author Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-100">
                      {post.author.name}
                    </span>
                    {post.author.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{post.author.city}</span>
                    </span>
                    <span>·</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>

              {post.isSponsored && (
                <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                  {t.community.sponsored}
                </span>
              )}
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
              {post.content}
            </p>

            {/* Optional Image */}
            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden aspect-[16/9] bg-stone-950 border border-stone-800">
                <img
                  src={post.imageUrl}
                  alt="Illustration"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.hasLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500' : ''}`} />
                  <span className="font-mono">{post.likesCount}</span>
                </button>

                <button
                  onClick={() =>
                    setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                  }
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-mono">{post.commentsCount}</span>
                </button>

                <button
                  onClick={() => handleShare(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    copiedPostId === post.id ? 'text-emerald-400 font-bold' : 'hover:text-blue-400'
                  }`}
                  title="Partager la publication"
                >
                  {copiedPostId === post.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span className="text-[11px]">Partager</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                {post.category === 'advice' ? 'Conseil d’aîné' : post.category === 'event' ? 'Événement' : 'Témoignage'}
              </span>
            </div>

            {/* Inline Comment Box */}
            {activeCommentPostId === post.id && (
              <div className="pt-2 space-y-2">
                {localComments[post.id] && localComments[post.id].length > 0 && (
                  <div className="space-y-1.5 pb-2">
                    {localComments[post.id].map((c, i) => (
                      <div key={i} className="p-2 bg-stone-950 rounded-lg text-xs text-stone-300 border border-stone-800">
                        {c}
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Écrire un commentaire bienveillant..."
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
