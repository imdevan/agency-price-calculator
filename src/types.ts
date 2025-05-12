export type Role = {
  id: string;
  title: string;
  hourlyRate: number;
  weeklyHours: number;
};

export type Scope = 'poc' | 'mvp' | 'production';

export type ProjectScope = {
  type: Scope;
  label: string;
  description: string;
  developmentTimeMultiplier: number;
  roles: {
    [key: string]: number; // roleId: hoursNeeded
  };
};

export type InfrastructureCostDetail = {
  serviceName: string;
  baseCost: number;
  description: string;
};

export type InfrastructureCost = {
  hosting: number;
  database: number;
  cdn: number;
  cicd: number;
  storage: number;
  authentication: number;
  otherServices: number;
};

export type InfrastructureSourceCosts = {
  hosting: InfrastructureCostDetail[];
  database: InfrastructureCostDetail[];
  cdn: InfrastructureCostDetail[];
  cicd: InfrastructureCostDetail[];
  storage: InfrastructureCostDetail[];
  authentication: InfrastructureCostDetail[];
};

export type FreeTierEligibility = {
  hosting: boolean;
  database: boolean;
  cdn: boolean;
  cicd: boolean;
  storage: boolean;
  authentication: boolean;
  otherServices: boolean;
};

export interface ServiceProvider {
  serviceName: string;
  baseCost: number;
  description: string;
}

export interface TimelineAdjustment {
  baseWeeks: number;
  adjustedWeeks: number;
  multiplier: number;
}
