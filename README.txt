CYCLORIVA — catalogue local

Démarrer : npm run dev
Catalogue : http://localhost:3000/fr/produits
Langues disponibles : fr, en, de, it, es.

Les produits sont lus depuis data/products.json. Le site ne demande aucune
information aux anciens domaines. Les photos importées sont servies depuis
public/images/produits. Une photo absente affiche « Image indisponible ».

État de l'export fourni :
- 401 produits, descriptions et prix importés dans le projet.
- 4 noms absents de l'export : 886, 1714, 2719, 2833 (référence affichée).
- 1 prix absent : 1982 (« Prix à confirmer »).
- 2 210 références photo, soit 2 208 adresses distinctes.
- Aucun fichier photo dans le CSV. Les adresses pointent vers un domaine
  qui ne se résout plus lors de la vérification ; aucune photo récupérée.
- Stocks historiques conservés pour migration, disponibilité actuelle non confirmée.
- Descriptions françaises conservées ; pas de traduction inventée.

Réimporter le CSV :
  npm run catalog:import -- "chemin\export.csv"

Importer aussi un dossier local contenant les photos originales :
  npm run catalog:import -- "chemin\export.csv" "chemin\uploads"
Les fichiers sont associés par nom exact. Les noms ambigus ne sont pas
associés automatiquement. Ils sont signalés dans le manifeste de migration.

Tenter de télécharger les photos référencées par l'export :
  npm run catalog:images
Les photos accessibles sont copiées dans le projet et les fiches utilisent
alors uniquement leurs chemins locaux. Les liens inaccessibles sont consignés
dans data/rapport-images.json, sans être utilisés par le site.

Contrôles :
  npm run catalog:verify
  npm run catalog:verify -- --http  (avec npm run dev déjà lancé sur le port 3000)
  npm run lint
  npm run build

data/migration/woocommerce-source.csv conserve l'export complet d'origine.
data/migration/images.json associe les sources aux photos locales récupérées.
data/migration/report.json liste les données manquantes lors de l'import.
Ces fichiers servent à la migration uniquement et ne sont pas importés par les pages.

L'erreur serveur liée au cache Turbopack a été contournée en désactivant
son cache disque en développement. Les polices utilisent celles du système
pour que le démarrage et la compilation ne dépendent pas de Google Fonts.
