import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { 
  Calculator,
  Download,
  Settings,
  BarChart3,
  Award,
  Star,
  Phone,
  CheckCircle,
  Plus,
  Minus
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 relative overflow-hidden">
      {/* Header */}
      <div className="bg-purple-800/50 backdrop-blur-sm border-b border-purple-600/30 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-semibold text-white">Rapid ROI Calculator</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Navigation Steps */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          <div className="bg-purple-600 rounded-lg p-4 border border-purple-500">
            <div className="flex items-center gap-2 text-white">
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-medium">1. Calculator</span>
            </div>
          </div>
          <div className="bg-purple-700/50 rounded-lg p-4 border border-purple-600/30">
            <div className="flex items-center gap-2 text-purple-200">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">2. Advanced</span>
            </div>
          </div>
          <div className="bg-purple-700/50 rounded-lg p-4 border border-purple-600/30">
            <div className="flex items-center gap-2 text-purple-200">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">3. Analytics</span>
            </div>
          </div>
          <div className="bg-purple-700/50 rounded-lg p-4 border border-purple-600/30">
            <div className="flex items-center gap-2 text-purple-200">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">4. Summary</span>
            </div>
          </div>
        </div>

        {/* Calculator Content */}
        <Card className="bg-gray-900/90 backdrop-blur-sm border border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="h-5 w-5" />
              Calculator - Must Have Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Annual Revenue Slider */}
            <div className="mb-12">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Annual Revenue Claimed</h3>
                <Slider
                  value={[metrics.revenueClaimed]}
                  onValueChange={(value) => updateMetric('revenueClaimed', value[0])}
                  max={50000000}
                  min={1000000}
                  step={100000}
                  className="w-full mb-4"
                />
                <div className="text-4xl font-bold text-purple-400">
                  ${(metrics.revenueClaimed / 1000000).toFixed(0)}M
                </div>
              </div>
            </div>

            {/* ROI Meter */}
            <div className="flex justify-center mb-12">
              <div className="relative w-80 h-40">
                <svg viewBox="0 0 320 160" className="w-full h-full">
                  {/* Background Arc */}
                  <path
                    d="M 40 140 A 120 120 0 0 1 280 140"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="12"
                  />
                  {/* Progress Arc */}
                  <path
                    d="M 40 140 A 120 120 0 0 1 280 140"
                    fill="none"
                    stroke="url(#roiGradient)"
                    strokeWidth="12"
                    strokeDasharray={`${Math.min(roi * 3.77, 377)} 377`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* ROI Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-purple-400 mb-2">
                    {roi.toFixed(2)}%
                  </div>
                  <div className="text-lg text-gray-400">ROI</div>
                </div>
                {/* Min/Max Labels */}
                <div className="absolute bottom-0 left-0 text-sm text-gray-400">$0M</div>
                <div className="absolute bottom-0 right-0 text-sm text-gray-400">$12M</div>
              </div>
            </div>

            {/* Must Have Inputs */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Must Have Inputs</h3>
              
              <div className="space-y-6">
                {/* Number of Coders */}
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <span className="text-gray-300 font-medium">Number of Coders</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('numberOfCoders', Math.max(1, metrics.numberOfCoders - 1))}
                      className="w-8 h-8 p-0 border-gray-600 hover:bg-gray-700 text-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-xl font-semibold min-w-[3rem] text-center">
                      {metrics.numberOfCoders}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('numberOfCoders', metrics.numberOfCoders + 1)}
                      className="w-8 h-8 p-0 border-gray-600 hover:bg-gray-700 text-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Claims Denied % */}
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <span className="text-gray-300 font-medium">Claims Denied %</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('claimDeniedPercent', Math.max(0, metrics.claimDeniedPercent - 1))}
                      className="w-8 h-8 p-0 border-gray-600 hover:bg-gray-700 text-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-xl font-semibold min-w-[4rem] text-center">
                      {metrics.claimDeniedPercent}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMetric('claimDeniedPercent', Math.min(100, metrics.claimDeniedPercent + 1))}
                      className="w-8 h-8 p-0 border-gray-600 hover:bg-gray-700 text-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Derived Values */}
            <div className="bg-gray-800/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Derived Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Total Coding Costs</div>
                  <div className="text-white text-lg font-semibold">${totalCodingCosts.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Denied Claims Cost</div>
                  <div className="text-white text-lg font-semibold">${deniedClaimsCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Total Impact</div>
                  <div className="text-green-400 text-lg font-semibold">${totalImpact.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Operational Costs</div>
                  <div className="text-orange-400 text-lg font-semibold">${totalOperationalCosts.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-8">
              <Button 
                onClick={handleCalculateROI} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-14 text-lg font-semibold rounded-lg"
              >
                Calculate Full ROI Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Get Your ROI Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleEmailSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Get Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      {showResults && (
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="max-w-4xl bg-gray-900 border border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center text-white">🎉 Your ROI Analysis Results</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-purple-800/50 border border-purple-600">
                  <div className="text-3xl font-bold text-purple-400">{roi.toFixed(1)}%</div>
                  <div className="text-sm text-gray-300">ROI</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-800/50 border border-green-600">
                  <div className="text-3xl font-bold text-green-400">${totalImpact.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Total Impact</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-800/50 border border-blue-600">
                  <div className="text-3xl font-bold text-blue-400">${(totalImpact / 12).toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Monthly Savings</div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Executive Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-green-400 text-2xl font-bold">${reducedCost.toLocaleString()}</div>
                    <div className="text-gray-300 text-sm">Reduced Cost</div>
                  </div>
                  <div>
                    <div className="text-blue-400 text-2xl font-bold">${increaseRevenue.toLocaleString()}</div>
                    <div className="text-gray-300 text-sm">Increased Revenue</div>
                  </div>
                  <div>
                    <div className="text-purple-400 text-2xl font-bold">${reducedRisk.toLocaleString()}</div>
                    <div className="text-gray-300 text-sm">Reduced Risk</div>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-white">How would you rate this calculator?</h3>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-8 h-8 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button onClick={exportData} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button 
                onClick={() => setShowResults(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};