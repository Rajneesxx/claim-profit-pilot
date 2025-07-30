import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from 'lucide-react';
import { ROIMetrics } from '../../types/roi';

interface AdvancedSettingsProps {
  metrics: ROIMetrics;
  updateMetric: (key: keyof ROIMetrics, value: number) => void;
}

export const AdvancedSettings = ({ metrics, updateMetric }: AdvancedSettingsProps) => {
  const advancedFields = [
    { key: 'claimsPerAnnum', label: 'Claims Per Annum', type: 'number' },
    { key: 'chartsProcessedPerAnnum', label: 'Charts Processed Per Annum', type: 'number' },
    { key: 'salaryPerCoder', label: 'Salary Per Coder', type: 'currency' },
    { key: 'overheadCostPercent', label: 'Overhead Cost %', type: 'percent' },
    { key: 'chartsPerCoderPerDay', label: 'Charts Per Coder Per Day', type: 'number' },
    { key: 'costPerDeniedClaim', label: 'Cost Per Denied Claim', type: 'currency' },
    { key: 'codingBacklogPercent', label: 'Coding Backlog %', type: 'percent' },
    { key: 'daysPerChartInBacklog', label: 'Days Per Chart In Backlog', type: 'number' },
    { key: 'costOfCapital', label: 'Cost of Capital %', type: 'percent' },
    { key: 'rvusCodedPerAnnum', label: 'RVUs Coded Per Annum', type: 'number' },
    { key: 'weightedAverageGPCI', label: 'Weighted Average GPCI', type: 'decimal' },
    { key: 'overCodingPercent', label: 'Over Coding %', type: 'percent' },
    { key: 'underCodingPercent', label: 'Under Coding %', type: 'percent' },
    { key: 'avgBillableCodesPerChart', label: 'Avg Billable Codes Per Chart', type: 'number' },
  ];

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return value.toString();
      case 'percent':
      case 'decimal':
        return value.toString();
      default:
        return value.toString();
    }
  };

  return (
    <>
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5" />
          Advanced Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-gray-300">
                {field.label}
              </Label>
              <Input
                id={field.key}
                type="number"
                value={formatValue(metrics[field.key as keyof ROIMetrics], field.type)}
                onChange={(e) => updateMetric(field.key as keyof ROIMetrics, parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-600 text-white"
                step={field.type === 'decimal' ? '0.01' : '1'}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};