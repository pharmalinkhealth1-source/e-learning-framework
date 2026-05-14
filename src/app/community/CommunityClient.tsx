"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TactileButton } from '@/components/stripe/TactileButton';
import { StripeInput } from '@/components/stripe/StripeUI';
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarAddButton } from "@/components/base/avatar/base-components";
import { SpotlightCarousel, type Spotlight } from '@/components/community/SpotlightCarousel';
import { TrendingUp, MessageSquare } from 'lucide-react';
import styles from './page.module.css';

interface Discussion {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  date: string;
  replies: number;
}

interface Member {
  name: string;
  role: string;
  location: string;
  initials: string;
}

interface CommunityClientProps {
  categories: string[];
  discussions: Discussion[];
  stats: { number: string; label: string }[];
  members: Member[];
  spotlights: Spotlight[];
}

export default function CommunityClient({ categories, discussions, stats, members, spotlights }: CommunityClientProps) {
  const [activeCategory, setActiveCategory] = useState("All Discussions");

  const filteredDiscussions = activeCategory === "All Discussions" 
    ? discussions 
    : discussions.filter(d => d.category === activeCategory);

  return (
    <main className={styles.main}>
      {/* Background Elements */}
      <div className={styles.gradientOverlay} />
      <div className={styles.heroBackground} />
      
      {/* Community Stats Bar */}
      <div className={styles.container} style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        <div className={styles.statsBar}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Discussions */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div 
            className={styles.segmentedControl}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className={styles.segmentedControlInner}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.segmentedButton} ${activeCategory === cat ? styles.segmentedButtonActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest Discussions</h2>
            <TactileButton variant="primary" href="/forum">
              Start a Discussion
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </TactileButton>
          </div>

          <div className={styles.discussionsGrid}>
            {filteredDiscussions.map((discussion, i) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              >
                <Link href={`/forum`} className={styles.discussionCard}>
                  <span className={styles.cardBadge}>{discussion.category}</span>
                  <h3 className={styles.cardTitle}>{discussion.title}</h3>
                  <p className={styles.cardExcerpt}>{discussion.excerpt}</p>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.authorInfo}>
                      <div className={styles.avatar}>{discussion.initials}</div>
                      <div className={styles.authorDetails}>
                        <span className={styles.authorName}>{discussion.author}</span>
                        <span className={styles.postDate}>{discussion.date}</span>
                      </div>
                    </div>
                    <div className={styles.replyCount}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 10.6667C14 11.0203 13.8595 11.3594 13.6095 11.6095C13.3594 11.8595 13.0203 12 12.6667 12H4.66667L2 14.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10.6667Z" stroke="#6c30c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {discussion.replies}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Members Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Community Members</h2>
            <TactileButton variant="secondary" href="/directory">
              View All Members
            </TactileButton>
          </div>
          
          <div className={styles.membersGrid}>
            {members.map((member, i) => (
              <motion.div 
                key={i} 
                className={styles.memberCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={styles.memberAvatar}>{member.initials}</div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
                <div className={styles.memberLocation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {member.location}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Member Spotlights Section */}
      <section className={styles.spotlightSection}>
        <div className={styles.container}>
          <div className={styles.splitContainer}>
            <motion.div 
              className={styles.splitLeft}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.eyebrow}>Member Spotlights</span>
              <h2 className={styles.sectionTitle}>
                Discover Real Journeys and Achievements from Pharmacists Across Africa
              </h2>
              <p className={styles.descriptionText}>
                Celebrate the journeys, achievements, and lasting impact of pharmacists throughout our community. In this forum, we shine a spotlight on inspiring member stories, recognize meaningful career milestones, and showcase real-world successes that demonstrate the true power of connection, growth, and innovation in pharmacy.
              </p>
              
              <div className={styles.buttonGroup}>
                <TactileButton variant="primary" href="/member-spotlights">
                  <TrendingUp size={18} style={{ marginRight: '8px' }} />
                  Read Success Stories
                </TactileButton>
                <TactileButton variant="secondary" href="/forum">
                  <MessageSquare size={18} style={{ marginRight: '8px' }} />
                  Join the Community Forum
                </TactileButton>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.splitRight}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SpotlightCarousel spotlights={spotlights} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className={styles.joinSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.joinContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Social Proof Avatar Stack */}
            <div className={styles.socialProof}>
              <div className={styles.avatarStack}>
                <Avatar size="sm" className={styles.avatarOverlap} src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100" />
                <Avatar size="sm" className={styles.avatarOverlap} src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100" />
                <Avatar size="sm" className={styles.avatarOverlap} src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=100" />
                <Avatar size="sm" className={styles.avatarOverlap} src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100" />
                <Avatar size="sm" className={styles.avatarOverlap} src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100" />
                <Avatar size="sm" className={styles.avatarOverlap} src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100" />
                <Avatar size="sm" className={styles.avatarOverlap} src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=100" />
                <div className={styles.avatarOverlap} style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#f1eafd', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  color: '#6c30c0',
                  border: '2px solid white',
                  zIndex: 10,
                  marginLeft: '-10px'
                }}>+2k</div>
                <AvatarAddButton size="sm" className={styles.avatarOverlap} />
              </div>
              <span className={styles.membershipText}>Join 2,400+ pharmaceutical professionals</span>
            </div>

            <h2 className={styles.joinTitle}>Ready to Join the Conversation?</h2>
            <p className={styles.joinSubtitle}>Get the latest updates on pharmaceutical innovation and connect with peers across Africa.</p>
            <div className={styles.inlineForm}>
              <StripeInput type="email" placeholder="Email address" className={styles.emailInput} />
              <TactileButton variant="primary" className={styles.joinBtn}>Subscribe</TactileButton>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
