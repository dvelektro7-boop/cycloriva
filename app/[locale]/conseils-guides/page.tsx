import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  BatteryCharging,
  Bike,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Gauge,
  Headphones,
  House,
  Mail,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — CONSEILS & GUIDES
 * ============================================================
 *
 * Fichier :
 * app/[locale]/conseils-guides/page.tsx
 *
 * Next.js 16 — App Router
 * React — TypeScript — Tailwind CSS 4
 *
 * ARCHITECTURE :
 * - Un seul fichier
 * - Responsive PC / mobile
 * - 5 langues
 * - Guides interactifs avec HTML details
 * - Aucun fichier supplémentaire
 * - Aucune dépendance supplémentaire
 *
 * COULEURS :
 * Bleu marine : #102b39
 * Vert : #109b24
 * Blanc : #ffffff
 *
 * Les conseils sont généraux.
 * Les instructions du fabricant et les règles
 * locales prévalent pour chaque produit.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

type Locale = "fr" | "en" | "de" | "it" | "es";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type GuideId =
  "choose" | "electric" | "maintenance" | "safety" | "battery" | "travel";

type Guide = {
  id: GuideId;
  category: string;
  title: string;
  description: string;
  readingTime: string;
  points: string[];
};

type PageContent = {
  home: string;
  breadcrumb: string;
  eyebrow: string;
  pageTitle: string;
  pageDescription: string;
  heroTitle: string;
  heroDescription: string;
  browseGuides: string;
  exploreProducts: string;

  featuredLabel: string;
  guidesTitle: string;
  guidesDescription: string;
  readGuide: string;
  closeGuide: string;
  guideCount: string;

  helpTitle: string;
  helpDescription: string;
  helpQuestion: string;
  helpAnswer: string;

  contactTitle: string;
  contactDescription: string;
  contactButton: string;
  catalogueButton: string;

  disclaimer: string;
  guides: Guide[];
};

// ============================================================
// 2. CONFIGURATION
// ============================================================

const LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function getLocale(value: string): Locale {
  if (!LOCALES.includes(value as Locale)) {
    notFound();
  }

  return value as Locale;
}

