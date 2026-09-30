import { UserProfile, MatchItem, ReelItem, WeddingVendor, BridalDesign, CommunityPost, ModerationQueueItem } from '../types';

export const currentUserMock: UserProfile = {
  id: 'current_user_1',
  name: 'Samuel M.',
  age: 32,
  birthDate: '1994-05-18',
  gender: 'male',
  city: 'Douala',
  country: 'Cameroun',
  avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
  secondaryPhotos: [
    '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
  ],
  profession: 'Ingénieur Télécoms & Entrepreneur',
  education: 'Master Génie Électrique (Polytechnique Yaoundé)',
  maritalStatus: 'single',
  hasChildren: false,
  languages: ['Français', 'English', 'Bamiléké'],
  bio: 'Homme de foi, passionné par le développement économique de notre pays. Je cherche une compagne vertueuse, ambitieuse et orientée vers la fondation d’un foyer harmonieux.',
  lifeProject: {
    goal: 'serious_marriage',
    marriageTimeline: '1_to_2_years',
    childrenDesire: 'wants_children',
    relocationWillingness: 'stay_in_city',
    familyPriority: 5,
    financialStabilityPriority: 5,
    spiritualValues: 'Foi chrétienne engagée, respect des valeurs familiales',
    lifestyleInterests: ['Entrepreneuriat', 'Lecture', 'Voyages en Afrique', 'Cuisine locale', 'Bénévolat']
  },
  verificationLevel: 3,
  isVerified: true,
  role: 'user',
  isOnline: true,
  lastActive: 'À l’instant',
  verifiedDetails: {
    emailVerified: true,
    phoneVerified: true,
    selfieVerified: true,
    idDocumentVerified: false
  }
};

