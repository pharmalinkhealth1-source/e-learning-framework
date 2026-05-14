import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

// Original client for when credentials are valid
const baseClient = createClient({
  projectId: projectId === 'placeholder' ? 'placeholder-id' : projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
})

// Fallback data for when Sanity is not configured
const MOCK_SPOTLIGHTS = [
  {
    _id: 'mock-1',
    name: 'Dr. Amina Yusuf',
    slug: { current: 'dr-amina-yusuf' },
    jobTitle: 'Community Pharmacist',
    organization: 'Lagos General Hospital',
    country: 'Nigeria',
    memberOfTheMonth: true,
    featured: true,
    image: {
      externalUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
    },
    quote: 'Launching telepharmacy during the pandemic changed everything for our rural patients.',
    excerpt: 'How one pharmacist bridged the gap in Lagos through digital consultation and home delivery systems.',
    body: [],
    tags: ['Telepharmacy', 'Community Care'],
  },
  {
    _id: 'mock-2',
    name: 'Samuel Okonjo',
    slug: { current: 'samuel-okonjo' },
    jobTitle: 'Supply Chain Manager',
    organization: 'Africa Health Logistics',
    country: 'Ghana',
    featured: true,
    image: {
      externalUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    },
    quote: 'Real-time inventory tracking saved us from major stockouts during the peak malaria season.',
    excerpt: 'Optimizing the last-mile distribution across the Greater Accra region using cloud-based tracking.',
    body: [],
    tags: ['Logistics', 'Supply Chain'],
  },
  {
    _id: 'mock-3',
    name: 'Dr. Elena Mensah',
    slug: { current: 'dr-elena-mensah' },
    jobTitle: 'Clinical Director',
    organization: 'Accra Medical Center',
    country: 'Ghana',
    featured: true,
    image: {
      externalUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300',
    },
    quote: 'Peer-to-peer collaboration on PharmaLink has elevated our clinical standards significantly.',
    excerpt: 'Implementing new cardiovascular treatment protocols through cross-border knowledge sharing.',
    body: [],
    tags: ['Clinical Excellence', 'Collaboration'],
  },
  {
    _id: 'mock-4',
    name: 'Kofi Mensah',
    slug: { current: 'kofi-mensah' },
    jobTitle: 'Regulatory Officer',
    organization: 'National Drug Authority',
    country: 'Kenya',
    featured: true,
    image: {
      externalUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    },
    quote: 'Streamlining medication registration is key to getting essential drugs to those who need them.',
    excerpt: 'A deep dive into how digital regulatory frameworks are speeding up medicine approval in East Africa.',
    body: [],
    tags: ['Regulatory', 'Healthcare Policy'],
  },
  {
    _id: 'mock-5',
    name: 'Zewdie Haile',
    slug: { current: 'zewdie-haile' },
    jobTitle: 'Pharmacy Owner',
    organization: 'Addis Pharma',
    country: 'Ethiopia',
    featured: true,
    image: {
      externalUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300',
    },
    quote: 'Empowering local pharmacies with digital tools is the future of African healthcare.',
    excerpt: 'How one independent pharmacy in Addis Ababa scaled its operations through integrated software.',
    body: [],
    tags: ['Entrepreneurship', 'Digital Transformation'],
  }
];

const MOCK_JOBS = [
  {
    _id: 'mock-job-1',
    title: 'Senior Clinical Pharmacist',
    slug: { current: 'senior-clinical-pharmacist' },
    category: 'Clinical',
    company: 'PharmaLink',
    location: 'Lagos, Nigeria (Hybrid)',
    type: 'full-time',
    excerpt: 'Lead our clinical pharmacy initiatives and provide expert consultation to healthcare providers.',
    description: 'We are seeking a seasoned Clinical Pharmacist to join our leadership team in Lagos.',
    publishedAt: new Date().toISOString(),
  }
];

const MOCK_BLOG_POSTS = [
  {
    _id: 'blog-1',
    _type: 'blogPost',
    title: "Scaling the strongest link in the health system",
    slug: { current: "scaling-strongest-link" },
    tag: "Product Update",
    summary: "Today we're announcing new features for the PharmaLink dashboard, designed to help local pharmacies track immunization data with 100% accuracy.",
    publishedAt: "2024-05-04T12:00:00Z",
    mainImage: { externalUrl: "/images/blog/pharmalink-ethiopia-launch.webp" },
    author: { _type: 'reference', _ref: 'author-betty' }
  },
  {
    _id: 'blog-2',
    _type: 'blogPost',
    title: "The impact of digital inventory in rural Nigeria",
    slug: { current: "digital-inventory-impact-nigeria" },
    tag: "Research",
    summary: "Our latest field study reveals how real-time inventory management has reduced out-of-stock rates for essential vaccines by 45% in Ondo State.",
    publishedAt: "2024-04-28T12:00:00Z",
    mainImage: { externalUrl: "/images/blog/research-1.png" },
    author: { _type: 'reference', _ref: 'author-adebayo' }
  },
  {
    _id: 'blog-3',
    _type: 'blogPost',
    title: "PharmaLink expands to Kenya and Ethiopia",
    slug: { current: "pharmalink-expands-kenya-ethiopia" },
    tag: "Press",
    summary: "With a new round of strategic partnerships, we are bringing our clinical training and supply chain tools to thousands of new providers across East Africa.",
    publishedAt: "2024-04-15T12:00:00Z",
    mainImage: { externalUrl: "/images/blog/press-1.png" },
    author: { _type: 'reference', _ref: 'author-florence' }
  }
];

