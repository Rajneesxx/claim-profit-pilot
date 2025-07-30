import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Calculator } from 'lucide-react';

export const AggregateMetrics = () => {
  const metrics = [
    {
      icon: Users,
      label: "Finance Leaders",
      value: "2,847",
      description: "have calculated their ROI",
      color: "text-blue-400"
    },
    {
      icon: DollarSign,
      label: "Total ROI Calculated",
      value: "$847M",
      description: "in potential savings",
      color: "text-green-400"
    },
    {
      icon: TrendingUp,
      label: "Average Savings",
      value: "312%",
      description: "ROI improvement",
      color: "text-purple-400"
    },
    {
      icon: Calculator,
      label: "Calculations Today",
      value: "156",
      description: "organizations analyzed",
      color: "text-orange-400"
    }
  ];

  return (
    <Card className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 h-fit">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-white text-center">
          Community Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                {metric.value}
              </div>
              <div className="text-gray-300 font-medium text-sm mb-1">
                {metric.label}
              </div>
              <div className="text-gray-500 text-xs">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
          <div className="text-center">
            <div className="text-purple-400 text-sm font-medium mb-1">
              Latest Update
            </div>
            <div className="text-gray-300 text-xs">
              Healthcare Systems Inc. just saved $2.3M annually with our solution
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};