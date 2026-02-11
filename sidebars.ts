import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Product',
      items: [
        'product/overview',
        'product/subscription-plans',
        'product/governance-and-roles',
        'product/module-capabilities',
      ],
    },
    {
      type: 'category',
      label: 'Functional Flows',
      items: [
        'functional/authentication-login',
        'functional/community-flow',
        'functional/event-flow',
        'functional/feed-chat-flow',
        'functional/finance-flow',
        'functional/tasks-polls-notifications',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/high-level-design',
        'architecture/supabase-service-map',
        'architecture/data-and-security-model',
        'architecture/sequence-diagrams',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'operations/feature-flagging-and-rollout',
        'operations/release-governance',
        'operations/maintenance-budgeting',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/implementation-inventory',
        'reference/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Legal',
      items: [
        'legal/privacy-policy',
        'legal/terms-of-service',
      ],
    },
  ],
};

export default sidebars;
