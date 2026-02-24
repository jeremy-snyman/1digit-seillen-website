import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea' | 'select' | 'radio';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options = [],
  rows = 4,
}: FormFieldProps) {
  const baseInputClasses =
    'w-full bg-tint/5 border border-tint/10 rounded-xl px-4 py-3 text-content placeholder:text-content-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent-muted transition-colors';

  if (type === 'radio' && options.length > 0) {
    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-content mb-2">
          {label} {required && <span className="text-accent">*</span>}
        </legend>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              value === option.value
                ? 'border-accent bg-accent-muted'
                : 'border-tint/10 bg-tint/5 hover:border-tint/20'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-0.5 accent-[#A8D1FF]"
            />
            <span className="text-sm text-content-secondary">{option.label}</span>
          </label>
        ))}
        {error && <p id={`${name}-error`} className="text-sm text-red-400 mt-1">{error}</p>}
      </fieldset>
    );
  }

  if (type === 'select' && options.length > 0) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-content mb-2">
          {label} {required && <span className="text-accent">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p id={`${name}-error`} className="text-sm text-red-400 mt-1">{error}</p>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-content mb-2">
          {label} {required && <span className="text-accent">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={baseInputClasses + ' resize-none'}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && <p id={`${name}-error`} className="text-sm text-red-400 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-content mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={baseInputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <p id={`${name}-error`} className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
}
