import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FreeTierToggleProps {
  id: string;
  label: string;
  isEnabled: boolean;
  onChange: (isEnabled: boolean) => void;
  cost?: number;
  disabled?: boolean;
}

const FreeTierToggle: React.FC<FreeTierToggleProps> = ({ id, label, isEnabled, onChange, cost, disabled }) => {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-1">
      <p>
        {label}
      </p>
      {cost !== undefined && (
        <p className="text-xs text-muted-foreground">
          {isEnabled ? 'Free' : formatCurrency(cost)}/mo
        </p>
      )}
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor={id} className="text-xs cursor-pointer flex-1">
          {isEnabled ? 'Using free tier' : 'Use free tier?'}
        </Label>
        <Switch
          id={id}
          checked={isEnabled}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FreeTierToggle;
