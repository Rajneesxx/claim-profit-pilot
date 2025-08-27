import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Settings, BookOpen, Award } from 'lucide-react';
import { BasicCalculator } from './tabs/BasicCalculator';
import { AdvancedSettings } from './tabs/AdvancedSettings';
import { Assumptions } from './tabs/Assumptions';
import { Summary } from './tabs/Summary';
import { ROIMetrics } from '../types/roi';

interface CalculatorTabsProps {
  metrics: ROIMetrics;
  updateMetric: (key: keyof ROIMetrics, value: number) => void;
  onCalculateROI: () => void;
  calculations: {
    totalCodingCosts: number;
    deniedClaimsCost: number;
    backlogCost: number;
    totalOperationalCosts: number;
    roi: number;
    executiveSummary: {
      reducedCost: number;
      increaseRevenue: number;
      reducedRisk: number;
      totalImpact: number;
    };
  };
  isSignedIn?: boolean;
}

export const CalculatorTabs = ({ 
  metrics, 
  updateMetric, 
  onCalculateROI, 
  calculations,
  isSignedIn = true
}: CalculatorTabsProps) => {
  const [activeTab, setActiveTab] = useState("calculations");
  const [activeCalculationTab, setActiveCalculationTab] = useState("calculator");

  const mainTabs = [
    { id: "calculations", label: "Calculations", icon: Calculator },
    { id: "summary", label: "Executive Summary", icon: Award },
  ];

  const calculationTabs = [
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "advanced", label: "Advanced", icon: Settings },
    { id: "assumptions", label: "Assumptions", icon: BookOpen },
  ];

  return (
    <Card className="bg-background border border-border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border">
          <TabsList className="grid w-full grid-cols-2 bg-background p-2">
            {mainTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground border border-border data-[state=active]:border-primary"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="calculations" className="mt-0">
          <div className="p-6">
            <Tabs value={activeCalculationTab} onValueChange={setActiveCalculationTab} className="w-full">
              <div className="border-b border-border mb-6">
                <TabsList className="grid w-full grid-cols-3 bg-background p-2">
                  {calculationTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-muted-foreground border border-border data-[state=active]:border-secondary"
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="calculator" className="mt-0">
                <BasicCalculator 
                  metrics={metrics}
                  updateMetric={updateMetric}
                  onCalculateROI={onCalculateROI}
                  calculations={calculations}
                />
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <AdvancedSettings 
                  metrics={metrics}
                  updateMetric={updateMetric}
                />
              </TabsContent>

              <TabsContent value="assumptions" className="mt-0">
                <Assumptions 
                  metrics={metrics}
                />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-0">
          <Summary 
            calculations={calculations}
            onCalculateROI={onCalculateROI}
            isSignedIn={isSignedIn}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
