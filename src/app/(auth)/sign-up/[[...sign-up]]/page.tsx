"use client";

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/stripe/AuthLayout";
import { StripeButton, StripeInput } from "@/components/stripe/StripeUI";
import Link from "next/link";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/onboarding");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--hds-color-fg)', marginBottom: '8px' }}>
          {pendingVerification ? 'Verify your email' : 'Create your account'}
        </h1>
        <p style={{ fontSize: '14px', color: '#425466' }}>
          {pendingVerification 
            ? `We've sent a code to ${emailAddress}` 
            : 'Join thousands of businesses using Stripe.'}
        </p>
      </div>

      {!pendingVerification ? (
        <form onSubmit={handleSubmit}>
          <StripeInput
            label="Email address"
            type="email"
            placeholder="name@company.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />
          <StripeInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error}
          />

          <p style={{ fontSize: '12px', color: '#7a869a', marginBottom: '20px', lineHeight: '1.5' }}>
            By creating an account, you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--hds-color-primary)', textDecoration: 'none' }}>Terms</Link> and{' '}
            <Link href="/privacy" style={{ color: 'var(--hds-color-primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>

          <StripeButton type="submit" isLoading={isLoading}>
            Create account
          </StripeButton>
        </form>
      ) : (
        <form onSubmit={onPressVerify}>
          <StripeInput
            label="Verification code"
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            error={error}
          />
          <StripeButton type="submit" isLoading={isLoading}>
            Verify email
          </StripeButton>
        </form>
      )}

      {!pendingVerification && (
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#425466' }}>
          Already have an account?{' '}
          <Link href="/sign-in" style={{ color: 'var(--hds-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
