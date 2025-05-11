import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleLeft, ToggleRight, Download, RefreshCw } from "lucide-react";
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
import OtherServicesInput from './OtherServicesInput';
import { useSearchParams, useNavigate } from "react-router-dom";
import RetainerEstimator from './RetainerEstimator';

interface OtherService {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

const Calculator: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // UI state
  const [showOnlyResults, setShowOnlyResults] = useState<boolean>(false);

  const [roles, setRoles] = useState<Role[]>([
    { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 262, weeklyHours: 17 },
    { id: 'designer', title: 'Designer', hourlyRate: 125, weeklyHours: 0 },
    { id: 'projectManager', title: 'Project Manager', hourlyRate: 135, weeklyHours: 0 },
  ]);
  const [selectedScope, setSelectedScope] = useState<Scope>('mvp');
  const [userCount, setUserCount] = useState<number>(500);
  const [gbStorage, setGbStorage] = useState<number>(10);
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
  
  // Retainer state
  const [retainerHours, setRetainerHours] = useState<number>(20);

  // Timeline state
  const [timeline, setTimeline] = useState<TimelineAdjustment>({
    baseWeeks: 0,
    adjustedWeeks: 0,
    multiplier: 1
  });

  // Load state from URL on initial render
  useEffect(() => {
    if (searchParams.size === 0) return;

    // Load scope
    const scope = searchParams.get('scope');
    if (scope && (scope === 'poc' || scope === 'mvp' || scope === 'production')) {
      setSelectedScope(scope);
    }

    // Load user count
    const users = searchParams.get('users');
    if (users && !isNaN(Number(users))) {
      setUserCount(Number(users));
    }

    // Load storage
    const storage = searchParams.get('storage');
    if (storage && !isNaN(Number(storage))) {
      setGbStorage(Number(storage));
    }

    // Load free tier eligibility
    const freeTierParam = searchParams.get('freeTier');
    if (freeTierParam) {
      try {
        const freeTierValues = JSON.parse(freeTierParam);
        setFreeTierEligibility(prev => ({
          ...prev,
          ...freeTierValues
        }));
      } catch (e) {
        console.error("Failed to parse free tier values from URL");
      }
    }

    // Load roles
    const rolesParam = searchParams.get('roles');
    if (rolesParam) {
      try {
        const rolesValues = JSON.parse(rolesParam);
        if (Array.isArray(rolesValues)) {
          setRoles(rolesValues);
        }
      } catch (e) {
        console.error("Failed to parse roles from URL");
      }
    }

    // Load timeline
    const timelineParam = searchParams.get('timeline');
    if (timelineParam) {
      try {
        const timelineValues = JSON.parse(timelineParam);
        setTimeline(prev => ({
          ...prev,
          ...timelineValues
        }));
      } catch (e) {
        console.error("Failed to parse timeline from URL");
      }
    }

    // Load other services
    const servicesParam = searchParams.get('services');
    if (servicesParam) {
      try {
        const servicesValues = JSON.parse(servicesParam);
        if (Array.isArray(servicesValues)) {
          setOtherServices(servicesValues);
        }
      } catch (e) {
        console.error("Failed to parse other services from URL");
      }
    }

    // Load UI state
    const resultsOnly = searchParams.get('resultsOnly');
    if (resultsOnly === 'true') {
      setShowOnlyResults(true);
    }
  }, []);

