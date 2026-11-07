
/**
 * =========================================================
 * CYCLORIVA — TRADUCTIONS DE LA PAGE D'ACCUEIL
 * =========================================================
 *
 * Langues :
 * FR — Français
 * EN — Anglais
 * DE — Allemand
 * IT — Italien
 * ES — Espagnol
 *
 * Sections :
 * - Couverture principale
 * - Catégories
 * - Produits phares
 * - Services
 * - Pourquoi choisir CYCLORIVA
 * - Nouveautés
 * - Avis clients
 * - Newsletter
 *
 * Compatible Next.js 16 et TypeScript.
 *
 * Aucun fichier existant n'est modifié.
 * =========================================================
 */

import {
  resolveLocale,
  type SiteLocale,
} from "@/lib/site-i18n";

// =========================================================
// 1. TYPES ET CONFIGURATION
// =========================================================

export type HomeLocale = SiteLocale;

export const homeLocales = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const;

export const defaultHomeLocale: HomeLocale = "fr";

export type HomeCategoryKey =
  | "electric"
  | "mtb"
  | "cargo"
  | "city"
  | "accessories";

export type HomeServiceKey =
  | "delivery"
  | "payment"
  | "returns"
  | "warranty"
  | "support";

export type HomeBenefitKey =
  | "mobility"
  | "selection"
  | "expert"
  | "europe";

export type HomeTextGroup = {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleHighlight: string;
    description: string;
    secondaryDescription: string;
    discover: string;
    viewCategories: string;
    performance: string;
    reliable: string;
    durable: string;
    slide: string;
  };

  categories: {
    heading: string;
    electric: string;
    mtb: string;
    cargo: string;
    city: string;
    accessories: string;
    imageMissing: string;
  };

  products: {
    featured: string;
    new: string;
    viewAll: string;
    viewNew: string;
    viewProduct: string;
    priceMissing: string;
    imageMissing: string;
    availability: string;
    translation: string;
    empty: string;
    promotion: string;
    bestSeller: string;
    newBadge: string;
    favorite: string;
    cart: string;
  };

  services: Record<
    HomeServiceKey,
    {
      title: string;
      description: string;
    }
  >;

  whyChoose: {
    heading: string;
    imageAlt: string;
    benefits: Record<
      HomeBenefitKey,
      {
        title: string;
        description: string;
      }
    >;
  };

  reviews: {
    heading: string;
    emptyTitle: string;
    emptyDescription: string;
    verified: string;
    previous: string;
    next: string;
    showReview: string;
    rating: string;
  };

  newsletter: {
    heading: string;
    description: string;
    email: string;
    subscribe: string;
    emailRequired: string;
    emailInvalid: string;
    servicePending: string;
    accessibleTitle: string;
  };

  common: {
    viewAll: string;
    loading: string;
    unavailable: string;
    seeMore: string;
  };
};

// =========================================================
// 2. DICTIONNAIRE OFFICIEL
// =========================================================

