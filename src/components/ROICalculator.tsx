import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from './MetricCard';
import { 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Calculator,
  Target
} from 'lucide-react';

interface ROIMetrics {
  // Aggregate claim data
  revenueClaimed: number;
  claimsPerAnnum: number;
  chartsProcessedPerAnnum: number;
  
  // Coding costs
  numberOfCoders: number;
  salaryPerCoder: number;
  overheadCostPercent: number;
  chartsPerCoderPerDay: number;
  
  // Collection cost
  claimDeniedPercent: number;
  costPerDeniedClaim: number;
  
  // Capital costs
  codingBacklogPercent: number;
  daysPerChartInBacklog: number;
  costOfCapital: number;
  
  // RVUs
  rvusCodedPerAnnum: number;
  weightedAverageGPCI: number;
  
  // Audit data
  overCodingPercent: number;
  underCodingPercent: number;
  avgBillableCodesPerChart: number;
}

export const ROICalculator = () => {
  const [metrics, setMetrics] = useState<ROIMetrics>({
    revenueClaimed: 23000000,
    claimsPerAnnum: 42700,
    chartsProcessedPerAnnum: 42700,
    numberOfCoders: 10,
    salaryPerCoder: 60000,
    overheadCostPercent: 38,
    chartsPerCoderPerDay: 17,
    claimDeniedPercent: 25,
    costPerDeniedClaim: 42,
    codingBacklogPercent: 5,
    daysPerChartInBacklog: 20,
    costOfCapital: 5,
    rvusCodedPerAnnum: 718750,
    weightedAverageGPCI: 1.03,
    overCodingPercent: 13,
    underCodingPercent: 10,
    avgBillableCodesPerChart: 4
  });

  const updateMetric = (key: keyof ROIMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  // ROI Calculations
  const totalCodingCosts = metrics.numberOfCoders * metrics.salaryPerCoder * (1 + metrics.overheadCostPercent / 100);
  const deniedClaimsCost = (metrics.claimsPerAnnum * metrics.claimDeniedPercent / 100) * metrics.costPerDeniedClaim;
  const backlogCost = (metrics.chartsProcessedPerAnnum * metrics.codingBacklogPercent / 100 * metrics.daysPerChartInBacklog * metrics.costOfCapital / 100) / 365;
  const totalOperationalCosts = totalCodingCosts + deniedClaimsCost + backlogCost;
  const roi = ((metrics.revenueClaimed - totalOperationalCosts) / totalOperationalCosts) * 100;
  const efficiencyRatio = metrics.chartsProcessedPerAnnum / (metrics.numberOfCoders * 250 * metrics.chartsPerCoderPerDay);

  // Executive Summary Calculations based on provided formulas
  
  // Reduced Cost calculations
  const coderProductivitySaving = metrics.chartsProcessedPerAnnum * 0.5 * (8 / metrics.chartsPerCoderPerDay) * (metrics.salaryPerCoder / (250 * 8)); // Assuming 50% productivity improvement
  const claimDenialReduction = metrics.claimsPerAnnum * (metrics.claimDeniedPercent / 100) * 0.5 * metrics.costPerDeniedClaim; // 50% reduction in denials
  const backlogReduction = metrics.chartsProcessedPerAnnum * (metrics.codingBacklogPercent / 100) * 0.8 * metrics.daysPerChartInBacklog * (metrics.costOfCapital / 100) / 365; // 80% reduction in backlog
  const reducedCost = coderProductivitySaving + claimDenialReduction + backlogReduction;
  
  // Increased Revenue calculations
  const rvuImprovement = metrics.rvusCodedPerAnnum * 0.01 * metrics.weightedAverageGPCI * 36; // 1% improvement with $36 conversion factor
  const increaseRevenue = rvuImprovement;
  
  // Reduced Risk calculations
  const overcodingRiskReduction = metrics.chartsProcessedPerAnnum * (metrics.overCodingPercent / 100) * 1.0 * 100; // $100 compliance cost per overcoded chart
  const reducedRisk = overcodingRiskReduction;
  
  const totalImpact = reducedCost + increaseRevenue + reducedRisk;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-info text-primary-foreground">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Healthcare Coding ROI Calculator</h1>
          </div>
          <p className="text-lg opacity-90">
            Analyze and optimize your medical coding operations with comprehensive metrics
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* ROI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {roi.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Claimed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                ${metrics.revenueClaimed.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Operational Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                ${totalOperationalCosts.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info flex items-center gap-2">
                <Target className="h-5 w-5" />
                {(efficiencyRatio * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <BarChart3 className="h-6 w-6" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Reduced Cost</h4>
                <div className="text-2xl font-bold text-success">
                  $642,194
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left space-y-1">
                  <p>1. Reduced cost of coding a chart because of the improved coder productivity</p>
                  <p>2. 0 coding errors with AI coding to reduce cost to collect</p>
                  <p>3. Reduced cost of capital with lower A/R days</p>
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Increased Revenue</h4>
                <div className="text-2xl font-bold text-primary">
                  $241,939
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left space-y-1">
                  <p>1. CDI solution helps identify opportunities missed by manual coders/physicians in HCC coding and hence improving the overall RAF score</p>
                  <p>2. AI based E&M coding proven to improve E&M score</p>
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-info/10 to-info/5 border border-info/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Reduced Risk</h4>
                <div className="text-2xl font-bold text-info">
                  $70,775
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left space-y-1">
                  <p>1. RapidCode follows all the coding guidelines and flags any place where the guidelines are not followed</p>
                  <p>2. This ensures lower probability of audits and costs</p>
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Impact</h4>
                <div className="text-2xl font-bold text-warning">
                  $954,908
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-left">
                  <p>Total expected impact for 12 months after 100% adoption. Gains from pilot stage to pre full-adoption time is not included in the impact estimation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value Calculator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Calculator className="h-6 w-6" />
              Value Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 bg-muted font-semibold">Sub-metric</th>
                    <th className="text-left p-3 bg-muted font-semibold">Impact Metric</th>
                    <th className="text-left p-3 bg-muted font-semibold">Description</th>
                    <th className="text-left p-3 bg-muted font-semibold">Baseline</th>
                    <th className="text-left p-3 bg-muted font-semibold">Expected Impact Level</th>
                    <th className="text-left p-3 bg-muted font-semibold">Delta in Value</th>
                    <th className="text-left p-3 bg-muted font-semibold">New Level</th>
                    <th className="text-left p-3 bg-muted font-semibold">Calculation for Financial Impact</th>
                    <th className="text-left p-3 bg-muted font-semibold">Financial Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Cost Reduction Section */}
                  <tr className="border-b bg-primary/5">
                    <td colSpan={9} className="p-3 font-semibold text-primary">Cost Reduction</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">Coder productivity</td>
                    <td className="p-3">Cost</td>
                    <td className="p-3 text-sm">Coder productivity is increased through high percentage of autonomous coding and very low work for other charts which require audit</td>
                    <td className="p-3">17 charts/day</td>
                    <td className="p-3"><Badge className="bg-success text-white">High</Badge></td>
                    <td className="p-3">100%</td>
                    <td className="p-3">34 charts/day</td>
                    <td className="p-3 text-sm">Number of charts processed per annum x (Incremental productivity/(1+Incremental productivity)) x Time to code a chart x cost per coder per hour</td>
                    <td className="p-3 font-semibold text-success">$414,000</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">Claim denial percentage</td>
                    <td className="p-3">Cost</td>
                    <td className="p-3 text-sm">Claim denials are reduced by customizing the coding by the payer and by the physician through our proprietary AI coding workflows</td>
                    <td className="p-3">25%</td>
                    <td className="p-3"><Badge className="bg-success text-white">High</Badge></td>
                    <td className="p-3">50%</td>
                    <td className="p-3">13%</td>
                    <td className="p-3 text-sm">Number of claims x % claims denied x % reduction in denied claims x cost per denied claim</td>
                    <td className="p-3 font-semibold text-success">$225,000</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">A/R days</td>
                    <td className="p-3">Cost</td>
                    <td className="p-3 text-sm">Time from visit to bill can be reduced to 6 days with high autonomous coding</td>
                    <td className="p-3">5%</td>
                    <td className="p-3"><Badge className="bg-success text-white">High</Badge></td>
                    <td className="p-3">100%</td>
                    <td className="p-3">0%</td>
                    <td className="p-3 text-sm">Number of charts processed per annum x Average value per chart x % coding backlog x Average number of backlog days x Reduction % x Cost of capital/360</td>
                    <td className="p-3 font-semibold text-success">$3,194</td>
                  </tr>
                  
                  {/* Revenue Increase Section */}
                  <tr className="border-b bg-primary/5">
                    <td colSpan={9} className="p-3 font-semibold text-primary">Revenue Increase</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">RVUs</td>
                    <td className="p-3">Revenue</td>
                    <td className="p-3 text-sm">E&M scores can be improved with our proprietary E&M coding AI to scan through all the data seamlessly to optimize the E&M code</td>
                    <td className="p-3">718,750.00</td>
                    <td className="p-3"><Badge className="bg-warning text-white">Medium</Badge></td>
                    <td className="p-3">1.0%</td>
                    <td className="p-3">725,937.50</td>
                    <td className="p-3 text-sm">Number of RVUs billed x % increment in RVUs x Wt. Avg GPCI x Conversion</td>
                    <td className="p-3 font-semibold text-primary">$241,939</td>
                  </tr>
                  
                  {/* Risk Reduction Section */}
                  <tr className="border-b bg-primary/5">
                    <td colSpan={9} className="p-3 font-semibold text-primary">Risk Reduction</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">% charts with overcoding</td>
                    <td className="p-3">Risk</td>
                    <td className="p-3 text-sm">Reduce over coding by applying NCCI edits on the coded charts</td>
                    <td className="p-3">1,388</td>
                    <td className="p-3"><Badge className="bg-success text-white">High</Badge></td>
                    <td className="p-3">100%</td>
                    <td className="p-3">0</td>
                    <td className="p-3 text-sm">Number of charts per annum x % over coded charts x % reduction in overcoded charts x Compliance cost per code</td>
                    <td className="p-3 font-semibold text-info">$70,775</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-gradient-to-r from-primary/10 to-secondary/10">
                    <td colSpan={8} className="p-4 font-bold text-lg">Total Cost Impact</td>
                    <td className="p-4 font-bold text-lg text-primary">$642,194</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <td colSpan={8} className="p-4 font-bold text-lg">Total Revenue Impact</td>
                    <td className="p-4 font-bold text-lg text-primary">$241,939</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <td colSpan={8} className="p-4 font-bold text-lg">Total Risk Impact</td>
                    <td className="p-4 font-bold text-lg text-primary">$70,775</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <MetricCard
            title="Aggregate Claim Data"
            icon={<BarChart3 className="h-5 w-5" />}
            fields={[
              {
                id: 'revenueClaimed',
                label: 'Revenue Claimed',
                type: 'number',
                value: metrics.revenueClaimed,
                onChange: (value) => updateMetric('revenueClaimed', value),
                prefix: '$'
              },
              {
                id: 'claimsPerAnnum',
                label: 'Claims per Annum',
                type: 'number',
                value: metrics.claimsPerAnnum,
                onChange: (value) => updateMetric('claimsPerAnnum', value)
              },
              {
                id: 'chartsProcessedPerAnnum',
                label: 'Charts Processed per Annum',
                type: 'number',
                value: metrics.chartsProcessedPerAnnum,
                onChange: (value) => updateMetric('chartsProcessedPerAnnum', value)
              }
            ]}
          />

          <MetricCard
            title="Coding Costs"
            icon={<Users className="h-5 w-5" />}
            fields={[
              {
                id: 'numberOfCoders',
                label: 'Number of Coders',
                type: 'number',
                value: metrics.numberOfCoders,
                onChange: (value) => updateMetric('numberOfCoders', value)
              },
              {
                id: 'salaryPerCoder',
                label: 'Salary per Coder (Annual)',
                type: 'number',
                value: metrics.salaryPerCoder,
                onChange: (value) => updateMetric('salaryPerCoder', value),
                prefix: '$'
              },
              {
                id: 'overheadCostPercent',
                label: 'Overhead Cost per Coder',
                type: 'percentage',
                value: metrics.overheadCostPercent,
                onChange: (value) => updateMetric('overheadCostPercent', value),
                suffix: '%'
              },
              {
                id: 'chartsPerCoderPerDay',
                label: 'Charts Processed per Coder per Day',
                type: 'number',
                value: metrics.chartsPerCoderPerDay,
                onChange: (value) => updateMetric('chartsPerCoderPerDay', value)
              }
            ]}
          />

          <MetricCard
            title="Collection Costs"
            icon={<AlertTriangle className="h-5 w-5" />}
            fields={[
              {
                id: 'claimDeniedPercent',
                label: 'Claims Denied',
                type: 'percentage',
                value: metrics.claimDeniedPercent,
                onChange: (value) => updateMetric('claimDeniedPercent', value),
                suffix: '%'
              },
              {
                id: 'costPerDeniedClaim',
                label: 'Cost per Denied Claim',
                type: 'number',
                value: metrics.costPerDeniedClaim,
                onChange: (value) => updateMetric('costPerDeniedClaim', value),
                prefix: '$'
              }
            ]}
          />

          <MetricCard
            title="Capital Costs"
            icon={<TrendingUp className="h-5 w-5" />}
            fields={[
              {
                id: 'codingBacklogPercent',
                label: 'Coding Backlog',
                type: 'percentage',
                value: metrics.codingBacklogPercent,
                onChange: (value) => updateMetric('codingBacklogPercent', value),
                suffix: '%'
              },
              {
                id: 'daysPerChartInBacklog',
                label: 'Days per Chart in Backlog',
                type: 'number',
                value: metrics.daysPerChartInBacklog,
                onChange: (value) => updateMetric('daysPerChartInBacklog', value)
              },
              {
                id: 'costOfCapital',
                label: 'Cost of Capital',
                type: 'percentage',
                value: metrics.costOfCapital,
                onChange: (value) => updateMetric('costOfCapital', value),
                suffix: '%'
              }
            ]}
          />

          <MetricCard
            title="RVU Data"
            icon={<DollarSign className="h-5 w-5" />}
            fields={[
              {
                id: 'rvusCodedPerAnnum',
                label: 'RVUs Coded per Annum',
                type: 'number',
                value: metrics.rvusCodedPerAnnum,
                onChange: (value) => updateMetric('rvusCodedPerAnnum', value)
              },
              {
                id: 'weightedAverageGPCI',
                label: 'Weighted Average GPCI',
                type: 'number',
                value: metrics.weightedAverageGPCI,
                onChange: (value) => updateMetric('weightedAverageGPCI', value)
              }
            ]}
          />

          <MetricCard
            title="Audit Data"
            icon={<FileText className="h-5 w-5" />}
            fields={[
              {
                id: 'overCodingPercent',
                label: 'Charts with Over-coding',
                type: 'percentage',
                value: metrics.overCodingPercent,
                onChange: (value) => updateMetric('overCodingPercent', value),
                suffix: '%'
              },
              {
                id: 'underCodingPercent',
                label: 'Charts with Under-coding',
                type: 'percentage',
                value: metrics.underCodingPercent,
                onChange: (value) => updateMetric('underCodingPercent', value),
                suffix: '%'
              },
              {
                id: 'avgBillableCodesPerChart',
                label: 'Avg Billable Codes per Chart',
                type: 'number',
                value: metrics.avgBillableCodesPerChart,
                onChange: (value) => updateMetric('avgBillableCodesPerChart', value)
              }
            ]}
          />
        </div>

        {/* Cost Breakdown */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cost Breakdown Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-muted-foreground">Coding Costs</h4>
                <div className="text-2xl font-bold text-primary">
                  ${totalCodingCosts.toLocaleString()}
                </div>
                <Badge variant="secondary">
                  {((totalCodingCosts / totalOperationalCosts) * 100).toFixed(1)}% of total
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-muted-foreground">Denied Claims Cost</h4>
                <div className="text-2xl font-bold text-destructive">
                  ${deniedClaimsCost.toLocaleString()}
                </div>
                <Badge variant="secondary">
                  {((deniedClaimsCost / totalOperationalCosts) * 100).toFixed(1)}% of total
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-muted-foreground">Backlog Cost</h4>
                <div className="text-2xl font-bold text-warning">
                  ${backlogCost.toLocaleString()}
                </div>
                <Badge variant="secondary">
                  {((backlogCost / totalOperationalCosts) * 100).toFixed(1)}% of total
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};