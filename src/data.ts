
import { ProjectScope, InfrastructureCost } from './types';

export const DEFAULT_ROLES = [
  { id: 'juniorDev', title: 'Junior Developer', hourlyRate: 75 },
  { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 150 },
  { id: 'designer', title: 'Designer', hourlyRate: 125 },
  { id: 'projectManager', title: 'Project Manager', hourlyRate: 135 },
  { id: 'qaEngineer', title: 'QA Engineer', hourlyRate: 85 }
];

export const PROJECT_SCOPES: Record<string, ProjectScope> = {
  poc: {
    type: 'poc',
    label: 'Proof of Concept',
    description: 'A minimal implementation to validate the core idea.',
    developmentTimeMultiplier: 1,
    roles: {
      juniorDev: 40,
      seniorDev: 20,
      designer: 10,
      projectManager: 10,
      qaEngineer: 5,
    },
  },
  mvp: {
    type: 'mvp',
    label: 'Minimum Viable Product',
    description: 'Core features with basic user experience.',
    developmentTimeMultiplier: 2.5,
    roles: {
      juniorDev: 100,
      seniorDev: 50,
      designer: 30,
      projectManager: 25,
      qaEngineer: 20,
    },
  },
  production: {
    type: 'production',
    label: 'Production Application',
    description: 'Complete solution with full feature set and polished UX.',
    developmentTimeMultiplier: 5,
    roles: {
      juniorDev: 300,
      seniorDev: 150,
      designer: 80,
      projectManager: 70,
      qaEngineer: 60,
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
  },
  mvp: {
    hosting: 50,
    database: 30,
    cdn: 25,
    cicd: 30,
  },
  production: {
    hosting: 150,
    database: 100,
    cdn: 75,
    cicd: 100,
  },
};

// Cost multiplier per 1000 users
export const USER_COST_MULTIPLIER = {
  hosting: 0.2,   // 20% increase per 1000 users
  database: 0.25, // 25% increase per 1000 users
  cdn: 0.3,       // 30% increase per 1000 users
  cicd: 0.1,      // 10% increase per 1000 users
};

// Timeline in weeks based on role hours
export const TIMELINE_CALCULATOR = {
  teamSize: 3,         // Assume average team size
  hoursPerWeekPerDev: 35, // Productive hours per developer per week
};
