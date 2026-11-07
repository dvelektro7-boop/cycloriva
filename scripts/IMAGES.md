# Images produits

Le script modifie uniquement `images` dans `data/products.json`. Il conserve les fichiers locaux lisibles et ajoute les photos récupérées dans `public/images/produits/<productId>/`. Les autres champs produit sont comparés avant sauvegarde et ne peuvent pas changer.

```powershell
# Simulation sur quelques variantes, sans téléchargement ni modification des produits
node scripts/telecharger-images.mjs --dry-run --ids=818,840,860,894,869

# Récupération après examen du rapport
node scripts/telecharger-images.mjs --use-cache --ids=818,840,860,894,869

# Catalogue complet
node scripts/telecharger-images.mjs --use-cache

# Tests de correspondance et de préservation des données
node --test scripts/product-images.test.mjs
```

Le seuil par défaut est **0.68**. `--min-score=0.8` permet de le relever. Un score élevé ne contourne jamais un conflit de modèle, taille, capacité ou couleur. Les variantes ambiguës restent à vérifier. Les traductions de couleur sont normalisées, mais menthe et turquoise, par exemple, ne sont pas considérés automatiquement comme identiques.

L'index source exploite les noms de fichiers des images et regroupe les URL de langues différentes par identifiant source. Il tente trois fois les requêtes en échec, y compris les timeouts pendant la lecture. Un sitemap manquant, tronqué ou invalide fait interrompre la récupération avant toute modification des produits. Un index partiel n'est jamais sauvegardé comme index complet.

`--use-cache` utilise uniquement un index complet âgé de moins de 24 heures, enregistré dans `.next/cache/cycloriva-images/`. Sans cette option, le script relit la source complète. La date de cet index figure dans le rapport.

Les fichiers locaux sont vérifiés avec le décodeur d'images utilisé par Next.js. Ils sont conservés sans réécriture. `--force` permet de rechercher des photos supplémentaires ; il ne supprime ni ne remplace les fichiers valides. Les nouveaux fichiers sont créés exclusivement, sans écrasement.

Une réimportation ultérieure du CSV conserve les galeries locales déjà présentes et les lignes de provenance associées.

`data/rapport-recuperation-images.json` contient les décisions, preuves, conflits et échecs de téléchargement. Les références historiques du manifeste sont conservées. Les nouvelles lignes `origin: "gonser"` associent chaque photo locale à son URL, son article source et sa confiance ; elles ne sont pas réutilisées comme preuves historiques indépendantes.

Avant une modification effective, les fichiers produits et manifeste sont sauvegardés avec le suffixe `.backup-images-<date>`. Une modification concurrente de ces données pendant la récupération interrompt leur sauvegarde.
