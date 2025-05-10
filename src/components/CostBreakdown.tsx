
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, Scope, InfrastructureCost } from '@/types';
import { PROJECT_SCOPES, TIMELINE_CALCULATOR } from '@/data';

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
  const totalCost = totalDevelopmentCost + yearlyInfrastructureCost;
  
  // Calculate timeline
  const totalHours = roleCosts.reduce((sum, role) => sum + role.hours, 0);
  const developmentWeeks = Math.ceil(totalHours / 
    (TIMELINE_CALCULATOR.teamSize * TIMELINE_CALCULATOR.hoursPerWeekPerDev));
  
  const formatCurrency = (amount: number) => {
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
              <span>Total Project Cost:</span>
              <span className="font-semibold">{formatCurrency(totalDevelopmentCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Estimated Timeline:</span>
              <span className="font-semibold">{developmentWeeks} weeks</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Monthly Infrastructure Cost:</span>
              <span className="font-semibold">{formatCurrency(monthlyInfrastructureCost)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Yearly Infrastructure Cost:</span>
              <span className="font-semibold">{formatCurrency(yearlyInfrastructureCost)}</span>
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
                <th className="text-right pb-2">Hours</th>
                <th className="text-right pb-2">Rate</th>
                <th className="text-right pb-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {roleCosts.map((role) => (
                <tr key={role.id} className="border-b border-gray-100">
                  <td className="py-2">{role.title}</td>
                  <td className="text-right py-2">{role.hours}</td>
                  <td className="text-right py-2">{formatCurrency(role.hourlyRate)}</td>
                  <td className="text-right py-2">{formatCurrency(role.cost)}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td colSpan={3} className="text-right pt-2">Total Development Cost:</td>
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
                <td className="py-2">Hosting</td>
                <td className="text-right py-2">{formatCurrency(infrastructureCosts.hosting)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Database</td>
                <td className="text-right py-2">{formatCurrency(infrastructureCosts.database)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">CDN</td>
                <td className="text-right py-2">{formatCurrency(infrastructureCosts.cdn)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">CI/CD</td>
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
