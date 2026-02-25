// ── Trust & Security Page — Data ──

export interface PhilosophyPillar {
  icon: string;
  label: string;
}

export interface SDLCCard {
  icon: string;
  title: string;
  description: string;
}

export interface GovernancePrinciple {
  icon: string;
  title: string;
  description: string;
}

export interface AuditCapability {
  icon: string;
  title: string;
  description: string;
}

export interface ComplianceStandard {
  title: string;
  description: string;
}

export interface RiskCard {
  icon: string;
  title: string;
  description: string;
}

export interface ControlItem {
  text: string;
}

export interface DeliveryStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}

// ── S1: Hero ──

export const heroDescription =
  'Security, governance, and compliance are not afterthoughts — they are embedded into everything we build. Here is how we earn enterprise trust.';

// ── S2: Philosophy ──

export const philosophyIntro =
  'Security is not a feature we add at the end. It is a design constraint we apply from the beginning. Every architecture decision, every data flow, every deployment model is evaluated through a security lens before a single line of code is written.';

export const philosophyPillars: PhilosophyPillar[] = [
  { icon: 'layers', label: 'Architecture-First Security' },
  { icon: 'database', label: 'Data Privacy by Default' },
  { icon: 'settings', label: 'Governance by Design' },
  { icon: 'rocket', label: 'Secure Delivery' },
  { icon: 'target', label: 'Continuous Risk Management' },
];

// ── S3: Secure SDLC ──

export const sdlcIntro =
  'Every system we deliver passes through a security-integrated development lifecycle. These are not optional add-ons — they are mandatory checkpoints.';

export const sdlcCards: SDLCCard[] = [
  {
    icon: 'shield',
    title: 'Architecture Review Checkpoints',
    description: 'Security review gates at every architecture decision point — before implementation begins.',
  },
  {
    icon: 'target',
    title: 'Threat Modelling',
    description: 'Structured threat modelling exercises before implementation, identifying attack surfaces and mitigation strategies.',
  },
  {
    icon: 'database',
    title: 'Data Classification',
    description: 'Sensitivity mapping and data classification integrated into the design phase — not retrofitted after deployment.',
  },
  {
    icon: 'lock',
    title: 'Role-Based Access Design',
    description: 'RBAC designed from day one. Access patterns are architectural decisions, not afterthought configurations.',
  },
  {
    icon: 'settings',
    title: 'CI/CD Security Guardrails',
    description: 'Automated security scanning, dependency auditing, and policy enforcement embedded in every pipeline.',
  },
  {
    icon: 'cpu',
    title: 'AI Validation Frameworks',
    description: 'Purpose-built evaluation and validation frameworks for AI components — prompt security, output guardrails, model governance.',
  },
  {
    icon: 'eye',
    title: 'Observability by Design',
    description: 'Logging, monitoring, and alerting built into the architecture — not bolted on after the first incident.',
  },
];

// ── S4: Governance ──

export const governanceIntro =
  'We do not bolt governance onto finished systems. We design it into the architecture from the start, using proven enterprise frameworks.';

export const governancePrinciples: GovernancePrinciple[] = [
  {
    icon: 'layers',
    title: 'Layered Accountability',
    description: 'Clear ownership at every layer — data, application, infrastructure, and business logic.',
  },
  {
    icon: 'shield',
    title: 'Policy-as-Code',
    description: 'Governance policies codified and enforced automatically — not documented in PDFs that nobody reads.',
  },
  {
    icon: 'users',
    title: 'Stakeholder Transparency',
    description: 'Decision trails visible to every stakeholder, from engineering to the board.',
  },
  {
    icon: 'settings',
    title: 'Framework Alignment',
    description: 'Architecture aligned with TOGAF, COBIT, and enterprise governance standards.',
  },
  {
    icon: 'chart',
    title: 'Measurable Controls',
    description: 'Every control has a metric. Every metric has a threshold. Every threshold has an action.',
  },
];

export const togafQuote =
  'Our architecture governance follows TOGAF principles — not as a certification checkbox, but as a practical framework for maintaining architectural integrity across complex enterprise systems.';

export const auditIntro =
  'Every decision, every data transformation, every access event — traceable, versioned, and auditable.';

export const auditCapabilities: AuditCapability[] = [
  {
    icon: 'fingerprint',
    title: 'Immutable Audit Trails',
    description: 'Every system action logged with tamper-evident records.',
  },
  {
    icon: 'database',
    title: 'Data Lineage Tracking',
    description: 'Full traceability from source to consumption across every transformation.',
  },
  {
    icon: 'eye',
    title: 'Version-Controlled Decisions',
    description: 'Architecture and governance decisions tracked with full revision history.',
  },
  {
    icon: 'clipboard',
    title: 'Compliance Reporting',
    description: 'Automated reporting aligned to regulatory and internal audit requirements.',
  },
  {
    icon: 'chart',
    title: 'Real-Time Monitoring',
    description: 'Continuous monitoring dashboards with anomaly detection and alerting.',
  },
];

