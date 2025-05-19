import React from 'react';
import { Role, Scope, InfrastructureCost, TimelineAdjustment, FreeTierEligibility } from '@/types';
import DevelopmentCostCard from './cost-cards/DevelopmentCostCard';
import InfrastructureCostCard from './cost-cards/InfrastructureCostCard';
import RetainerCostCard from './cost-cards/RetainerCostCard';
import OtherServicesCostCard from './cost-cards/OtherServicesCostCard';
import TotalCostSummaryCard from './cost-cards/TotalCostSummaryCard';

interface OtherService {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

interface SeparatedCostBreakdownProps {
  roles: Role[];
  selectedScope: Scope;
  infrastructureCosts: InfrastructureCost;
  userCount: number;
  timeline: TimelineAdjustment;
  freeTierEligibility: FreeTierEligibility;
  retainerHours: number;
  showRetainer: boolean;
  showInfrastructure: boolean;
  showDevelopment: boolean;
  otherServices: OtherService[];
}

const SeparatedCostBreakdown: React.FC<SeparatedCostBreakdownProps> = ({
  roles,
  selectedScope,
  infrastructureCosts,
  timeline,
  freeTierEligibility,
  retainerHours,
  showRetainer,
  showInfrastructure,
  showDevelopment,
  otherServices
}) => {
  // Calculate development cost
  const developmentCost = roles.reduce((sum, role) => {
    return sum + (role.hourlyRate * role.weeklyHours * timeline.adjustedWeeks);
  }, 0);

  // Calculate monthly infrastructure cost
  const monthlyInfrastructureCost = Object.values(infrastructureCosts).reduce((sum, cost) => sum + cost, 0);
  
  // Calculate monthly retainer cost
  const seniorDev = roles.find(role => role.id === 'seniorDev');
  const monthlyRetainerCost = seniorDev ? seniorDev.hourlyRate * retainerHours : 0;

  return (
    <div className="space-y-2">
      {/* Total Summary Card - Always shown */}
      <TotalCostSummaryCard 
        developmentCost={developmentCost}
        monthlyInfrastructureCost={monthlyInfrastructureCost}
        monthlyRetainerCost={monthlyRetainerCost}
        showDevelopment={showDevelopment}
        showInfrastructure={showInfrastructure}
        showRetainer={showRetainer}
      />

      {/* Development Cost Card */}
      {showDevelopment && (
        <DevelopmentCostCard 
          roles={roles}
          selectedScope={selectedScope}
          timeline={timeline}
        />
      )}
      
      {/* Infrastructure Cost Card */}
      {showInfrastructure && (
        <InfrastructureCostCard infrastructureCosts={infrastructureCosts} />
      )}
      
      {/* Monthly Retainer Card */}
      {showRetainer && retainerHours > 0 && (
        <RetainerCostCard 
          roles={roles}
          retainerHours={retainerHours}
        />
      )}
      
      {/* Other Services Card */}
      {showInfrastructure && otherServices.length > 0 && (
        <OtherServicesCostCard 
          otherServices={otherServices}
          isFreeTier={freeTierEligibility.otherServices}
        />
      )}
    </div>
  );
};

export default SeparatedCostBreakdown;
