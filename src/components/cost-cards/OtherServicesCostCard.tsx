
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/utils/exportUtils';

interface OtherService {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

interface OtherServicesCostCardProps {
  otherServices: OtherService[];
  isFreeTier: boolean;
}

const OtherServicesCostCard: React.FC<OtherServicesCostCardProps> = ({
  otherServices,
  isFreeTier
}) => {
  if (otherServices.length === 0) return null;
  
  const totalOtherServicesCost = isFreeTier 
    ? 0
    : otherServices.reduce((sum, service) => sum + service.cost, 0);

  return (
    <Card className="mb-4">
      <CardHeader className="sticky top-[53px] bg-card z-30 border-b">
        <CardTitle className="text-lg">Other Services (Monthly)</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isFreeTier ? (
          <p className="text-muted-foreground italic">All other services using free tier</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {otherServices.map((service) => (
                <div key={service.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded bg-muted/50 p-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Service:</span> {service.name}
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Cost:</span> {formatCurrency(service.cost)}/month
                    {service.description && (
                      <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-2 flex justify-between items-center font-medium">
              <div>Total Other Services</div>
              <div className="text-primary">{formatCurrency(totalOtherServicesCost)}/month</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OtherServicesCostCard;
