import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { Role, Scope, InfrastructureCost, TimelineAdjustment, FreeTierEligibility } from '@/types';
import { 
  PROJECT_SCOPES, 
  BASE_INFRASTRUCTURE_COSTS, 
  USER_COST_MULTIPLIER,
  STORAGE_COST_CALCULATOR,
  AUTHENTICATION_COST_CALCULATOR
} from '@/data';
import RoleInput from './RoleInput';
import ScopeSelector from './ScopeSelector';
import UserSlider from './UserSlider';
import CostBreakdown from './CostBreakdown';
import { downloadCsv } from '@/utils/exportUtils';
import { useToast } from "@/hooks/use-toast";
import TimelineSlider from './TimelineSlider';
import FreeTierToggle from './FreeTierToggle';
import StorageCostInput from './StorageCostInput';
import AuthCostInput from './AuthCostInput';
import OtherServicesInput from './OtherServicesInput';

interface OtherService {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

const Calculator: React.FC = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([
    { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 262, weeklyHours: 17 },
    { id: 'designer', title: 'Designer', hourlyRate: 125, weeklyHours: 0 },
    { id: 'projectManager', title: 'Project Manager', hourlyRate: 135, weeklyHours: 0 },
  ]);
  const [selectedScope, setSelectedScope] = useState<Scope>('mvp');
  const [userCount, setUserCount] = useState<number>(500);
  const [gbStorage, setGbStorage] = useState<number>(10);
  const [authUsers, setAuthUsers] = useState<number>(5000);
  const [otherServices, setOtherServices] = useState<OtherService[]>([]);
  const [infrastructureCosts, setInfrastructureCosts] = useState<InfrastructureCost>(
    BASE_INFRASTRUCTURE_COSTS.mvp
  );
  const [freeTierEligibility, setFreeTierEligibility] = useState<FreeTierEligibility>({
    hosting: false,
    database: false,
    cdn: false,
    cicd: false,
    storage: false,
    authentication: false,
    otherServices: false
  });

  // Timeline state
  const [timeline, setTimeline] = useState<TimelineAdjustment>({
    baseWeeks: 0,
    adjustedWeeks: 0,
    multiplier: 1
  });

  // Calculate base timeline when scope or role hours change
  useEffect(() => {
    const scope = PROJECT_SCOPES[selectedScope];
    const totalWeeklyHours = roles.reduce((sum, role) => sum + role.weeklyHours, 0);
    
    let baseWeeks = 0;
    if (totalWeeklyHours > 0) {
      baseWeeks = Math.ceil(scope.developmentTimeMultiplier * 4);
    }
    
    setTimeline({
      baseWeeks,
      adjustedWeeks: baseWeeks,
      multiplier: 1
    });
  }, [selectedScope, roles]);

  // Recalculate infrastructure costs when relevant parameters change
  useEffect(() => {
    const baseCosts = BASE_INFRASTRUCTURE_COSTS[selectedScope];
    const userMultiplier = userCount / 1000;
    
    // Calculate storage cost based on GB and free tier
    let storageCost = baseCosts.storage;
    if (!freeTierEligibility.storage) {
      const billableGB = Math.max(0, gbStorage - STORAGE_COST_CALCULATOR.baseFreeGB);
      storageCost = Math.max(baseCosts.storage, billableGB * STORAGE_COST_CALCULATOR.pricePerGBPerMonth);
    } else {
      storageCost = 0;
    }
    
    // Calculate auth cost based on MAU and free tier
    let authCost = baseCosts.authentication;
    if (!freeTierEligibility.authentication) {
      const billableUsers = Math.max(0, authUsers - AUTHENTICATION_COST_CALCULATOR.freeMAUs);
      authCost = Math.max(
        baseCosts.authentication, 
        billableUsers * AUTHENTICATION_COST_CALCULATOR.pricePerMAUBeyondFree
      );
    } else {
      authCost = 0;
    }
    
    // Calculate other services cost
    const otherServicesCost = freeTierEligibility.otherServices 
      ? 0 
      : otherServices.reduce((sum, service) => sum + service.cost, 0);
    
    const updatedCosts: InfrastructureCost = {
      hosting: freeTierEligibility.hosting ? 0 : baseCosts.hosting * (1 + USER_COST_MULTIPLIER.hosting * userMultiplier),
      database: freeTierEligibility.database ? 0 : baseCosts.database * (1 + USER_COST_MULTIPLIER.database * userMultiplier),
      cdn: freeTierEligibility.cdn ? 0 : baseCosts.cdn * (1 + USER_COST_MULTIPLIER.cdn * userMultiplier),
      cicd: freeTierEligibility.cicd ? 0 : baseCosts.cicd * (1 + USER_COST_MULTIPLIER.cicd * userMultiplier),
      storage: storageCost,
      authentication: authCost,
      otherServices: otherServicesCost
    };
    
    setInfrastructureCosts(updatedCosts);
  }, [
    selectedScope, 
    userCount, 
    gbStorage, 
    authUsers, 
    otherServices, 
    freeTierEligibility
  ]);

