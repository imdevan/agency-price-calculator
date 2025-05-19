
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/utils/exportUtils';

interface TotalCostSummaryCardProps {
  developmentCost: number;
  monthlyInfrastructureCost: number;
  monthlyRetainerCost: number;
  showDevelopment: boolean;
  showRetainer: boolean;
  showInfrastructure: boolean;
}

const TotalCostSummaryCard: React.FC<TotalCostSummaryCardProps> = ({
  developmentCost,
  monthlyInfrastructureCost,
  monthlyRetainerCost,
  showDevelopment,
  showRetainer,
  showInfrastructure
}) => {
  // Only add costs that should be shown
  let totalInitialCost = 0;
  if (showDevelopment) totalInitialCost += developmentCost;
  
  let totalMonthlyCost = 0;
  if (showInfrastructure) totalMonthlyCost += monthlyInfrastructureCost;
  if (showRetainer) totalMonthlyCost += monthlyRetainerCost;
  
  const annualInfrastructureCost = monthlyInfrastructureCost * 12;
  const annualRetainerCost = monthlyRetainerCost * 12;
  
  // First year total costs
  const firstYearCost = totalInitialCost + totalMonthlyCost * 12;

  return (
    <Card className="mb-4 bg-primary-foreground">
      <CardHeader className="sticky top-[53px] bg-primary-foreground z-30 border-b">
        <CardTitle className="text-primary text-lg">Total Project Cost Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-card rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Initial Investment</h3>
              {showDevelopment && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Development Cost:</span>
                  <span>{formatCurrency(developmentCost)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Initial Cost:</span>
                <span>{formatCurrency(totalInitialCost)}</span>
              </div>
            </div>
            
            <div className="p-3 bg-card rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Ongoing Costs (Monthly)</h3>
              {showInfrastructure && (
                <div className="flex justify-between text-sm mb-1">
                  <span>Infrastructure:</span>
                  <span>{formatCurrency(monthlyInfrastructureCost)}/mo</span>
                </div>
              )}
              {showRetainer && (
                <div className="flex justify-between text-sm mb-1">
                  <span>Support Retainer:</span>
                  <span>{formatCurrency(monthlyRetainerCost)}/mo</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Monthly:</span>
                <span>{formatCurrency(totalMonthlyCost)}/mo</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-lg">
            <h3 className="text-sm font-medium mb-2">First Year Total Cost Projection</h3>
            <div className="space-y-1 text-sm">
              {showDevelopment && (
                <div className="flex justify-between">
                  <span>Initial Development:</span>
                  <span>{formatCurrency(developmentCost)}</span>
                </div>
              )}
              {showInfrastructure && (
                <div className="flex justify-between">
                  <span>Annual Infrastructure:</span>
                  <span>{formatCurrency(annualInfrastructureCost)}</span>
                </div>
              )}
              {showRetainer && (
                <div className="flex justify-between">
                  <span>Annual Support Retainer:</span>
                  <span>{formatCurrency(annualRetainerCost)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2 text-primary">
                <span>First Year Total:</span>
                <span>{formatCurrency(firstYearCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalCostSummaryCard;
