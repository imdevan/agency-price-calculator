
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scope, TimelineAdjustment } from '@/types';
import { PROJECT_SCOPES } from '@/data';
import { formatCurrency } from '@/utils/formatUtils';

interface ProjectSummaryCardProps {
  selectedScope: Scope;
  timeline: TimelineAdjustment;
  totalDevelopmentCost: number;
}

const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  selectedScope,
  timeline,
  totalDevelopmentCost
}) => {
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

  const formattedTimelineText = formatTimeline(timeline.adjustedWeeks);

  return (
    <Card>
      <CardHeader className="pb-2 border-b">
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
  );
};

export default ProjectSummaryCard;
