module.exports = {
  title: 'ConfigCat Docs',
  tagline: 'Learn more on how to use ConfigCat Feature Flags.',
  url: 'https://configcat.com',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  trailingSlash: true,
  favicon: 'img/favicon.png',
  organizationName: 'configcat', // Usually your GitHub org/user name.
  projectName: 'configcat', // Usually your repo name.
  plugins: [
    require.resolve('docusaurus-plugin-image-zoom'),
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
            to: '/sdk-reference/dotnet',
            from: '/sdk-reference/csharp',
          },
          {
            to: '/targeting/targeting-overview',
            from: ['/advanced/targeting']
          },
          {
            to: '/targeting/user-object',
            from: ['/advanced/user-object']
          }
        ],
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
      title: 'ConfigCat Docs',
      logo: {
        alt: 'ConfigCat',
        src: 'img/cat.svg',
      },
      items: [
        {
          href: 'https://configcat.com/',
          label: 'configcat.com',
          position: 'left',
        },
        {
          href: 'https://configcat.com/pricing/',
          label: 'Pricing',
          position: 'left',
        },
        {
          href: 'https://configcat.com/architecture/',
          label: 'Architecture',
          position: 'left',
        },
        {
          href: 'https://configcat.com/blog/',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://status.configcat.com',
          label: 'Service Status',
          position: 'right',
        },
        {
          href: 'https://api.configcat.com/docs/',
          label: 'API',
          position: 'right',
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
              href: 'https://api.configcat.com/docs/',
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
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/palenight'),
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
    zoom: {
      selector: '.markdown img.zoomable',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/configcat/docs/tree/master/website',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        blog: {
          archiveBasePath: null,
        },
      },
    ],
  ],
  scripts: [],
  stylesheets: [],
};
