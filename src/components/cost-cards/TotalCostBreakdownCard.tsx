
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scope, TimelineAdjustment } from '@/types';
import { PROJECT_SCOPES } from '@/data';
import { formatCurrency } from '@/utils/formatUtils';

interface TotalCostBreakdownCardProps {
  selectedScope: Scope;
  totalWeeklyCost: number;
  monthlyDevelopmentCost: number;
  monthlyInfrastructureCost: number;
  timeline: TimelineAdjustment;
  totalDevelopmentCost: number;
  showInfrastructure: boolean;
}

const TotalCostBreakdownCard: React.FC<TotalCostBreakdownCardProps> = ({
  selectedScope,
  totalWeeklyCost,
  monthlyDevelopmentCost,
  monthlyInfrastructureCost,
  timeline,
  totalDevelopmentCost,
  showInfrastructure
}) => {
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

  const formattedTimelineText = formatTimeline(timeline.adjustedWeeks);

  return (
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
  );
};

export default TotalCostBreakdownCard;
