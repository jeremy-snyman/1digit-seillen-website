export const pillars = [
  {
    id: 'ai-readiness',
    number: '01',
    title: 'AI Readiness & Honest Assessment',
    icon: 'target',
    problem: 'Most AI initiatives fail because organisations skip assessment. They invest in technology before understanding their data maturity, governance gaps, or organisational readiness.',
    approach: [
      'Executive discovery and alignment workshops',
      'Capability benchmarking and scoring across key pillars',
      'Identification of blockers — data, governance, ownership, architecture, culture',
      'Prioritised recommendations and transformation roadmap'
    ],
    deliverables: [
      'Executive-ready summary',
      'Capability heatmap and scoring',
      'Risk and constraint analysis',
      '6–18 month roadmap with sequencing',
      'Recommended next engagement options'
    ],
    outcomes: ['Confidence to invest', 'Reduced failed pilots', 'Clear scope and ownership'],
    timeframe: '2–5 weeks',
    cta: { label: 'Assess Your AI Readiness', href: '/ai-readiness-assessment' },
    thumbnail: '/images/what-we-do/ai-readiness-thumb.png',
    image: '/images/what-we-do/ai-readiness-detail.png',
  },
  {
    id: 'data-platforms',
    number: '02',
    title: 'Data & Platform Foundations',
    icon: 'database',
    problem: 'Fragmented data across siloed systems makes AI impossible. Without unified, quality data foundations, even the best models produce unreliable results.',
    approach: [
      'Data unification and modelling',
      'Ingestion design and implementation using Tachyon',
      'Smart Lakehouse architecture and build',
      'Observability, data quality and lineage foundations',
      'Cost-efficient cloud design'
    ],
    deliverables: [
      'Target architecture',
      'Implementation plan',
      'Working ingestion patterns',
      'Data model patterns',
      'Operational runbook foundations'
    ],
    outcomes: ['Unified data estate', 'AI-ready infrastructure', 'Reduced cloud spend'],
    timeframe: '6–16 weeks',
    cta: { label: 'Explore Data Platforms', href: '/data-platforms' },
    thumbnail: '/images/what-we-do/data-platforms-thumb.png',
    image: '/images/what-we-do/data-platforms-detail.png',
  },
  {
    id: 'ai-products',
    number: '03',
    title: 'AI-Enabled Products & Engineering',
    icon: 'cpu',
    problem: 'Building AI products without proper architecture leads to fragile systems, compliance risks, and products that cannot scale or be maintained.',
    approach: [
      'AI-native application design — human + AI workflows',
      'Agent and workflow integration into business processes',
      'Guardrails, evaluations, and model governance',
      'AI-first SDLC integration',
      'Continuous validation, monitoring and optimisation'
    ],
    deliverables: [
      'Product blueprint and backlog',
      'MVP build plan and milestones',
      'Guardrails and evaluation approach',
      'Production readiness checklist'
    ],
    outcomes: ['Production-ready AI products', 'Governed model deployment', 'Measurable business value'],
    timeframe: '8–20 weeks',
    cta: { label: 'Discuss Your AI Product', href: '/contact' },
    thumbnail: '/images/what-we-do/ai-products-thumb.png',
    image: '/images/what-we-do/ai-products-detail.png',
  },
  {
    id: 'governance',
    number: '04',
    title: 'AI Architecture, Governance & Secure Implementation',
    icon: 'shield',
    problem: 'AI without governance creates risk — regulatory exposure, security vulnerabilities, and uncontrolled model behaviour that erodes trust.',
    approach: [
      'Risk and policy frameworks',
      'Security and compliance alignment',
      'Role-based access controls and auditability',
      'AI Ops and AI SecOps support'
    ],
    deliverables: [
      'Governance framework and templates',
      'Security boundaries and controls',
      'Operating model recommendations',
      'Retainer options for ongoing oversight'
    ],
    outcomes: ['Scalable AI without risk', 'Regulatory compliance', 'Stakeholder trust'],
    timeframe: '4–12 weeks',
    cta: { label: 'View Full Architecture Framework', href: '/architecture' },
    secondaryCta: { label: 'Discuss Governance', href: '/contact' },
    thumbnail: '/images/what-we-do/governance-thumb.png',
    image: '/images/what-we-do/governance-detail.png',
  },
];

export const valueProps = [
  {
    icon: 'target',
    title: 'Assessment-First Approach',
    description: 'We diagnose before we build. Every engagement starts with honest assessment — no assumptions, no templates.',
  },
  {
    icon: 'layers',
    title: 'End-to-End Delivery',
    description: 'Strategy through to production. One team, no handoff gaps between advice and implementation.',
  },
  {
    icon: 'shield',
    title: 'Governance by Design',
    description: 'Security, compliance, and auditability built in from day one — not bolted on as an afterthought.',
  },
];

