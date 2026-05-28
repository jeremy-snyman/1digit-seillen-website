export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  relatedUrl?: string;
  relatedLabel?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'ai-readiness',
    term: 'AI Readiness',
    definition:
      'An organisation\'s measurable capability to adopt and operationalise artificial intelligence across five pillars: leadership and strategy, data quality and governance, platform and infrastructure, compliance and risk management, and people and operations. Low AI readiness is the primary reason enterprise AI pilots never reach production.',
    relatedUrl: '/ai-readiness-assessment',
    relatedLabel: 'Free AI Readiness Assessment',
  },
  {
    slug: 'smart-lakehouse',
    term: 'Smart Lakehouse',
    definition:
      'An enterprise data architecture that combines the flexible, schema-on-read storage of a data lake with the structured, ACID-compliant query performance of a data warehouse. A Smart Lakehouse eliminates the traditional trade-off between flexibility and performance, and supports both analytics and AI model training from a single governed data layer.',
    relatedUrl: '/smart-lakehouse-ionos',
    relatedLabel: 'Smart Lakehouse on IONOS',
  },
  {
    slug: 'tachyon',
    term: 'Tachyon',
    definition:
      '1Digit\'s enterprise data activation platform. Tachyon ingests data from fragmented sources — structured, semi-structured, and unstructured — detects sensitivity, enforces schema, scores quality, and produces governed, AI-ready datasets in Parquet, Delta, or Iceberg format. It handles both streaming and batch ingestion at high throughput.',
    relatedUrl: '/tachyon',
    relatedLabel: 'Tachyon Platform',
  },
  {
    slug: 'togaf-for-ai',
    term: 'TOGAF for AI',
    definition:
      'The application of TOGAF (The Open Group Architecture Framework) principles to AI system design. Rather than treating AI as a standalone product, TOGAF-aligned AI architecture maps capability to business value streams, structures data and application layers for governance, and ensures AI initiatives integrate with the existing enterprise architecture rather than existing as isolated point solutions.',
    relatedUrl: '/architecture',
    relatedLabel: 'AI Architecture Framework',
  },
  {
    slug: 'sovereign-cloud',
    term: 'Sovereign Cloud',
    definition:
      'Cloud infrastructure where data residency, processing, and control are contractually and technically constrained to a defined jurisdiction — typically within the European Union. Sovereign cloud is required by an increasing number of EU regulations including GDPR, DORA, and CADA, and is distinct from standard cloud regions that may route or replicate data across borders.',
    relatedUrl: '/smart-lakehouse-ionos',
    relatedLabel: 'Smart Lakehouse on IONOS',
  },
  {
    slug: 'gpai',
    term: 'GPAI (General Purpose AI)',
    definition:
      'A category of AI model defined in the EU AI Act: a model trained on broad data at scale that can be adapted to a wide range of downstream tasks. Under the EU AI Act, GPAI models — including large language models — are subject to transparency obligations enforced from August 2026. Models deemed to pose systemic risk face additional requirements including adversarial testing and incident reporting.',
    relatedUrl: '/insights/cada-eu-ai-act-summer-2026-deadlines',
    relatedLabel: 'EU AI Act Summer 2026 Deadlines',
  },
  {
    slug: 'agentic-ai',
    term: 'Agentic AI',
    definition:
      'AI systems that autonomously plan and execute multi-step tasks by chaining model calls, tool use, and external API interactions — rather than responding to a single prompt. Agentic architectures introduce governance challenges that static model deployments do not: access scope, action reversibility, audit trails, and the risk of autonomous actions that bypass human approval.',
    relatedUrl: '/insights/shadow-agents-are-an-architecture-problem',
    relatedLabel: 'Shadow Agents Are an Architecture Problem',
  },
  {
    slug: 'ai-architecture',
    term: 'AI Architecture',
    definition:
      'The structured design of the systems, data flows, infrastructure, and governance controls that enable an enterprise to build and operate AI at scale. AI architecture covers five layers: business capability, data foundation, platform and orchestration, AI services and agents, and governance and control. Architecture that is not designed upfront must be retrofitted — at significantly higher cost.',
    relatedUrl: '/architecture',
    relatedLabel: 'AI Architecture Framework',
  },
  {
    slug: 'evaluation-harness',
    term: 'Evaluation Harness',
    definition:
      'A repeatable testing framework that measures the quality, accuracy, safety, and business alignment of an AI model or agent in a given deployment context. An evaluation harness runs before every model update or prompt change to catch regressions. Without one, AI system quality can silently degrade as models are updated by their providers.',
  },
  {
    slug: 'guardrails',
    term: 'Guardrails',
    definition:
      'Programmatic constraints applied to AI model inputs and outputs to prevent harmful, non-compliant, or off-brand responses. Guardrails operate at multiple layers: prompt-level filtering, output classifiers, tool-call restrictions for agents, and rate-limiting and circuit-breaker patterns. They are a governance mechanism, not just a moderation feature.',
    relatedUrl: '/trust-security',
    relatedLabel: 'Trust & Security',
  },
  {
    slug: 'data-fragmentation',
    term: 'Data Fragmentation',
    definition:
      'The state in which enterprise data is scattered across incompatible systems — CRMs, ERPs, spreadsheets, legacy databases, third-party APIs — with no unified schema, lineage, or quality baseline. Data fragmentation is the most common root cause of AI project failure: models trained or prompted on fragmented data produce unreliable results regardless of their capability.',
    relatedUrl: '/insights/data-fragmentation-ai-barrier',
    relatedLabel: 'Why Data Fragmentation Is the Real Barrier to AI',
  },
  {
    slug: 'medallion-architecture',
    term: 'Medallion Architecture',
    definition:
      'A layered data organisation pattern used in lakehouses where data passes through three quality zones: Bronze (raw, as-ingested), Silver (cleaned, validated, joined), and Gold (business-level, aggregated, ready for analytics and AI). Each layer has defined quality contracts, and data can only advance when it meets them. This pattern is the standard foundation for AI-ready data platforms.',
    relatedUrl: '/data-platforms',
    relatedLabel: 'Data & Platform Foundations',
  },
  {
    slug: 'cada',
    term: 'CADA (Cloud and Data Act)',
    definition:
      'The EU\'s Cloud and Data Act — scheduled for enforcement from July 2026 — which mandates that cloud service providers operating in the EU must be able to switch customers to competing providers within 30 days, prohibits restrictive data egress charges, and requires interoperability between cloud platforms. CADA effectively writes data portability and sovereign cloud preference into hard law for EU-operating businesses.',
    relatedUrl: '/insights/cada-eu-ai-act-summer-2026-deadlines',
    relatedLabel: 'CADA and EU AI Act: Summer 2026 Deadlines',
  },
  {
    slug: 'ai-ops',
    term: 'AI Ops (AI Operations)',
    definition:
      'The operational discipline covering the monitoring, maintenance, and governance of AI models and pipelines in production. AI Ops extends traditional DevOps and MLOps with AI-specific concerns: model drift detection, prompt regression testing, cost attribution by model and team, incident response for model-caused failures, and compliance audit trails for regulated industries.',
    relatedUrl: '/trust-security',
    relatedLabel: 'Trust & Security',
  },
  {
    slug: 'rag',
    term: 'RAG (Retrieval-Augmented Generation)',
    definition:
      'An architecture pattern that grounds a language model\'s responses in documents retrieved from an external knowledge base at inference time. Rather than relying solely on knowledge encoded during training, a RAG system fetches relevant chunks from a vector store or search index and injects them into the prompt. RAG is widely used to reduce hallucination in enterprise AI applications where accuracy and traceability are required.',
  },
];
