
import React from 'react';
import { Role } from '@/types';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface RetainerEstimatorProps {
  roles: Role[];
  retainerHours: number;
  onRetainerHoursChange: (hours: number) => void;
  disabled?: boolean;
}

const RetainerEstimator: React.FC<RetainerEstimatorProps> = ({ 
  roles, 
  retainerHours, 
  onRetainerHoursChange,
  disabled = false
}) => {
  // Calculate weighted average hourly rate
  const calculateWeightedHourlyRate = () => {
    const totalHours = roles.reduce((sum, role) => sum + role.weeklyHours, 0);
    
    if (totalHours === 0) {
      // If no hours are allocated, use simple average of rates
      const totalRates = roles.reduce((sum, role) => sum + role.hourlyRate, 0);
      return totalRates / roles.length;
    }
    
    const weightedSum = roles.reduce((sum, role) => {
      const weight = role.weeklyHours / totalHours;
      return sum + (role.hourlyRate * weight);
    }, 0);
    
    return weightedSum;
  };
  
  const hourlyRate = calculateWeightedHourlyRate();
  const weeklyRetainerCost = hourlyRate * retainerHours;
  const monthlyRetainerCost = weeklyRetainerCost * 4.33; // Average weeks per month
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const handleSliderChange = (value: number[]) => {
    if (!disabled) {
      onRetainerHoursChange(value[0]);
    }
  };

  return (
    <div className={`space-y-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label htmlFor="retainer-hours">Weekly Support Hours</Label>
          <span className="font-medium">{retainerHours} hours</span>
        </div>
        <Slider
          id="retainer-hours"
          min={0}
          max={40}
          step={1}
          value={[retainerHours]}
          onValueChange={handleSliderChange}
          disabled={disabled}
          className="py-4"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Average Hourly Rate:</span>
          <span>{formatCurrency(hourlyRate)}/hour</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Weekly Retainer Cost:</span>
          <span>{formatCurrency(weeklyRetainerCost)}/week</span>
        </div>
        <div className="flex justify-between items-center font-semibold">
          <span>Monthly Retainer Cost:</span>
          <span>{formatCurrency(monthlyRetainerCost)}/month</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        <p>Retainer cost is calculated based on your team's average hourly rate and includes ongoing maintenance, bug fixes, and minor feature improvements after the initial development phase.</p>
      </div>
    </div>
  );
};

export default RetainerEstimator;