export const dataPlatformPillars = [
  { title: 'Ingestion', subtitle: 'Streaming & Batch', description: 'Connect to any source with real-time streaming and batch ingestion patterns. Tachyon powers our multiplexed ingestion engine.', icon: 'zap' },
  { title: 'Augmentation & Enrichment', subtitle: 'Data Quality', description: 'Structured web data extraction, whole-of-market dataset construction, schema alignment, and ongoing enrichment pipelines.', icon: 'layers' },
  { title: 'Processing & Transformation', subtitle: 'Compute Layer', description: 'Distributed query engines, transformation pipelines, and AI-optimised processing for structured and unstructured data.', icon: 'cpu' },
  { title: 'Storage & Cost Optimisation', subtitle: 'Lakehouse Architecture', description: 'Open table formats, tiered storage, and intelligent data lifecycle management that controls cost to serve.', icon: 'database' },
  { title: 'Query & Analytics', subtitle: 'Business Intelligence', description: 'Fast analytical queries across your entire data estate with built-in visualization and self-service analytics.', icon: 'chart' },
  { title: 'AI Enablement', subtitle: 'Model-Ready Data', description: 'Feature stores, vector databases, model serving infrastructure, and the data pipelines that keep AI systems accurate.', icon: 'target' },
];

export const dataPatterns = [
  { name: 'Batch Processing', description: 'Scheduled ETL/ELT pipelines for large-volume data processing' },
  { name: 'Real-time Streaming', description: 'Event-driven architectures with sub-second latency' },
  { name: 'Change Data Capture', description: 'Incremental synchronization from operational databases' },
  { name: 'Event-based Architecture', description: 'Pub/sub patterns for decoupled, scalable systems' },
];

export const processSteps = [
  {
    number: '01',
    title: 'Diagnose',
    description: 'We start by understanding your current state — data landscape, organisational readiness, and strategic objectives. No assumptions, no templates.',
    details: ['Stakeholder interviews', 'Data estate mapping', 'Capability assessment', 'Risk identification'],
    icon: 'search',
    accentColor: 'blue' as const,
    independent: true,
    gate: { title: 'Diagnosis Review', criteria: 'Current-state findings reviewed and validated by stakeholders' },
    image: '/images/how-we-work/diagnose.svg',
  },
  {
    number: '02',
    title: 'Architect',
    description: 'We design the target architecture, define the transformation roadmap, and establish governance boundaries before any build begins.',
    details: ['Target architecture design', 'Technology selection', 'Governance framework', 'Cost modelling'],
    icon: 'layers',
    accentColor: 'purple' as const,
    independent: true,
    gate: { title: 'Architecture Sign-off', criteria: 'Target architecture and roadmap approved by technical and business leads' },
    image: '/images/how-we-work/architect.svg',
  },
  {
    number: '03',
    title: 'Build',
    description: 'We deliver in structured sprints with clear milestones, continuous validation, and regular stakeholder checkpoints.',
    details: ['Sprint-based delivery', 'Milestone sign-offs', 'Quality assurance', 'Security reviews'],
    icon: 'zap',
    accentColor: 'green' as const,
    independent: true,
    gate: { title: 'Build Acceptance', criteria: 'Deliverables tested, documented, and accepted by stakeholders' },
    image: '/images/how-we-work/build.svg',
  },
  {
    number: '04',
    title: 'Optimise',
    description: 'Post-delivery, we monitor, optimise, and evolve. AI systems need continuous attention — we provide the operational framework.',
    details: ['Performance monitoring', 'Cost optimisation', 'Model drift detection', 'Continuous improvement'],
    icon: 'chart',
    accentColor: 'amber' as const,
    independent: true,
    gate: { title: 'Optimisation Baseline', criteria: 'Performance baselines established and improvement targets agreed' },
    image: '/images/how-we-work/optimise.svg',
  },
];

export const commercialCheckpoints = [
  { number: '01', title: 'Engagement Kick-off', description: 'Scope confirmed, team mobilised, initial milestone plan agreed' },
  { number: '02', title: 'Phase Milestone', description: 'Deliverables demonstrated and validated against acceptance criteria' },
  { number: '03', title: 'Gate Approval', description: 'Formal stakeholder sign-off before next phase begins' },
  { number: '04', title: 'Engagement Close', description: 'Final deliverables handed over, knowledge transfer complete, next steps documented' },
];

export const weekCadence = [
  { day: 'Monday', title: 'Sprint Planning', description: 'Priority alignment and clear objectives set for the week.', icon: 'target' },
  { day: 'Midweek', title: 'Focused Delivery', description: 'Heads-down delivery with async check-ins. Issues surfaced early, blockers removed fast.', icon: 'zap' },
  { day: 'Friday', title: 'Review & Demo', description: 'Progress review and stakeholder update. Deliverables demonstrated, next week scoped.', icon: 'chart' },
];

export const partnershipInputs = {
  client: [
    'Executive sponsor with decision-making authority',
    'Access to key stakeholders for workshops and interviews',
    'Data access and environment credentials where required',
    'Timely feedback on deliverables and milestones',
    'Commitment to the defined engagement cadence',
  ],
  ours: [
    'Dedicated engagement lead and consistent team',
    'Weekly visibility into progress and blockers',
    'No surprises — risks surfaced early and openly',
    'Documented deliverables at every milestone',
    'Knowledge transfer built into every phase',
  ],
};

export const definitionOfDone = [
  { title: 'Documented Deliverables', description: 'All outputs documented, structured, and formally handed over to your team' },
  { title: 'Stakeholder Sign-off', description: 'Formal acceptance at each milestone checkpoint — nothing ships without approval' },
  { title: 'Knowledge Transfer', description: 'Your team understands what was built, why decisions were made, and how to operate it' },
  { title: 'Clear Next Steps', description: 'Defined recommendations and options for the next phase of work' },
];
