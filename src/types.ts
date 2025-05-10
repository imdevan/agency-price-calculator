
export type Role = {
  id: string;
  title: string;
  hourlyRate: number;
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
};

export type InfrastructureSourceCosts = {
  hosting: InfrastructureCostDetail[];
  database: InfrastructureCostDetail[];
  cdn: InfrastructureCostDetail[];
  cicd: InfrastructureCostDetail[];
};
