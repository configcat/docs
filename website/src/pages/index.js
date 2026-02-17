import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    column: 0,
    title: 'Basics',
    description: <>Familiarize with ConfigCat basics.</>,
    links: [
      { url: 'getting-started', title: 'Getting Started' },
      { url: 'main-concepts', title: 'Main Concepts' },
      { url: 'organization', title: 'Organization & Roles' },
      { url: 'targeting/targeting-overview', title: 'Targeting' },
      { url: 'advanced/predefined-variations', title: 'Predefined Variations vs Free‑Form Values' },
    ],
  },
  {
    column: 0,
    cssClass: "last-on-mobile",
    title: 'Plans & Usage',
    description: <>The financial side of feature flagging.</>,
    links: [
      { url: 'purchase', title: 'Plans, Purchase & Billing' },
      { url: 'requests', title: 'What is a config JSON download?' },
      { url: 'network-traffic', title: 'Network Traffic' },
    ],
  },
  {
    column: 0,
    cssClass: "last-on-mobile",
    title: 'Further Reading',
    description: <>Additional useful information.</>,
    links: [
      { url: 'advanced/config-v2-migration-guide', title: 'Config V2 Migration Guide' },
      { url: 'news', title: 'News & Product Updates' },
      { url: 'faq', title: 'FAQ' },
      { url: 'advanced/troubleshooting', title: 'Troubleshooting' },
      { url: 'glossary', title: 'Glossary' },
    ],
  },
  {
    column: 1,
    title: 'Advanced Features',
    description: <>Boost your feature flagging efficiency.</>,
    links: [
      { url: 'advanced/cli', title: 'Command Line Interface (CLI)' },
      {
        url: 'advanced/proxy/proxy-overview',
        title: 'ConfigCat Proxy',
      },
      { url: 'advanced/data-governance', title: 'Data Governance - CDN' },
      {
        url: 'advanced/migration-from-launchdarkly',
        title: 'Migration from LaunchDarkly',
      },
      { url: 'advanced/mcp-server', title: 'MCP Server' },
      {
        url: 'advanced/notifications-webhooks',
        title: 'Notifications - Webhooks',
      },
      { url: 'api/reference/configcat-public-management-api', title: 'Public Management API' },
      {
        url: 'advanced/code-references/overview',
        title: 'Scan & Upload Code References',
      },

      { url: 'advanced/variation-id-for-analytics', title: 'Variation ID for Analytics' },
      { url: 'zombie-flags', title: 'Zombie Flags' },
    ],
  },
  {
    column: 1,
    title: 'Team Management',
    description: <>Grant your team access to ConfigCat.</>,
    links: [
      {
        url: 'advanced/team-management/team-management-basics',
        title: 'Team Management Basics',
      },
      {
        url: 'advanced/team-management/single-sign-on-sso',
        title: 'SSO (Single Sign-On)',
      },
      {
        url: 'advanced/team-management/auto-assign-users',
        title: 'Auto-Assign Users',
      },
      {
        url: 'advanced/team-management/saml/saml-overview',
        title: 'SAML Single Sign-On',
      },
      {
        url: 'advanced/team-management/scim/scim-overview',
        title: 'User Provisioning (SCIM)',
      },
      {
        url: 'advanced/team-management/domain-verification',
        title: 'Domain Verification',
      },
    ],
  },
  {
    column: 2,
    title: 'SDK References', // This list should be in alphabetical order
    description: <>Let's do some coding.</>,
    links: [
      { url: 'sdk-reference/dotnet', title: '.NET' },
      { url: 'sdk-reference/android', title: 'Android (Java)' },
      { url: 'sdk-reference/cpp', title: 'C++' },
      { url: 'sdk-reference/dart', title: 'Dart (Flutter)' },
      { url: 'sdk-reference/elixir', title: 'Elixir' },
      { url: 'sdk-reference/go', title: 'Go' },
      { url: 'sdk-reference/java', title: 'Java' },
      {
        url: 'sdk-reference/js/overview',
        title: 'JavaScript',
        items: [
          { url: 'sdk-reference/js/browser', title: 'Browser' },
          { url: 'sdk-reference/js/bun', title: 'Bun' },
          { url: 'sdk-reference/js/chromium-extension', title: 'Chromium Extension' },
          { url: 'sdk-reference/js/cloudflare-worker', title: 'Cloudflare Worker' },
          { url: 'sdk-reference/js/deno', title: 'Deno' },
          { url: 'sdk-reference/js/node', title: 'Node.js' },
          { url: 'sdk-reference/react', title: 'React' },
          { url: 'sdk-reference/community/vue', title: 'Vue.js' },
        ],
      },
      { url: 'sdk-reference/kotlin', title: 'Kotlin Multiplatform' },
      { url: 'sdk-reference/php', title: 'PHP' },
      { url: 'sdk-reference/community/laravel', title: 'PHP (Laravel)' },
      { url: 'sdk-reference/python', title: 'Python' },
      { url: 'sdk-reference/ruby', title: 'Ruby' },
      { url: 'sdk-reference/rust', title: 'Rust' },
      { url: 'sdk-reference/ios', title: 'Swift (iOS)' },
      { url: 'sdk-reference/unity', title: 'Unity' },
      { url: 'sdk-reference/unreal', title: 'Unreal Engine' },
    ],
  },
  {
    column: 3,
    title: 'Integrations', // This list should be in alphabetical order
    description: <>Get connected to increase productivity.</>,
    links: [
      { url: 'integrations/amplitude', title: 'Amplitude' },
      { url: 'advanced/code-references/azure-devops/', title: 'Azure DevOps' },
      { url: 'integrations/bitrise', title: 'Bitrise Step' },
      { url: 'integrations/bitbucket', title: 'Bitbucket Pipe' },
      { url: 'integrations/circleci', title: 'CircleCI Orb' },
      { url: 'integrations/datadog', title: 'DataDog' },
      { url: 'integrations/github', title: 'GitHub Action' },
      { url: 'integrations/google-analytics', title: 'Google Analytics' },
      { url: 'advanced/code-references/gitlab-ci/', title: 'GitLab (via CLI)' },
      { url: 'integrations/intellij', title: 'JetBrains/IntelliJ IDE' },
      { url: 'integrations/jira', title: 'Jira Cloud Plugin' },
      {
        url: 'advanced/notifications-webhooks#connecting-to-microsoft-teams',
        title: 'MS Teams (via webhook)',
      },
      { url: 'integrations/mixpanel', title: 'Mixpanel' },
      { url: 'integrations/monday', title: 'monday.com' },
      { url: 'integrations/slack', title: 'Slack' },
      { url: 'integrations/terraform', title: 'Terraform' },
      { url: 'integrations/trello', title: 'Trello Power-Up' },
      { url: 'integrations/segment', title: 'Twilio Segment' },
      { url: 'integrations/vscode', title: 'Visual Studio Code' },
      { url: 'integrations/zapier', title: 'Zapier' },
      { url: 'integrations/zoho-flow', title: 'Zoho Flow' },
    ],
  },
];

