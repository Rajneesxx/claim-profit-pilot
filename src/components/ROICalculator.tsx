import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 relative overflow-hidden">
      {/* Subtle animated background - toned down */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-300/15 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500/8 rounded-full animate-ping"></div>
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-purple-800/95 backdrop-blur-md border-b border-purple-400/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/4fdc463b-67d9-4490-b3fe-75d8280201ba.png" alt="RapidClaims" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold text-white">ROI Calculator</h1>
            </div>
            <div className="text-white text-sm">
              {/* Removed AI-based RCM automation solution text */}
            </div>
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex pt-20 min-h-screen">
        {/* Left Panel - Aggregate Metrics (Sticky) */}
        <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 p-6 sticky top-20 h-fit text-white">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-4">Platform Impact</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-400/30">
                  <div className="text-2xl font-bold text-purple-300">{aggregateStats.totalFinanceLeaders.toLocaleString()}</div>
                  <div className="text-sm text-white/70">Finance Leaders</div>
                  <div className="text-xs text-white/60">have calculated ROI</div>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                  <div className="text-2xl font-bold text-green-400">${(aggregateStats.totalROICalculated / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-white/70">Total ROI</div>
                  <div className="text-xs text-white/60">calculated to date</div>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
                  <div className="text-2xl font-bold text-blue-400">${(aggregateStats.totalDollarsSaved / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-white/70">Dollars Saved</div>
                  <div className="text-xs text-white/60">by our clients</div>
                </div>
                
                <div className="p-4 rounded-lg bg-orange-500/20 border border-orange-400/30">
                  <div className="text-2xl font-bold text-orange-400">{aggregateStats.avgROI}%</div>
                  <div className="text-sm text-white/70">Average ROI</div>
                  <div className="text-xs text-white/60">across all clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Main Calculator */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-black/20 backdrop-blur-sm border border-white/10">
                <TabsTrigger value="calculator" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="assumptions" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Assumptions
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Award className="h-4 w-4 mr-2" />
                  Summary
                </TabsTrigger>
              </TabsList>

              {/* Calculator Tab */}
              <TabsContent value="calculator">
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-white">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Calculator className="h-6 w-6" />
                      <h2 className="text-xl font-bold">ROI Calculator</h2>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Basic Input Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="revenue" className="text-white">Annual Revenue ($)</Label>
                          <Input
                            id="revenue"
                            type="number"
                            value={metrics.revenueClaimed}
                            onChange={(e) => updateMetric('revenueClaimed', Number(e.target.value))}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="claims" className="text-white">Claims Per Year</Label>
                          <Input
                            id="claims"
                            type="number"
                            value={metrics.claimsPerAnnum}
                            onChange={(e) => updateMetric('claimsPerAnnum', Number(e.target.value))}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="coders" className="text-white">Number of Coders: {metrics.numberOfCoders}</Label>
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
                          <Label htmlFor="salary" className="text-white">Salary Per Coder ($)</Label>
                          <Input
                            id="salary"
                            type="number"
                            value={metrics.salaryPerCoder}
                            onChange={(e) => updateMetric('salaryPerCoder', Number(e.target.value))}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="denial" className="text-white">Claim Denial Rate (%): {metrics.claimDeniedPercent}%</Label>
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
                          <Label htmlFor="backlog" className="text-white">Coding Backlog (%): {metrics.codingBacklogPercent}%</Label>
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
                    <div className="border-t border-white/10 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-purple-500/20 border border-purple-400/30">
                          <div className="text-2xl font-bold text-purple-300">{roi.toFixed(1)}%</div>
                          <div className="text-sm text-white/70">ROI</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                          <div className="text-2xl font-bold text-green-400">${totalImpact.toLocaleString()}</div>
                          <div className="text-sm text-white/70">Total Impact</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-orange-500/20 border border-orange-400/30">
                          <div className="text-2xl font-bold text-orange-400">${totalOperationalCosts.toLocaleString()}</div>
                          <div className="text-sm text-white/70">Operational Costs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced">
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-white">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Settings className="h-6 w-6" />
                      <h2 className="text-xl font-bold">Advanced Settings</h2>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="coding" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-white/80">Coding Parameters</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Charts Per Coder Per Day: {metrics.chartsPerCoderPerDay}</Label>
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
                            <Label className="text-white">Overhead Cost (%): {metrics.overheadCostPercent}%</Label>
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
                    
                    <AccordionItem value="denials" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-white/80">Denial Management</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <Label htmlFor="denialCost" className="text-white">Cost Per Denied Claim ($)</Label>
                          <Input
                            id="denialCost"
                            type="number"
                            value={metrics.costPerDeniedClaim}
                            onChange={(e) => updateMetric('costPerDeniedClaim', Number(e.target.value))}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>

              {/* Assumptions & References Tab */}
              <TabsContent value="assumptions">
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-white">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <FileText className="h-6 w-6" />
                      <h2 className="text-xl font-bold">Assumptions & References</h2>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="prose prose-sm max-w-none text-white">
                      <h3 className="text-lg font-semibold mb-4 text-white">Key Assumptions</h3>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li>• 50% productivity improvement with AI automation</li>
                        <li>• 50% reduction in claim denials through improved accuracy</li>
                        <li>• 80% reduction in coding backlog</li>
                        <li>• 1% RVU improvement through better coding precision</li>
                        <li>• Standard working days: 250 per year</li>
                        <li>• Standard working hours: 8 hours per day</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mb-4 mt-6 text-white">Industry References</h3>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li>• Medicare physician fee schedule (CMS)</li>
                        <li>• AHIMA coding productivity standards</li>
                        <li>• Healthcare Financial Management Association (HFMA) benchmarks</li>
                        <li>• Medical Group Management Association (MGMA) data</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mb-4 mt-6 text-white">Calculation Methodology</h3>
                      <div className="text-sm space-y-2 text-white/80">
                        <p><strong className="text-white">Total Coding Costs:</strong> (Number of Coders × Salary) × (1 + Overhead %)</p>
                        <p><strong className="text-white">Denied Claims Cost:</strong> (Claims × Denial %) × Cost per Denial</p>
                        <p><strong className="text-white">Backlog Cost:</strong> (Charts × Backlog %) × Days × (Cost of Capital % / 365)</p>
                        <p><strong className="text-white">ROI:</strong> ((Revenue - Operational Costs) / Operational Costs) × 100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-lg p-8 text-white">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-purple-300" />
                      <h2 className="text-2xl font-bold">Executive Summary - 12 Month Impact Projection</h2>
                    </div>
                  </div>

                   {/* Header only - cards removed */}

                   {/* Detailed Results Section under Total Impact */}
                   <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                     <div className="flex items-center gap-3 mb-6">
                       <FileText className="h-5 w-5 text-orange-400" />
                       <h3 className="text-xl font-bold text-white">Detailed Results Breakdown</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Financial Impact */}
                       <div className="space-y-4">
                         <h4 className="text-lg font-semibold text-orange-300">Financial Impact</h4>
                         <div className="space-y-3">
                           <div className="flex justify-between">
                             <span className="text-white/70">Reduced Coding Costs:</span>
                             <span className="text-green-400 font-semibold">${reducedCost.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-white/70">Increased Revenue:</span>
                             <span className="text-purple-400 font-semibold">${increaseRevenue.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-white/70">Risk Mitigation:</span>
                             <span className="text-purple-400 font-semibold">${reducedRisk.toLocaleString()}</span>
                           </div>
                           <div className="border-t border-white/20 pt-3">
                             <div className="flex justify-between text-lg">
                               <span className="text-white font-semibold">Total Impact:</span>
                               <span className="text-orange-400 font-bold">${totalImpact.toLocaleString()}</span>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* ROI Metrics */}
                       <div className="space-y-4">
                         <h4 className="text-lg font-semibold text-orange-300">ROI Metrics</h4>
                         <div className="space-y-3">
                           <div className="flex justify-between">
                             <span className="text-white/70">Return on Investment:</span>
                             <span className="text-yellow-400 font-semibold">{roi.toFixed(1)}%</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-white/70">Payback Period:</span>
                             <span className="text-blue-400 font-semibold">{(12/roi*100).toFixed(1)} months</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-white/70">Monthly Savings:</span>
                             <span className="text-green-400 font-semibold">${(totalImpact/12).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-white/70">Annual Benefit:</span>
                             <span className="text-orange-400 font-semibold">${totalImpact.toLocaleString()}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     {/* Action Buttons */}
                     <div className="mt-6 pt-6 border-t border-white/20">
                       <div className="flex gap-4 justify-center">
                         <Button 
                           className="bg-orange-500 hover:bg-orange-600 text-white"
                           onClick={exportData}
                         >
                           <Download className="h-4 w-4 mr-2" />
                           Download Full Report
                         </Button>
                         <Button 
                           variant="outline" 
                           className="text-white border-white/30 hover:bg-white/10"
                           onClick={() => setShowResults(true)}
                         >
                           <Share2 className="h-4 w-4 mr-2" />
                           View Summary Modal
                         </Button>
                       </div>
                     </div>
                   </div>

                  {/* Key Performance Indicators */}
                  <div className="mt-12">
                    <div className="flex items-center gap-3 mb-6">
                      <Clock className="h-5 w-5 text-purple-300" />
                      <h3 className="text-xl font-bold">Key Performance Indicators</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-300 mb-1">
                          {(metrics.chartsProcessedPerAnnum / 1000).toFixed(0)}k
                        </div>
                        <div className="text-white/70 text-sm">Charts/Year</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          {metrics.chartsPerCoderPerDay}
                        </div>
                        <div className="text-white/70 text-sm">Charts/Coder/Day</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-400 mb-1">
                          {metrics.claimDeniedPercent}%
                        </div>
                        <div className="text-white/70 text-sm">Denial Rate</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-300 mb-1">
                          {metrics.codingBacklogPercent}%
                        </div>
                        <div className="text-white/70 text-sm">Backlog Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Minimized Sticky Bottom CTA Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-900/95 to-purple-900/95 backdrop-blur-md border-t border-blue-400/20 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/4fdc463b-67d9-4490-b3fe-75d8280201ba.png" alt="RapidClaims" className="h-8 w-auto" />
              <div className="text-white">
                <span className="font-medium text-sm">Book a call with RapidClaims.ai</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2">
                <Phone className="h-4 w-4 mr-2" />
                Book Call
              </Button>
              <Button size="sm" variant="outline" className="text-white border-white/40 hover:bg-white/20 hover:text-white font-medium px-4 py-2">
                Free Audit
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

      {/* Results Display - ROI Summary Report Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full text-white">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-300 mb-2">ROI Summary Report</h2>
              <h3 className="text-lg text-gray-400">Total Return on Investment</h3>
            </div>

            {/* Main Impact Display */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <div className="text-gray-400 text-sm mb-2">Total Impact</div>
                </div>
                <div className="text-right">
                  <div className="bg-green-600 rounded px-4 py-2">
                    <div className="text-green-100 text-lg font-bold">${totalImpact.toLocaleString()}</div>
                    <div className="text-green-200 text-sm">Cost Savings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 cursor-pointer ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'
                      }`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowResults(false)} 
                className="bg-gray-700 hover:bg-gray-600 text-white border-0"
              >
                Close
              </Button>
              <Button 
                onClick={exportData} 
                className="bg-orange-500 hover:bg-orange-600 text-white border-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};