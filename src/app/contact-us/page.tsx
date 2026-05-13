"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import styles from './Contact.module.css';
import Link from 'next/link';
import CountrySelect from '@/components/shared/CountrySelect';

const HoverArrow = () => (
  <svg className={styles.HoverArrow} viewBox="0 0 10 10" aria-hidden="true">
    <g fillRule="evenodd">
      <path className={styles.HoverArrow__linePath} d="M0 5h7" />
      <path className={styles.HoverArrow__tipPath} d="M1 1l4 4-4 4" />
    </g>
  </svg>
);

const offices = [
  {
    id: 'global-hq',
    name: 'Washington, DC\n(Global HQ)',
    address: ['PharmaLink,', '1120 19th St NW, Suite 600,', 'Washington, DC 20036', 'United States'],
    mapSrc: 'https://maps.google.com/maps?q=1120%2019th%20St%20NW%2C%20Washington%2C%20DC%2020036%2C%20USA&t=m&z=16&output=embed&iwloc=near',
    emailLink: 'mailto:info@pharmalinkhealth.com',
    phoneLink: '#',
    chatLink: '#',
  },
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    address: ['Addis Ababa', 'Ethiopia'],
    mapSrc: 'https://maps.google.com/maps?q=XQPW%2B5G%20Addis%20Ababa%2C%20Ethiopia&t=m&z=16&output=embed&iwloc=near',
    emailLink: 'mailto:info@pharmalinkhealth.com',
    phoneLink: 'tel:+251929918351',
    chatLink: '#',
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    address: ['House 8 Patrick. O. Bokkor Cres,', 'Jabi, Abuja 900108,', 'Federal Capital Territory, Nigeria'],
    mapSrc: 'https://maps.google.com/maps?q=House%208%20Patrick.%20O.%20Bokkor%20Cres%2C%20Jabi%2C%20Abuja%20900108%2C%20Federal%20Capital%20Territory%2C%20Nigeria&t=m&z=16&output=embed&iwloc=near',
    emailLink: 'mailto:info@pharmalinkhealth.com',
    phoneLink: '#',
    chatLink: '#',
  },
  {
    id: 'kenya',
    name: 'Kenya',
    address: ['28 School Ln,', 'Nairobi, Kenya'],
    mapSrc: 'https://maps.google.com/maps?q=28%20School%20Ln%2C%20Nairobi%2C%20Kenya&t=m&z=16&output=embed&iwloc=near',
    emailLink: 'mailto:info@pharmalinkhealth.com',
    phoneLink: 'tel:+254204440125',
    chatLink: '#',
  }
];

