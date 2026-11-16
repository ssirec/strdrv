
import { defineConfig, svgoOptimizer } from 'astro/config';
import type { Config } from 'svgo';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import astroExpressiveCode from 'astro-expressive-code';
import { externalLinking } from './src/plugins/external-linking';
import { rehypeYoutubePlugin } from './src/plugins/youtube-embed';
import { themeConfig } from './theme.config';
import { setOnDemandPrerender, getOnDemandSitemapPages } from './src/utils/on-demand-render';

// i18n config for sitemap integration
export const sitemap_i18n = {
  defaultLocale: themeConfig.i18n.defaultLocale,
  locales: themeConfig.i18n.locales.reduce((acc, lang) => ({ ...acc, [lang]: lang }), {}),
};

const sitemapExcludedPaths = new Set([
  '/404',
  '/404_dynamic',
  ...themeConfig.i18n.locales.map((locale) => `/${locale}/404`),
]);

// Shared SVGO config used by the experimental svgOptimizer, astro-icon, and astro-compress.
const svgoConfig: Config = {
  multipass: true,
  floatPrecision: 5,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          inlineStyles: false,
          mergeStyles: false,
          removeHiddenElems: false,
          convertShapeToPath: false,
          convertEllipseToCircle: false,
          convertPathData: false,
          convertTransform: {
            degPrecision: 1,
            transformPrecision: 3,
          },
          removeEmptyAttrs: false,
          removeDesc: false,
        },
      },
    },
    'convertStyleToAttrs',
    'removeRasterImages',
    'reusePaths',
    {
      name: 'removeXlink',
      params: { includeLegacy: true },
    },
    {
      name: 'prefixIds',
      params: {
        delim: '_',
        prefix: () => Math.random().toString(36).slice(2, 8),
        prefixIds: true,
        prefixClassNames: false,
      },
    },
  ],
};

// https://astro.build/config
export default defineConfig({
  site: themeConfig.site,

  // Static site generation for Cloudflare Pages
  output: 'static',
  session: false,
  trailingSlash: 'never',

  build: {
    format: 'file',
  },

  image: {
    remotePatterns: [{ protocol: 'https' }],
    responsiveStyles: true,
    layout: 'constrained',
    breakpoints: [414, 576, 768, 976, 1440, 1600],
  },

  experimental: {
    svgOptimizer: svgoOptimizer(svgoConfig),
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['debug', 'ms', 'reading-time', 'fdir > picomatch', 'expressive-code > postcss'],
      exclude: ['astro/assets/services/noop'],
    },
  },

  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeYoutubePlugin,
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
          },
        ],
        [
          externalLinking,
          {
            domain: themeConfig.site,
          },
        ],
      ],
    }),
  },

  i18n: {
    defaultLocale: themeConfig.i18n.defaultLocale,
    locales: themeConfig.i18n.locales,
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'redirect',
    },
  },

  integrations: [
    setOnDemandPrerender,
    sitemap({
      xslURL: '/sitemap.xsl',
      i18n: sitemap_i18n,
      filter: (page) => !sitemapExcludedPaths.has(new URL(page).pathname),
      customPages: getOnDemandSitemapPages(),
      customSitemaps: themeConfig.events?.dynamicEvents?.pullFromAddToCalendarPro
        ? [themeConfig.site.replace(/\/+$/, '') + '/dynamic-events-sitemap.xml']
        : [],
    }),
    icon({
      svgoOptions: svgoConfig,
    }),
    astroExpressiveCode(),
    (await import('astro-compress')).default({
      CSS: false,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      SVG: {
        svgo: svgoConfig,
      },
    }),
  ],
});
