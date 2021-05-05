import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Getting started',
    description: (
      <>
        Familiarize with ConfigCat basics.
      </>
    ),
    links: [
      { url: "getting-started", title: "Getting started" },
      { url: "main-concepts", title: "Main Concepts" },
      { url: "requests", title: "What is a config.json download?" },
      { url: "purchase", title: "Plans, Purchase & Billing" },
      { url: "organization", title: "Organization & Roles" },
    ]
  },
  {
    title: 'Guides',
    description: (
      <>
        Get the most out of your feature flags.
      </>
    ),
    links: [
      { url: "advanced/data-governance", title: "Data Governance - CDN" },
      { url: "advanced/targeting", title: "Targeting" },
      { url: "advanced/user-object", title: "The User Object" },
      { url: "advanced/public-api", title: "Public Management API" },
      { url: "advanced/caching", title: "Polling modes & Caching" },
      { url: "advanced/team-collaboration", title: "Team Collaboration" },
      { url: "advanced/notifications-webhooks", title: "Notifications - Webhooks" },
      { url: "advanced/troubleshooting", title: "Troubleshooting" },
    ]
  },
  {
    title: 'SDK references',
    description: (
      <>
        Let's do some coding.
      </>
    ),
    links: [
      { url: "sdk-reference/csharp", title: ".NET, .NET Core" },
      { url: "sdk-reference/java", title: "Java" },
      { url: "sdk-reference/js", title: "JavaScript" },
      { url: "sdk-reference/js-ssr", title: "JavaScript (SSR)" },
      { url: "sdk-reference/node", title: "Node.js" },
      { url: "sdk-reference/android", title: "Android (Kotlin)" },
      { url: "sdk-reference/ios", title: "iOS (Swift)" },
      { url: "sdk-reference/python", title: "Python" },
      { url: "sdk-reference/go", title: "Go" },
      { url: "sdk-reference/php", title: "PHP" },
      { url: "sdk-reference/ruby", title: "Ruby" },
      { url: "sdk-reference/elixir", title: "Elixir" },
    ]
  },
  {
    title: 'Integrations',
    description: (
      <>
        Get connected to increase productivity.
      </>
    ),
    links: [
      { url: "integrations/slack", title: "Slack" },
      { url: "integrations/jira", title: "Jira Cloud Plugin" },
      { url: "integrations/trello", title: "Trello Power-Up" },
      { url: "integrations/datadog", title: "DataDog" },
      { url: "integrations/zapier", title: "Zapier" },
      { url: "integrations/github", title: "GitHub Action" },
      { url: "integrations/circleci", title: "CircleCI Orb" },
      { url: "integrations/terraform", title: "Terraform" },
      { url: "integrations/amplitude", title: "Amplitude" },
      { url: "integrations/zoho-flow", title: "Zoho Flow" },
      { url: "integrations/vscode", title: "Visual Studio Code" },
    ]
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
            <Link to={useBaseUrl(link.url)}>
              {link.title}
            </Link>
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
      description="ConfigCat is a cloud-based service that lets you release a feature without needing to deploy new code. You can use it with many similar techniques such as feature flags/toggles, canary releases, soft launches, A-B testing, remote configuration management, and phased rollouts.">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <img className={styles.heroImage} src={useBaseUrl('img/docs.svg')} alt="" />
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('getting-started')}>
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
