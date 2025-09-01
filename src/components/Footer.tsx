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
    <footer className="bg-[#01101F] w-screen min-h-screen relative overflow-hidden flex flex-col justify-center ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)]">
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

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-16 relative z-10 flex-1 flex flex-col justify-center text-center">
        {/* Top Section - Centered */}
        <div className="flex flex-col items-center gap-12 mb-20">
          {/* Logo */}
          <img
            src="/lovable-uploads/1a6fc353-f26e-441f-a18d-4c507288da1b.png"
            alt="Company Logo"
            className="w-32 h-auto"
          />
          
          {/* Headline & Description */}
          <div className="flex flex-col items-center">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 text-center">
              Transform Your Revenue Cycle in<br />30 Days or Less
            </h2>
            <p className="text-gray-300 text-sm lg:text-base mb-8 text-center max-w-2xl">
              Join leading healthcare organizations already seeing results with RapidClaims.
            </p>
          </div>

          {/* CTA Links - Centered */}
          <div className="flex flex-col w-full max-w-md gap-0">
            <a
              href="https://www.rapidclaims.ai/get-in-touch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 border-b border-gray-600 text-white hover:text-gray-300 transition group"
            >
              <span className="text-lg font-medium">Request ROI Analysis</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </a>
            <a
              href="https://www.rapidclaims.ai/get-in-touch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 border-b border-gray-600 text-white hover:text-gray-300 transition group"
            >
              <span className="text-lg font-medium">Calculate your savings</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </a>
            <a
              href="https://www.rapidclaims.ai/get-in-touch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 text-white hover:text-gray-300 transition group"
            >
              <span className="text-lg font-medium">Schedule a demo</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </a>
          </div>

          {/* Recognition - Centered */}
          <div className="flex flex-col items-center mt-8">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
              RECOGNISED BY
            </div>
            <img
              src="/lovable-uploads/08acfdc3-be82-42d9-933b-c43aa8105f8c.png"
              alt="Recognition badges"
              className="h-16 w-auto"
            />
          </div>
        </div>

        {/* Footer Links Grid - Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center">
          {/* Products */}
          <div className="flex flex-col items-center">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              PRODUCTS
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.rapidclaims.ai/products/rapid-code"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  RapidCode
                </a>
              </li>
              <li>
                <a
                  href="https://www.rapidclaims.ai/products/rapid-scrub"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  RapidScrub
                </a>
              </li>
              <li>
                <a
                  href="https://www.rapidclaims.ai/products/rapid-cdi"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  RapidCDI
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="flex flex-col items-center">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              SOLUTIONS
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.rapidclaims.ai/solutions"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  For types of customers
                </a>
              </li>
              <li>
                <a
                  href="https://www.rapidclaims.ai/solutions"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  For types of roles
                </a>
              </li>
              <li>
                <a
                  href="https://www.rapidclaims.ai/solutions"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  For types of use cases
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              RESOURCES
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.rapidclaims.ai/resources/blogs"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  Blogs
                </a>
              </li>
              <li>
                <a
                  href="https://www.rapidclaims.ai/resources/blogs"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="https://www.rapidclaims.ai/resources/blogs"
                  target="_blank"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  News
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter + Address */}
          <div className="flex flex-col items-center">
            <div className="text-gray-400 text-sm mb-3 font-medium">
              Sign up for our newsletter
            </div>
            <div className="flex mb-6 w-full max-w-[300px]">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 h-12 border border-gray-600 text-white text-sm px-4 rounded-l-md bg-transparent placeholder-gray-400 focus:border-red-500 focus:outline-none"
                required
              />
              <button
                type="button"
                className="h-12 bg-red-600 hover:bg-red-700 rounded-r-md px-5 text-white flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-gray-400 text-sm text-center">
              <div className="font-semibold mb-1">Address</div>
              <div>605W, 42nd Street, Manhattan, New York 10036</div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Centered */}
        <div className="flex flex-col items-center text-center border-t border-gray-700 pt-6 text-gray-400 text-sm mt-auto gap-6">
          {/* Email */}
          <div className="flex justify-center">
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

          {/* Copyright + Policy Links */}
          <div className="flex flex-col items-center text-center gap-2">
            <span>© 2025 RapidClaims. All rights reserved.</span>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a
                href="https://www.rapidclaims.ai/terms-of-service"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="https://www.rapidclaims.ai/privacy-policy"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://www.rapidclaims.ai/cookie-policy"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex justify-center">
            <a
              href="https://www.linkedin.com/company/rapidclaims-ai/posts/?feedView=all"
              target="_blank"
              className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <span className="text-white text-xs font-bold">in</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
