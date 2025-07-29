import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
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
  Shield,
  Star,
  Calendar,
  Mail,
  Phone,
  Info,
  CheckCircle
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
    numberOfCoders: 2, // Changed from 10 to 2 as requested
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
  const [userEmail, setUserEmail] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [rating, setRating] = useState(0);

  // Aggregate stats for left panel
  const aggregateStats = {
    totalFinanceLeaders: 2847,
    totalROICalculated: 47250000,
    totalDollarsSaved: 23750000,
    avgROI: 342
  };

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

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleShowResults = () => {
    if (!userEmail) {
      setShowEmailDialog(true);
    } else {
      setShowResults(true);
      triggerConfetti();
      toast({
        title: "🎉 Results Ready!",
        description: `Total Impact: $${totalImpact.toLocaleString()} | ROI: ${roi.toFixed(1)}%`
      });
    }
  };

  const handleEmailSubmit = () => {
    if (userEmail) {
      setShowEmailDialog(false);
      setShowResults(true);
      triggerConfetti();
      toast({
        title: "🎉 Results Ready!",
        description: `Total Impact: $${totalImpact.toLocaleString()} | ROI: ${roi.toFixed(1)}%`
      });
    }
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    toast({
      title: "Thank you for your feedback!",
      description: `You rated us ${stars} star${stars !== 1 ? 's' : ''}.`
    });
  };

  const exportData = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      userEmail,
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
    <div className="min-h-screen bg-gradient-to-br from-primary via-slate-800 to-background relative overflow-hidden">
      {/* Subtle animated background - toned down */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-slate-500/8 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gray-500/3 rounded-full animate-ping"></div>
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="text-2xl font-bold text-orange-400">RC</div>
              <h1 className="text-2xl font-bold">Rapid ROI Calculator</h1>
            </div>
            <div className="text-white text-sm">
              AI-based RCM automation solution
            </div>
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex pt-20 min-h-screen">
        {/* Left Panel - Aggregate Metrics (Sticky) */}
        <div className="w-80 bg-card/90 backdrop-blur-sm border-r border-border p-6 sticky top-20 h-fit">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-primary mb-4">Platform Impact</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{aggregateStats.totalFinanceLeaders.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Finance Leaders</div>
                  <div className="text-xs text-muted-foreground">have calculated ROI</div>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">${(aggregateStats.totalROICalculated / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Total ROI</div>
                  <div className="text-xs text-muted-foreground">calculated to date</div>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">${(aggregateStats.totalDollarsSaved / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Dollars Saved</div>
                  <div className="text-xs text-muted-foreground">by our clients</div>
                </div>
                
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-400">{aggregateStats.avgROI}%</div>
                  <div className="text-sm text-muted-foreground">Average ROI</div>
                  <div className="text-xs text-muted-foreground">across all clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Main Calculator */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/90 backdrop-blur-sm border border-border">
                <TabsTrigger value="calculator" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="assumptions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  Assumptions
                </TabsTrigger>
                <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Award className="h-4 w-4 mr-2" />
                  Summary
                </TabsTrigger>
              </TabsList>

              {/* Calculator Tab */}
              <TabsContent value="calculator">
                <Card className="bg-card/95 backdrop-blur-sm border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Calculator className="h-6 w-6" />
                      ROI Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Input Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="revenue">Annual Revenue ($)</Label>
                          <Input
                            id="revenue"
                            type="number"
                            value={metrics.revenueClaimed}
                            onChange={(e) => updateMetric('revenueClaimed', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="claims">Claims Per Year</Label>
                          <Input
                            id="claims"
                            type="number"
                            value={metrics.claimsPerAnnum}
                            onChange={(e) => updateMetric('claimsPerAnnum', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="coders">Number of Coders: {metrics.numberOfCoders}</Label>
                          <Slider
                            value={[metrics.numberOfCoders]}
                            onValueChange={(value) => updateMetric('numberOfCoders', value[0])}
                            max={20}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="salary">Salary Per Coder ($)</Label>
                          <Input
                            id="salary"
                            type="number"
                            value={metrics.salaryPerCoder}
                            onChange={(e) => updateMetric('salaryPerCoder', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="denial">Claim Denial Rate (%): {metrics.claimDeniedPercent}%</Label>
                          <Slider
                            value={[metrics.claimDeniedPercent]}
                            onValueChange={(value) => updateMetric('claimDeniedPercent', value[0])}
                            max={50}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="backlog">Coding Backlog (%): {metrics.codingBacklogPercent}%</Label>
                          <Slider
                            value={[metrics.codingBacklogPercent]}
                            onValueChange={(value) => updateMetric('codingBacklogPercent', value[0])}
                            max={20}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Results Preview */}
                    <div className="border-t pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                          <div className="text-2xl font-bold text-primary">{roi.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">ROI</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="text-2xl font-bold text-green-400">${totalImpact.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Impact</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <div className="text-2xl font-bold text-orange-400">${totalOperationalCosts.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Operational Costs</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced">
                <Card className="bg-card/95 backdrop-blur-sm border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Settings className="h-6 w-6" />
                      Advanced Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-4">
                      <AccordionItem value="coding">
                        <AccordionTrigger>Coding Parameters</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Charts Per Coder Per Day: {metrics.chartsPerCoderPerDay}</Label>
                              <Slider
                                value={[metrics.chartsPerCoderPerDay]}
                                onValueChange={(value) => updateMetric('chartsPerCoderPerDay', value[0])}
                                max={30}
                                min={5}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Overhead Cost (%): {metrics.overheadCostPercent}%</Label>
                              <Slider
                                value={[metrics.overheadCostPercent]}
                                onValueChange={(value) => updateMetric('overheadCostPercent', value[0])}
                                max={100}
                                min={0}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="denials">
                        <AccordionTrigger>Denial Management</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div>
                            <Label htmlFor="denialCost">Cost Per Denied Claim ($)</Label>
                            <Input
                              id="denialCost"
                              type="number"
                              value={metrics.costPerDeniedClaim}
                              onChange={(e) => updateMetric('costPerDeniedClaim', Number(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assumptions & References Tab */}
              <TabsContent value="assumptions">
                <Card className="bg-card/95 backdrop-blur-sm border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <FileText className="h-6 w-6" />
                      Assumptions & References
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-sm max-w-none text-foreground">
                      <h3 className="text-lg font-semibold mb-4">Key Assumptions</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• 50% productivity improvement with AI automation</li>
                        <li>• 50% reduction in claim denials through improved accuracy</li>
                        <li>• 80% reduction in coding backlog</li>
                        <li>• 1% RVU improvement through better coding precision</li>
                        <li>• Standard working days: 250 per year</li>
                        <li>• Standard working hours: 8 hours per day</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mb-4 mt-6">Industry References</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Medicare physician fee schedule (CMS)</li>
                        <li>• AHIMA coding productivity standards</li>
                        <li>• Healthcare Financial Management Association (HFMA) benchmarks</li>
                        <li>• Medical Group Management Association (MGMA) data</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mb-4 mt-6">Calculation Methodology</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>Total Coding Costs:</strong> (Number of Coders × Salary) × (1 + Overhead %)</p>
                        <p><strong>Denied Claims Cost:</strong> (Claims × Denial %) × Cost per Denial</p>
                        <p><strong>Backlog Cost:</strong> (Charts × Backlog %) × Days × (Cost of Capital % / 365)</p>
                        <p><strong>ROI:</strong> ((Revenue - Operational Costs) / Operational Costs) × 100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <Card className="bg-card/95 backdrop-blur-sm border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Award className="h-6 w-6" />
                      Executive Summary - Old vs New
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Current State */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-destructive">Current State</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <div className="text-lg font-bold text-destructive">{metrics.numberOfCoders} Coders</div>
                            <div className="text-sm text-muted-foreground">Manual coding process</div>
                          </div>
                          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <div className="text-lg font-bold text-destructive">{metrics.claimDeniedPercent}% Denials</div>
                            <div className="text-sm text-muted-foreground">High error rate</div>
                          </div>
                          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <div className="text-lg font-bold text-destructive">{metrics.codingBacklogPercent}% Backlog</div>
                            <div className="text-sm text-muted-foreground">Processing delays</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Future State */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-success">Future State (AI-Powered)</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                            <div className="text-lg font-bold text-success">{Math.ceil(metrics.numberOfCoders * 0.5)} Coders</div>
                            <div className="text-sm text-muted-foreground">50% productivity increase</div>
                          </div>
                          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                            <div className="text-lg font-bold text-success">{(metrics.claimDeniedPercent * 0.5).toFixed(1)}% Denials</div>
                            <div className="text-sm text-muted-foreground">50% reduction in errors</div>
                          </div>
                          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                            <div className="text-lg font-bold text-success">{(metrics.codingBacklogPercent * 0.2).toFixed(1)}% Backlog</div>
                            <div className="text-sm text-muted-foreground">80% backlog reduction</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Impact Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 rounded-lg bg-success/10 border border-success/20">
                        <Shield className="h-8 w-8 text-success mx-auto mb-3" />
                        <div className="text-2xl font-bold text-success">${reducedCost.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Reduced Costs</div>
                      </div>
                      <div className="text-center p-6 rounded-lg bg-primary/10 border border-primary/20">
                        <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                        <div className="text-2xl font-bold text-primary">${increaseRevenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Increased Revenue</div>
                      </div>
                      <div className="text-center p-6 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <Shield className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-orange-400">${reducedRisk.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Reduced Risk</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-8">
                      <Button onClick={handleShowResults} className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Get Detailed Report
                      </Button>
                      <Button variant="outline" onClick={exportData}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" onClick={resetToDefaults}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur-md border-t border-white/10 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-center md:text-left">
              <div className="text-lg font-semibold">Ready to Transform Your RCM?</div>
              <div className="text-sm opacity-90">Book a call with RapidClaims - AI based RCM automation solution</div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Phone className="h-4 w-4 mr-2" />
                Book a Call
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                <FileText className="h-4 w-4 mr-2" />
                Get Free Audit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Your Detailed ROI Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a comprehensive ROI analysis and recommendations.
            </p>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            <Button onClick={handleEmailSubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Get My ROI Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Display */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle className="h-6 w-6" />
                Your ROI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{roi.toFixed(1)}%</div>
                <div className="text-lg text-muted-foreground">Total Return on Investment</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <div className="text-xl font-bold text-primary">${totalImpact.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Impact</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="text-xl font-bold text-success">${reducedCost.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Cost Savings</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 cursor-pointer ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => handleRating(star)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setShowResults(false)} variant="outline" className="flex-1">
                  Close
                </Button>
                <Button onClick={exportData} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};