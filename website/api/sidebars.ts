import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const papiInfoId = 'reference/configcat-public-management-api';
const scimInfoId = 'scim/configcat-user-provisioning-scim-api';

const papiSidebar = require('./reference/sidebar.ts').map((item) => {
  return {
    ...item,
    items: item.items.filter((sub) => sub.id !== papiInfoId),
  };
});

const scimSidebar = require('./scim/sidebar.ts').filter((item) => item.id !== scimInfoId);

const sidebars: SidebarsConfig = {
  api: [
    {
      type: 'category',
      label: 'Public Management API',
      collapsible: true,
      collapsed: true,
      items: [
        {
          label: 'Introduction',
          type: 'doc',
          id: papiInfoId,
        },
        ...papiSidebar,
      ],
    },
    {
      type: 'category',
      label: 'User Provisioning (SCIM) API',
      collapsible: true,
      collapsed: true,
      items: [
        {
          label: 'Introduction',
          type: 'doc',
          id: scimInfoId,
        },
        ...scimSidebar,
      ],
    },
  ],
};

export default sidebars;
