import { assessmentPillars } from '@content/data/assessment-questions';

export interface PillarScore {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface AssessmentResult {
  pillarScores: PillarScore[];
  overallScore: number;
  overallPercentage: number;
  band: string;
  bandDescription: string;
  recommendations: string[];
}

const bands = [
  { min: 0, max: 25, label: 'Emerging', description: 'Your organisation is at the early stages of AI readiness. Significant foundational work is needed across data, governance, and strategy before AI initiatives can succeed.' },
  { min: 25, max: 50, label: 'Developing', description: 'Some AI foundations are in place but gaps remain. Focused investment in data maturity and governance will accelerate your AI readiness significantly.' },
  { min: 50, max: 75, label: 'Established', description: 'Your organisation has solid foundations for AI. Targeted improvements in specific areas will unlock significant value from AI initiatives.' },
  { min: 75, max: 90, label: 'Advanced', description: 'Strong AI readiness across most dimensions. Fine-tuning governance and operational practices will maximise AI ROI.' },
  { min: 90, max: 100, label: 'Leading', description: 'Your organisation demonstrates exceptional AI readiness. Focus on continuous optimisation and staying ahead of emerging AI capabilities.' },
];

const pillarRecommendations: Record<string, string[]> = {
  leadership: [
    'Establish a formal AI strategy with executive sponsorship',
    'Create a dedicated AI investment portfolio with ROI tracking',
    'Appoint a C-level AI sponsor with board visibility',
  ],
  'data-maturity': [
    'Invest in a unified data platform to break down data silos',
    'Implement automated data quality monitoring with defined SLAs',
    'Build data enrichment pipelines to enhance AI training data',
  ],
  platform: [
    'Migrate to a cloud-native data platform with modern architecture',
    'Implement automated ingestion pipelines for real-time data processing',
    'Build AI-optimised infrastructure with feature stores and model serving',
  ],
  governance: [
    'Develop a comprehensive AI governance framework',
    'Implement structured risk assessment for all AI initiatives',
    'Embed privacy-by-design principles into AI development processes',
  ],
  operations: [
    'Build dedicated AI/ML engineering capability',
    'Implement MLOps practices for model deployment and monitoring',
    'Launch an organisation-wide AI literacy programme',
  ],
};

export function calculateScores(answers: Record<string, number>): AssessmentResult {
  const pillarScores: PillarScore[] = assessmentPillars.map((pillar) => {
    const pillarQuestions = pillar.questions;
    const maxScore = pillarQuestions.length * 4;
    const score = pillarQuestions.reduce((sum, q) => sum + (answers[q.id] || 1), 0);
    const percentage = Math.round((score / maxScore) * 100);

    return {
      id: pillar.id,
      name: pillar.name,
      score,
      maxScore,
      percentage,
    };
  });

  const totalScore = pillarScores.reduce((sum, p) => sum + p.score, 0);
  const totalMaxScore = pillarScores.reduce((sum, p) => sum + p.maxScore, 0);
  const overallPercentage = Math.round((totalScore / totalMaxScore) * 100);

  const band = bands.find((b) => overallPercentage >= b.min && overallPercentage < b.max) || bands[bands.length - 1];

  // Get recommendations from the 3 weakest pillars
  const sortedPillars = [...pillarScores].sort((a, b) => a.percentage - b.percentage);
  const weakestPillars = sortedPillars.slice(0, 3);
  const recommendations = weakestPillars.flatMap((p) => {
    const recs = pillarRecommendations[p.id] || [];
    return recs.slice(0, 2);
  }).slice(0, 5);

  return {
    pillarScores,
    overallScore: totalScore,
    overallPercentage,
    band: band.label,
    bandDescription: band.description,
    recommendations,
  };
}
