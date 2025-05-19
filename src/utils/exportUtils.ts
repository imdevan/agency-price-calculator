
import { Role, Scope, InfrastructureCost, TimelineAdjustment, FreeTierEligibility } from '@/types';
import { PROJECT_SCOPES, TIMELINE_CALCULATOR, INFRASTRUCTURE_SOURCE_COSTS } from '@/data';

interface OtherService {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

// Add the missing formatCurrency function
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateCsvData = (
  roles: Role[],
  selectedScope: Scope,
  infrastructureCosts: InfrastructureCost,
  userCount: number,
  timeline: TimelineAdjustment,
  freeTierEligibility: FreeTierEligibility,
  gbStorage: number,
  authUsers: number,
  otherServices: OtherService[]
) => {
  const scope = PROJECT_SCOPES[selectedScope];
  const roleCosts = roles.map(role => {
    const hours = scope.roles[role.id] || 0;
    const cost = hours * role.hourlyRate;
    return { ...role, hours, cost };
  });

  // Calculate weekly costs
  const weeklyRoleCosts = roles.map(role => {
    const weeklyCost = role.hourlyRate * role.weeklyHours;
    return { ...role, weeklyCost };
  });
  const totalWeeklyCost = weeklyRoleCosts.reduce((total, role) => total + role.weeklyCost, 0);
  
  // Development costs based on timeline
  const totalDevelopmentCost = totalWeeklyCost * timeline.adjustedWeeks;
  
  // Infrastructure costs
  const totalInfrastructureCost = Object.keys(infrastructureCosts).reduce((sum, key) => {
    const costKey = key as keyof InfrastructureCost;
    const isFree = freeTierEligibility[costKey as keyof FreeTierEligibility];
    return sum + (isFree ? 0 : infrastructureCosts[costKey]);
  }, 0);
  
  const monthlyInfrastructureCost = totalInfrastructureCost;
  const yearlyInfrastructureCost = monthlyInfrastructureCost * 12;
  
  // Format timeline for display
  const formatTimeline = (weeks: number) => {
    if (weeks >= 52) {
      const years = Math.floor(weeks / 52);
      const remainingWeeks = weeks % 52;
      return `${years} year${years > 1 ? 's' : ''}${remainingWeeks > 0 ? ` ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}` : ''}`;
    } else if (weeks >= 8) {
      const months = Math.floor(weeks / 4.33);
      const remainingWeeks = Math.round(weeks % 4.33);
      return `${months} month${months > 1 ? 's' : ''}${remainingWeeks > 0 ? ` ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    }
  };

  // Build CSV content
  let csvContent = "Studio Price Calculator Report\n\n";

  // Summary Section
  csvContent += "SUMMARY\n";
  csvContent += `Project Type,${scope.label}\n`;
  csvContent += `Estimated Users,${userCount}\n`;
  csvContent += `Estimated Storage,${gbStorage} GB\n`;
  csvContent += `Estimated Auth Users,${authUsers} MAU\n`;
  csvContent += `Estimated Timeline,${formatTimeline(timeline.adjustedWeeks)} (${timeline.multiplier.toFixed(2)}x base estimate)\n`;
  csvContent += `Weekly Development Cost,$${totalWeeklyCost}\n`;
  csvContent += `Total Development Cost,$${totalDevelopmentCost}\n`;
  csvContent += `Monthly Infrastructure Cost,$${monthlyInfrastructureCost}\n`;
  csvContent += `Yearly Infrastructure Cost,$${yearlyInfrastructureCost}\n\n`;

  // Development Costs
  csvContent += "DEVELOPMENT COSTS\n";
  csvContent += "Role,Weekly Hours,Hourly Rate,Weekly Cost\n";
  weeklyRoleCosts.forEach(role => {
    if (role.weeklyHours > 0) {
      csvContent += `${role.title},${role.weeklyHours},$${role.hourlyRate},$${role.weeklyCost}\n`;
    }
  });
  csvContent += `TOTAL WEEKLY,,,\$${totalWeeklyCost}\n`;
  csvContent += `TOTAL FOR TIMELINE (${formatTimeline(timeline.adjustedWeeks)}),,,\$${totalDevelopmentCost}\n\n`;

