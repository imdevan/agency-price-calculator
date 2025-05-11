
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AUTHENTICATION_COST_CALCULATOR } from '@/data';

interface AuthCostInputProps {
  users: number;
  onChange: (value: number) => void;
  cost: number;
  isFreeTier: boolean;
}

const AuthCostInput: React.FC<AuthCostInputProps> = ({ users, onChange, cost, isFreeTier }) => {
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
        <Label htmlFor="auth-users">Auth Users (MAU)</Label>
        <span className="font-semibold">{formatCurrency(cost)}/mo</span>
      </div>
      <div className="flex items-center space-x-2">
        <Input 
          id="auth-users"
          type="number" 
          min="0"
          value={users} 
          onChange={handleChange}
          className="h-8"
          disabled={isFreeTier}
        />
        <span className="text-sm text-muted-foreground">MAU</span>
      </div>
      {isFreeTier ? (
        <p className="text-xs text-muted-foreground">
          Using free tier (up to {AUTHENTICATION_COST_CALCULATOR.freeMAUs.toLocaleString()} MAU)
        </p>
      ) : users <= AUTHENTICATION_COST_CALCULATOR.freeMAUs ? (
        <p className="text-xs text-muted-foreground">
          You qualify for free tier (up to {AUTHENTICATION_COST_CALCULATOR.freeMAUs.toLocaleString()} MAU)
        </p>
      ) : null}
    </div>
  );
};

export default AuthCostInput;