  const handleRoleChange = (id: string, field: 'hourlyRate' | 'weeklyHours', value: number) => {
    setRoles(prev => prev.map(role => 
      role.id === id ? { ...role, [field]: value } : role
    ));
  };

  const handleScopeChange = (scope: Scope) => {
    setSelectedScope(scope);
  };

  const handleUserCountChange = (count: number) => {
    setUserCount(count);
  };

  const handleTimelineChange = (newTimeline: TimelineAdjustment) => {
    setTimeline(newTimeline);
  };

  const handleToggleFreeTier = (service: keyof FreeTierEligibility, value: boolean) => {
    setFreeTierEligibility(prev => ({
      ...prev,
      [service]: value
    }));
  };

  const handleOtherServicesChange = (services: OtherService[]) => {
    setOtherServices(services);
  };

  const handleDownloadReport = () => {
    downloadCsv(
      roles, 
      selectedScope, 
      infrastructureCosts, 
      userCount,
      timeline,
      freeTierEligibility,
      gbStorage,
      authUsers,
      otherServices
    );
    toast({
      title: "Report Downloaded",
      description: "Your CSV report has been generated and downloaded."
    });
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Studio Price Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Estimate project costs and timelines based on scope and team composition
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Composition</CardTitle>
              <CardDescription>Set hourly rates and weekly hours for each role</CardDescription>
            </CardHeader>
            <CardContent>
              {roles.map((role) => (
                <RoleInput 
                  key={role.id} 
                  role={role} 
                  onChange={handleRoleChange} 
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Scope</CardTitle>
              <CardDescription>Select the type of project you're planning</CardDescription>
            </CardHeader>
            <CardContent>
              <ScopeSelector 
                selectedScope={selectedScope} 
                onChange={handleScopeChange}
              />
              
              {timeline.baseWeeks > 0 && (
                <div className="mt-6">
                  <TimelineSlider 
                    baseWeeks={timeline.baseWeeks}
                    timeline={timeline}
                    onChange={handleTimelineChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Load</CardTitle>
              <CardDescription>Estimate your expected user count</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSlider 
                userCount={userCount} 
                onChange={handleUserCountChange} 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Options</CardTitle>
              <CardDescription>Configure additional services and free tier eligibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Storage Cost Input */}
              <div>
                <StorageCostInput 
                  gbStored={gbStorage}
                  onChange={setGbStorage}
                  cost={infrastructureCosts.storage}
                  isFreeTier={freeTierEligibility.storage}
                />
                <div className="mt-2">
                  <FreeTierToggle 
                    id="storage-free-tier"
                    label="Storage free tier"
                    isEnabled={freeTierEligibility.storage}
                    onChange={(value) => handleToggleFreeTier('storage', value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Auth Cost Input */}
              <div>
                <AuthCostInput 
                  users={authUsers}
                  onChange={setAuthUsers}
                  cost={infrastructureCosts.authentication}
                  isFreeTier={freeTierEligibility.authentication}
                />
                <div className="mt-2">
                  <FreeTierToggle 
                    id="auth-free-tier"
                    label="Auth free tier"
                    isEnabled={freeTierEligibility.authentication}
                    onChange={(value) => handleToggleFreeTier('authentication', value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Other Services Input */}
              <OtherServicesInput 
                services={otherServices}
                onChange={handleOtherServicesChange}
                totalCost={infrastructureCosts.otherServices}
              />
              
              <Separator />
              
              {/* Free Tier Toggles for standard services */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FreeTierToggle 
                    id="hosting-free-tier"
                    label="Hosting free tier"
                    isEnabled={freeTierEligibility.hosting}
                    onChange={(value) => handleToggleFreeTier('hosting', value)}
                  />
                </div>
                <div>
                  <FreeTierToggle 
                    id="database-free-tier"
                    label="Database free tier"
                    isEnabled={freeTierEligibility.database}
                    onChange={(value) => handleToggleFreeTier('database', value)}
                  />
                </div>
                <div>
                  <FreeTierToggle 
                    id="cdn-free-tier"
                    label="CDN free tier"
                    isEnabled={freeTierEligibility.cdn}
                    onChange={(value) => handleToggleFreeTier('cdn', value)}
                  />
                </div>
                <div>
                  <FreeTierToggle 
                    id="cicd-free-tier"
                    label="CI/CD free tier"
                    isEnabled={freeTierEligibility.cicd}
                    onChange={(value) => handleToggleFreeTier('cicd', value)}
                  />
                </div>
                <div>
                  <FreeTierToggle 
                    id="other-free-tier"
                    label="Other services free tier"
                    isEnabled={freeTierEligibility.otherServices}
                    onChange={(value) => handleToggleFreeTier('otherServices', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Cost Breakdown</CardTitle>
                  <CardDescription>View detailed cost analysis</CardDescription>
                </div>
                <Button onClick={handleDownloadReport} className="flex items-center gap-2">
                  <Download size={16} />
                  <span>Download CSV</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CostBreakdown 
                roles={roles}
                selectedScope={selectedScope}
                infrastructureCosts={infrastructureCosts}
                userCount={userCount}
                timeline={timeline}
                freeTierEligibility={freeTierEligibility}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
