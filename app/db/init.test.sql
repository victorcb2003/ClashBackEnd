-- ============================================================
--  ClashBackEnd – Base de données de TEST
--  mysql -u root -p clash_test < init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS clash_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clash_test;

-- ─────────────────────────────────────────────
--  TABLES
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS User (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  prenom     VARCHAR(100),
  nom        VARCHAR(100),
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  img_url    VARCHAR(255) NULL,
  verified   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Joueurs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  User_id       INT UNIQUE NOT NULL,
  Equipe_id     INT NULL,
  Pending_Equipe INT DEFAULT NULL,
  FOREIGN KEY (User_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Selectionneurs (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  User_id INT UNIQUE NOT NULL,
  FOREIGN KEY (User_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Organisateurs (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  User_id INT UNIQUE NOT NULL,
  FOREIGN KEY (User_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Admin (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  User_id INT UNIQUE NOT NULL,
  FOREIGN KEY (User_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Equipes (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nom              VARCHAR(100) NOT NULL UNIQUE,
  Selectionneurs_id INT NOT NULL,
  img_url          VARCHAR(255) NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Selectionneurs_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Tournois (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nom             VARCHAR(100) NOT NULL,
  date_debut      DATE NOT NULL,
  date_fin        DATE NOT NULL,
  lieu            VARCHAR(100) NOT NULL,
  Organisateurs_id INT,
  lancer          BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Organisateurs_id) REFERENCES Organisateurs(User_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Participants (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  Equipe_id   INT NOT NULL,
  Tournois_id INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Tournois_id) REFERENCES Tournois(id) ON DELETE CASCADE,
  FOREIGN KEY (Equipe_id)   REFERENCES Equipes(id)  ON DELETE CASCADE,
  CONSTRAINT unique_equipe_tournoi UNIQUE (Equipe_id, Tournois_id)
);

CREATE TABLE IF NOT EXISTS Matchs (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  Organisateur_id INT,
  date_heure     DATETIME NOT NULL,
  lieu           VARCHAR(100) NOT NULL,
  score          VARCHAR(20) DEFAULT '0-0',
  tour           INT,
  Equipe1_id     INT DEFAULT NULL,
  Equipe2_id     INT DEFAULT NULL,
  prolongation   BOOLEAN DEFAULT FALSE,
  Tournois_id    INT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Equipe1_id)  REFERENCES Equipes(id)  ON DELETE CASCADE,
  FOREIGN KEY (Equipe2_id)  REFERENCES Equipes(id)  ON DELETE CASCADE,
  FOREIGN KEY (Tournois_id) REFERENCES Tournois(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Buts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  date_heure DATETIME,
  User_id    INT NOT NULL,
  Match_id   INT NOT NULL,
  Type_But   BOOLEAN NOT NULL,
  FOREIGN KEY (User_id)  REFERENCES User(id)   ON DELETE CASCADE,
  FOREIGN KEY (Match_id) REFERENCES Matchs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Messages (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  expediteur_id   INT NOT NULL,
  destinataire_id INT NOT NULL,
  message         TEXT NOT NULL,
  lu              BOOLEAN DEFAULT FALSE,
  date_envoi      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expediteur_id)   REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (destinataire_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Groupes (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  Owner_id INT NOT NULL,
  nom      VARCHAR(100) NOT NULL UNIQUE,
  FOREIGN KEY (Owner_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Groupes_Membres (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  Groupe_id INT,
  User_id   INT,
  FOREIGN KEY (Groupe_id) REFERENCES Groupes(id) ON DELETE CASCADE,
  FOREIGN KEY (User_id)   REFERENCES User(id)    ON DELETE CASCADE,
  CONSTRAINT uniquie UNIQUE (User_id, Groupe_id)
);

CREATE TABLE IF NOT EXISTS Groupes_Messages (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  expediteur_id INT NOT NULL,
  Groupe_id     INT NOT NULL,
  message       TEXT NOT NULL,
  date_envoi    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expediteur_id) REFERENCES User(id)    ON DELETE CASCADE,
  FOREIGN KEY (Groupe_id)     REFERENCES Groupes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Forms (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  prenom     VARCHAR(100) NOT NULL,
  nom        VARCHAR(100) NOT NULL,
  Utype      VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  DONNÉES DE TEST
--  password de tous les users = "password"
--  hash bcrypt(10) de "password" :
--  $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ============================================================

-- Users
-- Hash généré sur ta machine : node -e "require('bcrypt').hash('password',10).then(console.log)"
-- Remplace le hash ci-dessous par celui que tu as obtenu si différent
INSERT INTO User (id, prenom, nom, email, password, verified) VALUES
  (1, 'Admin',   'Test',    'admin@test.com',  '$2b$10$bW7izuX6vTs4zoHrlvcM6.kQSkHVI3oXBEe0njk03R3b2cGEqJFFO', TRUE),
  (2, 'Jean',    'Dupont',  'jean@test.com',   '$2b$10$bW7izuX6vTs4zoHrlvcM6.kQSkHVI3oXBEe0njk03R3b2cGEqJFFO', TRUE),
  (3, 'Marie',   'Martin',  'marie@test.com',  '$2b$10$bW7izuX6vTs4zoHrlvcM6.kQSkHVI3oXBEe0njk03R3b2cGEqJFFO', FALSE),
  (4, 'Paul',    'Selec',   'selec@test.com',  '$2b$10$bW7izuX6vTs4zoHrlvcM6.kQSkHVI3oXBEe0njk03R3b2cGEqJFFO', TRUE),
  (5, 'Lucie',   'Org',     'org@test.com',    '$2b$10$bW7izuX6vTs4zoHrlvcM6.kQSkHVI3oXBEe0njk03R3b2cGEqJFFO', TRUE);

-- Rôles
INSERT INTO Admin         (User_id) VALUES (1);
INSERT INTO Organisateurs (User_id) VALUES (5);
INSERT INTO Selectionneurs(User_id) VALUES (4);
INSERT INTO Joueurs (User_id, Equipe_id) VALUES (2, NULL), (3, NULL);

-- Equipes (Selectionneurs_id référence User.id directement)
INSERT INTO Equipes (id, nom, Selectionneurs_id) VALUES
  (1, 'Les Aigles', 4),
  (2, 'Les Lions',  4),
  (3, 'Les Tigres', 4);

-- Rattacher les joueurs à une équipe
UPDATE Joueurs SET Equipe_id = 1 WHERE User_id = 2;
UPDATE Joueurs SET Equipe_id = 2 WHERE User_id = 3;

-- Tournois (Organisateurs_id référence Organisateurs.User_id = 5)
INSERT INTO Tournois (id, nom, date_debut, date_fin, lieu, Organisateurs_id, lancer) VALUES
  (1, 'Tournoi Printemps', '2026-04-01', '2026-04-30', 'Paris',  5, TRUE),
  (2, 'Tournoi Été',       '2026-07-01', '2026-07-31', 'Lyon',   5, FALSE);

-- Participants (équipes dans le tournoi 1)
INSERT INTO Participants (Equipe_id, Tournois_id) VALUES (1, 1), (2, 1);

-- Matchs
INSERT INTO Matchs (id, Organisateur_id, date_heure, lieu, score, tour, Equipe1_id, Equipe2_id, Tournois_id) VALUES
  (1, 5, '2026-04-10 15:00:00', 'Paris', '2-1', 1, 1, 2, 1);

-- Buts (Type_But = TRUE = but normal, FALSE = csc)
INSERT INTO Buts (User_id, Match_id, Type_But, date_heure) VALUES
  (2, 1, TRUE,  '2026-04-10 15:23:00'),
  (2, 1, TRUE,  '2026-04-10 16:07:00'),
  (3, 1, FALSE, '2026-04-10 15:45:00');

-- Groupes
INSERT INTO Groupes (id, Owner_id, nom) VALUES (1, 1, 'Groupe Test');
INSERT INTO Groupes_Membres (Groupe_id, User_id) VALUES (1, 1), (1, 2);
INSERT INTO Groupes_Messages (expediteur_id, Groupe_id, message) VALUES (1, 1, 'Bienvenue dans le groupe !');

-- Forms
INSERT INTO Forms (prenom, nom, Utype, email) VALUES
  ('Test', 'Form', 'joueur', 'testform@test.com');