export const sampleCandidates: UserProfile[] = [
  {
    id: 'user_cand_1',
    name: 'Brenda Nguemo',
    age: 28,
    birthDate: '1998-03-12',
    gender: 'female',
    city: 'Yaoundé',
    country: 'Cameroun',
    avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
    secondaryPhotos: [
      '/src/assets/images/couple_wedding_hero_1790589910589.jpg'
    ],
    profession: 'Auditrice Financière & Consultante',
    education: 'ESSEC Douala - Master Audit & Contrôle',
    maritalStatus: 'single',
    hasChildren: false,
    languages: ['Français', 'English'],
    bio: 'Souriante, dévouée et passionnée par la vie. Je crois profondément que le mariage est une alliance sacrée construite sur la complicité, le soutien mutuel et la bienveillance.',
    lifeProject: {
      goal: 'serious_marriage',
      marriageTimeline: '1_to_2_years',
      childrenDesire: 'wants_children',
      relocationWillingness: 'same_country',
      familyPriority: 5,
      financialStabilityPriority: 5,
      spiritualValues: 'Foi chrétienne, prière commune et générosité',
      lifestyleInterests: ['Économie', 'Chant choral', 'Pâtisserie', 'Randonnée au Mont Fébé', 'Projets associatifs']
    },
    verificationLevel: 4,
    isVerified: true,
    role: 'premium',
    isOnline: true,
    lastActive: 'En ligne',
    compatibilityScore: 94,
    verifiedDetails: {
      emailVerified: true,
      phoneVerified: true,
      selfieVerified: true,
      idDocumentVerified: true
    }
  },
  {
    id: 'user_cand_2',
    name: 'Vanessa Ebanda',
    age: 29,
    birthDate: '1997-08-24',
    gender: 'female',
    city: 'Douala (Bonanjo)',
    country: 'Cameroun',
    avatar: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
    secondaryPhotos: [
      '/src/assets/images/profile_woman_yaounde_1790589925857.jpg'
    ],
    profession: 'Architecte d’intérieur & Designer',
    education: 'Diplôme d’État d’Architecture',
    maritalStatus: 'single',
    hasChildren: false,
    languages: ['Français', 'English', 'Duala'],
    bio: 'Créative et attachée aux racines. J’apprécie les discussions profondes, la musique live et l’honnêteté sans détour. Je cherche mon futur complice de vie.',
    lifeProject: {
      goal: 'serious_marriage',
      marriageTimeline: 'under_1_year',
      childrenDesire: 'wants_children',
      relocationWillingness: 'stay_in_city',
      familyPriority: 4,
      financialStabilityPriority: 4,
      spiritualValues: 'Spiritualité ouverte, respect des aînés et traditions bienveillantes',
      lifestyleInterests: ['Design d’intérieur', 'Art contemporain africain', 'Gastronomie', 'Jazz', 'Sports de plage']
    },
    verificationLevel: 3,
    isVerified: true,
    role: 'user',
    isOnline: true,
    lastActive: 'Il y a 10 min',
    compatibilityScore: 88,
    verifiedDetails: {
      emailVerified: true,
      phoneVerified: true,
      selfieVerified: true,
      idDocumentVerified: false
    }
  },
  {
    id: 'user_cand_3',
    name: 'Carole Mbarga',
    age: 31,
    birthDate: '1995-11-04',
    gender: 'female',
    city: 'Paris & Diaspora',
    country: 'France / Cameroun',
    avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
    secondaryPhotos: [
      '/src/assets/images/wedding_rings_planning_1790589966684.jpg'
    ],
    profession: 'Médecin Généraliste',
    education: 'Faculté de Médecine Paris Cité',
    maritalStatus: 'single',
    hasChildren: false,
    languages: ['Français', 'English', 'Ewondo'],
    bio: 'Médecin dans la diaspora, le cœur toujours tourné vers mes racines. Prête à bâtir un pont entre l’Occident et l’Afrique avec un homme stable, responsable et généreux.',
    lifeProject: {
      goal: 'serious_marriage',
      marriageTimeline: '1_to_2_years',
      childrenDesire: 'wants_children',
      relocationWillingness: 'international_diaspora',
      familyPriority: 5,
      financialStabilityPriority: 5,
      spiritualValues: 'Foi active, intégrité et charité',
      lifestyleInterests: ['Santé publique', 'Littérature afro-contemporaine', 'Piano', 'Voyages culturels', 'Jardinage']
    },
    verificationLevel: 4,
    isVerified: true,
    role: 'premium',
    isOnline: false,
    lastActive: 'Il y a 2h',
    compatibilityScore: 91,
    verifiedDetails: {
      emailVerified: true,
      phoneVerified: true,
      selfieVerified: true,
      idDocumentVerified: true
    }
  },
  {
    id: 'user_cand_4',
    name: 'Esther Fotso',
    age: 27,
    birthDate: '1999-01-19',
    gender: 'female',
    city: 'Bafoussam / Douala',
    country: 'Cameroun',
    avatar: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
    secondaryPhotos: [
      '/src/assets/images/profile_man_douala_1790589937179.jpg'
    ],
    profession: 'Pharmacienne d’Officine',
    education: 'Doctorat en Pharmacie (UDS)',
    maritalStatus: 'single',
    hasChildren: false,
    languages: ['Français', 'English'],
    bio: 'Douceur, intelligence émotionnelle et loyauté sont mes boussoles. Je souhaite construire un cocon familial paisible et protecteur.',
    lifeProject: {
      goal: 'serious_marriage',
      marriageTimeline: 'under_1_year',
      childrenDesire: 'wants_children',
      relocationWillingness: 'same_country',
      familyPriority: 5,
      financialStabilityPriority: 4,
      spiritualValues: 'Fervente chrétienne, respect et entraide familiale',
      lifestyleInterests: ['Nutrition', 'Lecture biblique', 'Décoration florale', 'Tennis', 'Cuisine saine']
    },
    verificationLevel: 2,
    isVerified: true,
    role: 'user',
    isOnline: true,
    lastActive: 'En ligne',
    compatibilityScore: 89,
    verifiedDetails: {
      emailVerified: true,
      phoneVerified: true,
      selfieVerified: false,
      idDocumentVerified: false
    }
  }
];

