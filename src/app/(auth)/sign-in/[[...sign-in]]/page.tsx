"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/stripe/AuthLayout";
import { StripeButton, StripeInput } from "@/components/stripe/StripeUI";
import Link from "next/link";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/forum");
      } else {
        console.log(result);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--hds-color-fg)', marginBottom: '8px' }}>
          Sign in to your account
        </h1>
        <p style={{ fontSize: '14px', color: '#425466' }}>
          Welcome back! Please enter your details.
        </p>
      </div>

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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--hds-color-primary)', fontWeight: 500, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <StripeButton type="submit" isLoading={isLoading}>
          Sign in
        </StripeButton>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#425466' }}>
        Don't have an account?{' '}
        <Link href="/sign-up" style={{ color: 'var(--hds-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
