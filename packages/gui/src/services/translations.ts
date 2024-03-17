import translate, { Options, Translate } from 'translate.js';
import { plural_EN } from 'translate.js/pluralize';
import { LANGUAGE } from '../utils';

export type Languages = 'nl' | 'en' | 'de' | 'unknown';

export const messages = {
  HOME: { TITLE: 'home', ROUTE: '/home' },
  ABOUT: { TITLE: 'About the app', ROUTE: '/about' },
  SETTINGS: { TITLE: 'Settings', ROUTE: '/settings' },
  LANDING: { TITLE: 'Introduction', ROUTE: '/' },
  VEHICLES: 'Vehicles',
  VEHICLE: 'Vehicle',
  DESTINATION: 'Destination',
  POIS: 'Points of interest',
  POI: 'POINT OF INTEREST',
  POI2: 'Start point',
  TYPE: 'Type',
  CAR: 'CAR',
  TRUCK: 'TRUCK',
  BICYCLE: 'BICYCLE',
  MOTORCYCLE: 'MOTORCYCLE',
  SCOOTER: 'SCOOTER',
  PEDESTRIAN: 'PEDESTRIAN',
  WAREHOUSE: 'WAREHOUSE',
  DEFAULT_ICON: 'Use default icon',
  SELECT_ROLE: 'Select role',
  SELECT_LANGUAGE: 'Select language',
  APP_NAME: 'Application name',
  MAP_URL: 'Map service URL',
  ETA: 'Estimated time of arrival',
  ARRIVED: 'You have arrived',
  LAT: 'Latitude',
  LON: 'Longitude',
  ICON: 'Icon',
  USER: 'User',
  EDITOR: 'Editor',
  ADMIN: 'Administrator',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  YES: 'Yes',
  NO: 'No',
  OK: 'Ok',
  NAME: 'Name',
  PICK_ONE: 'Pick one',
  PICK_MORE: 'Pick one or more',
  DESCRIPTION: 'Description',
  DELETE_ITEM: {
    TITLE: 'Delete {item}',
    DESCRIPTION: 'Are you certain you want to delete this {item}. There is no turning back?',
  },
  SAVE_BUTTON: {
    LABEL: 'Save',
    TOOLTIP: 'Save unsaved changes',
  },
  INTRO: `A traffic simulator to simulate traffic going from A to B. It will simply follow the route, but can be paused and rerouted if desired. 
  There are two modes: one for regular users, who can only view the dispatched vehicles and their estimated time of arrival, 
  and administrators, who can create and edit simulated vehicles.`,
};

