import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Basics',
    description: <>Familiarize with ConfigCat basics.</>,
    links: [
      { url: 'getting-started', title: 'Getting started' },
      { url: 'main-concepts', title: 'Main Concepts' },
      { url: 'targeting/targeting-overview', title: 'Targeting' },
      { url: 'requests', title: 'What is a config JSON download?' },
      { url: 'network-traffic', title: 'Network Traffic' },
      { url: 'purchase', title: 'Plans, Purchase & Billing' },
      { url: 'organization', title: 'Organization & Roles' },
      { url: 'news', title: 'News & Product Updates' },
      { url: 'faq', title: 'FAQ' },
      { url: 'glossary', title: 'Glossary' },
    ],
  },
  {
    title: 'Advanced Guides',
    description: <>API, CLI, SAML, Webhooks...</>,
    links: [
      { url: 'api/reference/configcat-public-management-api', title: 'Public Management API' },
      { url: 'advanced/data-governance', title: 'Data Governance - CDN' },
      { url: 'advanced/predefined-variations', title: 'Predefined variations' },
      { url: 'advanced/caching', title: 'Polling modes & Caching' },
      {
        url: 'advanced/team-management/team-management-basics',
        title: 'Team Management',
      },
      {
        url: 'advanced/team-management/saml/saml-overview',
        title: 'SAML Single Sign-On',
      },
      {
        url: 'advanced/team-management/scim/scim-overview',
        title: 'User provisioning (SCIM)',
      },
      {
        url: 'advanced/notifications-webhooks',
        title: 'Notifications - Webhooks',
      },
      { url: 'advanced/troubleshooting', title: 'Troubleshooting' },
      { url: 'advanced/cli', title: 'Command Line Interface (CLI)' },
      {
        url: 'advanced/code-references/overview',
        title: 'Scan & Upload Code References',
      },
      {
        url: 'advanced/proxy/proxy-overview',
        title: 'ConfigCat Proxy',
      },
      {
        url: 'advanced/migration-from-launchdarkly',
        title: 'Migration from LaunchDarkly',
      },
      { url: 'advanced/mcp-server', title: 'MCP Server' },
      { url: 'zombie-flags', title: 'Zombie Flags' },
      // { url: 'advanced/config-v2-migration-guide', title: 'Config V2 Migration Guide' },
    ],
  },
  {
    title: 'SDK references', // This list should be in alphabetical order
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

function Feature({ imageUrl, title, description, links }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--3', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={clsx('no-auto-height', styles.featureImage)} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      {FeatureItems(links)}
    </div>
  );
}

function FeatureItems(links) {
  return (
    <ul class="feature-list">
      {links.map(({ url, title, items }) => (
        <li>
          <Link to={useBaseUrl(url)}>{title}</Link>
          {items?.length && FeatureItems(items)}
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
              Open Docs
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <h2 className="text--center">Quick links</h2>
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
