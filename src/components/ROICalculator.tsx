import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Calculator,
  Target,
  Download,
  Share2,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

interface ROIMetrics {
  // Aggregate claim data
  revenueClaimed: number;
  claimsPerAnnum: number;
  chartsProcessedPerAnnum: number;
  
  // Coding costs
  numberOfCoders: number;
  salaryPerCoder: number;
  overheadCostPercent: number;
  chartsPerCoderPerDay: number;
  
  // Collection cost
  claimDeniedPercent: number;
  costPerDeniedClaim: number;
  
  // Capital costs
  codingBacklogPercent: number;
  daysPerChartInBacklog: number;
  costOfCapital: number;
  
  // RVUs
  rvusCodedPerAnnum: number;
  weightedAverageGPCI: number;
  
  // Audit data
  overCodingPercent: number;
  underCodingPercent: number;
  avgBillableCodesPerChart: number;
}

export const ROICalculator = () => {
  const { toast } = useToast();
  
  const defaultMetrics: ROIMetrics = {
    revenueClaimed: 23000000,
    claimsPerAnnum: 42700,
    chartsProcessedPerAnnum: 42700,
    numberOfCoders: 10,
    salaryPerCoder: 60000,
    overheadCostPercent: 38,
    chartsPerCoderPerDay: 17,
    claimDeniedPercent: 25,
    costPerDeniedClaim: 42,
    codingBacklogPercent: 5,
    daysPerChartInBacklog: 20,
    costOfCapital: 5,
    rvusCodedPerAnnum: 718750,
    weightedAverageGPCI: 1.03,
    overCodingPercent: 13,
    underCodingPercent: 10,
    avgBillableCodesPerChart: 4
  };

  const [metrics, setMetrics] = useState<ROIMetrics>(defaultMetrics);

  const updateMetric = (key: keyof ROIMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setMetrics(defaultMetrics);
    toast({
      title: "Reset Complete",
      description: "All metrics have been reset to default values.",
    });
  };

  const exportData = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics,
      calculations: {
        totalCodingCosts,
        deniedClaimsCost,
        backlogCost,
        totalOperationalCosts,
        roi,
        efficiencyRatio,
        executiveSummary: {
          reducedCost,
          increaseRevenue,
          reducedRisk,
          totalImpact
        }
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roi-calculator-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "ROI report has been downloaded successfully.",
    });
  };

  const shareResults = async () => {
    const shareText = `Healthcare Coding ROI Calculator Results:
    
📊 Total ROI: ${roi.toFixed(1)}%
💰 Revenue Claimed: $${metrics.revenueClaimed.toLocaleString()}
💼 Operational Costs: $${totalOperationalCosts.toLocaleString()}
🎯 Efficiency Ratio: ${(efficiencyRatio * 100).toFixed(1)}%

Executive Summary:
• Reduced Cost: $${reducedCost.toLocaleString()}
• Increased Revenue: $${increaseRevenue.toLocaleString()}
• Reduced Risk: $${reducedRisk.toLocaleString()}
• Total Impact: $${totalImpact.toLocaleString()}

Generated on ${new Date().toLocaleDateString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Healthcare Coding ROI Calculator Results',
          text: shareText,
        });
        toast({
          title: "Shared Successfully",
          description: "ROI results have been shared.",
        });
      } catch (error) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "ROI results have been copied to your clipboard.",
      });
    });
  };

  // ROI Calculations
  const totalCodingCosts = metrics.numberOfCoders * metrics.salaryPerCoder * (1 + metrics.overheadCostPercent / 100);
  const deniedClaimsCost = (metrics.claimsPerAnnum * metrics.claimDeniedPercent / 100) * metrics.costPerDeniedClaim;
  const backlogCost = (metrics.chartsProcessedPerAnnum * metrics.codingBacklogPercent / 100 * metrics.daysPerChartInBacklog * metrics.costOfCapital / 100) / 365;
  const totalOperationalCosts = totalCodingCosts + deniedClaimsCost + backlogCost;
  const roi = ((metrics.revenueClaimed - totalOperationalCosts) / totalOperationalCosts) * 100;
  const efficiencyRatio = metrics.chartsProcessedPerAnnum / (metrics.numberOfCoders * 250 * metrics.chartsPerCoderPerDay);

  // Executive Summary Calculations
  const coderProductivitySaving = metrics.chartsProcessedPerAnnum * 0.5 * (8 / metrics.chartsPerCoderPerDay) * (metrics.salaryPerCoder / (250 * 8));
  const claimDenialReduction = metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100) * 0.5 * metrics.costPerDeniedClaim;
  const backlogReduction = metrics.chartsProcessedPerAnnum * (metrics.codingBacklogPercent / 100) * 0.8 * metrics.daysPerChartInBacklog * (metrics.costOfCapital / 100) / 365;
  const reducedCost = coderProductivitySaving + claimDenialReduction + backlogReduction;
  
  const rvuImprovement = metrics.rvusCodedPerAnnum * 0.01 * metrics.weightedAverageGPCI * 36;
  const increaseRevenue = rvuImprovement;
  
  const overcodingRiskReduction = metrics.chartsProcessedPerAnnum * (metrics.overCodingPercent / 100) * 1.0 * 100;
  const reducedRisk = overcodingRiskReduction;
  
  const totalImpact = reducedCost + increaseRevenue + reducedRisk;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Calculator</h1>
          </div>
        </div>

        {/* Main Calculator Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              {/* Main Revenue Slider */}
              <div className="text-center mb-8">
                <h2 className="text-lg font-medium text-muted-foreground mb-4">Annual Online Revenue</h2>
                <div className="mb-4">
                  <Slider
                    value={[metrics.revenueClaimed]}
                    onValueChange={([value]) => updateMetric('revenueClaimed', value)}
                    max={50000000}
                    min={1000000}
                    step={100000}
                    className="w-full mb-4"
                  />
                  <div className="text-5xl font-bold text-primary mb-4">
                    ${(metrics.revenueClaimed / 1000000).toFixed(0)}M
                  </div>
                  <div className="flex justify-center gap-2 text-sm">
                    <Badge variant="outline" className="px-3 py-1">
                      ${(metrics.revenueClaimed / 1000000 * 0.5).toFixed(0)}M-${(metrics.revenueClaimed / 1000000 * 0.7).toFixed(0)}M
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      ${(metrics.revenueClaimed / 1000000 * 0.8).toFixed(0)}M-${(metrics.revenueClaimed / 1000000 * 1.2).toFixed(0)}M
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      ${(metrics.revenueClaimed / 1000000 * 1.3).toFixed(0)}M-${(metrics.revenueClaimed / 1000000 * 1.8).toFixed(0)}M
                    </Badge>
                  </div>
                </div>
              </div>

              {/* ROI Display with Semi-circle */}
              <div className="text-center mb-8">
                <div className="relative w-48 h-24 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 200 100">
                    <path
                      d="M 20 80 A 80 80 0 0 1 180 80"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <path
                      d="M 20 80 A 80 80 0 0 1 180 80"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${Math.min(roi * 2.5, 251)} 251`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-end justify-center pb-2">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{roi.toFixed(2)}%</div>
                      <div className="text-sm text-muted-foreground">ROI</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground px-4">
                  <span>$0M</span>
                  <span>${(metrics.revenueClaimed / 2000000).toFixed(0)}M</span>
                </div>
              </div>

              {/* Key Metrics with +/- Controls */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Number of Coders</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('numberOfCoders', Math.max(1, metrics.numberOfCoders - 1))}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-bold w-12 text-center">{metrics.numberOfCoders}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('numberOfCoders', Math.min(50, metrics.numberOfCoders + 1))}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Claims Denied %</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('claimDeniedPercent', Math.max(0, metrics.claimDeniedPercent - 1))}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-bold w-12 text-center">{metrics.claimDeniedPercent}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('claimDeniedPercent', Math.min(50, metrics.claimDeniedPercent + 1))}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  onClick={() => {
                    toast({
                      title: "Results Ready!",
                      description: `Total Impact: $${totalImpact.toLocaleString()} | ROI: ${roi.toFixed(1)}%`
                    });
                  }}
                >
                  SEE RESULTS
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={resetToDefaults}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={shareResults}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={exportData}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Revenue Growth</div>
                    <div className="font-bold text-lg">${(increaseRevenue / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cost Savings</div>
                    <div className="font-bold text-lg">${(reducedCost / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Risk Reduction</div>
                    <div className="font-bold text-lg">${(reducedRisk / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Claims Processed</div>
                    <div className="font-bold text-lg">{(metrics.claimsPerAnnum / 1000).toFixed(0)}k</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 text-center">
          <div className="text-white/80 space-y-4">
            <p className="text-lg font-medium">
              Rapid Claims ROI Calculator - Powered by RapidClaims.ai
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span>🚀 AI-Powered Coding</span>
              <span>📊 Real-time ROI Analysis</span>
              <span>💾 Data Export Capabilities</span>
              <span>🔒 Secure & Private</span>
              <span>📱 Mobile Responsive</span>
            </div>
            <p className="text-xs opacity-60">
              © 2024 RapidClaims.ai - Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};