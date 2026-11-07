
/**
 * ============================================================
 * CYCLORIVA — TRADUCTIONS DE LA FICHE PRODUIT
 * ============================================================
 *
 * Next.js 16 — TypeScript
 *
 * Langues :
 * - Français
 * - Anglais
 * - Allemand
 * - Italien
 * - Espagnol
 *
 * Route :
 * /[locale]/produits/[id]
 *
 * Sections :
 * 1. Fil d'Ariane
 * 2. Galerie
 * 3. Résumé du produit
 * 4. Commandes
 * 5. Caractéristiques principales
 * 6. Services
 * 7. Onglets
 * 8. Spécifications
 * 9. Avis
 * 10. Carte aventure
 * 11. Produits similaires
 * 12. Navigation mobile
 *
 * Ce fichier :
 * - Ne contient aucun composant React
 * - Ne dépend pas du navigateur
 * - N'invente aucune donnée commerciale
 * - Ne modifie aucun fichier existant
 *
 * ============================================================
 */

// ============================================================
// 1. LANGUES OFFICIELLES
// ============================================================

export const PRODUCT_LOCALES = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const;

export type ProductLocale =
  (typeof PRODUCT_LOCALES)[number];

export const DEFAULT_PRODUCT_LOCALE: ProductLocale =
  "fr";

export function isProductLocale(
  value: unknown
): value is ProductLocale {
  return (
    typeof value === "string" &&
    PRODUCT_LOCALES.some(
      (locale) => locale === value
    )
  );
}

export function resolveProductLocale(
  value: string | null | undefined
): ProductLocale {
  if (!value) {
    return DEFAULT_PRODUCT_LOCALE;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];

  return isProductLocale(normalized)
    ? normalized
    : DEFAULT_PRODUCT_LOCALE;
}

// ============================================================
// 2. TYPES DU DICTIONNAIRE
// ============================================================

export type ProductTranslations = {
  common: {
    loading: string;
    unavailable: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    viewAll: string;
    readMore: string;
    readLess: string;
    yes: string;
    no: string;
    product: string;
    products: string;
    reference: string;
  };

  breadcrumb: {
    home: string;
    products: string;
    current: string;
    navigation: string;
  };

  gallery: {
    title: string;
    image: string;
    of: string;
    previous: string;
    next: string;
    zoom: string;
    close: string;
    showAll: string;
    showLess: string;
    moreImages: string;
    imageUnavailable: string;
    noImages: string;
    wishlist: string;
    wishlistUnavailable: string;
  };

  summary: {
    title: string;
    productDetails: string;
    price: string;
    previousPrice: string;
    priceUnavailable: string;
    descriptionUnavailable: string;
    inStock: string;
    outOfStock: string;
    stockUnknown: string;
    recordedStock: string;
    availability: string;
    review: string;
    reviews: string;
    bestseller: string;
    new: string;
    promotion: string;
    discount: string;
    sku: string;
  };

  order: {
    whatsappTitle: string;
    whatsappSubtitle: string;
    whatsappUnavailable: string;
    websiteTitle: string;
    websiteSubtitle: string;
    websiteUnavailable: string;
    processing: string;
    error: string;
    quantity: string;
    greeting: string;
    interest: string;
    product: string;
    reference: string;
    link: string;
    question: string;
    unavailableProduct: string;
  };

  highlights: {
    title: string;
    motor: string;
    battery: string;
    brakes: string;
    frame: string;
  };

  services: {
    title: string;
    delivery: string;
    payment: string;
    returns: string;
    support: string;
  };

  tabs: {
    title: string;
    description: string;
    specifications: string;
    shortSpecifications: string;
    reviews: string;
    deliveryReturns: string;
    benefits: string;
    noDescription: string;
    noSpecifications: string;
    noReviews: string;
    noDeliveryDetails: string;
  };

  specifications: {
    title: string;
    empty: string;
    brand: string;
    model: string;
    bikeType: string;
    motor: string;
    battery: string;
    range: string;
    frame: string;
    fork: string;
    brakes: string;
    transmission: string;
    wheels: string;
    tires: string;
    weight: string;
    maximumLoad: string;
    color: string;
    size: string;
    lighting: string;
    rack: string;
    mudguard: string;
    kickstand: string;
    dimensions: string;
    reference: string;
  };

  benefits: {
    title: string;
    genericTitle: string;
    empty: string;
  };

  reviews: {
    title: string;
    review: string;
    reviews: string;
    customerReviews: string;
    noReviews: string;
    rating: string;
    verified: string;
  };

  adventure: {
    title: string;
    imageAlt: string;
    linkLabel: string;
  };

  related: {
    title: string;
    viewProduct: string;
    empty: string;
    priceUnavailable: string;
    imageUnavailable: string;
  };

  mobileNavigation: {
    home: string;
    search: string;
    favorites: string;
    cart: string;
    navigation: string;
  };
};

// ============================================================
// 3. DICTIONNAIRES OFFICIELS
// ============================================================

