import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { Calculator, Star, Download, FileText } from 'lucide-react';
import CombinedCalculator from './CombinedCalculator';
import { FloatingCTA } from './FloatingCTA';
import { ModernEmailDialog } from './ModernEmailDialog';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROIMetrics } from '../types/roi';
import { generatePDFReport } from '@/utils/pdfExport';
import { formatCurrency } from '@/utils/formatters';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { appendToSpreadsheet, buildEmailData } from '@/utils/emailToSpreadsheet';

export const ROICalculator = () => {
  const { toast } = useToast();
  
  const defaultMetrics: ROIMetrics = {
    // Basic inputs
    revenueClaimed: 5000000,
    numberOfCoders: 3,
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
    numberOfEncoderLicenses: 3,
    averageCostPerLicensePerMonth: 500,
    salaryPerBiller: 50000,
    salaryPerPhysician: 350000,
    avgTimePerPhysicianPerChart: 0, // Set to 0 by default
    avgTimePerCoderPerChart: 0.1333, // 8 minutes per chart by default
    chartsPerCoderPerDay: 0, // Will be calculated dynamically

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
    avgBillableCodesPerChart: 5,
    percentOverCodedCharts: 0.05,     // 5% Overcoded
    percentReductionNCCI: 0.67,       // 67%
    complianceCostPerCode: 15        // $15 per overcoded chart
  };

  const [metrics, setMetrics] = useState<ROIMetrics>(defaultMetrics);
  const [userEmail, setUserEmail] = useState(() => {
    return sessionStorage.getItem('rapidclaims_user_email') || '';
  });
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [rating, setRating] = useState(0);

  const updateMetric = (key: keyof ROIMetrics, value: number) => {
  setMetrics(prev => {
    const updated = { ...prev, [key]: value };

    if (updated.chartsProcessedPerAnnum > 0 && updated.numberOfCoders > 0) {
      updated.chartsPerCoderPerDay = Math.round(updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252);
    }

    if (key === 'numberOfCoders') {
      updated.numberOfEncoderLicenses = value;
      updated.chartsPerCoderPerDay = Math.round(updated.chartsProcessedPerAnnum / value / 252);
    }

    if (key === 'revenueClaimed') {
      updated.claimsPerAnnum = Math.round(value / updated.averageCostPerClaim);
      updated.chartsProcessedPerAnnum = Math.round(value / updated.averageCostPerClaim);
      updated.rvusCodedPerAnnum = Math.round(value / 32);
      updated.chartsPerCoderPerDay = Math.round(updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252);
    }

    if (key === 'averageCostPerClaim') {
      updated.claimsPerAnnum = Math.round(updated.revenueClaimed / value);
      updated.chartsProcessedPerAnnum = Math.round(updated.revenueClaimed / value);
      updated.chartsPerCoderPerDay = Math.round(updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252);
    }

    if (key === 'chartsProcessedPerAnnum') {
      updated.chartsPerCoderPerDay = Math.round(value / updated.numberOfCoders / 252);
    }

    if (key === 'claimsPerAnnum') {
      updated.chartsProcessedPerAnnum = value;
      updated.chartsPerCoderPerDay = Math.round(value / updated.numberOfCoders / 252);
    }

    return updated;
  });
};

  // Updated ROI Calculations to match CombinedCalculator
  const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
  
  // Individual lever calculations
  const incrementalProductivity = 0.8;
  const dynamicChartsPerCoderPerDay = metrics.chartsProcessedPerAnnum / metrics.numberOfCoders / 252;
  const timeToCodeAChart = 8 / dynamicChartsPerCoderPerDay; // 8 hours/day divided by charts per coder per day
  const costPerCoderPerHour = metrics.salaryPerCoder / 2000; // Assuming 2000 work hours/year
  const coderProductivitySavings = metrics.chartsProcessedPerAnnum * (incrementalProductivity / (1 + incrementalProductivity)) * timeToCodeAChart * costPerCoderPerHour;
  
  const billingAutomationSavings = metrics.numberOfBillers * metrics.salaryPerBiller * 0.7 * revenueScale;
  
  const hourlyPhysicianRate = metrics.salaryPerPhysician / 2000; // Assuming 2000 work hours/year
  const physicianTimeSavings = metrics.avgTimePerPhysicianPerChart * metrics.chartsProcessedPerAnnum * metrics.numberOfPhysicians * hourlyPhysicianRate * 0.5;
  
  const technologyCostSavings = metrics.numberOfEncoderLicenses * metrics.averageCostPerLicensePerMonth * 12 * 0.7 * Math.min(revenueScale, 2);
  
  const claimDenialSavings = (metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100)) * metrics.costPerDeniedClaim * 0.5;
  
  const avgChartValue = metrics.revenueClaimed / Math.max(metrics.chartsProcessedPerAnnum, 1);
  const backlogReductionSavings = metrics.chartsProcessedPerAnnum * avgChartValue * (metrics.codingBacklogPercent / 100) * metrics.daysPerChartInBacklog * 0.2 * (metrics.costOfCapital / 360);
  
  // Revenue increase - using actual RVU data (matching CombinedCalculator logic)
    const rvuIncrease = (() => {
    // 2024 Medicare conversion factor
    const conversionFactor = 36.5;

    // Revenue scale based on organization size
    const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
    const cappedRevenueScale = Math.min(revenueScale, 1.2);

    // 1. E&M RVU Optimization (0.5% increment)
    const rvuIncrementRate = 0.005;
    const rvuRevenueIncreaseByEandM =
        metrics.rvusCodedPerAnnum * rvuIncrementRate * metrics.weightedAverageGPCI * conversionFactor;

    // 2. AI Coding Optimization (2.5% improvement)
    const improvementRate = 0.025;
    const currentRvuValue =
        metrics.rvusCodedPerAnnum * metrics.weightedAverageGPCI * conversionFactor;
    const rvuRevenueIncrease = currentRvuValue * improvementRate;

    // 3. Code Optimization Gain (1.5% per chart)
    const codeOptimizationRate = 0.015;
    const avgRevenuePerChart =
        metrics.chartsProcessedPerAnnum > 0
            ? metrics.revenueClaimed / metrics.chartsProcessedPerAnnum
            : 0;
    const codeOptimizationGain =
        avgRevenuePerChart * metrics.chartsProcessedPerAnnum * codeOptimizationRate;

    // 4. Claims Processing Efficiency Gain (1% efficiency gain)
    const claimsEfficiencyRate = 0.01;
    const claimsEfficiencyGain =
        metrics.claimsPerAnnum * metrics.averageCostPerClaim * claimsEfficiencyRate;

    // 5. Final Revenue Increase Calculation
    const totalIncrease =
        rvuRevenueIncreaseByEandM +
        rvuRevenueIncrease +
        codeOptimizationGain +
        claimsEfficiencyGain;

    return totalIncrease * cappedRevenueScale;
})();
  
  // Risk reduction - using actual coding accuracy data (matching CombinedCalculator logic)
  const overCodingReduction = (() => {
  const chartsPerAnnum = metrics.chartsProcessedPerAnnum;
  const percentOverCodedCharts = metrics.percentOverCodedCharts;
  const percentReductionNCCI = metrics.percentReductionNCCI;
  const complianceCostPerCode = metrics.complianceCostPerCode;

  return chartsPerAnnum * percentOverCodedCharts * percentReductionNCCI * complianceCostPerCode;
})();
  
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
    console.log('ROICalculator handleCalculateROI called, userEmail:', userEmail);
    console.log('showEmailDialog state:', showEmailDialog);
    
    if (!userEmail) {
      console.log('No userEmail, setting showEmailDialog to true');
      setShowEmailDialog(true);
    } else {
      console.log('UserEmail exists, showing results');
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
      // Send email data to spreadsheet for email capture
      const emailData = buildEmailData(
        userEmail, 
        'ROI Calculator',
        'Email Capture - ROI Calculator',
        `Email captured from standalone ROI Calculator: ${userEmail}`
      );
      appendToSpreadsheet(emailData)
        .then((res) => console.info('Spreadsheet email-capture result:', res))
        .catch((err) => console.error('Spreadsheet email-capture error:', err));

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

      {/* Header */}
      <div className="bg-white border-b border-gray-200 relative z-10">
        <div className="w-full px-6 py-6">{/* Increased padding from py-4 to py-6 */}
          <div className="flex items-center justify-between">
            {/* Logo and Navigation Links - Left Side */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <img 
                src="/lovable-uploads/6549e296-472c-4a56-bd4f-8786e0a7978c.png" 
                alt="RapidClaims" 
                className="h-7 w-auto" 
              />
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-8">{/* Increased gap from 6 to 8 */}
                <a href="https://www.rapidclaims.ai/" className="text-gray-900 font-bold text-lg hover:text-purple-600 transition-colors">{/* Increased font size and weight */}
                  PRODUCTS
                </a>
                <a href="https://www.rapidclaims.ai/solutions" className="text-gray-900 font-bold text-lg hover:text-purple-600 transition-colors">
                  SOLUTIONS
                </a>
                <a href="https://www.rapidclaims.ai/resources/blogs" className="text-gray-900 font-bold text-lg hover:text-purple-600 transition-colors">
                  RESOURCES
                </a>
              </nav>
            </div>
            
            {/* Book a Demo Button - Right Side */}
            <div className="flex items-center">
              <Button 
                onClick={() => window.open('https://www.rapidclaims.ai/get-in-touch', '_self')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 text-lg rounded-lg"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8 relative z-10">
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
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="w-[95vw] max-w-7xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
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
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
};
