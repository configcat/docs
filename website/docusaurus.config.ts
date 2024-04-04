import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ConfigCat Docs',
  tagline: 'Learn more on how to use ConfigCat Feature Flags.',
  url: 'https://configcat.com',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onBrokenMarkdownLinks: 'throw',
  trailingSlash: true,
  favicon: 'img/favicon.png',
  organizationName: 'configcat', // Usually your GitHub org/user name.
  projectName: 'configcat', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    [
      '@docusaurus/plugin-google-tag-manager',
      {
        containerId: 'GTM-5LP6XWS5',
      },
    ],
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/sdk-reference/csharp',
            to: '/sdk-reference/dotnet',
          },
          {
            from: '/advanced/public-api',
            to: '/api/reference/configcat-public-management-api',
          },
          {
            from: '/advanced/targeting',
            to: '/targeting/targeting-overview',
          },
          {
            from: '/advanced/user-object',
            to: '/targeting/user-object',
          },
          {
            from: '/advanced/targeting/segments',
            to: '/targeting/targeting-rule/segment-condition',
          },
          {
            from: '/V2/targeting/targeting-overview',
            to: '/targeting/targeting-overview',
          },
          {
            from: '/V2/targeting/targeting-rule/targeting-rule-overview',
            to: '/targeting/targeting-rule/targeting-rule-overview',
          },
          {
            from: '/V2/targeting/targeting-rule/user-condition',
            to: '/targeting/targeting-rule/user-condition',
          },
          {
            from: '/V2/targeting/targeting-rule/segment-condition',
            to: '/targeting/targeting-rule/segment-condition',
          },
          {
            from: '/V2/targeting/targeting-rule/flag-condition',
            to: '/targeting/targeting-rule/flag-condition',
          },
          {
            from: '/V2/targeting/percentage-options',
            to: '/targeting/percentage-options',
          },
          {
            from: '/V2/targeting/user-object',
            to: '/targeting/user-object',
          },
          {
            from: '/V2/targeting/feature-flag-evaluation',
            to: '/targeting/feature-flag-evaluation',
          },
        ],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api-content',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: './api/sidebars.ts',
        docRootComponent: "@theme/DocRoot",
        docItemComponent: "@theme/ApiItem",

      },
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api-docs',
        docsPluginId: 'api-content',
        config: {
          server: {
            specPath: 'https://api.configcat.com/docs/v1/swagger.json',
            outputDir: 'api/reference',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag'
            },
          },
        },
      },
    ],
    // ['./src/plugins/smartlook',
    //   {
    //     smartlookKey: '05d0e4ca90c61150955104a9d4b76ab16a0b2380',
    //   }
    // ],
  ],
  themeConfig: {
    image: '/img/docs-cover.png',
    navbar: {
      title: 'ConfigCat',
      logo: {
        alt: 'ConfigCat',
        src: 'img/cat.svg',
      },
      items: [
        {
          type: 'docSidebar',
          label: 'Docs',
          sidebarId: 'docs',
          position: 'left',
        },
        {
          type: 'docSidebar',
          label: 'SDKs',
          sidebarId: 'sdks',
          position: 'left',
        },
        {
          to: '/api/reference/configcat-public-management-api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://configcat.com/blog/',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://configcat.com/',
          label: 'configcat.com',
          position: 'left',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: '/search',
          label: 'Search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Legal & Company',
          items: [
            {
              label: 'Terms & Policies',
              href: 'https://configcat.com/policies/',
            },
            {
              label: 'Public Roadmap',
              href: 'https://trello.com/b/8gYunIb6/configcat-public-roadmap',
            },
            {
              label: 'Our Team',
              href: 'https://configcat.com/team/',
            },
            {
              label: 'Jobs',
              href: 'https://configcat.com/jobs/',
            },
          ],
        },
        {
          title: 'Know more',
          items: [
            {
              label: 'Pricing',
              href: 'https://configcat.com/pricing/',
            },
            {
              label: 'On-Premise Self Hosted Plan',
              href: 'https://configcat.com/on-premise/',
            },
            {
              label: 'Referrals',
              href: 'https://configcat.com/referrals/',
            },
            {
              label: 'Blog',
              href: 'https://configcat.com/blog/',
            },
            {
              label: 'Subscription Plan Limits',
              href: '/subscription-plan-limits/',
            },
          ],
        },
        {
          title: 'Help & Resources',
          items: [
            {
              label: 'Service Status Monitor',
              href: 'https://status.configcat.com',
            },
            {
              label: 'Architectural Overview',
              href: 'https://configcat.com/architecture/',
            },
            {
              label: 'Public Management API Docs',
              to: '/api/reference/configcat-public-management-api',
            },
            {
              label: 'Search the documentation',
              href: '/search/',
            },
            {
              label: 'Support',
              href: 'https://configcat.com/support/',
            },
          ],
        },
        {
          title: 'Engage',
          items: [
            {
              label: 'Talk with our team on Community Slack',
              href: 'https://configcat.com/slack/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/configcat',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/configcat',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/configcat',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/configcat/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ConfigCat.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.palenight,
      additionalLanguages: [
        'hcl',
        'csharp',
        'kotlin',
        'java',
        'powershell',
        'swift',
        'php',
        'ruby',
        'elixir',
        'dart',
        'tsx',
        'clike',
        'c',
        'objectivec',
        'protobuf',
        'json',
        'bash'
      ],
    },
    algolia: {
      // The search crawling repo can be found here: https://github.com/configcat/docsearch
      appId: '0MLXBNIK0Q',
      apiKey: '6484bd6c163502bacf229cb8d22024ab',
      indexName: 'configcat',
      contextualSearch: false,
      searchPagePath: 'search',
      searchParameters: {},
      externalUrlRegex: 'configcat\\.com/blog',
    },
    imgZoom: {
      selector: '.markdown img:not([src^="http"])',
      zoomedInClass: 'zoomed-in-img',
    }
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          sidebarCollapsible: true,
          editUrl: 'https://github.com/configcat/docs/tree/master/website',
          routeBasePath: '/',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Config V2',
              path: '/',
            },
            "V1": {
              label: 'Config V1 (legacy)',
              path: '/V1',
              noIndex: true
            },
          },
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
        blog: {
          archiveBasePath: null,
        },
        sitemap: {
          ignorePatterns: ['/docs/V1/**'],
        }
      } satisfies Preset.Options,
    ],
  ],
  themes: ["docusaurus-theme-openapi-docs"],
  scripts: [],
  stylesheets: [],
  clientModules: ['./src/client-modules/img-zoom'],
};

export default config;