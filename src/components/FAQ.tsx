import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How soon can we expect to see a measurable return on our investment?",
    answer: "Most clients begin seeing measurable ROI within 3 to 6 months of deployment. By accelerating coding throughput, reducing denial rates, and improving risk capture, our AI quickly drives both cost savings and revenue lift. Many organizations also see immediate benefits in backlog clearance and faster claim submission cycles."
  },
  {
    question: "How do you ensure the accuracy of the AI's coding suggestions?",
    answer: "Our platform is built with a hybrid approach that combines advanced natural language processing with clinical knowledge models. Each code is generated with confidence scoring, routed to human review when necessary, and continuously validated against audited results. This ensures consistently high accuracy levels, with many deployments achieving 98% coding precision."
  },
  {
    question: "How does the AI stay updated with the latest coding regulations and guidelines?",
    answer: "The system is continuously trained and updated with the latest ICD, CPT, HCPCS, and payer-specific guidelines. Our compliance team works closely with coders and regulatory experts to integrate rule changes in real time, ensuring that every claim aligns with current requirements. This proactive updating helps clients stay compliant, reduce audit risks, and capture full reimbursement."
  }
];

export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([1]); // Second item open by default

  const toggleItem = (index: number) => {
    console.log('FAQ toggleItem clicked:', index);
    console.log('Current openItems before toggle:', openItems);
    
    setOpenItems(prev => {
      const newItems = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      console.log('New openItems after toggle:', newItems);
      return newItems;
    });
  };

  return (
    <section className="w-full relative px-[100px] py-20 max-sm:px-5 max-sm:py-10">
      {/* Blurred background gradient */}
      <div 
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, #7E22CE 0%, #065D3F 70%, transparent 100%)`
        }}
      />
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
    
    {/* LEFT COLUMN: 4/12 width (~33%) */}
    <div className="lg:col-span-4 flex flex-col items-start justify-center text-left">
      {/* Icon + Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
          {/* ICON */}
           <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-help-circle"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9a3 3 0 0 1 3-3c1.5 0 3 1 3 3 0 2-3 3-3 5" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </svg>
        </div>
        <h2 className="text-slate-700 text-4xl font-bold tracking-wide">FAQs</h2>
      </div>

      {/* Subtitle */}
      <p className="text-slate-700 text-lg font-medium tracking-wide leading-relaxed mb-8 max-w-md">
        Didn't find what you're looking for? Reach out to us anytime.
      </p>

      {/* Contact Button */}
<button 
  onClick={() => window.open('https://www.rapidclaims.ai/get-in-touch', '_blank')}
  className="flex items-center justify-center gap-3 w-full lg:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
  </svg>
  Contact Us
</button>


    </div>

    {/* RIGHT COLUMN: 8/12 width (~67%) */}
    <div className="lg:col-span-8 flex flex-col w-full">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden w-full">
        {faqData.map((item, index) => (
          <div key={index} className={`border-b border-gray-200 last:border-b-0 ${openItems.includes(index) ? 'bg-purple-50' : ''}`}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('FAQ button clicked, toggling item:', index);
                toggleItem(index);
              }}
              className={`flex items-center justify-between cursor-pointer w-full text-left p-6 hover:bg-gray-50 transition-colors relative z-10 ${
                openItems.includes(index) ? 'bg-purple-50 hover:bg-purple-50' : ''
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <span className={`text-base font-semibold pr-4 ${
                openItems.includes(index) ? 'text-primary' : 'text-gray-800'
              }`}>
                {item.question}
              </span>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                openItems.includes(index) 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {openItems.includes(index) ? '−' : '+'}
              </div>
            </button>
            {openItems.includes(index) && (
              <div className="px-6 pb-6">
                <div className="text-gray-600 text-sm leading-relaxed">
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

  </div>
</section>
  );
};
