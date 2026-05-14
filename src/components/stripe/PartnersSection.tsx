"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Handshake, ArrowSquareOut } from "@phosphor-icons/react";
import { TactileButton } from "./TactileButton";
import { Globe } from "./Globe";
import PartnerDialog from "./PartnerDialog";
import styles from "./PartnersSection.module.css";

interface PartnerCategory {
  name: string;
  partners: { name: string; logo: string; url: string }[];
}

const categories: PartnerCategory[] = [
  {
    name: "International",
    partners: [
      { 
        name: "Takeda", 
        logo: "/images/logos/partners-logos/Takeda_idUdjJ8WQa_0.svg",
        url: "https://www.takeda.com/"
      },
      { 
        name: "APhA", 
        logo: "/images/logos/partners-logos/Apha_logo.svg",
        url: "https://www.pharmacist.com/"
      },
    ],
  },
  {
    name: "Ethiopia",
    partners: [
      { 
        name: "Ethiopian MoH", 
        logo: "/images/logos/partners-logos/Ministry-of-Health-Ethiopia.svg",
        url: "https://www.moh.gov.et/"
      },
      { 
        name: "EPA", 
        logo: "/images/logos/partners-logos/Ethiopian-Pharmaceutical-Association.webp",
        url: "https://epaethiopia.org.et/"
      },
    ],
  },
  {
    name: "Nigeria",
    partners: [
      { 
        name: "ACPN", 
        logo: "/images/logos/partners-logos/Association-of-Community-Pharmacists-of-Nigeria.svg",
        url: "https://acpnnigeria.org/"
      },
      { 
        name: "NPHCDA", 
        logo: "/images/logos/partners-logos/National-Primary-Health-Care-Development-Agency-NPHCDA.svg",
        url: "https://nphcda.gov.ng/"
      },
    ],
  },
  {
    name: "Kenya",
    partners: [
      { 
        name: "PSK", 
        logo: "/images/logos/partners-logos/The-Pharmaceutical-Society-of-Kenya-PSK.svg",
        url: "https://psk.or.ke/"
      },
      { 
        name: "Nairobi CC", 
        logo: "/images/logos/partners-logos/Nairobi_City_Logotype.png",
        url: "https://nairobi.go.ke/"
      },
    ],
  },
];

export function PartnersSection() {
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className={styles.partnersSection}>
      <div className={styles.contentContainer}>
        {/* Interactive Background Globe */}
        <div className={styles.globeContainer}>
          <div className={styles.globeSticky}>
            <Globe className="w-full h-full" />
          </div>
        </div>
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            Collaborative Excellence
          </span>
          <h2 className={styles.title}>
            Our Partners
          </h2>
          <p className={styles.description}>
            We work with leading organizations across healthcare and pharmacy to 
            strengthen primary care and expand access and training across Africa.
          </p>
        </div>

        {/* Regions Grid */}
        <div className={styles.regionsGrid}>
          {categories.map((category, idx) => (
            <motion.div 
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: idx * 0.1 }}
              className={styles.region}
            >
              <h3 className={styles.regionName}>
                {category.name}
              </h3>
              
              <div className={styles.partnersGrid}>
                {category.partners.map((partner, pIdx) => {
                  const partnerId = `${category.name}-${pIdx}`;
                  return (
                    <a 
                      key={pIdx}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label={`Visit ${partner.name} official website`}
                      onMouseEnter={() => setHoveredPartner(partnerId)}
                      onMouseLeave={() => setHoveredPartner(null)}
                      className={styles.partnerLink}
                    >
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className={styles.partnerLogo}
                      />

                      {/* Styled Tooltip - Inverted Design */}
                      <AnimatePresence>
                        {hoveredPartner === partnerId && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, x: "-50%", scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                            exit={{ opacity: 0, y: -5, x: "-50%", scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={styles.tooltip}
                          >
                            <span>{partner.name}</span>
                            <ArrowSquareOut size={12} weight="bold" style={{ color: '#cf1259' }} />
                            
                            {/* Arrow Tip */}
                            <div className={styles.tooltipArrow} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer / CTA */}
        <div className={styles.footer}>
          <div className={styles.footerText}>
            <p>
              PharmaLink is proud to collaborate with government bodies, professional 
              associations, the private sector and global healthcare leaders to 
              transform frontline care.
            </p>
          </div>
          
          <div className={styles.footerActions}>
            <TactileButton 
              onClick={() => setIsPartnerOpen(true)} 
              variant="primary" 
              className={styles.tactileOverride}
            >
              Partner with PharmaLink
            </TactileButton>
            
            <div className={styles.learnMore}>
              <Handshake size={20} weight="fill" />
              <span>Learn More</span>
            </div>
          </div>
        </div>
      </div>

      <PartnerDialog 
        isOpen={isPartnerOpen} 
        onClose={() => setIsPartnerOpen(false)} 
      />
    </section>
  );
}
