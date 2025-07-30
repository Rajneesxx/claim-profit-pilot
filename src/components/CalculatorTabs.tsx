import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Settings, BarChart3, Award } from 'lucide-react';
import { BasicCalculator } from './tabs/BasicCalculator';
import { AdvancedSettings } from './tabs/AdvancedSettings';
import { Analytics } from './tabs/Analytics';
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
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "summary", label: "Summary", icon: Award },
  ];

  return (
    <Card className="bg-gray-900/90 backdrop-blur-sm border border-gray-700">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-700">
          <TabsList className="grid w-full grid-cols-4 bg-transparent p-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200 border border-purple-600/30 data-[state=active]:border-purple-500"
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

        <TabsContent value="analytics" className="mt-0">
          <Analytics calculations={calculations} />
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