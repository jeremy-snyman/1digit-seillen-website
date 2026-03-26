// AI Readiness Assessment — Campaign Landing Page Data

export const campaignMeta = {
  title: 'AI Readiness Assessment — Expert-Led Engagement | 1Digit',
  description:
    'A structured, expert-led AI Readiness Assessment that gives your leadership team a clear picture of where you stand and a prioritised roadmap to move forward. £8,000 fixed price.',
  price: '£8,000',
  ctaText: 'Book an Introduction Call',
  ctaHref: '/contact',
};

export const hero = {
  badge: 'AI Readiness Assessment · £8,000 · Fixed Price · 4 Weeks',
  headlineBefore: 'Understand where',
  headlineGradient: 'AI can create real value',
  headlineAfter: 'in your business',
  subheading:
    'A structured, expert-led assessment for leadership teams that need a clear view of AI readiness, delivery risk, and what to do next. Across strategy, data, technology, governance, people, and operating model.',
  supportingText:
    'Transparent pricing. No generic survey. No vague recommendations. Just a grounded view of where you are, what is holding you back, and how to move forward.',
  heroImage: '/images/assessment-puzzle.jpeg',
  heroImageAlt: 'Glowing puzzle piece being placed — representing AI readiness assessment',
};

export const socialProof = {
  headline:
    'Founded by practitioners with 60+ years of combined experience across enterprise architecture, data platforms, AI delivery, product leadership, security, and operational transformation.',
  industries: [
    { label: 'Financial Services', icon: 'chart' },
    { label: 'Travel', icon: 'globe' },
    { label: 'Technology', icon: 'cpu' },
    { label: 'Retail', icon: 'layers' },
  ],
};

export const assessmentAreas = [
  {
    icon: 'brain',
    title: 'Strategy & Leadership Alignment',
    description:
      'How clear is your AI ambition, and is leadership aligned on where value should come from? We assess strategic clarity, executive sponsorship, prioritisation, and how well AI is linked to real business outcomes.',
  },
  {
    icon: 'database',
    title: 'Data Foundations',
    description:
      'Is your data usable for AI in practice, not just in theory? We assess data quality, accessibility, structure, ownership, and the pipelines needed to support analytics, automation, and AI use cases.',
  },
  {
    icon: 'cpu',
    title: 'Technology & Integration',
    description:
      'Can your current stack support AI securely and at scale? We review platform readiness, tooling, cloud and integration constraints, and the practicality of deploying AI into your existing environment.',
  },
  {
    icon: 'shield',
    title: 'Risk, Governance & Compliance',
    description:
      'Are the right guardrails in place? We assess governance, security, compliance considerations, model risk, data controls, and decision-making accountability.',
  },
  {
    icon: 'users',
    title: 'Skills, Capability & Adoption',
    description:
      'Does your organisation have the capability to make AI useful? We assess current skills, delivery capacity, change readiness, training needs, and where capability gaps will slow execution.',
  },
  {
    icon: 'settings',
    title: 'Delivery & Operational Readiness',
    description:
      'Can you move from pilots to repeatable delivery? We assess deployment processes, monitoring, feedback loops, and the operational conditions needed to sustain AI in production.',
  },
];

export const deliverables = [
  {
    number: 1,
    title: 'Executive Summary',
    description:
      'A concise, board-ready view of your current position, the most important findings, and the implications for investment, risk, and execution.',
  },
  {
    number: 2,
    title: 'Capability Heatmap',
    description:
      'A visual breakdown of maturity across all six dimensions, showing where you are strong, where you are exposed, and where the biggest constraints sit.',
  },
  {
    number: 3,
    title: 'Risk & Constraint Analysis',
    description:
      'A clear view of the issues most likely to slow, weaken, or derail AI initiatives, from data issues and technical debt to governance gaps, delivery bottlenecks, and capability shortfalls.',
  },
  {
    number: 4,
    title: 'Prioritised Roadmap',
    description:
      'A sequenced plan covering immediate actions, near-term priorities, and strategic investments, mapped against business value, delivery complexity, and organisational readiness.',
  },
  {
    number: 5,
    title: 'Recommended Next Steps',
    description:
      'Clear guidance on how to move forward, whether that means progressing internally, working with 1Digit, or using a hybrid approach. No lock-in. No obligation.',
  },
];

export const dashboardPreview = {
  heading: 'Dashboard Preview',
  dimensions: [
    { label: 'Strategy', score: 72 },
    { label: 'Data', score: 58 },
    { label: 'Technology', score: 81 },
    { label: 'Governance', score: 45 },
    { label: 'Skills', score: 63 },
    { label: 'Delivery', score: 52 },
  ],
};

export const processSteps = [
  {
    step: 1,
    title: 'Discovery & Alignment',
    duration: 'Week 1',
    description:
      'We begin with a working session to understand your context, ambitions, concerns, stakeholders, and success criteria. This ensures the assessment is grounded in your business, not a generic maturity template.',
  },
  {
    step: 2,
    title: 'Evidence-Based Assessment',
    duration: 'Weeks 2-3',
    description:
      'We run interviews, technical review, and structured analysis across all six dimensions. We look beyond stated ambition and assess the real conditions for AI delivery.',
  },
  {
    step: 3,
    title: 'Synthesis & Prioritisation',
    duration: 'Week 3',
    description:
      'We bring the findings together into a clear view of strengths, gaps, risks, dependencies, and opportunities. Every recommendation is grounded in evidence and shaped around practical next steps.',
  },
  {
    step: 4,
    title: 'Executive Readout',
    duration: 'Week 4',
    description:
      'We present the findings, walk through the roadmap, answer questions, and help you align on what should happen next.',
  },
];

