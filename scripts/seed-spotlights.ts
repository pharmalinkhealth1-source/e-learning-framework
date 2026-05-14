import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-03-11';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

const spotlights = [
  {
    _type: 'memberSpotlight',
    name: 'Dr. Amina Yusuf',
    slug: { _type: 'slug', current: 'dr-amina-yusuf' },
    jobTitle: 'Community Pharmacist',
    organization: 'Lagos General Hospital',
    country: 'Nigeria',
    memberOfTheMonth: true,
    featured: true,
    image: {
      _type: 'image',
      externalUrl: 'https://viya-health.com/wp-content/uploads/2024/05/dummy-testimonial-image-001.webp',
      alt: 'Dr. Amina Yusuf',
    },
    quote: 'Launching telepharmacy during the pandemic changed everything for our rural patients.',
    excerpt: 'How one pharmacist bridged the gap in Lagos through digital consultation and home delivery systems.',
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Dr. Amina Yusuf has been at the forefront of pharmaceutical innovation in Lagos for over a decade. When the pandemic hit, she realized that traditional models of care were no longer sufficient.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'By implementing a mobile-first telepharmacy platform, she was able to reach patients in remote areas who previously had to travel hours for basic consultations.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    tags: ['Telepharmacy', 'Community Care', 'Innovation'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/amina-yusuf',
      email: 'amina.y@example.com',
    },
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'memberSpotlight',
    name: 'Dr. Samuel Okon',
    slug: { _type: 'slug', current: 'dr-samuel-okon' },
    jobTitle: 'Clinical Researcher',
    organization: 'Accra Health Institute',
    country: 'Ghana',
    memberOfTheMonth: false,
    featured: true,
    image: {
      _type: 'image',
      externalUrl: 'https://viya-health.com/wp-content/uploads/2024/05/dummy-testimonial-image-002.webp',
      alt: 'Dr. Samuel Okon',
    },
    quote: 'PharmaLink allowed me to collaborate with researchers across 5 different countries in real-time.',
    excerpt: 'Breaking silos in clinical research through collaborative networks and shared data insights.',
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Clinical research in West Africa has often been fragmented. Dr. Samuel Okon sought to change this by leveraging the PharmaLink network to connect with peers globally.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    tags: ['Research', 'Collaboration', 'West Africa'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/samuel-okon',
      email: 's.okon@example.com',
    },
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'memberSpotlight',
    name: 'Dr. Wanjiku Njeri',
    slug: { _type: 'slug', current: 'dr-wanjiku-njeri' },
    jobTitle: 'Head of Pharmacy',
    organization: 'Nairobi Wellness Center',
    country: 'Kenya',
    memberOfTheMonth: false,
    featured: true,
    image: {
      _type: 'image',
      externalUrl: 'https://viya-health.com/wp-content/uploads/2024/05/dummy-testimonial-image-003.webp',
      alt: 'Dr. Wanjiku Njeri',
    },
    quote: 'The digital inventory tools have reduced our medication waste by 30% in just six months.',
    excerpt: 'Optimizing supply chains and patient outcomes through data-driven inventory management.',
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Inventory management is a critical challenge for many healthcare facilities. Dr. Njeri implemented new digital tracking systems that have significantly improved efficiency.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    tags: ['Inventory Management', 'Supply Chain', 'Efficiency'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/wanjiku-njeri',
      email: 'njeri.w@example.com',
    },
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'memberSpotlight',
    name: 'Dr. Kofi Boateng',
    slug: { _type: 'slug', current: 'dr-kofi-boateng' },
    jobTitle: 'Hospital Pharmacist',
    organization: 'Kumasi Central Hospital',
    country: 'Ghana',
    memberOfTheMonth: false,
    featured: true,
    image: {
      _type: 'image',
      externalUrl: 'https://viya-health.com/wp-content/uploads/2024/05/dummy-testimonial-image-004.webp',
      alt: 'Dr. Kofi Boateng',
    },
    quote: 'Real-time drug interaction alerts have saved numerous lives in our busy ward.',
    excerpt: 'Enhancing patient safety through digital clinical decision support systems.',
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'In a high-pressure hospital environment, clinical errors are a constant risk. Dr. Boateng has championed the use of digital tools to provide real-time safety nets.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    tags: ['Patient Safety', 'Clinical Pharmacy'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/kofi-boateng',
      email: 'k.boateng@example.com',
    },
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'memberSpotlight',
    name: 'Sarah Jappah',
    slug: { _type: 'slug', current: 'sarah-jappah' },
    jobTitle: 'Supply Chain Specialist',
    organization: 'Liberia National Drug Service',
    country: 'Liberia',
    memberOfTheMonth: false,
    featured: true,
    image: {
      _type: 'image',
      externalUrl: 'https://viya-health.com/wp-content/uploads/2024/05/dummy-testimonial-image-005.webp',
      alt: 'Sarah Jappah',
    },
    quote: 'Predictive analytics helped us prevent malaria medicine stockouts for the first time this rainy season.',
    excerpt: 'Modernizing national drug distribution networks through predictive data models.',
    body: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'National drug distribution in Liberia faces significant logistical hurdles. Sarah Jappah has integrated predictive analytics to better anticipate and meet demand.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    tags: ['Supply Chain', 'Data Analytics', 'Public Health'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarah-jappah',
      email: 's.jappah@example.com',
    },
    publishedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('Seeding member spotlights...');
  for (const spotlight of spotlights) {
    try {
      const result = await client.createOrReplace({
        _id: `spotlight-${spotlight.slug.current}`,
        ...spotlight,
      });
      console.log(`Created/Updated spotlight: ${result.name}`);
    } catch (err) {
      console.error(`Error seeding ${spotlight.name}:`, err);
    }
  }
  console.log('Seeding complete!');
}

seed();