export const productTranslations = {
  // ==========================================================
  // FRANÇAIS
  // ==========================================================

  fr: {
    common: {
      loading: "Chargement...",
      unavailable: "Indisponible",
      close: "Fermer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      viewAll: "Voir tout",
      readMore: "Lire la suite",
      readLess: "Voir moins",
      yes: "Oui",
      no: "Non",
      product: "produit",
      products: "produits",
      reference: "Référence",
    },

    breadcrumb: {
      home: "Accueil",
      products: "Tous les produits",
      current: "Détails du produit",
      navigation: "Fil d'Ariane",
    },

    gallery: {
      title: "Galerie du produit",
      image: "Image",
      of: "sur",
      previous: "Image précédente",
      next: "Image suivante",
      zoom: "Agrandir l'image",
      close: "Fermer l'image",
      showAll: "Voir toutes les images",
      showLess: "Réduire les miniatures",
      moreImages: "images supplémentaires",
      imageUnavailable: "Image indisponible",
      noImages: "Aucune image disponible",
      wishlist: "Ajouter aux favoris",
      wishlistUnavailable:
        "Les favoris ne sont pas encore disponibles",
    },

    summary: {
      title: "Présentation du produit",
      productDetails: "Informations sur le produit",
      price: "Prix actuel",
      previousPrice: "Ancien prix",
      priceUnavailable: "Prix à confirmer",
      descriptionUnavailable:
        "Description non renseignée",
      inStock: "En stock",
      outOfStock: "Stock épuisé",
      stockUnknown: "En stock",
      recordedStock: "Stock indiqué à l'importation",
      availability: "Disponibilité",
      review: "avis",
      reviews: "avis",
      bestseller: "Best-seller",
      new: "Nouveau",
      promotion: "Promotion",
      discount: "Réduction",
      sku: "Référence",
    },

    order: {
      whatsappTitle: "Commander sur WhatsApp",
      whatsappSubtitle: "Échangez avec notre équipe",
      whatsappUnavailable:
        "Le numéro WhatsApp n'est pas configuré",
      websiteTitle: "Commander sur le site",
      websiteSubtitle: "Poursuivre la commande",
      websiteUnavailable:
        "La commande sur le site n'est pas encore disponible",
      processing: "Traitement en cours...",
      error:
        "Impossible de poursuivre la commande. Veuillez réessayer.",
      quantity: "Quantité",
      greeting: "Bonjour CYCLORIVA,",
      interest:
        "Je souhaite commander ce produit.",
      product: "Produit",
      reference: "Référence",
      link: "Lien du produit",
      question:
        "Pouvez-vous confirmer la disponibilité et les modalités de commande ?",
      unavailableProduct:
        "Ce produit n'est pas disponible à la commande",
    },

    highlights: {
      title: "Caractéristiques principales",
      motor: "Moteur",
      battery: "Batterie",
      brakes: "Freins",
      frame: "Cadre",
    },

    services: {
      title: "Services CYCLORIVA",
      delivery: "Livraison",
      payment: "Paiement",
      returns: "Retours",
      support: "Service client",
    },

    tabs: {
      title: "Informations sur le produit",
      description: "Description",
      specifications: "Caractéristiques techniques",
      shortSpecifications: "Caractéristiques",
      reviews: "Avis clients",
      deliveryReturns: "Livraison & retour",
      benefits: "Pourquoi choisir ce vélo ?",
      noDescription:
        "Aucune description disponible pour ce produit.",
      noSpecifications:
        "Aucune caractéristique technique renseignée.",
      noReviews:
        "Aucun avis client publié disponible pour ce produit.",
      noDeliveryDetails:
        "Les modalités de livraison et de retour seront confirmées lors de la commande.",
    },

    specifications: {
      title: "Caractéristiques techniques",
      empty: "Aucune caractéristique disponible",
      brand: "Marque",
      model: "Modèle",
      bikeType: "Type de vélo",
      motor: "Moteur",
      battery: "Batterie",
      range: "Autonomie",
      frame: "Cadre",
      fork: "Fourche",
      brakes: "Freins",
      transmission: "Transmission",
      wheels: "Roues",
      tires: "Pneus",
      weight: "Poids",
      maximumLoad: "Charge maximale",
      color: "Couleurs",
      size: "Tailles",
      lighting: "Éclairage",
      rack: "Porte-bagages",
      mudguard: "Garde-boue",
      kickstand: "Béquille",
      dimensions: "Dimensions",
      reference: "Référence",
    },

    benefits: {
      title: "Pourquoi choisir ce vélo ?",
      genericTitle: "Pourquoi choisir ce produit ?",
      empty:
        "Les avantages de ce produit ne sont pas encore renseignés.",
    },

    reviews: {
      title: "Avis clients",
      review: "avis",
      reviews: "avis",
      customerReviews: "Avis des clients",
      noReviews: "Aucun avis publié",
      rating: "Note",
      verified: "Achat vérifié",
    },

    adventure: {
      title: "L'aventure commence ici",
      imageAlt:
        "Cyclistes dans un paysage de montagne",
      linkLabel:
        "Découvrir les produits CYCLORIVA",
    },

    related: {
      title: "Produits similaires",
      viewProduct: "Voir le produit",
      empty: "Aucun produit similaire disponible",
      priceUnavailable: "Prix à confirmer",
      imageUnavailable: "Image indisponible",
    },

    mobileNavigation: {
      home: "Accueil",
      search: "Recherche",
      favorites: "Favoris",
      cart: "Panier",
      navigation: "Navigation mobile",
    },
  },

  // ==========================================================
  // ANGLAIS
  // ==========================================================

  en: {
    common: {
      loading: "Loading...",
      unavailable: "Unavailable",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      viewAll: "View all",
      readMore: "Read more",
      readLess: "Show less",
      yes: "Yes",
      no: "No",
      product: "product",
      products: "products",
      reference: "Reference",
    },

    breadcrumb: {
      home: "Home",
      products: "All products",
      current: "Product details",
      navigation: "Breadcrumb",
    },

    gallery: {
      title: "Product gallery",
      image: "Image",
      of: "of",
      previous: "Previous image",
      next: "Next image",
      zoom: "Enlarge image",
      close: "Close image",
      showAll: "View all images",
      showLess: "Show fewer thumbnails",
      moreImages: "additional images",
      imageUnavailable: "Image unavailable",
      noImages: "No images available",
      wishlist: "Add to wishlist",
      wishlistUnavailable:
        "Wishlist is not available yet",
    },

    summary: {
      title: "Product overview",
      productDetails: "Product information",
      price: "Current price",
      previousPrice: "Previous price",
      priceUnavailable: "Price to be confirmed",
      descriptionUnavailable:
        "Description unavailable",
      inStock: "In stock",
      outOfStock: "Out of stock",
      stockUnknown: "In stock",
      recordedStock: "Stock recorded at import",
      availability: "Availability",
      review: "review",
      reviews: "reviews",
      bestseller: "Best seller",
      new: "New",
      promotion: "Sale",
      discount: "Discount",
      sku: "Reference",
    },

    order: {
      whatsappTitle: "Order via WhatsApp",
      whatsappSubtitle: "Chat with our team",
      whatsappUnavailable:
        "WhatsApp number is not configured",
      websiteTitle: "Order on the website",
      websiteSubtitle: "Continue your order",
      websiteUnavailable:
        "Website ordering is not available yet",
      processing: "Processing...",
      error:
        "Unable to continue your order. Please try again.",
      quantity: "Quantity",
      greeting: "Hello CYCLORIVA,",
      interest:
        "I would like to order this product.",
      product: "Product",
      reference: "Reference",
      link: "Product link",
      question:
        "Could you confirm its availability and ordering details?",
      unavailableProduct:
        "This product is not available to order",
    },

    highlights: {
      title: "Key features",
      motor: "Motor",
      battery: "Battery",
      brakes: "Brakes",
      frame: "Frame",
    },

    services: {
      title: "CYCLORIVA services",
      delivery: "Delivery",
      payment: "Payment",
      returns: "Returns",
      support: "Customer support",
    },

    tabs: {
      title: "Product information",
      description: "Description",
      specifications: "Technical specifications",
      shortSpecifications: "Specifications",
      reviews: "Customer reviews",
      deliveryReturns: "Delivery & returns",
      benefits: "Why choose this bike?",
      noDescription:
        "No description is available for this product.",
      noSpecifications:
        "No technical specifications are available.",
      noReviews:
        "No published customer reviews are available.",
      noDeliveryDetails:
        "Delivery and return details will be confirmed during ordering.",
    },

    specifications: {
      title: "Technical specifications",
      empty: "No specifications available",
      brand: "Brand",
      model: "Model",
      bikeType: "Bike type",
      motor: "Motor",
      battery: "Battery",
      range: "Range",
      frame: "Frame",
      fork: "Fork",
      brakes: "Brakes",
      transmission: "Transmission",
      wheels: "Wheels",
      tires: "Tires",
      weight: "Weight",
      maximumLoad: "Maximum load",
      color: "Colors",
      size: "Sizes",
      lighting: "Lighting",
      rack: "Luggage rack",
      mudguard: "Mudguard",
      kickstand: "Kickstand",
      dimensions: "Dimensions",
      reference: "Reference",
    },

    benefits: {
      title: "Why choose this bike?",
      genericTitle: "Why choose this product?",
      empty:
        "Product benefits have not been provided yet.",
    },

    reviews: {
      title: "Customer reviews",
      review: "review",
      reviews: "reviews",
      customerReviews: "Customer feedback",
      noReviews: "No published reviews",
      rating: "Rating",
      verified: "Verified purchase",
    },

    adventure: {
      title: "Your adventure starts here",
      imageAlt:
        "Cyclists in a mountain landscape",
      linkLabel:
        "Explore CYCLORIVA products",
    },

    related: {
      title: "Similar products",
      viewProduct: "View product",
      empty: "No similar products available",
      priceUnavailable: "Price to be confirmed",
      imageUnavailable: "Image unavailable",
    },

    mobileNavigation: {
      home: "Home",
      search: "Search",
      favorites: "Wishlist",
      cart: "Cart",
      navigation: "Mobile navigation",
    },
  },

  // ==========================================================
  // ALLEMAND
  // ==========================================================

  de: {
    common: {
      loading: "Wird geladen...",
      unavailable: "Nicht verfügbar",
      close: "Schließen",
      back: "Zurück",
      next: "Weiter",
      previous: "Zurück",
      viewAll: "Alle ansehen",
      readMore: "Mehr lesen",
      readLess: "Weniger anzeigen",
      yes: "Ja",
      no: "Nein",
      product: "Produkt",
      products: "Produkte",
      reference: "Artikelnummer",
    },

    breadcrumb: {
      home: "Startseite",
      products: "Alle Produkte",
      current: "Produktdetails",
      navigation: "Brotkrumennavigation",
    },

    gallery: {
      title: "Produktgalerie",
      image: "Bild",
      of: "von",
      previous: "Vorheriges Bild",
      next: "Nächstes Bild",
      zoom: "Bild vergrößern",
      close: "Bild schließen",
      showAll: "Alle Bilder anzeigen",
      showLess: "Weniger Bilder anzeigen",
      moreImages: "weitere Bilder",
      imageUnavailable: "Bild nicht verfügbar",
      noImages: "Keine Bilder verfügbar",
      wishlist: "Zur Merkliste hinzufügen",
      wishlistUnavailable:
        "Die Merkliste ist noch nicht verfügbar",
    },

    summary: {
      title: "Produktübersicht",
      productDetails: "Produktinformationen",
      price: "Aktueller Preis",
      previousPrice: "Vorheriger Preis",
      priceUnavailable: "Preis noch zu bestätigen",
      descriptionUnavailable:
        "Beschreibung nicht verfügbar",
      inStock: "Auf Lager",
      outOfStock: "Ausverkauft",
      stockUnknown:
        "Auf Lager",
      recordedStock: "Bestand beim Import erfasst",
      availability: "Verfügbarkeit",
      review: "Bewertung",
      reviews: "Bewertungen",
      bestseller: "Bestseller",
      new: "Neu",
      promotion: "Angebot",
      discount: "Rabatt",
      sku: "Artikelnummer",
    },

    order: {
      whatsappTitle: "Über WhatsApp bestellen",
      whatsappSubtitle: "Kontaktieren Sie unser Team",
      whatsappUnavailable:
        "WhatsApp-Nummer nicht eingerichtet",
      websiteTitle: "Auf der Website bestellen",
      websiteSubtitle: "Bestellung fortsetzen",
      websiteUnavailable:
        "Online-Bestellungen sind noch nicht verfügbar",
      processing: "Wird verarbeitet...",
      error:
        "Die Bestellung konnte nicht fortgesetzt werden. Bitte versuchen Sie es erneut.",
      quantity: "Menge",
      greeting: "Hallo CYCLORIVA,",
      interest:
        "Ich möchte dieses Produkt bestellen.",
      product: "Produkt",
      reference: "Artikelnummer",
      link: "Produktlink",
      question:
        "Können Sie die Verfügbarkeit und die Bestellbedingungen bestätigen?",
      unavailableProduct:
        "Dieses Produkt kann derzeit nicht bestellt werden",
    },

    highlights: {
      title: "Wichtigste Merkmale",
      motor: "Motor",
      battery: "Akku",
      brakes: "Bremsen",
      frame: "Rahmen",
    },

    services: {
      title: "CYCLORIVA Serviceleistungen",
      delivery: "Lieferung",
      payment: "Zahlung",
      returns: "Rückgabe",
      support: "Kundenservice",
    },

    tabs: {
      title: "Produktinformationen",
      description: "Beschreibung",
      specifications: "Technische Daten",
      shortSpecifications: "Technische Daten",
      reviews: "Kundenbewertungen",
      deliveryReturns: "Lieferung & Rückgabe",
      benefits: "Warum dieses Fahrrad wählen?",
      noDescription:
        "Keine Produktbeschreibung verfügbar.",
      noSpecifications:
        "Keine technischen Daten verfügbar.",
      noReviews:
        "Keine veröffentlichten Kundenbewertungen vorhanden.",
      noDeliveryDetails:
        "Liefer- und Rückgabebedingungen werden bei der Bestellung bestätigt.",
    },

    specifications: {
      title: "Technische Daten",
      empty: "Keine technischen Daten verfügbar",
      brand: "Marke",
      model: "Modell",
      bikeType: "Fahrradtyp",
      motor: "Motor",
      battery: "Akku",
      range: "Reichweite",
      frame: "Rahmen",
      fork: "Gabel",
      brakes: "Bremsen",
      transmission: "Schaltung",
      wheels: "Räder",
      tires: "Reifen",
      weight: "Gewicht",
      maximumLoad: "Maximale Belastung",
      color: "Farben",
      size: "Größen",
      lighting: "Beleuchtung",
      rack: "Gepäckträger",
      mudguard: "Schutzbleche",
      kickstand: "Ständer",
      dimensions: "Abmessungen",
      reference: "Artikelnummer",
    },

    benefits: {
      title: "Warum dieses Fahrrad wählen?",
      genericTitle: "Warum dieses Produkt wählen?",
      empty:
        "Die Vorteile dieses Produkts wurden noch nicht angegeben.",
    },

    reviews: {
      title: "Kundenbewertungen",
      review: "Bewertung",
      reviews: "Bewertungen",
      customerReviews: "Kundenmeinungen",
      noReviews: "Keine veröffentlichten Bewertungen",
      rating: "Bewertung",
      verified: "Verifizierter Kauf",
    },

    adventure: {
      title: "Dein Abenteuer beginnt hier",
      imageAlt:
        "Radfahrer in einer Berglandschaft",
      linkLabel:
        "CYCLORIVA Produkte entdecken",
    },

    related: {
      title: "Ähnliche Produkte",
      viewProduct: "Produkt ansehen",
      empty: "Keine ähnlichen Produkte verfügbar",
      priceUnavailable: "Preis noch zu bestätigen",
      imageUnavailable: "Bild nicht verfügbar",
    },

    mobileNavigation: {
      home: "Startseite",
      search: "Suche",
      favorites: "Merkliste",
      cart: "Warenkorb",
      navigation: "Mobile Navigation",
    },
  },

  // ==========================================================
  // ITALIEN
  // ==========================================================

  it: {
    common: {
      loading: "Caricamento...",
      unavailable: "Non disponibile",
      close: "Chiudi",
      back: "Indietro",
      next: "Avanti",
      previous: "Precedente",
      viewAll: "Vedi tutto",
      readMore: "Leggi di più",
      readLess: "Mostra meno",
      yes: "Sì",
      no: "No",
      product: "prodotto",
      products: "prodotti",
      reference: "Riferimento",
    },

    breadcrumb: {
      home: "Home",
      products: "Tutti i prodotti",
      current: "Dettagli prodotto",
      navigation: "Percorso di navigazione",
    },

    gallery: {
      title: "Galleria del prodotto",
      image: "Immagine",
      of: "di",
      previous: "Immagine precedente",
      next: "Immagine successiva",
      zoom: "Ingrandisci immagine",
      close: "Chiudi immagine",
      showAll: "Visualizza tutte le immagini",
      showLess: "Mostra meno miniature",
      moreImages: "immagini aggiuntive",
      imageUnavailable: "Immagine non disponibile",
      noImages: "Nessuna immagine disponibile",
      wishlist: "Aggiungi ai preferiti",
      wishlistUnavailable:
        "I preferiti non sono ancora disponibili",
    },

    summary: {
      title: "Panoramica del prodotto",
      productDetails: "Informazioni sul prodotto",
      price: "Prezzo attuale",
      previousPrice: "Prezzo precedente",
      priceUnavailable: "Prezzo da confermare",
      descriptionUnavailable:
        "Descrizione non disponibile",
      inStock: "Disponibile",
      outOfStock: "Esaurito",
      stockUnknown: "Disponibile",
      recordedStock: "Scorte registrate all'importazione",
      availability: "Disponibilità",
      review: "recensione",
      reviews: "recensioni",
      bestseller: "Più venduto",
      new: "Nuovo",
      promotion: "Promozione",
      discount: "Sconto",
      sku: "Riferimento",
    },

    order: {
      whatsappTitle: "Ordina su WhatsApp",
      whatsappSubtitle: "Parla con il nostro team",
      whatsappUnavailable:
        "Numero WhatsApp non configurato",
      websiteTitle: "Ordina sul sito",
      websiteSubtitle: "Continua l'ordine",
      websiteUnavailable:
        "Gli ordini sul sito non sono ancora disponibili",
      processing: "Elaborazione in corso...",
      error:
        "Impossibile continuare l'ordine. Riprova.",
      quantity: "Quantità",
      greeting: "Buongiorno CYCLORIVA,",
      interest:
        "Vorrei ordinare questo prodotto.",
      product: "Prodotto",
      reference: "Riferimento",
      link: "Link del prodotto",
      question:
        "Potete confermare la disponibilità e le modalità di ordine?",
      unavailableProduct:
        "Questo prodotto non è disponibile per l'ordine",
    },

    highlights: {
      title: "Caratteristiche principali",
      motor: "Motore",
      battery: "Batteria",
      brakes: "Freni",
      frame: "Telaio",
    },

    services: {
      title: "Servizi CYCLORIVA",
      delivery: "Consegna",
      payment: "Pagamento",
      returns: "Resi",
      support: "Assistenza clienti",
    },

    tabs: {
      title: "Informazioni sul prodotto",
      description: "Descrizione",
      specifications: "Caratteristiche tecniche",
      shortSpecifications: "Caratteristiche",
      reviews: "Recensioni",
      deliveryReturns: "Consegna e resi",
      benefits: "Perché scegliere questa bici?",
      noDescription:
        "Nessuna descrizione disponibile per questo prodotto.",
      noSpecifications:
        "Nessuna caratteristica tecnica disponibile.",
      noReviews:
        "Non sono disponibili recensioni pubblicate.",
      noDeliveryDetails:
        "Le condizioni di consegna e reso saranno confermate durante l'ordine.",
    },

    specifications: {
      title: "Caratteristiche tecniche",
      empty: "Nessuna caratteristica disponibile",
      brand: "Marca",
      model: "Modello",
      bikeType: "Tipo di bicicletta",
      motor: "Motore",
      battery: "Batteria",
      range: "Autonomia",
      frame: "Telaio",
      fork: "Forcella",
      brakes: "Freni",
      transmission: "Trasmissione",
      wheels: "Ruote",
      tires: "Pneumatici",
      weight: "Peso",
      maximumLoad: "Carico massimo",
      color: "Colori",
      size: "Taglie",
      lighting: "Illuminazione",
      rack: "Portapacchi",
      mudguard: "Parafanghi",
      kickstand: "Cavalletto",
      dimensions: "Dimensioni",
      reference: "Riferimento",
    },

    benefits: {
      title: "Perché scegliere questa bici?",
      genericTitle:
        "Perché scegliere questo prodotto?",
      empty:
        "I vantaggi di questo prodotto non sono ancora disponibili.",
    },

    reviews: {
      title: "Recensioni",
      review: "recensione",
      reviews: "recensioni",
      customerReviews: "Opinioni dei clienti",
      noReviews: "Nessuna recensione pubblicata",
      rating: "Valutazione",
      verified: "Acquisto verificato",
    },

    adventure: {
      title: "La tua avventura inizia qui",
      imageAlt:
        "Ciclisti in un paesaggio di montagna",
      linkLabel:
        "Scopri i prodotti CYCLORIVA",
    },

    related: {
      title: "Prodotti simili",
      viewProduct: "Vedi prodotto",
      empty: "Nessun prodotto simile disponibile",
      priceUnavailable: "Prezzo da confermare",
      imageUnavailable: "Immagine non disponibile",
    },

    mobileNavigation: {
      home: "Home",
      search: "Cerca",
      favorites: "Preferiti",
      cart: "Carrello",
      navigation: "Navigazione mobile",
    },
  },

  // ==========================================================
  // ESPAGNOL
  // ==========================================================

  es: {
    common: {
      loading: "Cargando...",
      unavailable: "No disponible",
      close: "Cerrar",
      back: "Volver",
      next: "Siguiente",
      previous: "Anterior",
      viewAll: "Ver todo",
      readMore: "Leer más",
      readLess: "Ver menos",
      yes: "Sí",
      no: "No",
      product: "producto",
      products: "productos",
      reference: "Referencia",
    },

    breadcrumb: {
      home: "Inicio",
      products: "Todos los productos",
      current: "Detalles del producto",
      navigation: "Ruta de navegación",
    },

    gallery: {
      title: "Galería del producto",
      image: "Imagen",
      of: "de",
      previous: "Imagen anterior",
      next: "Imagen siguiente",
      zoom: "Ampliar imagen",
      close: "Cerrar imagen",
      showAll: "Ver todas las imágenes",
      showLess: "Mostrar menos miniaturas",
      moreImages: "imágenes adicionales",
      imageUnavailable: "Imagen no disponible",
      noImages: "No hay imágenes disponibles",
      wishlist: "Añadir a favoritos",
      wishlistUnavailable:
        "Los favoritos aún no están disponibles",
    },

    summary: {
      title: "Resumen del producto",
      productDetails: "Información del producto",
      price: "Precio actual",
      previousPrice: "Precio anterior",
      priceUnavailable: "Precio por confirmar",
      descriptionUnavailable:
        "Descripción no disponible",
      inStock: "En stock",
      outOfStock: "Agotado",
      stockUnknown: "En stock",
      recordedStock: "Existencias registradas al importar",
      availability: "Disponibilidad",
      review: "opinión",
      reviews: "opiniones",
      bestseller: "Más vendido",
      new: "Nuevo",
      promotion: "Oferta",
      discount: "Descuento",
      sku: "Referencia",
    },

    order: {
      whatsappTitle: "Pedir por WhatsApp",
      whatsappSubtitle: "Habla con nuestro equipo",
      whatsappUnavailable:
        "Número de WhatsApp no configurado",
      websiteTitle: "Pedir en el sitio web",
      websiteSubtitle: "Continuar el pedido",
      websiteUnavailable:
        "Los pedidos en el sitio web aún no están disponibles",
      processing: "Procesando...",
      error:
        "No se puede continuar el pedido. Inténtalo de nuevo.",
      quantity: "Cantidad",
      greeting: "Hola CYCLORIVA,",
      interest:
        "Quiero pedir este producto.",
      product: "Producto",
      reference: "Referencia",
      link: "Enlace del producto",
      question:
        "¿Pueden confirmar la disponibilidad y las condiciones del pedido?",
      unavailableProduct:
        "Este producto no está disponible para pedidos",
    },

    highlights: {
      title: "Características principales",
      motor: "Motor",
      battery: "Batería",
      brakes: "Frenos",
      frame: "Cuadro",
    },

    services: {
      title: "Servicios CYCLORIVA",
      delivery: "Entrega",
      payment: "Pago",
      returns: "Devoluciones",
      support: "Atención al cliente",
    },

    tabs: {
      title: "Información del producto",
      description: "Descripción",
      specifications: "Características técnicas",
      shortSpecifications: "Características",
      reviews: "Opiniones",
      deliveryReturns: "Envíos y devoluciones",
      benefits: "¿Por qué elegir esta bicicleta?",
      noDescription:
        "No hay descripción disponible para este producto.",
      noSpecifications:
        "No hay características técnicas disponibles.",
      noReviews:
        "No hay opiniones publicadas disponibles.",
      noDeliveryDetails:
        "Las condiciones de envío y devolución se confirmarán durante el pedido.",
    },

    specifications: {
      title: "Características técnicas",
      empty: "No hay características disponibles",
      brand: "Marca",
      model: "Modelo",
      bikeType: "Tipo de bicicleta",
      motor: "Motor",
      battery: "Batería",
      range: "Autonomía",
      frame: "Cuadro",
      fork: "Horquilla",
      brakes: "Frenos",
      transmission: "Transmisión",
      wheels: "Ruedas",
      tires: "Neumáticos",
      weight: "Peso",
      maximumLoad: "Carga máxima",
      color: "Colores",
      size: "Tallas",
      lighting: "Iluminación",
      rack: "Portaequipajes",
      mudguard: "Guardabarros",
      kickstand: "Pata de cabra",
      dimensions: "Dimensiones",
      reference: "Referencia",
    },

    benefits: {
      title: "¿Por qué elegir esta bicicleta?",
      genericTitle:
        "¿Por qué elegir este producto?",
      empty:
        "Los beneficios de este producto aún no están disponibles.",
    },

    reviews: {
      title: "Opiniones",
      review: "opinión",
      reviews: "opiniones",
      customerReviews: "Opiniones de los clientes",
      noReviews: "No hay opiniones publicadas",
      rating: "Valoración",
      verified: "Compra verificada",
    },

    adventure: {
      title: "Tu aventura comienza aquí",
      imageAlt:
        "Ciclistas en un paisaje de montaña",
      linkLabel:
        "Descubre los productos CYCLORIVA",
    },

    related: {
      title: "Productos similares",
      viewProduct: "Ver producto",
      empty: "No hay productos similares disponibles",
      priceUnavailable: "Precio por confirmar",
      imageUnavailable: "Imagen no disponible",
    },

    mobileNavigation: {
      home: "Inicio",
      search: "Buscar",
      favorites: "Favoritos",
      cart: "Carrito",
      navigation: "Navegación móvil",
    },
  },
} satisfies Record<ProductLocale, ProductTranslations>;

