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
}

export const CalculatorTabs = ({ 
  metrics, 
  updateMetric, 
  onCalculateROI, 
  calculations 
}: CalculatorTabsProps) => {
  const [activeTab, setActiveTab] = useState("calculator");

  const tabs = [
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "advanced", label: "Advanced", icon: Settings },
    { id: "assumptions", label: "Assumptions", icon: BookOpen },
    { id: "summary", label: "Summary", icon: Award },
  ];

  return (
    <Card className="bg-background border border-border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border">
          <TabsList className="grid w-full grid-cols-4 bg-background p-2">
            {tabs.map((tab) => (
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

        <TabsContent value="summary" className="mt-0">
          <Summary 
            calculations={calculations}
            onCalculateROI={onCalculateROI}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
