import React, { useEffect, useRef, useState } from 'react';

const INSIGHTS_URL = '/insights';

interface Props {
  slug: string;
  title: string;
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

// ── Floating-label text field ──────────────────────────────────────────────
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
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer w-full bg-tint/5 border border-tint/10 rounded-xl px-4 pt-6 pb-2 text-content placeholder-transparent focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent-muted transition-colors"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-2 text-xs text-accent transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-content-muted peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent"
        >
          {label}
        </label>
        {valid && (
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-[lg-backdrop-in_200ms_ease-out]"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
          </svg>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-400 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Pill toggle switch ─────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer min-h-[44px]">
      <span className="text-sm text-content-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-muted ${
          checked ? 'bg-accent' : 'bg-tint/15'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5 scale-100' : 'scale-95'
          }`}
        />
      </button>
    </label>
  );
}

export default function LeadGate({ slug, title }: Props) {
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

      // Recognise a returning person — pre-fill from their saved profile so they
      // only confirm rather than retype. They still submit to unlock this article.
      const profile = readProfile();
      if (profile) {
        setFirstName(profile.firstName || '');
        setLastName(profile.lastName || '');
        setEmail(profile.email || '');
        setMarketingOptIn(!!profile.marketingOptIn);
        setContactOptIn(!!profile.contactOptIn);
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

  const completed = [firstValid, lastValid, emailValid].filter(Boolean).length;
  const progress = Math.round((completed / 3) * 100);

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

      {/* Card */}
      <div className="lg-card relative w-full sm:max-w-md glass-card rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-accent/10 px-6 pt-8 pb-7 sm:px-8">
        {/* Top progress rail */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-tint/10" aria-hidden="true">
          <div className="lg-rail" style={{ width: `${progress}%` }} />
        </div>

        {/* Ambient orb */}
        <div
          className="ambient-glow -top-16 -right-16 w-[220px] h-[220px] bg-accent/20"
          style={{ position: 'absolute' }}
          aria-hidden="true"
        />

        {/* Mobile grab handle */}
        <div className="sm:hidden mx-auto mb-5 h-1 w-10 rounded-full bg-tint/20" aria-hidden="true" />

        {/* Close — returns to the insights list (visitor was after an article) */}
        {status !== 'success' && (
          <button
            type="button"
            onClick={exitToInsights}
            aria-label="Close and return to insights"
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-content-muted hover:text-content hover:bg-tint/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}

        {status === 'success' ? (
          <div className="relative text-center py-6">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path className="lg-check-path" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-heading-md font-display font-medium text-content">You're in</h2>
            <p className="text-body-sm text-content-muted mt-1">Enjoy the read.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative" noValidate>
            <h2 id="lg-heading" className="text-heading-md font-display font-medium text-content">
              Read the full briefing
            </h2>
            <p className="text-body-sm text-content-muted mt-1 mb-6">
              Tell us where to send it — it takes ten seconds.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
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

              <div className="pt-1 space-y-1 border-t border-surface-border/50 mt-2">
                <Toggle
                  checked={marketingOptIn}
                  onChange={setMarketingOptIn}
                  label="Keep me updated with 1Digit insights."
                />
                <Toggle
                  checked={contactOptIn}
                  onChange={setContactOptIn}
                  label="I'd like 1Digit to contact me."
                />
              </div>
            </div>

            {submitError && <p className="text-sm text-red-400 mt-4">{submitError}</p>}

            <button
              type="submit"
              disabled={!formValid || status === 'submitting'}
              className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium bg-[rgb(var(--color-btn-primary-bg))] text-[rgb(var(--color-btn-primary-text))] border border-surface-border transition-all duration-300 ${
                formValid && status !== 'submitting'
                  ? 'btn-glow hover:border-content/20 active:scale-[0.98] opacity-100'
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

            <p className="text-xs text-content-muted text-center mt-4">
              We respect your privacy.{' '}
              <a href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
