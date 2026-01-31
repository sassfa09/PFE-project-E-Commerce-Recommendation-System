-- 1. Create and Use Database
CREATE DATABASE IF NOT EXISTS `PFE-database`;
USE `PFE-database`;

-- 2. Table: categorie 
CREATE TABLE IF NOT EXISTS categorie (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    nom_categorie VARCHAR(100) NOT NULL,
    description TEXT
);

-- 3. Table: client 
CREATE TABLE IF NOT EXISTS client (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_pass VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    role ENUM('user', 'admin') DEFAULT 'user' 
);

-- 4. Table: product 
CREATE TABLE IF NOT EXISTS product (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    id_categorie INT,
    nom_produit VARCHAR(255) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_categorie FOREIGN KEY (id_categorie) 
        REFERENCES categorie(id_categorie) ON DELETE SET NULL
);

-- 5. Table: Product_Images
CREATE TABLE IF NOT EXISTS Product_Images (
    prod_img_ID INT AUTO_INCREMENT PRIMARY KEY,
    prod_ID INT,
    img_url VARCHAR(255) NOT NULL,
    CONSTRAINT fk_images_product FOREIGN KEY (prod_ID) 
        REFERENCES product(id_product) ON DELETE CASCADE
);

-- 6. Table: commande 
CREATE TABLE IF NOT EXISTS commande (
    id_commande INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'payee', 'expediee', 'livree', 'annulee') DEFAULT 'en_attente',
    montant_total DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_commande_client FOREIGN KEY (id_user) 
        REFERENCES client(id_user) ON DELETE CASCADE
);

-- 7. Table: Ligne_Commande
CREATE TABLE IF NOT EXISTS Ligne_Commande (
    id_ligne INT AUTO_INCREMENT PRIMARY KEY,
    id_produit INT,
    id_commande INT,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_ligne_product FOREIGN KEY (id_produit) 
        REFERENCES product(id_product) ON DELETE CASCADE,
    CONSTRAINT fk_ligne_commande FOREIGN KEY (id_commande) 
        REFERENCES commande(id_commande) ON DELETE CASCADE
);

-- 8. Table: paiement 
CREATE TABLE IF NOT EXISTS paiement (
    id_paiement INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT UNIQUE, -- علاقة 1,1
    type_paiement VARCHAR(50) NOT NULL, -- Card, PayPal, Cash
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50),
    CONSTRAINT fk_paiement_commande FOREIGN KEY (id_commande) 
        REFERENCES commande(id_commande) ON DELETE CASCADE
);

-- 9. Table: historique_de_consultation
CREATE TABLE IF NOT EXISTS historique_de_consultation (
    id_historique INT AUTO_INCREMENT PRIMARY KEY,
    id_produit INT,
    id_utilisateur INT,
    date_consultation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hist_product FOREIGN KEY (id_produit) 
        REFERENCES product(id_product) ON DELETE CASCADE,
    CONSTRAINT fk_hist_client FOREIGN KEY (id_utilisateur) 
        REFERENCES client(id_user) ON DELETE CASCADE
);

-- 10. Table: recommandation 
CREATE TABLE IF NOT EXISTS recommandation (
    id_recommandation INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    id_produit INT,
    type VARCHAR(50), '
    score DECIMAL(5, 2),    CONSTRAINT fk_rec_client FOREIGN KEY (id_utilisateur) 
        REFERENCES client(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_rec_product FOREIGN KEY (id_produit) 
        REFERENCES product(id_product) ON DELETE CASCADE
);