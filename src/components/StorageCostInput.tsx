
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { STORAGE_COST_CALCULATOR } from '@/data';

interface StorageCostInputProps {
  gbStored: number;
  onChange: (value: number) => void;
  cost: number;
  isFreeTier: boolean;
}

const StorageCostInput: React.FC<StorageCostInputProps> = ({ gbStored, onChange, cost, isFreeTier }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onChange(value);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="storage-gb">Storage (GB)</Label>
        <span className="font-semibold">{formatCurrency(cost)}/mo</span>
      </div>
      <div className="flex items-center space-x-2">
        <Input 
          id="storage-gb"
          type="number" 
          min="0"
          value={gbStored} 
          onChange={handleChange}
          className="h-8"
          disabled={isFreeTier}
        />
        <span className="text-sm text-muted-foreground">GB</span>
      </div>
      {isFreeTier && (
        <p className="text-xs text-muted-foreground">
          Using free tier ({STORAGE_COST_CALCULATOR.baseFreeGB}GB included)
        </p>
      )}
    </div>
  );
};

export default StorageCostInput;
