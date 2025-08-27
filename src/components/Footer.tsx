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
  {/* Top Section */}
  <div className="flex flex-col md:flex-row items-center w-full gap-10 px-4 md:px-12 py-12">
    <img
      src="https://api.builder.io/api/v1/image/assets/TEMP/d6321efa1e6ceeefe2643911cfa0c4be5854f55c?width=1421"
      alt="Rapid Codes"
      className="w-full md:w-1/2 object-cover rounded-[7px] mb-8 md:mb-0"
    />
    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
      <h2 className="text-gray-800 text-4xl md:text-5xl font-semibold mb-6">
        Unlock every collectible dollar
      </h2>
      <div className="text-gray-500 text-lg mb-8">
        <p>Generate $5M in hidden revenue each year.</p>
        <p>For every 500 beds.</p>
        <p>Revenue uplift. Simplified</p>
      </div>
      <button className="w-44 h-12 bg-[#7828C8] rounded-lg hover:bg-[#6a1fb8] flex items-center justify-center">
        <span className="text-white text-base font-semibold">Book a Demo</span>
      </button>
    </div>
  </div>

  <div className="flex items-center gap-[100px] bg-[#01101F] px-[100px] py-20 max-md:flex-col max-md:gap-10 max-md:text-center max-sm:px-5 max-sm:py-[60px]">
        <div className="flex-1 max-w-[500px]">
          <svg 
            width="42" 
            height="57" 
            viewBox="0 0 42 57" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-14 mb-10"
          >
            <path 
              opacity="0.5" 
              d="M1.89038 51.104H7.97459C8.51211 51.104 8.94818 51.6198 8.94818 52.2556C8.94818 52.892 8.51211 53.4078 7.97459 53.4078H1.89038C1.35276 53.4078 0.916931 52.892 0.916931 52.2556C0.916931 51.6198 1.35276 51.104 1.89038 51.104Z" 
              fill="#F33728"
            />
            <path 
              d="M4.90135 47.6465H10.9857C11.5234 47.6465 11.9589 48.1621 11.9589 48.7983C11.9589 49.4348 11.5234 49.9504 10.9857 49.9504H4.90135C4.36354 49.9504 3.92767 49.4348 3.92767 48.7983C3.92767 48.1621 4.36354 47.6465 4.90135 47.6465Z" 
              fill="#F33728"
            />
          </svg>
          <h3 className="text-white text-2xl font-bold leading-[1.3] mb-4">
            Transform Your Revenue Cycle in 30 Days or Less
          </h3>
          <p className="text-white text-xs font-normal leading-[1.3]">
            Join leading healthcare organizations already seeing results with RapidClaims.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-5">
          <div className="flex items-center justify-between cursor-pointer px-0 py-[15px] border-b-white border-b border-solid hover:opacity-80">
            <span className="text-white text-lg font-normal">
              Request ROI Analysis
            </span>
            <svg 
              width="25" 
              height="25" 
              viewBox="0 0 25 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path 
                d="M5.0271 12.4147H19.0733M19.0733 12.4147L12.0502 5.3916M19.0733 12.4147L12.0502 19.4378" 
                stroke="#F3F3F3" 
                strokeWidth="1.50495" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="flex items-center justify-between cursor-pointer px-0 py-[15px] border-b-white border-b border-solid hover:opacity-80">
            <span className="text-white text-lg font-normal">
              Calculate your savings
            </span>
            <svg 
              width="25" 
              height="25" 
              viewBox="0 0 25 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path 
                d="M5.03186 12.1759H19.0781M19.0781 12.1759L12.055 5.15283M19.0781 12.1759L12.055 19.1991" 
                stroke="#F3F3F3" 
                strokeWidth="1.50495" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="flex items-center justify-between cursor-pointer px-0 py-[15px] border-b-white border-b border-solid hover:opacity-80">
            <span className="text-white text-lg font-normal">
              Schedule a demo
            </span>
            <svg 
              width="25" 
              height="25" 
              viewBox="0 0 25 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path 
                d="M5.0271 12.1354H19.0733M19.0733 12.1354L12.0502 5.1123M19.0733 12.1354L12.0502 19.1585" 
                stroke="#F3F3F3" 
                strokeWidth="1.50495" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#01101F] pt-[60px] pb-10 px-[100px] max-sm:pt-10 max-sm:pb-5 max-sm:px-5">
        <div className="flex gap-20 max-w-[1240px] mb-[60px] mx-auto max-md:flex-col max-md:gap-10">
          <div className="shrink-0">
            <svg 
              width="71" 
              height="88" 
              viewBox="0 0 71 88" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-[69px] h-[87px]"
            >
              <path 
                opacity="0.5" 
                d="M2.50977 78.6313H13.0005C13.9273 78.6313 14.6792 79.4222 14.6792 80.3972C14.6792 81.373 13.9273 82.1638 13.0005 82.1638H2.50977C1.58279 82.1638 0.831299 81.373 0.831299 80.3972C0.831299 79.4222 1.58279 78.6313 2.50977 78.6313Z" 
                fill="#F33728"
              />
              <path 
                d="M7.70291 73.3271H18.1938C19.1209 73.3271 19.872 74.1177 19.872 75.0933C19.872 76.0693 19.1209 76.8599 18.1938 76.8599H7.70291C6.77559 76.8599 6.02405 76.0693 6.02405 75.0933C6.02405 74.1177 6.77559 73.3271 7.70291 73.3271Z" 
                fill="#F33728"
              />
            </svg>
          </div>

          <div className="flex gap-20 flex-1 max-md:flex-col max-md:gap-10">
            <nav className="flex flex-col gap-4">
              <h4 className="text-[#A6A6A6] text-xs font-bold uppercase tracking-[-0.45px]">
                PRODUCTS
              </h4>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                RapidCode
              </a>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                RapidAudit
              </a>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                RapidCDI
              </a>
            </nav>

            <nav className="flex flex-col gap-4">
              <h4 className="text-[#A6A6A6] text-xs font-bold uppercase tracking-[-0.45px]">
                SOLUTIONS
              </h4>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                For types of outcomes
              </a>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                For types of organizations
              </a>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                For types of use cases
              </a>
            </nav>

            <nav className="flex flex-col gap-4">
              <h4 className="text-[#A6A6A6] text-xs font-bold uppercase tracking-[-0.45px]">
                RESOURCES
              </h4>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                Blog
              </a>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                Case Studies
              </a>
              <a href="#" className="text-white text-[11px] font-normal cursor-pointer transition-[color] duration-[0.2s] ease-[ease] hover:text-gray-300">
                News
              </a>
            </nav>
          </div>

          <div className="flex-1 max-w-[400px]">
            <h4 className="text-white text-lg font-semibold mb-3">
              Sign up for our newsletter
            </h4>
            <p className="text-[#A6A6A6] text-sm leading-normal mb-5">
              Stay up to date with the roadmap progress, announcements and
              exclusive discounts feel free to sign up with your email.
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
                className="h-11 text-white text-sm font-semibold cursor-pointer transition-[background] duration-[0.2s] ease-[ease] bg-[#7828C8] px-5 py-0 rounded-md border-none hover:bg-[#6a1fb8]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

    <div className="flex flex-col md:flex-row justify-between items-center w-full border-t border-gray-700 py-5 mt-4 text-center md:text-left">
      <address className="text-[#A6A6A6] text-xs not-italic mb-4 md:mb-0">
        <div>Address:</div>
        <div>100 Church Street Manhattan, New York 10007</div>
      </address>
      <div className="flex flex-col items-center md:items-end gap-2">
        <div className="text-[#A6A6A6] text-[10px] font-bold uppercase">RECOGNIZED BY</div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded bg-gray-700" />
          <div className="w-8 h-8 rounded bg-gray-700" />
        </div>
      </div>
    </div>
    <div className="flex flex-col md:flex-row justify-between items-center w-full border-t border-gray-700 pt-5 mt-4 text-center md:text-left">
      <div className="text-gray-500 text-xs">© 2024 RapidClaims. All rights reserved.</div>
      <nav className="flex gap-6 justify-center md:justify-end">
        <a href="#" className="text-gray-500 text-xs hover:text-gray-300">Terms of Service</a>
        <a href="#" className="text-gray-500 text-xs hover:text-gray-300">Privacy Policy</a>
        <a href="#" className="text-gray-500 text-xs hover:text-gray-300">Contact Info</a>
      </nav>
    </div>
  </div>
</footer>

 );
};
