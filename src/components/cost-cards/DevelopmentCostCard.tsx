
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, TimelineAdjustment } from '@/types';
import { formatCurrency } from '@/utils/formatUtils';

interface DevelopmentCostCardProps {
  roles: Role[];
  timeline: TimelineAdjustment;
  totalWeeklyCost: number;
  monthlyDevelopmentCost: number;
  totalDevelopmentCost: number;
}

const DevelopmentCostCard: React.FC<DevelopmentCostCardProps> = ({
  roles,
  timeline,
  totalWeeklyCost,
  monthlyDevelopmentCost,
  totalDevelopmentCost
}) => {
  const formatTimelineInWeeks = (weeks: number) => {
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  };
  
  const formattedTimelineInWeeks = formatTimelineInWeeks(timeline.adjustedWeeks);

  return (
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
            {roles.map((role) => role.weeklyHours > 0 && (
              <tr key={role.id} className="border-b border-gray-100">
                <td className="py-2 whitespace-nowrap min-w-[120px]">{role.title}</td>
                <td className="text-right py-2">{role.weeklyHours}</td>
                <td className="text-right py-2">{role.weeklyHours * timeline.adjustedWeeks}</td>
                <td className="text-right py-2">{formatCurrency(role.hourlyRate)}</td>
                <td className="text-right py-2">{formatCurrency(role.hourlyRate * role.weeklyHours)}</td>
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
  );
};

export default DevelopmentCostCard;
