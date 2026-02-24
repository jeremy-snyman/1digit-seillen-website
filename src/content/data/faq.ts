export interface FAQItem {
  question: string;
  answer: string;
}

export const pricingFAQ: FAQItem[] = [
  {
    question: 'Do you offer fixed-price engagements?',
    answer: 'Yes. Our diagnostic and strategy phases are fixed-price with clear deliverables. Implementation phases are milestone-based with defined scope boundaries. We do not do open-ended time-and-materials consulting.',
  },
  {
    question: 'What happens if scope changes during the engagement?',
    answer: 'We define scope boundaries clearly upfront. If requirements change, we assess the impact, provide a revised scope and cost, and get sign-off before proceeding. No surprise invoices.',
  },
  {
    question: 'Can we start with a small engagement to test the relationship?',
    answer: 'Absolutely. The AI Maturity Scan is designed for exactly this — a lightweight, fixed-price engagement that delivers real value while establishing working trust. Most enterprise relationships start here.',
  },
  {
    question: 'Do you provide ongoing support after delivery?',
    answer: 'Yes. Our AI Ops / SecOps Retainer provides monthly advisory, monitoring, and governance support. We also offer transition support at the end of implementation phases to ensure your team is fully equipped.',
  },
  {
    question: 'How do you handle procurement and contracts?',
    answer: 'We work with standard MSA/SOW structures that most enterprise procurement teams expect. We are flexible on payment terms and can accommodate purchase order processes. We aim to make procurement frictionless.',
  },
  {
    question: 'What is the typical time to value?',
    answer: 'A diagnostic engagement delivers actionable insights within 2-5 weeks. Strategy phases run 4-8 weeks. First implementation milestones are typically visible within 4-6 weeks of build commencement.',
  },
];