// ── S5: Compliance ──

export const complianceIntro =
  'We design with compliance awareness from the start. Where we claim familiarity — not certification — we are transparent about it.';

export const complianceStandards: ComplianceStandard[] = [
  {
    title: 'ISO 27001',
    description: 'Information security management awareness and alignment. Our engineering practices follow ISO 27001 control objectives for access management, cryptography, and operational security.',
  },
  {
    title: 'SOC 2',
    description: 'Security, availability, and confidentiality awareness. We design systems that support SOC 2 audit readiness for enterprise clients who require third-party assurance.',
  },
  {
    title: 'GDPR',
    description: 'European data protection regulation compliance. Data minimisation, consent management, right to erasure, and cross-border transfer awareness built into data architecture.',
  },
  {
    title: 'POPIA',
    description: 'South African data protection alignment. Processing limitation, purpose specification, and information officer support designed into every system handling personal information.',
  },
];

export const compliancePrinciples: string[] = [
  'Privacy by design — not privacy by retrofit',
  'Data minimisation as an architectural constraint',
  'Consent management integrated at the data layer',
  'Right to erasure built into data lifecycle management',
  'Cross-border data transfer awareness in deployment architecture',
];

// ── S6: AI Risk ──

export const aiRiskIntro =
  'AI introduces risks that traditional security frameworks were never designed to address. We build controls specifically for these emerging threat vectors.';

export const unsettlingReality =
  'Most enterprise AI deployments have no formal security controls. No prompt injection prevention. No output validation. No model governance. The attack surface is expanding faster than most organisations can comprehend.';

export const riskCards: RiskCard[] = [
  {
    icon: 'shield',
    title: 'Prompt Injection Prevention',
    description: 'Input sanitisation, context boundaries, and injection detection layers for every LLM integration.',
  },
  {
    icon: 'lock',
    title: 'Data Leakage Prevention',
    description: 'Classification-aware guardrails preventing sensitive data from entering or exiting AI systems without authorisation.',
  },
  {
    icon: 'eye',
    title: 'Hallucination Monitoring',
    description: 'Output validation frameworks that detect, flag, and contain model hallucinations before they reach downstream systems.',
  },
  {
    icon: 'users',
    title: 'RBAC for AI Systems',
    description: 'Granular access control for model endpoints, training data, and inference results — not one API key for everything.',
  },
  {
    icon: 'alert-triangle',
    title: 'Output Guardrails',
    description: 'Structured validation and content filtering on every AI output before it reaches users or downstream systems.',
  },
  {
    icon: 'brain',
    title: 'Model Governance',
    description: 'Version control, performance monitoring, drift detection, and lifecycle management for every deployed model.',
  },
];

export const controlItems: ControlItem[] = [
  { text: 'Input validation and sanitisation at every AI boundary' },
  { text: 'Output classification and filtering before distribution' },
  { text: 'Model access controls with principle of least privilege' },
  { text: 'Automated drift detection and performance monitoring' },
  { text: 'Incident response playbooks specific to AI failure modes' },
  { text: 'Regular adversarial testing and red-team exercises' },
];

// ── S7: Enterprise Delivery ──

export const deliveryIntro =
  'We deliver into enterprise environments — not startup sandboxes. Our delivery process reflects the governance, security, and stakeholder management that enterprise clients require.';

export const deliverySteps: DeliveryStep[] = [
  {
    number: '01',
    icon: 'shield',
    title: 'Security Architecture Review',
    description: 'Every engagement begins with a formal security architecture review — threat modelling, data classification, and compliance mapping before a single line of code.',
  },
  {
    number: '02',
    icon: 'users',
    title: 'Stakeholder Governance Alignment',
    description: 'We align with your existing governance structures — architecture review boards, change advisory boards, and security committees.',
  },
  {
    number: '03',
    icon: 'settings',
    title: 'Controlled Deployment Pipelines',
    description: 'CI/CD pipelines with security gates, automated testing, and staged rollouts. No cowboy deployments.',
  },
  {
    number: '04',
    icon: 'clipboard',
    title: 'Documentation and Knowledge Transfer',
    description: 'Comprehensive runbooks, architecture decision records, and operational documentation — not a GitHub README.',
  },
  {
    number: '05',
    icon: 'chart',
    title: 'Ongoing Monitoring and Support',
    description: 'Post-deployment monitoring, incident response integration, and continuous security assessment as part of every engagement.',
  },
];

// ── S8: Closing CTA ──

export const coreStatement =
  'Security does not slow innovation. Poor architecture does.';
