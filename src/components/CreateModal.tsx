import React, { useState, useRef } from 'react';
import { Film, MessageSquare, Megaphone, X, CheckCircle, AlertCircle, Upload, Image as ImageIcon, Camera, Trash2, Check } from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../i18n/translations';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (type: 'reel' | 'post' | 'ad', data: any) => void;
  language: Language;
  activeRole: UserRole;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  language,
  activeRole
}) => {
  const t = translations[language];
  const [selectedType, setSelectedType] = useState<'reel' | 'post' | 'ad'>('reel');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('advice');
  const [attachedImageUrl, setAttachedImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(language === 'fr' ? 'Veuillez choisir une image valide (JPG, PNG).' : 'Please choose a valid image.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate AI content & photo moderation pipeline (Section 13 & 14 of Cahier des Charges)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        selectedType === 'reel'
          ? "Contrôle automatique de conformité validé (IA Anti-nudité & Respect). Votre Reel est en ligne !"
          : selectedType === 'post'
          ? "Publication partagée avec succès dans le fil communautaire."
          : "Annonce sponsorisée enregistrée et soumise à la facturation publicitaire."
      );

      onPostCreated(selectedType, {
        caption,
        category,
        imageUrl: attachedImageUrl
      });

      setTimeout(() => {
        setSuccessMessage(null);
        setCaption('');
        setAttachedImageUrl(null);
        onClose();
      }, 1800);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-200 rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold font-brand text-amber-100 mb-1">
          Créer un contenu
        </h2>
        <p className="text-xs text-stone-400 mb-5">
          Sélectionnez le format que vous souhaitez partager avec l'écosystème Alliance.
        </p>

        {successMessage ? (
          <div className="py-8 text-center text-emerald-400 flex flex-col items-center gap-3">
            <CheckCircle className="w-10 h-10 animate-bounce" />
            <p className="text-xs font-semibold leading-relaxed max-w-sm">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('reel')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-colors ${
                  selectedType === 'reel'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <Film className="w-5 h-5" />
                <span>Reel Vidéo</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('post')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-colors ${
                  selectedType === 'post'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Publication</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('ad')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-colors ${
                  selectedType === 'ad'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <Megaphone className="w-5 h-5" />
                <span>Annonce Pro</span>
              </button>
            </div>

            {/* Media Upload Area for Reel & Post */}
            {selectedType === 'reel' ? (
              <div className="p-6 border-2 border-dashed border-stone-800 rounded-2xl bg-stone-950 text-center space-y-2">
                <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                <div>
                  <span className="text-stone-300 font-medium block">Glissez votre vidéo verticale (max 60 sec)</span>
                  <span className="text-[10px] text-stone-500">MP4 ou MOV · Résolution 1080x1920 recommandée</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-stone-300 font-semibold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-rose-400" />
                    <span>Ajouter une photo à la publication (Optionnel)</span>
                  </span>
                  {attachedImageUrl && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <Check className="w-3 h-3" /> Photo ajoutée
                    </span>
                  )}
                </label>

                <div className="bg-stone-950 border-2 border-dashed border-stone-800 hover:border-rose-500/60 rounded-2xl p-3 transition-colors">
                  {attachedImageUrl ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={attachedImageUrl}
                        alt="Aperçu upload"
                        className="w-20 h-20 rounded-xl object-cover border border-stone-700 shrink-0"
                      />
                      <div className="flex-1 space-y-1 text-left">
                        <span className="text-xs font-bold text-stone-200 block">Photo prête</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 bg-stone-850 hover:bg-stone-800 text-stone-300 text-[11px] rounded-lg border border-stone-700"
                          >
                            Changer
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttachedImageUrl(null)}
                            className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[11px] rounded-lg border border-rose-500/30 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="py-4 flex flex-col items-center justify-center text-center cursor-pointer group space-y-1.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-stone-900 group-hover:bg-rose-500/20 text-stone-400 group-hover:text-rose-300 flex items-center justify-center transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-stone-300 group-hover:text-white font-medium">
                        Cliquez pour ajouter une photo depuis votre appareil
                      </p>
                      <span className="text-[10px] text-stone-500">
                        Galerie smartphone ou ordinateur (JPG, PNG, WEBP)
                      </span>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {uploadError && (
                  <p className="text-[11px] text-rose-400">{uploadError}</p>
                )}
              </div>
            )}

            {/* Category selection */}
            <div>
              <label className="block text-stone-400 mb-1">Catégorie thématique</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="advice">Conseils & Sagesse matrimoniale</option>
                <option value="wedding">Préparatifs du mariage & La Dot</option>
                <option value="couple">Témoignage de couple & Foyer</option>
                <option value="event">Événement & Conférence</option>
                <option value="pro">Offre professionnelle agréée</option>
              </select>
            </div>

            {/* Caption & text */}
            <div>
              <label className="block text-stone-400 mb-1">
                {selectedType === 'reel' ? 'Légende & hashtags' : 'Texte de votre publication'}
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Partagez avec authenticité, respect et courtoisie..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* AI Moderation Disclaimer from Section 13 & 14 */}
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-[10px] text-stone-400 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.reels.moderationNotice}</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !caption.trim()}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                {isSubmitting ? 'Contrôle IA & Envoi...' : 'Diffuser'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
