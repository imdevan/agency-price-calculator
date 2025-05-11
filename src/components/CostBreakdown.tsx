
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, Scope, InfrastructureCost, TimelineAdjustment, FreeTierEligibility } from '@/types';
import { PROJECT_SCOPES } from '@/data';
import InfrastructureSourceDetails from './InfrastructureSourceDetails';

interface CostBreakdownProps {
  roles: Role[];
  selectedScope: Scope;
  infrastructureCosts: InfrastructureCost;
  userCount: number;
  timeline: TimelineAdjustment;
  freeTierEligibility: FreeTierEligibility;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({
  roles,
  selectedScope,
  infrastructureCosts,
  userCount,
  timeline,
  freeTierEligibility,
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
  
  // For yearly development costs, we cap it based on project timeline
  const yearlyDevelopmentCost = timeline.adjustedWeeks < 52 ? totalDevelopmentCost : monthlyDevelopmentCost * 12;
  
  // Monthly and yearly totals
  const monthlyTotalCost = monthlyDevelopmentCost + monthlyInfrastructureCost;
  const yearlyTotalCost = yearlyDevelopmentCost + yearlyInfrastructureCost;
  
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
  
  const formatCurrency = (amount: number | string) => {
    if (typeof amount === 'string') return amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex justify-between text-base">
              <span>Project Scope:</span>
              <span className="font-semibold">{PROJECT_SCOPES[selectedScope].label}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Weekly Development Cost:</span>
              <span className="font-semibold">{formatCurrency(totalWeeklyCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Monthly Development Cost:</span>
              <span className="font-semibold">{formatCurrency(monthlyDevelopmentCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Monthly Infrastructure Cost:</span>
              <span className="font-semibold">{formatCurrency(monthlyInfrastructureCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Monthly Total Cost:</span>
              <span className="font-semibold">{formatCurrency(monthlyTotalCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Yearly Total Cost:</span>
              <span className="font-semibold">{formatCurrency(yearlyTotalCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Estimated Timeline:</span>
              <span className="font-semibold">{formatTimeline(timeline.adjustedWeeks)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Estimated Development Cost:</span>
              <span className="font-semibold">{formatCurrency(totalDevelopmentCost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Development Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Role</th>
                <th className="text-right pb-2">Weekly Hours</th>
                <th className="text-right pb-2">Hourly Rate</th>
                <th className="text-right pb-2">Weekly Cost</th>
              </tr>
            </thead>
            <tbody>
              {weeklyRoleCosts.map((role) => role.weeklyHours > 0 && (
                <tr key={role.id} className="border-b border-gray-100">
                  <td className="py-2">{role.title}</td>
                  <td className="text-right py-2">{role.weeklyHours}</td>
                  <td className="text-right py-2">{formatCurrency(role.hourlyRate)}</td>
                  <td className="text-right py-2">{formatCurrency(role.weeklyCost)}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td colSpan={3} className="text-right pt-2">Total Weekly Development Cost:</td>
                <td className="text-right pt-2">{formatCurrency(totalWeeklyCost)}</td>
              </tr>
              <tr className="font-medium">
                <td colSpan={3} className="text-right pt-2">Total Monthly Development Cost:</td>
                <td className="text-right pt-2">{formatCurrency(monthlyDevelopmentCost)}</td>
              </tr>
              <tr className="font-medium">
                <td colSpan={3} className="text-right pt-2">Total Development Cost (Timeline):</td>
                <td className="text-right pt-2">{formatCurrency(totalDevelopmentCost)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Infrastructure Costs</CardTitle>
          <p className="text-sm text-muted-foreground">Monthly costs based on {userCount.toLocaleString()} users</p>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Service</th>
                <th className="text-right pb-2">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>Hosting</div>
                  <InfrastructureSourceDetails 
                    selectedScope={selectedScope} 
                    serviceType="hosting" 
                    serviceName="Hosting"
                    isFreeTier={freeTierEligibility.hosting} 
                  />
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.hosting ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(infrastructureCosts.hosting)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>Database</div>
                  <InfrastructureSourceDetails 
                    selectedScope={selectedScope} 
                    serviceType="database" 
                    serviceName="Database" 
                    isFreeTier={freeTierEligibility.database}
                  />
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.database ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(infrastructureCosts.database)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>CDN</div>
                  <InfrastructureSourceDetails 
                    selectedScope={selectedScope} 
                    serviceType="cdn" 
                    serviceName="CDN" 
                    isFreeTier={freeTierEligibility.cdn}
                  />
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.cdn ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(infrastructureCosts.cdn)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>CI/CD</div>
                  <InfrastructureSourceDetails 
                    selectedScope={selectedScope} 
                    serviceType="cicd" 
                    serviceName="CI/CD" 
                    isFreeTier={freeTierEligibility.cicd}
                  />
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.cicd ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(infrastructureCosts.cicd)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>Storage</div>
                  <InfrastructureSourceDetails 
                    selectedScope={selectedScope} 
                    serviceType="storage" 
                    serviceName="Storage" 
                    isFreeTier={freeTierEligibility.storage}
                  />
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.storage ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(infrastructureCosts.storage)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>Authentication</div>
                  <InfrastructureSourceDetails 
                    selectedScope={selectedScope} 
                    serviceType="authentication" 
                    serviceName="Authentication" 
                    isFreeTier={freeTierEligibility.authentication}
                  />
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.authentication ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(infrastructureCosts.authentication)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>Other Services</div>
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.otherServices ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(infrastructureCosts.otherServices)}
                </td>
              </tr>
              <tr className="font-medium">
                <td className="text-right pt-2">Total Monthly:</td>
                <td className="text-right pt-2">{formatCurrency(monthlyInfrastructureCost)}</td>
              </tr>
              <tr className="font-medium">
                <td className="text-right pt-2">Total Yearly:</td>
                <td className="text-right pt-2">{formatCurrency(yearlyInfrastructureCost)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostBreakdown;
