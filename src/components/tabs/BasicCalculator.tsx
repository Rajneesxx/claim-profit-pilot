import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
                strokeDasharray={`${Math.min(calculations.roi * 3.77, 377)} 377`}
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
                {calculations.roi.toFixed(2)}%
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

        {/* Old vs New Comparison */}
        <div className="bg-gray-800/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Old vs New</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">Traditional Process</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• {metrics.numberOfCoders} Coders needed</li>
                <li>• Manual billing processes</li>
                <li>• High error rates</li>
                <li>• Slow claim processing</li>
              </ul>
            </div>
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">With RapidClaims AI</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
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
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-14 text-lg font-semibold rounded-lg"
          >
            Calculate Full ROI Analysis
          </Button>
        </div>
      </CardContent>
    </>
  );
};