export const messagesNL: typeof messages = {
  HOME: { TITLE: 'home', ROUTE: '/home' },
  ABOUT: { TITLE: 'over de app', ROUTE: '/over' },
  SETTINGS: { TITLE: 'Instellingen', ROUTE: '/instellingen' },
  LANDING: { TITLE: 'Introductie', ROUTE: '/' },
  VEHICLES: 'Voertuigen',
  VEHICLE: 'Voertuig',
  DESTINATION: 'Bestemming',
  POIS: 'Punten van interesse',
  POI: 'Punt van interesse',
  POI2: 'Startpunt',
  TYPE: 'Type',
  CAR: 'AUTO',
  TRUCK: 'VRACHTWAGEN',
  BICYCLE: 'FIETS',
  MOTORCYCLE: 'MOTOR',
  SCOOTER: 'SCOOTER',
  PEDESTRIAN: 'WANDELAAR',
  WAREHOUSE: 'WARENHUIS',
  DEFAULT_ICON: 'Gebruik standaard icoon',
  SELECT_ROLE: 'Selecteer rol',
  SELECT_LANGUAGE: 'Selecteer taal',
  APP_NAME: 'Applicatie naam',
  MAP_URL: 'Kaartservice URL',
  ETA: 'Verwachte tijd van aankomst',
  ARRIVED: 'U bent aangekomen',
  LAT: 'Latitude',
  LON: 'Longitude',
  ICON: 'Icoon',
  USER: 'Gebruiker',
  EDITOR: 'Editor',
  ADMIN: 'Administrator',
  CANCEL: 'Afbreken',
  DELETE: 'Verwijderen',
  YES: 'Ja',
  NO: 'Nee',
  OK: 'Ok',
  NAME: 'Naam',
  PICK_ONE: 'Maak een keuze',
  PICK_MORE: 'Kies één of meer',
  DESCRIPTION: 'Omschrijving',
  DELETE_ITEM: {
    TITLE: 'Verwijder {item}',
    DESCRIPTION: 'Weet u zeker dat u de {item} wilt verwijderen? Dit kan niet ongedaan gemaakt worden.',
  },
  SAVE_BUTTON: {
    LABEL: 'Opslaan',
    TOOLTIP: 'Sla aanpassingen op',
  },
  INTRO: `Een verkeerssimulator om het verkeer van A naar B te simuleren. Het zal eenvoudigweg de route volgen, maar kan worden gepauzeerd en omgeleid indien gewenst. 
  Er zijn twee modi: één voor reguliere gebruikers, die alleen de verzonden voertuigen en hun geschatte aankomsttijd kunnen bekijken, 
  en beheerders, die gesimuleerde voertuigen kunnen creëren en bewerken.`,
};

export const messagesDE = {
  HOME: { TITLE: 'Zuhause', ROUTE: '/home' },
  ABOUT: { TITLE: 'Über die App', ROUTE: '/about' },
  SETTINGS: { TITLE: 'Einstellungen', ROUTE: '/settings' },
  LANDING: { TITLE: 'Einführung', ROUTE: '/' },
  VEHICLES: 'Fahrzeuge',
  VEHICLE: 'Fahrzeug',
  DESTINATION: 'Ziel',
  POIS: 'Sehenswürdigkeiten',
  POI: 'SEHENSWÜRDIGKEIT',
  POI2: 'Startpunkt',
  TYPE: 'Typ',
  CAR: 'AUTO',
  TRUCK: 'LASTWAGEN',
  BICYCLE: 'FAHRRAD',
  MOTORCYCLE: 'MOTORRAD',
  SCOOTER: 'ROLLER',
  PEDESTRIAN: 'FUSSGÄNGER',
  WAREHOUSE: 'LAGER',
  DEFAULT_ICON: 'Standard-Symbol verwenden',
  SELECT_ROLE: 'Rolle auswählen',
  SELECT_LANGUAGE: 'Sprache auswählen',
  APP_NAME: 'Anwendungsname',
  MAP_URL: 'Kartendienst-URL',
  ETA: 'Geschätzte Ankunftszeit',
  ARRIVED: 'Sie sind angekommen',
  LAT: 'Breitengrad',
  LON: 'Längengrad',
  ICON: 'Symbol',
  USER: 'Benutzer',
  EDITOR: 'Editor',
  ADMIN: 'Administrator',
  CANCEL: 'Abbrechen',
  DELETE: 'Löschen',
  YES: 'Ja',
  NO: 'Nein',
  OK: 'Ok',
  NAME: 'Name',
  PICK_ONE: 'Wähle eins',
  PICK_MORE: 'Wähle eins oder mehrere',
  DESCRIPTION: 'Beschreibung',
  DELETE_ITEM: {
    TITLE: 'Lösche {item}',
    DESCRIPTION: 'Sind Sie sicher, dass Sie dieses {item} löschen möchten? Es gibt kein Zurück?',
  },
  SAVE_BUTTON: {
    LABEL: 'Speichern',
    TOOLTIP: 'Ungespeicherte Änderungen speichern',
  },
  INTRO: `Ein Verkehrssimulator, um den Verkehr von A nach B zu simulieren. Es wird einfach der Route folgen, kann aber pausiert und umgeleitet werden, wenn gewünscht. 
  Es gibt zwei Modi: einen für normale Benutzer, die nur die entsandten Fahrzeuge und ihre geschätzte Ankunftszeit sehen können, 
  und Administratoren, die simulierte Fahrzeuge erstellen und bearbeiten können.`,
};

