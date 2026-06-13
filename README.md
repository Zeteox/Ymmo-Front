# Ymmo

> Ymmo est un site web d'agence immobilière permettant de voir les biens les plus tendances et de contacter l'agence pour les acheter.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Licence](https://img.shields.io/badge/licence-MIT-green)

---

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancer le projet](#lancer-le-projet)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Variables d'environnement](#variables-denvironnement)
- [Licence](#licence)

---

## Aperçu

**Ymmo** est une plateforme immobilière qui facilite la gestion des biens et le suivi des ventes, aussi bien pour les acheteurs que pour les agents.
 
**Audience cible :** acheteurs à la recherche d'un bien, et agents immobiliers gérant leur portefeuille.
 
**Fonctionnalités clés :**
- Affichage de tendances basées sur les biens les plus achetés
- Demande de contact pour un bien en particulier
- Authentification (login, register)
- Prédictions de ventes pour les agents
- Dashboard privé agent (gestion de biens, transactions, demandes)
- Gestion complète des biens (création, photos, statut)
- Gestion des transactions


---

## Stack technique

| Catégorie      | Technologie              |
|----------------|--------------------------|
| Framework      | Vite.js / React          |
| Style          | Tailwind CSS             |
| Langage        | TypeScript               |
| Base de données| PostgreSQL               |

---

## Prérequis

- Node.js >= 22
- npm
- Git

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/Zeteox/Ymmo-Front.git
cd Ymmo-Front

# Installer les dépendances
npm install
```

---

## Configuration

Copiez le fichier d'environnement d'exemple :

```bash
cp .env.example .env
```

Renseignez les variables nécessaires (voir [Variables d'environnement](#variables-denvironnement)).

---

## Lancer le projet

```bash
# Développement (avec hot reload)
npm run dev

# Build de production
npm run build

# Lancer la version de production localement
npm run start
```

Le site est accessible sur [http://localhost:5173](http://localhost:5173).

---

## Structure du projet

```
nom-du-site/
├── public/              # Fichiers statiques (images, fonts, favicon)
├── src/
│   ├── assets/          # Assets utilisé dan le site
│   ├── components/      # Composants réutilisables
│   ├── pages/           # Page React réutilisables
│   ├── services/        # Utilitaires API principalement
│   ├── types/           # Types TypeScript partagés
│   ├── app.tsx          # Routeur + composant se trouvant partout (navbar, footer)
│   ├── index.css        # Fichier css contenant les variables de style
│   └── main.tsx         # Main de l'app ou tout est appelé
├── .env.example         # Variables d'environnement (modèle)
├── .eslintrc.json       # Configuration ESLint
├── vite.config.js       # Configuration Vite.js
└── tsconfig.json        # Configuration TypeScript
```

---

## Scripts disponibles

| Commande           | Description                              |
|--------------------|------------------------------------------|
| `npm run dev`      | Lance le serveur de développement        |
| `npm run build`    | Compile le projet pour la production     |
| `npm run start`    | Lance le serveur de production           |
| `npm run lint`     | Analyse le code avec ESLint              |
| `npm run test`     | Lance les tests unitaires (Vitest/Jest)  |

---

## Variables d'environnement

| Variable                  | Description                          | Requis |
|---------------------------|--------------------------------------|:------:|
| `VITE_MAIN_API_URL`       | URL de l'api principale              | ✅     |
| `VITE_IA_API_URL`         | URL de l'api de prediction et trend  | ✅     |

> Ne committez jamais votre fichier `.env` — il est déjà dans `.gitignore`.

---

## Licence

Distribué sous licence **MIT**. Voir [`LICENSE`](LICENSE) pour plus d'informations.