export const sampleMatches: MatchItem[] = [
  {
    id: 'match_1',
    user: sampleCandidates[0], // Brenda Nguemo
    matchedAt: 'Aujourd’hui à 11:20',
    compatibilityScore: 94,
    lastMessageSnippet: 'Bonjour Samuel ! J’ai beaucoup apprécié votre vision du projet familial...',
    unreadCount: 1
  },
  {
    id: 'match_2',
    user: sampleCandidates[1], // Vanessa Ebanda
    matchedAt: 'Hier à 19:45',
    compatibilityScore: 88,
    lastMessageSnippet: 'Merci pour votre note audio. Je serais ravie de faire connaissance avec respect.',
    unreadCount: 0
  }
];

export const sampleReels: ReelItem[] = [
  {
    id: 'reel_1',
    creator: {
      id: 'creator_1',
      name: 'Pasteur & Épouse Kamga',
      avatar: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
      isVerified: true,
      role: 'professional'
    },
    videoThumbnail: '/src/assets/images/reel_wedding_decor_1790589955131.jpg',
    caption: 'Les 3 piliers inaltérables d’un mariage solide en Afrique moderne : communication transparente, respect mutuel et sanctification du foyer.',
    hashtags: ['#MariageChretien', '#AllianceDurable', '#ConseilsCouple', '#Cameroun'],
    category: 'advice',
    audioTitle: 'Sagesse Matrimoniale · Voix Originale',
    likesCount: 1420,
    commentsCount: 88,
    sharesCount: 312,
    hasLiked: false,
    hasSaved: false,
    status: 'published'
  },
  {
    id: 'reel_2',
    creator: {
      id: 'creator_2',
      name: 'Prestige Nuptial Yaoundé',
      avatar: '/src/assets/images/wedding_rings_planning_1790589966684.jpg',
      isVerified: true,
      role: 'professional'
    },
    videoThumbnail: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
    caption: 'Immersion dans les préparatifs de la cérémonie traditionnelle (La Dot) : honneur aux familles et bénédictions ancestrales.',
    hashtags: ['#MariageTraditionnel', '#CamerounCulture', '#LaDot', '#AmourAfricain'],
    category: 'wedding',
    audioTitle: 'Rythmes Nuptiaux d’Afrique Centrale',
    likesCount: 2890,
    commentsCount: 144,
    sharesCount: 650,
    hasLiked: true,
    hasSaved: true,
    status: 'published'
  },
  {
    id: 'reel_3',
    creator: {
      id: 'creator_3',
      name: 'Marc & Danielle Kouam',
      avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      isVerified: true,
      role: 'user'
    },
    videoThumbnail: '/src/assets/images/reel_wedding_decor_1790589955131.jpg',
    caption: 'Témoignage : Rencontrés il y a 2 ans sur la plateforme, aujourd’hui parents comblés et mariés devant Dieu et les hommes.',
    hashtags: ['#TemoignageAlliance', '#IlsSeSontAimes', '#FoyerHeureux'],
    category: 'couple',
    audioTitle: 'Chant de Gratitude · Instrumentale Douce',
    likesCount: 4510,
    commentsCount: 230,
    sharesCount: 920,
    hasLiked: false,
    hasSaved: false,
    status: 'published'
  }
];

