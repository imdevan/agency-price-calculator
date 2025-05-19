
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/utils/formatUtils';

interface RetainerCostCardProps {
  retainerHours: number;
  hourlyRate: number;
  weeklyRetainerCost: number;
  monthlyRetainerCost: number;
  yearlyRetainerCost: number;
}

const RetainerCostCard: React.FC<RetainerCostCardProps> = ({
  retainerHours,
  hourlyRate,
  weeklyRetainerCost,
  monthlyRetainerCost,
  yearlyRetainerCost
}) => {
  return (
    <Card>
      <CardHeader className="pb-2 sticky top-[53px] bg-white z-40 border-b">
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
  );
};

export default RetainerCostCard;
