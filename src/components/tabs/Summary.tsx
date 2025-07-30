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
}

export const Summary = ({ calculations, onCalculateROI }: SummaryProps) => {
  const handleBookCall = () => {
    window.open('https://calendly.com/rapidclaims', '_blank');
  };

  return (
    <>
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="flex items-center gap-2 text-white">
          <Award className="h-5 w-5" />
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Key Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-6 rounded-lg bg-purple-800/50 border border-purple-600">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {calculations.roi.toFixed(1)}%
            </div>
            <div className="text-gray-300">ROI</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-green-800/50 border border-green-600">
            <div className="text-4xl font-bold text-green-400 mb-2">
              ${calculations.executiveSummary.totalImpact.toLocaleString()}
            </div>
            <div className="text-gray-300">Total Annual Savings</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-blue-800/50 border border-blue-600">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              ${(calculations.executiveSummary.totalImpact / 12).toLocaleString()}
            </div>
            <div className="text-gray-300">Monthly Savings</div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gray-800/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Why Choose RapidClaims AI?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">99.5% Accuracy Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">10x Faster Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Reduce Staff by 80%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">AI-Powered Automation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-gray-300">Eliminate Claim Denials</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onCalculateROI} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-14 text-lg font-semibold rounded-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Get Detailed ROI Report
          </Button>
          
          <Button 
            onClick={handleBookCall}
            variant="outline"
            className="w-full border-2 border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white h-14 text-lg font-semibold rounded-lg"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book a Call with RapidClaims
          </Button>
          
          <div className="text-center">
            <Button 
              onClick={() => window.open('tel:+1-555-RAPID', '_blank')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Or call us directly: +1-555-RAPID
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};