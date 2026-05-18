"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import AuthLayout from "@/components/stripe/AuthLayout";
import { StripeButton, StripeInput } from "@/components/stripe/StripeUI";

type Role = 'learner' | 'pharmacy' | 'job_seeker' | 'employer' | 'partner' | 'admin';

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: 'learner',    label: 'Learner / CPD',           description: 'Students, pharmacists, nurses, researchers, and other HCPs seeking education or CPD' },
  { value: 'pharmacy',   label: 'Pharmacy / Business',     description: 'Independent pharmacies, chain pharmacies, and wholesalers' },
  { value: 'job_seeker', label: 'Job Seeker',              description: 'Candidates looking for pharmacy and healthcare roles' },
  { value: 'employer',   label: 'Employer / Recruiter',    description: 'Hiring managers and HR at pharmacy businesses' },
  { value: 'partner',    label: 'Partner Organisation',    description: 'Public sector, NGOs, private sector, governmental entities, and pharmaceutical manufacturers' },
  { value: 'admin',      label: 'PharmaLink Team',         description: 'Internal staff (Admin, Data, R&I) — requires invite code' },
];

const ROLE_DESTINATIONS: Record<Role, string> = {
  learner:    '/elearning/dashboard',
  pharmacy:   '/directory',
  job_seeker: '/careers',
  employer:   '/directory',
  partner:    '/directory',
  admin:      '/forum',
};

const GHPC_REGEX = /^\d{7}$/;

