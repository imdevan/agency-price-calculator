
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UserSliderProps {
  userCount: number;
  onChange: (value: number) => void;
}

const UserSlider: React.FC<UserSliderProps> = ({ userCount, onChange }) => {
  const handleSliderChange = (value: number[]) => {
    onChange(value[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="user-count">Estimated User Count</Label>
          <div className="w-24">
            <Input 
              id="user-count-input"
              type="number" 
              min="0"
              value={userCount} 
              onChange={handleInputChange}
              className="h-8"
            />
          </div>
        </div>
        <Slider
          id="user-count"
          min={0}
          max={10000}
          step={100}
          value={[userCount]}
          onValueChange={handleSliderChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>2,500</span>
          <span>5,000</span>
          <span>7,500</span>
          <span>10,000</span>
        </div>
      </div>
    </div>
  );
};

export default UserSlider;
