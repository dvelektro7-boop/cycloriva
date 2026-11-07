# Pages d’information — vérification du 7 novembre 2026

Périmètre : Contact, À propos, Conseils & Guides, Service client, Livraison, Retours & remboursements, FAQ, Garantie, Paiements sécurisés, Suivi de commande, Politique de confidentialité, Conditions générales de vente, Gestion des cookies et Mentions légales.

- Conteneurs sans largeur maximale ; petites marges latérales adaptées aux écrans.
- Marges entre sections et espaces inférieurs réduits, sans imposer une hauteur vide à chaque page.
- Classes Tailwind obsolètes et valeurs arbitraires remplacées par leurs équivalents recommandés ; couleurs, textes et traductions conservés.
- FAQ : attribut natif `open` à la place de `defaultOpen` ; icône ClipboardList importée dans Paiements sécurisés.
- Pages adaptées à la lecture des paramètres sous Suspense ; gestion des cookies avec import React standard et restauration des préférences différée jusqu’au montage.
- Contact : suppression du composant d’erreur recréé pendant chaque rendu, suppression d’état et d’imports inutilisés. Aucun message envoyé pendant les contrôles.
- Contrôles Chrome : les 14 pages à 1440, 1024, 390 et 375 px en français ; les 14 pages en anglais, allemand, italien et espagnol à 390 px. Aucun débordement horizontal ni erreur d’exécution détecté.
- Interactions : ouverture/fermeture de la FAQ ; ouverture et validation du formulaire Contact mobile ; acceptation/refus des cookies et conservation après rechargement.
- Build de production réussi. Les conditions commerciales et les textes juridiques existants n’ont pas été réécrits ni audités juridiquement.

Commandes :
- `node scripts/verifier-pages-informations.mjs`
- `node scripts/verifier-pages-interactions.mjs`
- `npx tsc --noEmit`
- `npm run build`

Captures PC/mobile : `.image-work/information/<route>-1440.png` et `<route>-375.png`.

## Navigation des pages

Les quatorze pages sont reliées au footer par de véritables composants Link, y compris les quatre liens légaux. `lib/site-routes.ts` centralise leurs slugs et construit les chemins avec la langue courante. Le type FooterItem exige désormais une destination.

Les services de l’accueil et des fiches produit renvoient aux pages Livraison, Paiements sécurisés, Retours & remboursements, Garantie (accueil) et Service client. Le menu Contact existant conserve sa route.

Contrôle : `node scripts/verifier-liens-informations.mjs` vérifie les liens dans les cinq langues sur PC/mobile et les réponses des 70 routes. Les liens internes et ancres des 14 pages ont également été inspectés, sans destination manquante. Build de production réussi.

## Réduction renforcée des espaces

Les espacements verticaux cumulés des sections sont ramenés à environ 8 px (4 px en haut et en bas), les marges des titres et paragraphes sont réduites et les cartes passent généralement à 12 px de marge intérieure. Les grandes hauteurs minimales d’illustration ont été réduites. Les textes et traductions restent inchangés.

Comparaison réelle à 1440 px : À propos 3225 → 2695 px ; FAQ 3776 → 3087 px ; Retours 4533 → 3728 px. Les 13 pages sont plus courtes sur PC et mobile, sans débordement aux quatre tailles contrôlées. Captures : `.image-work/information-compact/`.

La classe `focus-visible:outline-offset-[-2px]` de ContactFAQ est remplacée par `focus-visible:-outline-offset-2`, équivalente à -2 px.