const homeTranslations = {
  // =======================================================
  // FRANÇAIS
  // =======================================================

  fr: {
    hero: {
      eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
      titleLine1: "Découvrez une nouvelle",
      titleLine2: "liberté de",
      titleHighlight: "mobilité",
      description:
        "Vélos électriques, VTT, vélos cargo et vélos de ville.",
      secondaryDescription:
        "Découvrez notre sélection de vélos et accessoires pour vos déplacements.",
      discover: "Découvrir les vélos électriques",
      viewCategories: "Voir toutes les catégories",
      performance: "Performants",
      reliable: "Fiables",
      durable: "Plus durables",
      slide: "Diapositive",
    },

    categories: {
      heading: "Nos catégories",
      electric: "Vélos électriques",
      mtb: "VTT",
      cargo: "Vélos cargo",
      city: "Vélos de ville",
      accessories: "Accessoires",
      imageMissing: "Image indisponible",
    },

    products: {
      featured: "Produits phares",
      new: "Nouveautés",
      viewAll: "Voir tous les produits",
      viewNew: "Voir toutes les nouveautés",
      viewProduct: "Voir le produit",
      priceMissing: "Prix à confirmer",
      imageMissing: "Image indisponible",
      availability: "En stock",
      translation: "Traduction en préparation",
      empty: "Aucun produit à afficher pour le moment.",
      promotion: "Promotion",
      bestSeller: "Meilleure vente",
      newBadge: "Nouveau",
      favorite: "Ajouter aux favoris",
      cart: "Panier",
    },

    services: {
      delivery: {
        title: "Livraison en Europe",
        description: "Délais selon la destination",
      },
      payment: {
        title: "Paiement sécurisé",
        description: "Selon les moyens activés",
      },
      returns: {
        title: "Retours et remboursements",
        description: "Selon nos conditions",
      },
      warranty: {
        title: "Garantie des produits",
        description: "Selon le fabricant",
      },
      support: {
        title: "Service client",
        description: "Assistance CYCLORIVA",
      },
    },

    whyChoose: {
      heading: "Pourquoi choisir CYCLORIVA ?",
      imageAlt:
        "Deux cyclistes profitant d'une sortie à vélo",
      benefits: {
        mobility: {
          title: "Mobilité durable",
          description:
            "Des solutions de mobilité pour vos déplacements quotidiens.",
        },
        selection: {
          title: "Sélection de vélos",
          description:
            "Découvrez nos vélos et accessoires pour différents usages.",
        },
        expert: {
          title: "Un accompagnement",
          description:
            "Des informations pour vous aider à choisir votre vélo.",
        },
        europe: {
          title: "Présence en Europe",
          description:
            "Une boutique destinée aux cyclistes de plusieurs pays européens.",
        },
      },
    },

    reviews: {
      heading: "Ce que nos clients disent de nous",
      emptyTitle: "Vos avis comptent",
      emptyDescription:
        "Les avis de nos clients seront publiés ici après leur collecte et leur vérification.",
      verified: "Client vérifié",
      previous: "Avis précédent",
      next: "Avis suivant",
      showReview: "Afficher l'avis",
      rating: "Note",
    },

    newsletter: {
      heading: "Restez informé !",
      description:
        "Recevez nos nouveautés, offres exclusives et conseils vélo directement par e-mail.",
      email: "Votre adresse e-mail",
      subscribe: "S'inscrire",
      emailRequired:
        "Veuillez saisir votre adresse e-mail.",
      emailInvalid:
        "Veuillez saisir une adresse e-mail valide.",
      servicePending:
        "L'inscription sera disponible après la connexion du service e-mail.",
      accessibleTitle:
        "Inscription à la newsletter CYCLORIVA",
    },

    common: {
      viewAll: "Voir tout",
      loading: "Chargement...",
      unavailable: "Indisponible",
      seeMore: "En savoir plus",
    },
  },

  // =======================================================
  // ANGLAIS
  // =======================================================

  en: {
    hero: {
      eyebrow: "BIKES & E-MOBILITY IN EUROPE",
      titleLine1: "Discover a new",
      titleLine2: "freedom of",
      titleHighlight: "mobility",
      description:
        "Electric bikes, mountain bikes, cargo bikes and city bikes.",
      secondaryDescription:
        "Explore our selection of bicycles and accessories for your journeys.",
      discover: "Discover electric bikes",
      viewCategories: "Browse all categories",
      performance: "High performance",
      reliable: "Reliable",
      durable: "More sustainable",
      slide: "Slide",
    },

    categories: {
      heading: "Our categories",
      electric: "Electric bikes",
      mtb: "Mountain bikes",
      cargo: "Cargo bikes",
      city: "City bikes",
      accessories: "Accessories",
      imageMissing: "Image unavailable",
    },

    products: {
      featured: "Featured products",
      new: "New arrivals",
      viewAll: "View all products",
      viewNew: "View all new arrivals",
      viewProduct: "View product",
      priceMissing: "Price to be confirmed",
      imageMissing: "Image unavailable",
      availability: "In stock",
      translation: "Translation in progress",
      empty: "No products to display at the moment.",
      promotion: "Sale",
      bestSeller: "Best seller",
      newBadge: "New",
      favorite: "Add to wishlist",
      cart: "Cart",
    },

    services: {
      delivery: {
        title: "Delivery in Europe",
        description: "Times vary by destination",
      },
      payment: {
        title: "Secure payment",
        description: "Subject to enabled methods",
      },
      returns: {
        title: "Returns and refunds",
        description: "Subject to our policy",
      },
      warranty: {
        title: "Product warranty",
        description: "Depending on manufacturer",
      },
      support: {
        title: "Customer service",
        description: "CYCLORIVA assistance",
      },
    },

    whyChoose: {
      heading: "Why choose CYCLORIVA?",
      imageAlt: "Two cyclists enjoying a bike ride",
      benefits: {
        mobility: {
          title: "Sustainable mobility",
          description:
            "Mobility solutions for your everyday journeys.",
        },
        selection: {
          title: "Bike selection",
          description:
            "Explore bikes and accessories for different uses.",
        },
        expert: {
          title: "Helpful guidance",
          description:
            "Information to help you choose your bicycle.",
        },
        europe: {
          title: "Across Europe",
          description:
            "A shop designed for cyclists in several European countries.",
        },
      },
    },

    reviews: {
      heading: "What our customers say about us",
      emptyTitle: "Your feedback matters",
      emptyDescription:
        "Customer reviews will appear here once they have been collected and verified.",
      verified: "Verified customer",
      previous: "Previous review",
      next: "Next review",
      showReview: "Show review",
      rating: "Rating",
    },

    newsletter: {
      heading: "Stay informed!",
      description:
        "Get product news, exclusive offers and cycling tips by email.",
      email: "Your email address",
      subscribe: "Subscribe",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      servicePending:
        "Subscription will be available once the email service is connected.",
      accessibleTitle:
        "CYCLORIVA newsletter subscription",
    },

    common: {
      viewAll: "View all",
      loading: "Loading...",
      unavailable: "Unavailable",
      seeMore: "Learn more",
    },
  },

  // =======================================================
  // ALLEMAND
  // =======================================================

  de: {
    hero: {
      eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
      titleLine1: "Entdecken Sie eine neue",
      titleLine2: "Freiheit der",
      titleHighlight: "Mobilität",
      description:
        "E-Bikes, Mountainbikes, Lastenräder und Citybikes.",
      secondaryDescription:
        "Entdecken Sie unsere Auswahl an Fahrrädern und Zubehör.",
      discover: "E-Bikes entdecken",
      viewCategories: "Alle Kategorien ansehen",
      performance: "Leistungsstark",
      reliable: "Zuverlässig",
      durable: "Nachhaltiger",
      slide: "Folie",
    },

    categories: {
      heading: "Unsere Kategorien",
      electric: "E-Bikes",
      mtb: "Mountainbikes",
      cargo: "Lastenräder",
      city: "Citybikes",
      accessories: "Zubehör",
      imageMissing: "Bild nicht verfügbar",
    },

    products: {
      featured: "Ausgewählte Produkte",
      new: "Neuheiten",
      viewAll: "Alle Produkte ansehen",
      viewNew: "Alle Neuheiten ansehen",
      viewProduct: "Produkt ansehen",
      priceMissing: "Preis noch zu bestätigen",
      imageMissing: "Bild nicht verfügbar",
      availability: "Auf Lager",
      translation: "Übersetzung in Vorbereitung",
      empty: "Derzeit keine Produkte zum Anzeigen.",
      promotion: "Angebot",
      bestSeller: "Bestseller",
      newBadge: "Neu",
      favorite: "Zur Merkliste hinzufügen",
      cart: "Warenkorb",
    },

    services: {
      delivery: {
        title: "Lieferung in Europa",
        description: "Je nach Lieferziel",
      },
      payment: {
        title: "Sichere Zahlung",
        description: "Je nach aktivierter Zahlungsart",
      },
      returns: {
        title: "Rückgabe und Erstattung",
        description: "Gemäß unseren Bedingungen",
      },
      warranty: {
        title: "Produktgarantie",
        description: "Je nach Hersteller",
      },
      support: {
        title: "Kundenservice",
        description: "CYCLORIVA Unterstützung",
      },
    },

    whyChoose: {
      heading: "Warum CYCLORIVA wählen?",
      imageAlt:
        "Zwei Radfahrer bei einer gemeinsamen Fahrradtour",
      benefits: {
        mobility: {
          title: "Nachhaltige Mobilität",
          description:
            "Mobilitätslösungen für Ihre täglichen Wege.",
        },
        selection: {
          title: "Fahrradauswahl",
          description:
            "Entdecken Sie Fahrräder und Zubehör für verschiedene Einsatzzwecke.",
        },
        expert: {
          title: "Hilfreiche Beratung",
          description:
            "Informationen, die Ihnen bei der Wahl Ihres Fahrrads helfen.",
        },
        europe: {
          title: "In Europa",
          description:
            "Ein Shop für Radfahrer in mehreren europäischen Ländern.",
        },
      },
    },

    reviews: {
      heading: "Das sagen unsere Kunden über uns",
      emptyTitle: "Ihre Meinung zählt",
      emptyDescription:
        "Kundenbewertungen erscheinen hier, sobald sie gesammelt und geprüft wurden.",
      verified: "Verifizierter Kunde",
      previous: "Vorherige Bewertung",
      next: "Nächste Bewertung",
      showReview: "Bewertung anzeigen",
      rating: "Bewertung",
    },

    newsletter: {
      heading: "Bleiben Sie informiert!",
      description:
        "Neuheiten, exklusive Angebote und Fahrradtipps per E-Mail.",
      email: "Ihre E-Mail-Adresse",
      subscribe: "Abonnieren",
      emailRequired:
        "Bitte geben Sie Ihre E-Mail-Adresse ein.",
      emailInvalid:
        "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      servicePending:
        "Die Anmeldung ist verfügbar, sobald der E-Mail-Dienst eingerichtet ist.",
      accessibleTitle:
        "CYCLORIVA Newsletter-Anmeldung",
    },

    common: {
      viewAll: "Alle ansehen",
      loading: "Wird geladen...",
      unavailable: "Nicht verfügbar",
      seeMore: "Mehr erfahren",
    },
  },

  // =======================================================
  // ITALIEN
  // =======================================================

  it: {
    hero: {
      eyebrow: "BICICLETTE & MOBILITÀ ELETTRICA IN EUROPA",
      titleLine1: "Scopri una nuova",
      titleLine2: "libertà di",
      titleHighlight: "mobilità",
      description:
        "Bici elettriche, mountain bike, bici cargo e bici da città.",
      secondaryDescription:
        "Esplora la nostra selezione di biciclette e accessori.",
      discover: "Scopri le bici elettriche",
      viewCategories: "Vedi tutte le categorie",
      performance: "Performanti",
      reliable: "Affidabili",
      durable: "Più sostenibili",
      slide: "Diapositiva",
    },

    categories: {
      heading: "Le nostre categorie",
      electric: "Bici elettriche",
      mtb: "Mountain bike",
      cargo: "Bici cargo",
      city: "Bici da città",
      accessories: "Accessori",
      imageMissing: "Immagine non disponibile",
    },

    products: {
      featured: "Prodotti in evidenza",
      new: "Novità",
      viewAll: "Vedi tutti i prodotti",
      viewNew: "Vedi tutte le novità",
      viewProduct: "Vedi prodotto",
      priceMissing: "Prezzo da confermare",
      imageMissing: "Immagine non disponibile",
      availability: "Disponibile",
      translation: "Traduzione in preparazione",
      empty: "Nessun prodotto da visualizzare.",
      promotion: "Promozione",
      bestSeller: "Più venduto",
      newBadge: "Nuovo",
      favorite: "Aggiungi ai preferiti",
      cart: "Carrello",
    },

    services: {
      delivery: {
        title: "Consegna in Europa",
        description: "Tempi secondo la destinazione",
      },
      payment: {
        title: "Pagamento sicuro",
        description: "Secondo i metodi attivati",
      },
      returns: {
        title: "Resi e rimborsi",
        description: "Secondo le nostre condizioni",
      },
      warranty: {
        title: "Garanzia prodotti",
        description: "Secondo il produttore",
      },
      support: {
        title: "Servizio clienti",
        description: "Assistenza CYCLORIVA",
      },
    },

    whyChoose: {
      heading: "Perché scegliere CYCLORIVA?",
      imageAlt:
        "Due ciclisti durante una passeggiata in bicicletta",
      benefits: {
        mobility: {
          title: "Mobilità sostenibile",
          description:
            "Soluzioni di mobilità per gli spostamenti quotidiani.",
        },
        selection: {
          title: "Selezione di biciclette",
          description:
            "Scopri biciclette e accessori per diverse esigenze.",
        },
        expert: {
          title: "Supporto nella scelta",
          description:
            "Informazioni utili per scegliere la tua bicicletta.",
        },
        europe: {
          title: "In Europa",
          description:
            "Un negozio pensato per i ciclisti di diversi paesi europei.",
        },
      },
    },

    reviews: {
      heading: "Cosa dicono i nostri clienti",
      emptyTitle: "La tua opinione conta",
      emptyDescription:
        "Le recensioni dei clienti appariranno qui dopo essere state raccolte e verificate.",
      verified: "Cliente verificato",
      previous: "Recensione precedente",
      next: "Recensione successiva",
      showReview: "Mostra recensione",
      rating: "Valutazione",
    },

    newsletter: {
      heading: "Resta aggiornato!",
      description:
        "Ricevi novità, offerte esclusive e consigli sulle bici via e-mail.",
      email: "Il tuo indirizzo e-mail",
      subscribe: "Iscriviti",
      emailRequired:
        "Inserisci il tuo indirizzo e-mail.",
      emailInvalid:
        "Inserisci un indirizzo e-mail valido.",
      servicePending:
        "L'iscrizione sarà disponibile dopo l'attivazione del servizio e-mail.",
      accessibleTitle:
        "Iscrizione alla newsletter CYCLORIVA",
    },

    common: {
      viewAll: "Vedi tutto",
      loading: "Caricamento...",
      unavailable: "Non disponibile",
      seeMore: "Scopri di più",
    },
  },

  // =======================================================
  // ESPAGNOL
  // =======================================================

  es: {
    hero: {
      eyebrow: "BICICLETAS Y MOVILIDAD ELÉCTRICA EN EUROPA",
      titleLine1: "Descubre una nueva",
      titleLine2: "libertad de",
      titleHighlight: "movilidad",
      description:
        "Bicicletas eléctricas, de montaña, de carga y urbanas.",
      secondaryDescription:
        "Descubre nuestra selección de bicicletas y accesorios.",
      discover: "Descubre las bicicletas eléctricas",
      viewCategories: "Ver todas las categorías",
      performance: "Alto rendimiento",
      reliable: "Fiables",
      durable: "Más sostenibles",
      slide: "Diapositiva",
    },

    categories: {
      heading: "Nuestras categorías",
      electric: "Bicicletas eléctricas",
      mtb: "Bicicletas de montaña",
      cargo: "Bicicletas de carga",
      city: "Bicicletas urbanas",
      accessories: "Accesorios",
      imageMissing: "Imagen no disponible",
    },

    products: {
      featured: "Productos destacados",
      new: "Novedades",
      viewAll: "Ver todos los productos",
      viewNew: "Ver todas las novedades",
      viewProduct: "Ver producto",
      priceMissing: "Precio por confirmar",
      imageMissing: "Imagen no disponible",
      availability: "En stock",
      translation: "Traducción en preparación",
      empty: "No hay productos para mostrar.",
      promotion: "Oferta",
      bestSeller: "Más vendido",
      newBadge: "Nuevo",
      favorite: "Añadir a favoritos",
      cart: "Carrito",
    },

    services: {
      delivery: {
        title: "Entrega en Europa",
        description: "Plazos según el destino",
      },
      payment: {
        title: "Pago seguro",
        description: "Según métodos habilitados",
      },
      returns: {
        title: "Devoluciones y reembolsos",
        description: "Según nuestras condiciones",
      },
      warranty: {
        title: "Garantía de productos",
        description: "Según el fabricante",
      },
      support: {
        title: "Atención al cliente",
        description: "Asistencia CYCLORIVA",
      },
    },

    whyChoose: {
      heading: "¿Por qué elegir CYCLORIVA?",
      imageAlt:
        "Dos ciclistas disfrutando de un paseo en bicicleta",
      benefits: {
        mobility: {
          title: "Movilidad sostenible",
          description:
            "Soluciones de movilidad para tus desplazamientos diarios.",
        },
        selection: {
          title: "Selección de bicicletas",
          description:
            "Descubre bicicletas y accesorios para diferentes necesidades.",
        },
        expert: {
          title: "Ayuda para elegir",
          description:
            "Información útil para ayudarte a elegir tu bicicleta.",
        },
        europe: {
          title: "En Europa",
          description:
            "Una tienda dirigida a ciclistas de varios países europeos.",
        },
      },
    },

    reviews: {
      heading: "Lo que dicen nuestros clientes",
      emptyTitle: "Tu opinión cuenta",
      emptyDescription:
        "Las opiniones de nuestros clientes aparecerán aquí una vez recopiladas y verificadas.",
      verified: "Cliente verificado",
      previous: "Opinión anterior",
      next: "Opinión siguiente",
      showReview: "Mostrar opinión",
      rating: "Valoración",
    },

    newsletter: {
      heading: "¡Mantente informado!",
      description:
        "Recibe novedades, ofertas exclusivas y consejos de ciclismo por correo.",
      email: "Tu dirección de correo",
      subscribe: "Suscribirse",
      emailRequired:
        "Introduce tu dirección de correo.",
      emailInvalid:
        "Introduce una dirección de correo válida.",
      servicePending:
        "La suscripción estará disponible cuando se conecte el servicio de correo.",
      accessibleTitle:
        "Suscripción al boletín de CYCLORIVA",
    },

    common: {
      viewAll: "Ver todo",
      loading: "Cargando...",
      unavailable: "No disponible",
      seeMore: "Más información",
    },
  },
} satisfies Record<HomeLocale, HomeTextGroup>;

