import Navbar from "@/components/stripe/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div style={{ height: '200vh', padding: '100px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--hds-size-heading-xl)', fontWeight: 'var(--hds-font-weight-bold)' }}>
            Financial infrastructure for the internet
          </h1>
          <p style={{ fontSize: 'var(--hds-size-text-lg)', marginTop: '20px', opacity: 0.8 }}>
            Millions of companies of all sizes—from startups to Fortune 500s—use Stripe’s software and APIs to accept payments, send payouts, and manage their businesses online.
          </p>
        </div>
      </div>
    </main>
  );
}
