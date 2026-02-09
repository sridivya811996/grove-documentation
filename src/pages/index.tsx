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
    description: 'Market research, user stories, and target customers.',
    link: '/docs/product/market-research-and-differentiation',
  },
  {
    title: 'Architecture',
    description: 'System design, permissions, auth strategy, feature flags.',
    link: '/docs/architecture/architecture',
  },
  {
    title: 'UX & Design',
    description: 'Design system, screen designs, and visual assets.',
    link: '/docs/ux-design/ui-ux-design-system',
  },
  {
    title: 'Engineering',
    description: 'Tech landscape, roadmap, and infrastructure automation.',
    link: '/docs/engineering/technology-landscape',
  },
  {
    title: 'Operations',
    description: 'App store launch checklist, guide, and release ops.',
    link: '/docs/operations/app-store-checklist',
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
              <Link className="button button--outline" to="/docs/product/market-research-and-differentiation">
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
