# Panier — vérification du 7 novembre 2026

- Conteneur sans largeur maximale, marges latérales réduites, liste et récapitulatif côte à côte sur PC et empilés sur mobile.
- Vrais produits du panier partagé : noms localisés disponibles, photos, références, descriptions courtes et prix recalculés depuis le catalogue.
- Prix de lignes et total en rouge ; livraison gratuite dans les huit pays conformément à la décision commerciale.
- Quantités, suppression, conservation après rechargement et passage à la commande vérifiés dans Chrome isolé, sans création de commande.
- Footer principal masqué sur panier, commande et confirmation sur PC et mobile ; règle des autres routes préservée.
- Tests navigateur : 1440, 1024, 390 et 375 px, cinq langues, panier vide, absence de débordement horizontal et d’erreurs JavaScript.
- Commande de vérification : `node scripts/verifier-panier-navigateur.mjs`.
- Captures : `.image-work/cart/cart-{1440,1024,390,375}.png`.
- Configuration des e-mails laissée à la charge du propriétaire, selon sa demande.
