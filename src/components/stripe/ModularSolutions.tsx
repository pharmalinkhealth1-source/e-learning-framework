"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './ModularSolutions.module.css';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import DataMorphChart from './DataMorphChart';
import ForumGraphic from './ForumGraphic';
import InsightsGradient from './InsightsGradient';
import NetworkJoinGraphic from './NetworkJoinGraphic';

import Link from 'next/link';

interface BentoCardProps {
  className?: string;
  onClick?: () => void;
  href?: string;
  children?: React.ReactNode;
}

const BentoCard = ({ className, onClick, href, children }: BentoCardProps) => {
  const cardRef = useRef<any>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = useCallback((e: React.MouseEvent<any>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const shiftX = deltaX * -5;
    const shiftY = deltaY * -4;
    const growX = Math.abs(deltaX) * 5;
    const growY = Math.abs(deltaY) * 4;

    const mouseX = x - centerX;
    const mouseY = y - centerY;

    setStyle({
      '--card-mouse-x': `${mouseX}px`,
      '--card-mouse-y': `${mouseY}px`,
      '--card-shift-x': `${shiftX}px`,
      '--card-shift-y': `${shiftY}px`,
      '--card-grow-x': `${growX}px`,
      '--card-grow-y': `${growY}px`,
    } as React.CSSProperties);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      '--card-shift-x': '0px',
      '--card-shift-y': '0px',
      '--card-grow-x': '0px',
      '--card-grow-y': '0px',
    } as React.CSSProperties);
  }, []);

  const sharedProps = {
    ref: cardRef,
    className: `${styles.bentoCard} ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    role: "button",
    tabIndex: 0,
    style: {
      ...style,
      cursor: href || onClick ? 'pointer' : 'default'
    }
  };

  const cardInnerContent = (
    <>
      <div className={styles.dialogEntry}>
        <div className={styles.dialogEntryWrapper}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M13.75 6.75L10.25 6.75L10.25 5L15.5 5L15.5 10.25L13.75 10.25L13.75 6.75Z" />
            <path d="M6.75 10.25L5 10.25L5 15.5L10.25 15.5L10.25 13.75L6.75 13.75L6.75 10.25Z" />
          </svg>
        </div>
      </div>

      <div className={styles.cardBorder}>
        <div className={styles.borderColor}>
          <div className={styles.borderColorGradient} />
        </div>
      </div>

      <div className={styles.cardInner} />
      <div className={styles.cardContent}>
        {children}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} {...sharedProps}>
        {cardInnerContent}
      </Link>
    );
  }

  return (
    <div 
      onClick={onClick} 
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      {...sharedProps}
    >
      {cardInnerContent}
    </div>
  );
};

const MEMBER_POOL = [
  "082_LOS", "044_ABV", "091_NBO", "012_ADD", 
  "056_JHB", "031_CPT", "077_ACC", "099_LGS",
  "023_KGL", "045_DAR", "067_LUN", "088_HRE",
  "104_DKR", "112_KRT", "095_NIM", "084_CAS"
];

const RotatingMemberTag = ({ 
  initialId, 
  style, 
  intervalRange = [5000, 10000] 
}: { 
  initialId: string, 
  style: React.CSSProperties,
  intervalRange?: [number, number]
}) => {
  const [memberId, setMemberId] = useState(initialId);
  const [isVisible, setIsVisible] = useState(true);

  const [pulseDelay, setPulseDelay] = useState<string | undefined>(undefined);

  useEffect(() => {
    setPulseDelay(`${Math.random() * 2}s`);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const rotate = () => {
      const nextInterval = Math.random() * (intervalRange[1] - intervalRange[0]) + intervalRange[0];
      
      timeoutId = setTimeout(() => {
        // Pop away
        setIsVisible(false);
        
        // Wait 1 second (as requested) then replace with new ID
        setTimeout(() => {
          const filteredPool = MEMBER_POOL.filter(id => id !== memberId);
          const newId = filteredPool[Math.floor(Math.random() * filteredPool.length)];
          setMemberId(newId);
          setIsVisible(true);
          rotate();
        }, 1000);
      }, nextInterval);
    };

    rotate();
    return () => clearTimeout(timeoutId);
  }, [memberId, intervalRange]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          key={memberId}
          className={styles.memberTag} 
          style={style}
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          exit={{ 
            scale: 0.5, 
            opacity: 0, 
            y: -10,
            transition: { duration: 0.4, ease: "easeIn" }
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
          }}
        >
          <span 
            className={styles.pulseDot} 
            style={{ animationDelay: pulseDelay }}
          ></span>
          NW: MEMBER {memberId}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ModularSolutions = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8, 1],
    ["rgba(248, 243, 255, 0)", "rgba(248, 243, 255, 0.1)", "rgba(248, 243, 255, 0.3)", "rgba(248, 243, 255, 1)"]
  );

  return (
    <section ref={sectionRef} className={`${styles.section} ${styles.sectionWhite}`}>
      <motion.div 
        className={styles.modularSolutionsBg} 
        style={{ backgroundColor: bgColor }}
        aria-hidden="true" 
      />
      <div className={`${styles.sectionContainer} ${styles.sectionRow} ${styles.sectionRowGap}`}>
        <div className={`${styles.sectionTitle} ${styles.sectionTitleSpan8}`}>
          <h2 className={`${styles.hdsHeading} ${styles.hdsHeadingLg} ${styles.noWrap}`}>
            <span className={styles.brandPurpleDark}>Built by the Sector.</span>
            <span className={styles.brandPurpleLight}> Built for the Sector.</span>
          </h2>
          <p className={styles.sectionDescription}>
            PharmaLink provides a suite of professional tools designed to scale your impact, from individual career growth to expansive healthcare business networks.
          </p>
        </div>
        
        <div className={styles.bentoGrid}>
          <BentoCard 
            className={styles.cardPayments}
            href="/network"
          >
            <div className={styles.cardPaymentsContent}>
               <h3 className={styles.cardTitle}>A Unified Network for All Healthcare Partners</h3>
               <p className={styles.cardDescription}>
                 Join a global ecosystem where individual pharmacists, private sectors, and health departments coordinate care and expand professional reach.
               </p>
               <div className={styles.graphicContainer}>
                 <NetworkJoinGraphic />
               </div>
            </div>
          </BentoCard>

          <BentoCard 
            className={styles.cardCommunity}
            href="/forum"
          >
            <div className={styles.cardCommunityContent}>
              <div className={styles.communityTag}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Community
              </div>
              
              <h3 className={styles.communityTitle}>
                Your Profession. <span className={styles.communityTitleAccent}>Connected.</span>
              </h3>
              
              <p className={styles.communityDescription}>
                Join a growing network of pharmacists and private sector providers across Africa. Share experiences, ask questions, access peer support, and stay current on the issues that shape your practice.
              </p>

              <div className={styles.communityGraphicContainer}>
                <ForumGraphic />
              </div>

              <div className={styles.communityCTA}>
                Join The Forum
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </BentoCard>

          <BentoCard 
            className={styles.cardNetwork}
            href="/network"
          >
            <div className={styles.cardNetworkContent}>
              <div className={styles.networkTopContent}>
                <div className={styles.networkTag}>
                  <MapPin size={14} />
                  Clinical Network
                </div>
                <h3 className={styles.networkTitle}>
                  Connect with peak performers <span className={styles.networkTitleMuted}>across the African medical landscape.</span>
                </h3>
              </div>

              <div className={styles.networkGraphicContainer}>
                {/* Member Pills - Positioned relative to the graphic container */}
                <RotatingMemberTag 
                  initialId="082_LOS" 
                  style={{ top: '48%', left: '15%' }} 
                  intervalRange={[5000, 8000]}
                />
                <RotatingMemberTag 
                  initialId="044_ABV" 
                  style={{ top: '40%', left: '22%' }} 
                  intervalRange={[7000, 11000]}
                />
                <RotatingMemberTag 
                  initialId="091_NBO" 
                  style={{ top: '32%', right: '0%' }} 
                  intervalRange={[6000, 10000]}
                />
                <RotatingMemberTag 
                  initialId="012_ADD" 
                  style={{ top: '22%', right: '4%' }} 
                  intervalRange={[8000, 13000]}
                />

                <div className={styles.africaMapContainer}>
                  <div className={styles.africaMap}></div>
                </div>

                <div className={styles.avatarStack}>
                  <div className={styles.avatarItem}>
                    <img src="/images/avatars/female-1.png" alt="Pharmacist" className={styles.avatarImage} />
                  </div>
                  <div className={styles.avatarItem}>
                    <img src="/images/avatars/male-1.png" alt="Pharmacist" className={styles.avatarImage} />
                  </div>
                  <div className={styles.avatarItem}>
                    <img src="/images/avatars/female-2.png" alt="Pharmacist" className={styles.avatarImage} />
                  </div>
                  <div className={styles.avatarItem}>
                    <img src="/images/avatars/male-2.png" alt="Pharmacist" className={styles.avatarImage} />
                  </div>
                  <div className={styles.avatarItem}>
                    <img src="/images/avatars/female-3.png" alt="Pharmacist" className={styles.avatarImage} />
                  </div>
                  <div className={styles.plusBadge}>+2K</div>
                </div>
              </div>

              <div className={styles.networkFooter}>
                <div className={styles.networkCTA}>
                  JOIN THE EXPANDING NETWORK
                  <ArrowRight size={14} strokeWidth={3} />
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard 
            className={styles.cardInsights}
            href="/insights"
          >
            <InsightsGradient />
            <div className={styles.cardInsightsMask} />
            <div className={styles.cardInsightsContent}>
              <div className={styles.insightsTopContent}>
                <div className={styles.insightsTag}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
                  Data Insights
                </div>
                <div className={styles.insightsMainText}>
                  <h3 className={styles.insightsTitle}>
                    Impact You Can <span className={styles.insightsTitleAccent}>Measure.</span>
                  </h3>
                  <p className={styles.insightsDescription}>
                    Access program-level dashboards that track training outcomes, service delivery, and community reach.
                  </p>
                </div>
              </div>

              <div className={styles.insightsGraphicContainer}>
                <div className={styles.insightsGraphic}>
                  <DataMorphChart />
                </div>
              </div>

              <div className={styles.insightsCTA}>
                View Data
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </BentoCard>

          <BentoCard 
            className={styles.cardAcademy}
            href="/academy"
          >
            <div className={styles.cardAcademyContent}>
              <div className={styles.academyTopContent}>
                <div className={styles.academyTag}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2h10"></path><path d="M5 6h14"></path><rect width="18" height="12" x="3" y="10" rx="2"></rect></svg>
                  eLearning
                </div>
                <div className={styles.academyMainText}>
                  <h3 className={styles.academyTitle}>
                    Clinically Designed. <br /><span className={styles.academyTitleMuted}>Built for Practice.</span>
                  </h3>
                  <p className={styles.academyDescription}>
                    Advance your clinical skills, improve patient outcomes, and grow your career — all at your own pace.
                  </p>
                </div>
              </div>

              <div className={styles.academyGraphicContainer}>
                <div className={styles.academyGraphic}>
                  <div className={styles.academyGraphicFade} />
                  <div className={styles.notificationStack}>
                    {/* First Set - Delayed by an extra 1s to ensure visibility after bottom-edge entry */}
                    <div className={`${styles.notificationItem} ${styles.itemSuccess} ${styles.itemLeft}`} style={{ animationDelay: '-8s' }}>
                      <div className={styles.statusIcon} style={{ background: '#10b981' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          Course Completed
                          <span className={styles.notificationTime}>2h ago</span>
                        </div>
                        <p className={styles.notificationSubtext}>Advanced Clinical Management.</p>
                      </div>
                    </div>
                    <div className={`${styles.notificationItem} ${styles.itemInfo} ${styles.itemRight}`} style={{ animationDelay: '-5s' }}>
                      <div className={styles.statusIcon} style={{ background: '#3b82f6' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          CME Credit Applied
                          <span className={styles.notificationTime}>5h ago</span>
                        </div>
                        <p className={styles.notificationSubtext}>You earned 2.0 credits.</p>
                      </div>
                    </div>
                    <div className={`${styles.notificationItem} ${styles.itemAlert} ${styles.itemLeft}`} style={{ animationDelay: '-2s' }}>
                      <div className={styles.statusIcon} style={{ background: '#a855f7' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          Certificate Ready
                          <span className={styles.notificationTime}>1d ago</span>
                        </div>
                        <p className={styles.notificationSubtext}>Clinical Pharmacy cert available.</p>
                      </div>
                    </div>
                    <div className={`${styles.notificationItem} ${styles.itemInfo} ${styles.itemRight}`} style={{ animationDelay: '1s' }}>
                      <div className={styles.statusIcon} style={{ background: '#3b82f6' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          New Material Added
                          <span className={styles.notificationTime}>Just now</span>
                        </div>
                        <p className={styles.notificationSubtext}>Strategic Healthcare Leadership.</p>
                      </div>
                    </div>

                    {/* Duplicate Set for Seamless Loop */}
                    <div className={`${styles.notificationItem} ${styles.itemSuccess} ${styles.itemLeft}`} style={{ animationDelay: '4s' }}>
                      <div className={styles.statusIcon} style={{ background: '#10b981' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          Course Completed
                          <span className={styles.notificationTime}>2h ago</span>
                        </div>
                        <p className={styles.notificationSubtext}>Advanced Clinical Management.</p>
                      </div>
                    </div>
                    <div className={`${styles.notificationItem} ${styles.itemInfo} ${styles.itemRight}`} style={{ animationDelay: '7s' }}>
                      <div className={styles.statusIcon} style={{ background: '#3b82f6' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          CME Credit Applied
                          <span className={styles.notificationTime}>5h ago</span>
                        </div>
                        <p className={styles.notificationSubtext}>You earned 2.0 credits.</p>
                      </div>
                    </div>
                    <div className={`${styles.notificationItem} ${styles.itemAlert} ${styles.itemLeft}`} style={{ animationDelay: '10s' }}>
                      <div className={styles.statusIcon} style={{ background: '#a855f7' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          Certificate Ready
                          <span className={styles.notificationTime}>1d ago</span>
                        </div>
                        <p className={styles.notificationSubtext}>Clinical Pharmacy cert available.</p>
                      </div>
                    </div>
                    <div className={`${styles.notificationItem} ${styles.itemInfo} ${styles.itemRight}`} style={{ animationDelay: '13s' }}>
                      <div className={styles.statusIcon} style={{ background: '#3b82f6' }} />
                      <div className={styles.notificationText}>
                        <div className={styles.notificationHeader}>
                          New Material Added
                          <span className={styles.notificationTime}>Just now</span>
                        </div>
                        <p className={styles.notificationSubtext}>Strategic Healthcare Leadership.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.academyCTA}>
                Explore Courses
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </BentoCard>

          <BentoCard 
            className={styles.cardConnect}
            href="/join"
          >
             <motion.div 
               className={styles.connectBackgroundImage}
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 0.8, x: 0 }}
               viewport={{ once: true, amount: 0.3 }}
               transition={{ 
                 duration: 1.5, 
                 ease: [0.22, 1, 0.36, 1], // Custom cinematic easing
                 delay: 0.2
               }}
             />
             <div className={styles.cardConnectContent}>
                <h3 className={styles.cardTitle}>
                  Built by the Sector. <span className={styles.brandPurpleLight}>Built for the Sector.</span>
                </h3>
                <p className={styles.cardDescription}>
                  PharmaLink is a digital ecosystem built for pharmacists across Africa providing clinical training, peer connections, and real-time data intelligence.
                </p>
                <div className={styles.fullWidthCTA}>
                  Join the Network
                  <svg className={styles.ctaArrow} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
             </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default ModularSolutions;
