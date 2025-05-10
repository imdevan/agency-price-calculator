
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Scope } from '@/types';
import { PROJECT_SCOPES } from '@/data';

interface ScopeSelectorProps {
  selectedScope: Scope;
  onChange: (scope: Scope) => void;
}

const ScopeSelector: React.FC<ScopeSelectorProps> = ({ selectedScope, onChange }) => {
  const handleScopeChange = (value: string) => {
    onChange(value as Scope);
  };

  return (
    <RadioGroup value={selectedScope} onValueChange={handleScopeChange} className="space-y-4">
      {Object.values(PROJECT_SCOPES).map((scope) => (
        <Card 
          key={scope.type}
          className={`overflow-hidden transition-all ${selectedScope === scope.type ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
        >
          <CardContent className="p-0">
            <Label
              htmlFor={`scope-${scope.type}`}
              className="flex items-center space-x-3 p-4 cursor-pointer w-full"
            >
              <RadioGroupItem value={scope.type} id={`scope-${scope.type}`} />
              <div className="flex-1">
                <div className="font-medium">{scope.label}</div>
                <div className="text-sm text-muted-foreground">{scope.description}</div>
              </div>
            </Label>
          </CardContent>
        </Card>
      ))}
    </RadioGroup>
  );
};

export default ScopeSelector;
