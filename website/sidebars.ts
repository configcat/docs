import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      Basics: [
        'getting-started',
        'main-concepts',
        'purchase',
        'requests',
        'network-traffic',
        'organization',
      ],
      Guides: [
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
        {
          label: 'Targeting',
          type: 'category',
          link: { type: 'doc', id: 'targeting/targeting-overview' },
          items: [
            {
              label: 'Targeting Rule',
              type: 'category',
              link: { type: 'doc', id: 'targeting/targeting-rule/targeting-rule-overview' },
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
        {
          label: 'Team Management',
          type: 'category',
          link: { type: 'doc', id: 'advanced/team-management/team-management-basics' },
          items: [
            'advanced/team-management/single-sign-on-sso',
            'advanced/team-management/auto-assign-users',
            {
              label: 'SAML SSO',
              type: 'category',
              link: { type: 'doc', id: 'advanced/team-management/saml/saml-overview' },
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
            'advanced/team-management/domain-verification',
          ],
        },
        'advanced/notifications-webhooks',
        'advanced/troubleshooting',
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
      ],
    },
    {
      label: 'Integrations',
      type: 'category',
      link: { type: 'doc', id: 'integrations/overview' },
      items: [
        { type: 'doc', id: 'integrations/amplitude', label: 'Amplitude' },
        { type: 'doc', id: 'integrations/bitbucket', label: 'Bitbucket Pipe' },
        { type: 'doc', id: 'integrations/bitrise', label: 'Bitrise Step' },
        { type: 'doc', id: 'integrations/circleci', label: 'CircleCI Orb' },
        { type: 'doc', id: 'integrations/datadog', label: 'Datadog' },
        { type: 'doc', id: 'integrations/github', label: 'GitHub Action' },
        { type: 'doc', id: 'integrations/google-analytics', label: 'Google Analytics' },
        { type: 'doc', id: 'integrations/jira', label: 'Jira Cloud Plugin' },
        { type: 'doc', id: 'integrations/mixpanel', label: 'Mixpanel' },
        { type: 'doc', id: 'integrations/monday', label: 'monday.com' },
        { type: 'doc', id: 'integrations/slack', label: 'Slack' },
        { type: 'doc', id: 'integrations/terraform', label: 'Terraform' },
        { type: 'doc', id: 'integrations/trello', label: 'Trello Power-Up' },
        { type: 'doc', id: 'integrations/segment', label: 'Twilio Segment' },
        { type: 'doc', id: 'integrations/vscode', label: 'Visual Studio Code' },
        { type: 'doc', id: 'integrations/zapier', label: 'Zapier Zap' },
        { type: 'doc', id: 'integrations/zoho-flow', label: 'Zoho Flow' },
      ],
    },
    { type: 'doc', id: 'service/status', label: 'Service Status' },
    { type: 'doc', id: 'news', label: 'News & Product Updates' },
    { type: 'doc', id: 'faq', label: 'FAQ' },
  ],
  sdks: [
    {
      label: 'SDK References',
      type: 'category',
      link: { type: 'doc', id: 'sdk-reference/overview' },
      items: [
        { type: 'doc', id: 'sdk-reference/dotnet', label: '.NET' },
        { type: 'doc', id: 'sdk-reference/cpp', label: 'C++' },
        { type: 'doc', id: 'sdk-reference/dart', label: 'Dart (Flutter)' },
        { type: 'doc', id: 'sdk-reference/elixir', label: 'Elixir' },
        { type: 'doc', id: 'sdk-reference/go', label: 'Go' },
        { type: 'doc', id: 'sdk-reference/java', label: 'Java' },
        { type: 'doc', id: 'sdk-reference/android', label: 'Java (Android)' },
        { type: 'doc', id: 'sdk-reference/js', label: 'JavaScript' },
        { type: 'doc', id: 'sdk-reference/react', label: 'JavaScript (React)' },
        { type: 'doc', id: 'sdk-reference/js-ssr', label: 'JavaScript (SSR)' },
        {
          type: 'doc',
          id: 'sdk-reference/kotlin',
          label: 'Kotlin Multiplatform',
        },
        { type: 'doc', id: 'sdk-reference/node', label: 'Node.js' },
        { type: 'doc', id: 'sdk-reference/php', label: 'PHP' },
        { type: 'doc', id: 'sdk-reference/python', label: 'Python' },
        { type: 'doc', id: 'sdk-reference/ruby', label: 'Ruby' },
        { type: 'doc', id: 'sdk-reference/rust', label: 'Rust' },
        { type: 'doc', id: 'sdk-reference/ios', label: 'Swift (iOS)' },
        {
          'Community Maintained': [
            {
              type: 'doc',
              id: 'sdk-reference/community/laravel',
              label: 'PHP (Laravel)',
            },
            {
              type: 'doc',
              id: 'sdk-reference/community/deno',
              label: 'TypeScript (Deno)',
            },
            {
              type: 'doc',
              id: 'sdk-reference/community/vue',
              label: 'JavaScript (Vue.js)',
            },
          ],
        },
      ],
    },
  ]
};

export default sidebars;