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

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">AI-Powered Coding</h3>
              <p className="text-sm text-muted-foreground">Automated medical coding with 99%+ accuracy</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Revenue Optimization</h3>
              <p className="text-sm text-muted-foreground">Increase revenue through improved coding accuracy</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Compliance Assurance</h3>
              <p className="text-sm text-muted-foreground">Reduce audit risks and ensure regulatory compliance</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Staff Efficiency</h3>
              <p className="text-sm text-muted-foreground">Free up your team for high-value activities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">✨ 250+ healthcare organizations trust RapidClaims</span>
        </div>
      </div>
    </div>
  );
};