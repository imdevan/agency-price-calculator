import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INFRASTRUCTURE_SOURCE_COSTS } from '@/data';
import { Scope } from '@/types';

interface ServiceProviderSelectionProps {
  serviceType: string;
  serviceName: string;
  selectedProvider: string;
  onSelect: (provider: string) => void;
  scope: Scope;
  isFreeTier: boolean;
  disabled?: boolean;
}

const ServiceProviderSelection: React.FC<ServiceProviderSelectionProps> = ({
  serviceType,
  serviceName,
  selectedProvider,
  onSelect,
  scope,
  isFreeTier,
  disabled
}) => {
  const providers = INFRASTRUCTURE_SOURCE_COSTS[scope]?.[serviceType as keyof typeof INFRASTRUCTURE_SOURCE_COSTS[typeof scope]];
  
  if (!providers || providers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-1">
      <Label htmlFor={`${serviceType}-provider`} className="text-xs">Provider</Label>
      <Select
        value={selectedProvider}
        onValueChange={onSelect}
        disabled={isFreeTier || disabled}
      >
        <SelectTrigger className="h-7 text-xs">
          <SelectValue placeholder="Select provider" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((provider, index) => (
            <SelectItem key={index} value={provider.serviceName}>
              {provider.serviceName} ({provider.baseCost > 0 ? `$${provider.baseCost}/mo` : 'Free'})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {providers.find(p => p.serviceName === selectedProvider)?.description && !isFreeTier && (
        <p className="text-xs text-muted-foreground">
          {providers.find(p => p.serviceName === selectedProvider)?.description}
        </p>
      )}
    </div>
  );
};

export default ServiceProviderSelection;
