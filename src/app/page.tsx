import Navbar from "@/components/stripe/Navbar";
import Hero from "@/components/stripe/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      
      {/* Spacer to demonstrate scrolling and sticky nav */}
      <section style={{ height: '100vh', backgroundColor: 'var(--hds-color-bg)' }}>
        <div className="container" style={{ paddingTop: '100px' }}>
          <h2 style={{ fontSize: 'var(--hds-size-heading-lg)', color: 'var(--hds-color-fg)' }}>
            Next-gen financial solutions
          </h2>
          <p style={{ marginTop: '20px', color: 'var(--hds-color-fg)', opacity: 0.7 }}>
            Built for growth. Powered by intelligence. Scaled for the global economy.
          </p>
        </div>
      </section>
    </main>
  );
}