const CONTAINER = "mx-auto w-full max-w-none px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "rounded-2xl border border-[#dce6ed] bg-white " +
  "shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const TITLE =
  "text-[24px] font-black tracking-tight " +
  "text-[#102b39] sm:text-[29px] lg:text-[32px]";

// ============================================================
// 3. CONTENU MULTILINGUE
// ============================================================

const CONTENT: Record<Locale, PageContent> = {
  fr: {
    home: "Accueil",
    breadcrumb: "Conseils & Guides",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    pageTitle: "Conseils & Guides",
    pageDescription:
      "Des conseils pratiques pour choisir, utiliser et entretenir votre vélo ou vélo électrique.",
    heroTitle: "Tous nos conseils pour mieux profiter de votre vélo.",
    heroDescription:
      "Bien choisir son vélo, comprendre les équipements, préserver sa batterie et rouler en toute sécurité : découvrez nos guides pratiques.",
    browseGuides: "Découvrir les guides",
    exploreProducts: "Voir les produits",

    featuredLabel: "GUIDES PRATIQUES",
    guidesTitle: "Explorez nos guides",
    guidesDescription:
      "Six sujets essentiels pour vous accompagner avant et après votre achat.",
    readGuide: "Lire les conseils",
    closeGuide: "Refermer",
    guideCount: "6 guides",

    helpTitle: "Questions fréquentes",
    helpDescription: "Une réponse rapide aux questions les plus courantes.",
    helpQuestion: "Ces conseils remplacent-ils le manuel de mon vélo ?",
    helpAnswer:
      "Non. Les guides CYCLORIVA donnent des informations générales. Pour les réglages, la charge, l'entretien et la sécurité de votre modèle, consultez toujours les instructions du fabricant.",

    contactTitle: "Besoin de conseils personnalisés ?",
    contactDescription:
      "Une question sur un vélo, un accessoire ou une commande ? Notre équipe peut vous orienter vers les informations disponibles.",
    contactButton: "Nous contacter",
    catalogueButton: "Découvrir le catalogue",

    disclaimer:
      "Ces guides sont informatifs. Respectez le manuel du fabricant et la réglementation en vigueur dans votre pays.",

    guides: [
      {
        id: "choose",
        category: "CHOISIR SON VÉLO",
        title: "Comment choisir le vélo idéal ?",
        description:
          "Définissez votre utilisation, votre confort et les équipements nécessaires avant de choisir.",
        readingTime: "Guide pratique",
        points: [
          "Déterminez votre usage principal : ville, loisirs, chemins, randonnée ou transport de charges.",
          "Vérifiez la taille du cadre, la position de conduite et la hauteur de selle recommandées.",
          "Comparez les freins, les pneus, les vitesses, le poids et les équipements réellement inclus.",
          "Consultez les caractéristiques du modèle et demandez conseil si vous hésitez entre deux tailles.",
        ],
      },
      {
        id: "electric",
        category: "VÉLO ÉLECTRIQUE",
        title: "Comprendre un vélo électrique",
        description:
          "Moteur, assistance, batterie et autonomie : les éléments essentiels à connaître.",
        readingTime: "Guide pratique",
        points: [
          "L'assistance électrique complète votre pédalage selon le système et le mode sélectionné.",
          "La capacité de la batterie est souvent indiquée en wattheures (Wh). Elle ne garantit pas une distance précise.",
          "L'autonomie dépend notamment du relief, de la météo, du poids transporté, des pneus et du niveau d'assistance.",
          "Vérifiez la réglementation locale concernant les catégories de vélos électriques et leur utilisation sur la route.",
        ],
      },
      {
        id: "maintenance",
        category: "ENTRETIEN",
        title: "Entretenir son vélo au quotidien",
        description:
          "Les contrôles simples pour conserver un vélo en bon état de fonctionnement.",
        readingTime: "Guide pratique",
        points: [
          "Contrôlez régulièrement la pression des pneus et leur état, selon les indications du fabricant.",
          "Vérifiez le fonctionnement des freins et signalez tout bruit ou comportement inhabituel.",
          "Nettoyez la transmission avec des produits adaptés et lubrifiez-la selon les recommandations du fabricant.",
          "Faites vérifier par un professionnel les éléments de sécurité lorsque leur état vous paraît douteux.",
        ],
      },
      {
        id: "safety",
        category: "SÉCURITÉ",
        title: "Rouler en sécurité",
        description:
          "Des réflexes utiles pour améliorer votre visibilité et anticiper les risques.",
        readingTime: "Guide pratique",
        points: [
          "Avant chaque sortie, vérifiez les freins, les pneus, les roues et les fixations importantes.",
          "Utilisez des éclairages et équipements réfléchissants adaptés aux conditions et à la réglementation.",
          "Adaptez votre vitesse à la circulation, aux conditions météo et à l'état de la chaussée.",
          "Respectez les règles locales de circulation et utilisez des équipements de protection appropriés.",
        ],
      },
      {
        id: "battery",
        category: "BATTERIE",
        title: "Prendre soin de sa batterie",
        description:
          "Bonnes pratiques pour la charge, le rangement et l'utilisation d'un vélo électrique.",
        readingTime: "Guide pratique",
        points: [
          "Utilisez uniquement un chargeur expressément compatible et approuvé pour votre batterie.",
          "Chargez dans un endroit adapté, sec et ventilé, conformément au manuel du fabricant.",
          "N'utilisez pas une batterie endommagée, gonflée, anormalement chaude ou présentant une odeur inhabituelle.",
          "Respectez les recommandations du fabricant pour le stockage prolongé et les températures d'utilisation.",
        ],
      },
      {
        id: "travel",
        category: "DÉPLACEMENTS",
        title: "Préparer une sortie à vélo",
        description:
          "Les points à prévoir avant un trajet quotidien, une promenade ou une longue sortie.",
        readingTime: "Guide pratique",
        points: [
          "Choisissez un itinéraire adapté à votre niveau et vérifiez les conditions de circulation.",
          "Contrôlez l'état du vélo avant de partir et emportez le matériel nécessaire à votre trajet.",
          "Avec un vélo électrique, prévoyez une marge d'autonomie et vérifiez la charge avant le départ.",
          "Prévoyez de l'eau, une solution de communication et les équipements nécessaires selon la météo.",
        ],
      },
    ],
  },

  en: {
    home: "Home",
    breadcrumb: "Tips & Guides",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    pageTitle: "Tips & Guides",
    pageDescription:
      "Practical advice on choosing, using and maintaining bicycles and e-bikes.",
    heroTitle: "Helpful advice for every ride.",
    heroDescription:
      "Choose the right bicycle, understand its equipment, care for your battery and ride more safely.",
    browseGuides: "Explore guides",
    exploreProducts: "View products",

    featuredLabel: "PRACTICAL GUIDES",
    guidesTitle: "Explore our guides",
    guidesDescription:
      "Six essential topics to support you before and after your purchase.",
    readGuide: "Read tips",
    closeGuide: "Close",
    guideCount: "6 guides",

    helpTitle: "Frequently asked questions",
    helpDescription: "A quick answer to a common question.",
    helpQuestion: "Do these tips replace my bicycle's manual?",
    helpAnswer:
      "No. CYCLORIVA guides provide general information. Always follow the manufacturer's instructions for your particular bicycle, battery and equipment.",

    contactTitle: "Need more guidance?",
    contactDescription:
      "Questions about a bicycle, accessory or order? Our team can help you find the available information.",
    contactButton: "Contact us",
    catalogueButton: "Browse catalogue",

    disclaimer:
      "These guides are informational. Follow manufacturer instructions and applicable local regulations.",

    guides: [
      {
        id: "choose",
        category: "CHOOSING A BIKE",
        title: "How to choose the right bicycle",
        description:
          "Consider your needs, riding position and equipment before buying.",
        readingTime: "Practical guide",
        points: [
          "Decide whether you mainly ride in the city, on trails, for leisure or while carrying loads.",
          "Check frame sizing, riding position and saddle adjustment guidance.",
          "Compare brakes, tyres, gearing, weight and included accessories.",
          "Read the model specifications and ask for sizing advice when uncertain.",
        ],
      },
      {
        id: "electric",
        category: "ELECTRIC BIKES",
        title: "Understanding electric bicycles",
        description:
          "A simple explanation of motors, assistance, batteries and range.",
        readingTime: "Practical guide",
        points: [
          "Electric assistance supports pedalling according to the system and selected mode.",
          "Battery capacity is often measured in watt-hours (Wh), not guaranteed kilometres.",
          "Range changes with terrain, weather, rider weight, tyre pressure and assistance level.",
          "Check the laws applicable to your e-bike category where you ride.",
        ],
      },
      {
        id: "maintenance",
        category: "MAINTENANCE",
        title: "Everyday bicycle care",
        description:
          "Simple checks that help keep your bicycle working properly.",
        readingTime: "Practical guide",
        points: [
          "Check tyre condition and pressure in line with manufacturer guidance.",
          "Inspect braking performance and investigate unusual sounds.",
          "Clean and lubricate the drivetrain using suitable products.",
          "Ask a qualified mechanic to inspect components when safety is uncertain.",
        ],
      },
      {
        id: "safety",
        category: "SAFETY",
        title: "Ride more safely",
        description: "Useful habits for visibility and risk awareness.",
        readingTime: "Practical guide",
        points: [
          "Before riding, inspect brakes, wheels, tyres and important fasteners.",
          "Use suitable lights, reflective items and protective equipment.",
          "Adjust your speed for traffic, weather and road conditions.",
          "Follow road rules and equipment requirements in your location.",
        ],
      },
      {
        id: "battery",
        category: "BATTERIES",
        title: "Caring for your e-bike battery",
        description: "Charging, storage and safe handling essentials.",
        readingTime: "Practical guide",
        points: [
          "Use only a charger specifically approved for your battery.",
          "Follow manufacturer instructions for charging conditions and ventilation.",
          "Stop using a damaged, swollen or unusually hot battery.",
          "Follow the manufacturer's guidance for long-term storage and temperature.",
        ],
      },
      {
        id: "travel",
        category: "JOURNEYS",
        title: "Preparing for a bicycle ride",
        description: "Plan your route, equipment and available range.",
        readingTime: "Practical guide",
        points: [
          "Choose a route suitable for your experience and road conditions.",
          "Inspect the bike and bring appropriate tools and supplies.",
          "For e-bikes, check battery charge and allow a range margin.",
          "Plan for water, communication and changing weather.",
        ],
      },
    ],
  },

  de: {
    home: "Startseite",
    breadcrumb: "Tipps & Ratgeber",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    pageTitle: "Tipps & Ratgeber",
    pageDescription:
      "Praktische Tipps zur Auswahl, Nutzung und Pflege von Fahrrädern und E-Bikes.",
    heroTitle: "Wissenswertes rund ums Fahrrad.",
    heroDescription:
      "Das passende Fahrrad finden, E-Bikes verstehen, Akkus pflegen und sicher unterwegs sein.",
    browseGuides: "Ratgeber entdecken",
    exploreProducts: "Produkte ansehen",

    featuredLabel: "PRAKTISCHE RATGEBER",
    guidesTitle: "Unsere Ratgeber",
    guidesDescription: "Sechs wichtige Themen vor und nach dem Kauf.",
    readGuide: "Tipps lesen",
    closeGuide: "Schließen",
    guideCount: "6 Ratgeber",

    helpTitle: "Häufig gestellte Fragen",
    helpDescription: "Eine kurze Antwort auf eine wichtige Frage.",
    helpQuestion: "Ersetzen diese Tipps die Bedienungsanleitung?",
    helpAnswer:
      "Nein. Die CYCLORIVA-Ratgeber enthalten allgemeine Informationen. Beachten Sie stets die Herstelleranweisungen für Ihr konkretes Fahrrad, den Akku und das Zubehör.",

    contactTitle: "Sie haben noch Fragen?",
    contactDescription:
      "Fragen zu einem Fahrrad, Zubehör oder einer Bestellung? Wir helfen Ihnen, die verfügbaren Informationen zu finden.",
    contactButton: "Kontakt",
    catalogueButton: "Zum Sortiment",

    disclaimer:
      "Diese Ratgeber dienen der allgemeinen Information. Beachten Sie die Herstelleranweisungen und geltende Vorschriften.",

    guides: [
      {
        id: "choose",
        category: "FAHRRADWAHL",
        title: "Das passende Fahrrad auswählen",
        description:
          "Einsatzbereich, Sitzposition und Ausstattung richtig einschätzen.",
        readingTime: "Praxisratgeber",
        points: [
          "Überlegen Sie, ob Sie hauptsächlich in der Stadt, im Gelände oder in der Freizeit fahren.",
          "Prüfen Sie Rahmengröße, Sitzposition und empfohlene Satteleinstellung.",
          "Vergleichen Sie Bremsen, Reifen, Schaltung, Gewicht und Ausstattung.",
          "Lesen Sie die Produktdaten und fragen Sie bei Unsicherheit zur Größe nach.",
        ],
      },
      {
        id: "electric",
        category: "E-BIKES",
        title: "So funktioniert ein E-Bike",
        description: "Motorunterstützung, Akku und Reichweite einfach erklärt.",
        readingTime: "Praxisratgeber",
        points: [
          "Die elektrische Unterstützung ergänzt das Treten abhängig vom System.",
          "Die Akkukapazität wird häufig in Wattstunden (Wh) angegeben.",
          "Die Reichweite hängt unter anderem von Gelände, Wetter, Gewicht und Unterstützungsstufe ab.",
          "Beachten Sie die Vorschriften für die jeweilige E-Bike-Kategorie.",
        ],
      },
      {
        id: "maintenance",
        category: "PFLEGE",
        title: "Fahrrad richtig pflegen",
        description:
          "Regelmäßige Kontrollen für einen guten technischen Zustand.",
        readingTime: "Praxisratgeber",
        points: [
          "Prüfen Sie Reifen und Luftdruck gemäß Herstellerangaben.",
          "Kontrollieren Sie die Bremsfunktion und ungewöhnliche Geräusche.",
          "Reinigen und schmieren Sie den Antrieb mit geeigneten Mitteln.",
          "Lassen Sie sicherheitsrelevante Bauteile bei Zweifeln fachgerecht überprüfen.",
        ],
      },
      {
        id: "safety",
        category: "SICHERHEIT",
        title: "Sicher mit dem Fahrrad unterwegs",
        description: "Sichtbarkeit, Kontrolle und vorausschauendes Fahren.",
        readingTime: "Praxisratgeber",
        points: [
          "Kontrollieren Sie vor jeder Fahrt Bremsen, Reifen und wichtige Befestigungen.",
          "Verwenden Sie geeignete Beleuchtung und Schutzausrüstung.",
          "Passen Sie Ihre Geschwindigkeit an Verkehr, Wetter und Untergrund an.",
          "Beachten Sie die Verkehrsregeln und Ausrüstungspflichten vor Ort.",
        ],
      },
      {
        id: "battery",
        category: "AKKU",
        title: "Den E-Bike-Akku richtig behandeln",
        description: "Wichtige Hinweise zum Laden und Lagern.",
        readingTime: "Praxisratgeber",
        points: [
          "Verwenden Sie nur ausdrücklich zugelassene Ladegeräte.",
          "Laden Sie entsprechend den Herstellerangaben an einem geeigneten Ort.",
          "Nutzen Sie beschädigte, aufgeblähte oder ungewöhnlich heiße Akkus nicht weiter.",
          "Beachten Sie Hinweise zur Temperatur und längeren Lagerung.",
        ],
      },
      {
        id: "travel",
        category: "TOUREN",
        title: "Eine Fahrradtour vorbereiten",
        description: "Route, Ausrüstung und Energie rechtzeitig planen.",
        readingTime: "Praxisratgeber",
        points: [
          "Wählen Sie eine Strecke entsprechend Ihrer Erfahrung.",
          "Prüfen Sie das Fahrrad und nehmen Sie passende Ausrüstung mit.",
          "Planen Sie bei E-Bikes eine ausreichende Reichweitenreserve.",
          "Denken Sie an Wasser, Kommunikation und Wetterbedingungen.",
        ],
      },
    ],
  },

  it: {
    home: "Home",
    breadcrumb: "Consigli e guide",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    pageTitle: "Consigli e guide",
    pageDescription:
      "Consigli pratici per scegliere, utilizzare e mantenere biciclette ed e-bike.",
    heroTitle: "Tutti i consigli per pedalare meglio.",
    heroDescription:
      "Scegli la bici giusta, scopri come funziona una e-bike, cura la batteria e viaggia in sicurezza.",
    browseGuides: "Scopri le guide",
    exploreProducts: "Vedi i prodotti",

    featuredLabel: "GUIDE PRATICHE",
    guidesTitle: "Esplora le guide",
    guidesDescription: "Sei argomenti utili prima e dopo l'acquisto.",
    readGuide: "Leggi i consigli",
    closeGuide: "Chiudi",
    guideCount: "6 guide",

    helpTitle: "Domande frequenti",
    helpDescription: "Una risposta rapida a una domanda comune.",
    helpQuestion: "Questi consigli sostituiscono il manuale della bicicletta?",
    helpAnswer:
      "No. Le guide CYCLORIVA forniscono informazioni generali. Segui sempre le istruzioni del produttore per il tuo modello, la batteria e gli accessori.",

    contactTitle: "Hai bisogno di aiuto?",
    contactDescription:
      "Hai domande su una bicicletta, un accessorio o un ordine? Contattaci per conoscere le informazioni disponibili.",
    contactButton: "Contattaci",
    catalogueButton: "Esplora il catalogo",

    disclaimer:
      "Queste guide sono informative. Segui le istruzioni del produttore e le normative locali.",

    guides: [
      {
        id: "choose",
        category: "SCELTA DELLA BICI",
        title: "Come scegliere la bici giusta",
        description: "Valuta utilizzo, posizione di guida e dotazioni.",
        readingTime: "Guida pratica",
        points: [
          "Definisci se pedali soprattutto in città, sui sentieri o per svago.",
          "Controlla misura del telaio, posizione e regolazione della sella.",
          "Confronta freni, pneumatici, cambio, peso e accessori inclusi.",
          "Consulta le specifiche del modello e chiedi consiglio sulla taglia.",
        ],
      },
      {
        id: "electric",
        category: "E-BIKE",
        title: "Capire le biciclette elettriche",
        description: "Motore, assistenza, batteria e autonomia.",
        readingTime: "Guida pratica",
        points: [
          "L'assistenza elettrica supporta la pedalata secondo il sistema utilizzato.",
          "La capacità della batteria è spesso espressa in wattora (Wh).",
          "L'autonomia varia in base a percorso, meteo, peso e livello di assistenza.",
          "Verifica le norme locali applicabili alla tua tipologia di e-bike.",
        ],
      },
      {
        id: "maintenance",
        category: "MANUTENZIONE",
        title: "Manutenzione quotidiana",
        description: "Controlli semplici per mantenere la bici efficiente.",
        readingTime: "Guida pratica",
        points: [
          "Controlla pneumatici e pressione secondo le indicazioni del produttore.",
          "Verifica i freni e presta attenzione a rumori insoliti.",
          "Pulisci e lubrifica la trasmissione con prodotti adeguati.",
          "Rivolgiti a un tecnico quando hai dubbi sulla sicurezza.",
        ],
      },
      {
        id: "safety",
        category: "SICUREZZA",
        title: "Pedalare in sicurezza",
        description: "Visibilità, attenzione e controlli prima di partire.",
        readingTime: "Guida pratica",
        points: [
          "Controlla freni, ruote e componenti essenziali prima di partire.",
          "Usa luci e dispositivi di protezione adeguati.",
          "Adatta la velocità a traffico, meteo e condizioni della strada.",
          "Rispetta le regole di circolazione del luogo.",
        ],
      },
      {
        id: "battery",
        category: "BATTERIA",
        title: "Prendersi cura della batteria",
        description: "Ricarica, conservazione e utilizzo corretto.",
        readingTime: "Guida pratica",
        points: [
          "Utilizza solo caricabatterie approvati per la tua batteria.",
          "Ricarica secondo le indicazioni del produttore.",
          "Non utilizzare batterie danneggiate, gonfie o troppo calde.",
          "Segui le istruzioni sulla temperatura e sulla conservazione.",
        ],
      },
      {
        id: "travel",
        category: "PERCORSI",
        title: "Preparare un'uscita in bicicletta",
        description: "Organizza percorso, equipaggiamento e autonomia.",
        readingTime: "Guida pratica",
        points: [
          "Scegli un percorso adatto alla tua esperienza.",
          "Controlla la bici e porta l'equipaggiamento necessario.",
          "Con una e-bike, prevedi una riserva di autonomia.",
          "Considera acqua, comunicazioni e condizioni meteorologiche.",
        ],
      },
    ],
  },

  es: {
    home: "Inicio",
    breadcrumb: "Consejos y guías",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    pageTitle: "Consejos y guías",
    pageDescription:
      "Consejos prácticos para elegir, utilizar y mantener bicicletas y bicicletas eléctricas.",
    heroTitle: "Todo lo que necesitas saber para disfrutar de tu bicicleta.",
    heroDescription:
      "Elige la bicicleta adecuada, comprende sus componentes, cuida la batería y circula con seguridad.",
    browseGuides: "Explorar guías",
    exploreProducts: "Ver productos",

    featuredLabel: "GUÍAS PRÁCTICAS",
    guidesTitle: "Explora nuestras guías",
    guidesDescription: "Seis temas fundamentales antes y después de la compra.",
    readGuide: "Leer consejos",
    closeGuide: "Cerrar",
    guideCount: "6 guías",

    helpTitle: "Preguntas frecuentes",
    helpDescription: "Una respuesta rápida a una duda habitual.",
    helpQuestion: "¿Estos consejos sustituyen el manual de mi bicicleta?",
    helpAnswer:
      "No. Las guías CYCLORIVA ofrecen información general. Sigue siempre las instrucciones del fabricante de tu bicicleta, batería y accesorios.",

    contactTitle: "¿Necesitas orientación?",
    contactDescription:
      "¿Tienes preguntas sobre una bicicleta, accesorio o pedido? Podemos ayudarte a encontrar información disponible.",
    contactButton: "Contáctanos",
    catalogueButton: "Explorar catálogo",

    disclaimer:
      "Estas guías son informativas. Sigue las instrucciones del fabricante y las normas locales aplicables.",

    guides: [
      {
        id: "choose",
        category: "ELEGIR BICICLETA",
        title: "Cómo elegir la bicicleta adecuada",
        description: "Ten en cuenta el uso, la comodidad y los componentes.",
        readingTime: "Guía práctica",
        points: [
          "Define si la usarás en ciudad, montaña, rutas o para transportar cargas.",
          "Comprueba la talla del cuadro y la posición de conducción.",
          "Compara frenos, neumáticos, cambios, peso y accesorios incluidos.",
          "Consulta las especificaciones y pide asesoramiento sobre la talla.",
        ],
      },
      {
        id: "electric",
        category: "BICICLETAS ELÉCTRICAS",
        title: "Entender una bicicleta eléctrica",
        description: "Motor, asistencia, batería y autonomía explicados.",
        readingTime: "Guía práctica",
        points: [
          "La asistencia eléctrica complementa el pedaleo según el sistema.",
          "La capacidad de la batería suele expresarse en vatios-hora (Wh).",
          "La autonomía depende del terreno, clima, peso y asistencia seleccionada.",
          "Consulta las normas aplicables al tipo de bicicleta eléctrica.",
        ],
      },
      {
        id: "maintenance",
        category: "MANTENIMIENTO",
        title: "Cuidados básicos de la bicicleta",
        description: "Revisiones sencillas para mantenerla en buen estado.",
        readingTime: "Guía práctica",
        points: [
          "Comprueba neumáticos y presión según las indicaciones del fabricante.",
          "Revisa los frenos y cualquier ruido inusual.",
          "Limpia y lubrica la transmisión con productos adecuados.",
          "Acude a un profesional cuando tengas dudas sobre su seguridad.",
        ],
      },
      {
        id: "safety",
        category: "SEGURIDAD",
        title: "Circular con mayor seguridad",
        description: "Visibilidad, prevención y revisiones antes de salir.",
        readingTime: "Guía práctica",
        points: [
          "Revisa frenos, ruedas y componentes esenciales antes de circular.",
          "Utiliza luces y equipos de protección adecuados.",
          "Adapta la velocidad al tráfico, clima y estado de la vía.",
          "Respeta las normas de circulación de tu ubicación.",
        ],
      },
      {
        id: "battery",
        category: "BATERÍA",
        title: "Cómo cuidar la batería",
        description: "Carga, almacenamiento y uso responsable.",
        readingTime: "Guía práctica",
        points: [
          "Usa únicamente cargadores aprobados para tu batería.",
          "Carga siguiendo las instrucciones del fabricante.",
          "No utilices baterías dañadas, hinchadas o demasiado calientes.",
          "Respeta las recomendaciones de temperatura y almacenamiento.",
        ],
      },
      {
        id: "travel",
        category: "RUTAS",
        title: "Preparar una salida en bicicleta",
        description: "Planifica recorrido, materiales y autonomía.",
        readingTime: "Guía práctica",
        points: [
          "Elige una ruta adecuada a tu experiencia.",
          "Revisa la bicicleta y lleva el equipo necesario.",
          "Con una bicicleta eléctrica, prevé un margen de autonomía.",
          "Ten en cuenta el agua, las comunicaciones y el tiempo.",
        ],
      },
    ],
  },
};

// ============================================================
// 4. ICONOGRAPHIE DES GUIDES
// ============================================================

const GUIDE_ICONS = {
  choose: SlidersHorizontal,
  electric: Gauge,
  maintenance: Wrench,
  safety: ShieldCheck,
  battery: BatteryCharging,
  travel: Route,
} as const;

// ============================================================
// 5. MÉTADONNÉES SEO
// ============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = getLocale(rawLocale);
  const t = CONTENT[locale];

  return {
    title: `${t.pageTitle} | CYCLORIVA`,
    description: t.pageDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/conseils-guides",
        en: "/en/conseils-guides",
        de: "/de/conseils-guides",
        it: "/it/conseils-guides",
        es: "/es/conseils-guides",
        "x-default": "/fr/conseils-guides",
      },
    },

    openGraph: {
      images: [{ url: "/images/imager.png", width: 1536, height: 1024, alt: "CYCLORIVA" }],
      type: "website",
      title: `${t.pageTitle} | CYCLORIVA`,
      description: t.pageDescription,
    },
  };
}

