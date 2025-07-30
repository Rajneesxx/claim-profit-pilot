import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Target } from 'lucide-react';

interface AnalyticsProps {
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

export const Analytics = ({ calculations }: AnalyticsProps) => {
  const metrics = [
    {
      title: "Total Coding Costs",
      value: calculations.totalCodingCosts,
      icon: DollarSign,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-700/50"
    },
    {
      title: "Denied Claims Cost",
      value: calculations.deniedClaimsCost,
      icon: TrendingUp,
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-700/50"
    },
    {
      title: "Backlog Cost",
      value: calculations.backlogCost,
      icon: Target,
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-700/50"
    },
    {
      title: "Total Impact",
      value: calculations.executiveSummary.totalImpact,
      icon: BarChart3,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-700/50"
    }
  ];

  return (
    <>
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5" />
          Analytics & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className={`${metric.bgColor} ${metric.borderColor} border rounded-lg p-6`}
            >
              <div className="flex items-center gap-3 mb-3">
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                <h3 className="text-gray-300 font-medium">{metric.title}</h3>
              </div>
              <div className={`text-2xl font-bold ${metric.color}`}>
                ${metric.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown Analysis */}
        <div className="bg-gray-800/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Cost Breakdown Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Reduced Cost</span>
              <span className="text-green-400 font-semibold">
                ${calculations.executiveSummary.reducedCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Increased Revenue</span>
              <span className="text-blue-400 font-semibold">
                ${calculations.executiveSummary.increaseRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Reduced Risk</span>
              <span className="text-purple-400 font-semibold">
                ${calculations.executiveSummary.reducedRisk.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Impact</span>
                <span className="text-green-400 font-bold text-xl">
                  ${calculations.executiveSummary.totalImpact.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};