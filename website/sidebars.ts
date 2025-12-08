import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      label: 'Basics',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon basics-icon',
      items: [
        'getting-started',
        'main-concepts',
        'purchase',
        'requests',
        'network-traffic',
        'organization',
      ],
    },
    {
      label: 'Guides',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon guides-icon',
      items: [
        {
          label: 'Config V2',
          type: 'category',
          link: { type: 'doc', id: 'advanced/config-v2' },
          items: [
            'advanced/config-v2-migration-guide',
            'advanced/config-v2-sdk-compatibility',
          ],
        },
        'advanced/data-governance',
        'advanced/predefined-variations',
        {
          label: 'Targeting',
          type: 'category',
          link: { type: 'doc', id: 'targeting/targeting-overview' },
          items: [
            {
              label: 'Targeting Rule',
              type: 'category',
              link: {
                type: 'doc',
                id: 'targeting/targeting-rule/targeting-rule-overview',
              },
              items: [
                'targeting/targeting-rule/user-condition',
                'targeting/targeting-rule/flag-condition',
                'targeting/targeting-rule/segment-condition',
              ],
            },
            'targeting/percentage-options',
            'targeting/user-object',
            'targeting/feature-flag-evaluation',
          ],
        },
        'advanced/caching',
        'advanced/troubleshooting',
        'zombie-flags',
        {
          label: 'Migration from LaunchDarkly',
          type: 'category',
          link: { type: 'doc', id: 'advanced/migration-from-launchdarkly' },
          items: [
            {
              type: 'doc',
              id: 'advanced/migration-from-launchdarkly-translation',
              label: 'Details of LaunchDarkly to ConfigCat Translation',
            },
          ],
        },
      ],
    },
    {
      label: 'Team Management',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon team-icon',
      link: {
        type: 'doc',
        id: 'advanced/team-management/team-management-basics',
      },
      items: [
        'advanced/team-management/single-sign-on-sso',
        'advanced/team-management/auto-assign-users',
        {
          label: 'SAML SSO',
          type: 'category',
          link: {
            type: 'doc',
            id: 'advanced/team-management/saml/saml-overview',
          },
          items: [
            {
              type: 'doc',
              id: 'advanced/team-management/saml/identity-providers/azure-ad',
              label: 'Entra ID (Azure AD)',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/saml/identity-providers/adfs',
              label: 'ADFS',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/saml/identity-providers/google',
              label: 'Google',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/saml/identity-providers/okta',
              label: 'Okta',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/saml/identity-providers/auth0',
              label: 'Auth0',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/saml/identity-providers/onelogin',
              label: 'OneLogin',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/saml/identity-providers/cloudflare',
              label: 'Cloudflare Zero Trust',
            },
          ],
        },
        {
          label: 'User provisioning (SCIM)',
          type: 'category',
          link: {
            type: 'doc',
            id: 'advanced/team-management/scim/scim-overview',
          },
          items: [
            {
              type: 'doc',
              id: 'advanced/team-management/scim/identity-providers/entra-id',
              label: 'Entra ID (Azure AD)',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/scim/identity-providers/okta',
              label: 'Okta',
            },
            {
              type: 'doc',
              id: 'advanced/team-management/scim/identity-providers/onelogin',
              label: 'OneLogin',
            },
          ],
        },
        'advanced/team-management/domain-verification',
      ],
    },
    {
      label: 'Tools',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon tools-icon',
      items: [
        'advanced/cli',
        {
          label: 'Scan & Upload Code References',
          type: 'category',
          link: { type: 'doc', id: 'advanced/code-references/overview' },
          items: [
            {
              type: 'doc',
              id: 'advanced/code-references/github-action',
              label: 'GitHub Action',
            },
            {
              type: 'doc',
              id: 'advanced/code-references/circleci-orb',
              label: 'CircleCI Orb',
            },
            {
              type: 'doc',
              id: 'advanced/code-references/gitlab-ci',
              label: 'GitLab CI/CD',
            },
            {
              type: 'doc',
              id: 'advanced/code-references/azure-devops',
              label: 'Azure DevOps',
            },
            {
              type: 'doc',
              id: 'advanced/code-references/bitbucket-pipe',
              label: 'Bitbucket Pipe',
            },
            {
              type: 'doc',
              id: 'advanced/code-references/bitrise-step',
              label: 'Bitrise Step',
            },
            {
              type: 'doc',
              id: 'advanced/code-references/manual',
              label: 'Manual Integration',
            },
          ],
        },
        {
          label: 'ConfigCat Proxy',
          type: 'category',
          link: { type: 'doc', id: 'advanced/proxy/proxy-overview' },
          items: [
            {
              type: 'doc',
              id: 'advanced/proxy/endpoints',
              label: 'Endpoints',
            },
            {
              type: 'doc',
              id: 'advanced/proxy/grpc',
              label: 'gRPC',
            },
            {
              type: 'doc',
              id: 'advanced/proxy/monitoring',
              label: 'Monitoring',
            },
          ],
        },
        'advanced/mcp-server',
      ],
    },
    {
      type: 'doc',
      id: 'service/status',
      label: 'Service Status',
      className: 'icon status-icon',
    },
    {
      type: 'doc',
      id: 'news',
      label: 'News & Product Updates',
      className: 'icon news-icon',
    },
    { type: 'doc', id: 'faq', label: 'FAQ', className: 'icon faq-icon' },
  ],
  sdks: [
    {
      label: 'SDK References',
      type: 'category',
      className: 'icon sdk-icon',
      link: { type: 'doc', id: 'sdk-reference/overview' },
      items: [
        { type: 'doc', id: 'sdk-reference/dotnet', label: '.NET' },
        { type: 'doc', id: 'sdk-reference/android', label: 'Android (Java)' },
        { type: 'doc', id: 'sdk-reference/cpp', label: 'C++' },
        { type: 'doc', id: 'sdk-reference/dart', label: 'Dart (Flutter)' },
        { type: 'doc', id: 'sdk-reference/elixir', label: 'Elixir' },
        { type: 'doc', id: 'sdk-reference/go', label: 'Go' },
        { type: 'doc', id: 'sdk-reference/java', label: 'Java' },
        {
          label: 'JavaScript',
          type: 'category',
          link: { type: 'doc', id: 'sdk-reference/js/overview' },
          collapsed: false,
          items: [
            { type: 'doc', id: 'sdk-reference/js/browser', label: 'Browser' },
            { type: 'doc', id: 'sdk-reference/js/bun', label: 'Bun' },
            {
              type: 'doc',
              id: 'sdk-reference/js/chromium-extension',
              label: 'Chromium Extension',
            },
            {
              type: 'doc',
              id: 'sdk-reference/js/cloudflare-worker',
              label: 'Cloudflare Worker',
            },
            { type: 'doc', id: 'sdk-reference/js/deno', label: 'Deno' },
            { type: 'doc', id: 'sdk-reference/js/node', label: 'Node.js' },
            { type: 'doc', id: 'sdk-reference/react', label: 'React' },
          ],
        },
        {
          type: 'doc',
          id: 'sdk-reference/kotlin',
          label: 'Kotlin Multiplatform',
        },
        { type: 'doc', id: 'sdk-reference/php', label: 'PHP' },
        { type: 'doc', id: 'sdk-reference/python', label: 'Python' },
        { type: 'doc', id: 'sdk-reference/ruby', label: 'Ruby' },
        { type: 'doc', id: 'sdk-reference/rust', label: 'Rust' },
        { type: 'doc', id: 'sdk-reference/ios', label: 'Swift (iOS)' },
        { type: 'doc', id: 'sdk-reference/unity', label: 'Unity' },
        { type: 'doc', id: 'sdk-reference/unreal', label: 'Unreal Engine' },
      ],
    },
    {
      label: 'OpenFeature Providers',
      type: 'category',
      className: 'icon of-icon',
      link: { type: 'doc', id: 'sdk-reference/openfeature/overview' },
      items: [
        { type: 'doc', id: 'sdk-reference/openfeature/dotnet', label: '.NET' },
        {
          type: 'doc',
          id: 'sdk-reference/openfeature/angular',
          label: 'Angular',
        },
        { type: 'doc', id: 'sdk-reference/openfeature/go', label: 'Go' },
        { type: 'doc', id: 'sdk-reference/openfeature/java', label: 'Java' },
        {
          type: 'doc',
          id: 'sdk-reference/openfeature/js',
          label: 'JavaScript',
        },
        {
          type: 'doc',
          id: 'sdk-reference/openfeature/kotlin',
          label: 'Kotlin Multiplatform',
        },
        {
          type: 'doc',
          id: 'sdk-reference/openfeature/nestjs',
          label: 'NestJS',
        },
        { type: 'doc', id: 'sdk-reference/openfeature/node', label: 'Node.js' },
        { type: 'doc', id: 'sdk-reference/openfeature/php', label: 'PHP' },
        {
          type: 'doc',
          id: 'sdk-reference/openfeature/python',
          label: 'Python',
        },
        { type: 'doc', id: 'sdk-reference/openfeature/react', label: 'React' },
        { type: 'doc', id: 'sdk-reference/openfeature/ruby', label: 'Ruby' },
        { type: 'doc', id: 'sdk-reference/openfeature/rust', label: 'Rust' },
        {
          type: 'doc',
          id: 'sdk-reference/openfeature/swift',
          label: 'Swift (iOS)',
        },
      ],
    },
    {
      label: 'Community Maintained',
      type: 'category',
      className: 'icon community-icon',
      items: [
        {
          type: 'doc',
          id: 'sdk-reference/community/laravel',
          label: 'PHP (Laravel)',
        },
        {
          type: 'doc',
          id: 'sdk-reference/community/vue',
          label: 'JavaScript (Vue.js)',
        },
      ],
    },
    {
      label: 'Legacy SDKs',
      type: 'category',
      className: 'icon legacy-icon',
      items: [
        { type: 'doc', id: 'sdk-reference/js', label: 'JavaScript' },
        { type: 'doc', id: 'sdk-reference/js-ssr', label: 'JavaScript (SSR)' },
        { type: 'doc', id: 'sdk-reference/node', label: 'Node.js' },
      ],
    },
  ],
  integrations: [
    {
      type: 'doc',
      id: 'integrations/overview',
      label: 'Overview',
      className: 'icon overview-icon',
    },
    {
      label: 'Analytics',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon analytics-icon',
      items: [
        { type: 'doc', id: 'integrations/amplitude', label: 'Amplitude' },
        { type: 'doc', id: 'integrations/datadog', label: 'Datadog' },
        {
          type: 'doc',
          id: 'integrations/google-analytics',
          label: 'Google Analytics',
        },
        { type: 'doc', id: 'integrations/mixpanel', label: 'Mixpanel' },
        {
          type: 'doc',
          id: 'integrations/segment',
          label: 'Twilio Segment',
        },
      ],
    },
    {
      label: 'Project Management',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon project-management-icon',
      items: [
        {
          type: 'doc',
          id: 'integrations/jira',
          label: 'Jira Cloud Plugin',
        },
        { type: 'doc', id: 'integrations/monday', label: 'monday.com' },
        {
          type: 'doc',
          id: 'integrations/trello',
          label: 'Trello Power-Up',
        },
      ],
    },
    {
      label: 'Communication',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon communication-icon',
      items: [{ type: 'doc', id: 'integrations/slack', label: 'Slack' }],
    },
    {
      label: 'DevOps',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon devops-icon',
      items: [
        {
          type: 'doc',
          id: 'integrations/bitbucket',
          label: 'Bitbucket Pipe',
        },
        { type: 'doc', id: 'integrations/bitrise', label: 'Bitrise Step' },
        { type: 'doc', id: 'integrations/circleci', label: 'CircleCI Orb' },
        { type: 'doc', id: 'integrations/github', label: 'GitHub Action' },
        { type: 'doc', id: 'integrations/terraform', label: 'Terraform' },
      ],
    },
    {
      label: 'IDE Extensions',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon integrations-icon',
      items: [
        {
          type: 'doc',
          id: 'integrations/intellij',
          label: 'JetBrains/IntelliJ',
        },
        {
          type: 'doc',
          id: 'integrations/vscode',
          label: 'Visual Studio Code',
        },
      ],
    },
    {
      label: 'Workflow Automation',
      type: 'category',
      collapsed: false,
      collapsible: true,
      className: 'icon workflow-icon',
      items: [
        { type: 'doc', id: 'integrations/zapier', label: 'Zapier Zap' },
        { type: 'doc', id: 'integrations/zoho-flow', label: 'Zoho Flow' },
      ],
    },
    {
      type: 'doc',
      id: 'advanced/notifications-webhooks',
      label: 'Notifications - Webhook',
      className: 'icon webhook-icon',
    },
  ],
};

export default sidebars;
