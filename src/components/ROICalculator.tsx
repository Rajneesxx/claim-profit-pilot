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
    revenueClaimed: 1000000,
    claimsPerAnnum: 10000,
    chartsProcessedPerAnnum: 15000,
    numberOfCoders: 5,
    salaryPerCoder: 65000,
    overheadCostPercent: 25,
    chartsPerCoderPerDay: 30,
    claimDeniedPercent: 8,
    costPerDeniedClaim: 150,
    codingBacklogPercent: 15,
    daysPerChartInBacklog: 5,
    costOfCapital: 8,
    rvusCodedPerAnnum: 50000,
    weightedAverageGPCI: 1.2,
    overCodingPercent: 3,
    underCodingPercent: 5,
    avgBillableCodesPerChart: 4.5
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

        {/* Metric Input Cards */}
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