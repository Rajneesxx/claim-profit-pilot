import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { Calculator, Star, Download } from 'lucide-react';
import { CombinedCalculator } from './CombinedCalculator';
import { FloatingCTA } from './FloatingCTA';
import { ModernEmailDialog } from './ModernEmailDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROIMetrics } from '../types/roi';

export const ROICalculator = () => {
  const { toast } = useToast();
  
  const defaultMetrics: ROIMetrics = {
    // Basic inputs
    revenueClaimed: 10000000,
    numberOfCoders: 3,
    numberOfBillers: 3,
    numberOfPhysicians: 50,
    claimDeniedPercent: 10,

    // Advanced inputs - Aggregate claims data
    claimsPerAnnum: 66667,
    averageCostPerClaim: 150,
    chartsProcessedPerAnnum: 66667,

    // Coding costs
    salaryPerCoder: 60000,
    overheadCostPercent: 38,
    numberOfEncoderLicenses: 3,
    averageCostPerLicensePerMonth: 500,
    salaryPerBiller: 50000,
    salaryPerPhysician: 350000,
    avgTimePerPhysicianPerChart: 15,
    chartsPerCoderPerDay: 88,

    // Collection costs
    costPerDeniedClaim: 13,

    // Capital costs
    codingBacklogPercent: 20,
    daysPerChartInBacklog: 20,
    costOfCapital: 5,

    // RVUs
    rvusCodedPerAnnum: 312500,
    weightedAverageGPCI: 1.03,

    // Audit data
    overCodingPercent: 5,
    underCodingPercent: 5,
    avgBillableCodesPerChart: 5
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Calculator className="absolute top-20 left-10 h-16 w-16 text-primary/10 animate-pulse" />
        <Star className="absolute top-40 right-20 h-12 w-12 text-primary/10 animate-bounce" />
        <Calculator className="absolute bottom-40 left-20 h-20 w-20 text-primary/10 animate-pulse" />
        <Star className="absolute bottom-20 right-10 h-14 w-14 text-primary/10 animate-bounce" />
      </div>

      {/* Header */}
      <div className="bg-card backdrop-blur-sm border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/109bd789-3dee-4a0a-9371-0d7ff2ce124a.png" 
                alt="RapidClaims" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-foreground" />
              <h1 className="text-2xl font-semibold text-foreground">ROI Calculator</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => window.open('https://calendly.com/rapidclaims', '_blank')}
                variant="outline" 
                className="border-border hover:bg-muted"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        <CombinedCalculator 
          metrics={metrics}
          updateMetric={updateMetric}
          onCalculateROI={handleCalculateROI}
          calculations={{
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
          }}
        />
      </div>

      {/* Footer */}
      <div className="bg-card backdrop-blur-sm border-t border-border mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/109bd789-3dee-4a0a-9371-0d7ff2ce124a.png" 
                alt="RapidClaims" 
                className="h-8 w-auto"
              />
              <span className="text-foreground text-sm">AI-based RCM automation solution</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 RapidClaims. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <FloatingCTA />

      {/* Modern Email Dialog */}
      <ModernEmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        onSubmit={handleEmailSubmit}
      />

      {/* Results Modal */}
      {showResults && (
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="max-w-4xl bg-card border border-border text-foreground">
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