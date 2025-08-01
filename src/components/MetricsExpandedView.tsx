import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatCurrency } from "@/utils/formatters";
import { TooltipInfo } from "./TooltipInfo";

interface MetricsExpandedViewProps {
  coderProductivitySavings: number;
  billingAutomationSavings: number;
  physicianTimeSavings: number;
  technologyCostSavings: number;
  claimDenialSavings: number;
  backlogReductionSavings: number;
  rvuIncrease: number;
  overCodingReduction: number;
}

export const MetricsExpandedView = ({
  coderProductivitySavings,
  billingAutomationSavings,
  physicianTimeSavings,
  technologyCostSavings,
  claimDenialSavings,
  backlogReductionSavings,
  rvuIncrease,
  overCodingReduction,
}: MetricsExpandedViewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const costSavingsMetrics = [
    {
      label: "Coder Productivity Gains",
      value: coderProductivitySavings,
      description: "Savings from increased coding efficiency and reduced manual work",
    },
    {
      label: "Billing Automation Savings",
      value: billingAutomationSavings,
      description: "Reduced billing staff time through automated claim processing",
    },
    {
      label: "Physician Time Savings",
      value: physicianTimeSavings,
      description: "Time saved by physicians due to improved coding accuracy",
    },
    {
      label: "Technology Cost Reduction",
      value: technologyCostSavings,
      description: "Savings from eliminating legacy coding software licenses",
    },
    {
      label: "Claim Denial Reduction",
      value: claimDenialSavings,
      description: "Reduced costs from fewer claim denials and rework",
    },
    {
      label: "Backlog Elimination",
      value: backlogReductionSavings,
      description: "Savings from eliminating coding backlogs and delays",
    },
  ];

  const revenueMetrics = [
    {
      label: "RVU Optimization",
      value: rvuIncrease,
      description: "Additional revenue from optimized RVU coding accuracy",
    },
  ];

  const riskMetrics = [
    {
      label: "Compliance Risk Reduction",
      value: overCodingReduction,
      description: "Risk mitigation value from improved coding compliance",
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Detailed Metrics Breakdown
            <TooltipInfo content="Click to view the breakdown of all calculated savings, revenue increases, and risk reductions" />
          </CardTitle>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isExpanded ? (
                  <>
                    Hide Details <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Show Details <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Cost Savings */}
                <div>
                  <h4 className="text-lg font-semibold text-green-600 mb-3">Cost Savings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {costSavingsMetrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800">{metric.label}</span>
                          <TooltipInfo content={metric.description} />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(metric.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Increase */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-3">Revenue Increase</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {revenueMetrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-800">{metric.label}</span>
                          <TooltipInfo content={metric.description} />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(metric.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Reduction */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-600 mb-3">Risk Reduction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {riskMetrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-purple-800">{metric.label}</span>
                          <TooltipInfo content={metric.description} />
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(metric.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardHeader>
    </Card>
  );
};