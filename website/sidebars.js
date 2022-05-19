module.exports = {
  "docs": [
    {
      "Basics": [
        "getting-started",
        "main-concepts",
        "purchase",
        "requests",
        "organization"
      ],
      "Guides": [
        "advanced/data-governance",
        "advanced/targeting",
        "advanced/segments",
        "advanced/user-object",
        "advanced/public-api",
        "advanced/caching",
        {
          "Team Management": [
            "advanced/team-management/team-management-basics",
            "advanced/team-management/auto-assign-users",
            {
              "SAML Single Sign-On": [
                "advanced/team-management/saml/saml-overview",
                {
                  "Identity Providers": [
                    "advanced/team-management/saml/identity-providers/azure-ad",
                    "advanced/team-management/saml/identity-providers/adfs",
                    "advanced/team-management/saml/identity-providers/google",
                    "advanced/team-management/saml/identity-providers/okta",
                    "advanced/team-management/saml/identity-providers/auth0",
                    "advanced/team-management/saml/identity-providers/onelogin",
                  ]
                },
              ]
            },
            "advanced/team-management/domain-verification",
          ]
        },
        "advanced/notifications-webhooks",
        "advanced/troubleshooting",
        "advanced/cli",
        {
          "Scan & Upload Code References": [
            "advanced/code-references/overview",
            "advanced/code-references/github-action",
            "advanced/code-references/circleci-orb",
            "advanced/code-references/gitlab-ci",
            "advanced/code-references/azure-devops",
            "advanced/code-references/bitbucket-pipe",
            "advanced/code-references/bitrise-step",
            "advanced/code-references/manual",
          ]
        },
      ],
      "SDK References": [
        { type: "doc", id: "sdk-reference/overview", label: "Overview" },
        { type: "doc", id: "sdk-reference/csharp", label: ".Net, .Net Core" },
        { type: "doc", id: "sdk-reference/java", label: "Java" },
        { type: "doc", id: "sdk-reference/js", label: "JavaScript" },
        { type: "doc", id: "sdk-reference/js-ssr", label: "JavaScript (SSR)" },
        { type: "doc", id: "sdk-reference/node", label: "Node.js" },
        { type: "doc", id: "sdk-reference/android", label: "Android (Kotlin)" },
        { type: "doc", id: "sdk-reference/ios", label: "iOS (Swift)" },
        { type: "doc", id: "sdk-reference/python", label: "Python" },
        { type: "doc", id: "sdk-reference/go", label: "Go" },
        { type: "doc", id: "sdk-reference/php", label: "PHP" },
        { type: "doc", id: "sdk-reference/ruby", label: "Ruby" },
        { type: "doc", id: "sdk-reference/elixir", label: "Elixir" },
        { type: "doc", id: "sdk-reference/dart", label: "Dart (Flutter)" },
      ],
      "Integrations": [
        "integrations/overview",
        "integrations/slack",
        "integrations/jira",
        "integrations/trello",
        "integrations/datadog",
        "integrations/zapier",
        "integrations/zoho-flow",
        "integrations/github",
        "integrations/circleci",
        "integrations/bitbucket",
        "integrations/bitrise",
        "integrations/terraform",
        "integrations/amplitude",
        "integrations/vscode"
      ],
      "Service Status": [
        "service/status"
      ]
    },
    "faq"
  ],
};
