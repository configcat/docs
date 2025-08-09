import {replaceInFile} from 'replace-in-file'
import fs from 'fs'

const options = {
  files: 'api/reference/**/*.mdx',
  from: [
    /^<ApiLogo(?:.|\n)*<\/ApiLogo>$/gm,
    /&lt;!-- ReDoc-Inject: &lt;security-definitions&gt; --&gt;/g,
    /^<span(.|\n)*className=\{"theme-doc-version-badge badge badge--secondary"\}(.|\n)*Version: v1\n<\/span>$/gm,
    '# Authentication',
    'This API uses the [Basic HTTP Authentication Scheme](https://en.wikipedia.org/wiki/Basic_access_authentication).',
    /\[https:\/\/configcat.com\]\(mailto:https:\/\/configcat.com\)/g,
    /<a\s*href={"https:\/\/configcat\.com\/policies"}(.|\n)*<\/a>/gm,
    /\]\(https:\/\/configcat\.com\/docs/g,
    /href="https:\/\/configcat\.com\/docs/g,
    /^#\sOpenAPI Specification/gm,
    /^#\sThrottling and rate limits/gm,
    /\(#tag\//g,
    /\(#operation\//g,
    /\\\|/g,
    /\/Feature-Flag-and-Setting-values-using-SDK-Key/g,
    /\/Feature-Flags-and-Settings/g,
    /\/Feature-Flag-and-Setting-values/g,
    /\/Products/g,
    /\/Webhooks/g,
    /\/Environments/g,
    /\/Configs/g,
    /\/Tags/g,
    /\/Permission-Groups/g,
    '(/docs/advanced/targeting/#anatomy-of-the-percentage-based-targeting)', // TODO: Remove when public api docs points to the correct location
    '(/docs/advanced/targeting/)', // TODO: Remove when public api docs points to the correct location
    '(/docs/advanced/user-object/)' // TODO: Remove when public api docs points to the correct location
  ],
  to: [
    '',
    '',
    '',
    '',
    '',
    '[https://configcat.com](https://configcat.com)',
    '\n[https://configcat.com/policies](https://configcat.com/policies)',
    '](/docs',
    'href="/docs',
    '## OpenAPI Specification',
    '## Throttling and rate limits',
    '(/docs/api/reference/',
    '(/docs/api/reference/',
    '|',
    '/feature-flag-setting-values-using-sdk-key',
    '/feature-flags-settings',
    '/feature-flag-setting-values',
    '/products',
    '/webhooks',
    '/environments',
    '/configs',
    '/tags',
    '/permission-groups',
    '(/docs/targeting/percentage-options/)', // TODO: Remove when public api docs points to the correct location
    '(/docs/targeting/targeting-overview/)', // TODO: Remove when public api docs points to the correct location
    '(/docs/targeting/user-object/)' // TODO: Remove when public api docs points to the correct location
  ],
};

const filesToDelete = [
  'get-integration-link-details.api.mdx',
  'add-or-update-integration-link.api.mdx',
  'jira-add-or-update-integration-link.api.mdx',
  'delete-integration-link.api.mdx',
  'jira-connect.api.mdx',
  'integration-links.tag.mdx',
];

filesToDelete.forEach(file => {
  const path = 'api/reference/' + file;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
});
replaceInFile(options);

