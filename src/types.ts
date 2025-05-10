
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

export type InfrastructureCost = {
  hosting: number;
  database: number;
  cdn: number;
  cicd: number;
};
