
import { ProjectScope, InfrastructureCost, InfrastructureSourceCosts } from './types';

export const DEFAULT_ROLES = [
  { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 262 },
  { id: 'designer', title: 'Designer', hourlyRate: 125 },
  { id: 'projectManager', title: 'Project Manager', hourlyRate: 135 },
];

export const PROJECT_SCOPES: Record<string, ProjectScope> = {
  poc: {
    type: 'poc',
    label: 'Proof of Concept',
    description: 'A minimal implementation to validate the core idea.',
    developmentTimeMultiplier: 1,
    roles: {
      seniorDev: 20,
      designer: 10,
      projectManager: 10,
    },
  },
  mvp: {
    type: 'mvp',
    label: 'Minimum Viable Product',
    description: 'Core features with basic user experience.',
    developmentTimeMultiplier: 2.5,
    roles: {
      seniorDev: 50,
      designer: 30,
      projectManager: 25,
    },
  },
  production: {
    type: 'production',
    label: 'Production Application',
    description: 'Complete solution with full feature set and polished UX.',
    developmentTimeMultiplier: 5,
    roles: {
        seniorDev: 150,
      designer: 80,
      projectManager: 70,
    },
  },
};

// Base monthly infrastructure costs per scope type
export const BASE_INFRASTRUCTURE_COSTS: Record<string, InfrastructureCost> = {
  poc: {
    hosting: 20,
    database: 15,
    cdn: 10,
    cicd: 0,
    storage: 5,
    authentication: 0,
    otherServices: 0,
  },
  mvp: {
    hosting: 50,
    database: 30,
    cdn: 25,
    cicd: 30,
    storage: 15,
    authentication: 10,
    otherServices: 0,
  },
  production: {
    hosting: 150,
    database: 100,
    cdn: 75,
    cicd: 100,
    storage: 40,
    authentication: 30,
    otherServices: 0,
  },
};

