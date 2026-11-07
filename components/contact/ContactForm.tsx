"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — FORMULAIRE DE CONTACT
 * ============================================================
 *
 * Fichier :
 * components/contact/ContactForm.tsx
 *
 * Next.js 16 — React 19 — TypeScript
 * Tailwind CSS 4 — Lucide React
 *
 * ARCHITECTURE :
 *
 * PC :
 * - Carte blanche avec bordure discrète
 * - Icône e-mail verte
 * - Titre : Envoyez-nous un message
 * - Ligne 1 : Nom | Prénom
 * - Ligne 2 : E-mail | Sujet
 * - Ligne 3 : Votre message
 * - Bouton vert pleine largeur
 *
 * MOBILE :
 * - Formulaire entièrement responsive
 * - Champs confortables au toucher
 * - Aucun débordement horizontal
 * - Bouton vert pleine largeur
 *
 * FONCTIONNEMENT :
 * - 5 langues : FR / EN / DE / IT / ES
 * - Validation des champs
 * - E-mail vérifié
 * - Protection basique anti-spam (honeypot)
 * - État d'envoi
 * - Gestion des erreurs réseau
 * - Confirmation seulement si l'API réussit
 * - Aucun secret Resend dans le navigateur
 *
 * API PRÉVUE :
 * POST /api/contact
 *
 * L'API doit valider les données,
 * contrôler les abus et utiliser Resend
 * uniquement côté serveur.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type ContactSubject =
  "order" | "delivery" | "product" | "returns" | "warranty" | "other";

type ContactFormValues = {
  lastName: string;
  firstName: string;
  email: string;
  subject: ContactSubject | "";
  message: string;
  website: string;
};

type ContactFormErrors = Partial<
  Record<"lastName" | "firstName" | "email" | "subject" | "message", string>
>;

type SubmitStatus = "idle" | "sending" | "success" | "error";

export type ContactFormProps = {
  locale: CheckoutLocale | string;
  className?: string;
  id?: string;
  apiEndpoint?: string;
  defaultSubject?: ContactSubject | "";
};

