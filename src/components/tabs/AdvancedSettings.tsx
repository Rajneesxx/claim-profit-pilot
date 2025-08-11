import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { ROIMetrics } from "../../types/roi";
import { useState, useEffect, useRef } from "react";

interface AdvancedSettingsProps {
  metrics: ROIMetrics;
  updateMetric: (key: keyof ROIMetrics, value: number) => void;
}

export const AdvancedSettings = ({ metrics, updateMetric }: AdvancedSettingsProps) => {
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Initialize localValues from metrics with formatted strings whenever metrics change
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    Object.entries(metrics).forEach(([key, value]) => {
      // Only update if we don't have a local value or if the field has a meaningful value
      if (localValues[key] === undefined || (typeof value === "number" && value > 0)) {
        if (typeof value === "number" && value !== 0) {
          initialValues[key] = value.toLocaleString("en-US");
        } else {
          initialValues[key] = "";
        }
      } else {
        // Keep existing local value to preserve user input state
        initialValues[key] = localValues[key] || "";
      }
    });
    setLocalValues(initialValues);
  }, [metrics]);

  const formatWithCommas = (val: string) => {
    if (!val) return "";
    const num = parseInt(val.replace(/,/g, ""), 10);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US");
  };

  const handleChange = (fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let val = input.value;

    // Save cursor position relative to right end
    const cursorPosFromEnd = val.length - (input.selectionStart ?? val.length);

    // Remove commas
    let digitsOnly = val.replace(/,/g, "");

    // Allow empty input
    if (digitsOnly === "") {
      setLocalValues((prev) => ({ ...prev, [fieldKey]: "" }));
      return;
    }

    // Only digits allowed
    if (!/^\d+$/.test(digitsOnly)) return;

    // Strip leading zeros
    digitsOnly = String(parseInt(digitsOnly, 10));

    // Format with commas
    const formatted = formatWithCommas(digitsOnly);

    setLocalValues((prev) => ({ ...prev, [fieldKey]: formatted }));

    // Restore cursor position after formatting
    setTimeout(() => {
      const ref = inputRefs.current[fieldKey];
      if (ref) {
        const newPos = formatted.length - cursorPosFromEnd;
        ref.selectionStart = ref.selectionEnd = Math.max(newPos, 0);
      }
    }, 0);
  };

  const handleBlur = (fieldKey: string) => {
    let rawVal = localValues[fieldKey]?.replace(/,/g, "") || "";
    
    // If field is empty, keep it empty
    if (rawVal === "") {
      updateMetric(fieldKey as keyof ROIMetrics, 0);
      setLocalValues((prev) => ({
        ...prev,
        [fieldKey]: "",
      }));
      return;
    }
    
    let numericValue = parseInt(rawVal, 10);
    if (isNaN(numericValue)) numericValue = 0;

    updateMetric(fieldKey as keyof ROIMetrics, numericValue);

    setLocalValues((prev) => ({
      ...prev,
      [fieldKey]: numericValue === 0 ? "" : numericValue.toLocaleString("en-US"),
    }));
  };

  const fieldSections = [
    // Your existing sections here ...
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
    // add other sections here, same as you had...
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
                      type="text"
                      inputMode="numeric"
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
          </div>
        </div>
      </CardContent>
    </>
  );
};
