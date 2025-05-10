
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from '@/types';

interface RoleInputProps {
  role: Role;
  onChange: (id: string, field: 'hourlyRate' | 'weeklyHours', value: number) => void;
}

const RoleInput: React.FC<RoleInputProps> = ({ role, onChange }) => {
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const rate = value === "" ? 0 : parseFloat(value);
    onChange(role.id, 'hourlyRate', rate);
  };
  
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const hours = value === "" ? 0 : parseFloat(value);
    onChange(role.id, 'weeklyHours', hours);
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="font-medium">{role.title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`rate-${role.id}`} className="text-sm font-normal text-muted-foreground mb-1 block">
            Hourly Rate ($)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id={`rate-${role.id}`}
              type="number"
              min="0"
              step="1"
              value={role.hourlyRate.toString()}
              onChange={handleRateChange}
              className="pl-6"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`hours-${role.id}`} className="text-sm font-normal text-muted-foreground mb-1 block">
            Weekly Hours
          </Label>
          <Input
            id={`hours-${role.id}`}
            type="number"
            min="0"
            step="0.5"
            max="40"
            value={role.weeklyHours.toString()}
            onChange={handleHoursChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleInput;