  // Update URL when state changes
  useEffect(() => {
    // Only update after initial render
    const params = new URLSearchParams();
    
    // Add scope
    params.set('scope', selectedScope);
    
    // Add user count
    params.set('users', userCount.toString());
    
    // Add storage
    params.set('storage', gbStorage.toString());
    
    // Add free tier eligibility
    params.set('freeTier', JSON.stringify(freeTierEligibility));
    
    // Add roles
    params.set('roles', JSON.stringify(roles));
    
    // Add timeline
    params.set('timeline', JSON.stringify({
      baseWeeks: timeline.baseWeeks,
      adjustedWeeks: timeline.adjustedWeeks,
      multiplier: timeline.multiplier
    }));
    
    // Add other services
    params.set('services', JSON.stringify(otherServices));
    
    // Add UI state
    if (showOnlyResults) {
      params.set('resultsOnly', 'true');
    }
    
    // Add retainer hours
    params.set('retainerHours', retainerHours.toString());
    
    setSearchParams(params, { replace: true });
  }, [
    selectedScope, 
    userCount, 
    gbStorage, 
    freeTierEligibility, 
    roles, 
    timeline, 
    otherServices,
    showOnlyResults,
    retainerHours
  ]);

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
      storageCost = billableGB * STORAGE_COST_CALCULATOR.pricePerGBPerMonth;
      if (storageCost < baseCosts.storage) {
        storageCost = baseCosts.storage;
      }
    } else {
      storageCost = 0;
    }
    
    // Calculate auth cost based on user count and free tier
    let authCost = baseCosts.authentication;
    if (!freeTierEligibility.authentication) {
      const billableUsers = Math.max(0, userCount - AUTHENTICATION_COST_CALCULATOR.freeMAUs);
      authCost = billableUsers * AUTHENTICATION_COST_CALCULATOR.pricePerMAUBeyondFree;
      if (authCost < baseCosts.authentication) {
        authCost = baseCosts.authentication;
      }
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
  
  // Global free tier toggle handler
  const handleToggleAllFreeTiers = (enableFree: boolean) => {
    setFreeTierEligibility({
      hosting: enableFree,
      database: enableFree,
      cdn: enableFree,
      cicd: enableFree,
      storage: enableFree,
      authentication: enableFree,
      otherServices: enableFree
    });
    
    toast({
      title: enableFree ? "Free Tiers Enabled" : "Free Tiers Disabled",
      description: enableFree ? "All services set to free tier" : "All services set to paid tier",
    });
  };

  const handleOtherServicesChange = (services: OtherService[]) => {
    setOtherServices(services);
  };

  const handleRetainerHoursChange = (hours: number) => {
    setRetainerHours(hours);
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
      userCount, // Use same user count for auth users
      otherServices
    );
    toast({
      title: "Report Downloaded",
      description: "Your CSV report has been generated and downloaded."
    });
  };

  const handleResetForm = () => {
    setRoles([
      { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 262, weeklyHours: 17 },
      { id: 'designer', title: 'Designer', hourlyRate: 125, weeklyHours: 0 },
      { id: 'projectManager', title: 'Project Manager', hourlyRate: 135, weeklyHours: 0 },
    ]);
    setSelectedScope('mvp');
    setUserCount(500);
    setGbStorage(10);
    setOtherServices([]);
    setFreeTierEligibility({
      hosting: false,
      database: false,
      cdn: false,
      cicd: false,
      storage: false,
      authentication: false,
      otherServices: false
    });
    setTimeline({
      baseWeeks: 0,
      adjustedWeeks: 0,
      multiplier: 1
    });
    setShowOnlyResults(false);
    
    // Clear URL params
    navigate('/', { replace: true });
    
    toast({
      title: "Form Reset",
      description: "All inputs have been reset to default values."
    });
  };

  const toggleResultsView = () => {
    setShowOnlyResults(prev => !prev);
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Studio Price Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Estimate project costs and timelines based on scope and team composition
        </p>
      </div>
      
      {/* Top Controls Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleResultsView}
          >
            {showOnlyResults ? (
              <>
                <ToggleLeft size={16} />
                <span>Show All Inputs</span>
              </>
            ) : (
              <>
                <ToggleRight size={16} />
                <span>Show Results Only</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleResetForm}
          >
            <RefreshCw size={16} />
            <span>Reset Form</span>
          </Button>
        </div>
        
        <Button onClick={handleDownloadReport} className="flex items-center gap-2">
          <Download size={16} />
          <span>Download CSV</span>
        </Button>
      </div>
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${showOnlyResults ? 'max-w-3xl mx-auto' : ''}`}>
        {/* Calculator Section */}
        {!showOnlyResults && (
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
                    totalProjectHours={role.weeklyHours * timeline.adjustedWeeks}
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
                      label="Hosting"
                      isEnabled={freeTierEligibility.hosting}
                      onChange={(value) => handleToggleFreeTier('hosting', value)}
                      cost={infrastructureCosts.hosting}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="database-free-tier"
                      label="Database"
                      isEnabled={freeTierEligibility.database}
                      onChange={(value) => handleToggleFreeTier('database', value)}
                      cost={infrastructureCosts.database}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="cdn-free-tier"
                      label="CDN"
                      isEnabled={freeTierEligibility.cdn}
                      onChange={(value) => handleToggleFreeTier('cdn', value)}
                      cost={infrastructureCosts.cdn}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="cicd-free-tier"
                      label="CI/CD"
                      isEnabled={freeTierEligibility.cicd}
                      onChange={(value) => handleToggleFreeTier('cicd', value)}
                      cost={infrastructureCosts.cicd}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="authentication-free-tier"
                      label="Authentication"
                      isEnabled={freeTierEligibility.authentication}
                      onChange={(value) => handleToggleFreeTier('authentication', value)}
                      cost={infrastructureCosts.authentication}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="storage-free-tier"
                      label="Storage"
                      isEnabled={freeTierEligibility.storage}
                      onChange={(value) => handleToggleFreeTier('storage', value)}
                      cost={infrastructureCosts.storage}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="other-free-tier"
                      label="Other services"
                      isEnabled={freeTierEligibility.otherServices}
                      onChange={(value) => handleToggleFreeTier('otherServices', value)}
                      cost={infrastructureCosts.otherServices}
                    />
                  </div>
                </div>


                {/* Global Free Tier Toggle */}
                <div>
                  <div className="flex justify-between items-center">
                    {/* <h3 className="font-medium">Global Free Tier Control</h3> */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleAllFreeTiers(true)}
                      >
                        Enable All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleAllFreeTiers(false)}
                      >
                        Disable All
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Retainer Estimator Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Support Retainer</CardTitle>
                <CardDescription>Estimate monthly support and maintenance costs</CardDescription>
              </CardHeader>
              <CardContent>
                <RetainerEstimator
                  roles={roles}
                  retainerHours={retainerHours}
                  onRetainerHoursChange={handleRetainerHoursChange}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        <div className={showOnlyResults ? "col-span-2" : ""}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Cost Breakdown</CardTitle>
                  <CardDescription>View detailed cost analysis</CardDescription>
                </div>
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
                retainerHours={retainerHours}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
