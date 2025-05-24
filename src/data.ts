
import { ProjectScope, InfrastructureCost, InfrastructureSourceCosts } from './types';
import defaultConfig from './config/defaults.json';

export const DEFAULT_ROLES = defaultConfig.roles;

export const PROJECT_SCOPES: Record<string, ProjectScope> = defaultConfig.projectScopes;

// Base monthly infrastructure costs per scope type
export const BASE_INFRASTRUCTURE_COSTS: Record<string, InfrastructureCost> = defaultConfig.baseInfrastructureCosts;

// Source costs for infrastructure items
export const INFRASTRUCTURE_SOURCE_COSTS: Record<string, InfrastructureSourceCosts> = defaultConfig.infrastructureSourceCosts;

// Cost multiplier per 1000 users
export const USER_COST_MULTIPLIER = defaultConfig.userCostMultiplier;

// Timeline in weeks based on role hours
export const TIMELINE_CALCULATOR = defaultConfig.timelineCalculator;

// Storage cost calculator
export const STORAGE_COST_CALCULATOR = defaultConfig.storageCostCalculator;

// Authentication cost calculator
export const AUTHENTICATION_COST_CALCULATOR = defaultConfig.authenticationCostCalculator;

// Default configuration values
export const DEFAULT_CONFIG = defaultConfig.defaults;
