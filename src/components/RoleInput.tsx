
import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Role } from '@/types';

interface RoleInputProps {
  role: Role;
  onChange: (id: string, field: 'hourlyRate' | 'weeklyHours', value: number) => void;
  totalProjectHours?: number;
}

const RoleInput: React.FC<RoleInputProps> = ({ role, onChange, totalProjectHours }) => {
  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onChange(role.id, 'hourlyRate', value);
    }
  };

  const handleWeeklyHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onChange(role.id, 'weeklyHours', value);
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
    <Card className="p-4 mb-4">
      <div className="font-medium text-lg mb-2">{role.title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor={`${role.id}-hourly-rate`}>Hourly Rate</Label>
          <Input
            id={`${role.id}-hourly-rate`}
            type="number"
            value={role.hourlyRate}
            onChange={handleHourlyRateChange}
            min={0}
            className="h-9"
          />
          <div className="text-xs text-muted-foreground">
            {formatCurrency(role.hourlyRate)} per hour
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${role.id}-weekly-hours`}>Weekly Hours</Label>
          <Input
            id={`${role.id}-weekly-hours`}
            type="number"
            value={role.weeklyHours}
            onChange={handleWeeklyHoursChange}
            min={0}
            className="h-9"
          />
          {(
            <div className="text-xs text-muted-foreground">
              Total: {totalProjectHours ?? 0} {totalProjectHours && totalProjectHours > 0 ? "hours over project timeline" : ""}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RoleInput;