export default function ContactPage() {
  const [activeTab, setActiveTab] = React.useState('global-hq');

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.heroBackground}></div>
      <div className={styles.gradientOverlay} />
      <div className={styles.gridLinesContainer}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.line}></div>
        ))}
      </div>
      
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>Contact Us</h1>
          <h2 className={styles.subtitleTitle}>Get in Touch with PharmaLink</h2>
          <p className={styles.subtitle}>
            We&apos;d love to hear from you. Whether you&apos;re interested in partnering, have a question, or simply want to learn more—please fill out the form below, and our team will be in touch, or send your mail directly to{" "}
            <a href="mailto:info@pharmalinkhealth.com" style={{ color: "var(--hds-color-core-secondary-500)", textDecoration: "none" }}>info@pharmalinkhealth.com</a>.
          </p>
        </motion.div>
      </section>

      <section className={styles.contentContainer}>
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Work Email</label>
              <input 
                type="email" 
                id="email" 
                className={styles.input} 
                placeholder="jane@company.com" 
                autoComplete="email"
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                className={styles.input} 
                placeholder="Jane Doe" 
                autoComplete="name"
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="organization" className={styles.label}>Organization / Institution</label>
              <input 
                type="text" 
                id="organization" 
                className={styles.input} 
                placeholder="Hospital, Ministry, or Company" 
                autoComplete="organization"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>Country</label>
                <CountrySelect id="country" name="country" variant="contact" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className={styles.input}
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea 
                id="message" 
                className={styles.textarea} 
                placeholder="How can PharmaLink help you?" 
                required
              ></textarea>
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="consent" className={styles.checkboxInput} defaultChecked />
              <label htmlFor="consent" className={styles.checkboxLabel}>I consent to receiving communication from PharmaLink.</label>
            </div>
            
            <div className={styles.formFooter}>
              <button type="submit" className={styles.submitBtn}>Connect with our Team</button>
              <div className={styles.formTrustLayer}>
                <p className={styles.trustNote}>Typically responds within 24 hours.</p>
                <div className={styles.socialProof}>
                  <div className={styles.avatars}>
                    <div className={styles.avatar}></div>
                    <div className={styles.avatar}></div>
                    <div className={styles.avatar}></div>
                  </div>
                  <span>Trusted by Multinational Pharmaceutical Partners, Governmental Health Ministries and thousands of CPE Learners.</span>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        <motion.div 
          className={styles.infoColumn}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.infoCard}>
            <h3>
              <div className={styles.infoCardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              Partnerships
            </h3>
            <p>Interested in partnering, sponsoring, or donating? Let's create impact together.</p>
            <Link href="#" className={styles.infoCardBtn}>Contact us <HoverArrow /></Link>
          </div>

          <div className={styles.infoCard}>
            <h3>
              <div className={styles.infoCardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              Help & support
            </h3>
            <p>Get in touch and let us know how we can help.</p>
            <Link href="#" className={styles.infoCardBtn}>Get support <HoverArrow /></Link>
          </div>

          <div className={styles.infoCard}>
            <h3>
              <div className={styles.infoCardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              Media & Press
            </h3>
            <p>Get PharmaLink news, company info, and media resources.</p>
            <Link href="#" className={styles.infoCardBtn}>Visit newsroom <HoverArrow /></Link>
          </div>

          <div className={styles.infoLinksList}>
            <div className={styles.infoLinkItem}>
              <h4>Join us on Discord</h4>
              <p>If you have technical questions, chat live with developers in the official <Link href="#">PharmaLink Discord server</Link></p>
            </div>
            <div className={styles.infoLinkItem}>
              <h4>General communications</h4>
              <p>For general queries, including partnership opportunities, please <Link href="#">contact support for help</Link></p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className={styles.officesContainer}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.officesLayout}>
            <div className={styles.verticalTabsList}>
              {offices.map(office => (
                <button
                  key={office.id}
                  className={`${styles.verticalTabBtn} ${activeTab === office.id ? styles.activeVerticalTab : ''}`}
                  onClick={() => setActiveTab(office.id)}
                >
                  <div className={styles.verticalTabName}>{office.name}</div>
                  {activeTab === office.id && office.address && (
                    <div className={styles.verticalTabDetails}>
                      {office.address.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                      <span className={styles.viewMapLink}>View Map</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className={styles.officeContentArea}>
              {offices.map(office => activeTab === office.id && (
                <div key={office.id} className={styles.officePane}>
                  <div className={styles.mapWrapper}>
                    <iframe 
                      loading="lazy" 
                      src={office.mapSrc} 
                      className={styles.mapIframe}
                      title={office.name}
                    ></iframe>
                  </div>
                </div>
              ))}
              
              <div className={styles.contactCardsGrid}>
                {offices.map(office => activeTab === office.id && (
                  <React.Fragment key={`cards-${office.id}`}>
                    <div className={styles.contactCard}>
                      <div className={styles.contactCardHeader}>
                        <div className={styles.contactCardIcon}>@</div>
                        <h4>Email</h4>
                      </div>
                      <p>Interested in partnering, joining, sponsoring, or donating? Contact PharmaLink today—together, we can make a difference.</p>
                      <a href={office.emailLink} className={styles.contactCardBtn}>Email PharmaLink</a>
                    </div>
                    
                    <div className={styles.contactCard}>
                      <div className={styles.contactCardHeader}>
                        <div className={styles.contactCardIcon}>
                          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path></svg>
                        </div>
                        <h4>Phone</h4>
                      </div>
                      <p>Questions or want to partner, donate, sponsor, or join PharmaLink? Call us today—let’s create impact together!</p>
                      <a href={office.phoneLink} className={styles.contactCardBtn}>Call PharmaLink</a>
                    </div>
                    
                    <div className={styles.contactCard}>
                      <div className={styles.contactCardHeader}>
                        <div className={styles.contactCardIcon}>
                          <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"></path></svg>
                        </div>
                        <h4>Live Chat</h4>
                      </div>
                      <p>Chat with PharmaLink today for partnerships, sponsorships, donations, press inquiries, or any questions you have.</p>
                      <a href={office.chatLink} className={styles.contactCardBtn}>PharmaLink Chat</a>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
