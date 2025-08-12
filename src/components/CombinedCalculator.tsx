import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Calculator, TrendingUp, DollarSign, Shield, Info, ExternalLink, Settings, BarChart3, Award, Target, Minus, Plus, Download, Calendar, Phone } from "lucide-react";
import { ROIMetrics } from "@/types/roi";
import { References } from "./tabs/References";
import { ProductDescription } from "./ProductDescription";
import { MetricsExpandedView } from "./MetricsExpandedView";
import { TooltipInfo } from "./TooltipInfo";
import { formatCurrency, formatNumber } from "@/utils/formatters";

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

export const CombinedCalculator = ({ 
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
    claimsPerAnnum: 33333, // Auto-calculated: revenue / averageCostPerClaim
    averageCostPerClaim: 150,
    chartsProcessedPerAnnum: 33333, // Auto-calculated: revenue / averageCostPerClaim
    salaryPerCoder: 60000,
    overheadCostPercent: 38,
    numberOfEncoderLicenses: 3,
    averageCostPerLicensePerMonth: 500,
    salaryPerBiller: 50000,
    salaryPerPhysician: 350000,
    avgTimePerPhysicianPerChart: 15,
    avgTimePerCoderPerChart: 0.1333, // 8 minutes per chart by default
    chartsPerCoderPerDay: 80, // Will be calculated dynamically
    costPerDeniedClaim: 13,
    codingBacklogPercent: 20, //20% Backlog per chart
    daysPerChartInBacklog: 20,
    costOfCapital: 5, //5 is  the defined cost of capital
    rvusCodedPerAnnum: 156250, // Auto-calculated: revenue / 32
    weightedAverageGPCI: 1.03,
    overCodingPercent: 5,
    underCodingPercent: 5,
    avgBillableCodesPerChart: 5,
    percentOverCodedCharts: 0.05,     // 5% (more realistic)
    percentReductionNCCI: 0.67,
    complianceCostPerCode: 1.3
  });

  const metrics = propMetrics || localMetrics;
  
  const updateMetric = propUpdateMetric || ((key: keyof ROIMetrics, value: number) => {
    setLocalMetrics(prev => {
      const updated = { ...prev, [key]: value };
      
      // Calculate chartsPerCoderPerDay dynamically
      if (updated.chartsProcessedPerAnnum > 0 && updated.numberOfCoders > 0) {
        updated.chartsPerCoderPerDay = updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252;
      }
      
      // Auto-update encoder licenses when number of coders changes (1 license per coder)
      if (key === 'numberOfCoders') {
        updated.numberOfEncoderLicenses = value;
        // Recalculate chartsPerCoderPerDay
        if (updated.chartsProcessedPerAnnum > 0 && value > 0) {
          updated.chartsPerCoderPerDay = updated.chartsProcessedPerAnnum / value / 252;
        }
      }
      
      // Auto-calculate claims and charts when revenue changes
      if (key === 'revenueClaimed') {
        updated.claimsPerAnnum = Math.round(value / updated.averageCostPerClaim);
        updated.chartsProcessedPerAnnum = Math.round(value / updated.averageCostPerClaim);
        updated.rvusCodedPerAnnum = Math.round(value / 32);
        // Only auto-scale billers and physicians if they are at default ratios (not manually changed)
        const isDefaultBillerRatio = Math.abs(updated.numberOfBillers - (updated.revenueClaimed / 5000000) * 5) < 1;
        const isDefaultPhysicianRatio = Math.abs(updated.numberOfPhysicians - (updated.revenueClaimed / 5000000) * 20) < 1;
        if (isDefaultBillerRatio) {
          const revenueGrowthFactor = value / 5000000; // 5M is the base revenue
          updated.numberOfBillers = Math.ceil(5 * revenueGrowthFactor); // Base 5 billers
        }
        if (isDefaultPhysicianRatio) {
          const revenueGrowthFactor = value / 5000000; // 5M is the base revenue
          updated.numberOfPhysicians = Math.ceil(20 * revenueGrowthFactor); // Base 20 physicians
        }
        // Recalculate chartsPerCoderPerDay
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252;
        }
      }
      
      // Auto-calculate claims and charts when average cost per claim changes
      if (key === 'averageCostPerClaim') {
        updated.claimsPerAnnum = Math.round(updated.revenueClaimed / value);
        updated.chartsProcessedPerAnnum = Math.round(updated.revenueClaimed / value);
        // Don't auto-scale billers and physicians when cost per claim changes
        // Recalculate chartsPerCoderPerDay
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = updated.chartsProcessedPerAnnum / updated.numberOfCoders / 252;
        }
      }
      
      // Auto-calculate chartsPerCoderPerDay when charts processed per year changes
      if (key === 'chartsProcessedPerAnnum') {
        // Don't auto-scale billers and physicians when charts change
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = value / updated.numberOfCoders / 252;
        }
      }
      
      // Auto-calculate chartsPerCoderPerDay when claims per year changes
      if (key === 'claimsPerAnnum') {
        updated.chartsProcessedPerAnnum = value; // Sync charts with claims
        // Don't auto-scale billers and physicians when claims change
        if (updated.numberOfCoders > 0) {
          updated.chartsPerCoderPerDay = value / updated.numberOfCoders / 252;
        }
      }
      
      return updated;
    });
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Lever confidence levels (Medium as default)
  const [leverLevels, setLeverLevels] = useState({
    coderProductivity: 'medium',
    billingAutomation: 'medium', 
    physicianTimeSaved: 'medium',
    technologyCostSaved: 'medium',
    claimDenialReduction: 'medium',
    codingBacklogElimination: 'medium'
  });

  // Lever impact definitions
  const leverImpacts = {
    coderProductivity: { low: 0.4, medium: 0.8, high: 1.0 },
    billingAutomation: { low: 0.5, medium: 0.7, high: 1.2 },
    physicianTimeSaved: { low: 0.05, medium: 0.1, high: 0.15 }, // Added meaningful values
    technologyCostSaved: { low: 1.0, medium: 1.0, high: 1.0 },
    claimDenialReduction: { low: 0.3, medium: 0.5, high: 0.7 },
    codingBacklogElimination: { low: 0.08, medium: 0.04, high: 0 }
  };

  // Calculate lever impacts based on confidence levels
  const calculateLeverImpact = (leverKey: keyof typeof leverImpacts, baseValue: number) => {
    const level = leverLevels[leverKey] as 'low' | 'medium' | 'high';
    return baseValue * leverImpacts[leverKey][level];
  };

  // Individual lever calculations - more realistic scaling to revenue size
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

  // Revenue increase from RVU optimization - using actual RVU data
  const rvuIncrease = (() => {
    // 2024 Medicare conversion factor
    const conversionFactor = 32.7442;

    // Revenue scale based on organization size
    const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
    const cappedRevenueScale = Math.min(revenueScale, 1.2);

    // Number of RVUs billed × % increment in RVUs × Wt. Avg GPCI × Conversion

    // 1. Define the components
    const numberOfRVUsBilled = metrics.rvusCodedPerAnnum;           // Number of RVUs billed
    const percentIncrementInRVUs = 0.015;                          // % increment in RVUs (1.5%)
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

  // Over/Under coding reduction (risk mitigation) - using actual coding accuracy data
  // Overcoding risk reduction using NCCI edits
  const overCodingReduction = (() => {
    const chartsPerAnnum = metrics.chartsProcessedPerAnnum;
    const percentOverCodedCharts = metrics.percentOverCodedCharts; // Should be decimal (e.g., 0.05 for 5%)
    const percentReductionNCCI = metrics.percentReductionNCCI; // Should be decimal (e.g., 0.67 for 67%)
    const complianceCostPerCode = metrics.complianceCostPerCode; // Cost per overcoded chart

    const result = chartsPerAnnum * percentOverCodedCharts * percentReductionNCCI * complianceCostPerCode;
    console.log('Over Coding Reduction:', { chartsPerAnnum, percentOverCodedCharts, percentReductionNCCI, complianceCostPerCode, result });
    return result;
  })();
  // Total calculations with capping to prevent savings exceeding revenue
  const totalCostSavings = Math.min(
    coderProductivityCost + billingAutomationSavings + physicianTimeSavings + 
    technologyCostSavings + claimDenialSavings + ARdays,
    metrics.revenueClaimed * 0.65 // Cap at 65% of revenue
  );
  const totalRevenueIncrease = rvuIncrease;
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

  const handleBookCall = () => {
    window.open('https://calendly.com/rapidclaims', '_blank');
  };

  const handleIncrement = (key: keyof ROIMetrics, step: number = 1) => {
    updateMetric(key, metrics[key] + step);
  };

  const handleDecrement = (key: keyof ROIMetrics, step: number = 1) => {
    updateMetric(key, Math.max(0, metrics[key] - step));
  };

  const handleInputChange = (key: keyof ROIMetrics, value: string | number) => {
    if (typeof value === 'number') {
      updateMetric(key, value);
      return;
    }
    
    // Handle empty string - allow temporary empty state
    if (value === '') {
      updateMetric(key, 0);
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

  // ROI meter calculation for visualization - scale to 400% max for realistic display
  const roiPercentage = Math.min(Math.max(cappedRoi, 0), 400);
  const angle = (roiPercentage / 400) * 180;

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
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <ProductDescription />
      
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Calculator className="h-6 w-6" />
            RapidROI Calculator
            <TooltipInfo content="Calculate your potential return on investment with RapidClaims AI-powered medical coding solution" />
          </CardTitle>
        </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="assumptions" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Benchmarks & Levers
            </TabsTrigger>
            <TabsTrigger value="references" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              References
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Annual Revenue Section */}
       <div className="mb-8">
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
          // Remove commas for parsing
          const rawValue = e.target.value.replace(/,/g, "");
          
          // Allow empty string during editing
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
          // Apply minimum constraints only when user finishes editing
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

            {/* Executive Summary Metrics */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-semibold">Executive Summary</h3>
                <TooltipInfo content="High-level overview of your potential financial impact with RapidClaims AI" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Financial Impact Display */}
                <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
                  <div className="text-center space-y-2 mb-4">
                    <span className="text-sm text-muted-foreground">Estimated Annual Financial Impact</span>
                    <TooltipInfo content="Estimated Annual Finance using the input cost and impact of every resource utilised" />
                    <div className="text-4xl font-bold text-primary">
                      {formatCurrency(totalImpact)}
                    </div>
                  </div>
                  <div className="text-sm text-center text-muted-foreground">
                    Implementation Investment: {formatCurrency(scaledImplementationCost)}
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">Cost Savings</span>
                      <TooltipInfo content="Annual savings from operational efficiencies and productivity gains" />
                    </div>
                    <div className="text-xl font-bold text-green-600">{formatCurrency(totalCostSavings)}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-medium">Revenue Increase</span>
                      <TooltipInfo content="Additional revenue from improved coding accuracy and RVU optimization" />
                    </div>
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(totalRevenueIncrease)}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600 font-medium">Risk Reduction</span>
                      <TooltipInfo content="Value of reduced compliance risks and audit exposure" />
                    </div>
                    <div className="text-xl font-bold text-purple-600">{formatCurrency(totalRiskReduction)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics Breakdown */}
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

            <Separator className="my-8" />

            {/* Must Have Inputs */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-semibold">Key Input Parameters</h3>
                <TooltipInfo content="Essential metrics that drive your ROI calculation. Adjust these to match your organization's profile." />
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
                        type="number"
                        value={metrics[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="text-center"
                        min="0"
                        step={step}
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
            </div>

            {/* Advanced Inputs (Collapsible) */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full mb-6">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Inputs
                  {showAdvanced ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {advancedInputs.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Input
                        type="number"
                        value={metrics[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        min=" "
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={onCalculateROI} 
                className="w-full h-14 text-lg font-semibold"
              >
                <Download className="h-5 w-5 mr-2" />
                Get Detailed ROI Report
              </Button>
              
              <Button 
                onClick={handleBookCall}
                variant="outline"
                className="w-full h-14 text-lg font-semibold"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book a Call with RapidClaims
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="assumptions" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Impact Lever Configuration</h3>
                <p className="text-muted-foreground mb-6">
                  Adjust the confidence levels for each impact lever based on your organization's readiness and implementation approach.
                </p>
              </div>

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
                          <SelectItem value="medium">Medium (80% improvement) - ${coderProductivityCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (300% improvement) - ${coderProductivityCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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
                          <SelectItem value="low">Low (50% improvement) - ${billingAutomationSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="medium">Medium (70% improvement) - ${billingAutomationSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (120% improvement) - ${billingAutomationSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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
                          <SelectItem value="low">Low (30% improvement) - ${physicianTimeSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="medium">Medium (50% improvement) - ${physicianTimeSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (70% improvement) - ${physicianTimeSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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
                          <SelectItem value="low">Low (50% savings) - ${technologyCostSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="medium">Medium (70% savings) - ${technologyCostSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (100% savings) - ${technologyCostSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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
                          <SelectItem value="low">Low (30% reduction) - ${claimDenialSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="medium">Medium (50% reduction) - ${claimDenialSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (70% reduction) - ${claimDenialSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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
                          <SelectItem value="low">Low (60% reduction) - ${ARdays.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="medium">Medium (80% reduction) - ${ARdays.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (100% elimination) - ${ARdays.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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

            </div>
          </TabsContent>

          <TabsContent value="references">
            <References />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </div>
  );

  // Helper function to provide tooltips for input fields
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
};
