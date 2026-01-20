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

> **Important** : Le Dockerfile utilise une approche simplifiée qui copie le build Angular pré-compilé.
> Vous devez builder l'application localement avant de construire l'image Docker.

### Étape 1 : Installer les dépendances et builder l'application

```bash
npm install
npm run build
```

### Étape 2 : Construire l'image Docker

```bash
docker compose build
# ou
docker build -t project-management-tool-front .
```

### Étape 3 : Lancer le conteneur

```bash
docker compose up -d
# ou
docker run -p 4200:80 project-management-tool-front
```

L'application sera accessible sur `http://localhost:4200`.

### Arrêter le conteneur

```bash
docker compose down
```

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

### 🌐 Déploiement sur Render (Cloud)

> **Note importante concernant le déploiement cloud**

L'application a été initialement déployée sur **[Render](https://render.com/)** en mode gratuit. Cependant, en raison du délai entre la soumission du projet et la correction, **le service gratuit Render a expiré** (les instances gratuites sont désactivées après une période d'inactivité).

**Situation actuelle :**

- ❌ Le déploiement Render n'est plus accessible
- ✅ L'application fonctionne parfaitement en local via Docker (voir section Docker ci-dessus)

**Si un déploiement cloud est nécessaire :**

Sur demande de l'examinateur, je peux recréer un compte Render et redéployer l'application pour démonstration. Le déploiement prend environ 5-10 minutes.

Pour toute demande, merci de me contacter.

---

## ⚠️ Notes techniques importantes

### Gestion des vulnérabilités npm (overrides)

Ce projet utilise la fonctionnalité **npm overrides** dans `package.json` pour forcer certaines versions de dépendances et résoudre des vulnérabilités de sécurité :

```json
"overrides": {
  "vite": "^6.3.6",
  "esbuild": "^0.25.0"
}
```

#### Pourquoi ces overrides ?

1. **Vite** : Les versions 6.0.0 à 6.2.5 contiennent des vulnérabilités de sécurité (bypass `server.fs.deny`, exécution de code via shell). La version 6.3.6+ corrige ces failles.

2. **esbuild** : La CVE-2024-23334 affecte les versions ≤0.24.2. La version 0.25.0+ corrige cette vulnérabilité.

#### Vulnérabilités résiduelles

Après application des overrides, quelques vulnérabilités résiduelles peuvent subsister dans `@angular/common` et `@angular-devkit/build-angular`. Celles-ci :

- Sont des **dépendances de développement** (non incluses en production)
- Seront corrigées dans les prochaines versions d'Angular
- N'affectent pas la sécurité de l'application en production

### Installation des dépendances

En cas de conflits de peer dependencies lors de l'installation, utilisez :

```bash
npm install --legacy-peer-deps
```

Cette option permet à npm d'ignorer les conflits de versions entre peer dependencies, nécessaire car certaines dépendances Angular ont des exigences de versions strictes.

### Sources et références

- [Angular Security Updates - GitHub](https://github.com/angular/angular-cli/issues)
- [Vite Security Advisories](https://github.com/vitejs/vite/security/advisories)
- [esbuild CVE-2024-23334](https://nvd.nist.gov/vuln/detail/CVE-2024-23334)
- [npm overrides documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides)
- [jest-preset-angular releases](https://github.com/thymikee/jest-preset-angular/releases)

---

**📧 Contact** : Pour toute question, n'hésitez pas à me contacter.
