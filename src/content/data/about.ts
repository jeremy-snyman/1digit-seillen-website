// ── About Page — Data ──

export interface Pillar {
  icon: string;
  title: string;
  description: string;
}

export interface Differentiator {
  icon: string;
  title: string;
  description: string;
}

export interface ApproachStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}

export interface Value {
  icon: string;
  title: string;
  description: string;
}

// ── S1: Hero ──

export const heroDescription =
  '1Digit is an AI architecture and data engineering firm that enables enterprise AI adoption through structured data platforms, governance models, and scalable engineering. We simplify the complex — so your organisation can move from data chaos to AI-ready infrastructure.';

// ── S2: Mission & Vision ──

export const missionText =
  'To simplify enterprise data and AI platform delivery — replacing fragmented toolchains, ungoverned data, and runaway costs with structured, production-grade systems that organisations can trust and scale.';

export const visionText =
  'To make enterprise AI adoption practical, governed, and cost-effective for every organisation — regardless of size, industry, or cloud provider. AI should be an operational advantage, not a perpetual proof-of-concept.';

export const philosophyQuote =
  'AI success is not a model problem. It is a data problem, an architecture problem, and a governance problem.';

// ── S3: Core Pillars ──

export const corePillars: Pillar[] = [
  {
    icon: 'layers',
    title: 'Structured',
    description: 'Architecture-led delivery. Every system starts with a blueprint — data models, integration patterns, and governance frameworks defined before a line of code is written.',
  },
  {
    icon: 'target',
    title: 'Practical',
    description: 'AI that delivers measurable outcomes, not proof-of-concepts that never reach production. We build for the real world — timelines, budgets, and operational constraints included.',
  },
  {
    icon: 'eye',
    title: 'Transparent',
    description: 'Fixed scopes, clear deliverables, no surprise costs. Every engagement has published pricing, milestone-based progress, and full visibility into what you are paying for.',
  },
];

// ── S4: What Makes Us Different ──

export const differentiatorIntro =
  'We are not another AI consultancy. We are an architecture and engineering firm that happens to specialise in AI and data.';

export const differentiators: Differentiator[] = [
  {
    icon: 'database',
    title: 'Data-First Approach',
    description: 'Most AI consultancies start with the model and work backwards. We start with your data landscape — unifying, governing, and structuring it so AI has a foundation worth building on.',
  },
  {
    icon: 'layers',
    title: 'Architecture Discipline',
    description: 'TOGAF-informed, security-embedded, governance-aligned. We bring enterprise architecture rigour to AI delivery — not startup shortcuts disguised as agility.',
  },
  {
    icon: 'settings',
    title: 'We Build, Not Advise',
    description: 'We deliver working platforms and products — not slide decks. Strategy is only valuable when it becomes implementation. Every engagement produces production-grade outputs.',
  },
  {
    icon: 'chart',
    title: 'Cost Transparency',
    description: 'Published pricing, fixed scopes, milestone-based delivery. You always know what you are paying for — and what you are getting. No open-ended retainers, no ambiguous timelines.',
  },
  {
    icon: 'shield',
    title: 'Governance Is Not Optional',
    description: 'Security, compliance, and auditability are embedded from day one. Not bolted on after the first audit finding. Every system we build is governed by design.',
  },
];

// ── S5: Our Approach ──

export const approachIntro =
  'Our delivery methodology is structured, repeatable, and designed for enterprise environments — not startup sandboxes.';

export const approachSteps: ApproachStep[] = [
  {
    number: '01',
    icon: 'search',
    title: 'Assess',
    description: 'Comprehensive assessment of your current data landscape, AI readiness, and organisational capability. We map what exists, what is missing, and what matters most.',
  },
  {
    number: '02',
    icon: 'layers',
    title: 'Architect',
    description: 'Enterprise-grade architecture design — data models, integration patterns, governance frameworks, and deployment topology. The blueprint before the build.',
  },
  {
    number: '03',
    icon: 'settings',
    title: 'Engineer',
    description: 'Production-grade engineering with security-integrated development, CI/CD pipelines, automated testing, and infrastructure-as-code. Built to enterprise standards.',
  },
  {
    number: '04',
    icon: 'rocket',
    title: 'Deliver',
    description: 'Controlled deployment with stakeholder alignment, knowledge transfer, operational documentation, and post-deployment validation. No handover surprises.',
  },
  {
    number: '05',
    icon: 'chart',
    title: 'Evolve',
    description: 'Continuous improvement through monitoring, performance optimisation, and iterative enhancement. Systems that grow with your organisation, not against it.',
  },
];

export const approachQuote =
  'We do not hand over a system and disappear. We deliver, validate, and ensure operational readiness before any engagement concludes.';

// ── S6: Values ──

export const valuesIntro =
  'These are not aspirational statements. They define how we operate on every engagement.';

export const values: Value[] = [
  {
    icon: 'layers',
    title: 'Architecture First',
    description: 'We design before we build. Every system starts with a clear architectural blueprint that traces from business capability to technical implementation.',
  },
  {
    icon: 'database',
    title: 'Data as Foundation',
    description: 'AI without quality data is guesswork. We ensure data is unified, governed, and AI-ready before any model touches it.',
  },
  {
    icon: 'shield',
    title: 'Governance by Design',
    description: 'Security, compliance, and auditability are not afterthoughts. They are embedded from day one into every platform and product.',
  },
  {
    icon: 'eye',
    title: 'Transparent Delivery',
    description: 'Fixed scopes, clear deliverables, milestone-based progress. No open-ended engagements, no surprise costs.',
  },
  {
    icon: 'chart',
    title: 'Cost Discipline',
    description: 'We architect for cost efficiency. Cloud costs should scale with value — not with complexity or vendor lock-in.',
  },
  {
    icon: 'target',
    title: 'Practical AI',
    description: 'We focus on AI that delivers measurable business outcomes, not proof-of-concepts that never reach production.',
  },
];

export const valuesStatement =
  'Integrity in every architecture. Fairness in every engagement. Value in every delivery.';

// ── S7: Closing CTA ──

export const coreStatement =
  'AI transformation does not start with a model. It starts with a decision to do it properly.';
