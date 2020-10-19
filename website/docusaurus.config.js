module.exports = {
  title: 'ConfigCat Docs',
  tagline: 'Documentation regarding the ConfigCat website and SDKs',
  url: 'https://configcat.com',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.png',
  organizationName: 'configcat', // Usually your GitHub org/user name.
  projectName: 'configcat', // Usually your repo name.
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: 'ConfigCat Docs',
      logo: {
        alt: 'ConfigCat',
        src: 'img/cat.svg',
      },
      items: [
        {
          href: 'https://www.configcat.com',
          label: 'ConfigCat.com',
          position: "right"
        },
        {
            href: 'https://configcat.com/blog',
            label: 'Blog',
            position: "right"
        },
        {
            href: 'https://status.configcat.com',
            label: 'Service Status Monitor',
            position: "right"
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Engage',
          items: [
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
        {
          title: 'Know more',
          items: [
            {
              label: 'ConfigCat.com',
              href: 'https://configcat.com',
            }, 
            {
              label: 'Blog',
              href: 'https://configcat.com/blog',
            }, 
            {
              label: 'GitHub repos',
              href: 'https://github.com/configcat',
            },
          ],
        },
        {
          title: 'Need help?',
          items: [
            {
              label: 'Service Status Monitor',
              href: 'https://status.configcat.com',
            },
            {
              label: 'Join our Community Slack',
              href: 'https://join.slack.com/t/configcat-community/shared_invite/enQtMzkwNDg3MjQ3MTUyLWY1ZmE0NjY5NjA0YjAzMWU3MDg3ODhkMGI2ZjdmZjZmYTY4YTg1NmQ0YzBhMTVhOGE5YmNiYTI5OTg4NmNjYTQ',
            },
            {
              label: 'Contact us',
              href: 'https://configcat.com/support',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ConfigCat.`,
    },
    prism: {
      additionalLanguages: ['hcl', 'csharp', 'kotlin', 'java', 'powershell', 'swift', 'php', 'ruby'],
    },
    algolia: {
      apiKey: '36b9ea4801b9b88e1e8fa2e42d3cc705',
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
          // Please change this to your repo.
          editUrl:
            'https://github.com/configcat/docs/edit/master/website/',
            routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
