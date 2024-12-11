import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const infoId = 'reference/configcat-public-management-api';

const generated = require('./reference/sidebar.ts')
    .map(item => {
      return {
        ...item, 
        items: item.items.filter(sub => sub.id !== infoId),
      }
    });

const sidebars: SidebarsConfig = {
  api: [
    {
      label: 'Introduction',
      type: "doc",
      id: infoId,
    },
    ...generated,
  ],
};

export default sidebars;