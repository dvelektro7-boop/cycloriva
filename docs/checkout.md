# Audit et correction du checkout CYCLORIVA

Intervention du 7 novembre 2026. Les produits, images, catégories, descriptions et montants du catalogue sont conservés.

## Corrections réalisées

| Problème trouvé | Correction |
| --- | --- |
| `CheckoutHeader` était une copie de page qui s'importait elle-même | Composant typé avec bannière PC, fil d'Ariane et progression |
| Client Prisma absent | Singleton serveur avec adaptateur PostgreSQL et client généré |
| API de devis appelée mais inexistante | `POST /api/checkout/quote`, recalcul depuis le catalogue |
| Deux paniers indépendants | `lib/cart.ts` partagé ; compatibilité et migration de l'ancien panier |
| Formulaires dupliqués dans `CheckoutClient` | Assemblage des composants client, adresse, téléphone, récapitulatif et validation existants |
| Types inconnus pour les quantités | Contrôle explicite du type et des bornes |
| Total attendu refusé par la validation stricte | Champ validé, puis comparé au total recalculé côté serveur |
| Confirmation protégée sans cookie émis par l'API | Cookie signé, HttpOnly, limité dans le temps et lié à la commande |
| Tables de commande absentes | Deux migrations appliquées, avec contraintes sur les montants et protection RLS |
| Migrations configurées sur le pool transactionnel | Connexion `DIRECT_URL` pour Prisma Migrate ; `DATABASE_URL` pour l'application |
| Configurations de routes incompatibles avec Cache Components | Suppression des options incompatibles et frontières `Suspense` |
| Risque de perdre la confirmation sur un échec d'e-mail | Commande persistée avant les notifications ; envoi après la réponse |
| Notifications bloquées après arrêt d'un traitement | Reprise des traitements abandonnés depuis plus de cinq minutes |

Le bouton de commande de la fiche ajoute les produits au panier partagé, puis ouvre `/{locale}/commande`. La page panier conserve également son lien vers la commande. La confirmation indique une réception de commande ; aucun paiement n'est effectué par ce parcours.

## Présentation

- PC : deux colonnes, coordonnées et adresse à gauche, récapitulatif à droite ; boutons et informations complémentaires sous les cartes.
- Mobile : cartes successives, récapitulatif dépliable, validation puis retour au panier. Le grand footer est masqué sur le checkout mobile ; les autres pages conservent leurs règles.
- Prix des lignes et total en rouge foncé `#b91c1c`. Livraison gratuite en vert.
- Adresse et code postal alignés sur PC ; complément d'adresse disponible dans un panneau compact.
- Huit pays autorisés : Allemagne, France, Espagne, Italie, Suisse, Autriche, Pays-Bas et Belgique.
- Livraison gratuite dans les huit pays, conformément à la confirmation du propriétaire.
- Téléphone international validé, avec pays d'indicatif indépendant du pays de livraison.
- Géolocalisation approximative par les en-têtes de l'hébergeur reconnu. En local, l'absence de détection est indiquée ; le client choisit son pays.
- Adresse de facturation identique à la livraison. La facturation à une autre adresse n'est pas implémentée ; la validation refuse explicitement ce cas.

## Enregistrement et contrôle serveur

Le serveur valide les coordonnées, les pays, le téléphone, les lignes et quantités. Il recalcule les montants en centimes à partir du catalogue. Les prix et totaux fournis librement par le navigateur ne définissent jamais le montant d'une commande.

Une clé d'idempotence évite les doublons lors d'une nouvelle tentative. Les modifications d'une demande déjà enregistrée avec la même clé sont refusées. Les notifications sont créées avec la commande dans l'opération imbriquée Prisma.

Les tables de commandes, lignes et notifications ont la protection RLS activée. La confirmation requiert le cookie signé de la session ; connaître un identifiant de commande ne donne pas accès aux coordonnées du client. Les requêtes JSON contrôlent l'origine et la taille du corps. Une limitation bornée par instance protège les endpoints de commande et de devis.

## E-mails : état réel et configuration nécessaire

Les modèles client dans les cinq langues et administrateur sont testés avec un prestataire simulé : destinataires, produits, quantités, montants, HTML échappé et états d'erreur.

Les deux notifications ont un suivi séparé. Une notification acceptée par le prestataire est marquée `SENT` ; cela ne prouve pas sa réception dans la boîte du destinataire. Les reprises utilisent une clé d'idempotence stable. [Resend conserve ces clés pendant 24 heures](https://resend.com/changelog/idempotency-keys).

**L'envoi réel reste à finaliser avec le propriétaire :**

- `CYCLORIVA_MAIL_FROM` contient encore le domaine d'exemple `votre-domaine-verifie.com`.
- La vérification en lecture seule chez Resend a trouvé uniquement `develektro.de`, avec le statut `partially_failed`. Ce domaine n'a pas été réutilisé pour CYCLORIVA.
- L'adresse expéditrice CYCLORIVA et l'adresse de notification administrateur doivent être confirmées. Le domaine de l'expéditeur doit être validé chez Resend.
- Aucun e-mail de test réel n'a été envoyé.

Une configuration d'expéditeur absente ou d'exemple laisse les notifications en attente, sans consommer les tentatives d'envoi. Un administrateur manquant ne bloque pas une confirmation client correctement configurée.

