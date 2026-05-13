"use client";

import React from 'react';
import styles from './FooterCTA.module.css';
import { ArrowRight, ChevronRight, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

const DynamicArrow = ({ size = 16, className = "" }) => (
  <div className={`${styles.dynamicArrow} ${className}`}>
    <ChevronRight size={size} className={styles.chevronIcon} />
    <ArrowRight size={size} className={styles.arrowIcon} />
  </div>
);

interface FooterCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

const FooterCTA = ({
  title = 'Ready to get started?',
  subtitle = 'Start equipping your practice instantly, or reach out to design a custom solution that helps your pharmacy do more for your community.',
  buttonText = 'Start now',
  buttonHref,
}: FooterCTAProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.text}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{subtitle}</p>
          </div>
          <div className={styles.actions}>
            {buttonHref ? (
              <Link href={buttonHref} className={styles.primaryBtn}>
                {buttonText}
                <DynamicArrow />
              </Link>
            ) : (
              <button className={styles.primaryBtn}>
                {buttonText}
                <DynamicArrow />
              </button>
            )}
            <button className={styles.secondaryBtn}>
              Got Questions?
              <DynamicArrow />
            </button>
          </div>
        </div>

        <div className={styles.features}>
          <Link href="/network" className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Users size={20} className={styles.icon} />
            </div>
            <h3 className={styles.featureTitle}>Join the Expanding Network</h3>
            <p className={styles.featureSubtitle}>
              <span className={styles.noWrap}>
                Built by the Sector. <span className={styles.brandPurpleLight}>Built for the Sector.</span>
              </span>
            </p>
            <p className={styles.featureDescription}>
              We are a digital ecosystem empowering African pharmacists with clinical training, peer networking, and real-time data intelligence.
            </p>
            <div className={styles.link}>
              Join the Network
              <DynamicArrow size={14} className={styles.linkArrow} />
            </div>
          </Link>

          <Link href="/academy" className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <GraduationCap size={20} className={styles.icon} />
            </div>
            <h3 className={styles.featureTitle}>Certified Clinical Training</h3>
            <p className={styles.featureSubtitle}>Lead the Sector.</p>
            <p className={styles.featureDescription}>
              Study internationally recognised qualifications with thousands of healthcare heroes across the continent.
            </p>
            <div className={styles.link}>
              Explore Courses
              <DynamicArrow size={14} className={styles.linkArrow} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
