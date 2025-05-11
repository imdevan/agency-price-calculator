
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FreeTierToggleProps {
  id: string;
  label: string;
  isEnabled: boolean;
  onChange: (isEnabled: boolean) => void;
}

const FreeTierToggle: React.FC<FreeTierToggleProps> = ({ id, label, isEnabled, onChange }) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={id} className="text-xs cursor-pointer flex-1">
        {isEnabled ? 'Using free tier' : 'Use free tier?'}
      </Label>
      <Switch
        id={id}
        checked={isEnabled}
        onCheckedChange={onChange}
      />
    </div>
  );
};

export default FreeTierToggle;
