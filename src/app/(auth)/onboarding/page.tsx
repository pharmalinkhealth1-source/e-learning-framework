"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/stripe/AuthLayout";
import { StripeButton, StripeInput } from "@/components/stripe/StripeUI";

type Role = 'client' | 'developer' | 'partner';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = React.useState<Role>('client');
  const [companyName, setCompanyName] = React.useState("");
  const [useCase, setUseCase] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, companyName, useCase }),
      });

      if (res.ok) {
        // Refresh user data to get the new metadata
        await user?.reload();
        router.push("/forum");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save onboarding data.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--hds-color-fg)', marginBottom: '8px' }}>
          Welcome to Stripe
        </h1>
        <p style={{ fontSize: '14px', color: '#425466' }}>
          Tell us a bit about yourself to customize your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--hds-color-fg)', marginBottom: '8px', opacity: 0.8 }}>
            What best describes you?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f6f9fc', padding: '4px', borderRadius: '8px' }}>
            {(['client', 'developer', 'partner'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: role === r ? '#ffffff' : 'transparent',
                  color: role === r ? 'var(--hds-color-primary)' : '#425466',
                  boxShadow: role === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  textTransform: 'capitalize'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <StripeInput
          label="Company name"
          placeholder="Acme Corp"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <StripeInput
          label="What are you looking to achieve?"
          placeholder="e.g. Scaling global payments"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          required
          error={error}
        />

        <div style={{ marginTop: '32px' }}>
          <StripeButton type="submit" isLoading={isLoading}>
            Finish setup
          </StripeButton>
        </div>
      </form>
    </AuthLayout>
  );
}
