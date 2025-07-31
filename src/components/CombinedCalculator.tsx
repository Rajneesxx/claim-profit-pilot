import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Award, Settings, ChevronDown, ChevronUp, Download, Calendar, Phone, Minus, Plus } from 'lucide-react';
import { ROIMetrics } from "@/types/roi";

interface CombinedCalculatorProps {
  metrics: ROIMetrics;
  updateMetric: (key: keyof ROIMetrics, value: number) => void;
  onCalculateROI: () => void;
  calculations: {
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

export const CombinedCalculator = ({ metrics, updateMetric, onCalculateROI, calculations }: CombinedCalculatorProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleBookCall = () => {
    window.open('https://calendly.com/rapidclaims', '_blank');
  };

  const handleIncrement = (key: keyof ROIMetrics, step: number = 1) => {
    updateMetric(key, metrics[key] + step);
  };

  const handleDecrement = (key: keyof ROIMetrics, step: number = 1) => {
    updateMetric(key, Math.max(0, metrics[key] - step));
  };

  // ROI meter calculation for visualization
  const roiPercentage = Math.min(Math.max(calculations.roi, 0), 1200);
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
    { key: 'overCodingPercent' as keyof ROIMetrics, label: 'Over Coding (%)' },
    { key: 'underCodingPercent' as keyof ROIMetrics, label: 'Under Coding (%)' },
    { key: 'avgBillableCodesPerChart' as keyof ROIMetrics, label: 'Avg Billable Codes Per Chart' },
  ];

  return (
    <Card className="w-full bg-white border-border">
      <CardHeader className="border-b border-border pb-6">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Award className="h-5 w-5" />
          ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 bg-white">
        {/* Revenue Input */}
        <div className="mb-8">
          <Label htmlFor="revenue" className="text-base font-medium text-foreground mb-4 block">
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
              onChange={(e) => updateMetric('revenueClaimed', parseInt(e.target.value) || 0)}
              className="text-center text-lg font-semibold bg-white border-border"
            />
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Executive Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* ROI Meter */}
            <div className="flex flex-col items-center justify-center p-6 bg-white border border-border rounded-lg">
              <div className="relative w-48 h-24 mb-4">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--destructive))" />
                      <stop offset="50%" stopColor="hsl(var(--warning))" />
                      <stop offset="100%" stopColor="hsl(var(--success))" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 80 A 80 80 0 0 1 180 80"
                    fill="none"
                    stroke="hsl(var(--muted))"
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
                    stroke="hsl(var(--foreground))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {calculations.roi.toFixed(1)}%
              </div>
              <div className="text-foreground text-center">ROI</div>
            </div>

            {/* Impact Metrics */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-lg font-semibold text-blue-600 mb-1">Reduced Cost</div>
                <div className="text-2xl font-bold text-blue-800">
                  ${calculations.executiveSummary.reducedCost.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <div className="text-lg font-semibold text-cyan-600 mb-1">Increased Revenue</div>
                <div className="text-2xl font-bold text-cyan-800">
                  ${calculations.executiveSummary.increaseRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-lg font-semibold text-purple-600 mb-1">Reduced Risk</div>
              <div className="text-2xl font-bold text-purple-800">
                ${calculations.executiveSummary.reducedRisk.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-lg font-semibold text-yellow-600 mb-1">Total Impact</div>
              <div className="text-2xl font-bold text-yellow-800">
                ${calculations.executiveSummary.totalImpact.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Must Have Inputs */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Must Have Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {basicInputs.map(({ key, label, max, step }) => (
              <div key={key} className="space-y-3">
                <Label className="text-foreground font-medium">{label}</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecrement(key, step)}
                    className="p-2 h-8 w-8 bg-white"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={metrics[key]}
                    onChange={(e) => updateMetric(key, parseFloat(e.target.value) || 0)}
                    className="text-center bg-white border-border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncrement(key, step)}
                    className="p-2 h-8 w-8 bg-white"
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
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full mb-6 bg-white border-border">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Inputs & Assumptions
              {isAdvancedOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advancedInputs.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-foreground">{label}</Label>
                  <Input
                    type="number"
                    value={metrics[key]}
                    onChange={(e) => updateMetric(key, parseFloat(e.target.value) || 0)}
                    className="bg-white border-border"
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Value Proposition */}
        <div className="bg-white border border-border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Why Choose RapidClaims AI?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-foreground">99.5% Accuracy Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <span className="text-foreground">10x Faster Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">Reduce Staff by 80%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-foreground">AI-Powered Automation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <span className="text-foreground">Eliminate Claim Denials</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-foreground">Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onCalculateROI} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-semibold rounded-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Get Detailed ROI Report
          </Button>
          
          <Button 
            onClick={handleBookCall}
            variant="outline"
            className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground h-14 text-lg font-semibold rounded-lg bg-white"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book a Call with RapidClaims
          </Button>
          
          <div className="text-center">
            <Button 
              onClick={() => window.open('tel:+1-555-RAPID', '_blank')}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-4 w-4 mr-2" />
              Or call us directly: +1-555-RAPID
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};