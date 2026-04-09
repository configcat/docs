import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { assignKeyToItems } from '../sidebar-helper';

const papiInfoId = 'reference/configcat-public-management-api';
const scimInfoId = 'scim/configcat-user-provisioning-scim-api';

const papiSidebar = require('./reference/sidebar.ts').map((item) => {
  return {
    ...item,
    items: item.items.filter((sub) => sub.id !== papiInfoId),
  };
}).map(item => assignKeyToItems(item));

const scimSidebar = require('./scim/sidebar.ts').filter((item) => item.id !== scimInfoId).map(item => assignKeyToItems(item));

const sidebars: SidebarsConfig = {
  api: [
    {
      type: 'category',
      label: 'Public Management API',
      collapsed: false,
      collapsible: true,
      className: "icon api-icon",
      items: [
        {
          label: 'Introduction',
          type: 'doc',
          id: papiInfoId,
          key: papiInfoId,
        },
        ...papiSidebar,
      ],
    },
    {
      type: 'category',
      label: 'User Provisioning (SCIM)',
      collapsed: false,
      collapsible: true,
      className: "icon scim-icon",
      items: [
        {
          label: 'Introduction',
          type: 'doc',
          id: scimInfoId,
          key: scimInfoId,
        },
        ...scimSidebar,
      ],
    },
  ],
};

export default sidebars;
