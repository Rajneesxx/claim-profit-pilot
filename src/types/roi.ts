export interface ROIMetrics {
  // Basic inputs
  revenueClaimed: number;
  numberOfCoders: number;
  numberOfBillers: number;
  numberOfPhysicians: number;
  claimDeniedPercent: number;

  // Advanced inputs - Aggregate claims data
  claimsPerAnnum: number;
  averageCostPerClaim: number;
  chartsProcessedPerAnnum: number;

  // Coding costs
  salaryPerCoder: number;
  overheadCostPercent: number;
  numberOfEncoderLicenses: number;
  averageCostPerLicensePerMonth: number;
  salaryPerBiller: number;
  salaryPerPhysician: number;
  avgTimePerPhysicianPerChart: number;
  avgTimePerCoderPerChart: number;
  chartsPerCoderPerDay: number;

  // Collection costs
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


  percentOverCodedCharts: number;     // e.g. 0.8 for 80%
 percentReductionNCCI: number;       // e.g. 0.67 for 67%
 complianceCostPerCode: number;      // e.g. 1500
}
