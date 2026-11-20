import type { ThemeConfig } from './types/theme-config.d.ts';
import { expressiveCodeThemes } from './expressive-code-themes.mjs';

// language files from ./src/i18n
// The `with { type: 'json' }` import attribute is required so this file can also be
// imported from a plain ESM context (e.g. `ec.config.mjs`, which Node loads directly).
import slStrings from './src/i18n/sl.json' with { type: 'json' };
import itStrings from './src/i18n/it.json' with { type: 'json' };
import enStrings from './src/i18n/en.json' with { type: 'json' };
import deStrings from './src/i18n/de.json' with { type: 'json' };
import frStrings from './src/i18n/fr.json' with { type: 'json' };
import esStrings from './src/i18n/es.json' with { type: 'json' };

export const themeConfig: ThemeConfig = {
  // `import.meta.env?.` is guarded because this file is also imported from `ec.config.mjs`,
  // which Node loads as plain ESM where `import.meta.env` is not defined (only Vite injects it).
  site: import.meta.env?.SITE_OVERRIDE || 'https://mediaservis.si',
  primaryColor: '#f26430', // mind to also update the Tailwind config if you change this!
  themeColor: '#090d18',
  generateWebmanifest: true,
  name: 'MediaServis Nova Gorica',
  shortName: 'MediaServis',
  darkMode: true,
  robots: import.meta.env?.ROBOTS || 'index, follow',
  xHandle: '',

  // Structured data
  author: {
    type: 'Organization',
    name: 'MediaServis',
    url: 'https://mediaservis.si',
    image: '',
  },
  publisher: {
    type: 'Organization',
    name: 'Sirsa d.o.o.',
    url: 'https://mediaservis.si',
    image: '',
  },

  // I18n
  i18n: {
    defaultLocale: 'sl',
    locales: ['sl', 'it', 'en', 'de', 'fr', 'es'],
    languages: {
      sl: 'Slovenščina',
      it: 'Italiano',
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
      es: 'Español',
    },
    languageModules: {
      sl: slStrings,
      it: itStrings,
      en: enStrings,
      de: deStrings,
      fr: frStrings,
      es: esStrings,
    },
    translatedStructuredData: {},
  },

  // md(x) code block rendering - edit them in ./expressive-code-themes.mjs
  expressiveCodeThemes,

  // content/articles settings
  articles: {
    imageFallback: true,
    gridView: true,
    textOverImage: false,
    categories: true, // if set false, make sure to also remove category directories under /pages
    tags: true, // if set false, make sure to also remove tag directories under /pages
    entriesPerPage: 4,
    tocMaxDepth: 3,
    defaults: {
      author: {
        name: 'MediaServis',
        url: 'https://mediaservis.si',
      },
    },
    social: {
      // default values - can be overridden at the Single component level
      xHandle: '', // to be added as "via @handle" in the tweet
      buttons: {
        email: true,
        facebook: true,
        hackernews: false,
        linkedin: false,
        pinterest: false,
        reddit: false,
        telegram: false,
        x: false,
        whatsapp: true,
      },
      buttonsSmallScreen: {
        email: true,
        facebook: true,
        hackernews: false,
        linkedin: false,
        pinterest: false,
        reddit: false,
        telegram: false,
        x: false,
        whatsapp: true,
      },
    },
  },

  // promotion settings (demo promos turned off)
  promotions: {
    newsletterSignup: false,
    footerBanner: false,
    navAd: false,
    topBanner: false,
    heroChip: false,
  },

  // Nothing is rendered on demand, so no server adapter is needed (fixes NoAdapterInstalled).
  onDemandRenderedCollections: [],

  // content/events settings
  events: {
    // you can also dynamically integrate events from your Add to Calendar PRO account (https://add-to-calendar-pro.com/), having your API key set as environment variable ADD_TO_CALENDAR_PRO_API_KEY.
    dynamicEvents: {
      pullFromAddToCalendarPro: false,
      filterBy: {
        from: '',
        to: '',
        group: '',
      },
    },
  },

  // LLM and coding assistant settings
  llms: {
    autoGeneration: true,
    intro: 'MediaServis Nova Gorica je servis mobilnih telefonov (med drugim iPhone): diagnostika, popravila in pomoč pri težavah z napravami. Lokacija in navodila za pot so na spletni strani.',
    excludePagesPattern: ['/integration/**'],
    includePages: [],
    addArticles: 'selected',
    addEvents: 'all',
    addFAQ: 'all',
  },

  askAiTrigger: 'Povej mi več o servisu MediaServis Nova Gorica: katere storitve ponuja in kako ga obiščem?',
};