// =========================================================
// 3. RÉCUPÉRATION DES TRADUCTIONS
// =========================================================

/**
 * Retourne toutes les traductions de l'accueil
 * dans la langue demandée.
 *
 * Exemple :
 * const text = getHomeTranslations("fr");
 * text.hero.eyebrow
 * text.categories.heading
 * text.newsletter.heading
 */
export function getHomeTranslations(
  locale: string | null | undefined
): HomeTextGroup {
  const validLocale = resolveLocale(locale);

  return homeTranslations[validLocale];
}

// =========================================================
// 4. TRADUCTION PAR SECTION
// =========================================================

/**
 * Permet de récupérer une section entière.
 *
 * Exemple :
 * getHomeSection("de", "hero")
 * getHomeSection("es", "services")
 */
export function getHomeSection<
  K extends keyof HomeTextGroup
>(
  locale: string | null | undefined,
  section: K
): HomeTextGroup[K] {
  return getHomeTranslations(locale)[section];
}

// =========================================================
// 5. TRADUCTION D'UN TEXTE SIMPLE
// =========================================================

export type HomeSimpleSection =
  | "hero"
  | "categories"
  | "products"
  | "reviews"
  | "newsletter"
  | "common";

/**
 * Accès typé aux traductions d'une section simple.
 *
 * Exemple :
 * homeText("fr", "hero", "discover")
 * homeText("de", "products", "featured")
 */
