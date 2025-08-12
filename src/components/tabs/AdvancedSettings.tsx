import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { ROIMetrics } from "../../types/roi";
import { useState, useEffect, useRef } from "react";

interface AdvancedSettingsProps {
  metrics: ROIMetrics;
  updateMetric: (key: keyof ROIMetrics, value?: number) => void; // value optional for clearing
}

export const AdvancedSettings = ({ metrics, updateMetric }: AdvancedSettingsProps) => {
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Initialize values from metrics only once on mount
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === "number" && value > 0) {
        initialValues[key] = value.toLocaleString("en-US");
      } else {
        initialValues[key] = "";
      }
    });
    setLocalValues(initialValues);
  }, [metrics]);

  // Change handler: allow digits and commas only, no formatting here
  const handleChange = (fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Allow empty string
    if (val === "") {
      setLocalValues((prev) => ({ ...prev, [fieldKey]: "" }));
      return;
    }

    // Allow digits and commas only
    if (/^[\d,]+$/.test(val)) {
      setLocalValues((prev) => ({ ...prev, [fieldKey]: val }));
    }
    // else ignore input (do nothing)
  };

  // Blur handler: parse, format, and update metric
  const handleBlur = (fieldKey: string) => {
    const rawVal = localValues[fieldKey]?.replace(/,/g, "") || "";

    if (rawVal === "") {
      // Clear metric value if input empty
      updateMetric(fieldKey as keyof ROIMetrics);
      return;
    }

    const numericValue = parseInt(rawVal, 10);
    if (isNaN(numericValue)) {
      updateMetric(fieldKey as keyof ROIMetrics);
      return;
    }

    // Format with commas and update local input display
    const formatted = numericValue.toLocaleString("en-US");
    setLocalValues((prev) => ({ ...prev, [fieldKey]: formatted }));

    // Update metric value as number
    updateMetric(fieldKey as keyof ROIMetrics, numericValue);
  };

  const fieldSections = [
    {
      title: "Aggregate Claims Data",
      fields: [
        {
          key: "revenueClaimed",
          label: "Revenue - claimed",
          type: "currency",
          description:
            "Total revenue from claims to both private and public insurers. An average of last 2 years revenue or a 12x multiple of average of last 3 month revenue can be provided",
        },
        {
          key: "claimsPerAnnum",
          label: "# claims per annum",
          type: "number",
          description:
            "Number of claims raised. Each claim can have multiple charts associated with it. An average of last 2 years revenue or a 12x multiple of average of last 3 month revenue can be provided",
        },
        {
          key: "averageCostPerClaim",
          label: "Average cost per claim",
          type: "currency",
          description: "Average charge per claim",
        },
        {
          key: "chartsProcessedPerAnnum",
          label: "# charts processed per annum",
          type: "number",
          description: "Number of charts/lab reports/other reports processed over a period of 12 months",
        },
      ],
    },
    // add other sections as needed...
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
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">{section.title}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-foreground font-medium">
                      {field.label}
                    </Label>
                    <input
                      id={field.key}
                      ref={(el) => (inputRefs.current[field.key] = el)}
                      type="text"               // <-- Use text here
                      inputMode="numeric"       // <-- for numeric keyboard on mobile
                      value={localValues[field.key] ?? ""}
                      onChange={(e) => handleChange(field.key, e)}
                      onBlur={() => handleBlur(field.key)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
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

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Increase in RVUs</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Case 1: Nephrology center identifies incremental opportunity with &gt; 95% of level 3s to be identified as level 4s</p>
                <p className="text-muted-foreground">1. E&M scoring module</p>
                <div className="mt-2">
                  <span className="text-primary font-medium">0.1% - 0.5% - 1.5% improvement range</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};
