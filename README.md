# 🚀 Project Management Tool - Frontend

## 📋 Table des matières

1. [Prérequis](#-prérequis)
2. [Lancement rapide avec Docker](#-lancement-rapide-avec-docker)
3. [Lancement en local](#-lancement-en-local)
4. [Tests unitaires](#-tests-unitaires)
5. [Structure du projet](#-structure-du-projet)

---

## 🔧 Prérequis

### Pour lancer avec Docker (recommandé)
- **Docker Desktop** : [Télécharger ici](https://www.docker.com/products/docker-desktop)

### Pour lancer en local
- **Node.js 18+** : [Télécharger ici](https://nodejs.org/)
- **npm** (inclus avec Node.js)
- **Angular CLI** : `npm install -g @angular/cli`

---

## 🐳 Lancement rapide avec Docker

### Étape 1 : Construire l'image

```bash
docker build -t project-management-tool-front .
```

### Étape 2 : Lancer le conteneur

```bash
docker run -p 80:80 project-management-tool-front
```

L'application sera accessible sur `http://localhost:80`.

---

## 💻 Lancement en local

### Étape 1 : Installer les dépendances

```bash
npm install
```

### Étape 2 : Lancer le serveur de développement

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`.

---

## 🧪 Tests unitaires

Ce projet utilise **Jest** pour les tests unitaires.

### Lancer les tests

```bash
# Lancer les tests une seule fois
npm test

# Lancer les tests en mode "watch" (surveillance)
npm run test:watch

# Générer le rapport de couverture
npm run test:coverage
```

### Couverture de code

Le rapport de couverture est généré dans le dossier `coverage/`.
Ouvrez `coverage/lcov-report/index.html` dans votre navigateur pour voir les détails.

---

## 📁 Structure du projet

```
project-management-tool-front/
├── src/
│   ├── app/
│   │   ├── core/           # Services singleton, guards, intercepteurs
│   │   ├── layout/         # Composants structurels (Header, Sidebar)
│   │   ├── pages/          # Pages de l'application (routage)
│   │   └── shared/         # Composants réutilisables, pipes, directives
│   ├── assets/             # Images, polices, fichiers statiques
│   └── environments/       # Configuration par environnement
├── .github/                # Workflows CI/CD
├── Dockerfile              # Configuration Docker
├── jest.config.js          # Configuration Jest
└── angular.json            # Configuration Angular
```

---

## 🚀 Déploiement

Le déploiement est automatisé via GitHub Actions.
À chaque push sur la branche `main` :
1. Les dépendances sont installées.
2. Les tests unitaires sont exécutés.
3. L'application est construite en mode production.
4. L'image Docker est créée et poussée sur Docker Hub.
