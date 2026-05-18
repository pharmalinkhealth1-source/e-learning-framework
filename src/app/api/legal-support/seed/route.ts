import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'
import { client } from '@/sanity/lib/client'

interface BlockChild {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface Block {
  _type: 'block'
  _key: string
  style: string
  children: BlockChild[]
  markDefs: []
}

interface Section {
  h2: string
  h3?: string
  paragraphs: string[]
}

interface LegalPageSeed {
  title: string
  slug: { _type: 'slug'; current: string }
  category: string
  icon: string
  order: number
  effectiveDate: string
  lastUpdated: string
  summary: string
  showOnHub: boolean
  body: Block[]
}

let keyCounter = 0
function key(): string {
  keyCounter += 1
  return `k${keyCounter.toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

function block(text: string, style: string = 'normal'): Block {
  return {
    _type: 'block',
    _key: key(),
    style,
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
  }
}

function makeBody(intro: string[], sections: Section[]): Block[] {
  const blocks: Block[] = []
  for (const p of intro) blocks.push(block(p))
  for (const sec of sections) {
    blocks.push(block(sec.h2, 'h2'))
    if (sec.h3) blocks.push(block(sec.h3, 'h3'))
    for (const p of sec.paragraphs) blocks.push(block(p))
  }
  return blocks
}

/* ─────────────────────────────────────────────────────────────
   PAGE CONTENT
   ───────────────────────────────────────────────────────────── */

const privacyPolicy: LegalPageSeed = {
  title: 'Privacy Policy',
  slug: { _type: 'slug', current: 'privacy-policy' },
  category: 'policy',
  icon: 'eye',
  order: 1,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'Outlines what personal data is collected, how it is used, and how it is shared, in compliance with GDPR, the Nigeria Data Protection Act 2023, the Kenya Data Protection Act 2019, and Ethiopia\'s Personal Data Protection Proclamation 1321/2024.',
  showOnHub: true,
  body: makeBody(
    [
      'PharmaLink ("we", "us", or "our") is committed to protecting the privacy of healthcare professionals, students, and other users of our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit pharmalinkhealth.com or use our services.',
    ],
    [
      {
        h2: 'Introduction',
        paragraphs: [
          'PharmaLink is a professional network and education platform serving healthcare professionals across Africa, with primary operations in Nigeria, Kenya, and Ethiopia, and supporting members worldwide. This policy is designed to comply with the EU General Data Protection Regulation (GDPR), the Nigeria Data Protection Act 2023 (NDPA), the Kenya Data Protection Act 2019 (KDPA), and the Ethiopian Personal Data Protection Proclamation No. 1321/2024 (PDPP).',
          'By accessing or using our services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our practices, please do not use our services.',
        ],
      },
      {
        h2: 'Information We Collect',
        paragraphs: [
          'We collect information that you provide directly to us, information we obtain automatically when you use our services, and information from third parties.',
        ],
      },
      {
        h2: 'Account Information',
        h3: 'Account Information',
        paragraphs: [
          'When you create an account we collect your name, email address, country, password, and professional role (e.g., pharmacist, pharmacy technician, student). If you authenticate via a third-party identity provider, we receive the basic profile information that provider shares with us.',
        ],
      },
      {
        h2: 'Usage Data',
        h3: 'Usage Data',
        paragraphs: [
          'We automatically collect information about your interactions with the platform, including pages viewed, courses started, quiz responses, posts read, search queries, device and browser details, IP address, and approximate geolocation derived from IP.',
        ],
      },
      {
        h2: 'Professional Information',
        h3: 'Professional Information',
        paragraphs: [
          'To verify your eligibility for certain features (such as continuing professional development credit), we may collect license numbers, regulatory body, qualifications, place of work, and similar professional details. We treat licence numbers as sensitive professional data and only share them with verification partners under contract.',
        ],
      },
      {
        h2: 'How We Use Your Information',
        paragraphs: [
          'We use your information to deliver and maintain our services, personalise content recommendations, issue certificates and CPD documentation, send transactional and (where you opt in) marketing communications, detect fraud and abuse, perform aggregate analytics, and comply with legal obligations.',
          'We rely on the following lawful bases: performance of a contract with you, your consent, our legitimate interests in operating the platform, and compliance with legal obligations.',
        ],
      },
      {
        h2: 'How We Share Your Information',
        paragraphs: [
          'We do not sell your personal data. We share information only with: (a) service providers acting on our behalf (hosting, analytics, email, payments) under written confidentiality and data-processing agreements; (b) regulatory or licensing bodies where you have explicitly requested verification or CPD reporting; (c) law-enforcement authorities where legally compelled; and (d) corporate successors in the event of a merger, acquisition, or asset sale.',
          'Where third-party recipients are located outside your country, we implement standard contractual clauses and supplementary safeguards as required by applicable law.',
        ],
      },
      {
        h2: 'Your Rights',
        paragraphs: [
          'You have rights with respect to your personal data. The specific rights available to you depend on the jurisdiction in which you reside.',
        ],
      },
      {
        h2: 'Rights Under GDPR',
        h3: 'Rights Under GDPR',
        paragraphs: [
          'If you are in the European Economic Area or the United Kingdom, you have the right to access, rectify, erase, restrict, or port your personal data; to object to processing based on our legitimate interests; and to withdraw consent at any time. You may lodge a complaint with your local supervisory authority.',
        ],
      },
      {
        h2: 'Rights Under Nigerian NDPA 2023',
        h3: 'Rights Under Nigerian NDPA 2023',
        paragraphs: [
          'If you are a Nigerian data subject, the Nigeria Data Protection Act 2023 grants you the right to be informed about processing, to access your data, to request correction or deletion, to object to processing, to withdraw consent, and to lodge a complaint with the Nigeria Data Protection Commission (NDPC).',
        ],
      },
      {
        h2: 'Rights Under Kenya Data Protection Act',
        h3: 'Rights Under Kenya Data Protection Act',
        paragraphs: [
          'If you are a Kenyan data subject, the Kenya Data Protection Act 2019 grants you the right to be informed of the use of your data, to access it, to object to processing, to request correction or deletion of false or misleading data, and to lodge a complaint with the Office of the Data Protection Commissioner (ODPC).',
        ],
      },
      {
        h2: 'Rights Under Ethiopia PDPP 1321/2024',
        h3: 'Rights Under Ethiopia PDPP 1321/2024',
        paragraphs: [
          'If you are an Ethiopian data subject, the Personal Data Protection Proclamation No. 1321/2024 grants you the right to be informed of processing, to access and obtain a copy of your data, to request correction or deletion, to object to automated decision-making, and to lodge a complaint with the Ethiopian data-protection authority.',
        ],
      },
      {
        h2: 'Data Security',
        paragraphs: [
          'We implement administrative, technical, and physical safeguards designed to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure, or access. These include TLS encryption in transit, encryption at rest for sensitive fields, least-privilege access controls, audit logging, and routine vulnerability assessments.',
          'No method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but commit to notifying affected users and relevant authorities of any qualifying personal-data breach within the timelines required by applicable law.',
        ],
      },
      {
        h2: 'International Data Transfers',
        paragraphs: [
          'PharmaLink is headquartered in the United States and uses cloud-hosting providers operating in multiple jurisdictions. When we transfer personal data across borders, we rely on appropriate safeguards such as standard contractual clauses, adequacy decisions where available, and additional technical measures to ensure equivalent protection.',
        ],
      },
      {
        h2: 'Retention',
        paragraphs: [
          'We retain your account information for as long as your account remains active and for a reasonable period thereafter to comply with legal obligations, resolve disputes, and enforce our agreements. CPD and certificate records are retained for the period required by the relevant regulator. You may request earlier deletion subject to overriding legal obligations.',
        ],
      },
      {
        h2: 'Changes to This Policy',
        paragraphs: [
          'We may update this Privacy Policy from time to time. Material changes will be communicated by email or by a prominent notice on the platform at least 14 days before they take effect. The "Last updated" date at the top of this page reflects the latest revision.',
        ],
      },
      {
        h2: 'Contact Us',
        paragraphs: [
          'For questions about this Privacy Policy or to exercise any of your rights, contact our Data Protection Officer at info@pharmalinkhealth.com. We respond to verifiable requests within the timeframes required by applicable law.',
        ],
      },
    ],
  ),
}

const termsOfService: LegalPageSeed = {
  title: 'Terms of Service',
  slug: { _type: 'slug', current: 'terms-of-service' },
  category: 'terms',
  icon: 'scales',
  order: 2,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'The legal terms governing your use of PharmaLink, including your rights, responsibilities, prohibited activities, and limitations of liability.',
  showOnHub: true,
  body: makeBody(
    [
      'These Terms of Service ("Terms") govern your access to and use of PharmaLink (the "Services"), operated by PharmaLink Health LLC. By accessing or using the Services, you agree to be bound by these Terms.',
    ],
    [
      {
        h2: 'Your Use of PharmaLink Services',
        paragraphs: [
          'PharmaLink provides a professional network, educational content, continuing professional development (CPD) courses, a discussion forum, a careers board, and related services for pharmacy professionals and students. You agree to use the Services solely for lawful, professional purposes consistent with these Terms.',
        ],
      },
      {
        h2: 'Eligibility',
        paragraphs: [
          'You must be at least 18 years old (or the age of majority in your jurisdiction) and able to form a binding contract to use the Services. Certain features are restricted to verified healthcare professionals or students enrolled in an accredited programme.',
        ],
      },
      {
        h2: 'User Accounts',
        paragraphs: [
          'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate, current, and complete information during registration and to update such information promptly when it changes. We may suspend or terminate accounts that contain false information.',
        ],
      },
      {
        h2: 'Acceptable Use',
        paragraphs: [
          'You agree not to: (a) post unlawful, defamatory, harassing, or misleading content; (b) impersonate another person or misrepresent your professional credentials; (c) use the Services to provide patient-specific clinical advice in a way that violates professional regulations; (d) scrape, mirror, or extract content without our written permission; (e) introduce malware or attempt to compromise the security of the Services; or (f) violate any applicable law.',
        ],
      },
      {
        h2: 'Intellectual Property',
        paragraphs: [
          'All content provided by PharmaLink — including course materials, articles, software, design, and trademarks — is owned by PharmaLink or its licensors and protected by intellectual-property laws. You receive a limited, non-exclusive, non-transferable licence to access and use the content for your personal professional development. You retain ownership of content you post but grant us a worldwide, royalty-free licence to host, display, and distribute it on the Services.',
        ],
      },
      {
        h2: 'Payments & Subscriptions',
        paragraphs: [
          'Paid subscriptions and one-off course purchases are billed via our payment processor. Subscriptions automatically renew at the end of each billing period unless cancelled. All fees are non-refundable except as described in our Refund & Cancellation Policy or as required by law.',
        ],
      },
      {
        h2: 'Third-Party Links',
        paragraphs: [
          'The Services may contain links to third-party websites or resources. We do not endorse and are not responsible for the content, products, or services offered by third parties. Your interactions with third parties are governed by their own terms and policies.',
        ],
      },
      {
        h2: 'Disclaimer of Warranties',
        paragraphs: [
          'The Services are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement. We do not warrant that the Services will be uninterrupted, secure, or error-free.',
        ],
      },
      {
        h2: 'Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by law, PharmaLink and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or goodwill, arising out of or in connection with your use of the Services. Our aggregate liability shall not exceed the amount you paid to us in the 12 months preceding the event giving rise to the claim, or USD 100, whichever is greater.',
        ],
      },
      {
        h2: 'Indemnification',
        paragraphs: [
          'You agree to indemnify and hold harmless PharmaLink and its affiliates from and against any claims, damages, losses, and expenses (including reasonable legal fees) arising from your use of the Services, your violation of these Terms, or your infringement of any third-party right.',
        ],
      },
      {
        h2: 'Termination',
        paragraphs: [
          'We may suspend or terminate your access to the Services at any time, with or without notice, for conduct that we believe violates these Terms, harms other users, or is otherwise harmful to PharmaLink. You may terminate your account at any time by contacting support.',
        ],
      },
      {
        h2: 'Governing Law',
        paragraphs: [
          'These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict-of-laws principles. Any disputes shall be resolved exclusively in the state or federal courts located in Delaware, except where mandatory consumer-protection laws of your country of residence apply.',
        ],
      },
      {
        h2: 'Changes to These Terms',
        paragraphs: [
          'We may modify these Terms from time to time. Material changes will be communicated by email or in-platform notice at least 14 days before they take effect. Continued use of the Services after the effective date constitutes acceptance of the revised Terms.',
        ],
      },
      {
        h2: 'Contact Us',
        paragraphs: [
          'For questions about these Terms, please contact us at info@pharmalinkhealth.com.',
        ],
      },
    ],
  ),
}

const cookiePolicy: LegalPageSeed = {
  title: 'Cookie Policy',
  slug: { _type: 'slug', current: 'cookie-policy' },
  category: 'policy',
  icon: 'cookie',
  order: 3,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'We use cookies to improve your browsing experience, analyze site traffic, and understand where our visitors are coming from.',
  showOnHub: true,
  body: makeBody(
    [
      'This Cookie Policy explains how PharmaLink uses cookies and similar tracking technologies when you visit pharmalinkhealth.com.',
    ],
    [
      {
        h2: 'What Are Cookies',
        paragraphs: [
          'Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work, improve performance, and provide analytics. Similar technologies include local storage, session storage, and pixel tags.',
        ],
      },
      {
        h2: 'Types of Cookies We Use',
        paragraphs: [
          'We group our cookies into four categories. You can manage non-essential categories through our cookie banner or your browser settings.',
        ],
      },
      {
        h2: 'Essential Cookies',
        h3: 'Essential Cookies',
        paragraphs: [
          'These cookies are required for the Services to function. They enable core functionality such as authentication, session management, and security. The Services cannot operate without them and they cannot be disabled.',
        ],
      },
      {
        h2: 'Analytics Cookies',
        h3: 'Analytics Cookies',
        paragraphs: [
          'These cookies help us understand how visitors interact with the platform by collecting and reporting information anonymously. We use this data to improve content, navigation, and performance.',
        ],
      },
      {
        h2: 'Functional Cookies',
        h3: 'Functional Cookies',
        paragraphs: [
          'These cookies remember your preferences (such as language, region, and accessibility settings) so we can deliver a more personalised experience on subsequent visits.',
        ],
      },
      {
        h2: 'Marketing Cookies',
        h3: 'Marketing Cookies',
        paragraphs: [
          'These cookies track your activity across websites to deliver advertising that is more relevant to you. We only set marketing cookies with your explicit consent.',
        ],
      },
      {
        h2: 'Managing Cookies',
        paragraphs: [
          'You can accept, reject, or fine-tune your cookie preferences at any time using our cookie banner. You can also configure your browser to refuse all cookies or to alert you when cookies are being sent. Note that disabling essential cookies will impair the functionality of the Services.',
        ],
      },
      {
        h2: 'Third-Party Cookies',
        paragraphs: [
          'Some cookies are set by third parties whose services appear on our pages (for example, video players or analytics providers). These third parties have their own privacy and cookie policies, which we encourage you to review.',
        ],
      },
      {
        h2: 'Changes to This Policy',
        paragraphs: [
          'We may update this Cookie Policy to reflect changes to the cookies we use or for operational, legal, or regulatory reasons. The "Last updated" date at the top of this page indicates when this policy was last revised.',
        ],
      },
      {
        h2: 'Contact Us',
        paragraphs: [
          'For questions about our use of cookies, contact us at info@pharmalinkhealth.com.',
        ],
      },
    ],
  ),
}

const accessibilityStatement: LegalPageSeed = {
  title: 'Accessibility Statement',
  slug: { _type: 'slug', current: 'accessibility-statement' },
  category: 'accessibility',
  icon: 'person',
  order: 4,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'PharmaLink is committed to adhering to WCAG 2.1 AA standards to promote accessibility and maximize usability for individuals with disabilities.',
  showOnHub: true,
  body: makeBody(
    [
      'PharmaLink is committed to making its content and services accessible to all healthcare professionals and students, including those with disabilities.',
    ],
    [
      {
        h2: 'Our Commitment',
        paragraphs: [
          'We strive to ensure that pharmalinkhealth.com complies with the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. Accessibility is an ongoing process and we welcome feedback that helps us improve.',
        ],
      },
      {
        h2: 'Conformance Status',
        paragraphs: [
          'WCAG 2.1 defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. PharmaLink is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not yet fully meet the standard.',
        ],
      },
      {
        h2: 'Technical Specifications',
        paragraphs: [
          'Accessibility of PharmaLink relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your device: HTML, ARIA, CSS, and JavaScript. These technologies are relied upon for conformance with the accessibility standards used.',
        ],
      },
      {
        h2: 'Known Limitations',
        paragraphs: [
          'Despite our best efforts, some content may not yet be fully accessible. Known limitations include legacy course videos without captions and certain third-party embeds. We are actively working to remediate these issues and welcome reports of any barriers you encounter.',
        ],
      },
      {
        h2: 'Feedback and Contact',
        paragraphs: [
          'We welcome your feedback on the accessibility of PharmaLink. Please let us know if you encounter accessibility barriers by emailing info@pharmalinkhealth.com. We try to respond to feedback within 5 business days.',
        ],
      },
      {
        h2: 'Enforcement Procedure',
        paragraphs: [
          'If you are not satisfied with our response to your accessibility concern, you may contact the relevant data-protection or equality authority in your jurisdiction.',
        ],
      },
    ],
  ),
}

const medicalDisclaimer: LegalPageSeed = {
  title: 'Medical Disclaimer',
  slug: { _type: 'slug', current: 'medical-disclaimer' },
  category: 'disclaimer',
  icon: 'warning',
  order: 5,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'Content on PharmaLink is for professional education only. It does not constitute clinical advice for specific patients.',
  showOnHub: true,
  body: makeBody(
    [
      'PharmaLink is an educational and professional-networking platform. The information presented on the Services is intended exclusively for licensed healthcare professionals and students enrolled in accredited healthcare programmes.',
    ],
    [
      {
        h2: 'Professional Education Platform',
        paragraphs: [
          'Our courses, articles, forum threads, and other content are designed to support continuing professional development. They are not a substitute for clinical judgement, peer-reviewed treatment guidelines, or the formal training and supervision required to practise as a healthcare professional.',
        ],
      },
      {
        h2: 'Not Clinical Advice',
        paragraphs: [
          'Nothing on PharmaLink constitutes medical advice for an identifiable patient. Healthcare professionals must apply their own clinical judgement, consult authoritative sources, and follow the laws and professional standards of the jurisdiction in which they practise. Patients should consult their own qualified healthcare provider.',
        ],
      },
      {
        h2: 'Accuracy of Information',
        paragraphs: [
          'We make reasonable efforts to keep content accurate and up to date, but pharmacology, regulation, and clinical guidance evolve. We make no warranty that any specific piece of content is current, complete, or applicable to a particular case.',
        ],
      },
      {
        h2: 'Emergency Situations',
        paragraphs: [
          'PharmaLink does not provide emergency services. If you or someone in your care is experiencing a medical emergency, contact your local emergency services immediately.',
        ],
      },
      {
        h2: 'Regulatory Compliance',
        paragraphs: [
          'Users are responsible for ensuring that any use of information obtained through PharmaLink complies with the rules of their professional regulator (for example, the Pharmacists Council of Nigeria, the Pharmacy and Poisons Board of Kenya, the Ethiopian Food and Drug Authority, or equivalent body).',
        ],
      },
      {
        h2: 'Contact',
        paragraphs: [
          'If you believe that any content on PharmaLink is inaccurate or misleading, please contact us at info@pharmalinkhealth.com.',
        ],
      },
    ],
  ),
}

const communityGuidelines: LegalPageSeed = {
  title: 'Community Guidelines',
  slug: { _type: 'slug', current: 'community-guidelines' },
  category: 'guidelines',
  icon: 'users',
  order: 6,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'Rules and expectations for participating in PharmaLink\'s forum, messaging, and community features.',
  showOnHub: true,
  body: makeBody(
    [
      'PharmaLink is a professional community. These Community Guidelines describe the behaviour we expect from all members and the consequences for violations.',
    ],
    [
      {
        h2: 'Our Community Values',
        paragraphs: [
          'We value evidence-based discussion, respect for colleagues, support for trainees and early-career members, and constructive critique. Our community spans many countries, languages, and clinical settings; please assume good faith and engage with curiosity.',
        ],
      },
      {
        h2: 'Encouraged Behaviour',
        paragraphs: [
          'Share peer-reviewed sources where possible, credit the authors of work you cite, mentor newcomers, ask thoughtful questions, and report content that violates these Guidelines so moderators can review it.',
        ],
      },
      {
        h2: 'Prohibited Content',
        paragraphs: [
          'You may not post: (a) patient-identifiable information; (b) content that promotes the sale of prescription medicines outside lawful channels; (c) harassment, hate speech, or discriminatory remarks based on protected characteristics; (d) misleading clinical advice that contradicts established evidence; (e) spam, repetitive promotional content, or affiliate links without disclosure; or (f) sexually explicit, violent, or otherwise inappropriate material.',
        ],
      },
      {
        h2: 'Enforcement',
        paragraphs: [
          'Our moderation team reviews reports and may, at its discretion, remove content, issue warnings, temporarily suspend posting privileges, or permanently terminate accounts. Repeated or severe violations result in permanent removal.',
        ],
      },
      {
        h2: 'Reporting Violations',
        paragraphs: [
          'Every post and comment includes a "Report" option. You can also email moderators@pharmalinkhealth.com. Reports are reviewed promptly and the reporter\'s identity is kept confidential where reasonably possible.',
        ],
      },
      {
        h2: 'Copyright and Intellectual Property',
        paragraphs: [
          'Only post content that you have the right to share. Do not upload copyrighted materials (textbooks, journal articles, course slides) without permission. See our DMCA Policy for the takedown procedure.',
        ],
      },
      {
        h2: 'Repeat Infringer Policy',
        paragraphs: [
          'Accounts that repeatedly violate copyright or these Guidelines will be terminated. We may also report serious violations to relevant professional regulators where the conduct is connected to professional practice.',
        ],
      },
      {
        h2: 'Contact',
        paragraphs: [
          'Questions about these Guidelines should be directed to moderators@pharmalinkhealth.com.',
        ],
      },
    ],
  ),
}

const dmcaPolicy: LegalPageSeed = {
  title: 'DMCA Policy',
  slug: { _type: 'slug', current: 'dmca-policy' },
  category: 'policy',
  icon: 'copyright',
  order: 7,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'Our policy for handling copyright infringement claims under the Digital Millennium Copyright Act.',
  showOnHub: true,
  body: makeBody(
    [
      'PharmaLink respects the intellectual-property rights of others and expects its users to do the same. This DMCA Policy describes how rights-holders may submit copyright takedown notices and how affected users may submit counter-notices.',
    ],
    [
      {
        h2: 'Safe Harbor Notice',
        paragraphs: [
          'PharmaLink operates as a service provider under 17 U.S.C. § 512 (the Digital Millennium Copyright Act). We comply with the notice-and-takedown procedures established by that statute.',
        ],
      },
      {
        h2: 'Designated Agent',
        paragraphs: [
          'Our designated DMCA agent for receiving copyright notices is: PharmaLink Health LLC, DMCA Agent, by email at dmca@pharmalinkhealth.com.',
        ],
      },
      {
        h2: 'Submitting a DMCA Takedown Notice',
        paragraphs: [
          'A valid takedown notice must include: (a) a physical or electronic signature of the rights-holder or authorised agent; (b) identification of the copyrighted work claimed to be infringed; (c) identification of the material that is allegedly infringing and where it is located on our Services (URL); (d) your contact information; (e) a statement that you have a good-faith belief that the use is not authorised by the rights-holder, agent, or law; and (f) a statement, made under penalty of perjury, that the information in the notice is accurate and that you are authorised to act on behalf of the rights-holder.',
        ],
      },
      {
        h2: 'Counter-Notice Procedure',
        paragraphs: [
          'If you believe content of yours was removed by mistake or misidentification, you may submit a counter-notice including: your contact information; identification of the material that was removed and where it appeared before removal; a statement, under penalty of perjury, that you have a good-faith belief the material was removed as a result of mistake or misidentification; your consent to the jurisdiction of the federal court in Delaware; and your signature.',
        ],
      },
      {
        h2: 'Repeat Infringers',
        paragraphs: [
          'PharmaLink will terminate, in appropriate circumstances, the accounts of users who are determined to be repeat copyright infringers.',
        ],
      },
      {
        h2: 'Misrepresentation',
        paragraphs: [
          'Under 17 U.S.C. § 512(f), a person who knowingly misrepresents that material is infringing, or that material was removed by mistake or misidentification, may be liable for damages, including costs and legal fees.',
        ],
      },
    ],
  ),
}

const refundPolicy: LegalPageSeed = {
  title: 'Refund & Cancellation Policy',
  slug: { _type: 'slug', current: 'refund-policy' },
  category: 'policy',
  icon: 'currency',
  order: 8,
  effectiveDate: '2025-09-15',
  lastUpdated: '2025-09-15',
  summary:
    'Our refund and cancellation policy for e-learning subscriptions, course purchases, and membership fees.',
  showOnHub: true,
  body: makeBody(
    [
      'This Refund & Cancellation Policy describes when refunds are available for paid PharmaLink products and how to cancel a subscription.',
    ],
    [
      {
        h2: 'Free Tier',
        paragraphs: [
          'PharmaLink offers a free tier that provides access to a selection of articles, the public forum, and limited course previews. No payment is required, and no refunds are applicable to free-tier usage.',
        ],
      },
      {
        h2: 'Paid Subscriptions',
        paragraphs: [
          'Paid subscriptions (monthly or annual) provide access to premium courses, CPD tracking, and certificate downloads. Subscription fees are billed in advance and are non-refundable except as required by law or as specifically described below.',
        ],
      },
      {
        h2: 'Cancellation',
        paragraphs: [
          'You may cancel a subscription at any time from your account settings or by emailing billing@pharmalinkhealth.com. Cancellation takes effect at the end of your current billing period; you continue to have access to paid features until that date.',
        ],
      },
      {
        h2: 'Refund Eligibility',
        paragraphs: [
          'We may, at our discretion, issue a pro-rata refund where: (a) the platform was unavailable for an extended period due to our fault; (b) you were charged in error; or (c) applicable consumer-protection law in your country requires a refund. Refund requests must be submitted within 14 days of the relevant charge.',
        ],
      },
      {
        h2: 'Non-Refundable Items',
        paragraphs: [
          'Issued certificates, one-off course purchases that have been substantially consumed (more than 30% of content viewed), and donations are not refundable.',
        ],
      },
      {
        h2: 'Contact',
        paragraphs: [
          'For billing questions or refund requests, contact billing@pharmalinkhealth.com.',
        ],
      },
    ],
  ),
}

const ALL_PAGES: LegalPageSeed[] = [
  privacyPolicy,
  termsOfService,
  cookiePolicy,
  accessibilityStatement,
  medicalDisclaimer,
  communityGuidelines,
  dmcaPolicy,
  refundPolicy,
]

/* ─────────────────────────────────────────────────────────────
   ROUTE
   ───────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  const auth = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${process.env.PBID_EXPORT_SECRET ?? ''}`
  if (!process.env.PBID_EXPORT_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const created: string[] = []
  const skipped: string[] = []
  const errors: { slug: string; message: string }[] = []

  for (const page of ALL_PAGES) {
    try {
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "legalPage" && slug.current == $slug][0]{ _id }`,
        { slug: page.slug.current },
      )
      if (existing) {
        skipped.push(page.slug.current)
        continue
      }
      await writeClient.create({ _type: 'legalPage', ...page })
      created.push(page.slug.current)
    } catch (err) {
      errors.push({
        slug: page.slug.current,
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return NextResponse.json({ created, skipped, errors })
}