export const maturityStages = [
  {
    level: 1,
    label: 'Ad Hoc',
    color: '#EF4444',
    description: 'No formal AI strategy. Isolated experiments with no coordination.',
  },
  {
    level: 2,
    label: 'Aware',
    color: '#F59E0B',
    description: 'AI interest exists. Some pilots underway but limited governance.',
  },
  {
    level: 3,
    label: 'Defined',
    color: '#3B82F6',
    description: 'Clear strategy and roadmap. Data foundations being established.',
  },
  {
    level: 4,
    label: 'Managed',
    color: '#8B5CF6',
    description: 'AI in production. Governance, monitoring, and scaling in place.',
  },
  {
    level: 5,
    label: 'Optimised',
    color: '#10B981',
    description: 'AI embedded across the business. Continuous improvement and innovation.',
  },
];

export const maturityFeatures = [
  {
    icon: 'zap',
    title: 'Vendor Agnostic',
    description:
      'Objective recommendations based on fit, not commission. We focus on your business outcomes, not licensing quotas.',
  },
  {
    icon: 'users',
    title: 'Senior-Led',
    description:
      'No juniors learning on your budget. Direct access to experienced practitioners who understand both technology and operating model change.',
  },
];

export const pricingSection = {
  badge: 'Fixed Price Engagement',
  headline: 'One price.\nOne focused engagement.\nNo surprises.',
  subhead: 'A fixed-price, expert-led engagement for leadership teams.',
  price: '£8,000',
  priceNote: 'plus VAT',
  inclusions: [
    'Discovery and alignment workshop with key stakeholders',
    'Full assessment across six dimensions',
    'Capability heatmap and constraint analysis',
    'Prioritised roadmap with practical next steps',
    'Executive readout and discussion session',
  ],
  bottomLine: 'No hidden fees. No variable billing. No bloated consulting team.',
  ctaText: 'Secure Your Assessment',
  ctaHref: '/contact',
};

export const midPageCta = {
  heading: 'Ready to find out where you stand?',
  subtext: '30-minute introduction call. No obligation.',
  ctaText: 'Book an Introduction Call',
  ctaHref: '/contact',
};

export const whyCredibility = {
  subhead: 'We do not look at AI in isolation.',
  body: 'Our perspective combines strategy, enterprise architecture, data, product, security, governance, and delivery. That matters because most AI programmes do not succeed or fail on the model. They succeed or fail on the surrounding business conditions.',
  credibilityLine:
    'Our team has led AI, data, and architecture programmes across FTSE 250 companies, NHS trusts, and high-growth technology firms. We built 1Digit to bring that enterprise-grade experience to organisations that need clarity, not another generic consultancy.',
  differentiators: [
    'Broad experience across data platforms, AI products, enterprise systems, and governance',
    'A practical view of what it takes to move from interest and pilots to real delivery',
    'Vendor-neutral recommendations based on fit, not commission',
    'Senior-led engagement from people who understand both technology and operating model change',
    'Clear outputs designed to support decisions, not just generate discussion',
  ],
};

export const whoThisIsFor = {
  intro:
    'This is designed for leadership teams that are serious about AI and need a grounded view of where they are, what is missing, and what to do next.',
  items: [
    {
      icon: 'target',
      text: 'Your leadership team knows AI matters, but needs a clearer view of where to focus',
    },
    {
      icon: 'database',
      text: 'You have run pilots or experiments, but progress has stalled or failed to scale',
    },
    {
      icon: 'shield',
      text: 'Your board is asking for a credible plan, not just enthusiasm',
    },
    {
      icon: 'chart',
      text: 'You are considering investment and need to prioritise properly',
    },
    {
      icon: 'eye',
      text: 'You want an independent view before committing to platforms, partners, or large programmes',
    },
    {
      icon: 'layers',
      text: 'You need to understand both opportunity and risk before moving further',
    },
  ],
};

export const bottomCta = {
  heading: 'Start the conversation',
  description:
    'Book a 30-minute introduction call to discuss your goals and see if the assessment is right for you.',
  ctaText: 'Book an Introduction Call',
  ctaHref: '/contact',
};

export const faqs = [
  {
    question: 'How long does the assessment take?',
    answer:
      'The engagement runs over four weeks from kick-off to executive readout. It is designed to be thorough enough to be credible, but focused enough to avoid months of delay.',
  },
  {
    question: 'Who needs to be involved from our side?',
    answer:
      'Typically 6 to 10 stakeholders across leadership, technology, data, operations, and relevant business areas. Most people will only need to commit a few hours across the engagement.',
  },
  {
    question: 'Is the £8,000 price fixed?',
    answer:
      'Yes. The full engagement is fixed at £8,000 and includes discovery, assessment, analysis, and executive readout. There are no hidden fees.',
  },
  {
    question: 'What if we already have an AI strategy?',
    answer:
      'That is often where the assessment becomes most valuable. We help validate the strategy, identify blind spots, and test whether the organisation is actually ready to deliver against it.',
  },
  {
    question: 'Do you only work with large enterprises?',
    answer:
      'No. The assessment is designed for organisations that are serious about AI, from mid-market companies to large enterprises. The approach scales to your context.',
  },
  {
    question: 'What happens after the assessment?',
    answer:
      'You receive the full deliverables pack and can act on it independently. If you want support with implementation afterwards, we can discuss that separately, but there is no obligation.',
  },
];