// ============================================================
// 4. OBTENIR LE DICTIONNAIRE COMPLET
// ============================================================

/**
 * Exemple :
 *
 * const t = getProductTranslations("fr");
 *
 * t.summary.price
 * t.order.whatsappTitle
 * t.tabs.specifications
 */
export function getProductTranslations(
  locale: string | null | undefined
): ProductTranslations {
  const language = resolveProductLocale(locale);

  return productTranslations[language];
}

// ============================================================
// 5. OBTENIR UNE SECTION
// ============================================================

export function getProductSection<
  Section extends keyof ProductTranslations
>(
  locale: string | null | undefined,
  section: Section
): ProductTranslations[Section] {
  return getProductTranslations(locale)[section];
}

// ============================================================
// 6. OBTENIR UN TEXTE PRÉCIS
// ============================================================

/**
 * Exemple :
 *
 * productText("fr", "order", "whatsappTitle");
 *
 * productText("de", "related", "title");
 *
 * productText("es", "tabs", "description");
 */
export function productText<
  Section extends keyof ProductTranslations,
  Key extends keyof ProductTranslations[Section]
>(
  locale: string | null | undefined,
  section: Section,
  key: Key
): ProductTranslations[Section][Key] {
  return getProductTranslations(locale)[section][key];
}

