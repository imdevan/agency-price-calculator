
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SectionToggleProps {
  id: string;
  label: string;
  description?: string;
  isEnabled: boolean;
  onChange: (isEnabled: boolean) => void;
}

const SectionToggle: React.FC<SectionToggleProps> = ({ 
  id, 
  label, 
  description, 
  isEnabled, 
  onChange 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        {label && <Label htmlFor={id} className="text-base">{label}</Label>}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={isEnabled}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary" // Match the green highlight color used for free tier labels
      />
    </div>
  );
};

export default SectionToggle;
