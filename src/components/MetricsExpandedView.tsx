import { formatCurrency } from "@/utils/formatters";
import { TooltipInfo } from "./TooltipInfo";

interface MetricsExpandedViewProps {
  coderProductivitySavings: number;
  billingAutomationSavings: number;
  physicianTimeSavings: number;
  technologyCostSavings: number;
  claimDenialSavings: number;
  ARdays: number;
  rvuIncrease: number;
  overCodingReduction: number;
}

export const MetricsExpandedView = ({
  coderProductivitySavings,
  billingAutomationSavings,
  physicianTimeSavings,
  technologyCostSavings,
  claimDenialSavings,
  ARdays,
  rvuIncrease,
  overCodingReduction,
}: MetricsExpandedViewProps) => {

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
      label: "ARdays",
      value: ARdays,
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
    <div className="space-y-6">
      {/* Cost Savings */}
      <div>
        <h4 className="text-lg font-semibold text-black mb-3">Cost Savings</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {costSavingsMetrics.map((metric, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-green-800">{metric.label}</span>
                <TooltipInfo content={metric.description} />
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(metric.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Increase */}
      <div>
        <h4 className="text-lg font-semibold text-black mb-3">Revenue Increase</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {revenueMetrics.map((metric, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-800">{metric.label}</span>
                <TooltipInfo content={metric.description} />
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(metric.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Reduction */}
      <div>
        <h4 className="text-lg font-semibold text-black mb-3">Risk Reduction</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {riskMetrics.map((metric, index) => (
            <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-purple-800">{metric.label}</span>
                <TooltipInfo content={metric.description} />
              </div>
              <div className="text-lg font-bold text-purple-600">
                {formatCurrency(metric.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};