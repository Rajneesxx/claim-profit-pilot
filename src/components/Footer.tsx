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
  <div className="flex flex-wrap lg:flex-nowrap items-center gap-10 max-w-[1200px] mx-auto px-6 py-14 lg:py-20">
    <img
      src="https://api.builder.io/api/v1/image/assets/TEMP/d6321efa1e6ceeefe2643911cfa0c4be5854f55c?width=1421"
      alt="Rapid Codes"
      className="w-full max-w-lg lg:w-[400px] lg:h-[250px] object-cover rounded-[7px] mb-8 lg:mb-0"
    />
    <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left">
      <h2 className="text-gray-800 text-4xl lg:text-5xl font-semibold leading-snug mb-6">
        Unlock every collectible dollar
      </h2>
      <div className="text-gray-500 text-lg leading-normal mb-8">
        <p>Generate $5M in hidden revenue each year.</p>
        <p>For every 500 beds.</p>
        <p>Revenue uplift. Simplified</p>
      </div>
      <button className="flex items-center justify-center w-48 h-12 bg-[#7828C8] rounded-lg hover:bg-[#6a1fb8]">
        <span className="text-white text-base font-semibold">Book a Demo</span>
      </button>
    </div>
  </div>

  <div className="flex flex-wrap lg:flex-nowrap items-center gap-8 max-w-[1200px] mx-auto px-6 py-12">
    <div className="flex-1 min-w-[250px] mb-8 lg:mb-0">
      {/* SVG */}
      ...
      <h3 className="text-white text-2xl font-bold mb-4">
        Transform Your Revenue Cycle in 30 Days or Less
      </h3>
      <p className="text-white text-xs mb-4">
        Join leading healthcare organizations already seeing results with RapidClaims.
      </p>
    </div>
    <div className="flex-1 flex flex-col gap-5 min-w-[280px]">
      {/* Three links */}
      ...
    </div>
  </div>

  <div className="bg-[#01101F] pt-12 pb-8 px-6">
    <div className="flex flex-wrap gap-10 max-w-[1200px] mx-auto">
      <div className="shrink-0 mb-8 lg:mb-0">
        {/* SVG */}
      </div>
      <div className="flex flex-wrap flex-1 gap-8">
        {/* Navs */}
        ...
      </div>
      <div className="flex-1 max-w-md mt-6 lg:mt-0">
        <h4 className="text-white text-lg font-semibold mb-3">Sign up for our newsletter</h4>
        <p className="text-[#A6A6A6] text-sm mb-5">
          Stay up to date with the roadmap progress, announcements and exclusive discounts. Sign up with your email.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 h-11 border border-gray-700 text-white text-sm px-4 rounded-md bg-transparent placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="h-11 text-white text-sm font-semibold bg-[#7828C8] px-5 rounded-md border-none hover:bg-[#6a1fb8]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row justify-between items-center border-t border-gray-700 max-w-[1200px] mx-auto py-5 mt-8 gap-4 text-center lg:text-left">
      <address className="text-[#A6A6A6] text-xs not-italic mb-4 lg:mb-0">
        <div>Address:</div>
        <div>100 Church Street Manhattan, New York 10007</div>
      </address>
      <div className="flex flex-col items-center lg:items-end gap-2">
        <div className="text-[#A6A6A6] text-[10px] font-bold uppercase">RECOGNIZED BY</div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded bg-gray-700" />
          <div className="w-8 h-8 rounded bg-gray-700" />
        </div>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row justify-between items-center border-t border-gray-700 max-w-[1200px] mx-auto pt-5 gap-4 text-center lg:text-left">
      <div className="text-gray-500 text-xs">© 2024 RapidClaims. All rights reserved.</div>
      <nav className="flex gap-6 justify-center lg:justify-end">
        <a href="#" className="text-gray-500 text-xs hover:text-gray-300">Terms of Service</a>
        <a href="#" className="text-gray-500 text-xs hover:text-gray-300">Privacy Policy</a>
        <a href="#" className="text-gray-500 text-xs hover:text-gray-300">Contact Info</a>
      </nav>
    </div>
  </div>
</footer>
 );
};
