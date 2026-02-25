// ── Smart Lakehouse / Tachyon Intelligence Platform — Page Data ──

export interface CostProblem {
  icon: string;
  title: string;
  description: string;
}

export interface StatHighlightData {
  value: string;
  label: string;
  description?: string;
}

export interface ComparisonRow {
  scenario: string;
  scenarioDetail?: string;
  hyperscaler: string;
  tachyon: string;
  savings: string;
}

export interface Benefit {
  title: string;
  icon: string;
  description: string;
}

export interface UseCase {
  title: string;
  description: string;
}

// ── Hero ──

export const heroTagline = 'Enterprise data lakehouse. Without hyperscaler cost escalation.';

export const heroPartnershipText =
  '1Digit has architected and delivered a data warehousing platform in partnership with IONOS. We are a technology provider to IONOS — not merely a reseller.';

export const techStackTags = [
  'Trino',
  'Kafka',
  'Superset',
  'Iceberg',
  'Kubernetes',
  'Open Table Formats',
];

// ── Section 2: Core Commercial Narrative ──

export const costProblems: CostProblem[] = [
  {
    icon: 'chart',
    title: 'Consumption-Based Billing',
    description:
      'Query costs scale with usage, not value. As analytical demand grows, bills accelerate unpredictably.',
  },
  {
    icon: 'database',
    title: 'Escalating Storage Costs',
    description:
      'Proprietary formats and tiered pricing mean storage costs compound as data volumes increase.',
  },
  {
    icon: 'cpu',
    title: 'Expensive AI Expansion',
    description:
      'AI and ML workloads demand significant compute. Hyperscaler per-query billing makes experimentation costly.',
  },
  {
    icon: 'lock',
    title: 'Egress and Lock-In Fees',
    description:
      'Moving data out — or moving away — comes with significant financial and technical friction.',
  },
];

// ── Section 3: The Tachyon Difference ──

export const statHighlights: StatHighlightData[] = [
  {
    value: '40–60%',
    label: 'Lower Infrastructure Cost',
    description: 'Compared to equivalent hyperscaler-based warehouse deployments.',
  },
  {
    value: 'Six-Figure',
    label: 'Annual Savings at ~50TB',
    description: 'Indicative annual cost reduction at 50TB monthly processing scale.',
  },
  {
    value: 'Up to 60%',
    label: 'AI/ML Cost Reduction',
    description: 'Lower infrastructure and efficient processing for machine learning workloads.',
  },
];

export const differentiators = [
  'Transparent, predictable pricing with no consumption surprises',
  'Lower baseline infrastructure cost than hyperscaler equivalents',
  'Predictable billing that scales linearly with data volume',
  'No egress fees within IONOS network',
  'Open-source stack eliminates licensing premiums',
  'Compute scales independently of storage',
];

// ── Section 4: Cost Comparison Table ──

export const comparisonRows: ComparisonRow[] = [
  {
    scenario: '50TB Monthly Analytics',
    scenarioDetail: 'Enterprise analytical workloads',
    hyperscaler: 'High compute credit consumption with escalating per-query costs',
    tachyon: 'Optimised infrastructure model with predictable pricing',
    savings: '40–60%',
  },
  {
    scenario: 'AI/ML Workloads',
    scenarioDetail: 'Model training and inference',
    hyperscaler: 'Escalating per-query billing with expensive compute provisioning',
    tachyon: 'Lower infrastructure cost with efficient processing architecture',
    savings: 'Up to 60%',
  },
  {
    scenario: 'Scaling to 200TB',
    scenarioDetail: 'Growing data estates',
    hyperscaler: 'Non-linear cost growth with compounding storage and compute fees',
    tachyon: 'Predictable infrastructure scaling with linear cost progression',
    savings: 'Significant',
  },
];

export const comparisonCallout = 'Six-figure annual savings at ~50TB monthly processing scale.';
export const comparisonDisclaimer =
  'Savings indicative. Based on benchmark comparisons vs hyperscaler-based warehouse deployments.';

// ── Section 5: Architecture & Capability ──

export const architectureFeatures = [
  'Managed lakehouse environment on IONOS',
  'Distributed SQL query engine (Trino)',
  'Self-service analytics and visualisation (Superset)',
  'Data cataloguing and governance',
  'AI/ML pipeline integration',
  'Apache Iceberg open table format',
];

export const benefits: Benefit[] = [
  {
    title: 'Cost Efficiency',
    icon: 'chart',
    description:
      'Significantly lower total cost of ownership compared to hyperscaler data warehousing solutions. Pay for what you use, not what you provision.',
  },
  {
    title: 'European Data Sovereignty',
    icon: 'shield',
    description:
      'Data stays in Europe. GDPR-aligned infrastructure with no transatlantic data transfers required.',
  },
  {
    title: 'Enterprise-Grade Performance',
    icon: 'zap',
    description:
      'Distributed query execution, intelligent caching, and optimised storage for analytical and AI workloads at scale.',
  },
  {
    title: 'SaaS-Like Simplicity',
    icon: 'settings',
    description:
      'A managed lakehouse experience without the operational complexity. Focus on data, not infrastructure management.',
  },
  {
    title: 'AI-Optimised Architecture',
    icon: 'cpu',
    description:
      'Built for AI workloads from the ground up. Feature stores, model serving, and vector operations are first-class citizens.',
  },
  {
    title: 'Open Standards',
    icon: 'globe',
    description:
      'Built on open table formats and open-source technologies. No proprietary lock-in, full data portability.',
  },
];

// ── Section 6: Use Cases ──

export const useCases: UseCase[] = [
  {
    title: 'AI & Machine Learning',
    description:
      'Centralised, governed data estate that feeds AI models with clean, timely, structured data at scale — at a fraction of hyperscaler compute cost.',
  },
  {
    title: 'Business Analytics',
    description:
      'Self-service analytics across your entire data landscape with sub-second query performance and predictable infrastructure costs.',
  },
  {
    title: 'Data Consolidation',
    description:
      'Bring fragmented data from legacy systems, SaaS tools, and operational databases into one governed platform without egress penalties.',
  },
  {
    title: 'Regulatory Compliance',
    description:
      'European-sovereign data infrastructure with built-in governance, lineage, and audit capabilities — cost-efficient by design.',
  },
];

// ── Section 5: Architecture Layers (reused from services.ts via CSS blocks) ──

export const architectureLayers = [
  'Analytics & AI',
  'Processing & Query',
  'Unified Data Lake',
  'IONOS Cloud Infrastructure',
];
