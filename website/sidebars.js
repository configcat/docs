module.exports = {
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
        'advanced/data-governance',
        'advanced/targeting',
        'advanced/segments',
        'advanced/user-object',
        'advanced/public-api',
        'advanced/caching',
        {
          'Team Management': [
            'advanced/team-management/team-management-basics',
            'advanced/team-management/single-sign-on-sso',
            'advanced/team-management/auto-assign-users',
            {
              'SAML SSO': [
                'advanced/team-management/saml/saml-overview',
                {
                  'Identity Providers': [
                    {
                      type: 'doc',
                      id: 'advanced/team-management/saml/identity-providers/azure-ad',
                      label: 'Azure Active Directory',
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
              ],
            },
            'advanced/team-management/domain-verification',
          ],
        },
        'advanced/notifications-webhooks',
        'advanced/troubleshooting',
        'advanced/cli',
        // 'advanced/config-v2-migration-guide',
        {
          'Scan & Upload Code References': [
            {
              type: 'doc',
              id: 'advanced/code-references/overview',
              label: 'Overview',
            },
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
          'ConfigCat Proxy (Beta)': [
            {
              type: 'doc',
              id: 'advanced/proxy/proxy-overview',
              label: 'Overview',
            },
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
      'SDK References': [
        { type: 'doc', id: 'sdk-reference/overview', label: 'Overview' },
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
          ],
        },
      ],
      Integrations: [
        { type: 'doc', id: 'integrations/overview', label: 'Overview' },
        { type: 'doc', id: 'integrations/amplitude', label: 'Amplitude' },
        { type: 'doc', id: 'integrations/bitbucket', label: 'Bitbucket Pipe' },
        { type: 'doc', id: 'integrations/bitrise', label: 'Bitrise Step' },
        { type: 'doc', id: 'integrations/circleci', label: 'CircleCI Orb' },
        { type: 'doc', id: 'integrations/datadog', label: 'Datadog' },
        { type: 'doc', id: 'integrations/github', label: 'GitHub Action' },
        { type: 'doc', id: 'integrations/jira', label: 'Jira Cloud Plugin' },
        { type: 'doc', id: 'integrations/monday', label: 'monday.com' },
        { type: 'doc', id: 'integrations/slack', label: 'Slack' },
        { type: 'doc', id: 'integrations/terraform', label: 'Terraform' },
        { type: 'doc', id: 'integrations/trello', label: 'Trello Power-Up' },
        { type: 'doc', id: 'integrations/vscode', label: 'Visual Studio Code' },
        { type: 'doc', id: 'integrations/zapier', label: 'Zapier Zap' },
        { type: 'doc', id: 'integrations/zoho-flow', label: 'Zoho Flow' },
      ],
      'Service Status': ['service/status'],
    },
    { type: 'doc', id: 'news', label: 'News' },
    { type: 'doc', id: 'faq', label: 'FAQ' },
  ],
};
