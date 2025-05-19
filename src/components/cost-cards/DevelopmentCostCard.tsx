
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, Scope, TimelineAdjustment } from '@/types';
import { PROJECT_SCOPES } from '@/data';
import { formatCurrency } from '@/utils/exportUtils';

interface DevelopmentCostCardProps {
  roles: Role[];
  selectedScope: Scope;
  timeline: TimelineAdjustment;
}

const DevelopmentCostCard: React.FC<DevelopmentCostCardProps> = ({
  roles,
  selectedScope,
  timeline
}) => {
  const hasActiveRoles = roles.some(r => r.weeklyHours > 0);
  
  // Calculate development cost
  const developmentCost = roles.reduce((sum, role) => {
    return sum + (role.hourlyRate * role.weeklyHours * timeline.adjustedWeeks);
  }, 0);
  
  const scope = PROJECT_SCOPES[selectedScope];

  return (
    <Card className="mb-4">
      <CardHeader className="sticky top-[53px] bg-card z-30 border-b">
        <CardTitle className="text-lg">Development Cost</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {hasActiveRoles ? (
          <>
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Scope</h4>
                  <p className="text-base font-medium">{scope.label}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Timeline</h4>
                  <p className="text-base font-medium">{timeline.adjustedWeeks} weeks</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total</h4>
                  <p className="text-lg font-semibold text-primary">{formatCurrency(developmentCost)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Team Composition</h4>
              {roles.filter(role => role.weeklyHours > 0).map((role) => (
                <div key={role.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded bg-muted/50 p-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Role:</span> {role.title}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hours:</span> {role.weeklyHours} hrs/week × {timeline.adjustedWeeks} weeks = {role.weeklyHours * timeline.adjustedWeeks} hours
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost:</span> {formatCurrency(role.hourlyRate * role.weeklyHours * timeline.adjustedWeeks)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground italic">No development resources allocated</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DevelopmentCostCard;
