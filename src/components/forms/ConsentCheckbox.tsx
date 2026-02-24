import React from 'react';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function ConsentCheckbox({ checked, onChange, error }: ConsentCheckboxProps) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 accent-[#A8D1FF] w-4 h-4"
        />
        <span className="text-sm text-content-muted">
          I agree to 1Digit's{' '}
          <a href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </a>{' '}
          and consent to being contacted about my enquiry.
        </span>
      </label>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
}
