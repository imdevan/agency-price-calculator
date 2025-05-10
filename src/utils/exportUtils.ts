
import { Role, Scope, InfrastructureCost } from '@/types';
import { PROJECT_SCOPES, TIMELINE_CALCULATOR } from '@/data';

export const generateCsvData = (
  roles: Role[],
  selectedScope: Scope,
  infrastructureCosts: InfrastructureCost,
  userCount: number
) => {
  const scope = PROJECT_SCOPES[selectedScope];
  const roleCosts = roles.map(role => {
    const hours = scope.roles[role.id] || 0;
    const cost = hours * role.hourlyRate;
    return { ...role, hours, cost };
  });

  const totalDevelopmentCost = roleCosts.reduce((total, role) => total + role.cost, 0);
  const totalInfrastructureCost = Object.values(infrastructureCosts).reduce((sum, cost) => sum + cost, 0);
  const monthlyInfrastructureCost = totalInfrastructureCost;
  const yearlyInfrastructureCost = monthlyInfrastructureCost * 12;
  
  // Calculate timeline
  const totalHours = roleCosts.reduce((sum, role) => sum + role.hours, 0);
  const developmentWeeks = Math.ceil(totalHours / 
    (TIMELINE_CALCULATOR.teamSize * TIMELINE_CALCULATOR.hoursPerWeekPerDev));

  // Build CSV content
  let csvContent = "Studio Price Calculator Report\n\n";

  // Summary Section
  csvContent += "SUMMARY\n";
  csvContent += `Project Type,${scope.label}\n`;
  csvContent += `Estimated Users,${userCount}\n`;
  csvContent += `Total Development Cost,$${totalDevelopmentCost}\n`;
  csvContent += `Estimated Timeline,${developmentWeeks} weeks\n`;
  csvContent += `Monthly Infrastructure Cost,$${monthlyInfrastructureCost}\n`;
  csvContent += `Yearly Infrastructure Cost,$${yearlyInfrastructureCost}\n\n`;

  // Development Costs
  csvContent += "DEVELOPMENT COSTS\n";
  csvContent += "Role,Hours,Rate,Cost\n";
  roleCosts.forEach(role => {
    csvContent += `${role.title},${role.hours},$${role.hourlyRate},$${role.cost}\n`;
  });
  csvContent += `TOTAL,,,\$${totalDevelopmentCost}\n\n`;

  // Infrastructure Costs
  csvContent += "INFRASTRUCTURE COSTS\n";
  csvContent += "Service,Monthly Cost\n";
  csvContent += `Hosting,$${infrastructureCosts.hosting}\n`;
  csvContent += `Database,$${infrastructureCosts.database}\n`;
  csvContent += `CDN,$${infrastructureCosts.cdn}\n`;
  csvContent += `CI/CD,$${infrastructureCosts.cicd}\n`;
  csvContent += `TOTAL MONTHLY,$${monthlyInfrastructureCost}\n`;
  csvContent += `TOTAL YEARLY,$${yearlyInfrastructureCost}\n\n`;

  // Assumptions
  csvContent += "CALCULATION ASSUMPTIONS\n";
  csvContent += `Team Size,${TIMELINE_CALCULATOR.teamSize} developers\n`;
  csvContent += `Productive Hours,${TIMELINE_CALCULATOR.hoursPerWeekPerDev} hours/dev/week\n`;

  return csvContent;
};

export const downloadCsv = (
  roles: Role[],
  selectedScope: Scope,
  infrastructureCosts: InfrastructureCost,
  userCount: number
) => {
  const csvData = generateCsvData(roles, selectedScope, infrastructureCosts, userCount);
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
