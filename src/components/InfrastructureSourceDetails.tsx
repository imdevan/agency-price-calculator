
import React, { useState } from 'react';
import { Scope, InfrastructureSourceCosts } from '@/types';
import { INFRASTRUCTURE_SOURCE_COSTS } from '@/data';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InfrastructureSourceDetailsProps {
  selectedScope: Scope;
  serviceType: 'hosting' | 'database' | 'cdn' | 'cicd' | 'storage' | 'authentication';
  serviceName: string;
  isFreeTier?: boolean;
}

const InfrastructureSourceDetails: React.FC<InfrastructureSourceDetailsProps> = ({
  selectedScope,
  serviceType,
  serviceName,
  isFreeTier = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sourceCosts = INFRASTRUCTURE_SOURCE_COSTS[selectedScope][serviceType];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mt-1">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center w-full justify-start p-1 h-auto mb-1 text-xs font-normal text-muted-foreground hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
        View source services
      </Button>
      
      {isExpanded && (
        <div className="bg-muted/50 rounded-md p-3 space-y-2 text-sm">
          <h4 className="font-medium text-xs uppercase tracking-wide mb-2 text-muted-foreground">Service Options</h4>
          {isFreeTier ? (
            <div className="text-green-600 text-sm pb-2">Using free tier</div>
          ) : null}
          {sourceCosts.map((source, index) => (
            <div key={index} className="border-b border-border/30 pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between">
                <span className="font-medium">{source.serviceName}</span>
                <span>{formatCurrency(source.baseCost)}/mo</span>
              </div>
              <p className="text-xs text-muted-foreground">{source.description}</p>
            </div>
          ))}
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
            These are representative examples of common services used for this scope. The calculated cost is an average estimate.
          </div>
        </div>
      )}
    </div>
  );
};

export default InfrastructureSourceDetails;