const setGuiLanguage = (language: Languages) => {
  const options = {
    // These are the defaults:
    debug: true, //[Boolean]: Logs missing translations to console and add "@@" around output, if `true`.
    array: true, //[Boolean]: Returns translations with placeholder-replacements as Arrays, if `true`.
    resolveAliases: true, //[Boolean]: Parses all translations for aliases and replaces them, if `true`.
    pluralize: plural_EN, //[Function(count)]: Provides a custom pluralization mapping function, should return a string (or number)
    useKeyForMissingTranslation: true, //[Boolean]: If there is no translation found for given key, the key is used as translation, when set to false, it returns undefiend in this case
  };
  return translate(language === 'nl' ? messagesNL : language === 'de' ? messagesDE : messages, options) as Translate<
    typeof messages,
    Options
  >;
};

export type TextDirection = 'rtl' | 'ltr';

export type Locale = {
  /** Friendly name */
  name: string;
  /** Fully qualified name, e.g. 'en-UK' */
  fqn: string;
  /** Text direction: Left to right or right to left */
  dir?: TextDirection;
  /** Is the default language */
  default?: boolean;
};

export type Locales = Record<Languages, Locale>;

export type Listener = (locale: string, dir: TextDirection) => void;

const onChangeLocale: Listener[] = [];

export const i18n = {
  defaultLocale: 'en' as Languages,
  currentLocale: 'unknown' as Languages,
  locales: {} as Locales,
  init,
  addOnChangeListener,
  loadAndSetLocale,
  // i18n: {} as I18n,
  // } as {
  //   defaultLocale: Languages;
  //   currentLocale: Languages;
  //   locales: Locales;
  //   t: Translate<typeof messages, Options>;
};

export let t: Translate<typeof messages, Options>;

async function init(locales: Locales, selectedLocale: Languages) {
  i18n.locales = locales;
  const defaultLocale = (Object.keys(locales) as Languages[]).filter((l) => (locales[l] as Locale).default).shift();
  if (defaultLocale) {
    i18n.defaultLocale = defaultLocale || selectedLocale;
  }
  document.documentElement.setAttribute('lang', selectedLocale);
  await loadAndSetLocale(selectedLocale);
}

function addOnChangeListener(listener: Listener) {
  onChangeLocale.push(listener);
}

async function loadAndSetLocale(newLocale: Languages) {
  localStorage.setItem(LANGUAGE, newLocale);
  if (i18n.currentLocale === newLocale) {
    return;
  }

  const resolvedLocale = supported(newLocale) ? newLocale : i18n.defaultLocale;
  i18n.currentLocale = resolvedLocale;
  t = setGuiLanguage(newLocale);
  // i18n.i18n = {
  //   editRepeat: t('i18n', 'editRepeat'),
  //   createRepeat: t('i18n', 'createRepeat'),
  //   deleteItem: t('i18n', 'deleteItem'),
  //   agree: t('i18n', 'agree'),
  //   disagree: t('i18n', 'disagree'),
  //   pickOne: t('i18n', 'pickOne'),
  //   pickOneOrMore: t('i18n', 'pickOneOrMore'),
  //   cancel: t('i18n', 'cancel'),
  //   save: t('i18n', 'save'),
  // } as I18n;
  onChangeLocale.forEach((listener) => listener(i18n.currentLocale, dir()));
}

function supported(locale: Languages) {
  return Object.keys(i18n.locales).indexOf(locale) >= 0;
}

function dir(locale = i18n.currentLocale) {
  return (i18n.locales[locale] as Locale).dir || 'ltr';
}