export const sampleVendors: WeddingVendor[] = [
  {
    id: 'vendor_1',
    name: 'Prestige Events & Weddings',
    category: 'wedding_planner',
    city: 'Yaoundé & Douala',
    country: 'Cameroun',
    rating: 4.9,
    reviewsCount: 48,
    coverImage: '/src/assets/images/wedding_rings_planning_1790589966684.jpg',
    startingPrice: '750 000 FCFA',
    description: 'Organisation haut de gamme de mariages civils, traditionnels et religieux. Coordination complète, scénographie et protocole sans faille.',
    phone: '+237 699 88 77 66',
    isVerifiedPro: true,
    tags: ['Coordination clé en main', 'Mariage coutumier', 'Protocole VIP']
  },
  {
    id: 'vendor_2',
    name: 'Golden Memories Studios',
    category: 'photographer',
    city: 'Douala (Akwa)',
    country: 'Cameroun',
    rating: 5.0,
    reviewsCount: 62,
    coverImage: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
    startingPrice: '450 000 FCFA',
    description: 'Immortalisez les émotions les plus pures avec notre équipe de photographes et cadreurs cinéma. Albums de prestige et films en 4K.',
    phone: '+237 677 12 34 56',
    isVerifiedPro: true,
    tags: ['Cinéma 4K', 'Livre d’or Luxe', 'Shooting fiançailles']
  },
  {
    id: 'vendor_3',
    name: 'Le Palais des Orchidées',
    category: 'venue',
    city: 'Yaoundé (Bastos)',
    country: 'Cameroun',
    rating: 4.8,
    reviewsCount: 39,
    coverImage: '/src/assets/images/reel_wedding_decor_1790589955131.jpg',
    startingPrice: '1 200 000 FCFA',
    description: 'Espace féerique climatisé pouvant accueillir jusqu’à 600 convives. Jardins paysagers pour photos d’honneur et parking sécurisé.',
    phone: '+237 690 44 55 66',
    isVerifiedPro: true,
    tags: ['Climatisation', 'Capacité 600 pers.', 'Groupe électrogène industriel']
  },
  {
    id: 'vendor_4',
    name: 'Maison Royale Joaillerie',
    category: 'jewelry',
    city: 'Douala & Paris',
    country: 'Cameroun / France',
    rating: 4.9,
    reviewsCount: 53,
    coverImage: '/src/assets/images/wedding_rings_planning_1790589966684.jpg',
    startingPrice: '300 000 FCFA',
    description: 'Alliances en or 18 carats et platine certifiées. Gravure personnalisée des prénoms et versets pour sceller votre union éternelle.',
    phone: '+237 695 00 11 22',
    isVerifiedPro: true,
    tags: ['Or 18K', 'Diamants certifiés', 'Gravure offerte']
  }
];