// ============================================================
// 6. BANDEAU PC
// ============================================================

function GuidesBanner({ t }: { t: PageContent }) {
  return (
    <section
      aria-label={t.pageTitle}
      className="relative hidden min-h-31.25 overflow-hidden bg-[#082a3f] lg:block"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/couverture.png')",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-[#061f32]/95 via-[#061f32]/80 to-[#061f32]/10"
      />

      <div
        className={`${CONTAINER} relative z-10 flex min-h-31.25 flex-col justify-center py-1`}
      >
        <p className="mb-2 flex items-center gap-2 text-[11px] font-extrabold tracking-wide text-white">
          <span className="h-0.75 w-6 bg-[#8be347]" />
          {t.eyebrow}
        </p>

        <h1 className="text-[32px] font-black tracking-tight text-white xl:text-[38px]">
          {t.pageTitle}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 7. FIL D'ARIANE
// ============================================================

function GuidesBreadcrumb({ locale, t }: { locale: Locale; t: PageContent }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 py-1 text-xs text-[#435b6c]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 hover:text-[#109b24]"
      >
        <House size={17} className="text-[#109b24]" aria-hidden="true" />
        {t.home}
      </Link>

      <ChevronRight size={15} className="text-[#109b24]" aria-hidden="true" />

      <span aria-current="page" className="font-semibold text-[#102b39]">
        {t.breadcrumb}
      </span>
    </nav>
  );
}

// ============================================================
// 8. SECTION D'INTRODUCTION
// ============================================================

function GuidesHero({ locale, t }: { locale: Locale; t: PageContent }) {
  return (
    <section className="grid items-center gap-3 py-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold tracking-wide text-[#078b1c]">
          <Sparkles size={16} />
          {t.featuredLabel}
        </span>

        <h2 className="mt-2 max-w-177.5 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[45px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-155 text-[14px] leading-7 text-[#536c7d] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href="#guides"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#078e1d] px-5 py-3 text-[13px] font-extrabold text-white transition-colors hover:bg-[#067719] sm:text-sm"
          >
            <BookOpen size={18} />
            {t.browseGuides}
            <ArrowRight size={17} />
          </a>

          <Link
            href={`/${locale}/produits`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#afbfca] px-5 py-3 text-[13px] font-bold text-[#102b39] transition-colors hover:bg-slate-50 sm:text-sm"
          >
            <Bike size={18} />
            {t.exploreProducts}
          </Link>
        </div>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div
          className="relative min-h-52.5 bg-[#0a3143] bg-cover bg-center sm:min-h-72.5 lg:min-h-64"
          style={{
            backgroundImage: "url('/images/accueil.png')",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#062637]/80 via-transparent to-transparent"
          />

          <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl border border-white/20 bg-[#102b39]/85 p-3 text-white backdrop-blur-sm">
            <BookOpen size={29} className="shrink-0 text-[#88e875]" />

            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-wide text-[#b1eaa7]">
                CYCLORIVA
              </p>

              <p className="mt-1 text-[15px] font-extrabold">{t.guideCount}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 9. CARTE D'UN GUIDE INTERACTIF
// ============================================================

function GuideCard({
  guide,
  t,
  index,
}: {
  guide: Guide;
  t: PageContent;
  index: number;
}) {
  const Icon = GUIDE_ICONS[guide.id];

  return (
    <article
      id={`guide-${guide.id}`}
      className={`${CARD} min-w-0 scroll-mt-28 overflow-hidden transition-shadow hover:shadow-md`}
    >
      <div className="p-3 sm:p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
            <Icon size={26} strokeWidth={1.8} />
          </div>

          <span className="text-[25px] font-black text-[#e0ede4]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-2 text-[10px] font-extrabold tracking-[0.09em] text-[#078b1c]">
          {guide.category}
        </p>

        <h3 className="mt-2 text-[18px] leading-6 font-black tracking-tight text-[#102b39] sm:text-[20px]">
          {guide.title}
        </h3>

        <p className="mt-3 min-h-13.75 text-[13px] leading-6 text-[#5c7181]">
          {guide.description}
        </p>

        <div className="mt-2 border-t border-[#e3eaf0] pt-4">
          <details className="group">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-[13px] font-extrabold text-[#078b1c] outline-none marker:hidden focus-visible:outline-2 focus-visible:outline-[#109b24] [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <BookOpen size={17} />
                {t.readGuide}
              </span>

              <ChevronDown
                size={19}
                className="shrink-0 transition-transform group-open:rotate-180"
              />
            </summary>

            <div className="mt-3 rounded-xl bg-[#f1faef] p-3">
              <ol className="space-y-3">
                {guide.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#109b24]"
                      aria-hidden="true"
                    />

                    <span className="text-[12px] leading-[1.75] text-[#284354] sm:text-[13px]">
                      {point}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}

// ============================================================
// 10. LISTE DES GUIDES
// ============================================================

function GuidesList({ t }: { t: PageContent }) {
  return (
    <section id="guides" className="scroll-mt-24 py-1 lg:py-1">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={TITLE}>{t.guidesTitle}</h2>

          <p className="mt-2 max-w-175 text-sm leading-6 text-[#637686]">
            {t.guidesDescription}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-xs font-bold text-[#078b1c]">
          <BookOpen size={15} />
          {t.guideCount}
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
        {t.guides.map((guide, index) => (
          <GuideCard key={guide.id} guide={guide} t={t} index={index} />
        ))}
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-xl border border-[#dce7ed] bg-[#f7fafc] p-3 text-[12px] leading-6 text-[#52697b]">
        <ShieldCheck
          size={19}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        {t.disclaimer}
      </p>
    </section>
  );
}

// ============================================================
// 11. QUESTION FRÉQUENTE
// ============================================================

function GuidesFAQ({ t }: { t: PageContent }) {
  return (
    <section className="py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-3`}>
        <div className="flex items-center gap-3">
          <CircleHelp size={31} className="shrink-0 text-[#109b24]" />

          <div>
            <h2 className="text-[20px] font-black text-[#102b39] sm:text-[24px]">
              {t.helpTitle}
            </h2>

            <p className="mt-1 text-[12px] text-[#607687]">
              {t.helpDescription}
            </p>
          </div>
        </div>

        <details className="group mt-3 rounded-xl border border-[#dce5ed] bg-white">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-extrabold text-[#102b39] focus-visible:outline-2 focus-visible:outline-[#109b24] sm:text-[15px] [&::-webkit-details-marker]:hidden">
            {t.helpQuestion}

            <ChevronDown
              size={19}
              className="shrink-0 text-[#109b24] transition-transform group-open:rotate-180"
            />
          </summary>

          <div className="mx-3 mb-3 rounded-lg bg-[#eaf8e9] p-3 text-[13px] leading-6 text-[#294b3b]">
            {t.helpAnswer}
          </div>
        </details>
      </div>
    </section>
  );
}

// ============================================================
// 12. CONTACT ET APPEL À L'ACTION
// ============================================================

function GuidesContact({ locale, t }: { locale: Locale; t: PageContent }) {
  return (
    <section className="py-1 lg:py-1">
      <div className="relative overflow-hidden rounded-2xl bg-[#082b3e] px-5 py-1 text-center sm:px-8 lg:py-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full border-42 border-[#109b24]/20"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full border-42 border-[#109b24]/20"
        />

        <div className="relative z-10">
          <Headphones size={35} className="mx-auto mb-2 text-[#8beb70]" />

          <h2 className="mx-auto max-w-187.5 text-[24px] font-black tracking-tight text-white sm:text-[30px]">
            {t.contactTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-170 text-[13px] leading-6 text-[#d9e5eb] sm:text-[14px]">
            {t.contactDescription}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#109b24] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#07861b]"
            >
              <Mail size={18} />
              {t.contactButton}
              <ArrowRight size={17} />
            </Link>

            <Link
              href={`/${locale}/produits`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              <Bike size={18} />
              {t.catalogueButton}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 13. PAGE PRINCIPALE
// ============================================================

async function GuidesPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = getLocale(rawLocale);
  const t = CONTENT[locale];

  return (
    <main
      data-page="guides"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Le header général vient de SiteChrome. */}

      <GuidesBanner t={t} />

      <div className={CONTAINER}>
        <GuidesBreadcrumb locale={locale} t={t} />

        <GuidesHero locale={locale} t={t} />

        <GuidesList t={t} />

        <GuidesFAQ t={t} />

        <GuidesContact locale={locale} t={t} />
      </div>

      {/* Le footer général vient de SiteChrome. */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA CONSEILS & GUIDES
// ============================================================

export default function GuidesPage(
  props: Parameters<typeof GuidesPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <GuidesPageContent {...props} />
    </Suspense>
  );
}
