import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export const References = () => {
  const references = [
    {
      title: "Healthcare Financial Management Association (HFMA)",
      description: "Industry standards for healthcare revenue cycle management and best practices",
      url: "https://www.hfma.org"
    },
    {
      title: "Centers for Medicare & Medicaid Services (CMS)",
      description: "Official guidelines for medical coding, billing, and compliance requirements",
      url: "https://www.cms.gov"
    },
    {
      title: "American Health Information Management Association (AHIMA)",
      description: "Professional standards for health information management and coding practices",
      url: "https://ahima.org"
    },
    {
      title: "Medical Group Management Association (MGMA)",
      description: "Benchmarking data and operational metrics for medical practices",
      url: "https://www.mgma.com"
    },
    {
      title: "National Association of Healthcare Revenue Integrity (NAHRI)",
      description: "Revenue integrity best practices and industry benchmarks",
      url: "https://www.nahri.org"
    },
    {
      title: "Healthcare IT News",
      description: "Latest trends and case studies in healthcare technology implementation",
      url: "https://www.healthcareitnews.com"
    }
  ];

  const caseStudies = [
    {
      title: "Primary Care Center - Coder Productivity",
      description: "Achieved 90% improvement in coding productivity per coder through autonomous coding implementation",
      impact: "Reduced coding time from 12 minutes to 6.3 minutes per chart"
    },
    {
      title: "RCM Provider - Workflow Optimization", 
      description: "Improved coder productivity by 120% with user-friendly UI and managed workflow",
      impact: "Increased daily chart processing from 80 to 176 charts per coder"
    },
    {
      title: "Multi-Specialty Clinic - Billing Automation",
      description: "Replaced manual charge entry, reducing billing FTEs by 40%",
      impact: "Eliminated 2 full-time billing positions, saving $120k annually"
    },
    {
      title: "Primary Care Network - Physician Time Savings",
      description: "Cut chart-related physician queries by 30% in 6 months",
      impact: "Saved 45 minutes per physician per day on chart reviews"
    },
    {
      title: "Health System - Technology Consolidation",
      description: "Retired legacy encoder, removing $150k annual license cost",
      impact: "Consolidated to single cloud platform with usage-based pricing"
    },
    {
      title: "MSO Primary Care - Claim Denial Reduction",
      description: "Achieved 15% reduction in claim denials through automated edits",
      impact: "Reduced denial rate from 12% to 10.2%, saving $85k in rework costs"
    },
    {
      title: "ASC Clinic - Backlog Elimination",
      description: "Eliminated coding backlog from 28% of charts (17-20 days) to 0%",
      impact: "Improved cash flow by $2.1M through faster claim submission"
    }
  ];

  return (
    <div className="space-y-6 bg-background">
      <Card className="bg-background border border-border">
        <CardHeader className="bg-background">
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Industry References
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-background">
          {references.map((ref, index) => (
            <div key={index} className="border-l-4 border-primary/20 pl-4">
              <h4 className="font-semibold text-foreground">{ref.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{ref.description}</p>
              <a 
                href={ref.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Visit Website <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-background border border-border">
        <CardHeader className="bg-background">
          <CardTitle>Case Studies & Success Stories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-background">
          {caseStudies.map((study, index) => (
            <div key={index} className="border rounded-lg p-4 bg-muted">
              <h4 className="font-semibold text-foreground mb-2">{study.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{study.description}</p>
              <div className="bg-primary/10 rounded p-2">
                <p className="text-sm font-medium text-primary">{study.impact}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-background border border-border">
        <CardHeader className="bg-background">
          <CardTitle>Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="bg-background">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> This ROI calculator provides estimates based on industry benchmarks and case studies. 
              Actual results may vary depending on your organization's specific circumstances, implementation approach, 
              and operational factors. We recommend conducting a detailed assessment with our team to validate these 
              projections for your unique environment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};