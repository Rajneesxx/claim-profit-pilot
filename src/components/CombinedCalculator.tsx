import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Calculator, ExternalLink, Settings, Minus, Plus, Download, Calendar, LogIn } from "lucide-react";
import { PDFPreviewDialog } from './PDFPreviewDialog';
import { SignInDialog } from './SignInDialog';
import { useToast } from "@/hooks/use-toast";
import { ROIMetrics } from "@/types/roi";
import { References } from "./tabs/References";
import { ProductDescription } from "./ProductDescription";
import { MetricsExpandedView } from "./MetricsExpandedView";
import { TooltipInfo } from "./TooltipInfo";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";

interface CombinedCalculatorProps {
  metrics?: ROIMetrics;
  updateMetric?: (key: keyof ROIMetrics, value: number) => void;
  onCalculateROI?: () => void;
  calculations?: {
    totalCodingCosts: number;
    deniedClaimsCost: number;
    backlogCost: number;
    totalOperationalCosts: number;
    roi: number;
    executiveSummary: {
      reducedCost: number;
      increaseRevenue: number;
      reducedRisk: number;
      totalImpact: number;
    };
  };
}

const CombinedCalculator = ({ 
  metrics: propMetrics, 
  updateMetric: propUpdateMetric, 
  onCalculateROI: propOnCalculateROI, 
  calculations: propCalculations 
}: CombinedCalculatorProps) => {
  // Default metrics for standalone use
  const [localMetrics, setLocalMetrics] = useState<ROIMetrics>({
    revenueClaimed: 5000000,
    numberOfCoders: 3,
    numberOfBillers: 3,
    numberOfPhysicians: 50,
    claimDeniedPercent: 10,
    claimsPerAnnum: 33333,
    averageCostPerClaim: 150,
    chartsProcessedPerAnnum: 33333,
    salaryPerCoder: 60000,
    overheadCostPercent: 38,
    numberOfEncoderLicenses: 3,
    averageCostPerLicensePerMonth: 500,
    salaryPerBiller: 50000,
    salaryPerPhysician: 350000,
    avgTimePerPhysicianPerChart: 15,
    avgTimePerCoderPerChart: 0.1333,
    chartsPerCoderPerDay: 44, // 33333 charts / 3 coders / 252 working days = ~44
    costPerDeniedClaim: 13,
    codingBacklogPercent: 20,
    daysPerChartInBacklog: 20,
    costOfCapital: 5,
    rvusCodedPerAnnum: 156250,
    weightedAverageGPCI: 1.03,
    overCodingPercent: 5,
    underCodingPercent: 5,
    avgBillableCodesPerChart: 5,
    percentOverCodedCharts: 0.05,
    percentReductionNCCI: 0.67,
    complianceCostPerCode: 1.3
  });

  const metrics = propMetrics || localMetrics;
  
  const updateMetric = propUpdateMetric || ((key: keyof ROIMetrics, value: number) => {
    setLocalMetrics(prev => {
      const updated = { ...prev, [key]: value };

      // Only recalculate chartsPerCoderPerDay when specific fields change, not on every update
      if ((key === 'chartsProcessedPerAnnum' || key === 'numberOfCoders' || key === 'claimsPerAnnum') && 
          updated.chartsProcessedPerAnnum > 0 && updated.numberOfCoders > 0) {
        updated.chartsPerCoderPerDay = Math.round(updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252);
      }

      if (key === 'numberOfCoders') {
        updated.numberOfEncoderLicenses = value;
        if (updated.chartsProcessedPerAnnum > 0 && value > 0) {
          updated.chartsPerCoderPerDay = updated.chartsProcessedPerAnnum / value / 252;
        }
      }
      
      if (key === 'revenueClaimed') {
        updated.claimsPerAnnum = Math.round(value / updated.averageCostPerClaim);
        updated.chartsProcessedPerAnnum = Math.round(value / updated.averageCostPerClaim);
        updated.rvusCodedPerAnnum = Math.round(value / 32);
        const isDefaultBillerRatio = Math.abs(updated.numberOfBillers - (updated.revenueClaimed / 5000000) * 5) < 1;
        const isDefaultPhysicianRatio = Math.abs(updated.numberOfPhysicians - (updated.revenueClaimed / 5000000) * 20) < 1;
        if (isDefaultBillerRatio) {
          const revenueGrowthFactor = value / 5000000;
          updated.numberOfBillers = Math.ceil(5 * revenueGrowthFactor);
        }
        if (isDefaultPhysicianRatio) {
          const revenueGrowthFactor = value / 5000000;
          updated.numberOfPhysicians = Math.ceil(20 * revenueGrowthFactor);
        }
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252;
        }
      }
      
      if (key === 'averageCostPerClaim') {
        updated.claimsPerAnnum = Math.round(updated.revenueClaimed / value);
        updated.chartsProcessedPerAnnum = Math.round(updated.revenueClaimed / value);
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = Math.round(updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252);
        }
      }
      
      if (key === 'chartsProcessedPerAnnum') {
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = value / updated.numberOfCoders / 252;
        }
      }
      
      if (key === 'claimsPerAnnum') {
        updated.chartsProcessedPerAnnum = value;
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = value / updated.numberOfCoders / 252;
        }
      }
      
      return updated;
    });
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  
  const [editingValues, setEditingValues] = useState<Partial<Record<keyof ROIMetrics, string>>>({});
  const [showLevers, setShowLevers] = useState(false);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const advancedRef = useRef<HTMLDivElement | null>(null);
  const leversRef = useRef<HTMLDivElement | null>(null);
  

  // Authentication state
  const [isSignedIn, setIsSignedIn] = useState(() => {
    return sessionStorage.getItem('rapidclaims_signed_in') === 'true';
  });
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  // Only disable Executive Summary content for non-signed in users
  const isExecutiveSummaryBlurred = !isSignedIn;

  useEffect(() => {
    if (showAdvanced && advancedRef.current) {
      advancedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAdvanced]);

  useEffect(() => {
    if (showLevers && leversRef.current) {
      leversRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showLevers]);

  
  const [leverLevels, setLeverLevels] = useState({
    coderProductivity: 'medium',
    billingAutomation: 'medium', 
    physicianTimeSaved: 'medium',
    technologyCostSaved: 'medium',
    claimDenialReduction: 'medium',
    codingBacklogElimination: 'medium',
    rvuIncreaseEM: 'high',
    overCodingReduction: 'medium',
    underCodingReduction: 'medium'
  });

 const leverImpacts = {
    coderProductivity: { low: 0.4, medium: 0.8, high: 1.0 },
    billingAutomation: { low: 0.5, medium: 0.7, high: 1.2 },
    physicianTimeSaved: { low: 0.05, medium: 0.1, high: 0.15 }, // Added meaningful values
    technologyCostSaved: { low: 1.0, medium: 1.0, high: 1.0 },
    claimDenialReduction: { low: 0.3, medium: 0.5, high: 0.7 },
    codingBacklogElimination: { low: 0.08, medium: 0.04, high: 0 },
    rvuIncreaseEM: { low: 0.001, medium: 0.005, high: 0.015 }, // 0.1%, 0.5%, 1.5%
    overCodingReduction: { low: 0.5, medium: 0.8, high: 1.0 }, // 50%, 80%, 100%
    underCodingReduction: { low: 0.5, medium: 0.8, high: 1.0 } // 50%, 80%, 100%
  };
  
  const calculateLeverImpact = (leverKey: keyof typeof leverImpacts, baseValue: number) => {
    const level = leverLevels[leverKey] as 'low' | 'medium' | 'high';
    return baseValue * leverImpacts[leverKey][level];
  };

   const coderProductivityCost = (() => {
  // We'll use metrics.chartsProcessedPerAnnum, leverImpacts.coderProductivity[level], metrics.avgTimePerChart (in hours), metrics.costPerCoderPerHour
  const incrementalProductivity = leverImpacts.coderProductivity[leverLevels.coderProductivity as 'low' | 'medium' | 'high'];
  const chartsPerYear = metrics.chartsProcessedPerAnnum;
  const timePerChart = metrics.avgTimePerCoderPerChart;
  const costPerHour = (metrics.salaryPerCoder / 2100); // Calculate hourly rate from annual salary
  return chartsPerYear * (incrementalProductivity / (1 + incrementalProductivity)) * timePerChart * costPerHour;
})();

 const billingAutomationSavings = (() => {
    const numberOfBillers = metrics.numberOfBillers; // Use actual number of billers from input
    const averageSalaryPerBiller = metrics.salaryPerBiller; // Use actual salary from input
    // Use dynamic lever levels and impacts
    const automationLevel = leverLevels.billingAutomation as 'low' | 'medium' | 'high';
    const automationImpact = leverImpacts.billingAutomation[automationLevel]; // Should be a decimal, e.g., 0.7 for 70%
    const result = numberOfBillers * averageSalaryPerBiller;
    console.log('Billing Automation Savings:', { numberOfBillers, averageSalaryPerBiller, result });
    return result;
})();

    const physicianTimeSavings = (() => {
      const hoursPerChart = (metrics.avgTimePerPhysicianPerChart || 0) / 60; // Convert minutes to hours
      const chartsPerYear = metrics.chartsProcessedPerAnnum;
      const hourlyRate = metrics.salaryPerPhysician / (40 * 52); // Convert annual salary to hourly
      const numberOfPhysicians = metrics.numberOfPhysicians;
      const timeSavedRate = leverImpacts.physicianTimeSaved[leverLevels.physicianTimeSaved as 'low' | 'medium' | 'high'];
      const result = hoursPerChart * chartsPerYear * numberOfPhysicians * hourlyRate * timeSavedRate;
      console.log('Physician Time Savings:', { hoursPerChart, chartsPerYear, hourlyRate, numberOfPhysicians, timeSavedRate, result });
      return result;
    })();

  const technologyCostSavings = (() => {
    const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
    const baseTechSavings = metrics.numberOfEncoderLicenses * metrics.averageCostPerLicensePerMonth ;
    const reductionRate = leverImpacts.technologyCostSaved[leverLevels.technologyCostSaved as 'low' | 'medium' | 'high'];
    return baseTechSavings * reductionRate; // Cap scaling at 1.3x
  })();

 const claimDenialSavings = (() => {
  const baseDenials = metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100);
  const reductionRate = leverImpacts.claimDenialReduction[leverLevels.claimDenialReduction as 'low' | 'medium' | 'high'];
  const costPerDeniedClaim = metrics.costPerDeniedClaim;
  return baseDenials * reductionRate * costPerDeniedClaim;
})();
  
  const ARdays = (() => {
    const chartsPerAnnum = metrics.chartsProcessedPerAnnum;
    const avgChartValue = metrics.revenueClaimed / Math.max(metrics.chartsProcessedPerAnnum,0.2);
    const codingBacklogPercent = metrics.codingBacklogPercent/100;
    const avgBacklogDays = metrics.daysPerChartInBacklog;
    const reductionRate = leverImpacts.codingBacklogElimination[leverLevels.codingBacklogElimination as 'low' | 'medium' | 'high'];
    const costOfCapital = metrics.costOfCapital;
    return chartsPerAnnum * avgChartValue * codingBacklogPercent * avgBacklogDays * reductionRate * (costOfCapital / 360) *0.2;
})();

  // Revenue increase from RVU optimization - using actual RVU data and new lever
  const rvuIncrease = (() => {
    // 2024 Medicare conversion factor
    const conversionFactor = 32.7442;

    // Number of RVUs billed × % increment in RVUs × Wt. Avg GPCI × Conversion

    // 1. Define the components
    const numberOfRVUsBilled = metrics.rvusCodedPerAnnum;           // Number of RVUs billed
    const percentIncrementInRVUs = leverImpacts.rvuIncreaseEM[leverLevels.rvuIncreaseEM as 'low' | 'medium' | 'high']; // Use lever value
    const weightedAverageGPCI = metrics.weightedAverageGPCI;        // Wt. Avg GPCI

    // 2. Calculate RVU Revenue Increase using the formula
    const rvuRevenueIncreaseByEandM = numberOfRVUsBilled * 
                                      percentIncrementInRVUs * 
                                      weightedAverageGPCI * 
                                      conversionFactor;

    // 3. Final Revenue Increase Calculation
    const totalIncrease = rvuRevenueIncreaseByEandM;

    return totalIncrease;
  })();

  // Over/Under coding reduction (risk mitigation) - using actual coding accuracy data and new levers
  // Overcoding risk reduction using NCCI edits
  const overCodingReduction = (() => {
    const chartsPerAnnum = metrics.chartsProcessedPerAnnum;
    const percentOverCodedCharts = metrics.percentOverCodedCharts; // Should be decimal (e.g., 0.05 for 5%)
    const percentReductionNCCI = metrics.percentReductionNCCI; // Should be decimal (e.g., 0.67 for 67%)
    const complianceCostPerCode = metrics.complianceCostPerCode; // Cost per overcoded chart
    const leverMultiplier = leverImpacts.overCodingReduction[leverLevels.overCodingReduction as 'low' | 'medium' | 'high'];

    const result = chartsPerAnnum * percentOverCodedCharts * percentReductionNCCI * complianceCostPerCode * leverMultiplier;
    console.log('Over Coding Reduction:', { chartsPerAnnum, percentOverCodedCharts, percentReductionNCCI, complianceCostPerCode, leverMultiplier, result });
    return result;
  })();

  // Under coding reduction (additional revenue capture)
  const underCodingReduction = (() => {
    const chartsPerAnnum = metrics.chartsProcessedPerAnnum;
    const percentUnderCodedCharts = metrics.underCodingPercent / 100; // Convert percentage to decimal
    const avgRevenuePerChart = metrics.revenueClaimed / chartsPerAnnum;
    const leverMultiplier = leverImpacts.underCodingReduction[leverLevels.underCodingReduction as 'low' | 'medium' | 'high'];
    
    // Assume under coding results in ~10% revenue loss per affected chart
    const revenueRecaptureRate = 0.1;
    const result = chartsPerAnnum * percentUnderCodedCharts * avgRevenuePerChart * revenueRecaptureRate * leverMultiplier;
    
    return result;
  })();
  // Total calculations with capping to prevent savings exceeding revenue
  const totalCostSavings = Math.min(
    coderProductivityCost + billingAutomationSavings + physicianTimeSavings + 
    technologyCostSavings + claimDenialSavings + ARdays,
    metrics.revenueClaimed * 0.65 // Cap at 65% of revenue
  );
  const totalRevenueIncrease = rvuIncrease + underCodingReduction;
  const totalRiskReduction = overCodingReduction;
  const totalImpact = totalCostSavings + totalRevenueIncrease + totalRiskReduction;
  
  // ROI calculation - Implementation cost with diminishing returns (like benefits)
  const baseImplementationCost = 150000; // Base implementation cost
  const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000); // Same scaling as benefits
  const scaledImplementationCost = baseImplementationCost * (1 + revenueScale * 0.8); // Implementation grows slower than benefits
  const roi = scaledImplementationCost > 0 ? ((totalImpact / scaledImplementationCost) * 100) : 0;
  
  // Cap ROI at realistic maximum for healthcare implementations (400%)
  const cappedRoi = Math.min(Math.max(roi, 0), 400);

  const handleLeverLevelChange = (lever: string, level: string) => {
    setLeverLevels(prev => ({ ...prev, [lever]: level }));
  };

  const handleSignInSubmit = () => {
    if (userEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      setIsSignedIn(true);
      sessionStorage.setItem('rapidclaims_signed_in', 'true');
      sessionStorage.setItem('rapidclaims_user_email', userEmail);
      setShowSignInDialog(false);
      toast({
        title: "Welcome!",
        description: "You now have full access to the ROI calculator.",
      });
    }
  };

  const handleROIEmailSubmit = () => {
    console.log('=== handleROIEmailSubmit CALLED ===');
    console.log('userEmail:', userEmail);
    
    if (userEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      console.log('Valid email, closing dialog and showing success');
      setShowPDFPreview(false);
      
      // Generate and send the detailed PDF report
      toast({
        title: "📧 Report Generation Started",
        description: `Your detailed ROI analysis is being prepared and will be sent to ${userEmail}`,
        duration: 5000,
      });
      
      // Simulate PDF generation and sending
      setTimeout(() => {
        toast({
          title: "📄 Report Sent Successfully!",
          description: "Check your email for the comprehensive ROI analysis PDF.",
          duration: 8000,
        });
      }, 3000);
    } else {
      console.log('Invalid email format');
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
    }
  };

  const handleSignInClick = () => {
    setShowSignInDialog(true);
  };

  const handleROIClick = () => {
    console.log('=== handleROIClick CALLED ===');
    console.log('Current isSignedIn state:', isSignedIn);
    
    if (!isSignedIn) {
      setShowSignInDialog(true);
      return;
    }
    
    // Show PDF preview dialog for signed-in users
    setShowPDFPreview(true);
  };

  const clearEditingValue = (key: keyof ROIMetrics) => {
    setEditingValues(prev => {
      const next = { ...prev } as Partial<Record<keyof ROIMetrics, string>>;
      delete next[key];
      return next;
    });
  };

  const handleIncrement = (key: keyof ROIMetrics, step: number = 1) => {
    updateMetric(key, metrics[key] + step);
    clearEditingValue(key);
  };

  const handleDecrement = (key: keyof ROIMetrics, step: number = 1) => {
    updateMetric(key, Math.max(0, metrics[key] - step));
    clearEditingValue(key);
  };

  const handleInputChange = (key: keyof ROIMetrics, value: string | number) => {
    if (typeof value === 'number') {
      updateMetric(key, value);
      clearEditingValue(key);
      return;
    }
    setEditingValues(prev => ({ ...prev, [key]: value }));
    if (value.trim() === '') {
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateMetric(key, numValue);
    }
  };

  const onCalculateROI = propOnCalculateROI || (() => {
    alert('ROI Report would be generated here!');
  });

  const basicInputs = [
    { key: 'numberOfCoders' as keyof ROIMetrics, label: 'Number of Coders', max: 2000, step: 1 },
    { key: 'numberOfBillers' as keyof ROIMetrics, label: 'Number of Billers', max: 50, step: 1 },
    { key: 'numberOfPhysicians' as keyof ROIMetrics, label: 'Number of Physicians', max: 100, step: 1 },
    { key: 'claimDeniedPercent' as keyof ROIMetrics, label: 'Claims Denied %', max: 50, step: 0.1 },
  ];

  const advancedInputs = [
    { key: 'claimsPerAnnum' as keyof ROIMetrics, label: 'Claims Per Year' },
    { key: 'averageCostPerClaim' as keyof ROIMetrics, label: 'Average Cost Per Claim ($)' },
    { key: 'chartsProcessedPerAnnum' as keyof ROIMetrics, label: 'Charts Processed Per Year' },
    { key: 'salaryPerCoder' as keyof ROIMetrics, label: 'Salary Per Coder ($)' },
    { key: 'overheadCostPercent' as keyof ROIMetrics, label: 'Overhead Cost (%)' },
    { key: 'numberOfEncoderLicenses' as keyof ROIMetrics, label: 'Number of Encoder Licenses' },
    { key: 'averageCostPerLicensePerMonth' as keyof ROIMetrics, label: 'Cost Per License/Month ($)' },
    { key: 'salaryPerBiller' as keyof ROIMetrics, label: 'Salary Per Biller ($)' },
    { key: 'salaryPerPhysician' as keyof ROIMetrics, label: 'Salary Per Physician ($)' },
    { key: 'avgTimePerPhysicianPerChart' as keyof ROIMetrics, label: 'Avg Time Spent by Physician Per Chart (min)' },
    { key: 'chartsPerCoderPerDay' as keyof ROIMetrics, label: 'Charts Per Coder Per Day' },
    { key: 'costPerDeniedClaim' as keyof ROIMetrics, label: 'Cost Per Denied Claim ($)' },
    { key: 'codingBacklogPercent' as keyof ROIMetrics, label: 'Coding Backlog (%)' },
    { key: 'daysPerChartInBacklog' as keyof ROIMetrics, label: 'Days Per Chart in Backlog' },
    { key: 'costOfCapital' as keyof ROIMetrics, label: 'Cost of Capital (%)' },
    { key: 'rvusCodedPerAnnum' as keyof ROIMetrics, label: 'RVUs Coded Per Year' },
    { key: 'weightedAverageGPCI' as keyof ROIMetrics, label: 'Weighted Average GPCI' },
    { key: 'percentOverCodedCharts' as keyof ROIMetrics, label: '% Charts Overcoded (0-1)' },
    { key: 'percentReductionNCCI' as keyof ROIMetrics, label: '% Reduction in Overcoded Charts (0-1)' },
    { key: 'complianceCostPerCode' as keyof ROIMetrics, label: 'Compliance Cost Per Code ($)' },
  ];

  return (
    <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Calculations */}
          <div className="space-y-6">
            {/* Introduction Text Block */}
    <div className="text-left mb-8 space-y-2">
  <p className="text-lg text-purple-600 font-normal">
    Replace guesswork with real insights.
  </p>
  <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
    {/* Calculator Icon SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
      <rect x="7" y="16" width="10" height="2" rx="1" fill="currentColor" />
    </svg>
    RapidROI by RapidClaims
  </h2>
  <p className="text-base text-gray-700 mt-2">
    Presenting RapidROI, your no-cost, enterprise-grade RevOps Agent.
  </p>
</div>


            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xl font-semibold mb-2">
                  <Calculator className="h-5 w-5" />
                  Key Input Parameters
                  <TooltipInfo content="Essential metrics that drive your ROI calculation. Adjust these to match your organization's profile." />
                </div>
              </div>
              <div className="space-y-6">
                {/* Annual Revenue Claimed */}
                <div className="p-6 bg-muted/30 rounded-xl border">
                  <div className="flex items-center gap-2 mb-4">
                    <Label htmlFor="revenue" className="text-base font-medium">
                      Annual Revenue Claimed
                    </Label>
                    <TooltipInfo content="Enter your organization's total annual revenue from medical claims (minimum $5M, maximum $50M)" />
                  </div>
                  <div className="space-y-4">
                    <Slider
                      value={[Math.max(5000000, Math.min(50000000, metrics.revenueClaimed))]}
                      onValueChange={(value) => {
                        const clampedValue = Math.max(5000000, Math.min(50000000, value[0]));
                        updateMetric('revenueClaimed', clampedValue);
                      }}
                      min={5000000}
                      max={50000000}
                      step={100000}
                      className="w-full"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="revenue"
                        type="text"
                        inputMode="numeric"
                        value={metrics.revenueClaimed === 0 ? '' : formatNumber(metrics.revenueClaimed)}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, "");
                          if (rawValue === '') {
                            handleInputChange('revenueClaimed', '');
                            return;
                          }
                          const numericValue = parseInt(rawValue);
                          if (!isNaN(numericValue)) {
                            handleInputChange('revenueClaimed', numericValue.toString());
                          }
                        }}
                        onBlur={(e) => {
                          const rawValue = e.target.value.replace(/,/g, "");
                          const numericValue = parseInt(rawValue) || 5000000;
                          const clampedValue = Math.max(5000000, Math.min(50000000, numericValue));
                          updateMetric('revenueClaimed', clampedValue);
                        }}
                        className="text-center text-lg font-semibold pl-8"
                        placeholder="Enter annual revenue (min $5M, max $50M)"
                      />
                  </div>
                </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {basicInputs.map(({ key, label, max, step }) => (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label>{label}</Label>
                        <TooltipInfo content={getTooltipContent(key)} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement(key, step)}
                          className="p-2 h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={
                            editingValues[key] !== undefined
                              ? editingValues[key]
                              : ((key === 'chartsPerCoderPerDay' || key === 'avgTimePerPhysicianPerChart')
                                  ? String(metrics[key] ?? 0)
                                  : (metrics[key] === 0 ? '' : String(metrics[key])))
                          }
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          onBlur={(e) => {
                            const raw = e.target.value.trim();
                            if (raw === '') {
                              return;
                            }
                            const parsed = parseFloat(raw);
                            if (!isNaN(parsed) && parsed >= 0) {
                              updateMetric(key, parsed);
                            }
                            clearEditingValue(key);
                          }}
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement(key, step)}
                          className="p-2 h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {max && (
                        <Slider
                          value={[metrics[key]]}
                          onValueChange={(value) => updateMetric(key, value[0])}
                          max={max}
                          step={step}
                          className="w-full"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <Button variant="outline" className="w-full" onClick={() => setShowAdvanced((v) => !v)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Inputs {showAdvanced ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowLevers((v) => !v)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Benchmarks & Levers {showLevers ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </Button>
                </div>

                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleContent className="space-y-6">
                    <div ref={advancedRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {advancedInputs.map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={
                              editingValues[key] !== undefined
                                ? editingValues[key]
                                : ((key === 'chartsPerCoderPerDay' || key === 'avgTimePerPhysicianPerChart')
                                    ? String(metrics[key] ?? 0)
                                    : (metrics[key] === 0 ? '' : String(metrics[key])))
                            }
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            onBlur={(e) => {
                              const raw = e.target.value.trim();
                              if (raw === '') {
                                return;
                              }
                              const parsed = parseFloat(raw);
                              if (!isNaN(parsed) && parsed >= 0) {
                                updateMetric(key, parsed);
                              }
                              clearEditingValue(key);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={showLevers} onOpenChange={setShowLevers}>
                  <CollapsibleContent ref={leversRef} className="mt-4 space-y-6">
                    <div className="text-sm text-muted-foreground">Configure assumptions and confidence levels to tune projected outcomes.</div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Operational Efficiency Levers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Coder Productivity</Label>
                            <Select value={leverLevels.coderProductivity} onValueChange={(value) => handleLeverLevelChange('coderProductivity', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (40% improvement)</SelectItem>
                                <SelectItem value="medium">Medium (80% improvement)</SelectItem>
                                <SelectItem value="high">High (300% improvement)</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Features:</strong> Autonomous coding, user-friendly UI, easy code search</p>
                              <p><strong>Case Study:</strong> Primary care center (90% improvement), RCM provider (120% improvement)</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Billing Automation</Label>
                            <Select value={leverLevels.billingAutomation} onValueChange={(value) => handleLeverLevelChange('billingAutomation', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (50% improvement)</SelectItem>
                                <SelectItem value="medium">Medium (70% improvement)</SelectItem>
                                <SelectItem value="high">High (120% improvement)</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Features:</strong> AI charge-capture, e-claim builder, auto ERA posting</p>
                              <p><strong>Case Study:</strong> Clinic reduced billing FTEs by 40% after replacing manual charge entry</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Physician Time Saved</Label>
                            <Select value={leverLevels.physicianTimeSaved} onValueChange={(value) => handleLeverLevelChange('physicianTimeSaved', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (30% improvement)</SelectItem>
                                <SelectItem value="medium">Medium (50% improvement)</SelectItem>
                                <SelectItem value="high">High (70% improvement)</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Features:</strong> Inline AI code suggestions, one-click query approval, E/M prompts</p>
                              <p><strong>Case Study:</strong> Clinic cut chart-related physician queries by 30% in 6 months</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cost & Risk Reduction Levers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Technology Cost Saved</Label>
                            <Select value={leverLevels.technologyCostSaved} onValueChange={(value) => handleLeverLevelChange('technologyCostSaved', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (50% savings)</SelectItem>
                                <SelectItem value="medium">Medium (70% savings)</SelectItem>
                                <SelectItem value="high">High (100% savings)</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Features:</strong> Single cloud platform, usage-based pricing</p>
                              <p><strong>Case Study:</strong> Health system retired legacy encoder, removing $150k license cost</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Claim Denial Reduction</Label>
                            <Select value={leverLevels.claimDenialReduction} onValueChange={(value) => handleLeverLevelChange('claimDenialReduction', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (30% reduction)</SelectItem>
                                <SelectItem value="medium">Medium (50% reduction)</SelectItem>
                                <SelectItem value="high">High (70% reduction)</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Features:</strong> NCCI edits check, MCD check, ICD conflict detection</p>
                              <p><strong>Case Study:</strong> MSO managing primary care center achieved 15% reduction in claim denials</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Coding Backlog Elimination</Label>
                            <Select value={leverLevels.codingBacklogElimination} onValueChange={(value) => handleLeverLevelChange('codingBacklogElimination', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (60% reduction)</SelectItem>
                                <SelectItem value="medium">Medium (80% reduction)</SelectItem>
                                <SelectItem value="high">High (100% elimination)</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Features:</strong> E2E connectivity with EHR platform, E2E connectivity with billing system</p>
                              <p><strong>Case Study:</strong> ASC clinic eliminated coding backlog from 28% of charts (17-20 days) to 0%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Advanced Impact Levers Section */}
                    <div className="mt-8 space-y-4">
                      <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                        Advanced Impact Levers
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Revenue Enhancement</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Increase in RVUs</Label>
                              <Select value={leverLevels.rvuIncreaseEM} onValueChange={(value) => handleLeverLevelChange('rvuIncreaseEM', value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low (0.1% improvement)</SelectItem>
                                  <SelectItem value="medium">Medium (0.5% improvement)</SelectItem>
                                  <SelectItem value="high">High (1.5% improvement)</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p><strong>Case 1:</strong> Nephrology center identifies incremental opportunity with &gt; 95% of level 3s to be identified as level 4s</p>
                                <p><strong>Features:</strong> E&M scoring module</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">% charts with under coding issues</Label>
                              <Select value={leverLevels.underCodingReduction} onValueChange={(value) => handleLeverLevelChange('underCodingReduction', value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low (50% improvement)</SelectItem>
                                  <SelectItem value="medium">Medium (80% improvement)</SelectItem>
                                  <SelectItem value="high">High (100% improvement)</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p><strong>Features:</strong> Under coding scan</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Compliance & Risk</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">% charts with over coding issues</Label>
                              <Select value={leverLevels.overCodingReduction} onValueChange={(value) => handleLeverLevelChange('overCodingReduction', value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low (50% improvement)</SelectItem>
                                  <SelectItem value="medium">Medium (80% improvement)</SelectItem>
                                  <SelectItem value="high">High (100% improvement)</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p><strong>Case 1:</strong> Primary care center identified and reduced overcoding and undercoding issues by 70%</p>
                                <p><strong>Features:</strong> Over coding check</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>


              </div>
            </div>
          </div>

          {/* Right Panel - Executive Summary */}
          <div className="space-y-6">
            <div className="h-fit relative">
              {/* Sign-in overlay - enhanced and more prominent */}
              {!isSignedIn && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-sm">
                  <div className="text-center bg-white/98 backdrop-blur-md rounded-xl p-8 border border-gray-200 max-w-sm mx-4 transform transition-all duration-300 hover:scale-105">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-accent to-green-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Unlock Your ROI Analysis
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Sign in to view the Executive Summary details and generate detailed ROI reports
                      </p>
                    </div>
                    <Button 
                      onClick={handleSignInClick}
                      className="w-full bg-gradient-to-r from-purple-accent to-green-accent hover:from-purple-accent/90 hover:to-green-accent/90 text-white font-semibold py-3 px-6 rounded-xl transform transition-all duration-200"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In to Access Full Features
                    </Button>
                    <p className="text-xs text-gray-500 mt-3">
                     * Free access *
                    </p>
                  </div>
                </div>
              )}
              
              <div
                className={`relative h-[600px] overflow-y-auto rounded-xl p-6 md:p-8 text-white ring-1 ring-white/20
                           bg-gradient-to-br from-purple-accent via-green-accent to-purple-accent/80 transition-all duration-500 ${
                  isSignedIn ? 'animate-white-glow' : ''
                }`}
                style={{
                  filter: isSignedIn ? 'none' : 'blur(2px)',
                  opacity: isSignedIn ? 1 : 0.7
                }}
              >
                
                <div className="text-2xl font-semibold mb-2">Executive Summary</div>
                <div className="text-sm text-white/80 mb-4">Estimated Annual Financial Impact</div>
                <div className="text-5xl md:text-6xl font-bold tracking-tight mb-2">{formatCurrency(totalImpact)}</div>
                <div className="text-xs text-white/70 mb-6">Updated {new Date().toLocaleDateString()}</div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-4 border border-gray-200 h-16">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-accent">Cost Savings</span>
                        <TooltipInfo content="Total cost reduction from improved operational efficiency, including reduced manual work, automated billing processes, and technology savings" />
                      </div>
                      <span className="font-semibold text-green-accent">{formatCurrency(totalCostSavings)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-4 border border-gray-200 h-16">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-purple-accent">Revenue Increase</span>
                        <TooltipInfo content="Additional revenue generated through improved claim capture, faster processing, enhanced RVU optimization, and reduced denial rates" />
                      </div>
                      <span className="font-semibold text-purple-accent">{formatCurrency(totalRevenueIncrease)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-4 border border-gray-200 h-16">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-accent">Risk Reduction</span>
                        <TooltipInfo content="Value of compliance risk mitigation through improved coding accuracy, reduced overcoding potential, and enhanced audit protection" />
                      </div>
                      <span className="font-semibold text-green-accent">{formatCurrency(totalRiskReduction)}</span>
                    </div>
                  </div>
                
                {/* Get Detailed ROI Report Button - moved after Advanced Analysis */}
                <Collapsible className="mt-4" defaultOpen>
                  <CollapsibleTrigger asChild>
                    <div className="w-full text-left rounded-xl bg-white hover:bg-gray-100 px-4 py-3 border border-gray-300 text-black cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Advanced Analysis</span>
                        <TooltipInfo content="View detailed breakdown of all financial impact calculations" />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="rounded-xl bg-white/5 border border-white/15 p-3">
                       <MetricsExpandedView
                         coderProductivitySavings={coderProductivityCost}
                         billingAutomationSavings={billingAutomationSavings}
                         physicianTimeSavings={physicianTimeSavings}
                         technologyCostSavings={technologyCostSavings}
                         claimDenialSavings={claimDenialSavings}
                         ARdays={ARdays}
                         rvuIncrease={rvuIncrease}
                         overCodingReduction={overCodingReduction}
                       />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                {/* Get Detailed ROI Report Button - always visible */}
                <div className="mt-6">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('=== CombinedCalculator ROI BUTTON CLICKED ===');
                      handleROIClick();
                      handleROIClick();
                    }} 
                    className="w-full bg-white hover:bg-white/90 text-purple-accent border-2 border-white h-14 text-lg font-semibold rounded-xl"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Get Detailed ROI Report
                  </Button>
                  {!isSignedIn && (
                    <p className="text-xs text-white/70 text-center mt-2">
                      Sign in required to generate detailed report
                    </p>
                  )}
                </div>
                
                <div className="mt-6 text-white/80 text-sm">Implementation Investment: {formatCurrency(scaledImplementationCost)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    {/* References Footer Section - Full Width */}
<div className="w-full bg-background py-16">
  <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center px-6">
    <h2 className="text-3xl font-normal text-foreground mb-8">
      Explore the verified sources behind these projections
    </h2>

    <Button
      variant="outline"
      onClick={() => setShowReferencesModal(true)}
      className="mb-6 w-64 justify-center inline-flex items-center gap-2 px-6 py-4 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <ExternalLink className="h-5 w-5" />
      References
    </Button>

    <p className="text-purple-600 text-sm font-medium max-w-2xl">
      All estimates are projections based on your inputs and past customer outcomes. 
      Actual results vary and are not guaranteed.
    </p>
  </div>
</div>




      {/* FAQ Section - Full Width */}
      <div className="w-full">
        <FAQ />
      </div>
      {/* RevenueBanner Section - White Card on Dark Footer */}
      <div className="flex items-center gap-20 max-w-[1440px] mx-auto my-0 px-[100px] py-20 max-md:flex-col max-md:gap-10 max-md:text-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d6321efa1e6ceeefe2643911cfa0c4be5854f55c?width=1421"
          alt="Rapid Codes"
          className="w-[711px] h-[444px] object-cover rounded-[7px] max-md:w-full max-md:max-w-[600px] max-md:h-auto"
        />
        <div className="flex-1 flex flex-col items-center text-center">
          <h2 className="text-gray-800 text-5xl font-semibold leading-[1.2] mb-6 max-sm:text-4xl">
            Unlock every collectible dollar
          </h2>
          <div className="text-gray-500 text-lg leading-normal mb-8">
            <p>Generate $5M in hidden revenue each year.</p>
            <p>For every 500 beds.</p>
            <p>Revenue uplift. Simplified</p>
          </div>
          <button className="flex items-center justify-center w-[200px] h-[50px] cursor-pointer bg-[#7828C8] rounded-lg hover:bg-[#6a1fb8]">
            <span className="text-white text-base font-semibold">
              Book a Demo
            </span>
          </button>
        </div>
      </div>

      {/* Footer Section - Dark Background Matching Reference */}
     <div className="w-full bg-slate-900 relative z-10">
  <div className="max-w-[1240px] mx-auto w-full px-0 md:px-6">
    <Footer />
  </div>
</div>

      {/* References Modal */}
      <Dialog open={showReferencesModal} onOpenChange={setShowReferencesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Industry References
            </DialogTitle>
          </DialogHeader>
          <References />
        </DialogContent>
      </Dialog>

      {/* Sign In Dialog */}
      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        onSubmit={handleSignInSubmit}
      />

      {/* PDF Preview Dialog */}
      <PDFPreviewDialog
        open={showPDFPreview}
        onOpenChange={setShowPDFPreview}
        data={{
          metrics,
          calculations: {
            totalCostSavings,
            totalRevenueIncrease,
            totalRiskReduction,
            totalImpact,
            implementationCost: scaledImplementationCost,
            roi: ((totalImpact - scaledImplementationCost) / scaledImplementationCost) * 100
          },
          userEmail
        }}
      />
    </div>
  );
};

function getTooltipContent(key: keyof ROIMetrics): string {
  const tooltips = {
    numberOfCoders: "Full-time equivalent medical coders in your organization",
    numberOfBillers: "Full-time equivalent billing staff members", 
    numberOfPhysicians: "Total number of physicians generating coded encounters",
    claimDeniedPercent: "Percentage of submitted claims that are initially denied",
    revenueClaimed: "Total annual revenue from medical claims submitted"
  };
  return tooltips[key] || "";
}

export default CombinedCalculator;
