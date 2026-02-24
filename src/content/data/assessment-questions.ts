export interface AssessmentOption {
  label: string;
  value: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: AssessmentOption[];
}

export interface AssessmentPillar {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: AssessmentQuestion[];
}

export const assessmentPillars: AssessmentPillar[] = [
  {
    id: 'leadership',
    name: 'Leadership & Strategy',
    description: 'How aligned is your leadership on AI adoption?',
    icon: 'target',
    questions: [
      {
        id: 'l1',
        text: 'How would you describe your organisation\'s AI strategy?',
        options: [
          { label: 'No formal AI strategy exists', value: 1 },
          { label: 'Early discussions are happening but no formal plan', value: 2 },
          { label: 'A documented AI strategy exists with some executive sponsorship', value: 3 },
          { label: 'AI strategy is embedded in business strategy with full executive alignment', value: 4 },
        ],
      },
      {
        id: 'l2',
        text: 'How is AI investment currently prioritised?',
        options: [
          { label: 'No dedicated AI budget', value: 1 },
          { label: 'Ad-hoc spending on individual projects', value: 2 },
          { label: 'Ring-fenced AI budget with some governance', value: 3 },
          { label: 'Strategic AI investment portfolio with clear ROI tracking', value: 4 },
        ],
      },
      {
        id: 'l3',
        text: 'Who owns AI initiatives in your organisation?',
        options: [
          { label: 'No clear ownership', value: 1 },
          { label: 'IT department drives AI initiatives', value: 2 },
          { label: 'Dedicated AI lead or team with cross-functional support', value: 3 },
          { label: 'C-level AI sponsor with dedicated team and board visibility', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'data-maturity',
    name: 'Data Maturity',
    description: 'How ready is your data for AI workloads?',
    icon: 'database',
    questions: [
      {
        id: 'd1',
        text: 'How would you describe your current data landscape?',
        options: [
          { label: 'Data is siloed across many systems with no central view', value: 1 },
          { label: 'Some data consolidation efforts but significant gaps remain', value: 2 },
          { label: 'Centralised data platform with good coverage of key domains', value: 3 },
          { label: 'Unified, governed data estate with real-time capabilities', value: 4 },
        ],
      },
      {
        id: 'd2',
        text: 'How do you manage data quality?',
        options: [
          { label: 'No formal data quality processes', value: 1 },
          { label: 'Manual quality checks on an ad-hoc basis', value: 2 },
          { label: 'Automated quality monitoring with defined SLAs', value: 3 },
          { label: 'Comprehensive data observability with lineage and anomaly detection', value: 4 },
        ],
      },
      {
        id: 'd3',
        text: 'How accessible is your data for analytics and AI?',
        options: [
          { label: 'Data access requires significant manual effort', value: 1 },
          { label: 'Some self-service access but limited to specific teams', value: 2 },
          { label: 'Broad self-service access with governed data catalogues', value: 3 },
          { label: 'Feature stores and ML-ready datasets available on demand', value: 4 },
        ],
      },
      {
        id: 'd4',
        text: 'Do you have data enrichment or augmentation capabilities?',
        options: [
          { label: 'No external data enrichment', value: 1 },
          { label: 'Some manual data enrichment processes', value: 2 },
          { label: 'Automated enrichment pipelines for key datasets', value: 3 },
          { label: 'Comprehensive enrichment including external sources and real-time feeds', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'platform',
    name: 'Platform Architecture',
    description: 'How mature is your technical infrastructure for AI?',
    icon: 'layers',
    questions: [
      {
        id: 'p1',
        text: 'What best describes your current data platform?',
        options: [
          { label: 'Legacy on-premise systems with limited scalability', value: 1 },
          { label: 'Cloud migration in progress but architecture is evolving', value: 2 },
          { label: 'Cloud-native platform with modern data stack', value: 3 },
          { label: 'AI-optimised platform with feature stores, model serving, and MLOps', value: 4 },
        ],
      },
      {
        id: 'p2',
        text: 'How do you handle data ingestion?',
        options: [
          { label: 'Manual file transfers and batch imports', value: 1 },
          { label: 'Scheduled batch ETL with some automation', value: 2 },
          { label: 'Automated batch and streaming ingestion pipelines', value: 3 },
          { label: 'Real-time event-driven architecture with intelligent routing', value: 4 },
        ],
      },
      {
        id: 'p3',
        text: 'How scalable is your current infrastructure?',
        options: [
          { label: 'Fixed capacity that requires manual scaling', value: 1 },
          { label: 'Some auto-scaling but with cost concerns', value: 2 },
          { label: 'Cloud-native auto-scaling with cost monitoring', value: 3 },
          { label: 'Elastic, cost-optimised infrastructure with predictive scaling', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'governance',
    name: 'Governance & Risk',
    description: 'How robust are your AI governance frameworks?',
    icon: 'shield',
    questions: [
      {
        id: 'g1',
        text: 'What AI governance frameworks do you have in place?',
        options: [
          { label: 'No formal AI governance', value: 1 },
          { label: 'Basic policies exist but are not consistently applied', value: 2 },
          { label: 'Documented governance framework with regular reviews', value: 3 },
          { label: 'Comprehensive governance with automated compliance and audit trails', value: 4 },
        ],
      },
      {
        id: 'g2',
        text: 'How do you manage AI-related risks?',
        options: [
          { label: 'AI risks are not formally assessed', value: 1 },
          { label: 'Ad-hoc risk assessment for individual projects', value: 2 },
          { label: 'Structured risk framework covering bias, security, and compliance', value: 3 },
          { label: 'Continuous risk monitoring with automated alerting and mitigation', value: 4 },
        ],
      },
      {
        id: 'g3',
        text: 'How do you handle data privacy in AI systems?',
        options: [
          { label: 'No specific AI data privacy measures', value: 1 },
          { label: 'Basic GDPR compliance but no AI-specific controls', value: 2 },
          { label: 'Privacy-by-design principles applied to AI development', value: 3 },
          { label: 'Comprehensive privacy framework with PIA, consent management, and audit', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operational Readiness',
    description: 'How prepared is your organisation to operationalise AI?',
    icon: 'zap',
    questions: [
      {
        id: 'o1',
        text: 'What AI/ML skills exist in your organisation?',
        options: [
          { label: 'No dedicated AI/ML skills', value: 1 },
          { label: 'A few individuals with ML experience', value: 2 },
          { label: 'Dedicated data science team with some MLOps capability', value: 3 },
          { label: 'Cross-functional AI team with full MLOps and AI engineering capability', value: 4 },
        ],
      },
      {
        id: 'o2',
        text: 'How do you deploy and monitor AI models?',
        options: [
          { label: 'No models in production', value: 1 },
          { label: 'Manual deployment with limited monitoring', value: 2 },
          { label: 'CI/CD for models with performance monitoring', value: 3 },
          { label: 'Full MLOps with automated retraining, A/B testing, and drift detection', value: 4 },
        ],
      },
      {
        id: 'o3',
        text: 'How does your organisation handle AI change management?',
        options: [
          { label: 'No change management for AI initiatives', value: 1 },
          { label: 'Basic training provided on a project basis', value: 2 },
          { label: 'Structured AI literacy programme with role-based training', value: 3 },
          { label: 'Organisation-wide AI culture with continuous learning and innovation programmes', value: 4 },
        ],
      },
    ],
  },
];
