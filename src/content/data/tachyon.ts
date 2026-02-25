// ── Tachyon Product Page — Data ──

export interface PainPoint {
  icon: string;
  title: string;
  description: string;
}

export interface CoreFunction {
  number: string;
  title: string;
  tagline: string;
  icon: string;
  features: string[];
  note: string;
}

export interface ArchitectureLayer {
  name: string;
  description: string;
}

export interface PerformanceStat {
  value: string;
  label: string;
  description: string;
}

export interface DeploymentOption {
  icon: string;
  title: string;
  description: string;
}

// ── Hero ──

export const heroDescription =
  'Unify fragmented enterprise data, detect sensitivity, enforce structure and make it immediately usable for analytics, AI and operational systems.';

// ── S2: The Problem ──

export const problemIntro =
  'Modern enterprises operate across dozens — often hundreds — of systems. This creates:';

export const painPoints: PainPoint[] = [
  {
    icon: 'layers',
    title: 'Inconsistent Schemas',
    description: 'Schemas differ across platforms, making consolidation unreliable and downstream systems fragile.',
  },
  {
    icon: 'database',
    title: 'Unstructured Data Growth',
    description: 'Semi-structured and unstructured data volumes grow unchecked without classification or governance.',
  },
  {
    icon: 'shield',
    title: 'Mixed Regulated Data',
    description: 'Personal and regulated data sits alongside operational datasets without clear separation or controls.',
  },
  {
    icon: 'zap',
    title: 'Slow Batch Pipelines',
    description: 'Traditional batch processing delays usability, leaving downstream teams waiting for stale data.',
  },
  {
    icon: 'cpu',
    title: 'Unreliable AI Inputs',
    description: 'AI and analytics consume inputs that are inconsistent, ungoverned, and often incomplete.',
  },
  {
    icon: 'settings',
    title: 'Duplicate Transformation Logic',
    description: 'Multiple teams rebuild the same transformation logic independently, creating drift and duplication.',
  },
];

export const problemResult =
  'Data is stored everywhere, trusted inconsistently, and activated too slowly.';

export const problemFollowup =
  'Tachyon addresses these operational failures directly.';

// ── S3: Core Functions ──

export const coreFunctionsIntro =
  'Tachyon structures and governs data at ingestion, then prepares it for immediate downstream use.';

export const coreFunctions: CoreFunction[] = [
  {
    number: '01',
    title: 'Structured Ingestion',
    tagline: 'Impose order at the point of entry',
    icon: 'layers',
    features: [
      'High-throughput data intake',
      'Extensible connector framework (continuously expanding)',
      'Custom connector support',
      'Schema enforcement at entry',
      'Version-controlled schema evolution',
    ],
    note: 'Data becomes consistent before it propagates across systems.',
  },
  {
    number: '02',
    title: 'Sensitivity Detection & Governance',
    tagline: 'Detect, classify and protect by default',
    icon: 'shield',
    features: [
      'Automatic classification of data types',
      'Detection of personal and regulated data',
      'Separation into secure Personal Data Vault',
      'Encryption in transit and at rest',
      'Role-based access control',
      'Audit logging',
    ],
    note: 'Governance is embedded in the ingestion layer — not applied after distribution.',
  },
  {
    number: '03',
    title: 'Low-Latency Processing & Activation',
    tagline: 'From arrival to usable — fast',
    icon: 'zap',
    features: [
      'Real-time validation and transformation',
      'Batch-to-event conversion',
      'Multiplexed distribution across downstream systems',
      'Parallel pipeline execution',
    ],
    note: 'Data moves from arrival to usable state quickly, reducing activation lag.',
  },
  {
    number: '04',
    title: 'AI & Model Preparation',
    tagline: 'Structured inputs for intelligent systems',
    icon: 'cpu',
    features: [
      'Curated training dataset preparation',
      'Embedding generation workflows',
      'Vector-ready structured outputs',
      'Agent-ready data feeds',
      'Model lifecycle triggers',
    ],
    note: 'Tachyon does not replace models. It ensures models receive structured, governed inputs.',
  },
];

// ── S4: Architecture ──

export const architectureIntro =
  'Tachyon operates as a layered data control platform.';

export const architectureLayers: ArchitectureLayer[] = [
  {
    name: 'AI Enablement Layer',
    description: 'Prepares datasets, embeddings and structured feeds for AI agents, model training and retrieval systems.',
  },
  {
    name: 'Activation Layer',
    description: 'Event streaming, batch-to-event conversion, API exposure and synchronisation with downstream systems.',
  },
  {
    name: 'Governance Layer',
    description: 'Sensitivity detection, Personal Data Vault separation, encryption and access policies before activation.',
  },
  {
    name: 'Structuring Engine',
    description: 'Normalises, validates and classifies incoming data to produce consistent outputs.',
  },
  {
    name: 'Ingestion Layer',
    description: 'Handles structured, semi-structured and unstructured inputs with schema enforcement and version control.',
  },
];

export const architectureCallout =
  'Each layer is additive. Tachyon can be deployed incrementally — starting with ingestion and structuring, then expanding into governance, activation and AI enablement as requirements evolve.';

// ── S5: Performance ──

export const performanceIntro =
  'Tachyon is engineered for environments where latency and reliability matter.';

export const performanceStats: PerformanceStat[] = [
  {
    value: 'High',
    label: 'Throughput Ingestion',
    description: 'Processes large data volumes without bottleneck across multiple concurrent sources.',
  },
  {
    value: 'Low',
    label: 'Latency Validation',
    description: 'Near real-time schema enforcement and quality checks at the point of entry.',
  },
  {
    value: 'Parallel',
    label: 'Pipeline Execution',
    description: 'Concurrent processing across multiple pipelines with intelligent workload distribution.',
  },
  {
    value: 'Real-Time',
    label: 'Activation Support',
    description: 'Data available to downstream systems immediately after structuring and governance.',
  },
];

export const performanceCallout =
  'Speed is measured by reduced time from ingestion to governed, usable output.';

// ── S6: Deployment ──

export const deploymentOptions: DeploymentOption[] = [
  {
    icon: 'globe',
    title: 'Managed Cloud',
    description: 'Fully managed hosted deployment on any major cloud provider — AWS, Azure, GCP, or IONOS.',
  },
  {
    icon: 'shield',
    title: 'On-Premise',
    description: 'For regulated and air-gapped environments requiring full infrastructure control.',
  },
  {
    icon: 'layers',
    title: 'Hybrid',
    description: 'Split workloads across cloud and on-premise to balance performance, cost and compliance.',
  },
  {
    icon: 'settings',
    title: 'CI/CD Integration',
    description: 'Native integration with existing delivery pipelines for automated deployment and testing.',
  },
  {
    icon: 'users',
    title: 'Enterprise Support',
    description: 'Dedicated support and SLA-backed operations for production deployments at scale.',
  },
];

export const deploymentClosing =
  'Tachyon integrates with existing enterprise infrastructure without requiring wholesale replacement of core systems.';

// ── S7: Core Statement ──

export const coreStatement =
  'Tachyon structures, governs and activates enterprise data at speed — ensuring it is ready for any downstream use.';
