import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#01101F] w-screen relative overflow-hidden flex flex-col justify-center ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)]">
      {/* Background angled-line effect */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              120deg,
              rgba(255,255,255,0.06) 0px,
              rgba(255,255,255,0.06) 1px,
              transparent 1px,
              transparent 60px
            )
          `,
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
        }}
      ></div>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-12 relative z-10 flex-1 flex flex-col justify-center">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
          {/* Left: Logo + Text */}
          <div className="flex flex-col items-start lg:w-1/2">
            <img
              src="/lovable-uploads/1a6fc353-f26e-441f-a18d-4c507288da1b.png"
              alt="Company Logo"
              className="w-20 h-auto mb-6"
            />
            <div>
              <h2 className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-snug mb-2">
                Transform Your Revenue Cycle in<br />30 Days or Less
              </h2>
              <p className="text-gray-300 text-xs lg:text-sm">
                Join leading healthcare organizations already seeing results with RapidClaims.
              </p>
            </div>
          </div>

          {/* Right: CTA Links */}
          <div className="flex flex-col w-full lg:w-[340px] lg:ml-auto mt-8 lg:mt-8">
            {[
              "Request ROI Analysis",
              "Calculate your savings",
              "Schedule a demo",
            ].map((label, i) => (
              <a
                key={i}
                href="https://www.rapidclaims.ai/get-in-touch"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between py-3 border-b border-gray-600 text-white hover:text-gray-300 transition group ${
                  i === 2 ? "border-none" : ""
                }`}
              >
                <span className="text-base font-medium">{label}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Top row: Logo left, Recognition right */}
        <div className="flex items-center justify-between mb-12">
          <img
            src="/lovable-uploads/1a6fc353-f26e-441f-a18d-4c507288da1b.png"
            alt="Company Logo"
            className="w-28 h-auto"
          />
          <div className="flex flex-col items-end">
            <div className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              RECOGNISED BY :
            </div>
            <img
              src="/lovable-uploads/08acfdc3-be82-42d9-933b-c43aa8105f8c.png"
              alt="Recognition badges"
              className="h-14 w-auto"
            />
          </div>
        </div>

        {/* Rest of the footer contents */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Products */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-wider uppercase mb-3">
              PRODUCTS
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li><a href="https://www.rapidclaims.ai/products/rapid-code" target="_blank" className="text-gray-300 text-sm hover:text-white">RapidCode</a></li>
              <li><a href="https://www.rapidclaims.ai/products/rapid-scrub" target="_blank" className="text-gray-300 text-sm hover:text-white">RapidScrub</a></li>
              <li><a href="https://www.rapidclaims.ai/products/rapid-cdi" target="_blank" className="text-gray-300 text-sm hover:text-white">RapidCDI</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-wider uppercase mb-3">
              SOLUTIONS
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li><a href="https://www.rapidclaims.ai/solutions" target="_blank" className="text-gray-300 text-sm hover:text-white">For types of customers</a></li>
              <li><a href="https://www.rapidclaims.ai/solutions" target="_blank" className="text-gray-300 text-sm hover:text-white">For types of roles</a></li>
              <li><a href="https://www.rapidclaims.ai/solutions" target="_blank" className="text-gray-300 text-sm hover:text-white">For types of use cases</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-wider uppercase mb-3">
              RESOURCES
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li><a href="https://www.rapidclaims.ai/resources/blogs" target="_blank" className="text-gray-300 text-sm hover:text-white">Blogs</a></li>
              <li><a href="https://www.rapidclaims.ai/resources/blogs" target="_blank" className="text-gray-300 text-sm hover:text-white">Case Studies</a></li>
              <li><a href="https://www.rapidclaims.ai/resources/blogs" target="_blank" className="text-gray-300 text-sm hover:text-white">News</a></li>
            </ul>
          </div>

          {/* Newsletter + Address */}
          <div className="max-w-[380px] w-full">
            <div className="text-gray-400 text-sm mb-2 font-medium">
              Sign up for our newsletter
            </div>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 h-11 border border-gray-600 text-white text-sm px-3 rounded-l-md bg-transparent placeholder-gray-400 focus:border-red-500 focus:outline-none"
                required
              />
              <button
                type="button"
                className="h-11 bg-red-600 hover:bg-red-700 rounded-r-md px-4 text-white flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-gray-400 text-xs">
              <div className="font-semibold mb-1">Address</div>
              <div>605W, 42nd Street, Manhattan, New York 10036</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-5 text-gray-400 text-xs mt-auto gap-4 px-6 md:px-12 pb-6">
        {/* Left - Email */}
        <div className="flex justify-start w-full md:w-auto">
          <span>
            Email{" "}
            <a
              href="mailto:sales@rapidclaims.ai"
              className="hover:text-white transition-colors"
            >
              sales@rapidclaims.ai
            </a>
          </span>
        </div>

        {/* Center - Copyright + Policy Links */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <span>© 2025 RapidClaims. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <a href="https://www.rapidclaims.ai/terms-of-service" target="_blank" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://www.rapidclaims.ai/privacy-policy" target="_blank" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://www.rapidclaims.ai/cookie-policy" target="_blank" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>

        {/* Right - LinkedIn */}
        <div className="flex justify-end w-full md:w-auto">
          <a
            href="https://www.linkedin.com/company/rapidclaims-ai/posts/?feedView=all"
            target="_blank"
            className="w-7 h-7 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <span className="text-white text-[11px] font-bold">in</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

