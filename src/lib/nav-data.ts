export interface NavLink {
  label: string;
  href: string;
  descriptor: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface FeaturedCard {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc?: string;
}

export interface NavItem {
  id: string;
  label: string;
  columns: NavColumn[];
  featuredCard: FeaturedCard;
}

export const NAV_DATA: NavItem[] = [
  {
    id: "about-us",
    label: "About Us",
    columns: [
      {
        heading: "About Us",
        links: [
          {
            label: "About PharmaLink",
            href: "/about-us",
            descriptor: "Our mission and story",
          },
        ],
      },
    ],
    featuredCard: {
      title: "Join the Network",
      description: "Connect with pharma professionals worldwide",
      ctaLabel: "Get Started",
      ctaHref: "/sign-up",
    },
  },
  {
    id: "community",
    label: "Community",
    columns: [
      {
        heading: "Community",
        links: [
          {
            label: "Community Hub",
            href: "/community",
            descriptor: "News, events & announcements",
          },
          {
            label: "Forum",
            href: "/forum",
            descriptor: "Discuss clinical & industry topics",
          },
          {
            label: "Member Spotlights",
            href: "/member-spotlights",
            descriptor: "Stories from our network",
          },
          {
            label: "Careers",
            href: "/careers",
            descriptor: "Jobs across the pharma network",
          },
        ],
      },
    ],
    featuredCard: {
      title: "Join the Conversation",
      description: "1,200+ pharma professionals active this month",
      ctaLabel: "Browse Forum",
      ctaHref: "/forum",
    },
  },
  {
    id: "data-insights",
    label: "Data Insights",
    columns: [
      {
        heading: "Data Insights",
        links: [
          {
            label: "Data Insights",
            href: "/data-insights",
            descriptor: "Dashboards & analytics",
          },
          {
            label: "Directory",
            href: "/directory",
            descriptor: "Find organisations on the map",
          },
          {
            label: "Blog",
            href: "/blog",
            descriptor: "Articles & research",
          },
          {
            label: "e-Learning",
            href: "/elearning",
            descriptor: "Courses & professional development",
          },
        ],
      },
    ],
    featuredCard: {
      title: "Explore the Data",
      description: "Interactive dashboards covering global pharma trends",
      ctaLabel: "View Insights",
      ctaHref: "/data-insights",
    },
  },
  {
    id: "podcast",
    label: "Podcast",
    columns: [
      {
        heading: "Podcast",
        links: [
          {
            label: "Latest Episodes",
            href: "/podcast",
            descriptor: "Industry conversations with leading voices",
          },
        ],
      },
    ],
    featuredCard: {
      title: "PharmaLink Podcast",
      description: "New episode every week",
      ctaLabel: "Listen Now",
      ctaHref: "/podcast",
    },
  },
  {
    id: "contact-us",
    label: "Contact Us",
    columns: [],
    featuredCard: {
      title: "Get in Touch",
      description: "Lagos · London · New York\ncontact@pharmalink.io",
      ctaLabel: "Send a Message",
      ctaHref: "/contact-us",
    },
  },
];
