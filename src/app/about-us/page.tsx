'use client';

import React from 'react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import MeshGradient from '@/components/stripe/MeshGradient';
import styles from './AboutPage.module.css';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Users, ShieldCheck, Heart, Globe, Target, Zap, X, Mail, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';

const CustomSelect = ({ options, placeholder }: { options: string[], placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className={styles.customSelectWrapper}>
      <div 
        className={`${styles.customSelectTrigger} ${isOpen ? styles.isOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected || placeholder}</span>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.customSelectDropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option, i) => (
              <div 
                key={i}
                className={`${styles.customSelectOption} ${selected === option ? styles.isSelected : ''}`}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LinkedInIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M1.5 0C0.67157 0 0 0.67157 0 1.5V16.5C0 17.3284 0.67157 18 1.5 18H16.5C17.3284 18 18 17.3284 18 16.5V1.5C18 0.67157 17.3284 0 16.5 0H1.5ZM5.52076 4.00272C5.52639 4.95897 4.81061 5.54819 3.96123 5.54397C3.16107 5.53975 2.46357 4.90272 2.46779 4.00413C2.47201 3.15897 3.13998 2.47975 4.00764 2.49944C4.88795 2.51913 5.52639 3.1646 5.52076 4.00272ZM9.2797 6.76176H6.7583V15.3216H9.4217V15.1219C9.4217 14.742 9.4214 14.362 9.4211 13.9819C9.4203 12.9681 9.4194 11.9532 9.4246 10.9397C9.426 10.6936 9.4372 10.4377 9.5005 10.2028C9.7381 9.3253 10.5271 8.7586 11.4074 8.8979C11.9727 8.9864 12.3467 9.3141 12.5042 9.8471C12.6013 10.1803 12.6449 10.5389 12.6491 10.8863C12.6605 11.9339 12.6589 12.9815 12.6573 14.0292C12.6567 14.399 12.6561 14.769 12.6561 15.1388V15.3202H15.328V15.1149C15.328 14.6629 15.3278 14.211 15.3275 13.7591C15.327 12.6296 15.3264 11.5001 15.3294 10.3702C15.3308 9.8597 15.276 9.3563 15.1508 8.8627C14.9638 8.1286 14.5771 7.5211 13.9485 7.0824C13.5027 6.77019 13.0133 6.5691 12.4663 6.5466C12.404 6.54401 12.3412 6.54062 12.2781 6.53721C11.9984 6.52209 11.7141 6.50673 11.4467 6.56066C10.6817 6.71394 10.0096 7.0641 9.5019 7.6814C9.4429 7.7522 9.3852 7.8241 9.2991 7.9314L9.2797 7.9557V6.76176ZM2.68164 15.3244H5.33242V6.76733H2.68164V15.3244Z" fill="currentColor"/>
  </svg>
);

const AboutPage = () => {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start start", "end start"]
  });
  
  // Transition background from white to #fff4fd
  // Reaches full implementation when Leadership top reaches viewport top
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#ffffff", "#fff4fd"]
  );

  return (
    <motion.main 
      className={styles.main}
      style={{ backgroundColor }}
    >
      <Navbar />

      <div className={styles.linesWrapper}>
        <div className={styles.gridLinesContainer}>
          <div className={styles.gridLineInternal}></div>
          <div className={styles.gridLineInternal}></div>
          <div className={styles.gridLineInternal}></div>
        </div>
        
        <div ref={scrollTargetRef}>
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroContainer}>
              <div className={styles.heroLayout}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className={styles.heroContent}
                >
                  <span className={styles.eyebrow}>About PharmaLink</span>
                  <h2 className={styles.title}>
                    Our mission is to turn local pharmacies into the strongest link in the health system
                  </h2>
                  <p className={styles.description}>
                    PharmaLink was built to close the gaps in African healthcare systems—with pharmacists at the center, and the wider private sector community within reach.
                  </p>
                  <p className={styles.description}>
                    We bridge the gap between community trust and clinical excellence across the African continent.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={styles.heroImageContainer}
                >
                  <Image 
                    src="/pharmalink_hero_about_1778015424289.png" 
                    alt="Modern Pharmacy Environment" 
                    fill
                    className={styles.heroImage}
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Metrics / Fast Facts Section */}
          <section className={styles.metrics}>
            <div className={styles.heroContainer}>
              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <h3 className={styles.fastFactsTitle}>PharmaLink Facts</h3>
                  <div className={styles.metricContent}>
                    <span className={styles.metricValue}>1M+</span>
                    <span className={styles.metricLabel}>lives impacted through community pharmacy networks.</span>
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.fastFactsSpacer}></div>
                  <div className={styles.metricContent}>
                    <span className={styles.metricValue}>3+</span>
                    <span className={styles.metricLabel}>African nations integrated into the platform for 2024.</span>
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.fastFactsSpacer}></div>
                  <div className={styles.metricContent}>
                    <span className={styles.metricValue}>200%</span>
                    <span className={styles.metricLabel}>annual service growth across private health systems.</span>
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.fastFactsSpacer}></div>
                  <div className={styles.metricContent}>
                    <span className={styles.metricValue}>24/7</span>
                    <span className={styles.metricLabel}>direct clinical support available to all practitioners.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* About Section */}
      <section className={styles.contentSection}>
        <div className={styles.heroContainer}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionHeader}>
              <h2>About PharmaLink</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Across Africa, pharmacists reach patients that formal health systems often cannot. 
                In neighborhoods, markets, and towns where a clinic may be hours away, these trusted 
                providers are the first point of contact for primary healthcare.
              </p>
              <p>
                Yet their potential has too often gone unrealized, limited by gaps in training, 
                isolation from peers, and a lack of data. PharmaLink exists to change that by turning 
                local pharmacies into the strongest link in the health system.
              </p>
              
              <div className={styles.comparisonGrid}>
                <div className={`${styles.comparisonColumn} ${styles.comparisonWithout}`}>
                  <h3>Without PharmaLink</h3>
                  <ul>
                    <li>Isolated providers in silos</li>
                    <li>Gaps in clinical training</li>
                    <li>Invisible patient impact</li>
                  </ul>
                </div>
                <div className={`${styles.comparisonColumn} ${styles.comparisonActive}`}>
                  <h3>With PharmaLink</h3>
                  <ul>
                    <li>Coordinated data ecosystem</li>
                    <li>World-class eLearning</li>
                    <li>Verifiable impact dashboards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.linesWrapper}>
        <div className={styles.gridLinesContainer}>
          <div className={styles.gridLineInternal}></div>
          <div className={styles.gridLineInternal}></div>
          <div className={styles.gridLineInternal}></div>
        </div>

        {/* Leadership Section */}
        <section className={`${styles.contentSection} ${styles.leadershipSection}`}>
          <div className={styles.leadershipSectionBorders} aria-hidden="true">
            <div className={styles.gridLineInternal} />
            <div className={styles.gridLineInternal} />
            <div className={styles.gridLineInternal} />
          </div>
          <div className={styles.heroContainer}>
            <div className={styles.sectionGrid}>
              <div className={styles.sectionHeader}>
                <h2>Leadership</h2>
              </div>
              <div className={styles.sectionBody}>
                <p className={styles.leadText}>
                  <strong>Scaling accessible healthcare worldwide.</strong> Our global team combines pharmacy and digital health expertise to turn local innovations into resilient health systems.
                </p>
                <div className={styles.teamGrid}>
                  {teamMembers.map((member, i) => (
                    <div key={i} className={styles.teamCard} onClick={() => setSelectedMember(member)}>
                      <div className={styles.memberImage} style={{ background: "#F5F3FF" }}>
                        {member.image ? (
                          <Image 
                            src={member.image} 
                            alt={member.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Users size={24} />
                        )}
                      </div>
                      <div className={styles.memberInfo}>
                        <h3 className={styles.memberName}>{member.name}</h3>
                        <p className={styles.memberTitle}>{member.role}</p>
                        <div className={styles.locationBadge}>
                          <span className={styles.locationIcon}>
                            {member.location === "Global" ? (
                              <Globe size={12} />
                            ) : (
                              <FlagIcon country={member.location} />
                            )}
                          </span>
                          {member.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {selectedMember && (
            <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <section className={`${styles.ctaSection} ${styles.ctaBackgroundWrapper}`}>
          <div className={styles.heroContainer}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>Partner with PharmaLink</h2>
                <p className={styles.ctaText}>Drive access, education, and innovation across Africa’s pharmacy network. Together, we build resilient health systems.</p>
              </div>
              <div className={styles.ctaButtons}>
                <button className={styles.primaryButton}>Join the Network</button>
                <button className={styles.secondaryButton}>Explore Courses</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </motion.main>
  );
};

const TeamMemberModal = ({ member, onClose }: { member: typeof teamMembers[0], onClose: () => void }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button className={styles.modalClose} onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className={styles.modalBody}>
          <div className={styles.modalProfileSection}>
            <h2 className={styles.modalName}>{member.name}</h2>
            <p className={styles.modalTagline}>{member.tagline || member.role}</p>
            
            <div className={styles.modalBio}>
              {member.bio ? (
                member.bio.split('\n\n').map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                ))
              ) : (
                <p>Expert in {member.role.toLowerCase()} with a focus on {member.location} regions.</p>
              )}
            </div>

            <div className={styles.modalSocials}>
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <LinkedInIcon size={20} />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className={styles.socialLink}>
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          <div className={styles.modalFormSection}>
            <h3 className={styles.formTitle}>Message {member.name.split(',')[0].split(' ')[0]}</h3>
            <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input type="text" placeholder="First Name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input type="text" placeholder="Last Name" />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" placeholder="email@example.com" />
              </div>

              <div className={styles.formGroup}>
                <label>Choose a topic</label>
                <CustomSelect 
                  placeholder="Select One..." 
                  options={[
                    "Pharmacy-Based Immunization Delivery",
                    "Global Health",
                    "Vaccine Access",
                    "Pharmacy Profession Advocacy",
                    "Capacity Building",
                    "Social Business Marketing",
                    "Product Innovation",
                    "Digital Health Solutions",
                    "Data Management",
                    "Business Development",
                    "Strategic Partnerships",
                    "eLearning"
                  ]} 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea rows={4} placeholder="Type Your Message..." />
              </div>

              <label className={styles.consentGroup}>
                <input type="checkbox" />
                <span>I consent to receiving communication from PharmaLink</span>
              </label>

              <button type="submit" className={styles.modalSubmit}>
                Message {member.name.split(',')[0].split(' ')[0]}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FlagIcon = ({ country }: { country: string }) => {
  switch (country) {
    case "Nigeria":
      return (
        <svg className={styles.flagCircle} viewBox="0 0 100 100">
          <rect x="0" y="0" width="33.3" height="100" fill="#008751" />
          <rect x="33.3" y="0" width="33.4" height="100" fill="#FFFFFF" />
          <rect x="66.7" y="0" width="33.3" height="100" fill="#008751" />
        </svg>
      );
    case "Ethiopia":
      return (
        <svg className={styles.flagCircle} viewBox="0 0 100 100">
          <rect x="0" y="0" width="100" height="33.3" fill="#078930" />
          <rect x="0" y="33.3" width="100" height="33.4" fill="#FCD116" />
          <rect x="0" y="0" width="100" height="33.3" fill="#078930" />
          <rect x="0" y="33.3" width="100" height="33.4" fill="#FCD116" />
          <rect x="0" y="66.7" width="100" height="33.3" fill="#DA121A" />
        </svg>
      );
    case "Kenya":
      return (
        <svg className={styles.flagCircle} viewBox="0 0 100 100">
          <rect x="0" y="0" width="100" height="33.3" fill="#000000" />
          <rect x="0" y="33.3" width="100" height="33.4" fill="#BB0000" />
          <rect x="0" y="66.7" width="100" height="33.3" fill="#006600" />
        </svg>
      );
    default:
      return null;
  }
};

const teamMembers = [
  { 
    name: "Betty Abera, BPharm, MBA", 
    role: "Project Director",
    location: "Global",
    image: "/images/leadership-team/Betty_Abera-PharmaLink-Project-Director.webp",
    tagline: "Global Project Director, PharmaLink (PSI) | Registered Pharmacist | 20+ Yrs in Global Health & Vaccine Access | Social Business Expert",
    bio: "<strong>Betty Abera</strong> is a distinguished <strong>Global Health Specialist</strong> and <strong>Registered Pharmacist</strong> with over <strong>20 years of experience</strong> improving global access to medicines and vaccines.\n\nAs the <strong>Global Project Director for PharmaLink at PSI</strong>, she leads the strategic expansion of <strong>pharmacy-based immunization delivery</strong> across Ethiopia, Nigeria, and Kenya, with a focus on policy advocacy and implementation frameworks. Betty’s previous work at PSI involved directing social business marketing and product innovation for over 20 countries in Africa, Asia, and Latin America.\n\nHer diverse background includes a decade in direct patient care, operations management, and pharmaceutical marketing at <strong>GSK East Africa</strong>. She holds a BSc in Pharmacy and an <strong>MBA in International Business</strong>.",
    linkedin: "https://www.linkedin.com/in/betty-abera-0b7b4b59/",
    email: "babera@psi.org"
  },
  {
    name: "Alexandra Miller",
    role: "Program Manager",
    location: "Global",
    image: "/images/leadership-team/alex.webp",
    tagline: "Global Health Professional | Program Manager, PSI | Pharmacy-Based Immunization Delivery | BA, Bowdoin College",
    bio: "<strong>Alexandra Miller</strong> is a <strong>Global Health professional</strong> with experience managing multi-country programs, strengthening partnerships, and providing technical support across operations, finance, workforce capacity building, and digital ecosystem development.\n\nShe is a <strong>Program Manager</strong> at <strong>Population Services International (PSI)</strong> on the <strong>Pharmacy-Based Immunization Delivery project</strong>. In this role, she works closely with country teams, strategic partners, and technical experts to drive operational excellence, advance private-sector engagement, and implement innovative approaches to increase access to immunization services.\n\nPreviously, Alexandra contributed to multiple global health initiatives focused on program management, digital transformation, and strengthening country-level health systems. She has partnered with in-country stakeholders across Africa to expand service delivery, enhance organizational effectiveness, and build sustainable technical and operational capacity.\n\nBased in Boston, Massachusetts, she holds a <strong>Bachelor’s degree with Honors in Neuroscience and Government and Legal Studies</strong>, with a concentration in International Relations, from <strong>Bowdoin College</strong>.",
    linkedin: "https://www.linkedin.com/in/alexandra-miller-0b9859115",
    email: "amiller@psi.org"
  },
  { 
    name: "Adebayo Adebisi, MD", 
    role: "Program Manager", 
    location: "Nigeria",
    image: "/images/leadership-team/Adebayo-Adebisi.png",
    tagline: "Global Health Epidemiologist | Registered Pharmacist | Oxford & Glasgow Scholar | Research Director & Health Equity Advocate",
    bio: "<strong>Adebayo</strong> is a distinguished <strong>Global Health Epidemiologist</strong> and <strong>Registered Pharmacist</strong> committed to advancing public health and research capacity in the Global South.\n\nHis exceptional academic background includes a current <strong>PhD in Epidemiology</strong> at the University of Glasgow (ESRC-funded) and an <strong>MSc in Global Health Science and Epidemiology</strong> from the University of Oxford (Commonwealth Shared Scholar).\n\nWith over <strong>50 publications</strong> in international journals, his research focuses on <strong>social epidemiology</strong>, <strong>health inequalities</strong>, and strengthening health systems through evidence on topics like <strong>AMR</strong> and <strong>tobacco harm reduction</strong>. Mr. Adebisi has been widely recognized for his advocacy and research contributions, notably receiving the prestigious <strong>Diana Award</strong>.",
    linkedin: "https://www.linkedin.com/in/adebisi-yusuff-adebayo/",
    email: "aadebisi@psinigeria.org"
  },
  { 
    name: "Belete Ayalneh, BPharm, MPH", 
    role: "Program Manager", 
    location: "Ethiopia",
    image: "/images/leadership-team/Belete-Ayalneh.webp",
    tagline: "Senior Program Manager (PSI) | Clinical Pharmacist & PMP | 15+ Yrs in Immunization Delivery, Supply Chain & Policy Advocacy",
    bio: "<strong>Belete</strong> is a senior <strong>Clinical Pharmacist</strong> and certified <strong>Project Management Professional (PMP)</strong> with over <strong>15 years of experience</strong> spanning pharmacy services, program management, and national policy advocacy.\n\nHe is <strong>Senior Program Manager for Pharmacy-Based Immunization Delivery</strong> at <strong>Population Services International (PSI)-Ethiopia</strong>, leading efforts to expand access to vaccination services.\n\nHe previously served as a <strong>Clinical Pharmacy Advisor</strong> for the <strong>USAID GHSC-PSM</strong> (Chemonics), specializing in medication safety monitoring and pharmacovigilance. His expertise is further backed by extensive experience as an <strong>academician, practitioner, and researcher</strong> of Clinical Pharmacy at Addis Ababa University.\n\nAcademically, he holds dual master’s degrees in <strong>Pharmacy Practice</strong> and <strong>Public Health</strong>, complemented by a MiniMasters in <strong>Global Supply Chain Management</strong> from Arizona State University.",
    linkedin: "https://www.linkedin.com/in/belete-ayalneh-worku-1343ba43/",
    email: "bayalneh@psiet.org"
  },
  { 
    name: "Florence Wachira, MD", 
    role: "Program Manager", 
    location: "Kenya",
    image: "/images/leadership-team/Florence-Wachira.webp",
    tagline: "Program Director (Kenya) & MD | Global Health Leadership | Health Systems Strengthening | Clinical & Mental Health Practice",
    bio: "<strong>Dr. Florence Njenga Wachira</strong> is a highly accomplished <strong>Global Health Leader, Medical Doctor (MD, MSc)</strong>, and Program Manager with 15+ years of experience in health systems strengthening and clinical delivery.\n\nShe currently drives strategy and execution as the <strong>Program Manager and Health Systems Accelerator</strong> at <strong>Population Services International (PSI)</strong>. Prior to PSI, she served as a <strong>Technical Lead</strong> at the <strong>Elizabeth Glaser Pediatric AIDS Foundation (EGPAF)</strong>, focusing on clinical research and policy.\n\nDr. Wachira’s leadership foundation includes advanced training in <strong>Global Health Leadership, Policy, and Gender/Intersectionality</strong> from the University of Toronto’s Dalla Lana School of Public Health, and an <strong>InterSCALE Fellowship</strong> at Aga Khan University, complementing her MBCHB (Clinical Psychology focus) from the University of Nairobi.",
    linkedin: "https://www.linkedin.com/in/florence-njenga-wachira-md-msc-a724b429/",
    email: "fwachira@psi.org"
  },
  { 
    name: "Mersha Alene, MPH", 
    role: "Program Officer", 
    location: "Ethiopia",
    image: "/images/leadership-team/Mersha-Alene-PharmaLink.webp",
    tagline: "Program Officer, PharmaLink (PSI Ethiopia) | Public Health Professional | 13+ Yrs in Health Systems & Program Leadership | Immunization & SRH Expert",
    bio: "<strong>Mersha Alene</strong> is a seasoned <strong>Public Health Professional</strong> with over <strong>13 years of experience</strong> strengthening health systems and leading high-impact programs across Ethiopia.\n\nAs <strong>Program Officer for PharmaLink at PSI Ethiopia</strong>, he drives the implementation of <strong>pharmacy-based immunization delivery</strong> and other public health initiatives, bridging policy, health systems, and community-level action. Mersha brings expertise across <strong>HIV/AIDS, sexual and reproductive health, immunization, cervical cancer prevention,</strong> and <strong>pharmacy-based public health interventions</strong>.\n\nHis diverse career spans government health institutions, international NGOs, and private-sector facilities, providing him with a well-rounded perspective on health service delivery and program management. Mersha holds a <strong>Master of Public Health (MPH)</strong> from Haramaya University.",
    linkedin: "https://www.linkedin.com/in/mersha-alene-8187a1aa/"
  },
  { 
    name: "Temitope Adenuga", 
    role: "Senior Program Officer", 
    location: "Nigeria",
    image: "/images/leadership-team/Temitope-Adenuga-PharmaLink.webp",
    tagline: "Senior Program Officer & Immunization Specialist, PharmaLink (PSI Nigeria) | 5+ Yrs Public-Sector Strengthening Immunization | Service Quality Expert Advancing Community Engagement",
    bio: "<strong>Temitope Adenuga</strong> is a dedicated <strong>Immunization Program Specialist</strong> with over <strong>five years of experience</strong> leading public-sector vaccination initiatives and more than <strong>two years</strong> serving as a state-level consultant for NGOs.\n\nAs the <strong>Senior Program Officer for PharmaLink at PSI Nigeria</strong>, she supports the expansion of <strong>pharmacy-based immunization delivery</strong> through <strong>strategic planning, community engagement,</strong> and <strong>technical oversight in resource-limited settings</strong>. Temitope brings proven expertise in <strong>strengthening routine immunization systems, improving service quality,</strong> and <strong>driving operational performance.</strong>\n\nHer professional background includes <strong>designing, implementing,</strong> and <strong>evaluating vaccination programs with a strong commitment to client-centered care and supportive supervision</strong>. Passionate about <strong>innovative, equitable healthcare solutions,</strong> Temitope is deeply aligned with PSI’s <strong>mission to make essential health services more accessible and impactful.</strong>",
    linkedin: "https://www.linkedin.com/in/temitope-adenuga-b18227a3/"
  }
];

export default AboutPage;
