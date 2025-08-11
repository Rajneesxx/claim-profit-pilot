import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from 'lucide-react';
import { ROIMetrics } from '../../types/roi';
import { useState, useEffect } from 'react';

interface AdvancedSettingsProps {
  metrics: ROIMetrics;
  updateMetric: (key: keyof ROIMetrics, value: number) => void;
}

export const AdvancedSettings = ({ metrics, updateMetric }: AdvancedSettingsProps) => {
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize values only once when component mounts
  useEffect(() => {
    if (!hasInitialized) {
      const initialValues: Record<string, string> = {};
      // Start with completely empty values
      setLocalValues(initialValues);
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  const fieldSections = [
    {
      title: "Aggregate Claims Data",
      fields: [
        { key: 'revenueClaimed', label: 'Revenue - claimed', type: 'currency', description: 'Total revenue from claims to both private and public insurers. An average of last 2 years revenue or a 12x multiple of average of last 3 month revenue can be provided' },
        { key: 'claimsPerAnnum', label: '# claims per annum', type: 'number', description: 'Number of claims raised. Each claim can have multiple charts associated with it. An average of last 2 years revenue or a 12x multiple of average of last 3 month revenue can be provided' },
        { key: 'averageCostPerClaim', label: 'Average cost per claim', type: 'currency', description: 'Average charge per claim' },
        { key: 'chartsProcessedPerAnnum', label: '# charts processed per annum', type: 'number', description: 'Number of charts/lab reports/other reports processed over a period of 12 months' },
      ]
    },
    {
      title: "Coding Costs",
      fields: [
        { key: 'numberOfCoders', label: 'Number of coders', type: 'number', description: 'Number of coders active at present whose major job is coding' },
        { key: 'salaryPerCoder', label: 'Average salary per coder per annum', type: 'currency', description: 'Average annual salary per coder. Please consider all the allied benefits/bonuses and other payouts made to the coder' },
        { key: 'overheadCostPercent', label: '% overhead cost per coder - Office, benefits, management', type: 'percent', description: 'Overhead costs like technology costs, real estate costs, office admin costs, HR related costs should be considered' },
        { key: 'numberOfEncoderLicenses', label: 'Number of encoder licenses', type: 'number', description: 'Total active seats for the coding‑encoder platform' },
        { key: 'averageCostPerLicensePerMonth', label: 'Average cost per license per month per seat', type: 'currency', description: 'Monthly subscription fee for one encoder seat; exclude one‑time implementation costs' },
        { key: 'numberOfBillers', label: 'Number of billers', type: 'number', description: 'FTEs doing follow‑up and collections' },
        { key: 'salaryPerBiller', label: 'Average salary per biller per annum', type: 'currency', description: 'Average annual salary per biller. Please consider all the allied benefits/bonuses and other payouts made to the biller' },
        { key: 'numberOfPhysicians', label: 'Number of physicians', type: 'number', description: 'Employed or contracted clinicians whose charts you bill' },
        { key: 'salaryPerPhysician', label: 'Average pay per physician per annum', type: 'currency', description: 'Average annual salary per physician. Please consider all the allied benefits/bonuses and other payouts made to the physician' },
        { key: 'avgTimePerPhysicianPerChart', label: 'Average time spent per physician per chart per day on medical coding', type: 'number', description: 'Minutes each physician spends per chart on medical coding' },
        { key: 'chartsPerCoderPerDay', label: '# charts processed by coder per day', type: 'number', description: 'Average number of charts a coder processes over a period of 8 hrs of coding effort' },
      ]
    },
    {
      title: "Collection Costs",
      fields: [
        { key: 'claimDeniedPercent', label: '% claims denied', type: 'percent', description: 'Claims denied %. An average of past 3 years or average of past 3 billing cycles * (360/cycle length in days) should be considered' },
        { key: 'costPerDeniedClaim', label: 'Cost per denied claim', type: 'currency', description: 'Cost to collect include salary expenses, AR calling expenses, technology expenses and other allied expenses / total number of claims denied' },
      ]
    },
    {
      title: "Capital Costs",
      fields: [
        { key: 'codingBacklogPercent', label: '% coding backlog', type: 'percent', description: 'Percentage of charts which are yet to bill' },
        { key: 'daysPerChartInBacklog', label: 'Number of days per chart in backlog', type: 'number', description: 'Average number of days a chart spends in backlog' },
        { key: 'costOfCapital', label: 'Cost of capital', type: 'percent', description: 'Present cost of capital for the organisation' },
      ]
    },
    {
      title: "RVUs",
      fields: [
        { key: 'rvusCodedPerAnnum', label: '# RVUs coded per annum', type: 'number', description: 'Overall billing value recognised from E&M coding' },
        { key: 'weightedAverageGPCI', label: 'Weighted average GPCI', type: 'decimal', description: 'Present score of E&M billing' },
      ]
    },
    {
      title: "Audit Data",
      fields: [
        { key: 'overCodingPercent', label: '% charts with over coding', type: 'percent', description: 'Average % of charts with over coding issues - based on audit findings' },
        { key: 'underCodingPercent', label: '% charts with undercoding', type: 'percent', description: 'Average % of charts with under coding issues - based on audit findings' },
        { key: 'avgBillableCodesPerChart', label: 'Average number of billable codes per chart', type: 'number', description: 'Average number of procedures and diagnoses per progress note that can contribute to potential claim denial' },
      ]
    }
  ];

  return (
    <>
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Settings className="h-5 w-5" />
          Advanced Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {fieldSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-foreground font-medium">
                      {field.label}
                    </Label>
  <input
  id={field.key}
  type="text"
  inputMode="numeric"
  value={localValues[field.key] === 0 || localValues[field.key] === '' 
    ? '' 
    : Number(localValues[field.key]).toLocaleString('en-US')}
  onChange={(e) => {
    let newValue = e.target.value;

    // Allow empty string
    if (newValue === '') {
      setLocalValues(prev => ({ ...prev, [field.key]: '' }));
      return;
    }

    // Remove commas for processing
    newValue = newValue.replace(/,/g, '');

    // Only digits allowed
    if (!/^\d+$/.test(newValue)) {
      // Ignore invalid input (or optionally handle partial input)
      return;
    }

    // Strip leading zeros by parsing to int
    newValue = String(parseInt(newValue, 10));

    setLocalValues(prev => ({ ...prev, [field.key]: newValue }));
  }}
  onBlur={() => {
    // Get numeric value from localValues (handle empty or invalid)
    let rawValue = localValues[field.key] || '';
    rawValue = rawValue.toString().replace(/,/g, '');

    let finalValue = parseInt(rawValue, 10);
    if (isNaN(finalValue)) finalValue = 0;
    // Update the metric with numeric value
    updateMetric(field.key as keyof ROIMetrics, finalValue);

    // Update localValues to formatted value on blur
    setLocalValues(prev => ({
      ...prev,
      [field.key]: finalValue === 0 ? '' : finalValue.toLocaleString('en-US'),
    }));
  }}
  style={{
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  }}
/>


                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Levers Section */}
        <div className="mt-12 space-y-6">
          <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
            RapidClaims AI Impact Levers
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Coder Productivity</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Case 1: Primary care center improves coding productivity per coder by 90%</p>
                <p className="text-muted-foreground">Case 2: RCM provider improves coder productivity by 120%</p>
                <div className="mt-2">
                  <span className="text-primary font-medium">40% - 80% - 300% improvement range</span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Billing Automation</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Clinic replaced manual charge entry; 40% fewer billing FTEs</p>
                <div className="mt-2">
                  <span className="text-primary font-medium">50% - 70% - 120% improvement range</span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Physician Time Saved</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Clinic cut chart‑related physician queries by 30% in 6 months</p>
                <div className="mt-2">
                  <span className="text-primary font-medium">30% - 50% - 70% improvement range</span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Technology Cost Saved</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Health system retired legacy encoder; USD 150k license cost removed</p>
                <div className="mt-2">
                  <span className="text-primary font-medium">50% - 70% - 100% improvement range</span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Claim Denial Reduction</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">MSO managing primary care center sees 15% reduction in claim denials</p>
                <div className="mt-2">
                  <span className="text-primary font-medium">30% - 50% - 70% improvement range</span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Coding Backlog Elimination</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">ASC clinic eliminates code backlog from 28% to 0%</p>
                <div className="mt-2">
                  <span className="text-primary font-medium">60% - 80% - 100% improvement range</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};
