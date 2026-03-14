# 🐿️ BudgetFlow — Ton pilote financier personnel

Application de gestion de budget personnel avec **Nutsy**, ta mascotte écureuil qui t'aide à mieux gérer ton argent.

## Fonctionnalités

- **Onboarding guidé** en 7 étapes par Nutsy
- **Tableau de bord** avec vue "waterfall" de tes finances
- **Revenus** : ajouter, modifier, supprimer (salaire, freelance, primes...)
- **Dépenses** : catégorisées avec détection d'abonnements
- **Épargne & Investissement** : choisis un montant fixe mensuel ou un % 
- **Loisirs** : affichage clair de ce qu'il te reste à dépenser librement
- **Objectifs financiers** : avec progression et estimation du temps restant
- **Profil modifiable** à tout moment (onglet ⚙️)
- **Simulation 12 mois** et conseils personnalisés
- **Persistance des données** entre les sessions

## Installation

```bash
# Cloner le projet
cd budgetflow-project

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour la production
npm run build
```

## Structure du projet

```
budgetflow-project/
├── index.html          # Page HTML d'entrée
├── package.json        # Dépendances et scripts
├── vite.config.js      # Configuration Vite
├── README.md           # Ce fichier
└── src/
    ├── main.jsx        # Point d'entrée React + polyfill storage
    └── App.jsx         # Application complète (composants, logique, styles)
```

## Déploiement

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Uploader le dossier dist/
```

### GitHub Pages
```bash
npm run build
# Configurer pour servir depuis dist/
```

## Technologies

- **React 18** — UI déclarative
- **Vite** — Build tool ultra-rapide
- **SVG inline** — Mascotte Nutsy vectorielle (pas d'images externes)
- **CSS-in-JS** — Styles embarqués, zéro dépendance CSS
- **localStorage** — Persistance côté client

## Personnalisation

### Modifier la mascotte
Les composants `Nutsy` et `NutsyBig` dans `App.jsx` sont des SVG inline que tu peux modifier directement.

### Ajouter des catégories
Les constantes `INCOME_CATEGORIES`, `EXPENSE_CATEGORIES`, et `EXPENSE_SUBS` dans `App.jsx` définissent les catégories disponibles.

### Changer les couleurs
Les variables de couleur sont définies en haut de `App.jsx` :
- `expenseCategoryColors` — Couleurs des catégories de dépenses
- `incomeCategoryColors` — Couleurs des catégories de revenus
- Le thème principal utilise la palette émeraude (`#059669`, `#10b981`, `#34d399`)

---

Créé avec ❤️ et un peu de noisettes 🐿️
