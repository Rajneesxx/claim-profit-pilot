import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FinancialReportProps {
  companyName?: string;
  totalImpact?: number;
  costSavings?: number;
  revenueUplift?: number;
  riskReduction?: number;
  annualRevenue?: number;
  claimsPerYear?: number;
}

const FinancialReport: React.FC<FinancialReportProps> = ({
  companyName = "Your Organization",
  totalImpact = 397606,
  costSavings = 311011,
  revenueUplift = 52595,
  riskReduction = 34000,
  annualRevenue = 10000000,
  claimsPerYear = 66667
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Page 1: Executive Summary */}
      <div className="min-h-screen p-8 flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Financial Future at a Glance
          </h1>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">Executive Summary</h2>
          <p className="text-gray-700 text-lg mb-8">
            This ROI analysis models the financial impact of adopting <strong>RapidClaims' AI-powered 
            medical coding solutions</strong>, using your organization's operational data.
          </p>

          <div className="mb-8">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {formatCurrency(totalImpact)}
            </div>
            <div className="text-xl font-semibold text-gray-600">
              Estimated Annual Financial Impact
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-purple-50 border border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {formatCurrency(costSavings)}
                </div>
                <div className="text-gray-600 font-medium">in Cost Savings</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {formatCurrency(revenueUplift)}
                </div>
                <div className="text-gray-600 font-medium">in Revenue Uplift</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {formatCurrency(riskReduction)}
                </div>
                <div className="text-gray-600 font-medium">in Risk Reduction</div>
              </CardContent>
            </Card>
          </div>

          <p className="text-gray-700 text-lg">
            The analysis shows a <strong>compelling return on investment</strong>, with strong cost reductions 
            supported by compliance improvements and modest revenue uplift.
          </p>
        </div>

        <div className="mt-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            The Story Behind the Numbers
          </h2>

          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-purple-600 mb-8">Financial Impact Breakdown</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">78% Cost Savings</h4>
                  <p className="text-gray-600">
                    Driven by AI automation that boosts coder productivity and eliminates manual tasks.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">13% Revenue Increase</h4>
                  <p className="text-gray-600">
                    Driven by improved coding accuracy that captures missed reimbursements.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">9% Risk Reduction</h4>
                  <p className="text-gray-600">
                    Driven by enhanced compliance, reducing audit and penalty exposure.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {/* Donut Chart Representation */}
              <div className="relative w-64 h-64 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Cost Savings - 78% (Purple) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#7c4dff"
                    strokeWidth="12"
                    strokeDasharray="172 48"
                    strokeLinecap="round"
                  />
                  {/* Revenue Increase - 13% (Green) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="12"
                    strokeDasharray="28 192"
                    strokeDashoffset="-172"
                    strokeLinecap="round"
                  />
                  {/* Risk Reduction - 9% (Light Purple) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="12"
                    strokeDasharray="20 200"
                    strokeDashoffset="-200"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-2xl font-bold text-gray-800 text-center">78%</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Cost Savings:</span>
                  <span className="ml-auto font-semibold">{formatCurrency(costSavings)}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Revenue Increase:</span>
                  <span className="ml-auto font-semibold">{formatCurrency(revenueUplift)}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Risk Reduction:</span>
                  <span className="ml-auto font-semibold">{formatCurrency(riskReduction)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-purple-50 border-l-4 border-purple-600 rounded-r-lg">
            <p className="text-purple-700 text-lg italic text-center">
              "Imagine recovering every collectible dollar, automatically."
            </p>
          </div>

          <div className="mt-8 text-right">
            <img src="/src/assets/rapidclaims-logo.png" alt="RapidClaims" className="h-8 ml-auto" />
          </div>
        </div>
      </div>

      {/* Page 2: Detailed Financial Analysis */}
      <div className="min-h-screen p-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-8">Detailed Financial Analysis</h2>

        <Card className="bg-purple-50 border border-purple-200 mb-12">
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-800">Category</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-800">Annual Value</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-800">Description</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  <tr className="border-b border-purple-100">
                    <td className="py-4 px-4 font-medium text-gray-700">Cost Savings</td>
                    <td className="py-4 px-4 font-bold text-gray-800">$875,715</td>
                    <td className="py-4 px-4 text-gray-600">
                      Operational efficiency gains from autonomous coding and reduced manual work.
                    </td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-4 px-4 font-medium text-gray-700">Revenue Enhanced</td>
                    <td className="py-4 px-4 font-bold text-gray-800">$661,994</td>
                    <td className="py-4 px-4 text-gray-600">
                      Improved claim accuracy, fewer denials, increased approved reimbursements.
                    </td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-4 px-4 font-medium text-gray-700">Risk Mitigation</td>
                    <td className="py-4 px-4 font-bold text-gray-800">$400,092</td>
                    <td className="py-4 px-4 text-gray-600">
                      Compliance protection, reduced penalties, lower audit exposure.
                    </td>
                  </tr>
                  <tr className="border-t-2 border-purple-300">
                    <td className="py-4 px-4 font-bold text-gray-800">Total Benefit</td>
                    <td className="py-4 px-4 font-bold text-gray-800">$1,937,801</td>
                    <td className="py-4 px-4 font-bold text-gray-800">
                      Combined annual financial impact
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-purple-600 mb-6">Organization Parameters</h3>
          <p className="text-gray-700 mb-6">The ROI model uses your organizational inputs:</p>
          
          <ul className="space-y-4 text-gray-700">
            <li className="flex">
              <span className="font-semibold mr-2">•</span>
              <div>
                <strong>Annual Revenue Claimed:</strong> {formatCurrency(annualRevenue)}
              </div>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">•</span>
              <div>
                <strong>Number of Claims Per Year:</strong> ~{formatNumber(claimsPerYear)}
              </div>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">•</span>
              <div>
                <strong>Average Cost per Claim:</strong> Derived from revenue and claim data.
              </div>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">•</span>
              <div>
                <strong>Baseline Denial Rate & Backlog:</strong> Applied as per inputs.
              </div>
            </li>
          </ul>

          <p className="text-gray-700 mt-6">
            These assumptions create the baseline for measuring cost savings, revenue enhancement, 
            and risk reduction.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-purple-600 mb-6">Conclusion</h3>
          <p className="text-gray-700 mb-6">The model demonstrates a positive ROI, delivering:</p>
          
          <ul className="space-y-4 text-gray-700 mb-8">
            <li className="flex">
              <span className="font-semibold mr-2">•</span>
              <div>
                <strong>{formatCurrency(totalImpact)} annual benefit</strong>, driven primarily by cost savings.
              </div>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">•</span>
              <div>
                <strong>Reduced operational strain</strong>, freeing coders and physicians from manual tasks.
              </div>
            </li>
            <li className="flex">
              <span className="font-semibold mr-2">•</span>
              <div>
                <strong>Compliance confidence</strong>, reducing the risk of costly penalties and audits.
              </div>
            </li>
          </ul>

          <p className="text-gray-700">
            <strong>Recommendation:</strong> Adoption of RapidClaims' AI solutions provides a sustainable and 
            scalable path to reduce costs, increase revenue capture, and improve compliance 
            simultaneously.
          </p>
        </div>
      </div>

      {/* Page 3: Four Pillars */}
      <div className="min-h-screen p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-2">The Four Pillars of Your Success</h2>
          <h3 className="text-3xl font-bold text-gray-800">The Levers Driving Your ROI</h3>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <Card className="bg-purple-50 border border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-2xl">⚙️</div>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Coder Productivity</h4>
              <p className="text-sm text-gray-600">
                AI reduces time per chart by up to 100%.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-2xl">💻</div>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Billing Automation</h4>
              <p className="text-sm text-gray-600">
                40% fewer denials and faster turnaround.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-2xl">👨‍⚕️</div>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Physician Time Saved</h4>
              <p className="text-sm text-gray-600">
                Fewer queries and documentation bottlenecks.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-2xl">🔒</div>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Tech Cost Optimization</h4>
              <p className="text-sm text-gray-600">
                Replace legacy systems and reduce IT overhead.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12 p-6 bg-purple-50 border-l-4 border-purple-600 rounded-r-lg">
          <p className="text-purple-700 text-lg italic text-center">
            "Free your team to focus on what matters most: patient care and complex cases."
          </p>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Your Path Forward</h3>
          <h4 className="text-2xl font-bold text-purple-600">Your Implementation Journey</h4>
        </div>

        <div className="mb-8">
          <h4 className="text-2xl font-bold text-purple-600 mb-6">
            Implementation | Seamless Deployment in 8 Weeks
          </h4>
          <p className="text-gray-700 mb-8">
            Accelerate implementation with structured AI integration, real-time automation, and 
            ongoing enhancements to maximize accuracy, compliance, and financial impact.
          </p>
        </div>

        <Card className="bg-gray-50 border border-gray-200 mb-8">
          <CardContent className="p-8">
            <h5 className="text-xl font-bold text-gray-800 mb-6">Proposed Approach</h5>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="bg-purple-600 text-white p-3 rounded-lg mb-2">
                  <strong>Baseline Setup & Configuration</strong>
                </div>
                <div className="text-sm text-gray-600 p-2">
                  Establish seamless integration with EHR, RCM, and claims systems while configuring AI models and benchmarks for accuracy and automation. Configure payer-specific rules, specialty workflows, and quality control integration.
                </div>
                <div className="font-bold text-purple-600 mt-2">2 weeks</div>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white p-3 rounded-lg mb-2">
                  <strong>AI Model Customization & Parallel Testing</strong>
                </div>
                <div className="text-sm text-gray-600 p-2">
                  Fine-tune AI models using real-world client documentation and coding patterns while conducting parallel testing to validate automated recommendations. Monitor AI-generated coding and CDI recommendations vs physician workflows.
                </div>
                <div className="font-bold text-purple-600 mt-2">2 weeks</div>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white p-3 rounded-lg mb-2">
                  <strong>Pilot Deployment & CDI Workflow Integration</strong>
                </div>
                <div className="text-sm text-gray-600 p-2">
                  Deploy AI-powered CDI and autonomous coding in a live environment with select physician teams. Gather stakeholder engagement, and compliance adherence. Conduct weekly performance reviews and adjust implementation levels and improve coding efficiency.
                </div>
                <div className="font-bold text-purple-600 mt-2">2 weeks</div>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white p-3 rounded-lg mb-2">
                  <strong>Full-Scale Go-Live & Workflow Integration</strong>
                </div>
                <div className="text-sm text-gray-600 p-2">
                  Transition to full-scale deployment with AI autonomous coding across all specialties, with live process improvement, and compliance validation. Finalize coding integration, train coders and providers on enhanced workflows and monitor revenue cycle impact.
                </div>
                <div className="font-bold text-purple-600 mt-2">2 weeks</div>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white p-3 rounded-lg mb-2">
                  <strong>Continuous Optimization</strong>
                </div>
                <div className="text-sm text-gray-600 p-2">
                  With full automation in place, the focus shifts to continuous optimization, sustained impact through specialist workflows, and revenue cycle workflows for sustained compliance and financial impact improvement.
                </div>
                <div className="font-bold text-purple-600 mt-2">Ongoing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-gray-700">
          <strong>Next Steps:</strong> Finalize integration requirements, provide historical data for AI 
          benchmarking, and align on performance goals to initiate a seamless deployment and 
          optimization process.
        </p>
      </div>

      {/* Page 4: ROI Timeline and Comparison */}
      <div className="min-h-screen p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Consistently delivering &gt; 6x ROI?</h2>
        </div>

        <Card className="bg-purple-50 border border-purple-200 mb-12">
          <CardContent className="p-8">
            {/* ROI Timeline Graph Placeholder */}
            <div className="relative h-64 mb-8">
              <svg className="w-full h-full" viewBox="0 0 800 200">
                {/* Background gradient */}
                <defs>
                  <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c4dff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7c4dff" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                
                {/* Timeline path */}
                <path
                  d="M 50 180 Q 150 160 200 140 Q 300 120 400 100 Q 500 80 600 60 Q 700 40 750 20"
                  fill="url(#roiGradient)"
                  stroke="#7c4dff"
                  strokeWidth="3"
                />
                
                {/* Timeline points */}
                <circle cx="100" cy="170" r="6" fill="#7c4dff" />
                <circle cx="200" cy="140" r="6" fill="#7c4dff" />
                <circle cx="350" cy="110" r="6" fill="#7c4dff" />
                <circle cx="500" cy="80" r="6" fill="#7c4dff" />
                <circle cx="650" cy="50" r="6" fill="#7c4dff" />
                <circle cx="750" cy="20" r="6" fill="#7c4dff" />
                
                {/* Labels */}
                <text x="100" y="195" textAnchor="middle" className="text-xs fill-gray-600">Apr '24</text>
                <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-600">Aug '24</text>
                <text x="350" y="195" textAnchor="middle" className="text-xs fill-gray-600">Dec '24</text>
                <text x="500" y="195" textAnchor="middle" className="text-xs fill-gray-600">Apr '25</text>
                <text x="650" y="195" textAnchor="middle" className="text-xs fill-gray-600">Aug '25</text>
                <text x="750" y="195" textAnchor="middle" className="text-xs fill-gray-600">Dec '25</text>
                
                {/* Value labels */}
                <text x="100" y="155" textAnchor="middle" className="text-xs fill-gray-800 font-bold">$1M CARR</text>
                <text x="350" y="95" textAnchor="middle" className="text-xs fill-gray-800 font-bold">$2.7M CARR</text>
                <text x="650" y="35" textAnchor="middle" className="text-xs fill-gray-800 font-bold">$10M CARR</text>
              </svg>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Onboarded first client</strong> - 100+ physician group based out of Florida</p>
              <p><strong>On-boarded one of the largest FQHCs in USA</strong> - 3 live customers</p>
              <p><strong>Series A backed by Accel</strong> - $5M high velocity pipeline</p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">What makes us different?</h3>
          <p className="text-gray-700 text-lg text-center mb-8">
            Clear ROI, seamless integration, and best-in-class automation: a system that pays for 
            itself in less than 3 months.
          </p>
        </div>

        <Card className="bg-purple-50 border border-purple-200 mb-12">
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-800">What makes RapidClaims Unique?</th>
                    <th className="text-center py-4 px-4 font-bold text-red-600">🚀 RapidClaims</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800">The Rest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Customizations</td>
                    <td className="py-3 px-4 text-center text-gray-800">Fully configurable workflows, minimal dev required</td>
                    <td className="py-3 px-4 text-center text-gray-600">Limited or require engineering effort</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Time to go-live</td>
                    <td className="py-3 px-4 text-center text-gray-800">6-8 weeks</td>
                    <td className="py-3 px-4 text-center text-gray-600">2-6 months</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Minimum Charts Required for Go-Live</td>
                    <td className="py-3 px-4 text-center text-gray-800">500-1000 Charts Per Site</td>
                    <td className="py-3 px-4 text-center text-gray-600">20,000 - 50,000 Charts</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Integration time</td>
                    <td className="py-3 px-4 text-center text-gray-800">API &amp; FHIR-based plug-ins, &lt; 1 month; RPA</td>
                    <td className="py-3 px-4 text-center text-gray-600">Long IT onboarding</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Specialty coverage</td>
                    <td className="py-3 px-4 text-center text-gray-800">Built for multi-specialty including complex care</td>
                    <td className="py-3 px-4 text-center text-gray-600">Often limited to primary specialties</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Documentation improvement</td>
                    <td className="py-3 px-4 text-center text-gray-800">Smart query module suggests clarifications in real time</td>
                    <td className="py-3 px-4 text-center text-gray-600">Manual follow-up by coders</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Code Audits</td>
                    <td className="py-3 px-4 text-center text-gray-800">Built-in pre-submit audits with real-time flags</td>
                    <td className="py-3 px-4 text-center text-gray-600">Post-submission audits</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Team collaboration</td>
                    <td className="py-3 px-4 text-center text-gray-800">Shared queues, in-app notes & escalation paths</td>
                    <td className="py-3 px-4 text-center text-gray-600">Disjointed workflows</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="py-3 px-4 text-gray-700">Analytics</td>
                    <td className="py-3 px-4 text-center text-gray-800">Real-time dashboards, ROI tracking, denial trends</td>
                    <td className="py-3 px-4 text-center text-gray-600">Limited to basic reporting</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">Care gap detection</td>
                    <td className="py-3 px-4 text-center text-gray-800">AI flags missed opportunities during coding</td>
                    <td className="py-3 px-4 text-center text-gray-600">Not typically supported</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-600 mb-8">Ready to Unlock Your ROI?</h2>
          <div className="mt-12">
            <img src="/src/assets/rapidclaims-logo.png" alt="RapidClaims" className="h-12 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
