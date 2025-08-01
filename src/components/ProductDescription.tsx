import { Shield, Zap, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ProductDescription = () => {
  return (
    <div className="mb-8 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <img 
            src="/src/assets/rapidclaims-logo.png" 
            alt="RapidClaims" 
            className="h-8 w-auto"
          />
          <h1 className="text-3xl font-bold">RapidROI by RapidClaims</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover the transformative power of AI-driven medical coding automation. 
          Calculate your potential savings, revenue increases, and risk reduction with our comprehensive ROI analyzer.
        </p>
      </div>


      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">✨ 250+ healthcare organizations trust RapidClaims</span>
        </div>
      </div>
    </div>
  );
};