import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env') });

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

const jobs = [
  {
    _type: 'jobOpening',
    title: 'Senior Clinical Pharmacist',
    slug: { _type: 'slug', current: 'senior-clinical-pharmacist' },
    category: 'Clinical',
    company: 'PharmaLink',
    location: 'Lagos, Nigeria (Hybrid)',
    type: 'full-time',
    excerpt: 'Lead our clinical pharmacy initiatives and provide expert consultation to healthcare providers.',
    description: 'We are seeking a seasoned Clinical Pharmacist to join our leadership team in Lagos. You will be responsible for overseeing medication therapy management programs and mentor junior staff.',
    responsibilities: [
      'Lead medication therapy management (MTM) initiatives.',
      'Collaborate with physicians to optimize patient drug therapy.',
      'Supervise clinical staff and interns.',
      'Maintain compliance with all healthcare regulations.'
    ],
    requirements: [
      'Doctor of Pharmacy (PharmD) degree.',
      'Minimum 5 years of clinical experience.',
      'Active pharmacy license in Nigeria.',
      'Excellent communication and leadership skills.'
    ],
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'jobOpening',
    title: 'Frontend Developer (React)',
    slug: { _type: 'slug', current: 'frontend-developer-react' },
    category: 'Technical',
    company: 'PharmaLink',
    location: 'Remote',
    type: 'full-time',
    excerpt: 'Build the future of digital health interfaces using Next.js and the "Clinical Luxury" design system.',
    description: 'Join our engineering team to build high-fidelity, interactive health platforms. You will work closely with designers to implement pixel-perfect components.',
    responsibilities: [
      'Develop new user-facing features using React.js and Next.js.',
      'Build reusable components and front-end libraries for future use.',
      'Translate designs and wireframes into high-quality code.',
      'Optimize components for maximum performance across a vast array of web-capable devices and browsers.'
    ],
    requirements: [
      '3+ years of experience with React/Next.js.',
      'Strong proficiency in TypeScript and CSS Modules.',
      'Experience with Sanity CMS is a plus.',
      'Portfolio demonstrating high-fidelity UI implementation.'
    ],
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'jobOpening',
    title: 'Operations Manager',
    slug: { _type: 'slug', current: 'operations-manager' },
    category: 'Operations',
    company: 'PharmaLink',
    location: 'Accra, Ghana',
    type: 'full-time',
    excerpt: 'Optimize our regional healthcare delivery networks and manage local partnerships.',
    description: 'We are looking for an Operations Manager to oversee our expansion in Ghana. You will manage supply chain logistics and coordinate with local healthcare facilities.',
    responsibilities: [
      'Manage daily operations and regional supply chain.',
      'Develop and maintain strategic partnerships with local clinics.',
      'Monitor operational performance metrics and report to HQ.',
      'Oversee local administrative and logistics staff.'
    ],
    requirements: [
      'Degree in Business Administration, Operations, or related field.',
      'Experience in healthcare operations preferred.',
      'Strong organizational and problem-solving abilities.',
      'Knowledge of the Ghanaian healthcare landscape.'
    ],
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'jobOpening',
    title: 'Research Analyst',
    slug: { _type: 'slug', current: 'research-analyst' },
    category: 'Research',
    company: 'PharmaLink',
    location: 'Nairobi, Kenya',
    type: 'contract',
    excerpt: 'Analyze pharmaceutical market trends and patient outcome data in East Africa.',
    description: 'Support our research initiatives by gathering and analyzing data on medication accessibility and patient outcomes in the region.',
    responsibilities: [
      'Conduct market research and data collection.',
      'Analyze datasets using D3.js and other visualization tools.',
      'Prepare comprehensive reports for stakeholders.',
      'Support the design of new research methodologies.'
    ],
    requirements: [
      'Background in Pharmacy, Public Health, or Data Science.',
      'Experience with data analysis tools and techniques.',
      'Strong analytical and writing skills.',
      'Attention to detail and ability to work independently.'
    ],
    publishedAt: new Date().toISOString(),
  }
];

async function seed() {
  console.log('Seeding job openings...');
  for (const job of jobs) {
    try {
      const result = await client.createOrReplace({
        _id: `job-${job.slug.current}`,
        ...job,
      });
      console.log(`Created/Updated job: ${result.title}`);
    } catch (err) {
      console.error(`Error seeding ${job.title}:`, err);
    }
  }
  console.log('Seeding complete!');
}

seed();
