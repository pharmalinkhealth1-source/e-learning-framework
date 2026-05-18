'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

type RulesDoc = {
  version: string;
  rules: { title: string; body: string }[];
};

export default function ForumRulesModal({ rulesDoc }: { rulesDoc: RulesDoc }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [confirmed, setConfirmed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const totalSteps = rulesDoc.rules.length;
  const rule = rulesDoc.rules[currentStep - 1];
  const isFinalStep = currentStep === totalSteps;
  const progressPct = (currentStep / totalSteps) * 100;

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/forum/rules/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: rulesDoc.version }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Failed to record acceptance');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '640px',
          width: '100%',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Progress bar */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              height: '6px',
              background: '#e5edf5',
              borderRadius: '100px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: '#6c30c0',
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '0.6875rem',
              color: '#6c30c0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
              marginTop: '8px',
              marginBottom: 0,
            }}
          >
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Rule card — key forces remount on step change, triggering animation */}
        <div
          key={currentStep}
          style={{
            animation: 'fadeIn 0.25s ease',
            minHeight: '160px',
            marginBottom: '32px',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#6c30c0',
              marginBottom: '12px',
              marginTop: 0,
            }}
          >
            {rule.title}
          </h3>
          <p
            style={{
              color: '#425466',
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {rule.body}
          </p>
        </div>

        {/* Navigation — steps 1 to N-1 */}
        {!isFinalStep && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={currentStep === 1}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                border: '1px solid #e5edf5',
                background: '#ffffff',
                color: '#425466',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.4 : 1,
              }}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                border: 'none',
                background: '#6c30c0',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* Acceptance section — final step only */}
        {isFinalStep && (
          <div>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#425466',
                lineHeight: 1.6,
                marginBottom: '20px',
                marginTop: 0,
              }}
            >
              By clicking &lsquo;I Accept&rsquo;, I confirm that I have read, understood, and agree to
              abide by these Community Rules in full. I understand that violations may result in
              removal from the platform and referral to my professional licensing authority.
            </p>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '24px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                style={{
                  marginTop: '2px',
                  accentColor: '#6c30c0',
                  width: '16px',
                  height: '16px',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '0.875rem',
                  color: '#1a1a2e',
                  fontWeight: 500,
                }}
              >
                I Accept &amp; Agree to these Rules
              </span>
            </label>

            {error && (
              <p
                style={{
                  color: '#e53e3e',
                  fontSize: '0.8125rem',
                  marginBottom: '16px',
                  marginTop: 0,
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleExit}
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: '1px solid #e5edf5',
                  background: '#f0eaf8',
                  color: '#425466',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                I Do Not Agree (Exit)
              </button>
              <button
                onClick={handleAccept}
                disabled={!confirmed || loading}
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: 'none',
                  background: confirmed && !loading ? '#6c30c0' : '#c4b0e0',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: confirmed && !loading ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? 'Accepting...' : 'Accept & Enter Forum'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