export function homeText<
  S extends HomeSimpleSection,
  K extends keyof HomeTextGroup[S]
>(
  locale: string | null | undefined,
  section: S,
  key: K
): HomeTextGroup[S][K] {
  const translations = getHomeTranslations(locale);

  return translations[section][key];
}

// =========================================================
// 6. TRADUCTIONS DES SERVICES
// =========================================================

export function homeServiceText(
  locale: string | null | undefined,
  service: HomeServiceKey
): {
  title: string;
  description: string;
} {
  return getHomeTranslations(locale).services[service];
}

// =========================================================
// 7. TRADUCTIONS DES AVANTAGES
// =========================================================

export function homeBenefitText(
  locale: string | null | undefined,
  benefit: HomeBenefitKey
): {
  title: string;
  description: string;
} {
  return getHomeTranslations(locale)
    .whyChoose.benefits[benefit];
}

// =========================================================
// 8. TRADUCTION DES CATÉGORIES
// =========================================================

export function homeCategoryText(
  locale: string | null | undefined,
  category: HomeCategoryKey
): string {
  return getHomeTranslations(locale)
    .categories[category];
}

// =========================================================
// 9. DISPONIBILITÉ DES LANGUES
// =========================================================

export function isHomeLocale(
  value: unknown
): value is HomeLocale {
  return (
    typeof value === "string" &&
    homeLocales.some((locale) => locale === value)
  );
}

// =========================================================
// 10. EXPORT DU DICTIONNAIRE
// =========================================================

export { homeTranslations };
