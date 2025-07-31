import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Minus } from 'lucide-react';
import { ROIMetrics } from '../../types/roi';

interface BasicCalculatorProps {
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

export const BasicCalculator = ({ 
  metrics, 
  updateMetric, 
  onCalculateROI,
  calculations 
}: BasicCalculatorProps) => {
  return (
    <>
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calculator className="h-5 w-5" />
          Calculator - Must Have Inputs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Annual Revenue Slider */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Annual Revenue Claimed</h3>
            <Slider
              value={[metrics.revenueClaimed]}
              onValueChange={(value) => updateMetric('revenueClaimed', value[0])}
              max={50000000}
              min={1000000}
              step={100000}
              className="w-full mb-4"
            />
            <div className="text-4xl font-bold text-primary">
              ${(metrics.revenueClaimed / 1000000).toFixed(0)}M
            </div>
            <div className="mt-4">
              <Label htmlFor="revenue-input" className="text-sm text-muted-foreground">Enter exact amount:</Label>
              <Input
                id="revenue-input"
                type="number"
                value={metrics.revenueClaimed}
                onChange={(e) => updateMetric('revenueClaimed', parseInt(e.target.value) || 0)}
                className="mt-2 text-center"
                placeholder="Enter revenue amount"
              />
            </div>
          </div>
        </div>

        {/* ROI Meter */}
        <div className="flex justify-center mb-12">
          <div className="relative w-80 h-48">
            <svg viewBox="0 0 320 200" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 40 160 A 120 120 0 0 1 280 160"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              {/* Progress Arc */}
              <path
                d="M 40 160 A 120 120 0 0 1 280 160"
                fill="none"
                stroke="url(#roiGradient)"
                strokeWidth="8"
                strokeDasharray={`${Math.min(calculations.roi * 3.77, 377)} 377`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--coral))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>
              </defs>
            </svg>
            {/* ROI Text - Smaller and positioned under the curve */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
              <div className="text-3xl font-bold text-primary mb-1">
                {calculations.roi.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground tracking-wider uppercase">ROI</div>
            </div>
            {/* Min/Max Labels */}
            <div className="absolute bottom-4 left-2 text-xs text-muted-foreground">$0M</div>
            <div className="absolute bottom-4 right-2 text-xs text-muted-foreground">$12M</div>
          </div>
        </div>

        {/* Must Have Inputs */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Must Have Inputs</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Number of Coders */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Number of Coders</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMetric('numberOfCoders', Math.max(1, metrics.numberOfCoders - 1))}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={metrics.numberOfCoders}
                  onChange={(e) => updateMetric('numberOfCoders', parseInt(e.target.value) || 1)}
                  className="text-center font-semibold"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMetric('numberOfCoders', metrics.numberOfCoders + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Number of Billers */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Number of Billers</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMetric('numberOfBillers', Math.max(1, metrics.numberOfBillers - 1))}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={metrics.numberOfBillers}
                  onChange={(e) => updateMetric('numberOfBillers', parseInt(e.target.value) || 1)}
                  className="text-center font-semibold"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMetric('numberOfBillers', metrics.numberOfBillers + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Number of Physicians */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Number of Physicians</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMetric('numberOfPhysicians', Math.max(1, metrics.numberOfPhysicians - 1))}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={metrics.numberOfPhysicians}
                  onChange={(e) => updateMetric('numberOfPhysicians', parseInt(e.target.value) || 1)}
                  className="text-center font-semibold"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMetric('numberOfPhysicians', metrics.numberOfPhysicians + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Claims Denied % */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Claims Denied %</Label>
              <div className="space-y-2">
                <Slider
                  value={[metrics.claimDeniedPercent]}
                  onValueChange={(value) => updateMetric('claimDeniedPercent', value[0])}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={metrics.claimDeniedPercent}
                  onChange={(e) => updateMetric('claimDeniedPercent', parseFloat(e.target.value) || 0)}
                  className="text-center font-semibold"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Old vs New Comparison */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Old vs New</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h4 className="text-destructive font-semibold mb-2">Traditional Process</h4>
              <ul className="text-foreground space-y-1 text-sm">
                <li>• {metrics.numberOfCoders} Coders needed</li>
                <li>• Manual billing processes</li>
                <li>• High error rates</li>
                <li>• Slow claim processing</li>
              </ul>
            </div>
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <h4 className="text-success font-semibold mb-2">With RapidClaims AI</h4>
              <ul className="text-foreground space-y-1 text-sm">
                <li>• Only 2 coders needed</li>
                <li>• Automated billing</li>
                <li>• 99.5% accuracy</li>
                <li>• 10x faster processing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="mt-8">
          <Button 
            onClick={onCalculateROI} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-semibold rounded-lg"
          >
            Calculate Full ROI Analysis
          </Button>
        </div>
      </CardContent>
    </>
  );
};