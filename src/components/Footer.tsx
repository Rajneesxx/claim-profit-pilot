import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-[#01101F] w-screen relative overflow-hidden m-0">
      <div className="w-full px-6 md:px-12 pb-16 relative z-10">

        {/* Top Section: Logo + Main Headline + CTAs */}
        <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/1a6fc353-f26e-441f-a18d-4c507288da1b.png" 
              alt="Company Logo" 
              className="w-[160px] h-auto"
            />
          </div>

          {/* Center: Main Headline */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Transform Your Revenue Cycle in 30 Days or Less
            </h2>
            <p className="text-gray-300 text-lg">
              Join leading healthcare organizations already seeing results with RapidClaims.
            </p>
          </div>

          {/* Right: CTA Links */}
          <div className="flex flex-col gap-4 min-w-[280px]">
            <a href="https://www.rapidclaims.ai/get-in-touch" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border-b border-gray-600 text-white hover:text-gray-300 transition group">
              <span className="text-lg">Request ROI Analysis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://www.rapidclaims.ai/get-in-touch" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border-b border-gray-600 text-white hover:text-gray-300 transition group">
              <span className="text-lg">Calculate your savings</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://www.rapidclaims.ai/get-in-touch" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 text-white hover:text-gray-300 transition group">
              <span className="text-lg">Schedule a demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {/* Logo (repeated) */}
          <div className="flex justify-center lg:justify-start">
            <img 
              src="/lovable-uploads/1a6fc353-f26e-441f-a18d-4c507288da1b.png" 
              alt="Company Logo" 
              className="w-[140px] h-auto"
            />
          </div>

          {/* Products */}
          <nav className="flex flex-col gap-3">
            <h4 className="text-white text-xl font-black tracking-wider uppercase mb-5">PRODUCTS</h4>
            <a href="https://www.rapidclaims.ai/products/rapid-code" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">RapidCode</a>
            <a href="https://www.rapidclaims.ai/products/rapid-scrub" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">RapidScrub</a>
            <a href="https://www.rapidclaims.ai/products/rapid-cdi" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">RapidCDI</a>
          </nav>

          {/* Solutions */}
          <nav className="flex flex-col gap-3">
            <h4 className="text-white text-xl font-black tracking-wider uppercase mb-5">SOLUTIONS</h4>
            <a href="https://www.rapidclaims.ai/solutions" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">For types of customers</a>
            <a href="https://www.rapidclaims.ai/solutions" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">For types of roles</a>
            <a href="https://www.rapidclaims.ai/solutions" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">For types of use cases</a>
          </nav>

          {/* Resources */}
          <nav className="flex flex-col gap-3">
            <h4 className="text-white text-xl font-black tracking-wider uppercase mb-5">RESOURCES</h4>
            <a href="https://www.rapidclaims.ai/resources/blogs" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">Blogs</a>
            <a href="https://www.rapidclaims.ai/resources/blogs" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">Case Studies</a>
            <a href="https://www.rapidclaims.ai/resources/blogs" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition">News</a>
          </nav>
        </div>

        {/* Newsletter and Recognition Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* Left side - empty space or additional content */}
          <div className="flex-1"></div>

          {/* Right side - Newsletter and Recognition */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Recognized By */}
            <div className="text-center lg:text-left">
              <div className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-4">RECOGNISED BY :</div>
              <div className="flex gap-4 justify-center lg:justify-start">
                <img 
                  src="/lovable-uploads/08acfdc3-be82-42d9-933b-c43aa8105f8c.png" 
                  alt="Recognition badges" 
                  className="h-12 w-auto"
                />
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="min-w-[300px]">
              <h4 className="text-white text-lg font-semibold mb-3">
                Sign up for our newsletter
              </h4>
              <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-11 border border-gray-600 text-white text-sm px-4 rounded-md bg-transparent placeholder-gray-400 focus:border-red-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="h-11 bg-red-600 hover:bg-red-700 rounded-md px-4 text-white font-semibold transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="text-gray-400 text-sm">
                <div className="font-semibold mb-1">Address</div>
                <div>605W, 42nd Street, Manhattan, New York 10036</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-700 pt-6 gap-4 text-gray-400 text-sm">
          {/* Left: Email and Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div>Email <a href="mailto:sales@rapidclaims.ai" className="hover:text-white transition">sales@rapidclaims.ai</a></div>
            <div>© 2025 RapidClaims. All rights reserved.</div>
          </div>

          {/* Center: Legal Links */}
          <nav className="flex gap-6">
            <a href="https://www.rapidclaims.ai/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Terms of Service</a>
            <a href="https://www.rapidclaims.ai/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Privacy Policy</a>
            <a href="https://www.rapidclaims.ai/cookie-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Cookie Policy</a>
          </nav>

          {/* Right: Social Links */}
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/rapidclaims-ai/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition">
              <span className="text-white text-xs font-bold">in</span>
            </a>
          </div>
      </div>
    </footer>
 );
};
