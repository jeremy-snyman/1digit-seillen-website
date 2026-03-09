// ── New interfaces ──

export interface PricingPrinciple {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface EngagementPhase {
  number: string;
  title: string;
  description: string;
  icon: string;
  accentColor: 'blue' | 'purple' | 'green' | 'amber';
  duration: string;
  image: string;
  details: string[];
}

export interface PricingBandItem {
  name: string;
  description: string;
  priceRange: string;
  duration: string;
  highlighted?: boolean;
  accentColor?: string;
}

export interface AssessmentExample {
  title: string;
  priceRange: string;
  duration: string;
  processSteps: string[];
  deliverables: string[];
  imageDark: string;
  imageLight: string;
}

export interface ValueStat {
  value: string;
  suffix?: string;
  label: string;
  description: string;
}

export interface EngagementCommitment {
  title: string;
  description: string;
  icon: string;
}

// ── Data arrays ──

export const pricingPrinciples: PricingPrinciple[] = [
  {
    number: '01',
    title: 'Defined Scope',
    description: 'Every engagement has clear boundaries, deliverables, and acceptance criteria agreed upfront.',
    icon: 'clipboard',
  },
  {
    number: '02',
    title: 'Outcome-Based Delivery',
    description: 'We price around results and milestones — not hours logged or bodies on seats.',
    icon: 'target',
  },
  {
    number: '03',
    title: 'Indicative Pricing Bands',
    description: 'Published ranges so you can plan budgets before the first conversation.',
    icon: 'chart',
  },
  {
    number: '04',
    title: 'Milestone-Based Execution',
    description: 'Payment tied to visible progress. Nothing proceeds without stakeholder sign-off.',
    icon: 'check',
  },
  {
    number: '05',
    title: 'Optional Retained Advisory',
    description: 'Ongoing support available after delivery — step down gracefully, not abruptly.',
    icon: 'users',
  },
];

export const engagementPhases: EngagementPhase[] = [
  {
    number: '01',
    title: 'Diagnostic',
    description: 'Structured assessment of your current AI readiness, data maturity, and organisational alignment. A clear starting point.',
    icon: 'search',
    accentColor: 'blue',
    duration: '1–5 weeks',
    image: '/images/pricing/phase-diagnostic.svg',
    details: [
      'Stakeholder interviews (3–5 sessions)',
      'Scoring across 6 AI readiness pillars',
      'Data and infrastructure review',
      'Governance and risk assessment',
    ],
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Transform diagnostic insights into a prioritised, costed roadmap with investment sequencing and governance alignment.',
    icon: 'target',
    accentColor: 'purple',
    duration: '4–8 weeks',
    image: '/images/pricing/phase-strategy.svg',
    details: [
      'Prioritised use case scoring',
      'ROI modelling and investment sequencing',
      'Governance alignment review',
      'Implementation roadmap with phasing',
    ],
  },
  {
    number: '03',
    title: 'Build',
    description: 'Milestone-based implementation with defined deliverables, quality gates, and stakeholder checkpoints throughout.',
    icon: 'layers',
    accentColor: 'green',
    duration: '8–20 weeks',
    image: '/images/pricing/phase-build.svg',
    details: [
      'Sprint-based milestone delivery',
      'Quality gates and stakeholder checkpoints',
      'Architecture and security reviews',
      'Continuous validation and testing',
    ],
  },
  {
    number: '04',
    title: 'Operate',
    description: 'Ongoing advisory, monitoring, and governance support for AI systems in production. Stability and continuous optimisation.',
    icon: 'settings',
    accentColor: 'amber',
    duration: 'Monthly',
    image: '/images/pricing/phase-operate.svg',
    details: [
      'Performance monitoring and drift detection',
      'Cost optimisation and governance updates',
      'Executive advisory and reporting',
      'Continuous improvement cycles',
    ],
  },
];

export const pricingBands: PricingBandItem[] = [
  {
    name: 'AI Maturity Scan',
    description: 'Structured assessment of AI readiness with executive summary and high-level roadmap.',
    priceRange: '£8,000 – £15,000',
    duration: '1–2 weeks',
    accentColor: '#64C8FF',
  },
  {
    name: 'Enterprise Readiness Review',
    description: 'Comprehensive 10-dimension scoring, risk analysis, heatmap, and transformation roadmap.',
    priceRange: '£25,000 – £60,000',
    duration: '3–5 weeks',
    highlighted: true,
    accentColor: '#A064FF',
  },
  {
    name: 'Strategy & Roadmap',
    description: 'Prioritised implementation plan with use case scoring, ROI modelling, and investment sequencing.',
    priceRange: '£40,000 – £120,000',
    duration: '4–8 weeks',
    accentColor: '#50DCB4',
  },
  {
    name: 'AI Ops / SecOps Retainer',
    description: 'Ongoing monitoring, drift detection, governance updates, and executive advisory.',
    priceRange: '£10,000 – £35,000/mo',
    duration: 'Monthly',
    accentColor: '#FFB43C',
  },
];

export const assessmentExample: AssessmentExample = {
  title: 'AI Maturity Scan',
  priceRange: '£8,000 – £15,000',
  duration: '1–2 weeks',
  processSteps: [
    'Stakeholder interviews (3–5 sessions)',
    'Scoring across 6 AI readiness pillars',
    'Data and infrastructure review',
    'Governance and risk assessment',
  ],
  deliverables: [
    'Executive summary report',
    'AI readiness scorecard with heatmap',
    'Gap analysis and quick wins',
    'High-level transformation roadmap',
  ],
  imageDark: '/images/pricing/assessment-example.svg',
  imageLight: '/images/pricing/assessment-example.svg',
};

export const valueStats: ValueStat[] = [
  {
    value: '7–10',
    suffix: 'x',
    label: 'Return on AI investment',
    description: 'Typical ROI for organisations that move from assessment to structured implementation.',
  },
  {
    value: '35',
    suffix: '%',
    label: 'Higher conversion to action',
    description: 'Clients with a defined roadmap are far more likely to move from strategy to execution.',
  },
  {
    value: '4',
    suffix: ' weeks',
    label: 'To first actionable insight',
    description: 'From engagement kickoff to executive-ready findings you can act on immediately.',
  },
];

export const engagementCommitments: EngagementCommitment[] = [
  {
    title: 'Structured Documentation',
    description: 'Every engagement produces clear, versioned deliverables — not slide decks that gather dust.',
    icon: 'check',
  },
  {
    title: 'Executive-Ready Deliverables',
    description: 'Outputs designed for board-level communication, not just technical teams.',
    icon: 'chart',
  },
  {
    title: 'Architectural Clarity',
    description: 'Reference architectures, data flows, and integration patterns — not abstract diagrams.',
    icon: 'layers',
  },
  {
    title: 'Transparent Assumptions',
    description: 'Every recommendation comes with stated assumptions, constraints, and risk factors.',
    icon: 'shield',
  },
  {
    title: 'Defined Next Steps',
    description: 'Clear handover with prioritised actions, ownership mapping, and transition support.',
    icon: 'arrow-right',
  },
];
