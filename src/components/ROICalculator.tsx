import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  RefreshCw
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
          reducedCost: 642194,
          increaseRevenue: 241939,
          reducedRisk: 70775,
          totalImpact: 954908
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
• Reduced Cost: $642,194
• Increased Revenue: $241,939
• Reduced Risk: $70,775
• Total Impact: $954,908

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

  // Executive Summary Calculations based on provided formulas
  
  // Reduced Cost calculations
  const coderProductivitySaving = metrics.chartsProcessedPerAnnum * 0.5 * (8 / metrics.chartsPerCoderPerDay) * (metrics.salaryPerCoder / (250 * 8)); // Assuming 50% productivity improvement
  const claimDenialReduction = metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100) * 0.5 * metrics.costPerDeniedClaim; // 50% reduction in denials
  const backlogReduction = metrics.chartsProcessedPerAnnum * (metrics.codingBacklogPercent / 100) * 0.8 * metrics.daysPerChartInBacklog * (metrics.costOfCapital / 100) / 365; // 80% reduction in backlog
  const reducedCost = coderProductivitySaving + claimDenialReduction + backlogReduction;
  
  // Increased Revenue calculations
  const rvuImprovement = metrics.rvusCodedPerAnnum * 0.01 * metrics.weightedAverageGPCI * 36; // 1% improvement with $36 conversion factor
  const increaseRevenue = rvuImprovement;
  
  // Reduced Risk calculations
  const overcodingRiskReduction = metrics.chartsProcessedPerAnnum * (metrics.overCodingPercent / 100) * 1.0 * 100; // $100 compliance cost per overcoded chart
  const reducedRisk = overcodingRiskReduction;
  
  // Debug logging
  console.log('RVUs per annum:', metrics.rvusCodedPerAnnum);
  console.log('Weighted Average GPCI:', metrics.weightedAverageGPCI);
  console.log('Increased Revenue:', increaseRevenue);
  console.log('Charts processed per annum:', metrics.chartsProcessedPerAnnum);
  console.log('Over coding percent:', metrics.overCodingPercent);
  console.log('Reduced Risk:', reducedRisk);
  
  const totalImpact = reducedCost + increaseRevenue + reducedRisk;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-info text-primary-foreground">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Rapid Claims ROI Calculator</h1>
              </div>
              <p className="text-lg opacity-90">
                Analyze and optimize your medical coding operations with comprehensive metrics
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={resetToDefaults}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                variant="secondary"
                onClick={shareResults}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="secondary"
                onClick={exportData}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* ROI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {roi.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Claimed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                ${metrics.revenueClaimed.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Operational Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                ${totalOperationalCosts.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info flex items-center gap-2">
                <Target className="h-5 w-5" />
                {(efficiencyRatio * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <BarChart3 className="h-6 w-6" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Reduced Cost</h4>
                <div className="text-2xl font-bold text-success">
                  ${reducedCost.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left space-y-1">
                  <p>1. Reduced cost of coding a chart because of the improved coder productivity</p>
                  <p>2. 0 coding errors with AI coding to reduce cost to collect</p>
                  <p>3. Reduced cost of capital with lower A/R days</p>
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Increased Revenue</h4>
                <div className="text-2xl font-bold text-primary">
                  ${increaseRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left space-y-1">
                  <p>1. CDI solution helps identify opportunities missed by manual coders/physicians in HCC coding and hence improving the overall RAF score</p>
                  <p>2. AI based E&M coding proven to improve E&M score</p>
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-info/10 to-info/5 border border-info/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Reduced Risk</h4>
                <div className="text-2xl font-bold text-info">
                  ${reducedRisk.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left space-y-1">
                  <p>1. RapidCode follows all the coding guidelines and flags any place where the guidelines are not followed</p>
                  <p>2. This ensures lower probability of audits and costs</p>
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Impact</h4>
                <div className="text-2xl font-bold text-warning">
                  ${totalImpact.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left">
                  <p>Total expected impact for 12 months after 100% adoption. Gains from pilot stage to pre full-adoption time is not included in the impact estimation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Input Controls with Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue & Claims */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BarChart3 className="h-5 w-5" />
                Revenue & Claims Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Revenue Claimed</label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[metrics.revenueClaimed]}
                    onValueChange={([value]) => updateMetric('revenueClaimed', value)}
                    max={50000000}
                    min={1000000}
                    step={100000}
                    className="w-full"
                  />
                  <div className="text-2xl font-bold text-primary">
                    ${metrics.revenueClaimed.toLocaleString()}
                  </div>
                </div>
              </div>
              
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
            </CardContent>
          </Card>

          {/* Coding Team */}
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Users className="h-5 w-5" />
                Coding Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Number of Coders</label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[metrics.numberOfCoders]}
                    onValueChange={([value]) => updateMetric('numberOfCoders', value)}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-2xl font-bold text-success">
                    {metrics.numberOfCoders}
                  </div>
                </div>
              </div>
              
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
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Collection Costs */}
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Collection Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Claims Denied %</label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[metrics.claimDeniedPercent]}
                    onValueChange={([value]) => updateMetric('claimDeniedPercent', value)}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xl font-bold text-warning">
                    {metrics.claimDeniedPercent}%
                  </div>
                </div>
              </div>
              
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
            </CardContent>
          </Card>

          {/* Capital Costs */}
          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-info">
                <TrendingUp className="h-5 w-5" />
                Capital Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>

          {/* RVU & Audit Data */}
          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                <FileText className="h-5 w-5" />
                RVU & Audit Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <div className="text-lg font-bold text-secondary-foreground">
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
                  <div className="text-lg font-bold text-secondary-foreground">
                    {metrics.underCodingPercent}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
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
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-muted-foreground">Denied Claims Cost</h4>
                <div className="text-2xl font-bold text-destructive">
                  ${deniedClaimsCost.toLocaleString()}
                </div>
                <Badge variant="secondary">
                  {((deniedClaimsCost / totalOperationalCosts) * 100).toFixed(1)}% of total
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-muted-foreground">Backlog Cost</h4>
                <div className="text-2xl font-bold text-warning">
                  ${backlogCost.toLocaleString()}
                </div>
                <Badge variant="secondary">
                  {((backlogCost / totalOperationalCosts) * 100).toFixed(1)}% of total
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t bg-muted/20">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Rapid Claims ROI Calculator - Powered by RapidClaims.ai
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span>🚀 AI-Powered Coding</span>
              <span>📊 Real-time ROI Analysis</span>
              <span>💾 Data Export Capabilities</span>
              <span>🔒 Secure & Private</span>
              <span>📱 Mobile Responsive</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 RapidClaims.ai - Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};