// ============================================================
// 7. FORMATAGE DES NOMBRES
// ============================================================

export const PRODUCT_NUMBER_LOCALES: Record<
  ProductLocale,
  string
> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

export function formatProductNumber(
  value: number,
  locale: string | null | undefined
): string {
  const language = resolveProductLocale(locale);

  const safeValue = Number.isFinite(value)
    ? value
    : 0;

  return new Intl.NumberFormat(
    PRODUCT_NUMBER_LOCALES[language]
  ).format(safeValue);
}

// ============================================================
// 8. FORMATAGE DES PRIX
// ============================================================

/**
 * Tous les prix sont exprimés en euros.
 *
 * Aucun prix n'est créé automatiquement.
 *
 * Valeurs absentes ou invalides :
 * "Prix à confirmer" traduit.
 */
export function formatProductCurrency(
  amount: number | null | undefined,
  locale: string | null | undefined
): string {
  const language = resolveProductLocale(locale);

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    return productTranslations[language]
      .summary.priceUnavailable;
  }

  return new Intl.NumberFormat(
    PRODUCT_NUMBER_LOCALES[language],
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(amount);
}

// ============================================================
// 9. FORMATAGE DES NOTES CLIENTS
// ============================================================

export function formatProductRating(
  rating: number | null | undefined,
  locale: string | null | undefined
): string | null {
  if (
    typeof rating !== "number" ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5
  ) {
    return null;
  }

  const language = resolveProductLocale(locale);

  return new Intl.NumberFormat(
    PRODUCT_NUMBER_LOCALES[language],
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  ).format(rating);
}

