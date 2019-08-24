/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [{
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
}, ];

const siteConfig = {
    title: 'ConfigCat Docs', // Title for your website.
    tagline: 'Documentation regarding the ConfigCat website and SDKs',
    url: 'https://docs.configcat.com', // Your website URL
    baseUrl: '/', // Base URL for your project */
    // For github.io type URLs, you would set the url and baseUrl like:
    //   url: 'https://facebook.github.io',
    //   baseUrl: '/test-site/',
    noindex: true,
    // Used for publishing and more
    projectName: 'configcat',
    organizationName: 'configcat',
    // For top-level user or org sites, the organization is still the same.
    // e.g., for the https://JoelMarcey.github.io site, it would be set like...
    //   organizationName: 'JoelMarcey'

    // For no header links in the top nav bar -> headerLinks: [],
    headerLinks: [{
            href: 'https://www.configcat.com',
            label: 'ConfigCat.com'
        },
        {
            href: 'https://configcat.com/Home/Blog',
            label: 'Blog'
        }
    ],

    // If you have users set above, you add it here:
    users,

    /* path to images for header/footer */
    headerIcon: 'img/cat.svg',
    footerIcon: 'img/cat.svg',
    favicon: 'img/favicon.png',

    /* Colors for website */
    colors: {
        primaryColor: '#f7912d',
        secondaryColor: '#f46a20',
    },

    /* Custom fonts for website */
    /*
    fonts: {
      myFont: [
        "Times New Roman",
        "Serif"
      ],
      myOtherFont: [
        "-apple-system",
        "system-ui"
      ]
    },
    */
    // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
    copyright: `Copyright © ${new Date().getFullYear()} ConfigCat`,

    highlight: {
        // Highlight.js theme to use for syntax highlighting in code blocks.
        theme: 'tomorrow-night'
    },

    // Add custom scripts here that would be placed in <script> tags.
    scripts: [
        'https://buttons.github.io/buttons.js',
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.1/clipboard.min.js',
            async: true
        },
        '/js/code-blocks-buttons.js',
        '/js/tawk.to.js'
    ],

    stylesheets: [
        '/css/code-blocks-buttons.css'
    ],

    usePrism: true,
    // On page navigation for the current documentation page.
    onPageNav: 'separate',
    // No .html extensions for paths.
    cleanUrl: true,

    // Open Graph and Twitter card images.
    ogImage: 'img/docusaurus.png',
    twitterImage: 'img/docusaurus.png',
    gaTrackingId: 'UA-126035559-3',
    editUrl: 'https://github.com/configcat/docs/edit/master/docs/',
    algolia: {
        apiKey: '36b9ea4801b9b88e1e8fa2e42d3cc705',
        indexName: 'configcat',
        algoliaOptions: {} // Optional, if provided by Algolia
    },
    // You may provide arbitrary config keys to be used as needed by your
    // template. For example, if you need your repo's URL...
    //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;