L'essai initial est automatique après l'enregistrement. Pour les reprises périodiques, un ordonnanceur d'hébergement doit appeler **POST `/api/internal/checkout-emails`** avec le jeton Bearer `CYCLORIVA_CHECKOUT_JOB_SECRET`. Le secret local a été généré et n'est pas exposé au navigateur. L'ordonnanceur de production n'a pas été déployé pendant cette intervention.

Pour déclencher une reprise autorisée depuis l'environnement serveur :

```powershell
npm run checkout:retry-emails
```

Ce script utilise `CYCLORIVA_SITE_URL`, ou `http://localhost:3000` en local. Il ne faut l'exécuter que lorsque les destinataires et le domaine sont corrects, car il traite les notifications réellement en attente.

## Commandes de vérification

```powershell
npx tsc --noEmit
npm run build
npm run test:checkout
npm run test:checkout:db
npm run dev
npm run test:checkout:browser
```

Le test PostgreSQL utilise une transaction annulée : aucune commande de test n'est conservée. Son transport e-mail est simulé. Le test navigateur utilise Chrome sans fenêtre visible et intercepte les validations de commande testées ; il ne crée aucune commande réelle.

Contrôles effectués :

- Validation des huit pays et codes postaux, téléphone indépendant, données incorrectes et prix recalculés.
- Création PostgreSQL, deux notifications, idempotence, échec d'envoi puis reprise, absence de doublon et annulation complète des données de test.
- Formulaire, devis, quantités, gestion d'une erreur serveur et conservation du panier.
- Vues 1440, 1024, 390 et 375 px : absence de débordement horizontal et d'erreur JavaScript.
- Interfaces dans les cinq langues ; parcours depuis la fiche produit vers le checkout.
- Pages et API HTTP, accès refusé sans autorisation, confirmation protégée et livraison gratuite.

Captures locales régénérables par le test navigateur :

- [PC 1440 px](../.image-work/checkout/checkout-1440.png)
- [Portable 1024 px](../.image-work/checkout/checkout-1024.png)
- [Mobile 390 px](../.image-work/checkout/checkout-390.png)
- [Mobile 375 px](../.image-work/checkout/checkout-375.png)

## Pays et indicatif automatiques

La suggestion serveur Vercel/Cloudflare reste prioritaire. En son absence, `lib/checkout-client-geo.ts` interroge https://ipapi.co/json/ depuis le navigateur : la requ?te utilise l?IP publique du visiteur, sans transmettre ses champs de formulaire. Seul le code pays autoris? est utilis? ; l?IP n?est ni enregistr?e ni affich?e par CYCLORIVA. Le pays et l?indicatif sont propos?s ensemble. Les choix manuels restent ind?pendants et ne sont jamais ?cras?s par une r?ponse tardive.

Le repli expire apr?s quatre secondes. En cas de blocage, quota, ?chec ou pays hors des huit destinations, la s?lection reste manuelle. Une localisation IP reste approximative (VPN, r?seaux mobiles). La disponibilit? du service externe et ses conditions doivent ?tre prises en compte pour la mise en production. Documentation : https://ipapi.co/api/.

Contr?le : `node scripts/verifier-checkout-geo.mjs` v?rifie le pr?remplissage, la conservation des choix manuels, les erreurs et la pleine largeur ? 1920, 1440, 1024, 390 et 375 px. Les r?ponses g?ographiques sont simul?es pour des tests reproductibles.

## Suggestions d’adresses de livraison

- Champs concernés : adresse principale et code postal, sans rendre le choix d’une suggestion obligatoire.
- Source : Photon / OpenStreetMap, via `POST /api/checkout/address-suggestions`. Les requêtes sont limitées au pays de livraison choisi. Aucun appel si aucun pays n’est sélectionné ou si la saisie fait moins de trois caractères.
- Une recherche postale peut proposer une localité plutôt qu’une rue : dans ce cas elle remplit seulement les informations connues, puis la saisie de la rue affine la recherche.
- Attente de 600 ms après la frappe, annulation des réponses obsolètes, cinq suggestions maximum, cache limité à la durée de vie du champ. Limite serveur de 60 requêtes/minute par source, par instance.
- Le choix remplit les champs connus ; les champs manquants ne sont pas inventés. Le client peut tout corriger, ignorer les propositions ou fermer avec Échap. Navigation par flèches et Entrée disponible.
- Le formulaire, les validations et la commande restent utilisables si le fournisseur ne répond pas, ne couvre pas une adresse ou renvoie une erreur. Aucune validation d’adresse ne dépend de Photon.
- Seule la recherche d’adresse et le pays sont transmis au fournisseur ; pas de nom, e-mail, téléphone ou panier. Les résultats ne sont ni enregistrés dans une base de données ni intégrés aux journaux applicatifs. Les URL contenant une recherche restent internes à l’appel fournisseur.
- Service public sans garantie de disponibilité : usage modéré uniquement. Pour un trafic important, utiliser une instance Photon dédiée. Conditions et documentation : https://github.com/komoot/photon ; https://github.com/komoot/photon/blob/master/docs/api-v1.md.
- Tests : `node scripts/verifier-checkout-adresses.mjs`, cinq langues et quatre tailles, souris/clavier, saisie libre, changement de pays, panne fournisseur. Parser testé dans `lib/checkout-address-suggestions.test.ts`. Appels réels vérifiés avec des codes postaux publics des huit pays et une rue publique française.
