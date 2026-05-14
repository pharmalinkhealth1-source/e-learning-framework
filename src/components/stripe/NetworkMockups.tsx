'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './NetworkJoinGraphic.module.css';

export const PhoneMockup = () => {
  const [activePartner, setActivePartner] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const partners = [
    { name: 'Dr. Sarah Chen', role: 'Pharmacist', location: 'London' },
    { name: 'Public Health Dept', role: 'Partner', location: 'Nairobi' },
    { name: 'Green Cross', role: 'Private Clinic', location: 'Berlin' }
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      setCurrentTime(timeStr);
    };

    updateTime();
    const timeTimer = setInterval(updateTime, 1000 * 60);

    const timer = setInterval(() => {
      setActivePartner((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => {
      clearInterval(timer);
      clearInterval(timeTimer);
    };
  }, []);

  return (
    <div className={styles.phoneWrapper}>
      <div className={styles.phoneFrame}>
        <div className={styles.phoneSpeaker} />
        <div className={styles.phoneScreen}>
          <div className={styles.phoneHeader}>
            <div className={styles.phoneNotch} />
            <div className={styles.statusBar}>
              <div className={styles.statusLeft}>
                <div className={styles.time}>{currentTime || '9:41'}</div>
              </div>
              <div className={styles.statusRight}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 20h.01M7 20v-4m5 4V10m5 10V6m5 14V2"/></svg>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3"/><path d="M6 8V5a3 3 0 0 1 6 0v3"/></svg>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="10" x="2" y="7" rx="2"/><path d="M22 11v2"/></svg>
              </div>
            </div>
          </div>
          <div className={styles.phoneMap}>
            <div className={styles.phoneUrlBarFloating}>pharmalinkhealth.com</div>
            <AnimatePresence mode="popLayout">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={styles.mapPin}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.2, type: 'spring' }}
                  style={{ 
                    top: `${20 + (i * 15)}%`, 
                    left: `${15 + (i * 12)}%`,
                    background: i === activePartner ? '#4F2683' : '#7a4ab2'
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
          <motion.div 
            className={styles.phoneCard}
            key={activePartner}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar} />
              <motion.div 
                className={styles.avatarOrbit}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className={styles.avatarDot} />
              </motion.div>
            </div>
            <div className={styles.textLines}>
              <div className={styles.partnerName}>{partners[activePartner].name}</div>
              <div className={styles.partnerRole}>{partners[activePartner].role}</div>
            </div>
          </motion.div>
        </div>
        <div className={styles.phoneButton} />
      </div>
    </div>
  );
};

export const BrowserMockup = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const pages = [
    { url: '/community', label: 'Clinical Forum', id: 'community' },
    { url: '/data-insights', label: 'Analytics', id: 'insights' },
    { url: '/elearning', label: 'Academy', id: 'elearning' },
    { url: '/directory', label: 'Network Map', id: 'directory' },
    { url: '/resources', label: 'Library', id: 'resources' },
    { url: '/podcast', label: 'Media', id: 'podcast' },
    { url: '/blog', label: 'Insights', id: 'blog' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const renderPageContent = () => {
    const pageId = pages[activeIndex].id;

    switch (pageId) {
      case 'community':
        return (
          <div className={styles.messagingView}>
            {[...Array(3)].map((_, i) => {
              const isEven = i === 1;
              return (
                <motion.div 
                  key={i} 
                  className={`${styles.messageRow} ${isEven ? styles.messageRowReverse : ''}`}
                  initial={{ x: isEven ? 20 : -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className={`${styles.messageAvatar} ${isEven ? styles.avatarPurple : styles.avatarPink}`} />
                  <div className={styles.messageBubble}>
                    <div className={styles.bubbleLine} />
                    <div className={styles.bubbleLine} style={{ width: '60%' }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        );
      case 'insights':
        return (
          <div className={styles.insightsViewV2}>
            <div className={styles.insightsTopRow}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.sparkCard}>
                  <div className={styles.lineShort} style={{ marginBottom: '4px' }} />
                  <div className={styles.sparkValue} />
                  <div className={styles.miniSparkline}>
                    <svg viewBox="0 0 100 20" className={styles.sparkSvg}>
                      <path d="M0,15 Q25,5 50,15 T100,5" fill="none" stroke={i % 2 === 0 ? '#b8a9d1' : '#f2c2e0'} strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.insightsMain}>
              <div className={styles.marketOverview}>
                <div className={styles.lineMedium} style={{ marginBottom: '15px' }} />
                <div className={styles.mainChartPlaceholder}>
                  <svg viewBox="0 0 400 100" className={styles.largeChartSvg}>
                    <path d="M0,80 L50,60 L100,85 L150,40 L200,70 L250,30 L300,50 L350,20 L400,40" fill="none" stroke="#b8a9d1" strokeWidth="2" />
                    <path d="M0,80 L50,60 L100,85 L150,40 L200,70 L250,30 L300,50 L350,20 L400,40 V100 H0 Z" fill="url(#chartGradient)" opacity="0.1" />
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#b8a9d1" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className={styles.recentActivities}>
                <div className={styles.lineShort} style={{ marginBottom: '10px' }} />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={styles.activityItem}>
                    <div className={styles.activityIcon} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'elearning':
        return (
          <div className={styles.elearningViewV2}>
            <div className={styles.learningHero}>
              <div className={styles.lineMedium} style={{ background: '#fff', opacity: 0.8 }} />
              <div className={styles.lineLong} style={{ background: '#fff', opacity: 0.4 }} />
              <div className={styles.miniBtnWhite} />
            </div>
            <div className={styles.learningBody}>
              <div className={styles.learningMain}>
                <div className={styles.sectionHeader}>
                  <div className={styles.lineShort} />
                </div>
                <div className={styles.courseGrid}>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className={styles.courseCardMini}>
                      <div className={styles.courseThumb} />
                      <div className={styles.courseText}>
                        <div className={styles.miniProgress} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.learningSidebar}>
                <div className={styles.lineShort} style={{ marginBottom: '8px' }} />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={styles.mentorItem}>
                    <div className={styles.mentorAvatar} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'directory':
        return (
          <div className={styles.directoryViewV2}>
            <div className={styles.miniMapV2}>
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className={styles.mapPinSmall}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  style={{ 
                    top: `${[20, 45, 60, 30, 75][i]}%`, 
                    left: `${[30, 55, 25, 80, 50][i]}%` 
                  }}
                >
                  {i === 1 && (
                    <motion.div 
                      className={styles.mapTooltip}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <div className={styles.meterProgress} style={{ width: '40%', background: '#b8a9d1' }} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className={styles.clinicListing}>
              <div className={styles.clinicCard}>
                <div className={styles.clinicThumb} />
                <div className={styles.clinicDetails}>
                  <div className={styles.lineMedium} style={{ background: '#b8a9d1' }} />
                  <div className={styles.meterBar}>
                    <div className={styles.meterProgress} style={{ width: '60%', background: '#a5d6a7' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'community_dashboard':
        return (
          <div className={styles.communityDashboard}>
            <div className={styles.commSidebar}>
              <div className={`${styles.commIcon} ${styles.commIconActive}`} />
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.commIcon} />
              ))}
            </div>
            
            <div className={styles.commMessagesList}>
              <div className={styles.lineShort} style={{ width: '100%', height: '14px', marginBottom: '10px' }} />
              <div className={styles.commOnlineNow}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={styles.commOnlineAvatar}>
                    <div className={styles.commStatusDot} />
                  </div>
                ))}
              </div>
              <div className={styles.lineMedium} style={{ opacity: 0.1, marginBottom: '8px' }} />
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.commMsgItem}>
                  <div className={styles.commMsgAvatar} />
                  <div className={styles.commMsgDetails}>
                    <div className={styles.lineShort} style={{ width: '40px', marginBottom: '4px' }} />
                    <div className={styles.lineMedium} style={{ opacity: 0.2 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.commChatArea}>
              <div className={styles.commChatHeader}>
                <div className={styles.lineMedium} style={{ background: '#b8a9d1', height: '12px' }} />
                <div className={styles.lineShort} style={{ opacity: 0.4, marginTop: '4px' }} />
              </div>
              
              <div className={styles.commChatMessages}>
                <motion.div 
                  className={styles.commBubbleWrapper}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className={styles.commMsgAvatar} />
                  <div className={styles.commBubble}>
                    <div className={styles.lineMedium} style={{ opacity: 0.6 }} />
                    <div className={styles.commPoll}>
                      <div className={styles.commPollOption}>
                        <motion.div 
                          className={styles.commPollProgress}
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                        />
                      </div>
                      <div className={styles.commPollOption}>
                        <motion.div 
                          className={styles.commPollProgress}
                          initial={{ width: 0 }}
                          animate={{ width: '35%' }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className={`${styles.commBubbleWrapper} ${styles.commBubbleWrapperRight}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className={styles.commMsgAvatar} style={{ background: '#b8a9d1' }} />
                  <div className={`${styles.commBubble} ${styles.commBubbleRight}`}>
                    <div className={styles.lineShort} style={{ background: '#fff' }} />
                  </div>
                </motion.div>

                <motion.div 
                  className={styles.commBubbleWrapper}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className={styles.commMsgAvatar} />
                  <div className={styles.commBubble}>
                    <div className={styles.lineLong} style={{ opacity: 0.5 }} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );
      case 'podcast':
        return (
          <div className={styles.podcastViewV2}>
            <div className={styles.podcastHero}>
              <div className={styles.podcastCover} />
              <div className={styles.podcastMainInfo}>
                <div className={styles.lineMedium} style={{ background: '#b8a9d1' }} />
                <div className={styles.lineLong} />
                <div className={styles.waveformContainer}>
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={styles.audioBarSmall}
                      animate={{ height: [4, 16, 6, 14, 4] }}
                      transition={{ 
                        duration: 1.2, 
                        repeat: Infinity, 
                        delay: i * 0.08,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                <div className={styles.playAction}>
                  <div className={styles.miniPlayBtn} />
                </div>
              </div>
            </div>
            <div className={styles.episodeList}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.episodeItem}>
                  <div className={styles.episodeThumb} />
                  <div className={styles.episodeText}>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className={styles.resourcesViewV2}>
            <div className={styles.resourcesHeader}>
              <div className={styles.resourcesActions}>
                <div className={styles.miniBtnPink} />
              </div>
            </div>
            <div className={styles.resourcesGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.resourceCard}>
                  <div className={styles.resourceHeader}>
                  </div>
                  <div className={styles.resourceFooter}>
                    <div className={styles.miniDownloadBtn} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className={styles.blogViewV2}>
            <div className={styles.blogHeader}>
            </div>
            <div className={styles.blogTopRow}>
              <div className={styles.featuredPost}>
                <div className={styles.featuredThumb} />
              </div>
              <div className={styles.editorsPicks}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={styles.blogPostMini}>
                    <div className={styles.blogThumbMini} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.blogGrid}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.blogCard}>
                  <div className={styles.blogCardThumb} />
                  <div className={styles.blogCardText}>
                    <div className={styles.lineMedium} />
                    <div className={styles.lineShort} style={{ opacity: 0.2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.browserWrapper}>
      <div className={styles.browserFrame}>
        <div className={styles.browserHeader}>
          <div className={styles.dots}>
            <span style={{ background: '#FF5F57', opacity: 0.4 }} />
            <span style={{ background: '#FFBD2E', opacity: 0.4 }} />
            <span style={{ background: '#27C93F', opacity: 0.4 }} />
          </div>
          <div className={styles.addressBar}>
            <svg viewBox="0 0 24 24" width="10" height="10" fill="#7a4ab2" style={{ marginRight: '6px', opacity: 0.6 }}>
              <path d="M12 2a5 5 0 0 0-5 5v4H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm3 9H9V7a3 3 0 0 1 6 0z" />
            </svg>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
              >
                pharmalinkhealth.com{pages[activeIndex].url}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className={styles.browserContent}>
          <div className={styles.sidebar}>
            {[80, 70, 90, 60].map((width, i) => (
              <motion.div 
                key={i}
                className={styles.sidebarItem} 
                animate={{ 
                  width: `${width}%`,
                  opacity: i === (activeIndex % 4) ? 1 : 0.4
                }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
          <div className={styles.mainArea}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={styles.contentWrapper}
              >
                {renderPageContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