const featuresByColumn = features.reduce((acc, feature) => {
  let group = acc[feature.column];
  if (!group) acc[feature.column] = group = [];
  group.push(feature);
  return acc;
}, []);

function Feature({ features }) {
  return (
    <div className={clsx('col col--3', styles.feature)}>
      {features
        .map(({ cssClass, imageUrl, title, description, links }, idx) => {
          const imgUrl = useBaseUrl(imageUrl);
          return (
            <div key={idx} className={clsx(cssClass, styles.featureSection)}>
              {imgUrl && (
                <div className="text--center">
                  <img className={clsx('no-auto-height', styles.featureImage)} src={imgUrl} alt={title} />
                </div>
              )}
              <h3>{title}</h3>
              <p>{description}</p>
              <FeatureItems links={links} />
            </div>
          );
        })
      }
    </div>
  );
}

function FeatureItems({ links }) {
  return (
    <ul className="feature-list">
      {links.map(({ url, title, items }, idx) => (
        <li key={idx}>
          <Link to={useBaseUrl(url)}>{title}</Link>
          {items?.length && <FeatureItems links={items} />}
        </li>
      ))}
    </ul>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Documentation for ConfigCat Feature Flags. ConfigCat is a developer-centric feature flag service with unlimited team size, awesome support, and a reasonable price tag."
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <img
            className={clsx('no-auto-height', styles.heroImage)}
            src={useBaseUrl('img/docs.svg')}
            alt="ConfigCat Docs"
          />
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('getting-started')}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      <main>
          <section className={styles.features}>
            <div className="container">
              <div className="row">
              {featuresByColumn
                .filter(group => group.length)
                .map((group, idx) => (
                  <Feature key={idx} features={group} />
                ))
              }
              </div>
            </div>
          </section>
      </main>
    </Layout>
  );
}

export default Home;
