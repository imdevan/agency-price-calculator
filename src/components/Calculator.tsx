
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { Role, Scope, InfrastructureCost } from '@/types';
import { PROJECT_SCOPES, BASE_INFRASTRUCTURE_COSTS, USER_COST_MULTIPLIER } from '@/data';
import RoleInput from './RoleInput';
import ScopeSelector from './ScopeSelector';
import UserSlider from './UserSlider';
import CostBreakdown from './CostBreakdown';
import { downloadCsv } from '@/utils/exportUtils';
import { useToast } from "@/hooks/use-toast";

const Calculator: React.FC = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([
    { id: 'juniorDev', title: 'Junior Developer', hourlyRate: 75, weeklyHours: 0 },
    { id: 'seniorDev', title: 'Senior Developer', hourlyRate: 262, weeklyHours: 17 },
    { id: 'designer', title: 'Designer', hourlyRate: 125, weeklyHours: 0 },
    { id: 'projectManager', title: 'Project Manager', hourlyRate: 135, weeklyHours: 0 },
    { id: 'qaEngineer', title: 'QA Engineer', hourlyRate: 85, weeklyHours: 0 }
  ]);
  const [selectedScope, setSelectedScope] = useState<Scope>('mvp');
  const [userCount, setUserCount] = useState<number>(500);
  const [infrastructureCosts, setInfrastructureCosts] = useState<InfrastructureCost>(
    BASE_INFRASTRUCTURE_COSTS.mvp
  );

  // Recalculate infrastructure costs when scope or user count changes
  useEffect(() => {
    const baseCosts = BASE_INFRASTRUCTURE_COSTS[selectedScope];
    const userMultiplier = userCount / 1000;
    
    const updatedCosts: InfrastructureCost = {
      hosting: baseCosts.hosting * (1 + USER_COST_MULTIPLIER.hosting * userMultiplier),
      database: baseCosts.database * (1 + USER_COST_MULTIPLIER.database * userMultiplier),
      cdn: baseCosts.cdn * (1 + USER_COST_MULTIPLIER.cdn * userMultiplier),
      cicd: baseCosts.cicd * (1 + USER_COST_MULTIPLIER.cicd * userMultiplier),
    };
    
    setInfrastructureCosts(updatedCosts);
  }, [selectedScope, userCount]);

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

  const handleDownloadReport = () => {
    downloadCsv(roles, selectedScope, infrastructureCosts, userCount);
    toast({
      title: "Report Downloaded",
      description: "Your CSV report has been generated and downloaded."
    });
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Studio Price Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Estimate project costs and timelines based on scope and team composition
        </p>
      </div>
      
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <div className="grid gap-6 md:grid-cols-2">
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
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
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
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Project Cost Breakdown</h2>
            <Button onClick={handleDownloadReport} className="flex items-center gap-2">
              <Download size={16} />
              <span>Download CSV</span>
            </Button>
          </div>
          
          <Separator className="my-6" />
          
          <CostBreakdown 
            roles={roles}
            selectedScope={selectedScope}
            infrastructureCosts={infrastructureCosts}
            userCount={userCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculator;
