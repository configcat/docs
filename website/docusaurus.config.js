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
          position: "left"
        },
        {
          href: 'https://configcat.com/pricing/',
          label: 'Pricing',
          position: "left"
        },
        {
          href: 'https://configcat.com/architecture/',
          label: 'Architecture',
          position: "left"
        },
        {
          href: 'https://status.configcat.com',
          label: 'Service Status Monitor',
          position: "left"
        },
        {
          href: 'https://configcat.com/blog/',
          label: 'Blog',
          position: "left"
        },
        {
          href: 'https://api.configcat.com/docs/',
          label: 'Public Management API',
          position: "right"
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
              href: '/search',
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
      additionalLanguages: ['hcl', 'csharp', 'kotlin', 'java', 'powershell', 'swift', 'php', 'ruby', 'elixir', 'dart'],
    },
    algolia: {
      appId: '2KJV4BA55F',
      apiKey: '893560578e902fe2755446f51c96d895',
      indexName: 'configcat',
      searchParameters: {}
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
          editUrl:
            'https://github.com/configcat/docs/edit/master/website/',
          routeBasePath: '/'
        },
        gtag: {
          trackingID: "G-VNVQ03TVR2"
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: {
          archiveBasePath: null
        }
      },
    ],
  ],
  scripts: [
    'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js'
  ],
  stylesheets: ['https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css']
};