export const sampleBridalDesigns: BridalDesign[] = [
  {
    id: 'design_1',
    title: 'Robe de Mariage Royal Toghu & Soie Sauvage',
    category: 'bride_traditional',
    fabricType: 'Toghu Royal brodé main & Soie sauvage dorée',
    price: '380 000 FCFA',
    creationTime: '3 à 4 semaines',
    imageUrl: '/src/assets/images/reel_traditional_attire_1790589945041.jpg',
    stylist: {
      id: 'stylist_1',
      name: 'Mireille Kengne',
      brandName: 'Atelier Royal Bamiléké & Grassfields Haute Couture',
      city: 'Bafoussam & Yaoundé',
      country: 'Cameroun',
      avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      phone: '+237 675 22 33 44',
      whatsapp: '+237675223344',
      isVerifiedCouturier: true,
      rating: 4.9,
      experienceYears: 12
    },
    description: 'Une création magistrale alliant la puissance ancestrale du tissu Toghu orné de fils d’or et la grâce d’une traîne en organza. Parfait pour la cérémonie coutumière et la bénédiction nuptiale.',
    likesCount: 142,
    tags: ['Coutume Grassfields', 'Brodé main', 'Sur-mesure', 'Pièce Unique'],
    isCustomTailored: true,
    fittingsAvailable: true
  },
  {
    id: 'design_2',
    title: 'Duo Royal Nuptial en Ndop Authentique & Velours de Coton',
    category: 'couple_duo',
    fabricType: 'Ndop Bamiléké teint à l’indigo & Velours noir royal',
    price: '650 000 FCFA (Ensemble Couple)',
    creationTime: '4 semaines',
    imageUrl: '/src/assets/images/couple_wedding_hero_1790589910589.jpg',
    stylist: {
      id: 'stylist_2',
      name: 'Armand Ngassa',
      brandName: 'Ngassa Prestige Couture',
      city: 'Douala (Bonapriso)',
      country: 'Cameroun',
      avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      phone: '+237 699 11 88 55',
      whatsapp: '+237699118855',
      isVerifiedCouturier: true,
      rating: 5.0,
      experienceYears: 15
    },
    description: 'Parure complète assortie pour les futurs époux. Robe sirène cintrée pour la mariée et tunique d’apparat magistrale pour le marié avec toque royale assortie.',
    likesCount: 215,
    tags: ['Duo Couple', 'Ndop Sacré', 'Fiancailles & Dot', 'Haute Couture'],
    isCustomTailored: true,
    fittingsAvailable: true
  },
  {
    id: 'design_3',
    title: 'Robe Princesse Blanche « Reine de la Sanaga »',
    category: 'bride_white',
    fabricType: 'Satin Duchesse, Tulle Français & Cristaux Swarovski',
    price: '480 000 FCFA',
    creationTime: '2 à 3 semaines',
    imageUrl: '/src/assets/images/reel_wedding_decor_1790589955131.jpg',
    stylist: {
      id: 'stylist_3',
      name: 'Clarisse Biya',
      brandName: 'Maison Blanche Bridal Douala',
      city: 'Douala (Akwa)',
      country: 'Cameroun',
      avatar: '/src/assets/images/wedding_rings_planning_1790589966684.jpg',
      phone: '+237 690 33 44 55',
      whatsapp: '+237690334455',
      isVerifiedCouturier: true,
      rating: 4.8,
      experienceYears: 9
    },
    description: 'Robe blanche féerique avec corset perlé à la main, dos nu élégant et longue traîne cathédrale de 3 mètres. Inclut le voile bordé de dentelle.',
    likesCount: 98,
    tags: ['Mariage Religieux', 'Traîne Cathédrale', 'Corset Ajustable'],
    isCustomTailored: true,
    fittingsAvailable: true
  },
  {
    id: 'design_4',
    title: 'Smoking de Cérémonie 3 Pièces Vert Émeraude & Satin Noir',
    category: 'groom_tuxedo',
    fabricType: 'Laine d’Italie Super 150s & Revers Satin de Soie',
    price: '290 000 FCFA',
    creationTime: '2 semaines',
    imageUrl: '/src/assets/images/profile_man_douala_1790589937179.jpg',
    stylist: {
      id: 'stylist_4',
      name: 'Maître tailleur Jean-Paul Eboko',
      brandName: 'Eboko Sartorial Gentlemen',
      city: 'Yaoundé (Bastos)',
      country: 'Cameroun',
      avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      phone: '+237 677 88 99 00',
      whatsapp: '+237677889900',
      isVerifiedCouturier: true,
      rating: 4.9,
      experienceYears: 18
    },
    description: 'Coupe italienne cintrée sur-mesure. Veste un bouton à col châle, gilet croisé élégant et pantalon fuselé avec bande de smoking.',
    likesCount: 84,
    tags: ['Smoking Marié', 'Laine Italienne', 'Col Châle', 'Élégance Pure'],
    isCustomTailored: true,
    fittingsAvailable: true
  },
  {
    id: 'design_5',
    title: 'Kaba d’Apparat Moderne Sawa & Dentelle Dorée',
    category: 'bride_traditional',
    fabricType: 'Dentelle Guipure perlée et Soie du littoral',
    price: '240 000 FCFA',
    creationTime: '2 à 3 semaines',
    imageUrl: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
    stylist: {
      id: 'stylist_5',
      name: 'Béatrice Ewandé',
      brandName: 'Sawa Nuptiale Créations',
      city: 'Douala (Deïdo)',
      country: 'Cameroun',
      avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      phone: '+237 655 44 22 11',
      whatsapp: '+237655442211',
      isVerifiedCouturier: true,
      rating: 4.8,
      experienceYears: 14
    },
    description: 'Une réinterprétation somptueuse du Kaba royal pour la mariée d’honneur. Ampleur majestueuse, tombé fluide et broderies de perles fines.',
    likesCount: 112,
    tags: ['Tradition Sawa', 'Kaba Royal', 'Broderie Perles'],
    isCustomTailored: true,
    fittingsAvailable: true
  }
];