// ============================================================
// 10. FORMATAGE DU NOMBRE D'AVIS
// ============================================================

export function formatProductReviewCount(
  count: number,
  locale: string | null | undefined
): string | null {
  if (
    !Number.isSafeInteger(count) ||
    count < 0
  ) {
    return null;
  }

  const t = getProductTranslations(locale);

  const label =
    count === 1
      ? t.reviews.review
      : t.reviews.reviews;

  return `${formatProductNumber(
    count,
    locale
  )} ${label}`;
}

// ============================================================
// 11. URL DU PRODUIT
// ============================================================

/**
 * Crée l'URL localisée d'un produit.
 *
 * Exemple :
 * productDetailPath("fr", 123)
 * -> /fr/produits/123
 *
 * Utiliser uniquement un identifiant issu
 * du véritable catalogue.
 */
export function productDetailPath(
  locale: string | null | undefined,
  productId: string | number
): string {
  const language = resolveProductLocale(locale);

  const id = String(productId).trim();

  if (!id) {
    return `/${language}/produits`;
  }

  return (
    `/${language}/produits/` +
    encodeURIComponent(id)
  );
}

// ============================================================
// 12. URL DU CATALOGUE
// ============================================================

export function productCatalogPath(
  locale: string | null | undefined
): string {
  const language = resolveProductLocale(locale);

  return `/${language}/produits`;
}

