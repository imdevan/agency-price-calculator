
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from '@/types';

interface RoleInputProps {
  role: Role;
  onChange: (id: string, rate: number) => void;
}

const RoleInput: React.FC<RoleInputProps> = ({ role, onChange }) => {
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const rate = value === "" ? 0 : parseFloat(value);
    onChange(role.id, rate);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
      <Label htmlFor={`rate-${role.id}`} className="w-full md:w-1/2 text-sm font-medium">
        {role.title}
      </Label>
      <div className="w-full md:w-1/2 relative">
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
  );
};

export default RoleInput;
