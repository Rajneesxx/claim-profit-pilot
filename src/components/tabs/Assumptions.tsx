import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, TrendingUp } from 'lucide-react';
import { ROIMetrics } from '../../types/roi';

interface AssumptionsProps {
  metrics: ROIMetrics;
}

export const Assumptions = ({ metrics }: AssumptionsProps) => {
  const assumptions = [
    {
      category: "Industry Benchmarks",
      icon: TrendingUp,
      items: [
        { label: "Average claim denial rate", value: "15-30%", source: "Healthcare Financial Management Association" },
        { label: "Typical coder productivity", value: "15-20 charts/day", source: "AHIMA Benchmarking Study 2024" },
        { label: "Average coder salary", value: "$45,000-$75,000", source: "Bureau of Labor Statistics" },
        { label: "Healthcare overhead costs", value: "35-45%", source: "Medical Group Management Association" }
      ]
    },
    {
      category: "RapidClaims Performance",
      icon: Users,
      items: [
        { label: "AI accuracy rate", value: "99.5%", source: "Internal testing results" },
        { label: "Processing speed improvement", value: "10x faster", source: "Customer case studies" },
        { label: "Staff reduction potential", value: "80%", source: "Implementation data" },
        { label: "Claim denial reduction", value: "50%", source: "Average customer results" }
      ]
    },
    {
      category: "Financial Assumptions",
      icon: FileText,
      items: [
        { label: "Cost of capital", value: `${metrics.costOfCapital}%`, source: "User input / Industry standard" },
        { label: "Working days per year", value: "250 days", source: "Standard business calendar" },
        { label: "Hours per working day", value: "8 hours", source: "Standard full-time schedule" },
        { label: "RVU conversion factor", value: `$${metrics.weightedAverageGPCI * 36}`, source: "CMS Fee Schedule" }
      ]
    }
  ];

  const references = [
    {
      title: "Healthcare Financial Management Association (HFMA)",
      description: "Revenue cycle management best practices and benchmarking data",
      url: "https://www.hfma.org"
    },
    {
      title: "American Health Information Management Association (AHIMA)",
      description: "Medical coding productivity and accuracy standards",
      url: "https://www.ahima.org"
    },
    {
      title: "Medical Group Management Association (MGMA)",
      description: "Healthcare practice management benchmarks and financial data",
      url: "https://www.mgma.com"
    },
    {
      title: "Centers for Medicare & Medicaid Services (CMS)",
      description: "Medicare fee schedules and reimbursement rates",
      url: "https://www.cms.gov"
    }
  ];

  return (
    <>
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="flex items-center gap-2 text-white">
          <BookOpen className="h-5 w-5" />
          Assumptions & References
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Key Assumptions */}
        <div className="space-y-8 mb-8">
          {assumptions.map((category, index) => (
            <div key={index} className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">{category.category}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-300 text-sm">{item.label}</span>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                    <div className="text-gray-500 text-xs">{item.source}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current Calculation Inputs */}
        <div className="bg-gray-800/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Current Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
              <div className="text-purple-400 text-sm mb-1">Annual Revenue</div>
              <div className="text-white text-lg font-semibold">${metrics.revenueClaimed.toLocaleString()}</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <div className="text-blue-400 text-sm mb-1">Number of Coders</div>
              <div className="text-white text-lg font-semibold">{metrics.numberOfCoders}</div>
            </div>
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <div className="text-red-400 text-sm mb-1">Claim Denial Rate</div>
              <div className="text-white text-lg font-semibold">{metrics.claimDeniedPercent}%</div>
            </div>
          </div>
        </div>

        {/* References */}
        <div className="bg-gray-800/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Industry References</h3>
          <div className="space-y-4">
            {references.map((ref, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <div className="text-white font-medium mb-1">{ref.title}</div>
                <div className="text-gray-300 text-sm mb-2">{ref.description}</div>
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm underline"
                >
                  {ref.url}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <div className="text-yellow-400 font-medium mb-2">Important Disclaimer</div>
          <div className="text-gray-300 text-sm">
            This calculator provides estimates based on industry benchmarks and your inputs. Actual results may vary 
            depending on your organization's specific circumstances, implementation approach, and market conditions. 
            We recommend consulting with our team for a detailed analysis tailored to your organization.
          </div>
        </div>
      </CardContent>
    </>
  );
};