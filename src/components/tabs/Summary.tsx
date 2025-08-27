import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Phone, Calendar, Download } from 'lucide-react';

interface SummaryProps {
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
  onCalculateROI: () => void;
  isSignedIn?: boolean;
}

export const Summary = ({ calculations, onCalculateROI, isSignedIn = true }: SummaryProps) => {

  return (
    <>
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Award className="h-5 w-5" />
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Key Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="text-center p-6 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-4xl font-bold text-primary mb-2">
              {calculations.roi.toFixed(1)}%
            </div>
            <div className="text-foreground">ROI</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-success/10 border border-success/20">
            <div className="text-4xl font-bold text-success mb-2">
              ${calculations.executiveSummary.totalImpact.toLocaleString()}
            </div>
            <div className="text-foreground">Total Annual Savings</div>
          </div>
        </div>

        {/* Implementation Investment */}
        <div className="bg-muted rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Implementation Investment</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              ${(calculations.totalOperationalCosts * 0.15).toLocaleString()}
            </div>
            <div className="text-foreground">One-time Setup Cost</div>
            <div className="text-sm text-muted-foreground mt-2">
              Includes training, integration, and first 30 days of support
            </div>
          </div>
        </div>

        {/* Get ROI Report Button */}
        <div className="mb-8">
          <Button 
            onClick={onCalculateROI}
            disabled={!isSignedIn}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-variant hover:from-primary-variant hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5 mr-2" />
            Get Detailed ROI Report
          </Button>
          {!isSignedIn && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Sign in required to generate detailed report
            </p>
          )}
        </div>

        {/* Value Proposition */}
        <div className="bg-muted rounded-lg p-6">
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
      </CardContent>
    </>
  );
};