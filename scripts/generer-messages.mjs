import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const messagesDir = path.join(root, "messages");

fs.mkdirSync(messagesDir, {
  recursive: true,
});

const messages = {
  fr: {
    locale: {
      code: "fr",
      name: "Français"
    },

    site: {
      name: "CYCLORIVA",
      tagline: "Votre spécialiste du vélo et de la mobilité électrique en Europe."
    },

    common: {
      loading: "Chargement...",
      close: "Fermer",
      cancel: "Annuler",
      save: "Enregistrer",
      continue: "Continuer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      yes: "Oui",
      no: "Non",
      retry: "Réessayer",
      seeMore: "Voir plus",
      seeLess: "Voir moins",
      learnMore: "En savoir plus",
      required: "Obligatoire",
      optional: "Optionnel",
      available: "Disponible",
      unavailable: "Indisponible",
      comingSoon: "Bientôt disponible"
    },

    navigation: {
      home: "Accueil",
      products: "Produits",
      electricBikes: "Vélos électriques",
      mountainBikes: "VTT",
      cargoBikes: "Vélos cargo",
      cityBikes: "Vélos de ville",
      accessories: "Accessoires",
      brands: "Marques",
      promotions: "Promotions",
      contact: "Contact",
      account: "Compte",
      favorites: "Favoris",
      cart: "Panier",
      language: "Langue"
    },

    home: {
      heroEyebrow: "CYCLORIVA",
      heroTitle: "Roulez plus loin",
      heroDescription: "Découvrez notre sélection de vélos, vélos électriques, accessoires et solutions de mobilité.",
      shopNow: "Découvrir les produits",
      categoriesTitle: "Nos catégories",
      featuredTitle: "Produits à découvrir",
      allProducts: "Voir tous les produits"
    },

    search: {
      placeholder: "Rechercher un produit, une marque ou un accessoire...",
      button: "Rechercher",
      results: "Résultats",
      noResults: "Aucun résultat trouvé",
      clear: "Effacer",
      filters: "Filtres",
      sort: "Trier"
    },

    catalog: {
      title: "Tous les produits",
      allCategories: "Toutes les catégories",
      category: "Catégorie",
      results: "produit(s)",
      viewProduct: "Voir le produit",
      imageUnavailable: "Image indisponible",
      priceToConfirm: "Prix à confirmer",
      availabilityToConfirm: "Disponibilité à confirmer",
      inStock: "En stock",
      outOfStock: "Rupture de stock",
      sortBy: "Trier par",
      sortDefault: "Pertinence",
      sortPriceAsc: "Prix croissant",
      sortPriceDesc: "Prix décroissant",
      sortNameAsc: "Nom A à Z"
    },

    product: {
      backToCatalog: "Retour au catalogue",
      description: "Description",
      shortDescription: "Présentation",
      specifications: "Caractéristiques",
      photos: "Photos",
      reference: "Référence",
      sku: "UGS",
      weight: "Poids",
      dimensions: "Dimensions",
      quantity: "Quantité",
      addToCart: "Ajouter au panier",
      buyNow: "Acheter maintenant",
      orderOnSite: "Commander sur le site",
      orderWhatsapp: "Commander via WhatsApp",
      secureOrder: "Commande sécurisée",
      relatedProducts: "Produits similaires",
      highlights: "Points forts",
      services: "Services",
      delivery: "Livraison",
      returns: "Retours",
      warranty: "Garantie",
      availability: "Disponibilité",
      stock: "Stock",
      unavailable: "Produit indisponible",
      previousImage: "Image précédente",
      nextImage: "Image suivante",
      selectImage: "Sélectionner cette image"
    },

    cart: {
      title: "Votre panier",
      empty: "Votre panier est vide",
      emptyDescription: "Ajoutez des produits à votre panier pour commencer votre commande.",
      continueShopping: "Continuer mes achats",
      product: "Produit",
      unitPrice: "Prix unitaire",
      quantity: "Quantité",
      subtotal: "Sous-total",
      total: "Total",
      remove: "Supprimer",
      update: "Mettre à jour",
      checkout: "Passer la commande"
    },

    checkout: {
      title: "Finaliser la commande",
      contact: "Coordonnées",
      deliveryAddress: "Adresse de livraison",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Adresse e-mail",
      phone: "Téléphone",
      address: "Adresse",
      postalCode: "Code postal",
      city: "Ville",
      country: "Pays",
      payment: "Paiement",
      orderSummary: "Récapitulatif de la commande",
      placeOrder: "Confirmer la commande",
      requiredFields: "Veuillez remplir tous les champs obligatoires.",
      securePayment: "Paiement sécurisé",
      termsConsent: "J'accepte les conditions générales de vente."
    },

    order: {
      title: "Commande",
      confirmation: "Confirmation de commande",
      confirmed: "Votre commande a bien été enregistrée.",
      number: "Numéro de commande",
      status: "Statut",
      paymentStatus: "Statut du paiement",
      track: "Suivre ma commande"
    },

    newsletter: {
      eyebrow: "Newsletter",
      title: "Restez informé !",
      description: "Recevez nos nouveautés, offres et conseils vélo directement par e-mail.",
      emailPlaceholder: "Votre adresse e-mail",
      subscribe: "S'inscrire",
      consent: "J'accepte de recevoir les actualités et offres CYCLORIVA. Je peux me désinscrire à tout moment.",
      needConsent: "Veuillez accepter l'inscription à la newsletter.",
      success: "Votre inscription a bien été prise en compte.",
      pending: "L'inscription sera disponible après la connexion du service e-mail."
    },

    services: {
      securePayment: "Paiement sécurisé",
      customerService: "Service client",
      delivery: "Livraison",
      returns: "Retours et remboursements",
      warranty: "Garantie"
    },

    footer: {
      store: "Boutique",
      information: "Informations",
      help: "Aide",
      socialMedia: "Réseaux sociaux",
      about: "À propos de CYCLORIVA",
      guides: "Conseils et guides",
      customerService: "Service client",
      delivery: "Livraison",
      returns: "Retours et remboursements",
      faq: "FAQ",
      warranty: "Garantie",
      trackOrder: "Suivi de commande",
      legalNotice: "Mentions légales",
      privacyPolicy: "Politique de confidentialité",
      terms: "Conditions générales de vente",
      cookieSettings: "Gestion des cookies",
      rights: "Tous droits réservés."
    },

    errors: {
      generic: "Une erreur est survenue.",
      notFound: "Page introuvable",
      productNotFound: "Produit introuvable",
      tryAgain: "Veuillez réessayer.",
      unavailableAction: "Cette fonctionnalité n'est pas encore disponible."
    }
  },

  en: {
    locale: {
      code: "en",
      name: "English"
    },

    site: {
      name: "CYCLORIVA",
      tagline: "Your cycling and e-mobility specialist in Europe."
    },

    common: {
      loading: "Loading...",
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      continue: "Continue",
      back: "Back",
      next: "Next",
      previous: "Previous",
      yes: "Yes",
      no: "No",
      retry: "Try again",
      seeMore: "See more",
      seeLess: "See less",
      learnMore: "Learn more",
      required: "Required",
      optional: "Optional",
      available: "Available",
      unavailable: "Unavailable",
      comingSoon: "Coming soon"
    },

    navigation: {
      home: "Home",
      products: "Products",
      electricBikes: "Electric bikes",
      mountainBikes: "Mountain bikes",
      cargoBikes: "Cargo bikes",
      cityBikes: "City bikes",
      accessories: "Accessories",
      brands: "Brands",
      promotions: "Offers",
      contact: "Contact",
      account: "Account",
      favorites: "Wishlist",
      cart: "Cart",
      language: "Language"
    },

    home: {
      heroEyebrow: "CYCLORIVA",
      heroTitle: "Ride further",
      heroDescription: "Discover our selection of bikes, electric bikes, accessories and mobility solutions.",
      shopNow: "Explore products",
      categoriesTitle: "Our categories",
      featuredTitle: "Featured products",
      allProducts: "View all products"
    },

    search: {
      placeholder: "Search for a product, brand or accessory...",
      button: "Search",
      results: "Results",
      noResults: "No results found",
      clear: "Clear",
      filters: "Filters",
      sort: "Sort"
    },

    catalog: {
      title: "All products",
      allCategories: "All categories",
      category: "Category",
      results: "product(s)",
      viewProduct: "View product",
      imageUnavailable: "Image unavailable",
      priceToConfirm: "Price to confirm",
      availabilityToConfirm: "Availability to confirm",
      inStock: "In stock",
      outOfStock: "Out of stock",
      sortBy: "Sort by",
      sortDefault: "Relevance",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
      sortNameAsc: "Name A to Z"
    },

    product: {
      backToCatalog: "Back to catalogue",
      description: "Description",
      shortDescription: "Overview",
      specifications: "Specifications",
      photos: "Photos",
      reference: "Reference",
      sku: "SKU",
      weight: "Weight",
      dimensions: "Dimensions",
      quantity: "Quantity",
      addToCart: "Add to cart",
      buyNow: "Buy now",
      orderOnSite: "Order on the website",
      orderWhatsapp: "Order via WhatsApp",
      secureOrder: "Secure order",
      relatedProducts: "Related products",
      highlights: "Highlights",
      services: "Services",
      delivery: "Delivery",
      returns: "Returns",
      warranty: "Warranty",
      availability: "Availability",
      stock: "Stock",
      unavailable: "Product unavailable",
      previousImage: "Previous image",
      nextImage: "Next image",
      selectImage: "Select this image"
    },

    cart: {
      title: "Your cart",
      empty: "Your cart is empty",
      emptyDescription: "Add products to your cart to start your order.",
      continueShopping: "Continue shopping",
      product: "Product",
      unitPrice: "Unit price",
      quantity: "Quantity",
      subtotal: "Subtotal",
      total: "Total",
      remove: "Remove",
      update: "Update",
      checkout: "Checkout"
    },

    checkout: {
      title: "Complete your order",
      contact: "Contact details",
      deliveryAddress: "Delivery address",
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      phone: "Phone",
      address: "Address",
      postalCode: "Postal code",
      city: "City",
      country: "Country",
      payment: "Payment",
      orderSummary: "Order summary",
      placeOrder: "Place order",
      requiredFields: "Please complete all required fields.",
      securePayment: "Secure payment",
      termsConsent: "I accept the terms and conditions of sale."
    },

    order: {
      title: "Order",
      confirmation: "Order confirmation",
      confirmed: "Your order has been successfully registered.",
      number: "Order number",
      status: "Status",
      paymentStatus: "Payment status",
      track: "Track my order"
    },

    newsletter: {
      eyebrow: "Newsletter",
      title: "Stay informed!",
      description: "Receive product news, offers and cycling tips directly by email.",
      emailPlaceholder: "Your email address",
      subscribe: "Subscribe",
      consent: "I agree to receive CYCLORIVA news and offers. I can unsubscribe at any time.",
      needConsent: "Please agree to receive the newsletter.",
      success: "Your subscription has been registered.",
      pending: "Subscription will be available once the email service is connected."
    },

    services: {
      securePayment: "Secure payment",
      customerService: "Customer service",
      delivery: "Delivery",
      returns: "Returns and refunds",
      warranty: "Warranty"
    },

    footer: {
      store: "Shop",
      information: "Information",
      help: "Help",
      socialMedia: "Social media",
      about: "About CYCLORIVA",
      guides: "Tips and guides",
      customerService: "Customer service",
      delivery: "Delivery",
      returns: "Returns and refunds",
      faq: "FAQ",
      warranty: "Warranty",
      trackOrder: "Track order",
      legalNotice: "Legal notice",
      privacyPolicy: "Privacy policy",
      terms: "Terms and conditions",
      cookieSettings: "Cookie settings",
      rights: "All rights reserved."
    },

    errors: {
      generic: "Something went wrong.",
      notFound: "Page not found",
      productNotFound: "Product not found",
      tryAgain: "Please try again.",
      unavailableAction: "This feature is not yet available."
    }
  },

  de: {
    locale: {
      code: "de",
      name: "Deutsch"
    },

    site: {
      name: "CYCLORIVA",
      tagline: "Ihr Spezialist für Fahrräder und E-Mobilität in Europa."
    },

    common: {
      loading: "Wird geladen...",
      close: "Schließen",
      cancel: "Abbrechen",
      save: "Speichern",
      continue: "Weiter",
      back: "Zurück",
      next: "Weiter",
      previous: "Zurück",
      yes: "Ja",
      no: "Nein",
      retry: "Erneut versuchen",
      seeMore: "Mehr anzeigen",
      seeLess: "Weniger anzeigen",
      learnMore: "Mehr erfahren",
      required: "Erforderlich",
      optional: "Optional",
      available: "Verfügbar",
      unavailable: "Nicht verfügbar",
      comingSoon: "Demnächst verfügbar"
    },

    navigation: {
      home: "Startseite",
      products: "Produkte",
      electricBikes: "E-Bikes",
      mountainBikes: "Mountainbikes",
      cargoBikes: "Lastenräder",
      cityBikes: "Citybikes",
      accessories: "Zubehör",
      brands: "Marken",
      promotions: "Angebote",
      contact: "Kontakt",
      account: "Konto",
      favorites: "Merkliste",
      cart: "Warenkorb",
      language: "Sprache"
    },

    home: {
      heroEyebrow: "CYCLORIVA",
      heroTitle: "Weiter fahren",
      heroDescription: "Entdecken Sie unsere Auswahl an Fahrrädern, E-Bikes, Zubehör und Mobilitätslösungen.",
      shopNow: "Produkte entdecken",
      categoriesTitle: "Unsere Kategorien",
      featuredTitle: "Empfohlene Produkte",
      allProducts: "Alle Produkte anzeigen"
    },

    search: {
      placeholder: "Produkt, Marke oder Zubehör suchen...",
      button: "Suchen",
      results: "Ergebnisse",
      noResults: "Keine Ergebnisse gefunden",
      clear: "Löschen",
      filters: "Filter",
      sort: "Sortieren"
    },

    catalog: {
      title: "Alle Produkte",
      allCategories: "Alle Kategorien",
      category: "Kategorie",
      results: "Produkt(e)",
      viewProduct: "Produkt ansehen",
      imageUnavailable: "Bild nicht verfügbar",
      priceToConfirm: "Preis zu bestätigen",
      availabilityToConfirm: "Verfügbarkeit zu bestätigen",
      inStock: "Auf Lager",
      outOfStock: "Nicht auf Lager",
      sortBy: "Sortieren nach",
      sortDefault: "Relevanz",
      sortPriceAsc: "Preis aufsteigend",
      sortPriceDesc: "Preis absteigend",
      sortNameAsc: "Name A bis Z"
    },

    product: {
      backToCatalog: "Zurück zum Katalog",
      description: "Beschreibung",
      shortDescription: "Übersicht",
      specifications: "Technische Daten",
      photos: "Fotos",
      reference: "Referenz",
      sku: "Artikelnummer",
      weight: "Gewicht",
      dimensions: "Maße",
      quantity: "Menge",
      addToCart: "In den Warenkorb",
      buyNow: "Jetzt kaufen",
      orderOnSite: "Auf der Website bestellen",
      orderWhatsapp: "Über WhatsApp bestellen",
      secureOrder: "Sichere Bestellung",
      relatedProducts: "Ähnliche Produkte",
      highlights: "Highlights",
      services: "Services",
      delivery: "Lieferung",
      returns: "Rückgabe",
      warranty: "Garantie",
      availability: "Verfügbarkeit",
      stock: "Bestand",
      unavailable: "Produkt nicht verfügbar",
      previousImage: "Vorheriges Bild",
      nextImage: "Nächstes Bild",
      selectImage: "Dieses Bild auswählen"
    },

    cart: {
      title: "Ihr Warenkorb",
      empty: "Ihr Warenkorb ist leer",
      emptyDescription: "Fügen Sie Produkte zum Warenkorb hinzu, um Ihre Bestellung zu beginnen.",
      continueShopping: "Weiter einkaufen",
      product: "Produkt",
      unitPrice: "Stückpreis",
      quantity: "Menge",
      subtotal: "Zwischensumme",
      total: "Gesamtsumme",
      remove: "Entfernen",
      update: "Aktualisieren",
      checkout: "Zur Kasse"
    },

    checkout: {
      title: "Bestellung abschließen",
      contact: "Kontaktdaten",
      deliveryAddress: "Lieferadresse",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail-Adresse",
      phone: "Telefon",
      address: "Adresse",
      postalCode: "Postleitzahl",
      city: "Stadt",
      country: "Land",
      payment: "Zahlung",
      orderSummary: "Bestellübersicht",
      placeOrder: "Bestellung bestätigen",
      requiredFields: "Bitte füllen Sie alle Pflichtfelder aus.",
      securePayment: "Sichere Zahlung",
      termsConsent: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen."
    },

    order: {
      title: "Bestellung",
      confirmation: "Bestellbestätigung",
      confirmed: "Ihre Bestellung wurde erfolgreich erfasst.",
      number: "Bestellnummer",
      status: "Status",
      paymentStatus: "Zahlungsstatus",
      track: "Bestellung verfolgen"
    },

    newsletter: {
      eyebrow: "Newsletter",
      title: "Bleiben Sie informiert!",
      description: "Erhalten Sie Neuheiten, Angebote und Fahrradtipps direkt per E-Mail.",
      emailPlaceholder: "Ihre E-Mail-Adresse",
      subscribe: "Abonnieren",
      consent: "Ich möchte Neuigkeiten und Angebote von CYCLORIVA erhalten. Ich kann mich jederzeit abmelden.",
      needConsent: "Bitte stimmen Sie dem Newsletter zu.",
      success: "Ihre Anmeldung wurde gespeichert.",
      pending: "Die Anmeldung ist verfügbar, sobald der E-Mail-Dienst verbunden ist."
    },

    services: {
      securePayment: "Sichere Zahlung",
      customerService: "Kundenservice",
      delivery: "Lieferung",
      returns: "Rückgabe und Erstattung",
      warranty: "Garantie"
    },

    footer: {
      store: "Shop",
      information: "Informationen",
      help: "Hilfe",
      socialMedia: "Soziale Medien",
      about: "Über CYCLORIVA",
      guides: "Tipps und Ratgeber",
      customerService: "Kundenservice",
      delivery: "Lieferung",
      returns: "Rückgabe und Erstattung",
      faq: "FAQ",
      warranty: "Garantie",
      trackOrder: "Bestellung verfolgen",
      legalNotice: "Impressum",
      privacyPolicy: "Datenschutz",
      terms: "Allgemeine Geschäftsbedingungen",
      cookieSettings: "Cookie-Einstellungen",
      rights: "Alle Rechte vorbehalten."
    },

    errors: {
      generic: "Ein Fehler ist aufgetreten.",
      notFound: "Seite nicht gefunden",
      productNotFound: "Produkt nicht gefunden",
      tryAgain: "Bitte versuchen Sie es erneut.",
      unavailableAction: "Diese Funktion ist noch nicht verfügbar."
    }
  },

  it: {
    locale: {
      code: "it",
      name: "Italiano"
    },

    site: {
      name: "CYCLORIVA",
      tagline: "Il tuo specialista di biciclette e mobilità elettrica in Europa."
    },

    common: {
      loading: "Caricamento...",
      close: "Chiudi",
      cancel: "Annulla",
      save: "Salva",
      continue: "Continua",
      back: "Indietro",
      next: "Avanti",
      previous: "Precedente",
      yes: "Sì",
      no: "No",
      retry: "Riprova",
      seeMore: "Mostra altro",
      seeLess: "Mostra meno",
      learnMore: "Scopri di più",
      required: "Obbligatorio",
      optional: "Opzionale",
      available: "Disponibile",
      unavailable: "Non disponibile",
      comingSoon: "Prossimamente"
    },

    navigation: {
      home: "Home",
      products: "Prodotti",
      electricBikes: "Bici elettriche",
      mountainBikes: "Mountain bike",
      cargoBikes: "Bici cargo",
      cityBikes: "Bici da città",
      accessories: "Accessori",
      brands: "Marche",
      promotions: "Promozioni",
      contact: "Contatti",
      account: "Account",
      favorites: "Preferiti",
      cart: "Carrello",
      language: "Lingua"
    },

    home: {
      heroEyebrow: "CYCLORIVA",
      heroTitle: "Vai più lontano",
      heroDescription: "Scopri la nostra selezione di biciclette, e-bike, accessori e soluzioni di mobilità.",
      shopNow: "Scopri i prodotti",
      categoriesTitle: "Le nostre categorie",
      featuredTitle: "Prodotti in evidenza",
      allProducts: "Vedi tutti i prodotti"
    },

    search: {
      placeholder: "Cerca un prodotto, una marca o un accessorio...",
      button: "Cerca",
      results: "Risultati",
      noResults: "Nessun risultato trovato",
      clear: "Cancella",
      filters: "Filtri",
      sort: "Ordina"
    },

    catalog: {
      title: "Tutti i prodotti",
      allCategories: "Tutte le categorie",
      category: "Categoria",
      results: "prodotto/i",
      viewProduct: "Vedi prodotto",
      imageUnavailable: "Immagine non disponibile",
      priceToConfirm: "Prezzo da confermare",
      availabilityToConfirm: "Disponibilità da confermare",
      inStock: "Disponibile",
      outOfStock: "Esaurito",
      sortBy: "Ordina per",
      sortDefault: "Rilevanza",
      sortPriceAsc: "Prezzo crescente",
      sortPriceDesc: "Prezzo decrescente",
      sortNameAsc: "Nome dalla A alla Z"
    },

    product: {
      backToCatalog: "Torna al catalogo",
      description: "Descrizione",
      shortDescription: "Panoramica",
      specifications: "Caratteristiche",
      photos: "Foto",
      reference: "Riferimento",
      sku: "Codice articolo",
      weight: "Peso",
      dimensions: "Dimensioni",
      quantity: "Quantità",
      addToCart: "Aggiungi al carrello",
      buyNow: "Acquista ora",
      orderOnSite: "Ordina sul sito",
      orderWhatsapp: "Ordina tramite WhatsApp",
      secureOrder: "Ordine sicuro",
      relatedProducts: "Prodotti simili",
      highlights: "Punti di forza",
      services: "Servizi",
      delivery: "Consegna",
      returns: "Resi",
      warranty: "Garanzia",
      availability: "Disponibilità",
      stock: "Disponibilità",
      unavailable: "Prodotto non disponibile",
      previousImage: "Immagine precedente",
      nextImage: "Immagine successiva",
      selectImage: "Seleziona questa immagine"
    },

    cart: {
      title: "Il tuo carrello",
      empty: "Il carrello è vuoto",
      emptyDescription: "Aggiungi prodotti al carrello per iniziare il tuo ordine.",
      continueShopping: "Continua gli acquisti",
      product: "Prodotto",
      unitPrice: "Prezzo unitario",
      quantity: "Quantità",
      subtotal: "Subtotale",
      total: "Totale",
      remove: "Rimuovi",
      update: "Aggiorna",
      checkout: "Procedi all'ordine"
    },

    checkout: {
      title: "Completa l'ordine",
      contact: "Dati di contatto",
      deliveryAddress: "Indirizzo di consegna",
      firstName: "Nome",
      lastName: "Cognome",
      email: "Indirizzo e-mail",
      phone: "Telefono",
      address: "Indirizzo",
      postalCode: "CAP",
      city: "Città",
      country: "Paese",
      payment: "Pagamento",
      orderSummary: "Riepilogo dell'ordine",
      placeOrder: "Conferma ordine",
      requiredFields: "Compila tutti i campi obbligatori.",
      securePayment: "Pagamento sicuro",
      termsConsent: "Accetto le condizioni generali di vendita."
    },

    order: {
      title: "Ordine",
      confirmation: "Conferma dell'ordine",
      confirmed: "Il tuo ordine è stato registrato correttamente.",
      number: "Numero ordine",
      status: "Stato",
      paymentStatus: "Stato del pagamento",
      track: "Traccia il mio ordine"
    },

    newsletter: {
      eyebrow: "Newsletter",
      title: "Resta aggiornato!",
      description: "Ricevi novità, offerte e consigli sulle biciclette direttamente via e-mail.",
      emailPlaceholder: "Il tuo indirizzo e-mail",
      subscribe: "Iscriviti",
      consent: "Accetto di ricevere notizie e offerte CYCLORIVA. Posso annullare l'iscrizione in qualsiasi momento.",
      needConsent: "Accetta l'iscrizione alla newsletter.",
      success: "La tua iscrizione è stata registrata.",
      pending: "L'iscrizione sarà disponibile dopo il collegamento del servizio e-mail."
    },

    services: {
      securePayment: "Pagamento sicuro",
      customerService: "Servizio clienti",
      delivery: "Consegna",
      returns: "Resi e rimborsi",
      warranty: "Garanzia"
    },

    footer: {
      store: "Negozio",
      information: "Informazioni",
      help: "Assistenza",
      socialMedia: "Social media",
      about: "Chi è CYCLORIVA",
      guides: "Consigli e guide",
      customerService: "Servizio clienti",
      delivery: "Consegna",
      returns: "Resi e rimborsi",
      faq: "FAQ",
      warranty: "Garanzia",
      trackOrder: "Traccia ordine",
      legalNotice: "Note legali",
      privacyPolicy: "Informativa sulla privacy",
      terms: "Condizioni generali di vendita",
      cookieSettings: "Gestione dei cookie",
      rights: "Tutti i diritti riservati."
    },

    errors: {
      generic: "Si è verificato un errore.",
      notFound: "Pagina non trovata",
      productNotFound: "Prodotto non trovato",
      tryAgain: "Riprova.",
      unavailableAction: "Questa funzione non è ancora disponibile."
    }
  },

  es: {
    locale: {
      code: "es",
      name: "Español"
    },

    site: {
      name: "CYCLORIVA",
      tagline: "Tu especialista en bicicletas y movilidad eléctrica en Europa."
    },

    common: {
      loading: "Cargando...",
      close: "Cerrar",
      cancel: "Cancelar",
      save: "Guardar",
      continue: "Continuar",
      back: "Volver",
      next: "Siguiente",
      previous: "Anterior",
      yes: "Sí",
      no: "No",
      retry: "Volver a intentar",
      seeMore: "Ver más",
      seeLess: "Ver menos",
      learnMore: "Más información",
      required: "Obligatorio",
      optional: "Opcional",
      available: "Disponible",
      unavailable: "No disponible",
      comingSoon: "Próximamente"
    },

    navigation: {
      home: "Inicio",
      products: "Productos",
      electricBikes: "Bicicletas eléctricas",
      mountainBikes: "Bicicletas de montaña",
      cargoBikes: "Bicicletas de carga",
      cityBikes: "Bicicletas urbanas",
      accessories: "Accesorios",
      brands: "Marcas",
      promotions: "Ofertas",
      contact: "Contacto",
      account: "Cuenta",
      favorites: "Favoritos",
      cart: "Carrito",
      language: "Idioma"
    },

    home: {
      heroEyebrow: "CYCLORIVA",
      heroTitle: "Llega más lejos",
      heroDescription: "Descubre nuestra selección de bicicletas, bicicletas eléctricas, accesorios y soluciones de movilidad.",
      shopNow: "Descubrir productos",
      categoriesTitle: "Nuestras categorías",
      featuredTitle: "Productos destacados",
      allProducts: "Ver todos los productos"
    },

    search: {
      placeholder: "Buscar un producto, una marca o un accesorio...",
      button: "Buscar",
      results: "Resultados",
      noResults: "No se encontraron resultados",
      clear: "Borrar",
      filters: "Filtros",
      sort: "Ordenar"
    },

    catalog: {
      title: "Todos los productos",
      allCategories: "Todas las categorías",
      category: "Categoría",
      results: "producto(s)",
      viewProduct: "Ver producto",
      imageUnavailable: "Imagen no disponible",
      priceToConfirm: "Precio por confirmar",
      availabilityToConfirm: "Disponibilidad por confirmar",
      inStock: "En stock",
      outOfStock: "Agotado",
      sortBy: "Ordenar por",
      sortDefault: "Relevancia",
      sortPriceAsc: "Precio de menor a mayor",
      sortPriceDesc: "Precio de mayor a menor",
      sortNameAsc: "Nombre de A a Z"
    },

    product: {
      backToCatalog: "Volver al catálogo",
      description: "Descripción",
      shortDescription: "Presentación",
      specifications: "Características",
      photos: "Fotos",
      reference: "Referencia",
      sku: "SKU",
      weight: "Peso",
      dimensions: "Dimensiones",
      quantity: "Cantidad",
      addToCart: "Añadir al carrito",
      buyNow: "Comprar ahora",
      orderOnSite: "Comprar en el sitio",
      orderWhatsapp: "Comprar por WhatsApp",
      secureOrder: "Pedido seguro",
      relatedProducts: "Productos relacionados",
      highlights: "Puntos destacados",
      services: "Servicios",
      delivery: "Entrega",
      returns: "Devoluciones",
      warranty: "Garantía",
      availability: "Disponibilidad",
      stock: "Stock",
      unavailable: "Producto no disponible",
      previousImage: "Imagen anterior",
      nextImage: "Imagen siguiente",
      selectImage: "Seleccionar esta imagen"
    },

    cart: {
      title: "Tu carrito",
      empty: "Tu carrito está vacío",
      emptyDescription: "Añade productos al carrito para comenzar tu pedido.",
      continueShopping: "Seguir comprando",
      product: "Producto",
      unitPrice: "Precio unitario",
      quantity: "Cantidad",
      subtotal: "Subtotal",
      total: "Total",
      remove: "Eliminar",
      update: "Actualizar",
      checkout: "Finalizar compra"
    },

    checkout: {
      title: "Finalizar pedido",
      contact: "Datos de contacto",
      deliveryAddress: "Dirección de entrega",
      firstName: "Nombre",
      lastName: "Apellidos",
      email: "Correo electrónico",
      phone: "Teléfono",
      address: "Dirección",
      postalCode: "Código postal",
      city: "Ciudad",
      country: "País",
      payment: "Pago",
      orderSummary: "Resumen del pedido",
      placeOrder: "Confirmar pedido",
      requiredFields: "Completa todos los campos obligatorios.",
      securePayment: "Pago seguro",
      termsConsent: "Acepto las condiciones generales de venta."
    },

    order: {
      title: "Pedido",
      confirmation: "Confirmación del pedido",
      confirmed: "Tu pedido se ha registrado correctamente.",
      number: "Número de pedido",
      status: "Estado",
      paymentStatus: "Estado del pago",
      track: "Seguir mi pedido"
    },

    newsletter: {
      eyebrow: "Newsletter",
      title: "¡Mantente informado!",
      description: "Recibe novedades, ofertas y consejos sobre ciclismo directamente por correo electrónico.",
      emailPlaceholder: "Tu dirección de correo electrónico",
      subscribe: "Suscribirse",
      consent: "Acepto recibir noticias y ofertas de CYCLORIVA. Puedo darme de baja en cualquier momento.",
      needConsent: "Acepta recibir el boletín.",
      success: "Tu suscripción se ha registrado correctamente.",
      pending: "La suscripción estará disponible cuando se conecte el servicio de correo."
    },

    services: {
      securePayment: "Pago seguro",
      customerService: "Atención al cliente",
      delivery: "Entrega",
      returns: "Devoluciones y reembolsos",
      warranty: "Garantía"
    },

    footer: {
      store: "Tienda",
      information: "Información",
      help: "Ayuda",
      socialMedia: "Redes sociales",
      about: "Sobre CYCLORIVA",
      guides: "Consejos y guías",
      customerService: "Atención al cliente",
      delivery: "Entrega",
      returns: "Devoluciones y reembolsos",
      faq: "Preguntas frecuentes",
      warranty: "Garantía",
      trackOrder: "Seguimiento del pedido",
      legalNotice: "Aviso legal",
      privacyPolicy: "Política de privacidad",
      terms: "Condiciones generales de venta",
      cookieSettings: "Configuración de cookies",
      rights: "Todos los derechos reservados."
    },

    errors: {
      generic: "Se ha producido un error.",
      notFound: "Página no encontrada",
      productNotFound: "Producto no encontrado",
      tryAgain: "Inténtalo de nuevo.",
      unavailableAction: "Esta función aún no está disponible."
    }
  }
};

function flattenKeys(value, prefix = "") {
  const keys = [];

  for (const [key, child] of Object.entries(value)) {
    const current = prefix
      ? `${prefix}.${key}`
      : key;

    if (
      child &&
      typeof child === "object" &&
      !Array.isArray(child)
    ) {
      keys.push(
        ...flattenKeys(
          child,
          current
        )
      );
    } else {
      keys.push(current);
    }
  }

  return keys.sort();
}

const reference =
  flattenKeys(messages.fr);

for (const locale of [
  "fr",
  "en",
  "de",
  "it",
  "es"
]) {
  const keys =
    flattenKeys(
      messages[locale]
    );

  if (
    JSON.stringify(keys) !==
    JSON.stringify(reference)
  ) {
    throw new Error(
      `Structure différente dans ${locale}.json`
    );
  }

  const file =
    path.join(
      messagesDir,
      `${locale}.json`
    );

  fs.writeFileSync(
    file,
    JSON.stringify(
      messages[locale],
      null,
      2
    ) + "\n",
    "utf8"
  );

  console.log(
    `OK : messages/${locale}.json`
  );
}

console.log("");
console.log(
  `CYCLORIVA : 5 langues créées avec ${reference.length} clés identiques.`
);
