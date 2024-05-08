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
      // { url: 'advanced/config-v2-migration-guide', title: 'Config V2 Migration Guide' },
    ],
  },
  {
    title: 'SDK references',
    description: <>Let's do some coding.</>,
    links: [
      { url: 'sdk-reference/dotnet', title: '.NET, .NET Core, Xamarin' },
      { url: 'sdk-reference/cpp', title: 'C++' },
      { url: 'sdk-reference/dart', title: 'Dart (Flutter)' },
      { url: 'sdk-reference/elixir', title: 'Elixir' },
      { url: 'sdk-reference/go', title: 'Go' },
      { url: 'sdk-reference/java', title: 'Java' },
      { url: 'sdk-reference/android', title: 'Java (Android)' },
      { url: 'sdk-reference/js', title: 'JavaScript' },
      { url: 'sdk-reference/community/deno', title: 'JavaScript (Deno)' },
      { url: 'sdk-reference/community/vue', title: 'JavaScript (Vue.js)' },
      { url: 'sdk-reference/react', title: 'JavaScript (React)' },
      { url: 'sdk-reference/js-ssr', title: 'JavaScript (SSR)' },
      { url: 'sdk-reference/kotlin', title: 'Kotlin Multiplatform' },
      { url: 'sdk-reference/node', title: 'Node.js' },
      { url: 'sdk-reference/php', title: 'PHP' },
      { url: 'sdk-reference/community/laravel', title: 'PHP (Laravel)' },
      { url: 'sdk-reference/python', title: 'Python' },
      { url: 'sdk-reference/ruby', title: 'Ruby' },
      { url: 'sdk-reference/ios', title: 'Swift (iOS)' },
    ],
  },
  {
    title: 'Integrations',
    description: <>Get connected to increase productivity.</>,
    links: [
      { url: 'integrations/slack', title: 'Slack' },
      { url: 'integrations/jira', title: 'Jira Cloud Plugin' },
      { url: 'integrations/trello', title: 'Trello Power-Up' },
      { url: 'integrations/monday', title: 'monday.com' },
      { url: 'integrations/datadog', title: 'DataDog' },
      { url: 'integrations/zapier', title: 'Zapier' },
      { url: 'integrations/github', title: 'GitHub Action' },
      { url: 'advanced/code-references/gitlab-ci/', title: 'GitLab (via CLI)' },
      { url: 'integrations/circleci', title: 'CircleCI Orb' },
      { url: 'integrations/bitbucket', title: 'Bitbucket Pipe' },
      { url: 'integrations/bitrise', title: 'Bitrise Step' },
      { url: 'integrations/terraform', title: 'Terraform' },
      { url: 'integrations/amplitude', title: 'Amplitude' },
      { url: 'integrations/mixpanel', title: 'Mixpanel' },
      { url: 'integrations/zoho-flow', title: 'Zoho Flow' },
      { url: 'integrations/vscode', title: 'Visual Studio Code' },
      {
        url: 'advanced/notifications-webhooks#connecting-to-microsoft-teams',
        title: 'MS Teams (via webhook)',
      },
    ],
  },
];

function Feature({ imageUrl, title, description, links }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--3', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {links.map((link, idx) => (
          <li>
            <Link to={useBaseUrl(link.url)}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
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
            className={styles.heroImage}
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
