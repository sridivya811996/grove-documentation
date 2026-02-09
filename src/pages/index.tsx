import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const docCards = [
  {
    title: 'Product',
    description: 'Idea origin, functional spec, and target customers.',
    link: '/docs/product/idea',
  },
  {
    title: 'Technical',
    description: 'Architecture, data model, stack decisions, and security.',
    link: '/docs/technical/overview',
  },
  {
    title: 'Design',
    description: 'Design principles, assets, and screen references.',
    link: '/docs/design/overview',
  },
  {
    title: 'Marketing',
    description: 'Go-to-market strategy and growth plan.',
    link: '/docs/marketing/strategy',
  },
  {
    title: 'Route to Live',
    description: 'Launch checklist, store assets, and release process.',
    link: '/docs/live/overview',
  },
];

const downloads = [
  {
    label: 'App store launch checklist (CSV)',
    link: '/files/app-store-launch-checklist.csv',
  },
  {
    label: 'App store launch checklist (XLSX)',
    link: '/files/app-store-launch-checklist.xlsx',
  },
  {
    label: 'App store launch summary (CSV)',
    link: '/files/app-store-launch-summary.csv',
  },
  {
    label: 'Design preview (HTML)',
    link: '/files/design-preview.html',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroInner}>
          <div>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <div className={styles.heroActions}>
              <Link className="button button--primary" to="/docs/intro">
                Start here
              </Link>
              <Link className="button button--outline" to="/docs/product/idea">
                Explore product docs
              </Link>
            </div>
          </div>
          <div className={styles.heroPanel}>
            <div className={styles.heroPanelTitle}>Inside this hub</div>
            <ul className={styles.heroPanelList}>
              <li>Strategy, product research, and user stories</li>
              <li>Architecture, security, and feature flags</li>
              <li>Design system and screen references</li>
              <li>Release checklist and operational runbooks</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Documentation" description="Grove community platform documentation">
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Documentation map
            </Heading>
            <p className={styles.sectionSubtitle}>
              Browse by topic or jump straight into the area you need.
            </p>
            <div className={styles.cards}>
              {docCards.map((card) => (
                <div key={card.title} className={styles.card}>
                  <div className={styles.cardTitle}>{card.title}</div>
                  <div className={styles.cardDescription}>{card.description}</div>
                  <Link className={styles.cardLink} to={card.link}>
                    Open {card.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Downloads
            </Heading>
            <p className={styles.sectionSubtitle}>
              Share these assets with teammates and reviewers.
            </p>
            <div className={styles.downloads}>
              {downloads.map((item) => (
                <div key={item.label} className={styles.downloadItem}>
                  <span>{item.label}</span>
                  <a href={useBaseUrl(item.link)}>
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
