'use client';

import React, { useState } from 'react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import styles from './DataInsights.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Globe, X, Mail, ChevronDown, Activity, BarChart3, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const VaccinationDonut = dynamic(() => import('@/components/charts/VaccinationDonut'), { ssr: false });
const CompletionsBar = dynamic(() => import('@/components/charts/CompletionsBar'), { ssr: false });
const ImpactLine = dynamic(() => import('@/components/charts/ImpactLine'), { ssr: false });

const CustomSelect = ({ options, placeholder }: { options: string[], placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className={styles.customSelectWrapper}>
      <div 
        className={styles.customSelectTrigger}
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
                className={styles.customSelectOption}
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

const DataInsightsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMember, setSelectedMember] = useState<typeof researchTeamMembers[0] | null>(null);

  const tabs = [
    {
      title: "Service Delivery",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYWYxYmZmZDQtMGRlOC00NzlhLTkzMjYtMDhhZjQ4NWUxY2NiIiwidCI6ImNkOWNiOGVjLWU2MjEtNDcyYS05NzlhLTU0OWFiNWJhMjQ3MCIsImMiOjF9",
      height: 1050,
      showLogos: true,
    },
    {
      title: "E-learning",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMTMxMmFkYWYtYTUyOS00NjFlLWI2ZjYtNGNjZTUyMWY3N2I0IiwidCI6ImNkOWNiOGVjLWU2MjEtNDcyYS05NzlhLTU0OWFiNWJhMjQ3MCIsImMiOjF9",
      height: 1450,
      showLogos: true,
    },
    {
      title: "Learner Exit Survey – APhA",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNzEwNjdmYjEtYTQ2ZS00OWI5LTliOTItNzRkY2FkZjJjYTRkIiwidCI6ImNkOWNiOGVjLWU2MjEtNDcyYS05NzlhLTU0OWFiNWJhMjQ3MCIsImMiOjF9",
      height: 2100,
      showLogos: true,
    },
    {
      title: "Learner Exit Survey – PSI",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOTcwNTNlYTgtZTJkYi00OTY3LTgzNTktODg0MjU2NjA5NjdlIiwidCI6ImNkOWNiOGVjLWU2MjEtNDcyYS05NzlhLTU0OWFiNWJhMjQ3MCIsImMiOjF9",
      height: 2400,
      showLogos: true,
    },
    {
      title: "Consumer Journey Map",
      url: "https://pharma-link-consumer-journey-maps.vercel.app/",
      height: 900,
      showLogos: false,
    },
  ];

  // Real data from Service Delivery Impact Dashboard (PowerBI)
  const donutData = [
    { label: 'TD Vaccine', value: 11340, color: '#6c30c0' },
    { label: 'HPV Vaccine', value: 6250, color: '#09a5b6' },
  ];

  const barData = [
    { quarter: 'Nigeria', completions: 8200 },
    { quarter: 'Kenya', completions: 5800 },
    { quarter: 'Ethiopia', completions: 3580 },
  ];

  const lineData = [
    { date: '2025-09-22', pharmacists: 0, patients: 0 },
    { date: '2025-10-01', pharmacists: 8, patients: 1200 },
    { date: '2025-11-01', pharmacists: 18, patients: 5400 },
    { date: '2025-12-01', pharmacists: 28, patients: 10900 },
    { date: '2026-01-01', pharmacists: 35, patients: 17580 },
  ];

  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.gridLinesContainer}>
        <div className={styles.gridLineInternal}></div>
        <div className={styles.gridLineInternal}></div>
        <div className={styles.gridLineInternal}></div>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroContent}
          >
            <span className={styles.eyebrow}>Data Insights</span>
            <h1 className={styles.title}>Data Insights</h1>
            <h2 className={styles.subtitle}>Driving Evidence into Action</h2>
          </motion.div>
        </div>
      </section>

      {/* Dashboards Section */}
      <section className={styles.dashboardSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Impact Dashboards</h2>
          <div className={styles.tabsContainer}>
            <div className={styles.tabsHeader}>
              {tabs.map((tab, i) => (
                <button 
                  key={i}
                  className={`${styles.tabButton} ${activeTab === i ? styles.active : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.tabContent}
            >
              <div className={styles.iframeContainer} style={{ height: tabs[activeTab].height }}>
                <iframe
                  src={tabs[activeTab].url}
                  className={styles.iframe}
                  title={tabs[activeTab].title}
                  allowFullScreen
                />
              </div>
              {tabs[activeTab].showLogos && (
                <div className={styles.partnerLogos}>
                  <div className={styles.logoBox}>
                    <Image src="https://pharmalinkhealth.com/wp-content/uploads/2025/09/Takeda_idUdjJ8WQa_0.svg" alt="Takeda" fill className={styles.logoImage} />
                  </div>
                  <div className={styles.logoBox}>
                    <Image src="https://pharmalinkhealth.com/wp-content/uploads/2025/09/Apha_logo.svg" alt="APhA" fill className={styles.logoImage} />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Visuals Section */}
      <section className={styles.chartsSection}>
        <div className={styles.chartsSectionLines} aria-hidden="true">
          <div className={styles.chartsSectionLine} />
          <div className={styles.chartsSectionLine} />
          <div className={styles.chartsSectionLine} />
        </div>
        <div className={styles.container}>
          <div className={styles.chartsHeader}>
            <span className={styles.chartEyebrow}>Performance Metrics</span>
            <h2 className={styles.chartMainHeading}>Impact at a Glance</h2>
          </div>
          
          <div className={styles.chartsGrid}>
            <motion.div 
              className={styles.chartCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.chartIcon}><Activity size={20} /></div>
              <h3 className={styles.chartTitle}>Vaccine Delivery</h3>
              <p className={styles.chartDescription}>17,580 doses delivered — 6,250 HPV (35.5%) and 11,340 TD (64.5%) across 3 countries.</p>
              <VaccinationDonut data={donutData} />
            </motion.div>

            <motion.div 
              className={styles.chartCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className={styles.chartIcon}><BarChart3 size={20} /></div>
              <h3 className={styles.chartTitle}>Vaccines by Country</h3>
              <p className={styles.chartDescription}>Total doses delivered across 35 pharmacies in Nigeria, Kenya and Ethiopia.</p>
              <CompletionsBar data={barData} />
            </motion.div>

            <motion.div 
              className={styles.chartCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.chartIcon}><TrendingUp size={20} /></div>
              <h3 className={styles.chartTitle}>Programme Ramp-up</h3>
              <p className={styles.chartDescription}>Growth since launch (22 Sept 2025) — 35 pharmacies across 20 regions, 17,580 vaccines to date.</p>
              <ImpactLine data={lineData} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Why It Matters</p>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionHeader}>
              <h2>Visibility is<br/>Credibility</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>We turn clinical activity into verifiable impact. PharmaLink dashboards provide the transparent evidence needed to secure trust, responsibility, and long-term funding.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionHeader}>
              <h2>Real-time<br/>Evidence</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Every interaction builds proof. From course completions to life-saving vaccinations, we aggregate data across five dimensions to show exactly where your program is succeeding.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionHeader}>
              <h2>Built for<br/>Trust</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Our aggregated data model protects privacy while delivering a clear, credible picture that funders and partners can rely on with absolute confidence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionHeader}>
              <h2>Data to<br/>Decisions</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Measurement is a strategic asset. We move beyond reporting to enable the decisions that refine content, support communities, and turn pharmacy investment into undeniable fact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Team Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionHeader}>
              <h2>Research & Innovation</h2>
            </div>
            <div className={styles.sectionBody}>
              <p className={styles.leadText}>
                <strong>Evidence-Led Healthcare.</strong> Our team combines epidemiology and implementation science to turn clinical data into <strong>global health innovation</strong>.
              </p>
              <div className={styles.teamGrid}>
                {researchTeamMembers.map((member, i) => (
                  <div key={i} className={styles.teamCard} onClick={() => setSelectedMember(member)}>
                    <div className={styles.memberImage}>
                      {member.image ? (
                        <Image 
                          src={member.image} 
                          alt={member.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Users size={32} />
                      )}
                    </div>
                    <div className={styles.memberInfo}>
                      <h3 className={styles.memberName}>{member.name}</h3>
                      <p className={styles.memberRole}>{member.role}</p>
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

      <Footer />
    </main>
  );
};

const TeamMemberModal = ({ member, onClose }: { member: typeof researchTeamMembers[0], onClose: () => void }) => {
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
            <p className={styles.modalTagline}>{member.role}</p>
            <div className={styles.modalBio}>
              {member.bio.split('\n\n').map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
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
            <h3 className={styles.formTitle}>Message {member.name.split(' ')[0]}</h3>
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
                Message {member.name.split(' ')[0]}
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

const researchTeamMembers = [
  {
    name: "Dr. Kristen Little",
    role: "Senior Research Advisor",
    location: "Global",
    image: "/images/data-and-research-team/pharmalink-dr-kirsten-little.webp",
    bio: "<strong>Dr. Kristen Little</strong> is a veteran <strong>PhD Epidemiologist</strong> and <strong>Senior Research Advisor</strong> at <strong>Population Services International (PSI)</strong>, bringing over <strong>15 years of experience</strong> in global public health research across more than 40 countries.\n\nFor over a decade at PSI, she has specialized in leading <strong>mixed-methods research</strong>, including <strong>implementation science</strong> and <strong>market access studies</strong> (consumer preference, willingness-to-pay). Dr. Little’s influential work spans critical public health areas, from contraceptive product innovations (Nexus Platform) to emerging self-care diagnostics (HPV self-collection, malaria self-tests) and vaccine journey mapping (Immunization at Scale Project).\n\nPassionate about embedding evidence-based learning, she maintains a strong record of research utilization with <strong>more than 50 peer-reviewed publications</strong>. Dr. Little holds a <strong>PhD in Public Health</strong> from the Johns Hopkins Bloomberg School of Public Health.",
    linkedin: "https://www.linkedin.com/in/kristen-little-60720115/",
    email: "info@pharmalinkhealth.com"
  },
  {
    name: "Eden Demise, MSc",
    role: "Research Advisor, PSI",
    location: "Global",
    image: "/images/data-and-research-team/PharmaLink-Eden-Demise.webp",
    bio: "<strong>Eden</strong> is a <strong>Research Advisor</strong> at <strong>Population Services International (PSI)</strong>, where she is a key contributor to <strong>implementation science</strong> research across a diverse portfolio of health areas.\n\nHer work focuses on generating evidence to improve the delivery of critical public health services, including <strong>pharmacy-based immunization</strong>, <strong>cervical cancer</strong>, <strong>self-care</strong> products, and <strong>sexual and reproductive health (SRH)</strong>.\n\nWith field experience spanning multiple contexts in <strong>Sub-Saharan Africa and South Asia</strong>, Eden is proficient in the full research lifecycle. Her expertise covers research design, field implementation, rigorous data analysis, and effective stakeholder engagement, resulting in successful program learning and the production of peer-reviewed publications.\n\nEden holds a Master’s degree in <strong>Global Health</strong> from Georgetown University.",
    linkedin: "https://www.linkedin.com/in/eden-demise/",
    email: "info@pharmalinkhealth.com"
  },
  {
    name: "Dr. Bekele Belayihun",
    role: "Director of Evidence & Learning, PSI",
    location: "Ethiopia",
    image: "/images/data-and-research-team/PharmaLink-Dr.-Bekele-Belayihun-1.webp",
    bio: "<strong>Dr. Bekele</strong> is a leading <strong>Public Health Researcher</strong> and <strong>Data Scientist</strong> with over 16 years of expertise in epidemiology, statistical modeling, and implementation science.\n\nAs <strong>Director of Evidence and Learning</strong> at <strong>Population Services International (PSI)</strong>, he leads decision-science initiatives and drives M&E innovations across global programs.\n\nTrained as a Biostatistician with a <strong>PhD in Health Studies</strong>, Dr. Bekele is recognized for his mastery of <strong>cost-effectiveness modeling</strong> and translating evidence into practical policy for projects including immunization, HPV, and SRH initiatives. He is a prolific author of over <strong>70 scientific publications</strong> and a recipient of the <strong>2022 Gold Medal for research excellence</strong>.",
    linkedin: "https://www.linkedin.com/in/bekele-belayihun-tefera-ph-d-752b652a/",
    email: "info@pharmalinkhealth.com"
  },
  {
    name: "Grace Ayo-Jatto, MPH",
    role: "Monitoring & Evaluation Manager, PSI Nigeria",
    location: "Nigeria",
    image: "/images/data-and-research-team/grace-ayo.webp",
    bio: "<strong>Grace (Oiza) Ayo‑Jatto</strong> is an accomplished <strong>Public Health Professional</strong> and <strong>Monitoring and Evaluation (M&E) Specialist</strong> with extensive experience in <strong>data analytics, visualization, and strategic information management</strong> within Nigeria’s health sector.\n\nAs <strong>Monitoring and Evaluation Manager at Population Services International (PSI) Nigeria</strong>, she leads efforts to strengthen data systems and enhance the use of timely, high‑quality analytics for program improvement and decision‑making. Grace also contributes to the <strong>Data.FI Project</strong>, where she applies her expertise in public health data analytics and visualization to support evidence‑based programming and system performance monitoring.\n\nHer experience spans roles in <strong>epidemiology, research and surveys, health informatics, TPM (Third‑Party Monitoring),</strong> and <strong>program evaluation</strong>. A <strong>microbiologist by training</strong>, Grace holds a <strong>Master of Public Health (MPH) in Epidemiology</strong> from <strong>Ahmadu Bello University</strong> and a <strong>B.Sc. in Microbiology</strong> from the <strong>University of Ilorin</strong>.",
    linkedin: "https://www.linkedin.com/in/grace-ayo-jatto-31b246a2/",
    email: "info@pharmalinkhealth.com"
  },
  {
    name: "Julius Njogu, MPH",
    role: "Evidence & Learning Advisor",
    location: "Kenya",
    image: "/images/data-and-research-team/PharmaLink-Julius-Njogu-Team-Member-Modal-Profile-Picture.webp",
    bio: "<strong>Julius Njogu</strong> is a distinguished Scholar, Epidemiologist, and health research veteran with over <strong>two decades of expertise</strong> spanning tropical medicine and public health across Kenya and the African region.\n\nHe currently leads the research and learning agenda for the <strong>Accelerate Project</strong>, which focuses on integrating Sexual and Reproductive Health and Rights (SRHR) and Gender-Based Violence (GBV) interventions across 13 underserved counties in Kenya. Concurrently, he is advancing evidence for <strong>pharmacy-based immunization approaches</strong> and pioneering research for <strong>self-care contraception solutions</strong>.\n\nThrough his extensive research portfolio, Mr. Njogu has contributed significantly to national and global health policy discourse. His scholarly articles focus specifically on high-impact areas such as Malaria, SRHR, and GBV. He holds a Bachelor’s degree in Nursing Sciences, a Master’s in Public Health (Epidemiology), and is currently earning a doctorate degree.",
    email: "info@pharmalinkhealth.com"
  },
  {
    name: "Judy Mwangi, MSc",
    role: "Senior Regional Advisor (M&E), PSI",
    location: "Kenya",
    image: "/images/data-and-research-team/Judy-Mwangi.webp",
    bio: "<strong>Judy Mwangi</strong> is a <strong>Senior Regional Advisor (M&E)</strong> at <strong>Population Services International (PSI) Nairobi</strong>, with over <strong>18 years’ experience</strong> strengthening <strong>M&E systems</strong> across <strong>15+ countries</strong>. She provides <strong>technical leadership</strong> in <strong>M&E planning, budgeting, data management, quality assurance,</strong> and <strong>data use for decision-making,</strong> leveraging <strong>digital tools</strong> including <strong>DHIS2, ODK, and Power BI.</strong>\n\nJudy has been instrumental in <strong>designing digital data systems</strong> and promoting <strong>routine data review and learning</strong> with <strong>Ministries of Health, PSI country platforms,</strong> and <strong>implementing partners.</strong> Her expertise spans <strong>data quality assurance, performance monitoring,</strong> and <strong>strategic oversight,</strong> ensuring evidence-based decision-making.\n\nWithin the <strong>PBID Project,</strong> she oversees <strong>data management, data quality,</strong> and <strong>performance monitoring</strong> across <strong>Kenya, Nigeria, and Ethiopia</strong> to enhance <strong>service quality</strong> and <strong>health outcomes.</strong> She holds an <strong>MSc in Public Health Promotion</strong> from the <strong>London School of Hygiene and Tropical Medicine</strong> and a <strong>Postgraduate Diploma in Monitoring and Evaluation Studies</strong> from <strong>Stellenbosch University.</strong>",
    linkedin: "https://www.linkedin.com/in/betty-abera-0b7b4b59/",
    email: "jmwangi@psi.org"
  },
  {
    name: "Wycliffe Waweru, MPH",
    role: "Head of Digital Health, PSI",
    location: "Kenya",
    image: "/images/data-and-research-team/Wycliffe-Waweru-MPH.webp",
    bio: "<strong>Wycliffe Waweru</strong> is a seasoned <strong>Digital Health Leader</strong> with over <strong>20 years of experience</strong> advancing technology-driven solutions to strengthen health systems and improve outcomes across low- and middle-income countries.\n\nAs <strong>Head of Digital Health at Population Services International (PSI)</strong>, he leads the integration of <strong>technology and data analytics</strong> into global health programs, driving innovation, system performance, and data-informed decision-making. Wycliffe collaborates with <strong>governments, development partners, and private-sector organizations</strong> to design and scale <strong>sustainable, interoperable digital health solutions</strong> that enhance service delivery and program impact.\n\nHis expertise spans <strong>digital health strategy, health information systems, data analytics,</strong> and <strong>technology-enabled service delivery</strong>, positioning him as a leading voice in the digital transformation of health systems. Wycliffe holds a <strong>Master of Science in Public Health</strong> from the <strong>London School of Hygiene and Tropical Medicine</strong>.",
    linkedin: "https://www.linkedin.com/in/wycliffewaweru/",
    email: "info@pharmalinkhealth.com"
  }
];

export default DataInsightsPage;
