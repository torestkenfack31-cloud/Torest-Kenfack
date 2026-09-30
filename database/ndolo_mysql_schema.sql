-- =====================================================================
-- Base de Données MySQL pour Ndolo - L'Amour Vrai & Mariage (Laragon)
-- Encodage : UTF-8 Unicode (utf8mb4_unicode_ci)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `ndolo_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `ndolo_db`;

-- ---------------------------------------------------------------------
-- 1. Table des Utilisateurs & Authentification (RBAC)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `email` VARCHAR(191) UNIQUE,
  `phone` VARCHAR(32) UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'premium', 'professional', 'moderator', 'admin') DEFAULT 'user',
  `verification_level` TINYINT UNSIGNED DEFAULT 1 COMMENT '1=Email, 2=Tel, 3=Selfie18+, 4=CNI/Passeport',
  `is_verified` BOOLEAN DEFAULT FALSE,
  `is_banned` BOOLEAN DEFAULT FALSE,
  `is_online` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_active_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Profils Matrimoniaux Détaillés
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profiles` (
  `user_id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `gender` ENUM('female', 'male') NOT NULL,
  `birth_date` DATE NOT NULL,
  `age` TINYINT UNSIGNED NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) DEFAULT 'Cameroun',
  `avatar_url` VARCHAR(255),
  `profession` VARCHAR(150),
  `education` VARCHAR(150),
  `marital_status` ENUM('single', 'divorced', 'widowed') DEFAULT 'single',
  `has_children` BOOLEAN DEFAULT FALSE,
  `children_count` TINYINT UNSIGNED DEFAULT 0,
  `bio` TEXT,
  `languages` JSON,
  `secondary_photos` JSON,
  CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Projets de Vie & Critères Matrimoniaux (Synergie de Couple)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `life_projects` (
  `user_id` VARCHAR(64) PRIMARY KEY,
  `goal` ENUM('serious_marriage', 'long_term', 'explore_matrimonial') DEFAULT 'serious_marriage',
  `marriage_timeline` ENUM('under_1_year', '1_to_2_years', '2_to_3_years', 'open') DEFAULT '1_to_2_years',
  `children_desire` ENUM('wants_children', 'already_has_wants_more', 'already_has_enough', 'undecided') DEFAULT 'wants_children',
  `relocation_willingness` ENUM('stay_in_city', 'same_country', 'international_diaspora', 'flexible') DEFAULT 'flexible',
  `family_priority` TINYINT UNSIGNED DEFAULT 5,
  `financial_stability_priority` TINYINT UNSIGNED DEFAULT 5,
  `spiritual_values` VARCHAR(255),
  `lifestyle_interests` JSON,
  CONSTRAINT `fk_life_projects_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Matchs & Connexions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `matches` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_one_id` VARCHAR(64) NOT NULL,
  `user_two_id` VARCHAR(64) NOT NULL,
  `compatibility_score` TINYINT UNSIGNED DEFAULT 85,
  `is_celebrated` BOOLEAN DEFAULT FALSE,
  `matched_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_match_pair` (`user_one_id`, `user_two_id`),
  CONSTRAINT `fk_match_user_one` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_user_two` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Messagerie Instantanée & Appels Chiffrés
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` VARCHAR(64) PRIMARY KEY,
  `sender_id` VARCHAR(64) NOT NULL,
  `receiver_id` VARCHAR(64) NOT NULL,
  `message_text` TEXT NOT NULL,
  `is_flagged_scam` BOOLEAN DEFAULT FALSE,
  `read_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_messages_sender_receiver` (`sender_id`, `receiver_id`),
  CONSTRAINT `fk_chat_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Boutique du Mariage & Stylistes (Toghu, Ndop, Robes, Smokings)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bridal_designs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `stylist_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `category` ENUM('bride_traditional', 'bride_white', 'groom_tuxedo', 'groom_traditional', 'couple_duo') NOT NULL,
  `fabric_type` VARCHAR(100),
  `price_fcfa` INT UNSIGNED NOT NULL,
  `creation_time` VARCHAR(60),
  `image_url` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `likes_count` INT UNSIGNED DEFAULT 0,
  `is_custom_tailored` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_designs_stylist` FOREIGN KEY (`stylist_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Rendez-vous d'Essayage Nuptial & Commandes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bridal_appointments` (
  `id` VARCHAR(64) PRIMARY KEY,
  `client_id` VARCHAR(64) NOT NULL,
  `design_id` VARCHAR(64) NOT NULL,
  `appointment_date` DATE NOT NULL,
  `appointment_time` TIME NOT NULL,
  `location_type` ENUM('atelier', 'home') DEFAULT 'atelier',
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_apt_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_apt_design` FOREIGN KEY (`design_id`) REFERENCES `bridal_designs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Modération, CNI & Sécurité Anti-Brouteurs
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `moderation_reports` (
  `id` VARCHAR(64) PRIMARY KEY,
  `reporter_id` VARCHAR(64) NULL,
  `target_user_id` VARCHAR(64) NOT NULL,
  `priority` ENUM('urgent', 'priority', 'normal') DEFAULT 'normal',
  `category` ENUM('scam_momo', 'fake_profile', 'harassment', 'inappropriate_media', 'id_verification') NOT NULL,
  `reason` TEXT NOT NULL,
  `evidence_url` VARCHAR(255),
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `sanction_applied` VARCHAR(100) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mod_target` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Vérification des Pièces d'Identité CNI / Passeport (Niveau 4)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `id_verifications` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `document_type` ENUM('cni', 'passport', 'receipt', 'residence_permit') NOT NULL,
  `doc_front_url` VARCHAR(255) NOT NULL,
  `doc_back_url` VARCHAR(255),
  `selfie_biometric_url` VARCHAR(255) NOT NULL,
  `similarity_score` TINYINT UNSIGNED DEFAULT 95,
  `is_18_plus_confirmed` BOOLEAN DEFAULT TRUE,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `verified_by_user_id` VARCHAR(64) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_id_verif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- DONNÉES DE DÉPART (SEED DATA)
-- ---------------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `phone`, `password_hash`, `role`, `verification_level`, `is_verified`) VALUES
('usr_admin_1', 'admin@ndolo.cm', '+237699000001', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'admin', 4, TRUE),
('usr_mod_1', 'moderation@ndolo.cm', '+237699000002', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'moderator', 4, TRUE),
('usr_pro_1', 'atelier.royal@ndolo.cm', '+237675223344', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'professional', 4, TRUE),
('usr_user_1', 'brenda.nguemo@ndolo.cm', '+237699112233', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFvD8qG...', 'user', 3, TRUE);

INSERT INTO `profiles` (`user_id`, `name`, `gender`, `birth_date`, `age`, `city`, `profession`, `education`, `bio`) VALUES
('usr_user_1', 'Brenda Nguemo', 'female', '1998-03-12', 28, 'Yaoundé', 'Auditrice Financière & Consultante', 'ESSEC Douala - Master Audit', 'Femme pieuse et travailleuse, désireuse de bâtir un foyer solide fondé sur l’amour, le respect et la foi.'),
('usr_pro_1', 'Mireille Kengne (Atelier Royal Bamiléké)', 'female', '1988-06-15', 38, 'Douala & Yaoundé', 'Haute Couturière & Styliste Nuptiale', 'Diplôme International de Haute Couture', 'Créatrice spécialisée dans le Toghu brodé or, le Ndop et les parures royales de dot.');
