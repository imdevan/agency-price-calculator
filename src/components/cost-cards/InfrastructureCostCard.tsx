
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InfrastructureCost, FreeTierEligibility, Scope } from '@/types';
import { formatCurrency } from '@/utils/formatUtils';
import InfrastructureSourceDetails from '../InfrastructureSourceDetails';

interface InfrastructureCostCardProps {
  infrastructureCosts: InfrastructureCost;
  freeTierEligibility: FreeTierEligibility;
  monthlyInfrastructureCost: number;
  yearlyInfrastructureCost: number;
  userCount: number;
  selectedScope: Scope;
  otherServices?: Array<{ id: string; name: string; cost: number; description?: string }>;
}

const InfrastructureCostCard: React.FC<InfrastructureCostCardProps> = ({
  infrastructureCosts,
  freeTierEligibility,
  monthlyInfrastructureCost,
  yearlyInfrastructureCost,
  userCount,
  selectedScope,
  otherServices = []
}) => {
  return (
    <Card>
      <CardHeader className="pb-2 sticky top-[53px] bg-white z-40 border-b">
        <div>
          <CardTitle className="text-lg sm:text-xl">Infrastructure Costs</CardTitle>
          <CardDescription className="text-sm">Monthly costs based on {userCount.toLocaleString()} users</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full pt-3">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-2">Service</th>
              <th className="text-right pb-2 whitespace-nowrap min-w-[120px]">Monthly Cost</th>
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
            
            {otherServices.length > 0 && otherServices.map(service => (
              <tr key={service.id} className="border-b border-gray-100">
                <td className="py-2">
                  <div>{service.name}</div>
                  {service.description && (
                    <div className="text-xs text-muted-foreground">{service.description}</div>
                  )}
                </td>
                <td className="text-right py-2">
                  {freeTierEligibility.otherServices ? 
                    <span className="text-green-600">Free Tier</span> : 
                    formatCurrency(service.cost)}
                </td>
              </tr>
            ))}
            
            {otherServices.length > 0 && !freeTierEligibility.otherServices && (
              <tr className="font-medium border-t border-gray-300">
                <td className="pt-2">Other Services Total:</td>
                <td className="text-right pt-2">{formatCurrency(infrastructureCosts.otherServices)}</td>
              </tr>
            )}
            
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
  );
};

export default InfrastructureCostCard;
