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
    numberOfCoders: 10,
    numberOfBillers: 5,
    numberOfPhysicians: 20,
    claimDeniedPercent: 8.5,
    claimsPerAnnum: 50000,
    averageCostPerClaim: 100,
    chartsProcessedPerAnnum: 100000,
    salaryPerCoder: 65000,
    overheadCostPercent: 30,
    numberOfEncoderLicenses: 10,
    averageCostPerLicensePerMonth: 500,
    salaryPerBiller: 55000,
    salaryPerPhysician: 280000,
    avgTimePerPhysicianPerChart: 15,
    chartsPerCoderPerDay: 25,
    costPerDeniedClaim: 150,
    codingBacklogPercent: 15,
    daysPerChartInBacklog: 5,
    costOfCapital: 8,
    rvusCodedPerAnnum: 25000,
    weightedAverageGPCI: 1.0,
    overCodingPercent: 5,
    underCodingPercent: 8,
    avgBillableCodesPerChart: 3.2
  });

  const metrics = propMetrics || localMetrics;
  
  const updateMetric = propUpdateMetric || ((key: keyof ROIMetrics, value: number) => {
    setLocalMetrics(prev => ({ ...prev, [key]: value }));
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
    coderProductivity: { low: 0.4, medium: 0.8, high: 3.0 },
    billingAutomation: { low: 0.5, medium: 0.7, high: 1.2 },
    physicianTimeSaved: { low: 0.3, medium: 0.5, high: 0.7 },
    technologyCostSaved: { low: 0.5, medium: 0.7, high: 1.0 },
    claimDenialReduction: { low: 0.3, medium: 0.5, high: 0.7 },
    codingBacklogElimination: { low: 0.6, medium: 0.8, high: 1.0 }
  };

  // Calculate lever impacts based on confidence levels
  const calculateLeverImpact = (leverKey: keyof typeof leverImpacts, baseValue: number) => {
    const level = leverLevels[leverKey] as 'low' | 'medium' | 'high';
    return baseValue * leverImpacts[leverKey][level];
  };

  // Individual lever calculations
  const coderProductivitySavings = (() => {
    const chartsPerYear = metrics.chartsProcessedPerAnnum;
    const timePerChart = 0.2; // 12 minutes = 0.2 hours
    const costPerCoderPerHour = (metrics.salaryPerCoder * (1 + metrics.overheadCostPercent / 100)) / (52 * 40);
    const productivityIncrease = leverImpacts.coderProductivity[leverLevels.coderProductivity as 'low' | 'medium' | 'high'];
    return chartsPerYear * (productivityIncrease / (1 + productivityIncrease)) * timePerChart * costPerCoderPerHour;
  })();

  const billingAutomationSavings = (() => {
    const reductionRate = leverImpacts.billingAutomation[leverLevels.billingAutomation as 'low' | 'medium' | 'high'];
    return metrics.numberOfBillers * metrics.salaryPerBiller * reductionRate;
  })();

  const physicianTimeSavings = (() => {
    const hoursSavedPerChart = (metrics.avgTimePerPhysicianPerChart / 60) * 
      leverImpacts.physicianTimeSaved[leverLevels.physicianTimeSaved as 'low' | 'medium' | 'high'];
    const hourlyPay = metrics.salaryPerPhysician / (52 * 40);
    return hoursSavedPerChart * metrics.chartsProcessedPerAnnum * metrics.numberOfPhysicians * hourlyPay;
  })();

  const technologyCostSavings = (() => {
    const reductionRate = leverImpacts.technologyCostSaved[leverLevels.technologyCostSaved as 'low' | 'medium' | 'high'];
    return metrics.numberOfEncoderLicenses * metrics.averageCostPerLicensePerMonth * 12 * reductionRate;
  })();

  const claimDenialSavings = (() => {
    const reductionRate = leverImpacts.claimDenialReduction[leverLevels.claimDenialReduction as 'low' | 'medium' | 'high'];
    return metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100) * reductionRate * metrics.costPerDeniedClaim;
  })();

  const backlogReductionSavings = (() => {
    const reductionRate = leverImpacts.codingBacklogElimination[leverLevels.codingBacklogElimination as 'low' | 'medium' | 'high'];
    const avgValuePerChart = metrics.averageCostPerClaim;
    return metrics.chartsProcessedPerAnnum * (metrics.codingBacklogPercent / 100) * 
      avgValuePerChart * (metrics.daysPerChartInBacklog / 365) * (metrics.costOfCapital / 100) * reductionRate;
  })();

  // Revenue increase from RVU optimization
  const rvuIncrease = (() => {
    const incrementRate = 0.001; // 0.1% for low impact
    return metrics.rvusCodedPerAnnum * incrementRate * metrics.weightedAverageGPCI * 36;
  })();

  // Over/Under coding reduction (risk mitigation)
  const overCodingReduction = (() => {
    const reductionRate = 0.8; // 80% reduction (medium impact)
    const chartsWithOvercoding = metrics.chartsProcessedPerAnnum * (metrics.overCodingPercent / 100);
    const complianceCostPerChart = 102; // Average compliance cost
    return chartsWithOvercoding * reductionRate * complianceCostPerChart;
  })();

  // Total calculations
  const totalCostSavings = coderProductivitySavings + billingAutomationSavings + physicianTimeSavings + 
    technologyCostSavings + claimDenialSavings + backlogReductionSavings;
  const totalRevenueIncrease = rvuIncrease;
  const totalRiskReduction = overCodingReduction;
  const totalImpact = totalCostSavings + totalRevenueIncrease + totalRiskReduction;
  
  // ROI calculation - Based on implementation cost percentage of annual revenue
  const implementationCostPercent = 0.02; // 2% of annual revenue as implementation cost
  const implementationCost = metrics.revenueClaimed * implementationCostPercent;
  const roi = implementationCost > 0 ? ((totalImpact / implementationCost) * 100) : 0;

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

  const handleInputChange = (key: keyof ROIMetrics, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateMetric(key, numValue);
    }
  };

  const onCalculateROI = propOnCalculateROI || (() => {
    alert('ROI Report would be generated here!');
  });

  // ROI meter calculation for visualization
  const roiPercentage = Math.min(Math.max(roi, 0), 1200);
  const angle = (roiPercentage / 1200) * 180;

  const basicInputs = [
    { key: 'numberOfCoders' as keyof ROIMetrics, label: 'Number of Coders', max: 50, step: 1 },
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
    { key: 'avgTimePerPhysicianPerChart' as keyof ROIMetrics, label: 'Avg Time Per Chart (min)' },
    { key: 'chartsPerCoderPerDay' as keyof ROIMetrics, label: 'Charts Per Coder Per Day' },
    { key: 'costPerDeniedClaim' as keyof ROIMetrics, label: 'Cost Per Denied Claim ($)' },
    { key: 'codingBacklogPercent' as keyof ROIMetrics, label: 'Coding Backlog (%)' },
    { key: 'daysPerChartInBacklog' as keyof ROIMetrics, label: 'Days Per Chart in Backlog' },
    { key: 'costOfCapital' as keyof ROIMetrics, label: 'Cost of Capital (%)' },
    { key: 'rvusCodedPerAnnum' as keyof ROIMetrics, label: 'RVUs Coded Per Year' },
    { key: 'weightedAverageGPCI' as keyof ROIMetrics, label: 'Weighted Average GPCI' },
  ];

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Calculator className="h-6 w-6" />
          RapidClaims ROI Calculator
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
              Assumptions & Levers
            </TabsTrigger>
            <TabsTrigger value="references" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              References
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Annual Revenue Section */}
            <div className="mb-8">
              <Label htmlFor="revenue" className="text-base font-medium text-gray-700 mb-4 block">
                Annual Revenue Claimed
              </Label>
              <div className="space-y-4">
                <Slider
                  value={[metrics.revenueClaimed]}
                  onValueChange={(value) => updateMetric('revenueClaimed', value[0])}
                  max={50000000}
                  step={100000}
                  className="w-full"
                />
                <Input
                  id="revenue"
                  type="number"
                  value={metrics.revenueClaimed}
                  onChange={(e) => handleInputChange('revenueClaimed', e.target.value)}
                  className="text-center text-lg font-semibold"
                  placeholder="Enter annual revenue"
                />
              </div>
            </div>

            {/* Executive Summary Metrics */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6">Executive Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* ROI Meter */}
                <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                  <div className="relative w-48 h-24 mb-4">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="50%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 20 80 A 80 80 0 0 1 180 80"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 20 80 A 80 80 0 0 1 180 80"
                        fill="none"
                        stroke="url(#roiGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(angle / 180) * 251.2} 251.2`}
                        className="transition-all duration-500"
                      />
                      <line
                        x1="100"
                        y1="80"
                        x2={100 + 60 * Math.cos((180 - angle) * Math.PI / 180)}
                        y2={80 - 60 * Math.sin((180 - angle) * Math.PI / 180)}
                        stroke="#374151"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {roi.toFixed(1)}%
                  </div>
                  <div className="text-gray-700 text-center font-medium">ROI</div>
                </div>

                {/* Impact Metrics */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{totalCostSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
                    <div className="text-sm text-muted-foreground">Reduced Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{totalRevenueIncrease.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
                    <div className="text-sm text-muted-foreground">Increased Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{totalRiskReduction.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
                    <div className="text-sm text-muted-foreground">Reduced Risk</div>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-lg font-semibold text-yellow-600 mb-1">Total Impact</div>
                <div className="text-3xl font-bold text-yellow-800">
                  {totalImpact.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Must Have Inputs */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6">Must Have Inputs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {basicInputs.map(({ key, label, max, step }) => (
                  <div key={key} className="space-y-3">
                    <Label>{label}</Label>
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
                        min="0"
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
                          <SelectItem value="low">Low (40% improvement) - ${coderProductivitySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="medium">Medium (80% improvement) - ${coderProductivitySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (300% improvement) - ${coderProductivitySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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
                          <SelectItem value="low">Low (60% reduction) - ${backlogReductionSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="medium">Medium (80% reduction) - ${backlogReductionSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
                          <SelectItem value="high">High (100% elimination) - ${backlogReductionSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</SelectItem>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impact Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{totalCostSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
                      <div className="text-sm text-muted-foreground">Total Cost Savings</div>
                    </div>
                    <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totalRevenueIncrease.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
                      <div className="text-sm text-muted-foreground">Revenue Increase</div>
                    </div>
                    <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalRiskReduction.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
                      <div className="text-sm text-muted-foreground">Risk Reduction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="references">
            <References />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};