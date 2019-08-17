/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
    title: 'ConfigCat Docs', // Title for your website.
    tagline: 'Documentation regarding the ConfigCat website and SDKs',
    url: 'https://configcat.com', // Your website URL
    baseUrl: '/docs/', // Base URL for your project */

    // Used for publishing and more
    projectName: 'configcat',
    organizationName: 'configcat',

    // For no header links in the top nav bar -> headerLinks: [],
    headerLinks: [{
            href: 'https://configcat.com',
            label: 'ConfigCat.com'
        },
        {
            href: 'https://configcat.com/blog',
            label: 'Blog'
        }
    ],

    // If you have users set above, you add it here:
    users,

    /* path to images for header/footer */
    headerIcon: '/docs/img/cat.svg',
    footerIcon: '/docs/img/cat.svg',
    favicon: '/docs/img/favicon.png',

    /* Colors for website */
    colors: {
        primaryColor: '#f7912d',
        secondaryColor: '#f46a20',
    },

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
        '/docs/js/code-blocks-buttons.js',
        '/docs/js/tawk.to.js'
    ],

    stylesheets: [
        '/docs/css/code-blocks-buttons.css'
    ],

    usePrism: true,
    // On page navigation for the current documentation page.
    onPageNav: 'separate',
    // No .html extensions for paths.
    cleanUrl: true,

    // Open Graph and Twitter card images.
    ogImage: '/docsimg/docusaurus.png',
    twitterImage: '/docsimg/docusaurus.png',
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