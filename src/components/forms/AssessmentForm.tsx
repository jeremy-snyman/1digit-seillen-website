import React, { useState } from 'react';
import { assessmentPillars } from '../../content/data/assessment-questions';
import FormField from './FormField';
import ConsentCheckbox from './ConsentCheckbox';
import ProgressIndicator from './ProgressIndicator';

interface UserData {
  name: string;
  email: string;
  company: string;
  role: string;
  consent: boolean;
}

type UserErrors = Partial<Record<keyof UserData, string>>;

interface AssessmentResult {
  pillarScores: { id: string; name: string; percentage: number }[];
  overallPercentage: number;
  band: string;
  bandDescription: string;
  recommendations: string[];
}

export default function AssessmentForm() {
  const totalSteps = 1 + assessmentPillars.length + 1; // intro + pillars + data capture
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    company: '',
    role: '',
    consent: false,
  });
  const [userErrors, setUserErrors] = useState<UserErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const stepLabels = ['Introduction', ...assessmentPillars.map((p) => p.name), 'Your Details'];

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const canProceedFromPillar = (pillarIndex: number): boolean => {
    const pillar = assessmentPillars[pillarIndex];
    return pillar.questions.every((q) => answers[q.id] !== undefined);
  };

  const validateUserData = (): boolean => {
    const errs: UserErrors = {};
    if (userData.name.length < 2) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) errs.email = 'Valid email is required';
    if (!userData.company) errs.company = 'Company is required';
    if (!userData.role) errs.role = 'Role is required';
    if (!userData.consent) errs.consent = 'Consent is required';
    setUserErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateUserData()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/ai-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const next = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Results view
  if (status === 'success' && result) {
    const bandColors: Record<string, string> = {
      Emerging: '#FF4444',
      Developing: '#FF8844',
      Established: '#FFCC00',
      Advanced: '#5B85B3',
      Leading: '#A8D1FF',
    };
    const color = bandColors[result.band] || '#A8D1FF';

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tint/10 bg-tint/5 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium" style={{ color }}>{result.band}</span>
          </div>
          <div className="text-6xl font-bold font-display mb-2" style={{ color }}>
            {result.overallPercentage}%
          </div>
          <p className="text-content-muted max-w-lg mx-auto">{result.bandDescription}</p>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Pillar Scores</h3>
          <div className="space-y-4">
            {result.pillarScores.map((pillar) => (
              <div key={pillar.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-content-secondary">{pillar.name}</span>
                  <span style={{ color: pillar.percentage >= 75 ? '#A8D1FF' : pillar.percentage >= 50 ? '#FFCC00' : '#FF8844' }}>
                    {pillar.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-tint/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pillar.percentage}%`,
                      backgroundColor: pillar.percentage >= 75 ? '#A8D1FF' : pillar.percentage >= 50 ? '#FFCC00' : '#FF8844',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.recommendations.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-muted text-accent flex items-center justify-center mt-0.5 shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-sm text-content-secondary">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface-elevated text-content border border-surface-border rounded-full font-medium hover:bg-tint/10 transition-colors"
          >
            Book a Call to Discuss Your Results
          </a>
        </div>
      </div>
    );
  }

  // Intro step
  if (currentStep === 0) {
    return (
      <div>
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-semibold font-display mb-4">AI Readiness Assessment</h2>
          <p className="text-content-muted max-w-lg mx-auto mb-2">
            This assessment evaluates your organisation across 5 key pillars of AI readiness. It takes approximately 5–8 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 my-6">
            {assessmentPillars.map((pillar) => (
              <span key={pillar.id} className="px-3 py-1.5 rounded-full bg-tint/5 border border-tint/10 text-sm text-content-dimmed">
                {pillar.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-content-muted mb-6">Your results are calculated instantly and shown on screen.</p>
          <button
            onClick={next}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface-elevated text-content border border-surface-border rounded-full font-medium hover:bg-tint/10 transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // Pillar question steps
  if (currentStep >= 1 && currentStep <= assessmentPillars.length) {
    const pillarIndex = currentStep - 1;
    const pillar = assessmentPillars[pillarIndex];
    const canProceed = canProceedFromPillar(pillarIndex);

    return (
      <div>
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />
        <div className="mb-6">
          <h2 className="text-xl font-semibold font-display mb-1">{pillar.name}</h2>
          <p className="text-content-muted text-sm">{pillar.description}</p>
        </div>
        <div className="space-y-8">
          {pillar.questions.map((question, qi) => (
            <div key={question.id} className="glass-card p-6">
              <p className="font-medium mb-4 text-content">
                <span className="text-accent mr-2">{qi + 1}.</span>
                {question.text}
              </p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      answers[question.id] === option.value
                        ? 'border-accent bg-accent-muted'
                        : 'border-tint/10 bg-tint/[0.03] hover:border-tint/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswer(question.id, option.value)}
                      className="mt-0.5 accent-[#A8D1FF]"
                    />
                    <span className="text-sm text-content-secondary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={prev} className="px-6 py-2.5 border border-tint/10 rounded-xl text-content-dimmed hover:bg-tint/5 transition-colors">
            Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed}
            className="px-6 py-2.5 bg-surface-elevated text-content border border-surface-border rounded-full font-medium hover:bg-tint/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {currentStep === assessmentPillars.length ? 'Continue to Details' : 'Next Pillar'}
          </button>
        </div>
      </div>
    );
  }

  // Data capture step
  return (
    <div>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold font-display mb-2">Your Details</h2>
        <p className="text-content-muted text-sm mb-6">Complete your details to see your AI readiness results.</p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Name" name="name" value={userData.name} onChange={(v) => setUserData({ ...userData, name: v })} error={userErrors.name} required placeholder="Your name" />
            <FormField label="Email" name="email" type="email" value={userData.email} onChange={(v) => setUserData({ ...userData, email: v })} error={userErrors.email} required placeholder="you@company.com" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Company" name="company" value={userData.company} onChange={(v) => setUserData({ ...userData, company: v })} error={userErrors.company} required placeholder="Company name" />
            <FormField label="Role" name="role" value={userData.role} onChange={(v) => setUserData({ ...userData, role: v })} error={userErrors.role} required placeholder="Your role" />
          </div>
          <ConsentCheckbox checked={userData.consent} onChange={(v) => setUserData({ ...userData, consent: v })} error={userErrors.consent} />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={prev} className="px-6 py-2.5 border border-tint/10 rounded-xl text-content-dimmed hover:bg-tint/5 transition-colors">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="px-8 py-3.5 bg-surface-elevated text-content border border-surface-border rounded-full font-medium hover:bg-tint/10 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Calculating...' : 'See My Results'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-4">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
