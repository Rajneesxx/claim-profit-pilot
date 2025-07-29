import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp, 
  Calculator,
  Download,
  Settings,
  Activity,
  Award,
  Star,
  Phone,
  CheckCircle
} from 'lucide-react';

interface ROIMetrics {
  revenueClaimed: number;
  claimsPerAnnum: number;
  chartsProcessedPerAnnum: number;
  numberOfCoders: number;
  salaryPerCoder: number;
  overheadCostPercent: number;
  chartsPerCoderPerDay: number;
  claimDeniedPercent: number;
  costPerDeniedClaim: number;
  codingBacklogPercent: number;
  daysPerChartInBacklog: number;
  costOfCapital: number;
  rvusCodedPerAnnum: number;
  weightedAverageGPCI: number;
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
    numberOfCoders: 2,
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

  const updateMetric = (key: keyof ROIMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  // ROI Calculations
  const totalCodingCosts = metrics.numberOfCoders * metrics.salaryPerCoder * (1 + metrics.overheadCostPercent / 100);
  const deniedClaimsCost = (metrics.claimsPerAnnum * metrics.claimDeniedPercent / 100) * metrics.costPerDeniedClaim;
  const backlogCost = (metrics.chartsProcessedPerAnnum * metrics.codingBacklogPercent / 100 * metrics.daysPerChartInBacklog * metrics.costOfCapital / 100) / 365;
  const totalOperationalCosts = totalCodingCosts + deniedClaimsCost + backlogCost;
  const roi = ((metrics.revenueClaimed - totalOperationalCosts) / totalOperationalCosts) * 100;

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

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCalculateROI = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <DollarSign className="absolute top-20 left-10 text-blue-200 w-8 h-8 animate-bounce" style={{ animationDelay: '0s' }} />
        <TrendingUp className="absolute top-40 right-20 text-green-200 w-6 h-6 animate-bounce" style={{ animationDelay: '1s' }} />
        <Calculator className="absolute bottom-40 left-20 text-purple-200 w-7 h-7 animate-bounce" style={{ animationDelay: '2s' }} />
        <FileText className="absolute top-60 left-1/3 text-orange-200 w-5 h-5 animate-bounce" style={{ animationDelay: '3s' }} />
        <Users className="absolute bottom-20 right-1/4 text-indigo-200 w-6 h-6 animate-bounce" style={{ animationDelay: '4s' }} />
        <Award className="absolute top-32 right-1/3 text-pink-200 w-8 h-8 animate-bounce" style={{ animationDelay: '5s' }} />
        <Activity className="absolute bottom-60 left-1/2 text-cyan-200 w-6 h-6 animate-bounce" style={{ animationDelay: '6s' }} />
        <CheckCircle className="absolute top-96 right-10 text-emerald-200 w-7 h-7 animate-bounce" style={{ animationDelay: '7s' }} />
      </div>

      {/* Clean Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/4fdc463b-67d9-4490-b3fe-75d8280201ba.png" alt="RapidClaims" className="h-8 w-auto" />
              <h1 className="text-2xl font-semibold text-gray-900">ROI Calculator</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.chartsProcessedPerAnnum.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Charts</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.numberOfCoders}</div>
                  <div className="text-sm text-gray-500">Total Coders</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{(metrics.claimsPerAnnum / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-500">Total Claims</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.chartsPerCoderPerDay}</div>
                  <div className="text-sm text-gray-500">Charts per Coder per Day</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Calculator Content */}
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="calculator" className="text-gray-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="assumptions" className="text-gray-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              Assumptions
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-gray-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Award className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calculator className="h-5 w-5" />
                  Organization Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="revenue" className="text-sm font-medium text-gray-700">Annual Revenue ($)</Label>
                      <Input
                        id="revenue"
                        type="number"
                        value={metrics.revenueClaimed}
                        onChange={(e) => updateMetric('revenueClaimed', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="claims" className="text-sm font-medium text-gray-700">Claims Per Year</Label>
                      <Input
                        id="claims"
                        type="number"
                        value={metrics.claimsPerAnnum}
                        onChange={(e) => updateMetric('claimsPerAnnum', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="coders" className="text-sm font-medium text-gray-700">Number of Coders</Label>
                      <Input
                        id="coders"
                        type="number"
                        value={metrics.numberOfCoders}
                        onChange={(e) => updateMetric('numberOfCoders', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="charts" className="text-sm font-medium text-gray-700">Charts Processed/Year</Label>
                      <Input
                        id="charts"
                        type="number"
                        value={metrics.chartsProcessedPerAnnum}
                        onChange={(e) => updateMetric('chartsProcessedPerAnnum', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="salary" className="text-sm font-medium text-gray-700">Salary per Coder ($)</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={metrics.salaryPerCoder}
                        onChange={(e) => updateMetric('salaryPerCoder', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="overhead" className="text-sm font-medium text-gray-700">Overhead Cost (%)</Label>
                      <Input
                        id="overhead"
                        type="number"
                        value={metrics.overheadCostPercent}
                        onChange={(e) => updateMetric('overheadCostPercent', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="chartsPerDay" className="text-sm font-medium text-gray-700">Charts per Coder per Day</Label>
                      <Input
                        id="chartsPerDay"
                        type="number"
                        value={metrics.chartsPerCoderPerDay}
                        onChange={(e) => updateMetric('chartsPerCoderPerDay', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="denialRate" className="text-sm font-medium text-gray-700">Claim Denial Rate (%)</Label>
                      <Input
                        id="denialRate"
                        type="number"
                        value={metrics.claimDeniedPercent}
                        onChange={(e) => updateMetric('claimDeniedPercent', Number(e.target.value))}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  {/* Semi-circular ROI Meter */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-64 h-32">
                      <svg viewBox="0 0 200 100" className="w-full h-full">
                        {/* Background Arc */}
                        <path
                          d="M 20 80 A 80 80 0 0 1 180 80"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        {/* Progress Arc */}
                        <path
                          d="M 20 80 A 80 80 0 0 1 180 80"
                          fill="none"
                          stroke="url(#roiGradient)"
                          strokeWidth="8"
                          strokeDasharray={`${Math.min(roi * 2.51, 251.2)} 251.2`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {roi.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">ROI</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <div className="text-2xl font-bold text-green-600">${totalImpact.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Impact</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">${totalOperationalCosts.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Operational Costs</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCalculateROI} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium"
                  >
                    Calculate ROI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assumptions Tab */}
          <TabsContent value="assumptions">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5" />
                  Assumptions & References
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Assumptions</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 50% productivity improvement with AI automation</li>
                      <li>• 50% reduction in claim denials through improved accuracy</li>
                      <li>• 80% reduction in coding backlog</li>
                      <li>• 1% RVU improvement through better coding precision</li>
                      <li>• Standard working days: 250 per year</li>
                      <li>• Standard working hours: 8 hours per day</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Industry References</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Medicare physician fee schedule (CMS)</li>
                      <li>• AHIMA coding productivity standards</li>
                      <li>• Healthcare Financial Management Association (HFMA) benchmarks</li>
                      <li>• Medical Group Management Association (MGMA) data</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Calculation Methodology</h3>
                    <div className="text-sm space-y-2 text-gray-600">
                      <p><strong className="text-gray-900">Total Coding Costs:</strong> (Number of Coders × Salary) × (1 + Overhead %)</p>
                      <p><strong className="text-gray-900">Denied Claims Cost:</strong> (Claims × Denial %) × Cost per Denial</p>
                      <p><strong className="text-gray-900">Backlog Cost:</strong> (Charts × Backlog %) × Days × (Cost of Capital % / 365)</p>
                      <p><strong className="text-gray-900">ROI:</strong> ((Revenue - Operational Costs) / Operational Costs) × 100</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Award className="h-5 w-5" />
                  Executive Summary - 12 Month Impact Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Financial Impact */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Financial Impact</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reduced Coding Costs:</span>
                        <span className="text-green-600 font-semibold">${reducedCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Increased Revenue:</span>
                        <span className="text-blue-600 font-semibold">${increaseRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Mitigation:</span>
                        <span className="text-purple-600 font-semibold">${reducedRisk.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-900 font-semibold">Total Impact:</span>
                          <span className="text-orange-600 font-bold">${totalImpact.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROI Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">ROI Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return on Investment:</span>
                        <span className="text-yellow-600 font-semibold">{roi.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payback Period:</span>
                        <span className="text-blue-600 font-semibold">{(12/roi*100).toFixed(1)} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Savings:</span>
                        <span className="text-green-600 font-semibold">${(totalImpact/12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Benefit:</span>
                        <span className="text-orange-600 font-semibold">${totalImpact.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex gap-4 justify-center">
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={exportData}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Clean Footer CTA */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/4fdc463b-67d9-4490-b3fe-75d8280201ba.png" alt="RapidClaims" className="h-6 w-auto" />
              <span className="text-gray-700 font-medium">Book a call with RapidClaims</span>
            </div>
            <div className="flex gap-3">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Phone className="h-4 w-4 mr-2" />
                Book Call
              </Button>
              <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
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
            <DialogTitle>Get Your ROI Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email to receive a comprehensive ROI analysis.
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
          </div>
          <DialogFooter>
            <Button onClick={handleEmailSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              Get My ROI Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <div className="text-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ROI Summary Report</h2>
              <h3 className="text-lg text-gray-600">Total Return on Investment</h3>
            </div>

            <div className="mb-8">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">${totalImpact.toLocaleString()}</div>
                <div className="text-green-700">Total Annual Impact</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rate this calculator:</span>
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

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowResults(false)} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </Button>
              <Button 
                onClick={exportData} 
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};