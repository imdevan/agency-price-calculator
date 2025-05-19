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
  

  // Format timeline in weeks
  const formatTimelineInWeeks = (weeks: number) => {
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
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

  const formattedTimelineText = formatTimeline(timeline.adjustedWeeks);
  const formattedTimelineInWeeks = formatTimelineInWeeks(timeline.adjustedWeeks);

  // Determine if we should show the Total Cost Breakdown section
  // Hide if both infrastructure and retainer are disabled
  const showTotalCostBreakdown = showInfrastructure || (showRetainer && retainerHours > 0);

  return (
    <div className="space-y-6">
      {/* New Summary Card at the top */}
      {showDevelopment && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between text-base">
                <span>Project Scope:</span>
                <span className="font-semibold">{PROJECT_SCOPES[selectedScope].label}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Estimated Timeline:</span>
                <span className="font-semibold">{formattedTimelineText}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Estimated Development Cost:</span>
                <span className="font-semibold">{formatCurrency(totalDevelopmentCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showDevelopment && (
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
                  <th className="text-right pb-2">Total Hours</th>
                  <th className="text-right pb-2">Hourly Rate</th>
                  <th className="text-right pb-2">Weekly Cost</th>
                </tr>
              </thead>
              <tbody>
                {weeklyRoleCosts.map((role) => role.weeklyHours > 0 && (
                  <tr key={role.id} className="border-b border-gray-100">
                    <td className="py-2 whitespace-nowrap min-w-[120px]">{role.title}</td>
                    <td className="text-right py-2">{role.weeklyHours}</td>
                    <td className="text-right py-2">{role.weeklyHours * timeline.adjustedWeeks}</td>
                    <td className="text-right py-2">{formatCurrency(role.hourlyRate)}</td>
                    <td className="text-right py-2">{formatCurrency(role.weeklyCost)}</td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td colSpan={4} className="text-right pt-2">Total Weekly Development Cost:</td>
                  <td className="text-right pt-2">{formatCurrency(totalWeeklyCost)}</td>
                </tr>
                <tr className="font-medium">
                  <td colSpan={4} className="text-right pt-2">Total Monthly Development Cost:</td>
                  <td className="text-right pt-2">{formatCurrency(monthlyDevelopmentCost)}</td>
                </tr>
                <tr className="font-medium">
                  <td colSpan={4} className="text-right pt-2">Total Development Cost ({formattedTimelineInWeeks}):</td>
                  <td className="text-right pt-2">{formatCurrency(totalDevelopmentCost)}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {showInfrastructure && (
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
                
                {/* Display each other service as a separate line item */}
                {otherServices && otherServices.length > 0 && otherServices.map(service => (
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
                
                {/* Display a sum line for other services only if there are any */}
                {otherServices && otherServices.length > 0 && !freeTierEligibility.otherServices && (
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
      )}

      {/* Total Cost Breakdown - conditionally display */}
      {showTotalCostBreakdown && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Cost Breakdown</CardTitle>
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
              {showInfrastructure && (
                <div className="flex justify-between text-base">
                  <span>Monthly Infrastructure Cost:</span>
                  <span className="font-semibold">{formatCurrency(monthlyInfrastructureCost)}</span>
                </div>
              )}
              {/* {showRetainer && retainerHours > 0 && (
                <div className="flex justify-between text-base">
                  <span>Monthly Retainer Cost:</span>
                  <span className="font-semibold">{formatCurrency(monthlyRetainerCost)}</span>
                </div>
              )} */}
              {/* <div className="flex justify-between text-base">
                <span>Yearly Total Cost:</span>
                <span className="font-semibold">{formatCurrency(yearlyTotalCost)}</span>
              </div> */}
              <div className="flex justify-between text-base">
                <span>Estimated Timeline:</span>
                <span className="font-semibold">{formattedTimelineText}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Estimated Development Cost:</span>
                <span className="font-semibold">{formatCurrency(totalDevelopmentCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


      {showRetainer && retainerHours > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Retainer Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between text-base">
                  <span>Weekly Support Hours:</span>
                  <span className="font-semibold">{retainerHours} hours</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Average Hourly Rate:</span>
                  <span className="font-semibold">{formatCurrency(hourlyRate)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Weekly Retainer Cost:</span>
                  <span className="font-semibold">{formatCurrency(weeklyRetainerCost)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Monthly Retainer Cost:</span>
                  <span className="font-semibold">{formatCurrency(monthlyRetainerCost)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Yearly Retainer Cost:</span>
                  <span className="font-semibold">{formatCurrency(yearlyRetainerCost)}</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>This retainer estimate is based on the average hourly rate of your selected team composition and includes regular maintenance, bug fixes, and minor feature enhancements.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostBreakdown;
