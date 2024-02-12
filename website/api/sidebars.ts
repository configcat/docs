import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const generated = require('./reference/sidebar.ts')
    .slice(1)
    .filter(item => item.label != 'Integration links');

const sidebars: SidebarsConfig = {
  api: [
    {
      label: 'Public Management API',
      collapsed: true,
      type: 'category',
      link: {
        type: "doc",
        id: "reference/configcat-public-management-api",
      },
      items: generated
    },
  ],
};

export default sidebars;