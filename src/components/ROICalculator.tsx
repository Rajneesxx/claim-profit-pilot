import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { Calculator, Star, Download, FileText } from 'lucide-react';
import { CombinedCalculator } from './CombinedCalculator';
import { FloatingCTA } from './FloatingCTA';
import { ModernEmailDialog } from './ModernEmailDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROIMetrics } from '../types/roi';
import { generatePDFReport } from '@/utils/pdfExport';
import { formatCurrency } from '@/utils/formatters';

export const ROICalculator = () => {
  const { toast } = useToast();
  
  const defaultMetrics: ROIMetrics = {
    // Basic inputs
    revenueClaimed: 5000000,
    numberOfCoders: 10,
    numberOfBillers: 3,
    numberOfPhysicians: 50,
    claimDeniedPercent: 10,

    // Advanced inputs - Aggregate claims data
    claimsPerAnnum: 33333, // Auto-calculated: revenue / averageCostPerClaim
    averageCostPerClaim: 150,
    chartsProcessedPerAnnum: 33333, // Auto-calculated: revenue / averageCostPerClaim

    // Coding costs
    salaryPerCoder: 60000,
    overheadCostPercent: 38,
    numberOfEncoderLicenses: 10,
    averageCostPerLicensePerMonth: 500,
    salaryPerBiller: 50000,
    salaryPerPhysician: 350000,
    avgTimePerPhysicianPerChart: 0, // Set to 0 by default
    chartsPerCoderPerDay: 80, // Default at 80 as requested

    // Collection costs
    costPerDeniedClaim: 13,

    // Capital costs
    codingBacklogPercent: 20,
    daysPerChartInBacklog: 20,
    costOfCapital: 5,

    // RVUs
    rvusCodedPerAnnum: 156250, // Auto-calculated: revenue / 32
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
    setMetrics(prev => {
      const updated = { ...prev, [key]: value };
      
      // Auto-update encoder licenses when number of coders changes (1 license per coder)
      if (key === 'numberOfCoders') {
        updated.numberOfEncoderLicenses = value;
        console.log('ROICalculator: Updated coders to:', value, 'and licenses to:', value);
      }
      
      // Auto-calculate claims and charts when revenue changes
      if (key === 'revenueClaimed') {
        updated.claimsPerAnnum = Math.round(value / updated.averageCostPerClaim);
        updated.chartsProcessedPerAnnum = Math.round(value / updated.averageCostPerClaim);
        updated.rvusCodedPerAnnum = Math.round(value / 32);
      }
      
      // Auto-calculate claims and charts when average cost per claim changes
      if (key === 'averageCostPerClaim') {
        updated.claimsPerAnnum = Math.round(updated.revenueClaimed / value);
        updated.chartsProcessedPerAnnum = Math.round(updated.revenueClaimed / value);
      }
      
      return updated;
    });
  };

  // Updated ROI Calculations to match CombinedCalculator
  const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
  
  // Individual lever calculations
  const coderProductivitySavings = 15000 * metrics.numberOfCoders * 0.8 * revenueScale;
  const billingAutomationSavings = 12000 * metrics.numberOfBillers * 0.7 * revenueScale;
  const physicianTimeSavings = 8000 * metrics.numberOfPhysicians * 0.5 * revenueScale;
  const technologyCostSavings = metrics.numberOfEncoderLicenses * metrics.averageCostPerLicensePerMonth * 12 * 0.7 * Math.min(revenueScale, 2);
  const claimDenialSavings = (metrics.revenueClaimed / 100) * (metrics.claimDeniedPercent / 100) * 0.05 * 0.5 * Math.min(revenueScale, 1.5);
  const backlogReductionSavings = (metrics.revenueClaimed * 0.001) * (metrics.codingBacklogPercent / 100) * 0.8 * Math.min(revenueScale, 1.5);
  
  // Revenue increase - using actual RVU data (matching CombinedCalculator logic)
  const currentRvuValue = metrics.rvusCodedPerAnnum * metrics.weightedAverageGPCI * 36.5; // 2024 conversion factor
  const rvuRevenueIncrease = currentRvuValue * 0.025; // 2.5% improvement from better RVU capture
  const avgRevenuePerChart = metrics.revenueClaimed / Math.max(metrics.chartsProcessedPerAnnum, 1);
  const codeOptimizationGain = avgRevenuePerChart * metrics.chartsProcessedPerAnnum * 0.015; // 1.5% improvement per chart
  const claimsEfficiencyGain = (metrics.claimsPerAnnum * metrics.averageCostPerClaim * 0.01); // 1% efficiency gain
  const rvuIncrease = (rvuRevenueIncrease + codeOptimizationGain + claimsEfficiencyGain) * Math.min(revenueScale, 1.2);
  
  // Risk reduction - using actual coding accuracy data (matching CombinedCalculator logic)
  const overCodingFinancialRisk = (metrics.revenueClaimed * (metrics.overCodingPercent / 100)) * 0.3; // 30% average audit penalty
  const underCodingLostRevenue = (metrics.revenueClaimed * (metrics.underCodingPercent / 100)) * 0.2; // 20% typical loss
  const auditCosts = metrics.chartsProcessedPerAnnum * 0.5; // $0.50 per chart for compliance overhead
  const deniedClaimReworkCosts = (metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100)) * metrics.costPerDeniedClaim;
  const codingErrorReduction = (overCodingFinancialRisk + underCodingLostRevenue) * 0.85;
  const complianceReduction = (auditCosts + deniedClaimReworkCosts) * 0.7;
  const overCodingReduction = (codingErrorReduction + complianceReduction) * Math.min(revenueScale, 1.3);
  
  // Totals with capping to prevent savings exceeding revenue
  const totalCostSavings = Math.min(
    coderProductivitySavings + billingAutomationSavings + physicianTimeSavings + 
    technologyCostSavings + claimDenialSavings + backlogReductionSavings,
    metrics.revenueClaimed * 0.8 // Cap at 80% of revenue
  );
  const totalRevenueIncrease = rvuIncrease;
  const totalRiskReduction = overCodingReduction;
  const totalImpact = totalCostSavings + totalRevenueIncrease + totalRiskReduction;
  
  // Implementation cost and ROI
  const baseImplementationCost = 150000;
  const scaledImplementationCost = baseImplementationCost * (1 + revenueScale * 0.8);
  const roi = scaledImplementationCost > 0 ? ((totalImpact / scaledImplementationCost) * 100) : 0;
  
  // Legacy calculations for compatibility
  const reducedCost = totalCostSavings;
  const increaseRevenue = totalRevenueIncrease;
  const reducedRisk = totalRiskReduction;

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

  const exportData = async () => {
    const exportData = {
      metrics,
      calculations: {
        totalCostSavings,
        totalRevenueIncrease,
        totalRiskReduction,
        totalImpact,
        implementationCost: scaledImplementationCost,
        roi: Math.min(Math.max(roi, 0), 400)
      },
      userEmail
    };

    await generatePDFReport(exportData);
    
    toast({
      title: "PDF Export Complete",
      description: "Your detailed ROI analysis has been downloaded as a PDF.",
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
                src="/src/assets/rapidclaims-logo.png" 
                alt="RapidClaims" 
                className="h-12 w-auto filter brightness-0 dark:filter-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-foreground" />
              <h1 className="text-2xl font-semibold text-foreground">RapidROI by RapidClaims</h1>
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
            totalCodingCosts: 0,
            deniedClaimsCost: 0,
            backlogCost: 0,
            totalOperationalCosts: 0,
            roi: Math.min(Math.max(roi, 0), 400),
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
                src="/src/assets/rapidclaims-logo.png" 
                alt="RapidClaims" 
                className="h-8 w-auto filter brightness-0 dark:filter-none"
              />
              <span className="text-foreground text-sm">RapidROI by RapidClaims - AI-powered medical coding ROI calculator</span>
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
          <DialogContent className="max-w-4xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center text-primary">
                🎉 Your RapidROI Analysis Results
              </DialogTitle>
              <p className="text-center text-muted-foreground">
                Comprehensive financial impact analysis for RapidClaims AI implementation
              </p>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-3xl font-bold text-primary">{formatCurrency(totalImpact)}</div>
                  <div className="text-sm text-muted-foreground">Annual Financial Impact</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(totalImpact / 12)}</div>
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-600">{formatCurrency(scaledImplementationCost)}</div>
                  <div className="text-sm text-muted-foreground">Implementation Investment</div>
                </div>
              </div>

              {/* Impact Breakdown */}
              <div className="bg-card/50 rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">Impact Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCostSavings)}</div>
                    <div className="text-sm text-green-700">Annual Cost Savings</div>
                    <div className="text-xs text-green-600 mt-1">Operational efficiency gains</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenueIncrease)}</div>
                    <div className="text-sm text-blue-700">Revenue Increase</div>
                    <div className="text-xs text-blue-600 mt-1">Improved coding accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalRiskReduction)}</div>
                    <div className="text-sm text-purple-700">Risk Reduction Value</div>
                    <div className="text-xs text-purple-600 mt-1">Compliance assurance</div>
                  </div>
                </div>
              </div>

              {/* Payback Period */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Investment Payback Period</h3>
                  <div className="text-3xl font-bold text-primary">
                    {(scaledImplementationCost / (totalImpact / 12)).toFixed(1)} months
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Time to recover your initial investment through savings
                  </p>
                </div>
              </div>

              {/* Rating Section */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">How would you rate this calculator?</h3>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-8 h-8 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button onClick={exportData} variant="outline" className="border-primary/20 hover:bg-primary/5">
                <FileText className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
              <Button 
                onClick={() => window.open('https://calendly.com/rapidclaims', '_blank')}
                variant="outline"
                className="border-primary/20 hover:bg-primary/5"
              >
                Book Consultation
              </Button>
              <Button 
                onClick={() => setShowResults(false)}
                className="bg-primary hover:bg-primary/90"
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