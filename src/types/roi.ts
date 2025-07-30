export interface ROIMetrics {
  revenueClaimed: number;
  claimsPerAnnum: number;
  chartsProcessedPerAnnum: number;
  numberOfCoders: number;
  salaryPerCoder: number;
  overheadCostPercent: number;
  chartsPerCoderPerDay: number;
  claimDeniedPercent: number;
  costPerDeniedClaim: number;
  codingBacklogPercent: number;
  daysPerChartInBacklog: number;
  costOfCapital: number;
  rvusCodedPerAnnum: number;
  weightedAverageGPCI: number;
  overCodingPercent: number;
  underCodingPercent: number;
  avgBillableCodesPerChart: number;
}