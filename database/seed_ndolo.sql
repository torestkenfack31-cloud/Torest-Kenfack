-- =====================================================================
-- Script d'insertion de données de test (Seed) pour la base "ndolo"
-- Compatible avec la structure Prisma (tables : user, profile, photo, etc.)
-- =====================================================================

USE `ndolo`;

-- Désactiver temporairement les vérifications de clés étrangères pour un import fluide
SET FOREIGN_KEY_CHECKS = 0;

-- Vider les tables pour repartir sur une base propre
TRUNCATE TABLE `auditlog`;
TRUNCATE TABLE `moderationitem`;
TRUNCATE TABLE `report`;
TRUNCATE TABLE `message`;
TRUNCATE TABLE `conversation`;
TRUNCATE TABLE `match`;
TRUNCATE TABLE `verification`;
TRUNCATE TABLE `photo`;
TRUNCATE TABLE `lifeanswer`;
TRUNCATE TABLE `profile`;
TRUNCATE TABLE `user`;

-- ---------------------------------------------------------------------
-- 1. UTILISATEURS (user)
-- ---------------------------------------------------------------------
INSERT INTO `user` (`id`, `email`, `phone`, `password`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('usr_admin_01', 'admin@ndolo.cm', '+237699000001', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'ADMIN', 'ACTIVE', NOW(), NOW()),
('usr_mod_01', 'moderation@ndolo.cm', '+237699000002', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'MODERATOR', 'ACTIVE', NOW(), NOW()),
('usr_brenda', 'brenda.nguemo@gmail.com', '+237699112233', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'USER', 'ACTIVE', NOW(), NOW()),
('usr_christian', 'christian.talla@yahoo.fr', '+237677445566', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'PREMIUM', 'ACTIVE', NOW(), NOW()),
('usr_samuel', 'samuel.m@ndolo.cm', '+237690112233', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'USER', 'ACTIVE', NOW(), NOW()),
('usr_couturier', 'atelier.bamileke@ndolo.cm', '+237675112233', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'PROFESSIONAL', 'ACTIVE', NOW(), NOW());

-- ---------------------------------------------------------------------
-- 2. PROFILS MATRIMONIAUX (profile)
-- ---------------------------------------------------------------------
INSERT INTO `profile` (`id`, `userId`, `name`, `gender`, `birthDate`, `age`, `city`, `country`, `profession`, `education`, `maritalStatus`, `bio`, `createdAt`, `updatedAt`) VALUES
('prof_brenda', 'usr_brenda', 'Brenda Nguemo', 'FEMALE', '1998-03-12', 28, 'Yaoundé', 'Cameroun', 'Auditrice Financière & Consultante', 'ESSEC Douala - Master Audit', 'SINGLE', 'Femme de foi et travailleuse. Je recherche une alliance sainte et durable pour fonder un foyer équilibré et respectueux des valeurs traditionnelles.', NOW(), NOW()),
('prof_christian', 'usr_christian', 'Christian Talla', 'MALE', '1992-07-25', 34, 'Douala (Bonapriso)', 'Cameroun', 'Architecte & Promoteur Immobilier', 'ENSTP & Master Urbanisme Paris', 'SINGLE', 'Passionné d’architecture et de culture africaine. Je prépare un mariage d’honneur dans les 1 à 2 ans avec une compagne sincère et visionnaire.', NOW(), NOW()),
('prof_samuel', 'usr_samuel', 'Samuel Mengue', 'MALE', '1994-05-18', 32, 'Douala', 'Cameroun', 'Ingénieur Télécoms & Entrepreneur', 'Polytechnique Yaoundé', 'SINGLE', 'Cœur sincère tourné vers le mariage. Homme pieux, travailleur et attaché à la famille.', NOW(), NOW()),
('prof_couturier', 'usr_couturier', 'Mireille Kengne (Atelier Toghu Royal)', 'FEMALE', '1986-09-14', 40, 'Bafoussam & Douala', 'Cameroun', 'Maître Couturière Nuptiale', 'Haute École Stylisme Paris', 'MARRIED', 'Créatrice de parures royales traditionnelles (Toghu, Ndop) et robes blanches pour mariages de prestige.', NOW(), NOW());

-- ---------------------------------------------------------------------
-- 3. PHOTOS DE PROFIL (photo)
-- ---------------------------------------------------------------------
INSERT INTO `photo` (`id`, `profileId`, `url`, `isMain`, `order`, `createdAt`) VALUES
('pho_brenda_1', 'prof_brenda', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 1, 1, NOW()),
('pho_christian_1', 'prof_christian', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 1, 1, NOW()),
('pho_samuel_1', 'prof_samuel', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 1, 1, NOW()),
('pho_couturier_1', 'prof_couturier', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 1, 1, NOW());

-- ---------------------------------------------------------------------
-- 4. RÉPONSES PROJET DE VIE (lifeanswer)
-- ---------------------------------------------------------------------
INSERT INTO `lifeanswer` (`id`, `profileId`, `marriageTimeline`, `childrenDesire`, `relocation`, `spiritualValues`, `familyPriority`, `createdAt`, `updatedAt`) VALUES
('la_brenda', 'prof_brenda', '1_to_2_years', 'wants_children', 'flexible', 'Chrétienne engagée, respect de la famille élargie', 5, NOW(), NOW()),
('la_christian', 'prof_christian', 'under_1_year', 'wants_children', 'stay_in_city', 'Foi catholique, amour de la tradition et des aînés', 5, NOW(), NOW()),
('la_samuel', 'prof_samuel', '1_to_2_years', 'wants_children', 'flexible', 'Plein respect des coutumes et foi solide', 5, NOW(), NOW());

-- ---------------------------------------------------------------------
-- 5. VÉRIFICATION D'IDENTITÉ & 18+ (verification)
-- ---------------------------------------------------------------------
INSERT INTO `verification` (`id`, `userId`, `type`, `status`, `idDocUrl`, `selfieUrl`, `score`, `is18Plus`, `createdAt`, `updatedAt`) VALUES
('verif_brenda', 'usr_brenda', 'CNI_CAMEROUN', 'APPROVED', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 98, 1, NOW(), NOW()),
('verif_christian', 'usr_christian', 'PASSPORT', 'APPROVED', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 95, 1, NOW(), NOW());

-- ---------------------------------------------------------------------
-- 6. MATCHS & CONVERSATIONS (match, conversation, message)
-- ---------------------------------------------------------------------
INSERT INTO `match` (`id`, `userOneId`, `userTwoId`, `score`, `createdAt`) VALUES
('match_01', 'usr_brenda', 'usr_christian', 94, NOW());

INSERT INTO `conversation` (`id`, `userOneId`, `userTwoId`, `createdAt`, `updatedAt`) VALUES
('conv_01', 'usr_brenda', 'usr_christian', NOW(), NOW());

INSERT INTO `message` (`id`, `conversationId`, `senderId`, `content`, `isRead`, `createdAt`) VALUES
('msg_01', 'conv_01', 'usr_christian', 'Bonsoir Brenda, j’ai beaucoup apprécié votre vision du projet de vie et votre attachement aux valeurs de famille.', 1, NOW()),
('msg_02', 'conv_01', 'usr_brenda', 'Bonsoir Christian, merci infiniment. Votre parcours et votre engagement pour le mariage m’ont également touchée.', 1, NOW());

-- ---------------------------------------------------------------------
-- 7. DOSSIERS DE MODÉRATION & AUDIT (moderationitem, auditlog)
-- ---------------------------------------------------------------------
INSERT INTO `moderationitem` (`id`, `targetUserId`, `priority`, `reason`, `status`, `createdAt`) VALUES
('mod_item_01', 'usr_samuel', 'NORMAL', 'Vérification standard du scan biométrique 18+', 'APPROVED', NOW());

INSERT INTO `auditlog` (`id`, `moderatorId`, `action`, `target`, `reason`, `createdAt`) VALUES
('log_01', 'usr_mod_01', 'VERIFY_CNI_LEVEL_4', 'Brenda Nguemo', 'Validation CNI Camerounaise et majorité 18+ confirmée (Score 98%)', NOW());

-- Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- Fin du script : données insérées avec succès !
-- =====================================================================
