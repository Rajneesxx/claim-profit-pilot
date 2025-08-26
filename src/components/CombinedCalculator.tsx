import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Calculator, ExternalLink, Settings, Minus, Plus, Download, Calendar } from "lucide-react";
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
    chartsPerCoderPerDay: 80,
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

      if (updated.chartsProcessedPerAnnum > 0 && updated.numberOfCoders > 0) {
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
  const [showReferences, setShowReferences] = useState(false);
  const [editingValues, setEditingValues] = useState<Partial<Record<keyof ROIMetrics, string>>>({});
  const [showLevers, setShowLevers] = useState(false);
  const advancedRef = useRef<HTMLDivElement | null>(null);
  const leversRef = useRef<HTMLDivElement | null>(null);
  const referencesRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (showReferences && referencesRef.current) {
      referencesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showReferences]);
  
  const [leverLevels, setLeverLevels] = useState({
    coderProductivity: 'medium',
    billingAutomation: 'medium', 
    physicianTimeSaved: 'medium',
    technologyCostSaved: 'medium',
    claimDenialReduction: 'medium',
    codingBacklogElimination: 'medium'
  });

  const leverImpacts = {
    coderProductivity: { low: 0.4, medium: 0.8, high: 1.0 },
    billingAutomation: { low: 0.5, medium: 0.7, high: 1.2 },
    physicianTimeSaved: { low: 0.05, medium: 0.1, high: 0.15 },
    technologyCostSaved: { low: 1.0, medium: 1.0, high: 1.0 },
    claimDenialReduction: { low: 0.3, medium: 0.5, high: 0.7 },
    codingBacklogElimination: { low: 0.08, medium: 0.04, high: 0 }
  };

  const calculateLeverImpact = (leverKey: keyof typeof leverImpacts, baseValue: number) => {
    const level = leverLevels[leverKey] as 'low' | 'medium' | 'high';
    return baseValue * leverImpacts[leverKey][level];
  };

  const coderProductivityCost = (() => {
    const incrementalProductivity = leverImpacts.coderProductivity[leverLevels.coderProductivity as 'low' | 'medium' | 'high'];
    const chartsPerYear = metrics.chartsProcessedPerAnnum;
    const timePerChart = metrics.avgTimePerCoderPerChart;
    const costPerHour = (metrics.salaryPerCoder / 2100);
    return chartsPerYear * (incrementalProductivity / (1 + incrementalProductivity)) * timePerChart * costPerHour;
  })();

  const billingAutomationSavings = (() => {
    const numberOfBillers = metrics.numberOfBillers;
    const averageSalaryPerBiller = metrics.salaryPerBiller;
    const automationLevel = leverLevels.billingAutomation as 'low' | 'medium' | 'high';
    const automationImpact = leverImpacts.billingAutomation[automationLevel];
    const result = numberOfBillers * averageSalaryPerBiller * automationImpact;
    console.log('Billing Automation Savings:', { numberOfBillers, averageSalaryPerBiller, result });
    return result;
  })();

  const physicianTimeSavings = (() => {
    const hoursPerChart = (metrics.avgTimePerPhysicianPerChart || 0) / 60;
    const chartsPerYear = metrics.chartsProcessedPerAnnum;
    const hourlyRate = metrics.salaryPerPhysician / (40 * 52);
    const numberOfPhysicians = metrics.numberOfPhysicians;
    const timeSavedRate = leverImpacts.physicianTimeSaved[leverLevels.physicianTimeSaved as 'low' | 'medium' | 'high'];
    const result = hoursPerChart * chartsPerYear * numberOfPhysicians * hourlyRate * timeSavedRate;
    console.log('Physician Time Savings:', { hoursPerChart, chartsPerYear, hourlyRate, numberOfPhysicians, timeSavedRate, result });
    return result;
  })();

  const technologyCostSavings = (() => {
    const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
    const baseTechSavings = metrics.numberOfEncoderLicenses * metrics.averageCostPerLicensePerMonth * 12;
    const reductionRate = leverImpacts.technologyCostSaved[leverLevels.technologyCostSaved as 'low' | 'medium' | 'high'];
    return baseTechSavings * reductionRate;
  })();

  const claimDenialSavings = (() => {
    const baseDenials = metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100);
    const reductionRate = leverImpacts.claimDenialReduction[leverLevels.claimDenialReduction as 'low' | 'medium' | 'high'];
    const costPerDeniedClaim = metrics.costPerDeniedClaim;
    return baseDenials * reductionRate * costPerDeniedClaim;
  })();

  const ARdays = (() => {
    const chartsPerAnnum = metrics.chartsProcessedPerAnnum;
    const avgChartValue = metrics.revenueClaimed / Math.max(metrics.chartsProcessedPerAnnum, 0.2);
    const codingBacklogPercent = metrics.codingBacklogPercent/100;
    const avgBacklogDays = metrics.daysPerChartInBacklog;
    const reductionRate = leverImpacts.codingBacklogElimination[leverLevels.codingBacklogElimination as 'low' | 'medium' | 'high'];
    const costOfCapital = metrics.costOfCapital;
    return chartsPerAnnum * avgChartValue * codingBacklogPercent * avgBacklogDays * reductionRate * (costOfCapital / 360) * 0.2;
  })();

  const rvuIncrease = (() => {
    const conversionFactor = 32.7442;
    const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
    const cappedRevenueScale = Math.min(revenueScale, 1.2);
    const numberOfRVUsBilled = metrics.rvusCodedPerAnnum;
    const percentIncrementInRVUs = 0.015;
    const weightedAverageGPCI = metrics.weightedAverageGPCI;
    const rvuRevenueIncreaseByEandM = numberOfRVUsBilled * 
                                    percentIncrementInRVUs * 
                                    weightedAverageGPCI * 
                                    conversionFactor;
    return rvuRevenueIncreaseByEandM;
  })();

  const overCodingReduction = (() => {
    const chartsPerAnnum = metrics.chartsProcessedPerAnnum;
    const percentOverCodedCharts = metrics.percentOverCodedCharts;
    const percentReductionNCCI = metrics.percentReductionNCCI;
    const complianceCostPerCode = metrics.complianceCostPerCode;
    const result = chartsPerAnnum * percentOverCodedCharts * percentReductionNCCI * complianceCostPerCode;
    console.log('Over Coding Reduction:', { chartsPerAnnum, percentOverCodedCharts, percentReductionNCCI, complianceCostPerCode, result });
    return result;
  })();

  const totalCostSavings = Math.min(
    coderProductivityCost + billingAutomationSavings + physicianTimeSavings + 
    technologyCostSavings + claimDenialSavings + ARdays,
    metrics.revenueClaimed * 0.65
  );
  const totalRevenueIncrease = rvuIncrease;
  const totalRiskReduction = overCodingReduction;
  const totalImpact = totalCostSavings + totalRevenueIncrease + totalRiskReduction;
  
  const baseImplementationCost = 150000;
  const revenueScale = Math.sqrt(metrics.revenueClaimed / 1000000);
  const scaledImplementationCost = baseImplementationCost * (1 + revenueScale * 0.8);
  const roi = scaledImplementationCost > 0 ? ((totalImpact / scaledImplementationCost) * 100) : 0;
  const cappedRoi = Math.min(Math.max(roi, 0), 400);

  const handleLeverLevelChange = (lever: string, level: string) => {
    setLeverLevels(prev => ({ ...prev, [lever]: level }));
  };

  const handleBookCall = () => {
    window.open('https://calendly.com/rapidclaims', '_blank');
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
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="w-full">
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <Calculator className="h-6 w-6" />
            ROI Calculator
          </div>
        </div>

        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Calculations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Key Input Parameters
                  <TooltipInfo content="Essential metrics that drive your ROI calculation. Adjust these to match your organization's profile." />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Annual Revenue Claimed */}
                <div className="p-6 bg-muted/30 rounded-lg border">
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
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Revenue: {formatCurrency(metrics.revenueClaimed)}
                      </div>
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
                  <CollapsibleContent ref={leversRef} className="mt-4 space-y-4">
                    <div className="text-sm text-muted-foreground">Configure assumptions and confidence levels to tune projected outcomes.</div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-8" />

                <Collapsible open={showReferences} onOpenChange={setShowReferences}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      References {showReferences ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent ref={referencesRef} className="mt-4 space-y-4">
                    <References />
                  </CollapsibleContent>
                </Collapsible>

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
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Executive Summary */}
          <div className="space-y-6">
            <Card className="h-fit">
              <div
                className="relative h-[600px] overflow-y-auto rounded-3xl p-6 md:p-8 text-white shadow-xl ring-1 ring-white/20
                           bg-gradient-to-br from-blue-600 via-purple-600 to-blue-200"
                style={{
                  filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.5))'
                }}
              >
                <button className="absolute right-4 top-4 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm border border-white/20">
                  Sign in
                </button>
                <div className="text-2xl font-semibold mb-2">Executive Summary</div>
                <div className="text-sm text-white/80 mb-4">Estimated Annual Financial Impact</div>
                <div className="text-5xl md:text-6xl font-bold tracking-tight mb-2">{formatCurrency(totalImpact)}</div>
                <div className="text-xs text-white/70 mb-6">Updated {new Date().toLocaleDateString()}</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 border border-gray-200">
                    <span className="font-medium text-green-600">Cost Savings</span>
                    <span className="font-semibold text-green-700">{formatCurrency(totalCostSavings)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 border border-gray-200">
                    <span className="font-medium text-blue-600">Revenue Increase</span>
                    <span className="font-semibold text-blue-700">{formatCurrency(totalRevenueIncrease)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 border border-gray-200">
                    <span className="font-medium text-purple-600">Risk Reduction</span>
                    <span className="font-semibold text-purple-700">{formatCurrency(totalRiskReduction)}</span>
                  </div>
                </div>
                <Collapsible className="mt-4" defaultOpen>
                  <CollapsibleTrigger asChild>
                    <button className="w-full text-left rounded-xl bg-white hover:bg-gray-100 px-4 py-3 border border-gray-300 text-black">
                      <span className="font-medium">Advanced Analysis
                        <TooltipInfo content="View detailed breakdown of all financial impact calculations" />
                      </span>
                    </button>
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
                <div className="mt-6 text-white/80 text-sm">Implementation Investment: {formatCurrency(scaledImplementationCost)}</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

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
