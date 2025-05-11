
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Role } from '@/types';

interface RetainerEstimatorProps {
  roles: Role[];
  retainerHours: number;
  onRetainerHoursChange: (hours: number) => void;
}

const RetainerEstimator: React.FC<RetainerEstimatorProps> = ({ 
  roles, 
  retainerHours,
  onRetainerHoursChange
}) => {
  // Calculate weighted average hourly rate based on role weekly hours
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
  const monthlyRetainerCost = hourlyRate * retainerHours * 4.33; // Average weeks per month
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      onRetainerHoursChange(values[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Ongoing support retainers provide continued maintenance and improvements after the initial project is complete.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="retainer-hours">Weekly Support Hours</Label>
          <span className="text-sm font-medium">{retainerHours} hours</span>
        </div>
        <Slider 
          id="retainer-hours"
          min={0} 
          max={40} 
          step={1} 
          value={[retainerHours]} 
          onValueChange={handleSliderChange} 
        />
        <div className="text-xs text-muted-foreground">
          Adjust the number of support hours needed per week
        </div>
      </div>
      
      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between">
          <span>Average Hourly Rate:</span>
          <span className="font-medium">{formatCurrency(hourlyRate)}</span>
        </div>
        <div className="flex justify-between">
          <span>Weekly Retainer Cost:</span>
          <span className="font-medium">{formatCurrency(hourlyRate * retainerHours)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Monthly Retainer Cost:</span>
          <span className="font-medium">{formatCurrency(monthlyRetainerCost)}</span>
        </div>
      </div>
    </div>
  );
};

export default RetainerEstimator;
