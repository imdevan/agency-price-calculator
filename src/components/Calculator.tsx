import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Role, Scope, InfrastructureCost, TimelineAdjustment, FreeTierEligibility } from '@/types';
import { 
  PROJECT_SCOPES, 
  BASE_INFRASTRUCTURE_COSTS, 
  USER_COST_MULTIPLIER,
  STORAGE_COST_CALCULATOR,
  AUTHENTICATION_COST_CALCULATOR,
  INFRASTRUCTURE_SOURCE_COSTS
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
import TopControls from './TopControls';
import ServiceProviderSelection from './ServiceProviderSelection';
import SectionToggle from './SectionToggle';

interface OtherService {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

interface ServiceProviders {
  hosting: string;
  database: string;
  cdn: string;
  cicd: string;
  storage: string;
  authentication: string;
}

const Calculator: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // UI state
  const [showOnlyResults, setShowOnlyResults] = useState<boolean>(false);
  
  // Section toggles
  const [showRetainer, setShowRetainer] = useState<boolean>(true);
  const [showInfrastructure, setShowInfrastructure] = useState<boolean>(true);
  const [showDevelopment, setShowDevelopment] = useState<boolean>(true);

  const [roles, setRoles] = useState<Role[]>([
    { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 180, weeklyHours: 30 },
    { id: 'designer', title: 'Designer', hourlyRate: 125, weeklyHours: 0 },
    { id: 'projectManager', title: 'Project Manager', hourlyRate: 135, weeklyHours: 0 },
  ]);
  const [selectedScope, setSelectedScope] = useState<Scope>('mvp');
  const [userCount, setUserCount] = useState<number>(500);
  const [gbStorage, setGbStorage] = useState<number>(10);
  const [otherServices, setOtherServices] = useState<OtherService[]>([]);
  
  // Service providers
  const [serviceProviders, setServiceProviders] = useState<ServiceProviders>({
    hosting: '',
    database: '',
    cdn: '',
    cicd: '',
    storage: '',
    authentication: '',
  });
  
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
  const [retainerHours, setRetainerHours] = useState<number>(17);

  // Timeline state
  const [timeline, setTimeline] = useState<TimelineAdjustment>({
    baseWeeks: 0,
    adjustedWeeks: 0,
    multiplier: 1
  });

  // Initialize service providers when scope changes
  useEffect(() => {
    const newServiceProviders: ServiceProviders = {
      hosting: '',
      database: '',
      cdn: '',
      cicd: '',
      storage: '',
      authentication: '',
    };
    
    Object.keys(newServiceProviders).forEach(key => {
      const serviceKey = key as keyof ServiceProviders;
      const services = INFRASTRUCTURE_SOURCE_COSTS[selectedScope]?.[serviceKey];
      if (services && services.length > 0) {
        newServiceProviders[serviceKey] = services[0].serviceName;
      }
    });
    
    setServiceProviders(newServiceProviders);
  }, [selectedScope]);

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

    // Load retainer hours
    const retainerHoursParam = searchParams.get('retainerHours');
    if (retainerHoursParam && !isNaN(Number(retainerHoursParam))) {
      setRetainerHours(Number(retainerHoursParam));
    }

    // Load UI state
    const resultsOnly = searchParams.get('resultsOnly');
    if (resultsOnly === 'true') {
      setShowOnlyResults(true);
    }
    
    // Load section toggles
    const retainerToggle = searchParams.get('showRetainer');
    if (retainerToggle !== null) {
      setShowRetainer(retainerToggle === 'true');
    }
    
    const infraToggle = searchParams.get('showInfrastructure');
    if (infraToggle !== null) {
      setShowInfrastructure(infraToggle === 'true');
    }
    
    // Load development toggle
    const devToggle = searchParams.get('showDevelopment');
    if (devToggle !== null) {
      setShowDevelopment(devToggle === 'true');
    }
    
    // Load service providers
    const providersParam = searchParams.get('providers');
    if (providersParam) {
      try {
        const providersValues = JSON.parse(providersParam);
        setServiceProviders(prev => ({
          ...prev,
          ...providersValues
        }));
      } catch (e) {
        console.error("Failed to parse service providers from URL");
      }
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
    
    // Add section toggles
    params.set('showRetainer', showRetainer.toString());
    params.set('showInfrastructure', showInfrastructure.toString());
    params.set('showDevelopment', showDevelopment.toString());
    
    // Add service providers
    params.set('providers', JSON.stringify(serviceProviders));
    
    setSearchParams(params, { replace: true });
  }, [
    selectedScope, 
    userCount, 
    gbStorage, 
    otherServices, 
    freeTierEligibility,
    serviceProviders,
    roles,
    timeline,
    showOnlyResults,
    retainerHours,
    showRetainer,
    showInfrastructure,
    showDevelopment,
    setSearchParams
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

  // Get base cost for a selected service provider
  const getServiceProviderBaseCost = (serviceType: keyof ServiceProviders) => {
    const providerName = serviceProviders[serviceType];
    const providers = INFRASTRUCTURE_SOURCE_COSTS[selectedScope]?.[serviceType];
    
    if (providers && providerName) {
      const provider = providers.find(p => p.serviceName === providerName);
      return provider ? provider.baseCost : 0;
    }
    
    return BASE_INFRASTRUCTURE_COSTS[selectedScope][serviceType];
  };

  // Recalculate infrastructure costs when relevant parameters change
  useEffect(() => {
    const baseCosts = {
      hosting: getServiceProviderBaseCost('hosting'),
      database: getServiceProviderBaseCost('database'),
      cdn: getServiceProviderBaseCost('cdn'),
      cicd: getServiceProviderBaseCost('cicd'),
      storage: getServiceProviderBaseCost('storage'),
      authentication: getServiceProviderBaseCost('authentication'),
      otherServices: 0
    };
    
    const userMultiplier = userCount / 1000;
    
    // Calculate storage cost based on GB and free tier
    let storageCost = baseCosts.storage;
    if (!freeTierEligibility.storage) {
      // Always subtract the free tier amount when calculating storage costs
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
    freeTierEligibility,
    serviceProviders
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
  
  const handleServiceProviderChange = (serviceType: keyof ServiceProviders, providerName: string) => {
    setServiceProviders(prev => ({
      ...prev,
      [serviceType]: providerName
    }));
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
    // Reset all form values to defaults
    setRoles([
      { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 180, weeklyHours: 30 },
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
    setRetainerHours(17);
    setShowRetainer(true);
    setShowInfrastructure(true);
    setShowDevelopment(true);
    
    // Reset service providers
    const newServiceProviders: ServiceProviders = {
      hosting: '',
      database: '',
      cdn: '',
      cicd: '',
      storage: '',
      authentication: '',
    };
    
    Object.keys(newServiceProviders).forEach(key => {
      const serviceKey = key as keyof ServiceProviders;
      const services = INFRASTRUCTURE_SOURCE_COSTS['mvp']?.[serviceKey];
      if (services && services.length > 0) {
        newServiceProviders[serviceKey] = services[0].serviceName;
      }
    });
    
    setServiceProviders(newServiceProviders);
    
    // Clear URL params by navigating to root
    navigate('/', { replace: true });
    
    toast({
      title: "Form Reset",
      description: "All inputs have been reset to default values."
    });
  };

  const toggleResultsView = () => {
    // Scroll to top of page when toggling view
    const targetElement = document.getElementById('scroll-target');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setShowOnlyResults(prev => !prev);
  };

  return (
    <div className="container py-4 sm:py-6 md:py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Project Price Calculator</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Estimate project costs and timelines based on scope and team composition
        </p>
      </div>
      
      <div id="scroll-target" className="h-0 block" />

      {/* Top Controls Section */}
      <TopControls 
        showOnlyResults={showOnlyResults}
        toggleResultsView={toggleResultsView}
        handleResetForm={handleResetForm}
        handleDownloadReport={handleDownloadReport}
      />
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 ${showOnlyResults ? 'max-w-3xl mx-auto' : ''}`}>
        {/* Calculator Section */}
        {!showOnlyResults && (
          <div className="space-y-4 sm:space-y-6">
            {/* Development Options Card with Toggle */}
            <Card>
              <CardHeader className="pb-2 sticky top-[53px] bg-white z-40 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Development Options</CardTitle>
                    <CardDescription className="text-sm">Configure team composition and project scope</CardDescription>
                  </div>
                  <SectionToggle
                    id="development-toggle"
                    label=""
                    isEnabled={showDevelopment}
                    onChange={setShowDevelopment}
                  />
                </div>
              </CardHeader>
              <CardContent className={`py-3 px-4 sm:px-6 space-y-4 sm:space-y-6 ${!showDevelopment ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Team Composition */}
                <div>
                  <h3 className="font-medium text-base mb-2">Team Composition</h3>
                  {roles.map((role) => (
                    <RoleInput 
                      key={role.id} 
                      role={role} 
                      onChange={handleRoleChange} 
                      totalProjectHours={role.weeklyHours * timeline.adjustedWeeks}
                    />
                  ))}
                </div>
                
                <Separator />
                
                {/* Project Scope */}
                <div>
                  <h3 className="font-medium text-base mb-2">Project Scope</h3>
                  <ScopeSelector 
                    selectedScope={selectedScope} 
                    onChange={handleScopeChange}
                  />
                  
                  {timeline.baseWeeks > 0 && (
                    <div className="mt-4 sm:mt-6">
                      <TimelineSlider 
                        baseWeeks={timeline.baseWeeks}
                        timeline={timeline}
                        onChange={handleTimelineChange}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sticky top-[53px] bg-white z-40 border-b">
                <CardTitle className="text-lg sm:text-xl">User Load</CardTitle>
                <CardDescription className="text-sm">Estimate your expected user count</CardDescription>
              </CardHeader>
              <CardContent className="py-3 px-4 sm:px-6">
                <UserSlider 
                  userCount={userCount} 
                  onChange={handleUserCountChange} 
                />
              </CardContent>
            </Card>
            
            {/* Infrastructure Options Card with Toggle */}
            <Card>
              <CardHeader className="pb-2 sticky top-[53px] bg-white z-40 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Infrastructure Options</CardTitle>
                    <CardDescription className="text-sm">Configure additional services and free tier eligibility</CardDescription>
                  </div>
                  <SectionToggle
                    id="infrastructure-toggle"
                    label=""
                    isEnabled={showInfrastructure}
                    onChange={setShowInfrastructure}
                  />
                </div>
              </CardHeader>
              <CardContent className={`py-3 px-4 sm:px-6 space-y-4 sm:space-y-6 ${!showInfrastructure ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Storage Cost Input - Keep the "Using free tier" label always visible */}
                <div>
                  <StorageCostInput 
                    gbStored={gbStorage}
                    onChange={setGbStorage}
                    cost={infrastructureCosts.storage}
                    isFreeTier={freeTierEligibility.storage}
                    alwaysShowFreeTier={true}
                  />
                </div>
                
                <Separator />
                
                {/* Other Services Input */}
                <OtherServicesInput 
                  services={otherServices}
                  onChange={handleOtherServicesChange}
                  totalCost={infrastructureCosts.otherServices}
                  disabled={!showInfrastructure}
                />
                
                <Separator />
                
                {/* Global Free Tier Toggle at the top */}
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleAllFreeTiers(true)}
                      disabled={!showInfrastructure}
                    >
                      Enable All Free Tiers
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleAllFreeTiers(false)}
                      disabled={!showInfrastructure}
                    >
                      Disable All Free Tiers
                    </Button>
                  </div>
                </div>
                
                {/* Free Tier Toggles for standard services */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <FreeTierToggle 
                      id="hosting-free-tier"
                      label="Hosting"
                      isEnabled={freeTierEligibility.hosting}
                      onChange={(value) => handleToggleFreeTier('hosting', value)}
                      cost={infrastructureCosts.hosting}
                      disabled={!showInfrastructure}
                    />
                    <ServiceProviderSelection 
                      serviceType="hosting"
                      serviceName="Hosting"
                      selectedProvider={serviceProviders.hosting}
                      onSelect={(provider) => handleServiceProviderChange('hosting', provider)}
                      scope={selectedScope}
                      isFreeTier={freeTierEligibility.hosting}
                      disabled={!showInfrastructure}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="database-free-tier"
                      label="Database"
                      isEnabled={freeTierEligibility.database}
                      onChange={(value) => handleToggleFreeTier('database', value)}
                      cost={infrastructureCosts.database}
                      disabled={!showInfrastructure}
                    />
                    <ServiceProviderSelection 
                      serviceType="database"
                      serviceName="Database"
                      selectedProvider={serviceProviders.database}
                      onSelect={(provider) => handleServiceProviderChange('database', provider)}
                      scope={selectedScope}
                      isFreeTier={freeTierEligibility.database}
                      disabled={!showInfrastructure}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="cdn-free-tier"
                      label="CDN"
                      isEnabled={freeTierEligibility.cdn}
                      onChange={(value) => handleToggleFreeTier('cdn', value)}
                      cost={infrastructureCosts.cdn}
                      disabled={!showInfrastructure}
                    />
                    <ServiceProviderSelection 
                      serviceType="cdn"
                      serviceName="CDN"
                      selectedProvider={serviceProviders.cdn}
                      onSelect={(provider) => handleServiceProviderChange('cdn', provider)}
                      scope={selectedScope}
                      isFreeTier={freeTierEligibility.cdn}
                      disabled={!showInfrastructure}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="cicd-free-tier"
                      label="CI/CD"
                      isEnabled={freeTierEligibility.cicd}
                      onChange={(value) => handleToggleFreeTier('cicd', value)}
                      cost={infrastructureCosts.cicd}
                      disabled={!showInfrastructure}
                    />
                    <ServiceProviderSelection 
                      serviceType="cicd"
                      serviceName="CI/CD"
                      selectedProvider={serviceProviders.cicd}
                      onSelect={(provider) => handleServiceProviderChange('cicd', provider)}
                      scope={selectedScope}
                      isFreeTier={freeTierEligibility.cicd}
                      disabled={!showInfrastructure}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="authentication-free-tier"
                      label="Authentication"
                      isEnabled={freeTierEligibility.authentication}
                      onChange={(value) => handleToggleFreeTier('authentication', value)}
                      cost={infrastructureCosts.authentication}
                      disabled={!showInfrastructure}
                    />
                    <ServiceProviderSelection 
                      serviceType="authentication"
                      serviceName="Authentication"
                      selectedProvider={serviceProviders.authentication}
                      onSelect={(provider) => handleServiceProviderChange('authentication', provider)}
                      scope={selectedScope}
                      isFreeTier={freeTierEligibility.authentication}
                      disabled={!showInfrastructure}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="storage-free-tier"
                      label="Storage"
                      isEnabled={freeTierEligibility.storage}
                      onChange={(value) => handleToggleFreeTier('storage', value)}
                      cost={infrastructureCosts.storage}
                      disabled={!showInfrastructure}
                    />
                    <ServiceProviderSelection 
                      serviceType="storage"
                      serviceName="Storage"
                      selectedProvider={serviceProviders.storage}
                      onSelect={(provider) => handleServiceProviderChange('storage', provider)}
                      scope={selectedScope}
                      isFreeTier={freeTierEligibility.storage}
                      disabled={!showInfrastructure}
                    />
                  </div>
                  <div>
                    <FreeTierToggle 
                      id="other-free-tier"
                      label="Other services"
                      isEnabled={freeTierEligibility.otherServices}
                      onChange={(value) => handleToggleFreeTier('otherServices', value)}
                      cost={infrastructureCosts.otherServices}
                      disabled={!showInfrastructure}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Retainer Estimator Card with Toggle */}
            <Card>
              <CardHeader className="pb-2 sticky top-[53px] bg-white z-40 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Ongoing Support Retainer</CardTitle>
                    <CardDescription className="text-sm">Estimate monthly support and maintenance costs</CardDescription>
                  </div>
                  <SectionToggle
                    id="retainer-toggle"
                    label=""
                    isEnabled={showRetainer}
                    onChange={setShowRetainer}
                  />
                </div>
              </CardHeader>
              <CardContent className="py-3 px-4 sm:px-6">
                <RetainerEstimator
                  roles={roles}
                  retainerHours={retainerHours}
                  onRetainerHoursChange={handleRetainerHoursChange}
                  disabled={!showRetainer}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        <div className={showOnlyResults ? "col-span-2" : ""}>
          <Card>
            <CardHeader className="pb-2 sticky top-[53px] bg-white z-40 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Project Cost Breakdown</CardTitle>
                  <CardDescription className="text-sm">View detailed cost analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-3 px-4 sm:px-6">
              <CostBreakdown 
                roles={roles}
                selectedScope={selectedScope}
                infrastructureCosts={infrastructureCosts}
                userCount={userCount}
                timeline={timeline}
                freeTierEligibility={freeTierEligibility}
                retainerHours={showRetainer ? retainerHours : 0}
                showRetainer={showRetainer && retainerHours > 0}
                showInfrastructure={showInfrastructure}
                showDevelopment={showDevelopment}
                otherServices={otherServices}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
