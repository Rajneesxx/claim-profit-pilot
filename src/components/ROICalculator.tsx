import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Minus,
  Settings,
  PieChart,
  Activity,
  Award,
  Clock,
  Shield
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

        {/* Main Calculator Interface */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/20 backdrop-blur-sm">
              <TabsTrigger value="calculator" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="summary" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                <Award className="h-4 w-4 mr-2" />
                Executive Summary
              </TabsTrigger>
            </TabsList>

            {/* Calculator Tab */}
            <TabsContent value="calculator">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  {/* Main Revenue Slider */}
                  <div className="text-center mb-8">
                    <h2 className="text-lg font-medium text-muted-foreground mb-4">Annual Revenue Claimed</h2>
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
            </TabsContent>

            {/* Advanced Settings Tab */}
            <TabsContent value="advanced">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  <Accordion type="multiple" className="w-full space-y-4">
                    {/* Claims & Revenue Data */}
                    <AccordionItem value="claims-data" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Claims & Revenue Data</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Claims per Annum</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.claimsPerAnnum]}
                              onValueChange={([value]) => updateMetric('claimsPerAnnum', value)}
                              max={100000}
                              min={1000}
                              step={100}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-primary">
                              {metrics.claimsPerAnnum.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Charts Processed per Annum</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.chartsProcessedPerAnnum]}
                              onValueChange={([value]) => updateMetric('chartsProcessedPerAnnum', value)}
                              max={100000}
                              min={1000}
                              step={100}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-primary">
                              {metrics.chartsProcessedPerAnnum.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Coding Team Settings */}
                    <AccordionItem value="coding-team" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-success" />
                          <span className="font-semibold">Coding Team Configuration</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Annual Salary per Coder</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.salaryPerCoder]}
                              onValueChange={([value]) => updateMetric('salaryPerCoder', value)}
                              max={150000}
                              min={30000}
                              step={1000}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-success">
                              ${metrics.salaryPerCoder.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Overhead Cost %</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.overheadCostPercent]}
                              onValueChange={([value]) => updateMetric('overheadCostPercent', value)}
                              max={100}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-success">
                              {metrics.overheadCostPercent}%
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Charts per Coder per Day</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.chartsPerCoderPerDay]}
                              onValueChange={([value]) => updateMetric('chartsPerCoderPerDay', value)}
                              max={50}
                              min={5}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-success">
                              {metrics.chartsPerCoderPerDay}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Financial Parameters */}
                    <AccordionItem value="financial" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-warning" />
                          <span className="font-semibold">Financial Parameters</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Cost per Denied Claim</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.costPerDeniedClaim]}
                              onValueChange={([value]) => updateMetric('costPerDeniedClaim', value)}
                              max={200}
                              min={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-warning">
                              ${metrics.costPerDeniedClaim}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Coding Backlog %</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.codingBacklogPercent]}
                              onValueChange={([value]) => updateMetric('codingBacklogPercent', value)}
                              max={30}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-info">
                              {metrics.codingBacklogPercent}%
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Days per Chart in Backlog</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.daysPerChartInBacklog]}
                              onValueChange={([value]) => updateMetric('daysPerChartInBacklog', value)}
                              max={60}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-info">
                              {metrics.daysPerChartInBacklog}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Cost of Capital %</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.costOfCapital]}
                              onValueChange={([value]) => updateMetric('costOfCapital', value)}
                              max={15}
                              min={1}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="text-xl font-bold text-info">
                              {metrics.costOfCapital}%
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* RVU & Quality Metrics */}
                    <AccordionItem value="quality" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-info" />
                          <span className="font-semibold">RVU & Quality Metrics</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">RVUs Coded per Annum</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.rvusCodedPerAnnum]}
                              onValueChange={([value]) => updateMetric('rvusCodedPerAnnum', value)}
                              max={2000000}
                              min={100000}
                              step={10000}
                              className="w-full"
                            />
                            <div className="text-lg font-bold text-secondary-foreground">
                              {metrics.rvusCodedPerAnnum.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Weighted Average GPCI</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.weightedAverageGPCI]}
                              onValueChange={([value]) => updateMetric('weightedAverageGPCI', value)}
                              max={2}
                              min={0.5}
                              step={0.01}
                              className="w-full"
                            />
                            <div className="text-lg font-bold text-secondary-foreground">
                              {metrics.weightedAverageGPCI}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Over-coding %</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.overCodingPercent]}
                              onValueChange={([value]) => updateMetric('overCodingPercent', value)}
                              max={30}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-lg font-bold text-destructive">
                              {metrics.overCodingPercent}%
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Under-coding %</label>
                          <div className="mt-2 space-y-2">
                            <Slider
                              value={[metrics.underCodingPercent]}
                              onValueChange={([value]) => updateMetric('underCodingPercent', value)}
                              max={30}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-lg font-bold text-destructive">
                              {metrics.underCodingPercent}%
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ROI Summary Cards */}
                <Card className="bg-gradient-to-br from-success/20 to-success/10 border-success/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-success-foreground flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Total ROI Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-success mb-2">
                      {roi.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Return on Investment after implementing RapidClaims.ai
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-primary-foreground flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Operational Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {(efficiencyRatio * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current coding team efficiency ratio
                    </p>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Cost Breakdown Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-muted-foreground">Coding Costs</h4>
                        <div className="text-2xl font-bold text-primary">
                          ${totalCodingCosts.toLocaleString()}
                        </div>
                        <Badge variant="secondary">
                          {((totalCodingCosts / totalOperationalCosts) * 100).toFixed(1)}% of total
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Salaries, benefits, and overhead for {metrics.numberOfCoders} coders
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-muted-foreground">Denied Claims Cost</h4>
                        <div className="text-2xl font-bold text-destructive">
                          ${deniedClaimsCost.toLocaleString()}
                        </div>
                        <Badge variant="secondary">
                          {((deniedClaimsCost / totalOperationalCosts) * 100).toFixed(1)}% of total
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Cost to rework {metrics.claimDeniedPercent}% of denied claims
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-muted-foreground">Backlog Cost</h4>
                        <div className="text-2xl font-bold text-warning">
                          ${backlogCost.toLocaleString()}
                        </div>
                        <Badge variant="secondary">
                          {((backlogCost / totalOperationalCosts) * 100).toFixed(1)}% of total
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Capital cost of {metrics.codingBacklogPercent}% backlog over {metrics.daysPerChartInBacklog} days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Executive Summary Tab */}
            <TabsContent value="summary">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary text-xl">
                    <Award className="h-6 w-6" />
                    Executive Summary - 12 Month Impact Projection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {/* Reduced Cost */}
                    <div className="text-center p-6 rounded-lg bg-gradient-to-br from-success/20 to-success/10 border border-success/30">
                      <div className="flex items-center justify-center mb-3">
                        <Shield className="h-8 w-8 text-success" />
                      </div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Reduced Cost</h4>
                      <div className="text-3xl font-bold text-success mb-3">
                        ${reducedCost.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground text-left space-y-2">
                        <p>✓ 50% productivity improvement saves ${coderProductivitySaving.toLocaleString()}</p>
                        <p>✓ 50% reduction in claim denials saves ${claimDenialReduction.toLocaleString()}</p>
                        <p>✓ 80% backlog reduction saves ${backlogReduction.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Increased Revenue */}
                    <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                      <div className="flex items-center justify-center mb-3">
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Increased Revenue</h4>
                      <div className="text-3xl font-bold text-primary mb-3">
                        ${increaseRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground text-left space-y-2">
                        <p>✓ CDI identifies missed HCC coding opportunities</p>
                        <p>✓ AI-based E&M coding improves accuracy</p>
                        <p>✓ 1% RVU improvement: ${rvuImprovement.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Reduced Risk */}
                    <div className="text-center p-6 rounded-lg bg-gradient-to-br from-info/20 to-info/10 border border-info/30">
                      <div className="flex items-center justify-center mb-3">
                        <AlertTriangle className="h-8 w-8 text-info" />
                      </div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Reduced Risk</h4>
                      <div className="text-3xl font-bold text-info mb-3">
                        ${reducedRisk.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground text-left space-y-2">
                        <p>✓ Automated compliance guideline checking</p>
                        <p>✓ Reduces audit risk and associated costs</p>
                        <p>✓ Eliminates over-coding penalties</p>
                      </div>
                    </div>
                    
                    {/* Total Impact */}
                    <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center justify-center mb-3">
                        <Target className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Impact</h4>
                      <div className="text-3xl font-bold text-yellow-600 mb-3">
                        ${totalImpact.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground text-left">
                        <p>Expected total impact for 12 months after 100% adoption. ROI: <span className="font-bold">{roi.toFixed(1)}%</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Key Performance Indicators */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Key Performance Indicators
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">
                          {(metrics.chartsProcessedPerAnnum / 1000).toFixed(0)}k
                        </div>
                        <div className="text-sm text-muted-foreground">Charts/Year</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-success">
                          {metrics.chartsPerCoderPerDay}
                        </div>
                        <div className="text-sm text-muted-foreground">Charts/Coder/Day</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-warning">
                          {metrics.claimDeniedPercent}%
                        </div>
                        <div className="text-sm text-muted-foreground">Denial Rate</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-info">
                          {metrics.codingBacklogPercent}%
                        </div>
                        <div className="text-sm text-muted-foreground">Backlog Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div>
                          <p className="font-medium">Immediate Implementation</p>
                          <p className="text-muted-foreground">Deploy RapidClaims.ai to achieve {roi.toFixed(1)}% ROI and ${totalImpact.toLocaleString()} annual impact</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                        <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                        <div>
                          <p className="font-medium">Monitor Key Metrics</p>
                          <p className="text-muted-foreground">Track denial rates, backlog percentage, and coder productivity for continuous improvement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-info/10">
                        <div className="w-2 h-2 rounded-full bg-info mt-2"></div>
                        <div>
                          <p className="font-medium">Scale Gradually</p>
                          <p className="text-muted-foreground">Implement in phases to ensure smooth transition and maximize adoption benefits</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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