// ============================================================
// 13. URL DE L'ACCUEIL
// ============================================================

export function productHomePath(
  locale: string | null | undefined
): string {
  const language = resolveProductLocale(locale);

  return `/${language}`;
}

// ============================================================
// 14. MESSAGE WHATSAPP MULTILINGUE
// ============================================================

export type ProductWhatsAppMessageData = {
  name: string;
  sku?: string | null;
  url?: string | null;
  quantity?: number;
  unitPrice?: number | null;
};

/**
 * Prépare uniquement le texte.
 *
 * La construction du lien wa.me et
 * la validation du numéro sont assurées
 * par le module de commande.
 */
export function buildProductWhatsAppMessage(
  locale: string | null | undefined,
  data: ProductWhatsAppMessageData
): string {
  const t = getProductTranslations(locale).order;

  const name = String(data.name ?? "")
    .replace(/\s+/g, " ")
    .trim();

  const sku =
    typeof data.sku === "string"
      ? data.sku.trim()
      : "";

  const url =
    typeof data.url === "string"
      ? data.url.trim()
      : "";

  const lines: string[] = [
    t.greeting,
    "",
    t.interest,
  ];

  if (name) {
    lines.push(
      "",
      `${t.product} : ${name}`
    );
  }

  if (sku) {
    lines.push(
      `${t.reference} : ${sku}`
    );
  }

  if (url) {
    lines.push(
      `${t.link} : ${url}`
    );
  }

  const quantity = data.quantity ?? 1;
  lines.push(`${t.quantity} : ${quantity}`);
  if (data.unitPrice != null && Number.isFinite(data.unitPrice) && data.unitPrice >= 0) {
    const labels = productCommerceTexts[resolveProductLocale(locale)];
    const lineTotal = Math.round(data.unitPrice * 100) * quantity / 100;
    lines.push(`${labels.unitPrice} : ${formatProductCurrency(data.unitPrice, locale)}`);
    lines.push(`${labels.lineTotal} : ${formatProductCurrency(lineTotal, locale)}`);
    lines.push(`${labels.total} : ${formatProductCurrency(lineTotal, locale)}`);
  }

  lines.push(
    "",
    t.question
  );

  return lines.join("\n");
}

