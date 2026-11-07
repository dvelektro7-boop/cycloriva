# Déploiement CYCLORIVA

## Paramètres de l'hébergeur

- Framework : Next.js, serveur Node.js (pas d'export statique).
- Node.js : 22.12 minimum sur la branche 22, ou Node.js 24.
- Installation : `npm ci` (le postinstall génère le client Prisma).
- Compilation : `npm run build`.
- Démarrage : `npm run start` ; utiliser le répertoire de sortie par défaut du framework.
- Conserver les dépendances de développement pendant l'installation et la compilation : Tailwind et Prisma en ont besoin.

## Variables d'environnement

Configurer les valeurs sur l'hébergeur avant l'installation et la compilation ; les fichiers `.env` locaux ne sont pas versionnés.

- `NEXT_PUBLIC_SITE_URL` : URL HTTPS publique du site, également utilisée dans les métadonnées.
- `DATABASE_URL` : connexion PostgreSQL de l'application.
- `DIRECT_URL` : connexion PostgreSQL directe/session pour Prisma Migrate. La configuration Prisma actuelle exige aussi sa présence pendant la génération du client à l'installation.
- `CYCLORIVA_ORDER_CONFIRMATION_SECRET` : secret serveur de signature des confirmations.
- `RESEND_API_KEY`, `CYCLORIVA_MAIL_FROM`, `CYCLORIVA_ADMIN_EMAIL` : envoi des notifications de commande avec une adresse d'expédition vérifiée.

Appliquer les migrations avec `npm run db:migrate` avant d'ouvrir le trafic sur une nouvelle base. Ne pas lancer les migrations automatiquement à chaque compilation.

## Validation avant publication

```sh
npm ci
npm run check
npm run test:checkout
npm run build
npm run start
```

Vérifier ensuite l'accueil, le catalogue, une fiche produit et le panier, puis le parcours de commande avec une base de test.

## Diagnostic d'un échec de compilation

Le build local du 7 novembre 2026 a réussi et généré 133 pages. La capture de l'hébergeur montre un message générique ; elle ne prouve pas un manque de mémoire. Les limites mémoire, la durée maximale et les journaux complets du runner restent nécessaires si l'échec se reproduit.

La configuration limite le travail de prérendu à deux workers et quatre pages simultanées par worker pour réduire les pointes mémoire. Le catalogue actif reste inchangé. Le chargeur Tailwind Turbopack est nécessaire à cette configuration CSS.

Les captures `.image-work`, sauvegardes `data/**/*.backup-*`, dossiers `data/**/backups` et fichiers temporaires sont exclus du suivi Git et conservés localement. `.next` est déjà ignoré et aucun fichier de ce dossier n'était versionné. Aucun second fichier `next.config` n'était présent dans le dépôt audité.

En cas de nouvel échec sur l'hébergeur, essayer un déploiement sans cache de build et examiner le code de sortie, la mémoire disponible et la dernière étape achevée. Une compilation locale réussie ne valide pas les connexions et variables de production.
