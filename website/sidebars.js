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
        { type: "doc", id: "integrations/overview", label: "Overview" },
        { type: "doc", id: "integrations/slack", label: "Slack" },
        { type: "doc", id: "integrations/jira", label: "Jira Cloud Plugin" },
        { type: "doc", id: "integrations/trello", label: "Trello Power-Up" },
        { type: "doc", id: "integrations/datadog", label: "Datadog" },
        { type: "doc", id: "integrations/zapier", label: "Zapier Zap" },
        { type: "doc", id: "integrations/zoho-flow", label: "Zoho Flow" },
        { type: "doc", id: "integrations/github", label: "GitHub Action" },
        { type: "doc", id: "integrations/circleci", label: "CircleCI Orb" },
        { type: "doc", id: "integrations/bitbucket", label: "Bitbucket Pipe" },
        { type: "doc", id: "integrations/terraform", label: "Terraform" },
        { type: "doc", id: "integrations/amplitude", label: "Amplitude" },
        { type: "doc", id: "integrations/vscode", label: "Visual Studio Code" },
      ],
      "Service Status": [
        "service/status"
      ]
    },
    "faq"
  ],
};