// ============================================================
// 15. EXPORT PAR DÉFAUT
// ============================================================

export default getProductTranslations;

export const productCommerceTexts = {
  fr: { cart: "Panier", empty: "Votre panier est vide.", remove: "Retirer", unitPrice: "Prix unitaire", lineTotal: "Total du produit", total: "Total des produits", pending: "Demande de commande : disponibilité, livraison et montant final à confirmer avec notre équipe. Aucun paiement n’est effectué sur cette page.", continue: "Continuer mes achats", source: "Contenu produit affiché dans la langue source : traduction complète indisponible.", storage: "Impossible d’enregistrer le panier dans ce navigateur." },
  en: { cart: "Cart", empty: "Your cart is empty.", remove: "Remove", unitPrice: "Unit price", lineTotal: "Item total", total: "Product total", pending: "Order request: availability, delivery and final amount must be confirmed with our team. No payment is taken on this page.", continue: "Continue shopping", source: "Product content is shown in its source language: a complete translation is unavailable.", storage: "The cart could not be saved in this browser." },
  de: { cart: "Warenkorb", empty: "Ihr Warenkorb ist leer.", remove: "Entfernen", unitPrice: "Stückpreis", lineTotal: "Artikelsumme", total: "Warensumme", pending: "Bestellanfrage: Verfügbarkeit, Lieferung und Endbetrag müssen von unserem Team bestätigt werden. Auf dieser Seite erfolgt keine Zahlung.", continue: "Weiter einkaufen", source: "Produktinhalt in der Ausgangssprache: eine vollständige Übersetzung ist nicht verfügbar.", storage: "Der Warenkorb konnte in diesem Browser nicht gespeichert werden." },
  it: { cart: "Carrello", empty: "Il carrello è vuoto.", remove: "Rimuovi", unitPrice: "Prezzo unitario", lineTotal: "Totale prodotto", total: "Totale prodotti", pending: "Richiesta d’ordine: disponibilità, consegna e importo finale da confermare con il nostro team. Nessun pagamento su questa pagina.", continue: "Continua gli acquisti", source: "Contenuto prodotto nella lingua originale: traduzione completa non disponibile.", storage: "Impossibile salvare il carrello in questo browser." },
  es: { cart: "Carrito", empty: "Tu carrito está vacío.", remove: "Eliminar", unitPrice: "Precio unitario", lineTotal: "Total del producto", total: "Total de los productos", pending: "Solicitud de pedido: disponibilidad, entrega e importe final por confirmar con nuestro equipo. No se realiza ningún pago en esta página.", continue: "Seguir comprando", source: "Contenido del producto en su idioma original: traducción completa no disponible.", storage: "No se ha podido guardar el carrito en este navegador." },
} as const;

// ============================================================
// FIN — CYCLORIVA PRODUCT I18N
// ============================================================
