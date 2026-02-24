import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-content-muted">
          Step {currentStep + 1} of {totalSteps}
        </span>
        {labels && labels[currentStep] && (
          <span className="text-sm font-medium text-accent">{labels[currentStep]}</span>
        )}
      </div>
      <div className="h-1 bg-tint/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