export const sampleCommunityPosts: CommunityPost[] = [
  {
    id: 'post_1',
    author: {
      id: 'author_1',
      name: 'Dr. Théophile Ndjock',
      avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      city: 'Douala',
      isVerified: true,
      role: 'premium'
    },
    content: 'Chers frères et sœurs, avant de penser à la fête du mariage, prenez le temps de tester votre compatibilité financière et vos visions éducatives. La fête dure une journée, le mariage dure toute une vie d’amour et d’efforts conjugués.',
    category: 'advice',
    likesCount: 342,
    commentsCount: 29,
    createdAt: 'Il y a 3 heures'
  },
  {
    id: 'post_2',
    author: {
      id: 'author_2',
      name: 'Prestige Events Yaoundé',
      avatar: '/src/assets/images/wedding_rings_planning_1790589966684.jpg',
      city: 'Yaoundé',
      isVerified: true,
      role: 'professional'
    },
    content: 'Découvrez notre Salon Matrimonial de l’Élégance ce samedi à l’Hôtel Mont Fébé ! Entrée gratuite pour les couples fiancés inscrits sur Alliance.',
    imageUrl: '/src/assets/images/reel_wedding_decor_1790589955131.jpg',
    category: 'event',
    likesCount: 189,
    commentsCount: 14,
    createdAt: 'Hier',
    isSponsored: true
  }
];

export const sampleModerationQueue: ModerationQueueItem[] = [
  {
    id: 'mod_1',
    type: 'report',
    priority: 'urgent',
    targetUser: {
      name: 'Profil suspect #8491',
      avatar: '/src/assets/images/profile_man_douala_1790589937179.jpg',
      id: 'suspicious_1'
    },
    reason: 'Suspicion de tentative d’arnaque financière (demande de transfert d’argent via messagerie instantanée)',
    timestamp: 'Il y a 12 min',
    status: 'pending'
  },
  {
    id: 'mod_2',
    type: 'photo',
    priority: 'priority',
    targetUser: {
      name: 'Candidat #293',
      avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      id: 'cand_293'
    },
    reason: 'Photo soumise nécessitant contrôle manuel : vérification de conformité faciale (visage partiel)',
    evidenceUrl: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
    timestamp: 'Il y a 45 min',
    status: 'pending'
  },
  {
    id: 'mod_3',
    type: 'profile',
    priority: 'normal',
    targetUser: {
      name: 'Carole Mbarga',
      avatar: '/src/assets/images/profile_woman_yaounde_1790589925857.jpg',
      id: 'user_cand_3'
    },
    reason: 'Demande de validation Niveau 4 (Passeport officiel soumis pour certification)',
    timestamp: 'Il y a 2h',
    status: 'pending'
  }
];

export const weddingChecklistItems = [
  { id: 'chk_1', text: 'Officialisation de la démarche auprès des deux familles (Première rencontre parentale)', done: true },
  { id: 'chk_2', text: 'Accord sur le budget prévisionnel global et répartition des contributions', done: true },
  { id: 'chk_3', text: 'Planification de la cérémonie traditionnelle (La Dot et bénédiction des aînés)', done: true },
  { id: 'chk_4', text: 'Constitution du dossier de mariage civil à la mairie (Actes de naissance & CNI)', done: false },
  { id: 'chk_5', text: 'Entretiens de préparation religieuse auprès du guide spirituel', done: false },
  { id: 'chk_6', text: 'Sélection et réservation de la salle de réception et du traiteur', done: false },
  { id: 'chk_7', text: 'Choix des tenues d’honneur (Tissu traditionnel de famille & Robe/Costume)', done: false },
  { id: 'chk_8', text: 'Achat et gravure des alliances en or 18 carats', done: false },
  { id: 'chk_9', text: 'Envoi des cartons d’invitation personnalisés aux convives', done: false }
];
