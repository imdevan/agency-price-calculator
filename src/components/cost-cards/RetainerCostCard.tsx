
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role } from '@/types';
import { formatCurrency } from '@/utils/exportUtils';

interface RetainerCostCardProps {
  roles: Role[];
  retainerHours: number;
}

const RetainerCostCard: React.FC<RetainerCostCardProps> = ({
  roles,
  retainerHours
}) => {
  // Get the senior developer role for retainer calculations
  const seniorDev = roles.find(role => role.id === 'seniorDev');
  
  // Calculate monthly retainer cost if we have a senior dev
  const retainerCost = seniorDev ? seniorDev.hourlyRate * retainerHours : 0;
  
  return (
    <Card className="mb-4">
      <CardHeader className="sticky top-[53px] bg-card z-30 border-b">
        <CardTitle className="text-lg">Monthly Retainer</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {retainerHours > 0 && seniorDev ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Monthly Hours</h4>
                <p className="text-base font-medium">{retainerHours} hrs/month</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Hourly Rate</h4>
                <p className="text-base font-medium">{formatCurrency(seniorDev.hourlyRate)}/hr</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Monthly Cost</h4>
                <p className="text-lg font-semibold text-primary">{formatCurrency(retainerCost)}</p>
              </div>
            </div>
            
            <div className="text-muted-foreground text-sm">
              <p>Includes ongoing maintenance, bug fixes, and minor enhancements</p>
              <p className="mt-1">Annual retainer cost: {formatCurrency(retainerCost * 12)}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic">No monthly retainer selected</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RetainerCostCard;