  // Infrastructure Costs
  csvContent += "INFRASTRUCTURE COSTS\n";
  csvContent += "Service,Monthly Cost,Free Tier\n";
  csvContent += `Hosting,${freeTierEligibility.hosting ? "Free Tier" : "$" + infrastructureCosts.hosting},${freeTierEligibility.hosting ? "Yes" : "No"}\n`;
  csvContent += `Database,${freeTierEligibility.database ? "Free Tier" : "$" + infrastructureCosts.database},${freeTierEligibility.database ? "Yes" : "No"}\n`;
  csvContent += `CDN,${freeTierEligibility.cdn ? "Free Tier" : "$" + infrastructureCosts.cdn},${freeTierEligibility.cdn ? "Yes" : "No"}\n`;
  csvContent += `CI/CD,${freeTierEligibility.cicd ? "Free Tier" : "$" + infrastructureCosts.cicd},${freeTierEligibility.cicd ? "Yes" : "No"}\n`;
  csvContent += `Storage,${freeTierEligibility.storage ? "Free Tier" : "$" + infrastructureCosts.storage},${freeTierEligibility.storage ? "Yes" : "No"}\n`;
  csvContent += `Authentication,${freeTierEligibility.authentication ? "Free Tier" : "$" + infrastructureCosts.authentication},${freeTierEligibility.authentication ? "Yes" : "No"}\n`;

  // Other Services
  if (otherServices.length > 0) {
    csvContent += "\nOTHER SERVICES\n";
    csvContent += "Service,Monthly Cost\n";
    otherServices.forEach(service => {
      csvContent += `${service.name},$${service.cost}\n`;
    });
    csvContent += `TOTAL OTHER SERVICES,$${infrastructureCosts.otherServices}\n`;
  }
  
  csvContent += `\nTOTAL MONTHLY INFRASTRUCTURE,$${monthlyInfrastructureCost}\n`;
  csvContent += `TOTAL YEARLY INFRASTRUCTURE,$${yearlyInfrastructureCost}\n\n`;

  // Infrastructure Source Services
  csvContent += "INFRASTRUCTURE SOURCE SERVICES\n";
  
  // Hosting services
  csvContent += "\nHOSTING SERVICES\n";
  csvContent += "Service,Cost,Description\n";
  INFRASTRUCTURE_SOURCE_COSTS[selectedScope].hosting.forEach(source => {
    csvContent += `${source.serviceName},$${source.baseCost},${source.description}\n`;
  });
  
  // Database services
  csvContent += "\nDATABASE SERVICES\n";
  csvContent += "Service,Cost,Description\n";
  INFRASTRUCTURE_SOURCE_COSTS[selectedScope].database.forEach(source => {
    csvContent += `${source.serviceName},$${source.baseCost},${source.description}\n`;
  });
  
  // CDN services
  csvContent += "\nCDN SERVICES\n";
  csvContent += "Service,Cost,Description\n";
  INFRASTRUCTURE_SOURCE_COSTS[selectedScope].cdn.forEach(source => {
    csvContent += `${source.serviceName},$${source.baseCost},${source.description}\n`;
  });
  
  // CI/CD services
  csvContent += "\nCI/CD SERVICES\n";
  csvContent += "Service,Cost,Description\n";
  INFRASTRUCTURE_SOURCE_COSTS[selectedScope].cicd.forEach(source => {
    csvContent += `${source.serviceName},$${source.baseCost},${source.description}\n`;
  });
  
  // Storage services
  csvContent += "\nSTORAGE SERVICES\n";
  csvContent += "Service,Cost,Description\n";
  INFRASTRUCTURE_SOURCE_COSTS[selectedScope].storage.forEach(source => {
    csvContent += `${source.serviceName},$${source.baseCost},${source.description}\n`;
  });
  
  // Authentication services
  csvContent += "\nAUTHENTICATION SERVICES\n";
  csvContent += "Service,Cost,Description\n";
  INFRASTRUCTURE_SOURCE_COSTS[selectedScope].authentication.forEach(source => {
    csvContent += `${source.serviceName},$${source.baseCost},${source.description}\n`;
  });

  // Assumptions
  csvContent += "\nCALCULATION ASSUMPTIONS\n";
  csvContent += `Team Size,${TIMELINE_CALCULATOR.teamSize} developers\n`;
  csvContent += `Productive Hours,${TIMELINE_CALCULATOR.hoursPerWeekPerDev} hours/dev/week\n`;
  csvContent += `Timeline Adjustment,${timeline.multiplier.toFixed(2)}x base estimate\n`;

  return csvContent;
};

export const downloadCsv = (
  roles: Role[],
  selectedScope: Scope,
  infrastructureCosts: InfrastructureCost,
  userCount: number,
  timeline: TimelineAdjustment,
  freeTierEligibility: FreeTierEligibility,
  gbStorage: number,
  authUsers: number,
  otherServices: any[]
) => {
  const csvData = generateCsvData(
    roles, 
    selectedScope, 
    infrastructureCosts, 
    userCount, 
    timeline, 
    freeTierEligibility,
    gbStorage,
    authUsers,
    otherServices
  );
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'studio_price_calculator_report.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
