import Navbar from "@/components/stripe/Navbar";
import Hero from "@/components/stripe/Hero";
import { BentoGrid, BentoCard, BentoTag } from "@/components/stripe/Bento";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      
      <section className="container" style={{ paddingBottom: '160px' }}>
        <div style={{ marginBottom: '64px', maxWidth: '600px' }}>
          <BentoTag label="Our Ecosystem" color="var(--hds-color-primary)" />
          <h2 style={{ 
            fontSize: 'var(--hds-size-heading-lg)', 
            color: 'var(--hds-color-fg)',
            marginTop: '16px',
            marginBottom: '20px'
          }}>
            Fully integrated suite of financial products
          </h2>
          <p style={{ color: 'var(--hds-color-fg)', opacity: 0.7, fontSize: 'var(--hds-size-text-md)' }}>
            Every tool you need to build, scale, and manage your business. 
            Designed for high-performance and clinical luxury.
          </p>
        </div>

        <BentoGrid>
          <BentoCard 
            title="Global Forum" 
            description="Join discussions with industry experts and peers."
            span={2}
            rowSpan={2}
          >
            <div style={{ padding: '20px', background: 'rgba(99,91,255,0.05)', borderRadius: '12px', height: '100%' }}>
              {/* Placeholder for forum visualization */}
              <div style={{ width: '40px', height: '4px', background: 'var(--hds-color-primary)', borderRadius: '2px', marginBottom: '8px' }} />
              <div style={{ width: '80%', height: '4px', background: 'var(--hds-color-fg)', opacity: 0.1, borderRadius: '2px', marginBottom: '8px' }} />
              <div style={{ width: '60%', height: '4px', background: 'var(--hds-color-fg)', opacity: 0.1, borderRadius: '2px' }} />
            </div>
          </BentoCard>

          <BentoCard 
            title="Career Portal" 
            description="Find high-impact opportunities in finance."
            span={2}
          />

          <BentoCard 
            title="Industry Insights" 
            description="Data-driven reports on market trends."
            span={1}
            rowSpan={2}
          />

          <BentoCard 
            title="Resource Directory" 
            description="A curated list of partners and tools."
            span={1}
            rowSpan={2}
          />
          
          <BentoCard 
            title="API Reference" 
            description="Developer-first documentation for engineers."
            span={2}
          />
        </BentoGrid>
      </section>
    </main>
  );
}
