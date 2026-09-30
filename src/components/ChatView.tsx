import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Mic, Square, Play, Pause, AlertTriangle, ShieldCheck, 
  Phone, Video, Search, Image as ImageIcon, Smile, MoreVertical, 
  UserCheck, AlertOctagon, CheckCheck
} from 'lucide-react';
import { MatchItem, ChatMessage, Language, UserProfile, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { Crown, Lock } from 'lucide-react';

interface ChatViewProps {
  matches: MatchItem[];
  currentUser: UserProfile;
  initialSelectedUserId?: string;
  onOpenSafety: () => void;
  onOpenPremium?: () => void;
  activeRole?: UserRole;
  language: Language;
}

export const ChatView: React.FC<ChatViewProps> = ({
  matches,
  currentUser,
  initialSelectedUserId,
  onOpenSafety,
  onOpenPremium,
  activeRole,
  language
}) => {
  const t = translations[language];
  const isPremium = activeRole === 'premium';

  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(() => {
    if (initialSelectedUserId) {
      return matches.find((m) => m.user.id === initialSelectedUserId) || matches[0] || null;
    }
    return matches[0] || null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'user_cand_1': [
      {
        id: 'msg_1',
        senderId: 'user_cand_1',
        text: 'Bonjour Samuel ! J’ai beaucoup apprécié votre vision du projet familial et vos valeurs. C’est rare de nos jours.',
        timestamp: '11:20',
        isRead: true
      },
      {
        id: 'msg_2',
        senderId: currentUser.id,
        text: 'Bonjour Brenda, je vous remercie pour ces mots bienveillants. Fonder un foyer solide avec une femme d’honneur est mon objectif le plus cher.',
        timestamp: '11:25',
        isRead: true
      },
      {
        id: 'msg_3',
        senderId: 'user_cand_1',
        audioUrl: 'sample_audio_voice_note.mp3',
        audioDuration: 24,
        timestamp: '11:28',
        isRead: true
      }
    ],
    'user_cand_2': [
      {
        id: 'msg_v1',
        senderId: 'user_cand_2',
        text: 'Bonjour Samuel ! Ravie de voir que nous habitons tous deux Douala. Comment se passe votre semaine ?',
        timestamp: 'Hier',
        isRead: true
      }
    ]
  });

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [callNotification, setCallNotification] = useState<string | null>(null);
  const [blockStatus, setBlockStatus] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedMatch, isTyping]);

  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecording]);

  const activeMessages = selectedMatch ? (messages[selectedMatch.user.id] || []) : [];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedMatch) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    const targetUserId = selectedMatch.user.id;

    setMessages((prev) => ({
      ...prev,
      [targetUserId]: [...(prev[targetUserId] || []), newMessage]
    }));

    setInputText('');

    // Simulate match reply with typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyText = targetUserId === 'user_cand_1'
          ? "Je partage entièrement cette approche. C'est essentiel d'échanger en profondeur sur nos attentes avant toute rencontre."
          : "Tout à fait d'accord ! C'est rassurant de rencontrer quelqu'un d'aussi clair sur ses projets.";

        const matchReply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: targetUserId,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        };

        setMessages((prev) => ({
          ...prev,
          [targetUserId]: [...(prev[targetUserId] || []), matchReply]
        }));
      }, 2200);
    }, 1000);
  };

  const handleSendVoiceNote = () => {
    if (!selectedMatch) return;
    setIsRecording(false);

    const newVoiceMessage: ChatMessage = {
      id: `voice_${Date.now()}`,
      senderId: currentUser.id,
      audioUrl: 'mock_audio.mp3',
      audioDuration: Math.max(recordingSeconds, 3),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    const targetUserId = selectedMatch.user.id;
    setMessages((prev) => ({
      ...prev,
      [targetUserId]: [...(prev[targetUserId] || []), newVoiceMessage]
    }));
  };

  const handleSimulateCall = (type: 'audio' | 'video') => {
    if (!selectedMatch) return;
    if (!isPremium) {
      if (onOpenPremium) {
        onOpenPremium();
      }
      setCallNotification(`👑 Les appels chiffrés in-app sans numéro privé font partie du Mode Premium VIP.`);
      setTimeout(() => setCallNotification(null), 4000);
      return;
    }
    setCallNotification(`🟢 Appel ${type === 'audio' ? 'vocal' : 'vidéo'} chiffré de bout en bout en cours avec ${selectedMatch.user.name} (Numéro masqué).`);
    setTimeout(() => setCallNotification(null), 5000);
  };

  const handleBlockUser = () => {
    if (!selectedMatch) return;
    const uid = selectedMatch.user.id;
    setBlockStatus((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl h-[78vh] flex flex-col md:flex-row">
        
        {/* Left Column: Matches & Active Conversations */}
        <div className={`w-full md:w-80 border-r border-stone-800 flex flex-col ${selectedMatch ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-stone-800">
            <h2 className="text-lg font-bold font-brand text-amber-100 mb-3">
              {t.chat.title}
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un contact..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-800/60">
            {matches.map((item) => {
              const isSelected = selectedMatch?.user.id === item.user.id;
              const isBlocked = blockStatus[item.user.id];
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedMatch(item)}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                    isSelected ? 'bg-amber-500/10 border-l-2 border-amber-400' : 'hover:bg-stone-800/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-amber-500/30"
                    />
                    {item.user.isOnline && !isBlocked && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-stone-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-stone-100 truncate">
                        {item.user.name}
                      </h4>
                      <span className="text-[10px] text-stone-400">
                        {item.matchedAt.split(' ')[0]}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400 truncate mt-0.5">
                      {isBlocked ? 'Utilisateur bloqué' : (item.lastMessageSnippet || 'Match récent')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        {selectedMatch ? (
          <div className="flex-1 flex flex-col bg-stone-950/60">
            {/* Conversation Header */}
            <div className="p-3.5 px-4 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="md:hidden text-xs text-amber-400 font-medium"
                >
                  ← Retour
                </button>

                <div className="relative">
                  <img
                    src={selectedMatch.user.avatar}
                    alt={selectedMatch.user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                  />
                  {selectedMatch.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-stone-950" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-amber-100">
                      {selectedMatch.user.name}
                    </h3>
                    {selectedMatch.user.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{selectedMatch.user.isOnline ? t.chat.online : t.chat.lastSeen}</span>
                  </span>
                </div>
              </div>

              {/* Call and Security Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulateCall('audio')}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                    isPremium 
                      ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300'
                  }`}
                  title={isPremium ? 'Appel vocal chiffré VIP (Actif)' : 'Appel vocal chiffré VIP (Débloquer avec Premium)'}
                >
                  <Phone className="w-4 h-4" />
                  {!isPremium && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                </button>
                <button
                  onClick={() => handleSimulateCall('video')}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                    isPremium 
                      ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300'
                  }`}
                  title={isPremium ? 'Appel vidéo chiffré VIP (Actif)' : 'Appel vidéo chiffré VIP (Débloquer avec Premium)'}
                >
                  <Video className="w-4 h-4" />
                  {!isPremium && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                </button>
                <button
                  onClick={handleBlockUser}
                  className={`p-2 rounded-lg transition-colors ${
                    blockStatus[selectedMatch.user.id]
                      ? 'bg-rose-950/80 text-rose-300'
                      : 'bg-stone-900 hover:bg-rose-950/40 text-stone-400 hover:text-rose-300'
                  }`}
                  title={blockStatus[selectedMatch.user.id] ? 'Débloquer' : 'Bloquer cet utilisateur'}
                >
                  <AlertOctagon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mandatory Anti-Scam Safety Alert Banner (Section 39 of Cahier des Charges) */}
            <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] leading-tight">
                  {t.chat.safetyAlert}
                </span>
              </div>
              <button
                onClick={onOpenSafety}
                className="underline text-[10px] text-amber-300 hover:text-amber-100 shrink-0 ml-2"
              >
                Conseils
              </button>
            </div>

            {/* Call feedback banner */}
            {callNotification && (
              <div className="bg-emerald-950/80 border-b border-emerald-800 px-4 py-2 text-xs text-emerald-300 text-center animate-pulse">
                {callNotification}
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {blockStatus[selectedMatch.user.id] ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Vous avez bloqué cette personne. Les messages sont désactivés.
                </div>
              ) : (
                <>
                  <div className="text-center my-2">
                    <span className="text-[10px] bg-stone-900 text-stone-400 px-2.5 py-1 rounded-full border border-stone-800">
                      Match réalisé le {selectedMatch.matchedAt} · Protocole chiffré de bout en bout
                    </span>
                  </div>

                  {activeMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs ${
                            isMe
                              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-br-none shadow-md font-medium'
                              : 'bg-stone-900 text-stone-100 rounded-bl-none border border-stone-800'
                          }`}
                        >
                          {/* Text Content */}
                          {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                          {/* Voice Note Simulation */}
                          {msg.audioUrl && (
                            <div className="flex items-center gap-3 py-1">
                              <button
                                onClick={() =>
                                  setIsPlayingAudio(isPlayingAudio === msg.id ? null : msg.id)
                                }
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isMe ? 'bg-stone-950 text-rose-300' : 'bg-rose-500 text-white'
                                }`}
                              >
                                {isPlayingAudio === msg.id ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4 ml-0.5" />
                                )}
                              </button>

                              {/* Sound Wave Bars */}
                              <div className="flex items-center gap-1 h-5">
                                {[40, 70, 30, 90, 60, 80, 45, 65, 30, 85].map((h, i) => (
                                  <span
                                    key={i}
                                    style={{ height: `${isPlayingAudio === msg.id ? (h % 20) + 10 : 6}px` }}
                                    className={`w-1 rounded-full transition-all duration-150 ${
                                      isMe ? 'bg-white/80' : 'bg-rose-400'
                                    }`}
                                  />
                                ))}
                              </div>

                              <span className="text-[10px] font-mono opacity-80">
                                0:{msg.audioDuration ? String(msg.audioDuration).padStart(2, '0') : '20'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Metadata row */}
                        <div className="flex items-center gap-1 mt-1 text-[9px] text-stone-400 px-1">
                          <span>{msg.timestamp}</span>
                          {isMe && (
                            <CheckCheck className="w-3 h-3 text-rose-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-amber-400/90 italic">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                      <span>{selectedMatch.user.name} {t.chat.typing}</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Bar */}
            {!blockStatus[selectedMatch.user.id] && (
              <div className="p-3 border-t border-stone-800 bg-stone-950">
                {isRecording ? (
                  <div className="flex items-center justify-between p-2 bg-rose-950/40 border border-rose-800 rounded-xl">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span>{t.chat.recording}</span>
                      <span className="font-mono text-sm">
                        0:{String(recordingSeconds).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRecording(false)}
                        className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSendVoiceNote}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                      >
                        Envoyer le vocal
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputText((prev) => prev + ' 💍')}
                      className="p-2 text-stone-400 hover:text-amber-400 transition-colors"
                      title="Ajouter un symbole"
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsRecording(true)}
                      className="p-2 text-stone-400 hover:text-amber-400 transition-colors"
                      title={t.chat.recordVoice}
                    >
                      <Mic className="w-5 h-5" />
                    </button>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={t.chat.placeholder}
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400">
            <h3 className="text-base font-semibold text-stone-200 mb-1">{t.chat.noMessages}</h3>
            <p className="text-xs max-w-sm">Découvrez des profils compatibles et engagez la conversation dès qu'il y a un match réciproque.</p>
          </div>
        )}
      </div>
    </div>
  );
};