// Source costs for infrastructure items
export const INFRASTRUCTURE_SOURCE_COSTS: Record<string, InfrastructureSourceCosts> = {
  poc: {
    hosting: [
      { serviceName: "Vercel Basic", baseCost: 10, description: "Basic hosting plan for small projects" },
      { serviceName: "AWS Free Tier", baseCost: 5, description: "Limited AWS services within free tier allowance" },
      { serviceName: "Netlify Starter", baseCost: 5, description: "Static site hosting with limited build minutes" }
    ],
    database: [
      { serviceName: "MongoDB Atlas Free", baseCost: 5, description: "Shared cluster with limited storage" },
      { serviceName: "Firebase Spark", baseCost: 5, description: "Free tier database with quota limits" },
      { serviceName: "Supabase Free", baseCost: 5, description: "PostgreSQL database with limited connections" }
    ],
    cdn: [
      { serviceName: "Cloudflare Free", baseCost: 0, description: "Basic CDN with limited requests" },
      { serviceName: "CloudFront Minimal", baseCost: 10, description: "Pay-as-you-go with minimal traffic" }
    ],
    cicd: [
      { serviceName: "GitHub Actions", baseCost: 0, description: "Free tier minutes for public repositories" }
    ],
    storage: [
      { serviceName: "AWS S3 Free Tier", baseCost: 0, description: "5GB storage free for 12 months" },
      { serviceName: "Firebase Storage Free", baseCost: 0, description: "5GB storage and 1GB daily transfer" },
      { serviceName: "Cloudinary Free", baseCost: 0, description: "25 credits (~25GB)" }
    ],
    authentication: [
      { serviceName: "Firebase Auth", baseCost: 0, description: "Up to 50K monthly active users" },
      { serviceName: "Auth0 Free", baseCost: 0, description: "Up to 7K active users" },
      { serviceName: "Supabase Auth", baseCost: 0, description: "Free tier with rate limits" }
    ]
  },
  mvp: {
    hosting: [
      { serviceName: "Vercel Pro", baseCost: 20, description: "Production-grade hosting with team collaboration" },
      { serviceName: "AWS Elastic Beanstalk Small", baseCost: 15, description: "Small instance hosting with auto-scaling" },
      { serviceName: "Digital Ocean App Platform", baseCost: 15, description: "Basic container-based application hosting" }
    ],
    database: [
      { serviceName: "MongoDB Atlas Shared", baseCost: 15, description: "Dedicated shared cluster with backups" },
      { serviceName: "Firebase Blaze (minimal)", baseCost: 10, description: "Pay-as-you-go with moderate usage" },
      { serviceName: "AWS RDS Small Instance", baseCost: 5, description: "Small managed database instance" }
    ],
    cdn: [
      { serviceName: "Cloudflare Pro", baseCost: 20, description: "Enhanced CDN with analytics" },
      { serviceName: "CloudFront Standard", baseCost: 5, description: "Standard distribution with moderate traffic" }
    ],
    cicd: [
      { serviceName: "GitHub Actions Pro", baseCost: 10, description: "Extended minutes for private repositories" },
      { serviceName: "CircleCI Small Team", baseCost: 20, description: "Team plan with additional containers" }
    ],
    storage: [
      { serviceName: "AWS S3 Standard", baseCost: 5, description: "~50GB with standard access" },
      { serviceName: "Cloudinary Plus", baseCost: 10, description: "100 credits (~100GB)" },
      { serviceName: "Digital Ocean Spaces", baseCost: 5, description: "50GB with 250GB transfer" }
    ],
    authentication: [
      { serviceName: "Firebase Auth Plus", baseCost: 5, description: "Over 50K monthly active users" },
      { serviceName: "Auth0 Developer", baseCost: 10, description: "7K+ monthly active users" },
      { serviceName: "Supabase Auth Pro", baseCost: 5, description: "Higher limits, priority support" }
    ]
  },
  production: {
    hosting: [
      { serviceName: "Vercel Enterprise", baseCost: 50, description: "Enterprise-grade hosting with SLA guarantees" },
      { serviceName: "AWS ECS Cluster", baseCost: 60, description: "Container-based hosting with load balancing" },
      { serviceName: "Azure App Service Premium", baseCost: 40, description: "Premium hosting with auto-scaling" }
    ],
    database: [
      { serviceName: "MongoDB Atlas Dedicated", baseCost: 45, description: "Dedicated cluster with high availability" },
      { serviceName: "AWS RDS Production", baseCost: 35, description: "Multi-AZ database with read replicas" },
      { serviceName: "Azure SQL Database", baseCost: 20, description: "Managed SQL database with geo-replication" }
    ],
    cdn: [
      { serviceName: "Cloudflare Business", baseCost: 30, description: "Advanced CDN with DDoS protection" },
      { serviceName: "AWS CloudFront Premium", baseCost: 25, description: "Global CDN with edge computing" },
      { serviceName: "Akamai Standard", baseCost: 20, description: "Enterprise CDN with global reach" }
    ],
    cicd: [
      { serviceName: "GitHub Enterprise", baseCost: 40, description: "Enterprise plan with advanced security" },
      { serviceName: "CircleCI Performance", baseCost: 30, description: "High-performance CI/CD with parallel jobs" },
      { serviceName: "Jenkins Cloud", baseCost: 30, description: "Managed Jenkins environment with auto-scaling" }
    ],
    storage: [
      { serviceName: "AWS S3 Enterprise", baseCost: 20, description: "~200GB with multi-region replication" },
      { serviceName: "Google Cloud Storage", baseCost: 15, description: "Standard storage with high durability" },
      { serviceName: "Cloudinary Advanced", baseCost: 25, description: "225+ credits (~225GB+)" }
    ],
    authentication: [
      { serviceName: "Auth0 Professional", baseCost: 25, description: "Enterprise features, SSO, MFA" },
      { serviceName: "Firebase Auth Enterprise", baseCost: 15, description: "Enterprise level, advanced features" },
      { serviceName: "Supabase Auth Enterprise", baseCost: 20, description: "Enterprise scale and support" }
    ]
  }
};

// Cost multiplier per 1000 users
export const USER_COST_MULTIPLIER = {
  hosting: 0.2,   // 20% increase per 1000 users
  database: 0.25, // 25% increase per 1000 users
  cdn: 0.3,       // 30% increase per 1000 users
  cicd: 0.1,      // 10% increase per 1000 users
  storage: 0.15,  // 15% increase per 1000 users
  authentication: 0.2, // 20% increase per 1000 users
  otherServices: 0,    // No user-based scaling for other services
};

// Timeline in weeks based on role hours
export const TIMELINE_CALCULATOR = {
  teamSize: 3,         // Assume average team size
  hoursPerWeekPerDev: 35, // Productive hours per developer per week
};

// Storage cost calculator
export const STORAGE_COST_CALCULATOR = {
  pricePerGBPerMonth: 0.023, // Average price per GB per month
  baseFreeGB: 5,        // Average free tier storage
};

// Authentication cost calculator
export const AUTHENTICATION_COST_CALCULATOR = {
  freeMAUs: 7000,         // Average free MAUs across services
  pricePerMAUBeyondFree: 0.0015, // Average price per MAU beyond free tier
};

