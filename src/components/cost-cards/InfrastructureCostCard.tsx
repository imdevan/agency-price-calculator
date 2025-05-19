
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfrastructureCost } from '@/types';
import { formatCurrency } from '@/utils/exportUtils';

interface InfrastructureCostCardProps {
  infrastructureCosts: InfrastructureCost;
}

const InfrastructureCostCard: React.FC<InfrastructureCostCardProps> = ({
  infrastructureCosts
}) => {
  const totalInfrastructureCost = Object.values(infrastructureCosts).reduce((sum, cost) => sum + cost, 0);
  
  const hasAnyCosts = totalInfrastructureCost > 0;

  return (
    <Card className="mb-4">
      <CardHeader className="sticky top-[53px] bg-card z-30 border-b">
        <CardTitle className="text-lg">Infrastructure Cost (Monthly)</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {hasAnyCosts ? (
          <>
            <div className="space-y-2">
              {Object.entries(infrastructureCosts).map(([key, cost]) => {
                if (cost === 0) return null;
                const serviceName = key === 'otherServices' 
                  ? 'Other Services' 
                  : key.charAt(0).toUpperCase() + key.slice(1);
                
                return (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded bg-muted/50 p-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Service:</span> {serviceName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost:</span> {formatCurrency(cost)}/month
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 flex justify-between items-center font-medium">
              <div>Monthly Infrastructure Total</div>
              <div className="text-lg font-semibold text-primary">{formatCurrency(totalInfrastructureCost)}</div>
            </div>
            
            <div className="mt-1 flex justify-between items-center text-muted-foreground text-sm">
              <div>Estimated Annual Cost</div>
              <div>{formatCurrency(totalInfrastructureCost * 12)}</div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground italic">No infrastructure costs (all services using free tier)</p>
        )}
      </CardContent>
    </Card>
  );
};

export default InfrastructureCostCard;
