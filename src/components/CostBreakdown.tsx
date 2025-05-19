
import React from 'react';
import { Role, Scope, InfrastructureCost, TimelineAdjustment, FreeTierEligibility } from '@/types';
import ProjectSummaryCard from './cost-cards/ProjectSummaryCard';
import DevelopmentCostCard from './cost-cards/DevelopmentCostCard';
import InfrastructureCostCard from './cost-cards/InfrastructureCostCard';
import TotalCostBreakdownCard from './cost-cards/TotalCostBreakdownCard';
import RetainerCostCard from './cost-cards/RetainerCostCard';

interface CostBreakdownProps {
  roles: Role[];
  selectedScope: Scope;
  infrastructureCosts: InfrastructureCost;
  userCount: number;
  timeline: TimelineAdjustment;
  freeTierEligibility: FreeTierEligibility;
  retainerHours?: number;
  showRetainer?: boolean;
  showInfrastructure?: boolean;
  showDevelopment?: boolean;
  otherServices?: Array<{ id: string; name: string; cost: number; description?: string }>;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({
  roles,
  selectedScope,
  infrastructureCosts,
  userCount,
  timeline,
  freeTierEligibility,
  retainerHours = 0,
  showRetainer = true,
  showInfrastructure = true,
  showDevelopment = true,
  otherServices = []
}) => {
  // Calculate weekly costs based on hourly rate and weekly hours
  const weeklyRoleCosts = roles.map(role => {
    const weeklyCost = role.hourlyRate * role.weeklyHours;
    return { ...role, weeklyCost };
  });

  const totalWeeklyCost = weeklyRoleCosts.reduce((total, role) => total + role.weeklyCost, 0);
  const monthlyDevelopmentCost = totalWeeklyCost * 4.33; // Average weeks per month
  
  // Calculate total development cost based on adjusted timeline
  const totalDevelopmentCost = totalWeeklyCost * timeline.adjustedWeeks;
  
  // Calculate infrastructure costs
  const totalInfrastructureCost = Object.keys(infrastructureCosts).reduce((sum, key) => {
    const costKey = key as keyof InfrastructureCost;
    const isFree = freeTierEligibility[costKey as keyof FreeTierEligibility];
    return sum + (isFree ? 0 : infrastructureCosts[costKey]);
  }, 0);
  
  const monthlyInfrastructureCost = totalInfrastructureCost;
  const yearlyInfrastructureCost = monthlyInfrastructureCost * 12;
  
  // Calculate retainer costs
  const calculateWeightedHourlyRate = () => {
    const totalHours = roles.reduce((sum, role) => sum + role.weeklyHours, 0);
    
    if (totalHours === 0) {
      // If no hours are allocated, use simple average of rates
      const totalRates = roles.reduce((sum, role) => sum + role.hourlyRate, 0);
      return totalRates / roles.length;
    }
    
    const weightedSum = roles.reduce((sum, role) => {
      const weight = role.weeklyHours / totalHours;
      return sum + (role.hourlyRate * weight);
    }, 0);
    
    return weightedSum;
  };
  
  const hourlyRate = calculateWeightedHourlyRate();
  const weeklyRetainerCost = hourlyRate * retainerHours;
  const monthlyRetainerCost = weeklyRetainerCost * 4.33;
  const yearlyRetainerCost = monthlyRetainerCost * 12;
  
  // For yearly development costs, we cap it based on project timeline
  const yearlyDevelopmentCost = timeline.adjustedWeeks < 52 ? totalDevelopmentCost : monthlyDevelopmentCost * 12;
  
  // Monthly and yearly totals (with retainer)
  const monthlyTotalDevCost = monthlyDevelopmentCost + 
    (showInfrastructure ? monthlyInfrastructureCost : 0);
      
  // Monthly and yearly totals (with retainer)
  const monthlyTotalRetainerCost = ((showRetainer && retainerHours > 0) ? monthlyRetainerCost : 0) + 
    (showInfrastructure ? monthlyInfrastructureCost : 0);
  
  const yearlyTotalCost = yearlyDevelopmentCost + 
    (showInfrastructure ? yearlyInfrastructureCost : 0) + 
    ((showRetainer && retainerHours > 0) ? 
      // Pro-rate retainer cost based on remaining weeks in year after development
      (yearlyRetainerCost * ((52 - timeline.adjustedWeeks) / 52)) : 0);

  // Determine if we should show the Total Cost Breakdown section
  // Hide if both infrastructure and retainer are disabled
  const showTotalCostBreakdown = showInfrastructure || (showRetainer && retainerHours > 0);

  return (
    <div className="space-y-6">
      {/* Project Summary Card */}
      {showDevelopment && (
        <ProjectSummaryCard
          selectedScope={selectedScope}
          timeline={timeline}
          totalDevelopmentCost={totalDevelopmentCost}
        />
      )}

      {/* Development Costs Card */}
      {showDevelopment && (
        <DevelopmentCostCard
          roles={roles}
          timeline={timeline}
          totalWeeklyCost={totalWeeklyCost}
          monthlyDevelopmentCost={monthlyDevelopmentCost}
          totalDevelopmentCost={totalDevelopmentCost}
        />
      )}

      {/* Infrastructure Costs Card */}
      {showInfrastructure && (
        <InfrastructureCostCard
          infrastructureCosts={infrastructureCosts}
          freeTierEligibility={freeTierEligibility}
          monthlyInfrastructureCost={monthlyInfrastructureCost}
          yearlyInfrastructureCost={yearlyInfrastructureCost}
          userCount={userCount}
          selectedScope={selectedScope}
          otherServices={otherServices}
        />
      )}

      {/* Total Cost Breakdown Card */}
      {showTotalCostBreakdown && (
        <TotalCostBreakdownCard
          selectedScope={selectedScope}
          totalWeeklyCost={totalWeeklyCost}
          monthlyDevelopmentCost={monthlyDevelopmentCost}
          monthlyInfrastructureCost={monthlyInfrastructureCost}
          timeline={timeline}
          totalDevelopmentCost={totalDevelopmentCost}
          showInfrastructure={showInfrastructure}
        />
      )}

      {/* Retainer Costs Card */}
      {showRetainer && retainerHours > 0 && (
        <RetainerCostCard
          retainerHours={retainerHours}
          hourlyRate={hourlyRate}
          weeklyRetainerCost={weeklyRetainerCost}
          monthlyRetainerCost={monthlyRetainerCost}
          yearlyRetainerCost={yearlyRetainerCost}
        />
      )}
    </div>
  );
};

export default CostBreakdown;
