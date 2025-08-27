import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return ( 
    
 <footer className="bg-[#01101F] w-full">
  <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-12">

    {/* Top Row: Logo + Nav + Newsletter */}
    <div className="flex flex-col md:flex-row gap-10 md:gap-20 text-white">

      {/* RapidClaims Logo */}
      <div className="flex-shrink-0 mb-6 md:mb-0">
        <img 
          src="/path_to_uploaded_logo/RC-horizontal-2.jpg" 
          alt="RapidClaims Logo" 
          className="w-[160px] h-auto"
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-wrap gap-10 md:gap-20">

        {/* Products */}
        <nav className="flex flex-col gap-4 min-w-[140px] uppercase">
          <h4 className="text-[#A6A6A6] text-xs font-bold tracking-wide">PRODUCTS</h4>
          <a href="https://www.rapidclaims.ai/products/rapid-code" className="text-white text-[12px] hover:text-gray-300 transition">RapidCode</a>
          <a href="https://www.rapidclaims.ai/products/rapid-scrub" className="text-white text-[12px] hover:text-gray-300 transition">Rapid Scrub</a>
          <a href="https://www.rapidclaims.ai/products/rapid-cdi" className="text-white text-[12px] hover:text-gray-300 transition">RapidCDI</a>
        </nav>

        {/* Solutions */}
        <nav className="flex flex-col gap-4 min-w-[140px] uppercase">
          <h4 className="text-[#A6A6A6] text-xs font-bold tracking-wide">SOLUTIONS</h4>
          <a href="https://www.rapidclaims.ai/solutions" className="text-white text-[12px] hover:text-gray-300 transition">Types of Outcomes</a>
          <a href="https://www.rapidclaims.ai/solutions" className="text-white text-[12px] hover:text-gray-300 transition">Types of Organizations</a>
          <a href="https://www.rapidclaims.ai/solutions" className="text-white text-[12px] hover:text-gray-300 transition">Types of Use Cases</a>
        </nav>

        {/* Resources */}
        <nav className="flex flex-col gap-4 min-w-[140px] uppercase">
          <h4 className="text-[#A6A6A6] text-xs font-bold tracking-wide">RESOURCES</h4>
          <a href="https://www.rapidclaims.ai/resources/blogs" className="text-white text-[12px] hover:text-gray-300 transition">Blog</a>
          <a href="https://www.rapidclaims.ai/resources/blogs" className="text-white text-[12px] hover:text-gray-300 transition">Case Studies</a>
          <a href="https://www.rapidclaims.ai/resources/blogs" className="text-white text-[12px] hover:text-gray-300 transition">News</a>
        </nav>
      </div>

      {/* Newsletter Signup */}
      <div className="flex-1 max-w-sm">
        <h4 className="text-white text-lg font-semibold mb-3">
          Sign up for our newsletter
        </h4>
        <p className="text-[#A6A6A6] text-sm mb-5 leading-relaxed">
          Stay up to date with roadmap progress, announcements, and exclusive discounts.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-11 border border-gray-700 text-white text-sm px-4 py-0 rounded-md bg-transparent placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="h-11 bg-[#7828C8] hover:bg-[#6a1fb8] rounded-md px-5 py-0 text-white font-semibold transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

    {/* Bottom Row - Address & Recognized By */}
    <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-700 mt-12 pt-6 gap-6 md:gap-0 text-center md:text-left text-[#A6A6A6] text-xs">
      <address className="not-italic">
        100 Church Street Manhattan, New York 10007
      </address>

      {/* Recognized by logos */}
      <div>
        <div className="text-xs font-bold uppercase mb-2">RECOGNIZED BY</div>
        <div className="flex gap-2 justify-center md:justify-start">
          <div className="w-8 h-8 rounded bg-gray-700" />
          <div className="w-8 h-8 rounded bg-gray-700" />
        </div>
      </div>
    </div>

    {/* Bottom copyright */}
    <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-700 mt-8 pt-4 text-gray-500 text-xs gap-4 md:gap-0">
      <div>© 2024 RapidClaims. All rights reserved.</div>
      <nav className="flex gap-6 justify-center md:justify-end">
        <a href="#" className="hover:text-gray-300">Terms of Service</a>
        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
        <a href="#" className="hover:text-gray-300">Contact Info</a>
      </nav>
    </div>
  </div>
</footer>

 );
};