const MOCK_AUTHORS = [
  { _id: 'author-betty', name: 'Betty Abera', image: { externalUrl: "/images/leadership-team/Betty_Abera-PharmaLink-Project-Director.webp" } },
  { _id: 'author-adebayo', name: 'Adebayo Adebisi', image: { externalUrl: "/images/leadership-team/Adebayo-Adebisi.png" } },
  { _id: 'author-florence', name: 'Florence Wachira', image: { externalUrl: "/images/leadership-team/Florence-Wachira.webp" } }
];

const MOCK_DIRECTORY = [
  { _id: 'seed-1', _type: 'directoryItem', name: 'PharmaLink Lagos Hub', category: 'distribution-hub', city: 'Lagos', country: 'Nigeria', location: { lat: 6.5244, lng: 3.3792 } },
  { _id: 'seed-2', _type: 'directoryItem', name: 'Nairobi Clinical Center', category: 'clinic', city: 'Nairobi', country: 'Kenya', location: { lat: -1.2921, lng: 36.8219 } },
  { _id: 'seed-3', _type: 'directoryItem', name: 'Addis Pharmacy Central', category: 'pharmacy', city: 'Addis Ababa', country: 'Ethiopia', location: { lat: 9.0300, lng: 38.7400 } }
];

const MOCK_FORUM = [
  { _id: 'forum-1', _type: 'forumPost', title: 'Vaccine cold chain storage', slug: { current: 'vaccine-cold-chain' }, publishedAt: '2024-05-01T10:00:00Z' },
  { _id: 'forum-2', _type: 'forumPost', title: 'Inventory management best practices', slug: { current: 'inventory-management' }, publishedAt: '2024-04-20T10:00:00Z' }
];

export const client = {
  ...baseClient,
  fetch: async <T>(query: string, params?: any): Promise<T> => {
    if (projectId === 'placeholder') {
      const lowerQuery = query.toLowerCase();
      const q = params?.searchQuery ? params.searchQuery.replace(/\*/g, '').toLowerCase() : '';

      // Unified Global Search
      if (lowerQuery.includes('directoryitem') && lowerQuery.includes('forumpost') && lowerQuery.includes('blogpost')) {
        const results: any[] = [];
        
        MOCK_DIRECTORY.forEach(d => {
          if (d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)) results.push({ ...d, title: d.name, subtitle: d.category });
        });
        
        MOCK_FORUM.forEach(f => {
          if (f.title.toLowerCase().includes(q)) results.push({ ...f, title: f.title, subtitle: 'Discussion', slug: typeof f.slug === 'string' ? f.slug : f.slug?.current || '' });
        });
        
        MOCK_BLOG_POSTS.forEach(b => {
          if (b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q)) results.push({ ...b, title: b.title, subtitle: b.tag, slug: typeof b.slug === 'string' ? b.slug : b.slug?.current || '' });
        });
        
        return results as unknown as T;
      }

      if (lowerQuery.includes('memberspotlight')) {
        if (query.trim().endsWith('[0]')) return MOCK_SPOTLIGHTS[0] as unknown as T;
        return MOCK_SPOTLIGHTS as unknown as T;
      }
      
      if (lowerQuery.includes('jobopening')) {
        if (params?.slug) return (MOCK_JOBS.find(j => j.slug.current === params.slug) || null) as unknown as T;
        return MOCK_JOBS as unknown as T;
      }

      if (lowerQuery.includes('blogpost')) {
        let results = MOCK_BLOG_POSTS;
        if (q) results = results.filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
        return results.map(r => ({
          ...r,
          slug: typeof r.slug === 'string' ? r.slug : r.slug?.current || '',
          date: r.publishedAt,
          image: r.mainImage?.externalUrl || (r.mainImage as any)?.asset?.url || '',
          externalImage: r.mainImage?.externalUrl || '',
          author: MOCK_AUTHORS.find(a => a._id === r.author?._ref) || null
        })) as unknown as T;
      }

      if (lowerQuery.includes('author')) {
        if (params?.id) return (MOCK_AUTHORS.find(a => a._id === params.id) || null) as unknown as T;
        return MOCK_AUTHORS as unknown as T;
      }

      if (lowerQuery.includes('directoryitem')) {
        let results = MOCK_DIRECTORY;
        if (q) results = results.filter(d => d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q));
        return results as unknown as T;
      }

      if (lowerQuery.includes('forumpost')) {
        let results = MOCK_FORUM;
        if (q) results = results.filter(f => f.title.toLowerCase().includes(q));
        return results.map(r => ({ 
          ...r, 
          slug: typeof r.slug === 'string' ? r.slug : r.slug?.current || '' 
        })) as unknown as T;
      }
      
      return [] as unknown as T;
    }

    try {
      return await baseClient.fetch<T>(query, params);
    } catch (error) {
      console.error('Sanity fetch error:', error);
      return [] as unknown as T;
    }
  }
} as typeof baseClient;
