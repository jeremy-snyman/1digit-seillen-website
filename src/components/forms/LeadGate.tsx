import React, { useEffect, useRef, useState } from 'react';

const INSIGHTS_URL = '/insights';

interface Props {
  slug: string;
  title: string;
  category?: string;
  readTimeMinutes?: number;
}

// Memory is keyed by BOTH person and article:
// - PROFILE_KEY remembers WHO this visitor is (used to pre-fill the form).
// - ARTICLES_KEY is the set of slugs this visitor has already submitted for —
//   the gate is only skipped for an article they've already completed. Any other
//   gated article still asks (with the form pre-filled from the profile).
const PROFILE_KEY = '1d_lead_profile';
const ARTICLES_KEY = '1d_lead_articles';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface LeadProfile {
  firstName: string;
  lastName: string;
  email: string;
  marketingOptIn: boolean;
  contactOptIn: boolean;
  updatedAt: number;
}

declare global {
  interface Window {
    Tachyon?: { emit: (eventName: string, extraPayload?: Record<string, unknown>) => void };
  }
}

function readProfile(): LeadProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as LeadProfile) : null;
  } catch {
    return null;
  }
}

function readSubmittedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function alreadyLeadFor(slug: string): boolean {
  return readSubmittedSlugs().indexOf(slug) !== -1;
}

