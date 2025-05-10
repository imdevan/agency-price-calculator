
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, Scope, InfrastructureCost } from '@/types';
import { PROJECT_SCOPES, TIMELINE_CALCULATOR } from '@/data';
import InfrastructureSourceDetails from './InfrastructureSourceDetails';

interface CostBreakdownProps {
  roles: Role[];
  selectedScope: Scope;
  infrastructureCosts: InfrastructureCost;
  userCount: number;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({
  roles,
  selectedScope,
  infrastructureCosts,
  userCount,
}) => {
  // Calculate weekly costs based on hourly rate and weekly hours
  const weeklyRoleCosts = roles.map(role => {
    const weeklyCost = role.hourlyRate * role.weeklyHours;
    return { ...role, weeklyCost };
  });

  const totalWeeklyCost = weeklyRoleCosts.reduce((total, role) => total + role.weeklyCost, 0);
  const monthlyDevelopmentCost = totalWeeklyCost * 4.33; // Average weeks per month
  const yearlyDevelopmentCost = monthlyDevelopmentCost * 12;
  
  const totalInfrastructureCost = Object.values(infrastructureCosts).reduce((sum, cost) => sum + cost, 0);
  const monthlyInfrastructureCost = totalInfrastructureCost;
  const yearlyInfrastructureCost = monthlyInfrastructureCost * 12;
  
  const monthlyTotalCost = monthlyDevelopmentCost + monthlyInfrastructureCost;
  const yearlyTotalCost = yearlyDevelopmentCost + yearlyInfrastructureCost;
  
  // Calculate timeline - now based on weekly hours commitment
  const totalWeeklyHours = weeklyRoleCosts.reduce((sum, role) => sum + role.weeklyHours, 0);
  const developmentWeeks = totalWeeklyHours > 0 ? 
    Math.ceil(PROJECT_SCOPES[selectedScope].developmentTimeMultiplier * 4) : 
    "N/A (set weekly hours)";
  
  // Calculate total development cost based on timeline
  const totalDevelopmentCost = typeof developmentWeeks === 'number' ? 
    totalWeeklyCost * developmentWeeks : 
    "N/A";
  
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
              <span>Monthly Total Cost:</span>
              <span className="font-semibold">{formatCurrency(monthlyTotalCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Yearly Total Cost:</span>
              <span className="font-semibold">{formatCurrency(yearlyTotalCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Estimated Timeline:</span>
              <span className="font-semibold">{typeof developmentWeeks === 'number' ? `${developmentWeeks} weeks` : developmentWeeks}</span>
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
              {weeklyRoleCosts.map((role) => (
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
                  <InfrastructureSourceDetails selectedScope={selectedScope} serviceType="hosting" serviceName="Hosting" />
                </td>
                <td className="text-right py-2">{formatCurrency(infrastructureCosts.hosting)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>Database</div>
                  <InfrastructureSourceDetails selectedScope={selectedScope} serviceType="database" serviceName="Database" />
                </td>
                <td className="text-right py-2">{formatCurrency(infrastructureCosts.database)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>CDN</div>
                  <InfrastructureSourceDetails selectedScope={selectedScope} serviceType="cdn" serviceName="CDN" />
                </td>
                <td className="text-right py-2">{formatCurrency(infrastructureCosts.cdn)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">
                  <div>CI/CD</div>
                  <InfrastructureSourceDetails selectedScope={selectedScope} serviceType="cicd" serviceName="CI/CD" />
                </td>
                <td className="text-right py-2">{formatCurrency(infrastructureCosts.cicd)}</td>
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
