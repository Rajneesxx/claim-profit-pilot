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
          <span className="font-semibold text-primary">Instant Insights. Real ROI.</span>
          <br />
          RapidROI helps you calculate the impact of using RapidClaims across your claims workflow. Enter basic data like annual revenue, claims denied, and headcount to get a clear breakdown of potential time savings, cost reductions, and efficiency gains.
          <br /><br />
          The tool runs the numbers in real-time; no setup, no hassle - so you can quickly assess how automation could improve your bottom line.
        </p>
      </div>


  );
};