// ── Underline editorial field ──────────────────────────────────────────────
function Field({
  id,
  label,
  type = 'text',
  value,
  valid,
  error,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  valid: boolean;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-label-sm uppercase tracking-[0.08em] text-content-muted mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full bg-transparent rounded-none border-0 border-b px-0 py-2 pr-6 text-content placeholder:text-content-muted/60 focus:outline-none transition-colors ${
            error
              ? 'border-danger'
              : valid
                ? 'border-accent'
                : 'border-surface-border focus:border-accent'
          }`}
        />
        {valid && !error && (
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-[lg-backdrop-in_200ms_ease-out]"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
          </svg>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Minimal square checkbox ────────────────────────────────────────────────
function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-muted ${
          checked ? 'bg-accent border-accent' : 'bg-transparent border-surface-border hover:border-content/30'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
          </svg>
        )}
      </button>
      <span className="text-body-sm text-content-secondary">{label}</span>
    </label>
  );
}

export default function LeadGate({ slug, category, readTimeMinutes }: Props) {
  const kicker =
    category && readTimeMinutes
      ? `${category} · ${readTimeMinutes} min read`
      : category || 'Further reading';
  const [mounted, setMounted] = useState(false);
  const [gating, setGating] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [contactOptIn, setContactOptIn] = useState(false);

  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submitError, setSubmitError] = useState('');

  // Track status for the (stable) Escape handler without re-binding the listener.
  const statusRef = useRef<Status>(status);
  statusRef.current = status;

  // Exit the gate without submitting — the visitor was trying to reach an
  // insight, so send them to the insights list rather than revealing this one.
  function exitToInsights() {
    try {
      document.body.style.overflow = '';
    } catch {
      /* noop */
    }
    window.location.href = INSIGHTS_URL;
  }

  // Decide whether to gate after hydration (avoids SSR/localStorage mismatch).
  // Gate only when this visitor hasn't already submitted for THIS article.
  useEffect(() => {
    setMounted(true);
    if (!alreadyLeadFor(slug)) {
      setGating(true);

      // Recognise a returning person — pre-fill name/email so they only confirm
      // rather than retype. Consent opt-ins are deliberately NOT restored: they
      // always start unticked so every submission is a fresh affirmative choice.
      const profile = readProfile();
      if (profile) {
        setFirstName(profile.firstName || '');
        setLastName(profile.lastName || '');
        setEmail(profile.email || '');
      }

      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && statusRef.current !== 'success') exitToInsights();
      };
      document.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [slug]);

  const firstValid = firstName.trim().length > 0;
  const lastValid = lastName.trim().length > 0;
  const emailValid = EMAIL_RE.test(email.trim());
  const formValid = firstValid && lastValid && emailValid;

  function unlock() {
    setUnlocking(true);
    window.setTimeout(() => {
      setGating(false);
      try {
        document.body.style.overflow = '';
      } catch {
        /* noop */
      }
    }, 500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true });
    if (!formValid || status === 'submitting') return;

    setStatus('submitting');
    setSubmitError('');

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      marketingOptIn,
      contactOptIn,
      articleSlug: slug,
    };

    try {
      const res = await fetch('/api/insight-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');

      // Persist per person + per article: remember WHO they are (profile, for
      // pre-fill) and mark THIS article done so it isn't gated again. Other gated
      // articles will still ask.
      try {
        const profile: LeadProfile = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          marketingOptIn,
          contactOptIn,
          updatedAt: Date.now(),
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

        const slugs = readSubmittedSlugs();
        if (slugs.indexOf(slug) === -1) slugs.push(slug);
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(slugs));
      } catch {
        /* noop */
      }

      // Fire-and-forget analytics — never blocks the unlock.
      try {
        window.Tachyon?.emit('LeadCaptured', { formType: 'insight-lead-gate', ...payload });
      } catch {
        /* noop */
      }

      setStatus('success');
      window.setTimeout(unlock, 900);
    } catch {
      setStatus('error');
      setSubmitError('Something went wrong. Please try again.');
    }
  }

  if (!mounted || !gating) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 ${
        unlocking ? 'lg-overlay-out' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lg-heading"
    >
      {/* Backdrop — blurs the locked article behind */}
      <div className="lg-backdrop absolute inset-0 backdrop-blur-xl bg-surface/75" aria-hidden="true" />

      {/* Editorial column */}
      <div className="lg-card relative w-full sm:max-w-[520px] bg-surface-elevated border border-surface-border shadow-card rounded-t-2xl sm:rounded-[6px] px-7 py-9 sm:px-10 sm:py-11">
        {/* Mobile grab handle */}
        <div className="sm:hidden mx-auto -mt-3 mb-6 h-1 w-10 rounded-full bg-tint/20" aria-hidden="true" />

        {/* Close — returns to the insights list (visitor was after an article) */}
        {status !== 'success' && (
          <button
            type="button"
            onClick={exitToInsights}
            aria-label="Close and return to insights"
            className="absolute top-5 right-6 sm:top-6 z-10 text-content-muted hover:text-content transition-colors focus:outline-none"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}

        {status === 'success' ? (
          <div className="relative">
            <p className="text-label-md uppercase text-content-meta mb-4">Thank you</p>
            <h2 className="text-heading-xl leading-[1.1] text-content">
              You're <em className="font-serif italic font-normal">in</em>.
            </h2>
            <div className="mt-5 pt-5 border-t border-surface-border">
              <p className="text-body-md text-content-secondary">Enjoy the read.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative" noValidate>
            <p className="text-label-md uppercase text-content-meta mb-4 pr-8">{kicker}</p>
            <h2 id="lg-heading" className="text-heading-xl leading-[1.1] text-content">
              Read the full{' '}
              <em className="font-serif italic font-normal text-content">briefing</em>
            </h2>
            <p className="text-body-md text-content-secondary mt-3 mb-8">
              A few details and the full piece is yours.
            </p>

            <div className="space-y-5">
              <Field
                id="firstName"
                label="First name"
                value={firstName}
                valid={firstValid}
                error={touched.firstName && !firstValid ? 'Required' : undefined}
                onChange={setFirstName}
                onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
              />
              <Field
                id="lastName"
                label="Last name"
                value={lastName}
                valid={lastValid}
                error={touched.lastName && !lastValid ? 'Required' : undefined}
                onChange={setLastName}
                onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
              />
              <Field
                id="email"
                label="Work email"
                type="email"
                value={email}
                valid={emailValid}
                error={touched.email && !emailValid ? 'Enter a valid email' : undefined}
                onChange={setEmail}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
            </div>

            <div className="mt-7 pt-6 border-t border-surface-border space-y-1">
              <Check
                checked={marketingOptIn}
                onChange={setMarketingOptIn}
                label="Keep me updated with 1Digit insights."
              />
              <Check
                checked={contactOptIn}
                onChange={setContactOptIn}
                label="I'd like 1Digit to contact me."
              />
            </div>

            {submitError && <p className="text-sm text-danger mt-4">{submitError}</p>}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={!formValid || status === 'submitting'}
                className={`inline-flex items-center justify-center gap-2 px-7 py-3 rounded-[3px] font-medium bg-[rgb(var(--color-btn-primary-bg))] text-[rgb(var(--color-btn-primary-text))] border border-surface-border transition-all duration-200 ${
                  formValid && status !== 'submitting'
                    ? 'hover:border-content/30 active:scale-[0.99] opacity-100'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Read the article <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <a href="/privacy" className="text-xs text-content-muted hover:text-content transition-colors shrink-0">
                Privacy
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
