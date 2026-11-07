# Fiche produit CYCLORIVA

La fiche conserve les données du catalogue : aucun prix, stock, avis ou contenu produit fictif n'est ajouté. `data/products.json` n'a pas été modifié.

- PC : galerie et résumé alignés, miniatures verticales, commandes côte à côte, caractéristiques par défaut, tableaux et panneau des informations vérifiées. Les produits similaires sont sur une ligne défilante, avec environ quatre cartes visibles.
- Mobile : galerie puis miniatures réelles, résumé compact, commandes superposées, accordéons, carte aventure, produits similaires sur une ligne défilante avec environ deux cartes visibles, et navigation inférieure avec espace de sécurité.
- Les prix actuels utilisent le rouge foncé commun `#b91c1c` dans la boutique. Les anciens prix barrés restent neutres. Le défilement des produits similaires fonctionne au toucher, à la souris et par flèches ; jusqu'à huit produits réellement comparables sont proposés.
- Le footer principal est masqué sur les fiches produit et le checkout mobiles, par un conteneur explicite dans `SiteChrome`. L'accueil et le catalogue conservent leur footer.
- Les libellés proviennent de `lib/product-i18n.ts`. Les contenus utilisent les traductions disponibles du catalogue ; leur absence est signalée. Le produit 826 ne possède actuellement aucune traduction.
- Les caractéristiques sont extraites des attributs et des paires explicites libellé/valeur dans la description. Le texte complet reste accessible, sans exécuter le HTML importé.
- `/images/accueil.png` est la photo officielle de deux cyclistes, conservée pour la carte aventure.

## Commandes

Le numéro WhatsApp fourni pour ce projet est **+49 1573 0394552**. Les liens préremplissent le récapitulatif : produit, référence ou identifiant, quantité, prix unitaire, montant de ligne, total des produits et lien de chaque fiche. L'utilisateur reste responsable de l'envoi dans WhatsApp.

Le bouton de commande sur le site ajoute le produit au panier partagé puis ouvre `/{locale}/commande`. Le panier `/{locale}/panier`, le compteur d'en-tête et le checkout utilisent `lib/cart.ts`. Les anciens paniers sont conservés par la migration de compatibilité. Les prix définitifs sont recalculés côté serveur.

Le checkout enregistre désormais la demande en base et affiche sa confirmation protégée. Le paiement en ligne n'est pas intégré. La livraison est gratuite dans les huit pays autorisés, conformément à la confirmation du propriétaire. L'état des e-mails et les tests sont détaillés dans [l'audit du checkout](checkout.md). À la demande du propriétaire, le libellé de disponibilité de la vitrine est « En stock », traduit dans les cinq langues. Ce changement d'affichage ne modifie ni les quantités du catalogue ni les indicateurs internes de confirmation du stock.

Les favoris sont conservés localement depuis la galerie et accessibles par `/{locale}/favoris`.

## Validation

- `npx.cmd tsc --noEmit`
- `node --import tsx --test lib/product-detail.test.ts`
- `npm.cmd run build`
- Routes HTTP : 826 dans les cinq langues ; 818, 1203, 1459 et 3150 ; accueil, catalogue, panier et favoris.
- Présence et réponse HTTP des images des produits échantillonnés ; vérification de l'intégrité du catalogue.
- ESLint : aucune erreur sur les fichiers contrôlés ; trois avertissements existants concernant les balises `img` des logos dans le header.

Les contrôles visuels et les interactions réelles à 375 px, 390 px, sur portable et grand écran restent à réaliser dans un navigateur. Aucun navigateur pilotable n'était disponible pendant cette intervention. Les contrôles HTTP et de rendu statique ne remplacent pas cette validation visuelle ni l'envoi volontaire d'un message WhatsApp.
