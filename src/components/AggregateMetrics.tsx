import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Calculator } from 'lucide-react';

export const AggregateMetrics = () => {
  const metrics = [
    {
      icon: Users,
      label: "Healthcare Organizations",
      value: "450+",
      description: "have calculated their ROI",
      color: "text-primary"
    },
    {
      icon: DollarSign,
      label: "Average Annual Savings",
      value: "$2.4M",
      description: "per organization",
      color: "text-coral"
    },
    {
      icon: TrendingUp,
      label: "Typical ROI Range",
      value: "180-350%",
      description: "within 12 months",
      color: "text-primary"
    },
    {
      icon: Calculator,
      label: "Calculations This Month",
      value: "89",
      description: "organizations analyzed",
      color: "text-coral"
    }
  ];

  return (
    <Card className="bg-card backdrop-blur-sm border border-border h-fit">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-foreground text-center">
          Industry Metrics
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
              <div className="text-foreground font-medium text-sm mb-1">
                {metric.label}
              </div>
              <div className="text-muted-foreground text-xs">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg border border-border">
          <div className="text-center">
            <div className="text-primary text-sm font-medium mb-1">
              Latest Success
            </div>
            <div className="text-muted-foreground text-xs">
              Metro Health Network reduced coding costs by 45% in 6 months
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};