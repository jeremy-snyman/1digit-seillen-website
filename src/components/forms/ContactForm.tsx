import React, { useState } from 'react';
import FormField from './FormField';
import ConsentCheckbox from './ConsentCheckbox';

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  consent: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.company) newErrors.company = 'Company name is required';
    if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    if (!formData.consent) newErrors.consent = 'You must agree to our privacy policy';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-muted text-accent mx-auto mb-4 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Message Sent</h3>
        <p className="text-content-muted">Thank you for reaching out. We will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Name" name="name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} required placeholder="Your name" />
        <FormField label="Email" name="email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} required placeholder="you@company.com" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Company" name="company" value={formData.company} onChange={(v) => setFormData({ ...formData, company: v })} error={errors.company} required placeholder="Company name" />
        <FormField label="Role" name="role" value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} placeholder="Your role (optional)" />
      </div>
      <FormField label="Message" name="message" type="textarea" value={formData.message} onChange={(v) => setFormData({ ...formData, message: v })} error={errors.message} required placeholder="Tell us about your project or challenge..." />
      <ConsentCheckbox checked={formData.consent} onChange={(v) => setFormData({ ...formData, consent: v })} error={errors.consent} />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-surface-elevated text-content border border-surface-border rounded-full font-medium hover:bg-tint/10 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Sending...
          </>
        ) : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-sm">Something went wrong. Please try again or email us directly.</p>
      )}
    </form>
  );
}
