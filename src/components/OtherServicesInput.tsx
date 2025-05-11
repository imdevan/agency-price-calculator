
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OtherService {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

interface OtherServicesInputProps {
  services: OtherService[];
  onChange: (services: OtherService[]) => void;
  totalCost: number;
}

const OtherServicesInput: React.FC<OtherServicesInputProps> = ({ services, onChange, totalCost }) => {
  const [showServices, setShowServices] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newCost, setNewCost] = React.useState<number | ''>('');
  
  const handleAddService = () => {
    if (newName.trim() && typeof newCost === 'number' && newCost >= 0) {
      const newService = {
        id: Date.now().toString(),
        name: newName,
        cost: newCost
      };
      
      onChange([...services, newService]);
      setNewName("");
      setNewCost('');
    }
  };
  
  const handleRemoveService = (id: string) => {
    onChange(services.filter(service => service.id !== id));
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
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Other Services</Label>
        <span className="font-semibold">{formatCurrency(totalCost)}/mo</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center w-full justify-between p-2 h-auto mb-1"
        onClick={() => setShowServices(!showServices)}
      >
        <span>Add or manage other services</span>
        {showServices ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
      
      {showServices && (
        <Card>
          <CardContent className="p-3 space-y-3 mt-2">
            <div className="space-y-2">
              {services.length > 0 ? (
                <div className="space-y-2">
                  {services.map(service => (
                    <div key={service.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{service.name}</div>
                        {service.description && <div className="text-xs text-muted-foreground">{service.description}</div>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatCurrency(service.cost)}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0" 
                          onClick={() => handleRemoveService(service.id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-2 text-sm">
                  No additional services added
                </div>
              )}
              
              <div className="flex items-end gap-2 pt-2">
                <div className="flex-1">
                  <Label htmlFor="service-name" className="text-xs mb-1 block">Service Name</Label>
                  <Input
                    id="service-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Email Service"
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="service-cost" className="text-xs mb-1 block">Monthly Cost</Label>
                  <div className="relative">
                    <Input
                      id="service-cost"
                      type="number"
                      min="0"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="h-8 pl-6"
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={handleAddService}
                  disabled={!newName.trim() || typeof newCost !== 'number' || newCost < 0}
                >
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OtherServicesInput;
