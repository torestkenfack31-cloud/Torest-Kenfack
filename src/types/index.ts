export type Language = 'fr' | 'en';

export type UserRole = 'user' | 'premium' | 'professional' | 'moderator' | 'admin';

export type VerificationLevel = 1 | 2 | 3 | 4;

export interface LifeProject {
  goal: 'serious_marriage' | 'long_term' | 'explore_matrimonial';
  marriageTimeline: 'under_1_year' | '1_to_2_years' | '2_to_3_years' | 'open';
  childrenDesire: 'wants_children' | 'already_has_wants_more' | 'already_has_enough' | 'undecided';
  relocationWillingness: 'stay_in_city' | 'same_country' | 'international_diaspora' | 'flexible';
  familyPriority: number; // 1-5
  financialStabilityPriority: number; // 1-5
  spiritualValues: string;
  lifestyleInterests: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  birthDate: string; // YYYY-MM-DD
  gender: 'female' | 'male';
  city: string;
  country: string;
  avatar: string;
  secondaryPhotos: string[];
  profession: string;
  education: string;
  maritalStatus: 'single' | 'divorced' | 'widowed';
  hasChildren: boolean;
  childrenCount?: number;
  languages: string[];
  bio: string;
  lifeProject: LifeProject;
  verificationLevel: VerificationLevel;
  isVerified: boolean;
  role: UserRole;
  isOnline: boolean;
  lastActive: string;
  compatibilityScore?: number; // 0-100 calculated
  verifiedDetails?: {
    emailVerified: boolean;
    phoneVerified: boolean;
    selfieVerified: boolean;
    idDocumentVerified: boolean;
  };
}

export interface MatchItem {
  id: string;
  user: UserProfile;
  matchedAt: string;
  compatibilityScore: number;
  lastMessageSnippet?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  audioUrl?: string;
  audioDuration?: number;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
  reactions?: Record<string, string>; // emoji -> count
}

export interface ReelItem {
  id: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    role: UserRole;
  };
  videoThumbnail: string;
  caption: string;
  hashtags: string[];
  category: 'dating' | 'couple' | 'wedding' | 'advice' | 'pro';
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  status: 'published' | 'pending_moderation' | 'flagged';
}

export interface StoryItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  mediaUrl: string;
  caption: string;
  expiresInHours: number;
  isViewed: boolean;
}

export interface WeddingVendor {
  id: string;
  name: string;
  category: 'wedding_planner' | 'photographer' | 'caterer' | 'venue' | 'couture' | 'jewelry' | 'decor';
  city: string;
  country: string;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  startingPrice: string;
  description: string;
  phone: string;
  isVerifiedPro: boolean;
  tags: string[];
}

export interface BridalDesign {
  id: string;
  title: string;
  category: 'bride_traditional' | 'bride_white' | 'groom_tuxedo' | 'groom_traditional' | 'couple_duo';
  fabricType: string; // Toghu, Ndop, Soie, Satin duchesse, Dentelle perlée
  price: string;
  creationTime: string; // ex: '3 à 4 semaines'
  imageUrl: string;
  additionalImages?: string[];
  stylist: {
    id: string;
    name: string;
    brandName: string;
    city: string;
    country: string;
    avatar: string;
    phone: string;
    whatsapp: string;
    isVerifiedCouturier: boolean;
    rating: number;
    experienceYears: number;
  };
  description: string;
  likesCount: number;
  tags: string[];
  isCustomTailored: boolean;
  fittingsAvailable: boolean; // Essayage en atelier ou à domicile
}

export interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    city: string;
    isVerified: boolean;
    role: UserRole;
  };
  content: string;
  imageUrl?: string;
  category: 'advice' | 'testimony' | 'event' | 'discussion';
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  hasLiked?: boolean;
  isSponsored?: boolean;
}

export interface ModerationQueueItem {
  id: string;
  type: 'photo' | 'reel' | 'profile' | 'report';
  priority: 'urgent' | 'priority' | 'normal';
  targetUser: {
    name: string;
    avatar: string;
    id: string;
    city?: string;
    phone?: string;
  };
  reason: string;
  evidenceUrl?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  category?: 'scam_momo' | 'harassment' | 'fake_profile' | 'inappropriate_media' | 'id_verification';
}

export interface IDVerificationItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCity: string;
  docType: 'cni' | 'passport' | 'receipt' | 'residence_permit';
  docFrontUrl: string;
  docBackUrl?: string;
  selfieUrl: string;
  biometricMatchScore: number; // e.g. 96%
  is18PlusConfirmed: boolean;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SecurityChatAlert {
  id: string;
  senderName: string;
  senderAvatar: string;
  receiverName: string;
  messageSnippet: string;
  flaggedKeywords: string[];
  severity: 'critical' | 'high' | 'medium';
  timestamp: string;
  status: 'investigating' | 'banned' | 'cleared';
}