function validateGphc(value: string) {
  if (!value) return null;
  return GHPC_REGEX.test(value) ? null : 'GPhC number must be 7 digits';
}

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [role, setRole] = React.useState<Role | null>(null);
  const [fields, setFields] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const setField = (key: string, value: string) =>
    setFields(prev => ({ ...prev, [key]: value }));

  const handleRoleSelect = () => {
    if (!role) { setError("Please select a role."); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    if (fields.gphcNumber && (role === 'learner' || role === 'pharmacy')) {
      const gphcError = validateGphc(fields.gphcNumber);
      if (gphcError) { setError(gphcError); return; }
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...fields }),
      });

      if (res.ok) {
        await user?.reload();
        window.location.href = ROLE_DESTINATIONS[role];
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save onboarding data.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;
  if (!user) { window.location.href = '/sign-in'; return null; }

  return (
    <AuthLayout wide>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--hds-color-fg)', marginBottom: '8px' }}>
          Welcome to PharmaLink
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--hds-color-text-secondary)' }}>
          {step === 1 ? 'Tell us who you are to personalise your experience.' : 'A few more details to get you set up.'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              width: '24px', height: '4px', borderRadius: '2px',
              background: step >= s ? 'var(--hds-color-primary)' : '#e0e0e0',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--hds-color-fg)', marginBottom: '12px', opacity: 0.8 }}>
            What best describes you?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '24px' }}>
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => { setRole(r.value); setError(""); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '12px 14px', borderRadius: '8px', cursor: 'pointer',
                  transition: 'all 0.2s ease', textAlign: 'left', width: '100%',
                  border: role === r.value ? '2px solid var(--hds-color-primary)' : '2px solid #e0e0e0',
                  background: role === r.value ? 'rgba(99,91,255,0.04)' : '#ffffff',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: role === r.value ? 'var(--hds-color-primary)' : 'var(--hds-color-fg)' }}>
                  {r.label}
                </span>
                <span style={{ fontSize: '12px', color: '#7a869a', marginTop: '2px' }}>
                  {r.description}
                </span>
              </button>
            ))}
          </div>
          {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
          <StripeButton type="button" onClick={handleRoleSelect}>
            Continue
          </StripeButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
          {role === 'learner' && (
            <>
              <StripeInput label="Profession / role" placeholder="e.g. Pharmacist, Student, Nurse, Researcher, CHEW" value={fields.profession || ''} onChange={e => setField('profession', e.target.value)} required />
              <StripeInput label="GPhC registration number (optional)" placeholder="1234567" value={fields.gphcNumber || ''} onChange={e => setField('gphcNumber', e.target.value)} />
              <StripeInput label="Primary learning goal" placeholder="e.g. CPD credits, clinical skills, research" value={fields.learningGoal || ''} onChange={e => setField('learningGoal', e.target.value)} required />
              <StripeInput label="Institution / organisation (optional)" placeholder="e.g. University of Lagos, NHS Trust" value={fields.institution || ''} onChange={e => setField('institution', e.target.value)} />
            </>
          )}

          {role === 'pharmacy' && (
            <>
              <StripeInput label="Business name" placeholder="e.g. City Pharmacy Ltd" value={fields.businessName || ''} onChange={e => setField('businessName', e.target.value)} required />
              <StripeInput label="GPhC premises number (optional)" placeholder="1234567" value={fields.gphcNumber || ''} onChange={e => setField('gphcNumber', e.target.value)} />
              <StripeInput label="Business type" placeholder="e.g. Independent pharmacy, Wholesale" value={fields.businessType || ''} onChange={e => setField('businessType', e.target.value)} required />
              <StripeInput label="Location (town / city)" placeholder="e.g. London" value={fields.location || ''} onChange={e => setField('location', e.target.value)} required />
            </>
          )}

          {role === 'job_seeker' && (
            <>
              <StripeInput label="Profession / role type" placeholder="e.g. Pharmacist, Pharmacy Technician" value={fields.profession || ''} onChange={e => setField('profession', e.target.value)} required />
              <StripeInput label="Years of experience" placeholder="e.g. 3" value={fields.experience || ''} onChange={e => setField('experience', e.target.value)} required />
              <div style={{ gridColumn: '1 / -1' }}>
                <StripeInput label="Preferred location" placeholder="e.g. Manchester, Remote, UK-wide" value={fields.preferredLocation || ''} onChange={e => setField('preferredLocation', e.target.value)} required />
              </div>
            </>
          )}

          {role === 'employer' && (
            <>
              <StripeInput label="Organisation name" placeholder="e.g. Boots UK" value={fields.organisationName || ''} onChange={e => setField('organisationName', e.target.value)} required />
              <StripeInput label="Business type" placeholder="e.g. Pharmacy chain, NHS Trust" value={fields.businessType || ''} onChange={e => setField('businessType', e.target.value)} required />
              <div style={{ gridColumn: '1 / -1' }}>
                <StripeInput label="Roles you're recruiting for" placeholder="e.g. Pharmacists, Dispensing technicians" value={fields.recruitingFor || ''} onChange={e => setField('recruitingFor', e.target.value)} required />
              </div>
            </>
          )}

          {role === 'partner' && (
            <>
              <StripeInput label="Organisation name" placeholder="e.g. NHS England" value={fields.organisationName || ''} onChange={e => setField('organisationName', e.target.value)} required />
              <StripeInput label="Sector" placeholder="e.g. Public, NGO, Private, Governmental" value={fields.sector || ''} onChange={e => setField('sector', e.target.value)} required />
              <div style={{ gridColumn: '1 / -1' }}>
                <StripeInput label="Partnership interest" placeholder="e.g. Data sharing, workforce, research" value={fields.partnershipInterest || ''} onChange={e => setField('partnershipInterest', e.target.value)} required />
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <StripeInput label="Department" placeholder="e.g. Admin, Data, R&I, Operations" value={fields.department || ''} onChange={e => setField('department', e.target.value)} required />
              <StripeInput label="Invite code" placeholder="••••••••" value={fields.inviteCode || ''} onChange={e => setField('inviteCode', e.target.value)} required />
            </>
          )}
          </div>

          {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); }}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#425466' }}
            >
              Back
            </button>
            <div style={{ flex: 2 }}>
              <StripeButton type="submit" isLoading={isLoading}>
                Finish setup
              </StripeButton>
            </div>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