type ContactFormTexts = {
  title: string;
  lastName: string;
  firstName: string;
  email: string;
  subject: string;
  message: string;

  lastNamePlaceholder: string;
  firstNamePlaceholder: string;
  emailPlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;

  subjectOrder: string;
  subjectDelivery: string;
  subjectProduct: string;
  subjectReturns: string;
  subjectWarranty: string;
  subjectOther: string;

  send: string;
  sending: string;

  required: string;
  invalidEmail: string;
  nameTooShort: string;
  messageTooShort: string;
  messageTooLong: string;

  successTitle: string;
  successMessage: string;
  networkError: string;
  serverError: string;
  rateLimitError: string;
  configurationError: string;

  privacyText: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

const TRANSLATIONS: Record<CheckoutLocale, ContactFormTexts> = {
  fr: {
    title: "Envoyez-nous un message",
    lastName: "Nom",
    firstName: "Prénom",
    email: "Adresse e-mail",
    subject: "Sujet",
    message: "Votre message",

    lastNamePlaceholder: "Votre nom",
    firstNamePlaceholder: "Votre prénom",
    emailPlaceholder: "votre@email.com",
    subjectPlaceholder: "Sélectionnez un sujet",
    messagePlaceholder: "Écrivez votre message ici...",

    subjectOrder: "Information sur une commande",
    subjectDelivery: "Livraison",
    subjectProduct: "Question sur un produit",
    subjectReturns: "Retour ou remboursement",
    subjectWarranty: "Garantie et assistance",
    subjectOther: "Autre question",

    send: "Envoyer le message",
    sending: "Envoi en cours...",

    required: "Ce champ est obligatoire.",
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    nameTooShort: "Veuillez saisir au moins 2 caractères.",
    messageTooShort: "Votre message doit contenir au moins 10 caractères.",
    messageTooLong: "Votre message ne doit pas dépasser 5 000 caractères.",

    successTitle: "Message envoyé",
    successMessage:
      "Votre message a bien été reçu. Merci d'avoir contacté CYCLORIVA.",
    networkError:
      "Connexion impossible. Vérifiez votre connexion puis réessayez.",
    serverError: "Votre message n'a pas pu être envoyé. Veuillez réessayer.",
    rateLimitError: "Trop de tentatives. Veuillez réessayer plus tard.",
    configurationError:
      "Le formulaire de contact est momentanément indisponible. Vous pouvez nous écrire à contact@cycloriva.com.",

    privacyText:
      "Vos coordonnées sont utilisées pour répondre à votre demande.",
  },

  en: {
    title: "Send us a message",
    lastName: "Last name",
    firstName: "First name",
    email: "Email address",
    subject: "Subject",
    message: "Your message",

    lastNamePlaceholder: "Your last name",
    firstNamePlaceholder: "Your first name",
    emailPlaceholder: "your@email.com",
    subjectPlaceholder: "Select a subject",
    messagePlaceholder: "Write your message here...",

    subjectOrder: "Order enquiry",
    subjectDelivery: "Delivery",
    subjectProduct: "Product enquiry",
    subjectReturns: "Returns or refunds",
    subjectWarranty: "Warranty and support",
    subjectOther: "Other question",

    send: "Send message",
    sending: "Sending...",

    required: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
    nameTooShort: "Please enter at least 2 characters.",
    messageTooShort: "Your message must contain at least 10 characters.",
    messageTooLong: "Your message cannot exceed 5,000 characters.",

    successTitle: "Message sent",
    successMessage:
      "Your message has been received. Thank you for contacting CYCLORIVA.",
    networkError:
      "Connection failed. Check your internet connection and try again.",
    serverError: "Your message could not be sent. Please try again.",
    rateLimitError: "Too many attempts. Please try again later.",
    configurationError:
      "The contact form is temporarily unavailable. You can email us at contact@cycloriva.com.",

    privacyText: "Your contact details are used to respond to your enquiry.",
  },

  de: {
    title: "Schreiben Sie uns",
    lastName: "Nachname",
    firstName: "Vorname",
    email: "E-Mail-Adresse",
    subject: "Betreff",
    message: "Ihre Nachricht",

    lastNamePlaceholder: "Ihr Nachname",
    firstNamePlaceholder: "Ihr Vorname",
    emailPlaceholder: "ihre@email.de",
    subjectPlaceholder: "Betreff auswählen",
    messagePlaceholder: "Schreiben Sie Ihre Nachricht hier...",

    subjectOrder: "Frage zu einer Bestellung",
    subjectDelivery: "Lieferung",
    subjectProduct: "Produktanfrage",
    subjectReturns: "Rückgabe oder Erstattung",
    subjectWarranty: "Garantie und Support",
    subjectOther: "Sonstige Frage",

    send: "Nachricht senden",
    sending: "Wird gesendet...",

    required: "Dieses Feld ist erforderlich.",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    nameTooShort: "Bitte geben Sie mindestens 2 Zeichen ein.",
    messageTooShort: "Ihre Nachricht muss mindestens 10 Zeichen enthalten.",
    messageTooLong: "Ihre Nachricht darf höchstens 5.000 Zeichen enthalten.",

    successTitle: "Nachricht gesendet",
    successMessage:
      "Ihre Nachricht ist eingegangen. Vielen Dank, dass Sie CYCLORIVA kontaktiert haben.",
    networkError:
      "Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.",
    serverError:
      "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    rateLimitError: "Zu viele Versuche. Bitte versuchen Sie es später erneut.",
    configurationError:
      "Das Kontaktformular ist vorübergehend nicht verfügbar. Schreiben Sie an contact@cycloriva.com.",

    privacyText:
      "Ihre Kontaktdaten werden zur Beantwortung Ihrer Anfrage verwendet.",
  },

  it: {
    title: "Inviaci un messaggio",
    lastName: "Cognome",
    firstName: "Nome",
    email: "Indirizzo e-mail",
    subject: "Oggetto",
    message: "Il tuo messaggio",

    lastNamePlaceholder: "Il tuo cognome",
    firstNamePlaceholder: "Il tuo nome",
    emailPlaceholder: "tua@email.it",
    subjectPlaceholder: "Seleziona un argomento",
    messagePlaceholder: "Scrivi qui il tuo messaggio...",

    subjectOrder: "Informazioni su un ordine",
    subjectDelivery: "Consegna",
    subjectProduct: "Domanda su un prodotto",
    subjectReturns: "Resi o rimborsi",
    subjectWarranty: "Garanzia e assistenza",
    subjectOther: "Altra domanda",

    send: "Invia messaggio",
    sending: "Invio in corso...",

    required: "Questo campo è obbligatorio.",
    invalidEmail: "Inserisci un indirizzo e-mail valido.",
    nameTooShort: "Inserisci almeno 2 caratteri.",
    messageTooShort: "Il messaggio deve contenere almeno 10 caratteri.",
    messageTooLong: "Il messaggio non può superare 5.000 caratteri.",

    successTitle: "Messaggio inviato",
    successMessage:
      "Il tuo messaggio è stato ricevuto. Grazie per aver contattato CYCLORIVA.",
    networkError:
      "Connessione non riuscita. Controlla la connessione e riprova.",
    serverError: "Impossibile inviare il messaggio. Riprova.",
    rateLimitError: "Troppi tentativi. Riprova più tardi.",
    configurationError:
      "Il modulo di contatto non è temporaneamente disponibile. Scrivici a contact@cycloriva.com.",

    privacyText:
      "I tuoi dati di contatto vengono utilizzati per rispondere alla tua richiesta.",
  },

  es: {
    title: "Envíanos un mensaje",
    lastName: "Apellido",
    firstName: "Nombre",
    email: "Correo electrónico",
    subject: "Asunto",
    message: "Tu mensaje",

    lastNamePlaceholder: "Tu apellido",
    firstNamePlaceholder: "Tu nombre",
    emailPlaceholder: "tu@email.com",
    subjectPlaceholder: "Selecciona un asunto",
    messagePlaceholder: "Escribe tu mensaje aquí...",

    subjectOrder: "Consulta sobre un pedido",
    subjectDelivery: "Entrega",
    subjectProduct: "Consulta sobre un producto",
    subjectReturns: "Devolución o reembolso",
    subjectWarranty: "Garantía y asistencia",
    subjectOther: "Otra pregunta",

    send: "Enviar mensaje",
    sending: "Enviando...",

    required: "Este campo es obligatorio.",
    invalidEmail: "Introduce un correo electrónico válido.",
    nameTooShort: "Introduce al menos 2 caracteres.",
    messageTooShort: "El mensaje debe contener al menos 10 caracteres.",
    messageTooLong: "El mensaje no debe superar los 5.000 caracteres.",

    successTitle: "Mensaje enviado",
    successMessage:
      "Hemos recibido tu mensaje. Gracias por contactar con CYCLORIVA.",
    networkError:
      "No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo.",
    serverError: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
    rateLimitError: "Demasiados intentos. Vuelve a intentarlo más tarde.",
    configurationError:
      "El formulario no está disponible temporalmente. Escríbenos a contact@cycloriva.com.",

    privacyText:
      "Tus datos de contacto se utilizan para responder a tu consulta.",
  },
};

// ============================================================
// 3. CONSTANTES
// ============================================================

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;

const INPUT_CLASS = [
  "h-11",
  "w-full",
  "min-w-0",
  "rounded-lg",
  "border",
  "border-[#cbd7e3]",
  "bg-white",
  "px-3",
  "text-[13px]",
  "text-[#102b39]",
  "placeholder:text-[#738596]",
  "outline-none",
  "transition-colors",
  "focus:border-[#109b24]",
  "focus:ring-2",
  "focus:ring-[#109b24]/15",
  "disabled:cursor-not-allowed",
  "disabled:bg-slate-100",
  "disabled:opacity-70",
].join(" ");

const LABEL_CLASS = "mb-1.5 block text-[12px] font-bold text-[#102b39]";

const CARD_CLASS = [
  "min-w-0",
  "rounded-xl",
  "border",
  "border-[#dbe5ed]",
  "bg-white",
  "p-4",
  "shadow-[0_3px_14px_rgba(16,43,57,0.035)]",
  "sm:p-5",
  "lg:p-6",
].join(" ");

const SUBJECTS: ContactSubject[] = [
  "order",
  "delivery",
  "product",
  "returns",
  "warranty",
  "other",
];

// ============================================================
// 4. OUTILS
// ============================================================

function isContactSubject(value: string): value is ContactSubject {
  return SUBJECTS.includes(value as ContactSubject);
}

function createInitialValues(subject: ContactSubject | ""): ContactFormValues {
  return {
    lastName: "",
    firstName: "",
    email: "",
    subject,
    message: "",
    website: "",
  };
}

function isValidEmail(email: string): boolean {
  const value = email.trim();

  if (!value || value.length > MAX_EMAIL_LENGTH || /\s/.test(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContactForm(
  values: ContactFormValues,
  t: ContactFormTexts,
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const lastName = values.lastName.trim();
  const firstName = values.firstName.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!lastName) {
    errors.lastName = t.required;
  } else if (lastName.length < 2) {
    errors.lastName = t.nameTooShort;
  }

  if (!firstName) {
    errors.firstName = t.required;
  } else if (firstName.length < 2) {
    errors.firstName = t.nameTooShort;
  }

  if (!email) {
    errors.email = t.required;
  } else if (!isValidEmail(email)) {
    errors.email = t.invalidEmail;
  }

  if (!values.subject) {
    errors.subject = t.required;
  }

  if (!message) {
    errors.message = t.required;
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = t.messageTooShort;
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = t.messageTooLong;
  }

  return errors;
}

function getSubjectLabel(subject: ContactSubject, t: ContactFormTexts): string {
  switch (subject) {
    case "order":
      return t.subjectOrder;
    case "delivery":
      return t.subjectDelivery;
    case "product":
      return t.subjectProduct;
    case "returns":
      return t.subjectReturns;
    case "warranty":
      return t.subjectWarranty;
    case "other":
      return t.subjectOther;
  }
}

// ============================================================
// 5. TYPES DE RÉPONSE API
// ============================================================

type ContactApiResponse =
  | {
      success: true;
      messageId?: string;
    }
  | {
      success: false;
      code?: string;
      errors?: Record<string, string>;
    };

// ============================================================
// 6. COMPOSANT PRINCIPAL
// ============================================================

export default function ContactForm({
  locale: rawLocale,
  className = "",
  id = "contact-form",
  apiEndpoint = "/api/contact",
  defaultSubject = "",
}: ContactFormProps) {
  const locale = normalizeCheckoutLocale(rawLocale);

  const t = TRANSLATIONS[locale];

  const generatedId = useId();
  const prefix = `cycloriva-contact-${generatedId}`;

  const [values, setValues] = useState<ContactFormValues>(() =>
    createInitialValues(defaultSubject),
  );

  const [errors, setErrors] = useState<ContactFormErrors>({});

  const [status, setStatus] = useState<SubmitStatus>("idle");

  const [serverError, setServerError] = useState<string | null>(null);

  const submittingRef = useRef(false);

  const sending = status === "sending";

  // ----------------------------------------------------------
  // CHANGEMENT DES CHAMPS
  // ----------------------------------------------------------

  function updateField<K extends keyof ContactFormValues>(
    field: K,
    nextValue: ContactFormValues[K],
  ) {
    if (submittingRef.current) {
      return;
    }

    setValues((current) => ({
      ...current,
      [field]: nextValue,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    if (status === "error" || status === "success") {
      setStatus("idle");
      setServerError(null);
    }
  }

  // ----------------------------------------------------------
  // VALIDATION D'UN CHAMP AU BLUR
  // ----------------------------------------------------------

  function validateFieldOnBlur(field: keyof ContactFormErrors) {
    const validation = validateContactForm(values, t);

    setErrors((current) => ({
      ...current,
      [field]: validation[field],
    }));
  }

  // ----------------------------------------------------------
  // RÉPONSE ERREUR SERVEUR
  // ----------------------------------------------------------

  function getServerErrorMessage(
    responseStatus: number,
    code?: string,
  ): string {
    if (responseStatus === 429 || code === "RATE_LIMITED") {
      return t.rateLimitError;
    }

    if (responseStatus === 503 || code === "CONTACT_SERVICE_UNAVAILABLE") {
      return t.configurationError;
    }

    return t.serverError;
  }

  // ----------------------------------------------------------
  // SOUMISSION
  // ----------------------------------------------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    setServerError(null);

    const validation = validateContactForm(values, t);

    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      setStatus("error");
      return;
    }

    // --------------------------------------------------------
    // ANTI-SPAM HONEYPOT
    // --------------------------------------------------------
    //
    // Ne pas envoyer les formulaires dont
    // le champ caché est rempli.
    //
    // L'API devra également valider ce champ.
    //
    // --------------------------------------------------------

    if (values.website.trim()) {
      setStatus("error");
      setServerError(t.serverError);
      return;
    }

    submittingRef.current = true;
    setStatus("sending");

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          locale,

          lastName: values.lastName.trim(),

          firstName: values.firstName.trim(),

          email: values.email.trim().toLowerCase(),

          subject: values.subject,

          message: values.message.trim(),

          website: values.website,
        }),
      });

      let result: ContactApiResponse | null = null;

      try {
        result = (await response.json()) as ContactApiResponse;
      } catch {
        result = null;
      }

      if (!response.ok || !result || result.success !== true) {
        const code =
          result && result.success === false ? result.code : undefined;

        setStatus("error");

        setServerError(getServerErrorMessage(response.status, code));

        return;
      }

      // ------------------------------------------------------
      // SUCCÈS CONFIRMÉ PAR LE SERVEUR
      // ------------------------------------------------------

      setStatus("success");
      setServerError(null);
      setErrors({});

      setValues(createInitialValues(defaultSubject));
    } catch {
      setStatus("error");
      setServerError(t.networkError);
    } finally {
      submittingRef.current = false;
    }
  }

  // ----------------------------------------------------------
  // ERREUR ACCESSIBLE
  // ----------------------------------------------------------

  function renderFieldError(field: keyof ContactFormErrors) {
    const error = errors[field];

    if (!error) {
      return null;
    }

    return (
      <p
        id={`${prefix}-${field}-error`}
        role="alert"
        className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-5 text-red-600"
      >
        <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </p>
    );
  }

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <section
      id={id}
      data-component="contact-form"
      className={`${CARD_CLASS} scroll-mt-24 ${className}`}
      aria-labelledby={`${prefix}-heading`}
    >
      {/* =====================================================
          TITRE
      ===================================================== */}

      <div className="mb-5 flex min-w-0 items-center gap-3">
        <Mail
          size={29}
          strokeWidth={1.9}
          aria-hidden="true"
          className="shrink-0 text-[#109b24] sm:size-8"
        />

        <h2
          id={`${prefix}-heading`}
          className="text-[19px] leading-tight font-black tracking-tight text-[#102b39] sm:text-[22px] lg:text-[23px]"
        >
          {t.title}
        </h2>
      </div>

      {/* =====================================================
          FORMULAIRE
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={sending}
        className="w-full min-w-0"
      >
        <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4">
          {/* =================================================
              NOM
          ================================================= */}

          <div className="min-w-0">
            <label htmlFor={`${prefix}-lastName`} className={LABEL_CLASS}>
              {t.lastName}
              <span aria-hidden="true" className="ml-1 text-red-600">
                *
              </span>
            </label>

            <div className="relative">
              <UserRound
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 left-3 text-[#718395]"
              />

              <input
                id={`${prefix}-lastName`}
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateField("lastName", event.target.value)
                }
                onBlur={() => validateFieldOnBlur("lastName")}
                autoComplete="family-name"
                placeholder={t.lastNamePlaceholder}
                maxLength={MAX_NAME_LENGTH}
                required
                disabled={sending}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={
                  errors.lastName ? `${prefix}-lastName-error` : undefined
                }
                className={`${INPUT_CLASS} pl-9 ${
                  errors.lastName ? "border-red-400" : ""
                }`}
              />
            </div>

            {renderFieldError("lastName")}
          </div>

          {/* =================================================
              PRÉNOM
          ================================================= */}

          <div className="min-w-0">
            <label htmlFor={`${prefix}-firstName`} className={LABEL_CLASS}>
              {t.firstName}
              <span aria-hidden="true" className="ml-1 text-red-600">
                *
              </span>
            </label>

            <div className="relative">
              <UserRound
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 left-3 text-[#718395]"
              />

              <input
                id={`${prefix}-firstName`}
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                onBlur={() => validateFieldOnBlur("firstName")}
                autoComplete="given-name"
                placeholder={t.firstNamePlaceholder}
                maxLength={MAX_NAME_LENGTH}
                required
                disabled={sending}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={
                  errors.firstName ? `${prefix}-firstName-error` : undefined
                }
                className={`${INPUT_CLASS} pl-9 ${
                  errors.firstName ? "border-red-400" : ""
                }`}
              />
            </div>

            {renderFieldError("firstName")}
          </div>

          {/* =================================================
              E-MAIL
          ================================================= */}

          <div className="col-span-2 min-w-0 lg:col-span-1">
            <label htmlFor={`${prefix}-email`} className={LABEL_CLASS}>
              {t.email}
              <span aria-hidden="true" className="ml-1 text-red-600">
                *
              </span>
            </label>

            <div className="relative">
              <Mail
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 left-3 text-[#718395]"
              />

              <input
                id={`${prefix}-email`}
                name="email"
                type="email"
                inputMode="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                onBlur={() => validateFieldOnBlur("email")}
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={t.emailPlaceholder}
                maxLength={MAX_EMAIL_LENGTH}
                required
                disabled={sending}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? `${prefix}-email-error` : undefined
                }
                className={`${INPUT_CLASS} pl-9 ${
                  errors.email ? "border-red-400" : ""
                }`}
              />
            </div>

            {renderFieldError("email")}
          </div>

          {/* =================================================
              SUJET
          ================================================= */}

          <div className="col-span-2 min-w-0 lg:col-span-1">
            <label htmlFor={`${prefix}-subject`} className={LABEL_CLASS}>
              {t.subject}
              <span aria-hidden="true" className="ml-1 text-red-600">
                *
              </span>
            </label>

            <div className="relative">
              <select
                id={`${prefix}-subject`}
                name="subject"
                value={values.subject}
                onChange={(event) => {
                  const next = event.target.value;

                  updateField("subject", isContactSubject(next) ? next : "");
                }}
                onBlur={() => validateFieldOnBlur("subject")}
                required
                disabled={sending}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? `${prefix}-subject-error` : undefined
                }
                className={`${INPUT_CLASS} appearance-none pr-9 ${
                  errors.subject ? "border-red-400" : ""
                }`}
              >
                <option value="">{t.subjectPlaceholder}</option>

                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {getSubjectLabel(subject, t)}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 right-3 text-[#102b39]"
              />
            </div>

            {renderFieldError("subject")}
          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <div className="col-span-2 min-w-0">
            <label htmlFor={`${prefix}-message`} className={LABEL_CLASS}>
              {t.message}
              <span aria-hidden="true" className="ml-1 text-red-600">
                *
              </span>
            </label>

            <div className="relative">
              <MessageCircle
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 left-3 text-[#718395]"
              />

              <textarea
                id={`${prefix}-message`}
                name="message"
                value={values.message}
                onChange={(event) => updateField("message", event.target.value)}
                onBlur={() => validateFieldOnBlur("message")}
                placeholder={t.messagePlaceholder}
                minLength={MIN_MESSAGE_LENGTH}
                maxLength={MAX_MESSAGE_LENGTH}
                required
                disabled={sending}
                rows={5}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? `${prefix}-message-error` : undefined
                }
                className={[
                  "min-h-32.5",
                  "w-full",
                  "min-w-0",
                  "resize-y",
                  "rounded-lg",
                  "border",
                  "border-[#cbd7e3]",
                  "bg-white",
                  "py-3",
                  "pr-3",
                  "pl-10",
                  "text-[13px]",
                  "leading-6",
                  "text-[#102b39]",
                  "placeholder:text-[#738596]",
                  "outline-none",
                  "transition-colors",
                  "focus:border-[#109b24]",
                  "focus:ring-2",
                  "focus:ring-[#109b24]/15",
                  "disabled:bg-slate-100",
                  "sm:min-h-36.25",
                  errors.message ? "border-red-400" : "",
                ].join(" ")}
              />
            </div>

            {renderFieldError("message")}
          </div>
        </div>

        {/* ===================================================
            CHAMP ANTI-SPAM INVISIBLE
        =================================================== */}

        <div
          aria-hidden="true"
          className="absolute -left-2499.75 h-px w-px overflow-hidden"
        >
          <label htmlFor={`${prefix}-website`}>Website</label>

          <input
            id={`${prefix}-website`}
            type="text"
            name="website"
            value={values.website}
            onChange={(event) => updateField("website", event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* ===================================================
            ERREUR SERVEUR
        =================================================== */}

        {status === "error" && serverError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <span>{serverError}</span>
          </div>
        )}

        {/* ===================================================
            CONFIRMATION DE RÉCEPTION
        =================================================== */}

        {status === "success" && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 flex items-start gap-3 rounded-lg border border-[#b7dfb7] bg-[#edf9eb] p-4"
          >
            <CheckCircle2
              size={22}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[#109b24]"
            />

            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#0b7021]">
                {t.successTitle}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#28523a]">
                {t.successMessage}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            BOUTON VERT
        =================================================== */}

        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className={[
            "group",
            "mt-6",
            "inline-flex",
            "min-h-12",
            "w-full",
            "items-center",
            "justify-center",
            "gap-3",
            "rounded-lg",
            "bg-[#008f17]",
            "px-5",
            "py-3",
            "text-center",
            "text-[14px]",
            "font-extrabold",
            "text-white",
            "shadow-[0_3px_8px_rgba(0,143,23,0.12)]",
            "transition-colors",
            "hover:bg-[#087b19]",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[#109b24]",
            "disabled:cursor-not-allowed",
            "disabled:bg-[#93b89b]",
            "sm:text-[15px]",
          ].join(" ")}
        >
          {sending ? (
            <>
              <LoaderCircle
                size={19}
                className="animate-spin"
                aria-hidden="true"
              />

              {t.sending}
            </>
          ) : (
            <>
              <Send
                size={19}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />

              {t.send}
            </>
          )}
        </button>

        {/* ===================================================
            CONFIDENTIALITÉ
        =================================================== */}

        <p className="mt-3 flex items-start justify-center gap-2 text-center text-[11px] leading-5 text-[#6b7e89]">
          <ShieldCheck
            size={15}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.privacyText}
        </p>
      </form>
    </section>
  );
}

// ============================================================
// 7. EXPORT NOMMÉ
// ============================================================

export { ContactForm };

// ============================================================
// FIN — CYCLORIVA CONTACT FORM
// ============================================================
