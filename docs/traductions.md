# Traductions du site

## Fonctionnement en production

Le site utilise exclusivement des dictionnaires statiques versionnés. Aucun appel à une API de traduction, aucune clé et aucun modèle d'IA ne sont nécessaires pour consulter le site ou le déployer.

- `messages/{fr,en,de,es,it}.json` : textes d'interface partagés.
- Dictionnaires des pages/composants : textes propres aux écrans existants.
- `data/catalog-translations.json` : noms, descriptions, catégories et caractéristiques traduits, indexés par texte source exact.
- `product.translations[locale]` dans `data/products.json` : corrections éditoriales prioritaires par produit.

Le texte français source reste intact. Les identifiants, références, prix, stocks, quantités et URL d'images ne sont pas traduits. L'affichage des caractéristiques, la recherche, le tri par nom, les favoris, le panier et le récapitulatif suivent la langue sélectionnée. Le serveur enregistre le nom localisé lors d'une nouvelle commande ; les commandes existantes conservent leur libellé historique.

Les layouts racines par langue rendent `<html lang>` côté serveur. La redirection `/` vers `/fr` et les URL existantes sont conservées. Les libellés accessibles, erreurs et pages introuvables sont également localisés.

## Génération locale, sans service de traduction

Les outils de `scripts/translation` sont séparés des dépendances du site. Les poids OPUS-MT/Marian sont téléchargés une seule fois depuis Hugging Face puis l'inférence se déroule localement. Aucun texte produit n'est envoyé à Hugging Face. Les modèles et caches restent dans `.translation-cache`, ignoré par Git.

```powershell
npm install --prefix scripts/translation --ignore-scripts
node scripts/translation/download-models.mjs
npm run translations:generate
npm run translations:verify
npm run test:localization
npm run test:checkout
npm run build
```

Le moteur produit d'abord l'anglais depuis le français, puis les autres langues depuis l'anglais. Les nombres sont contrôlés avant enregistrement. Les segments déjà traités sont mis en cache afin de reprendre une génération interrompue. Les corrections éditoriales doivent être enregistrées dans `product.translations` ou `data/catalog-translation-overrides.json` : elles ont priorité sur la génération. Le dictionnaire généré peut ainsi être régénéré sans perdre ces corrections.

La traduction automatique locale doit être relue pour la terminologie et les formulations commerciales : les contrôles de couverture et de nombres ne constituent pas une certification linguistique. Le fichier source `data/products.json` n'est pas réécrit par le générateur.

## Contrôles

`translations:verify` vérifie les clés des cinq JSON, les variables interpolées, la couverture des fiches produits, des catégories et des attributs, ainsi que la conservation des valeurs numériques. Une description courte absente de la source n'est pas artificiellement créée.

Après modification d'un texte français, sa nouvelle traduction doit être générée/revue : la recherche par texte source exact évite de réutiliser une ancienne traduction devenue incorrecte.

Modèles et documentation :
- https://huggingface.co/Xenova/opus-mt-fr-en
- https://huggingface.co/Xenova/opus-mt-en-de
- https://huggingface.co/Xenova/opus-mt-en-ROMANCE
- https://huggingface.co/Helsinki-NLP/opus-mt-en-ROMANCE
- https://huggingface.co/docs/transformers.js
