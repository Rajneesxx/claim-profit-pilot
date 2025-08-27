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
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="w-full relative px-[100px] py-20 max-sm:px-5 max-sm:py-10">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center mb-12">
        {/* FAQ Header with Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path 
                d="M22.5 28.125C22.5 28.6195 22.3534 29.1028 22.0787 29.5139C21.804 29.925 21.4135 30.2455 20.9567 30.4347C20.4999 30.6239 19.9972 30.6734 19.5123 30.577C19.0273 30.4805 18.5819 30.2424 18.2322 29.8928C17.8826 29.5431 17.6445 29.0977 17.548 28.6127C17.4516 28.1278 17.5011 27.6251 17.6903 27.1683C17.8795 26.7115 18.2 26.321 18.6111 26.0463C19.0222 25.7716 19.5056 25.625 20 25.625C20.663 25.625 21.2989 25.8884 21.7678 26.3572C22.2366 26.8261 22.5 27.462 22.5 28.125ZM36.875 20C36.875 23.3376 35.8853 26.6002 34.0311 29.3752C32.1768 32.1503 29.5413 34.3132 26.4578 35.5905C23.3743 36.8677 19.9813 37.2019 16.7079 36.5508C13.4344 35.8996 10.4276 34.2924 8.06758 31.9324C5.70757 29.5724 4.10038 26.5656 3.44926 23.2921C2.79813 20.0187 3.13231 16.6257 4.40954 13.5422C5.68677 10.4587 7.84968 7.8232 10.6248 5.96895C13.3998 4.1147 16.6624 3.125 20 3.125C24.474 3.12996 28.7634 4.90945 31.927 8.07305C35.0906 11.2367 36.87 15.526 36.875 20ZM33.125 20C33.125 17.4041 32.3552 14.8665 30.913 12.7081C29.4709 10.5497 27.421 8.86748 25.0227 7.87408C22.6244 6.88068 19.9854 6.62076 17.4394 7.12719C14.8934 7.63362 12.5548 8.88366 10.7192 10.7192C8.88367 12.5548 7.63363 14.8934 7.1272 17.4394C6.62077 19.9854 6.88069 22.6244 7.87409 25.0227C8.86749 27.421 10.5498 29.4708 12.7081 30.913C14.8665 32.3552 17.4041 33.125 20 33.125C23.4798 33.1213 26.8161 31.7373 29.2767 29.2767C31.7373 26.8161 33.1213 23.4798 33.125 20ZM20 10C16.2094 10 13.125 12.8031 13.125 16.25V16.875C13.125 17.3723 13.3226 17.8492 13.6742 18.2008C14.0258 18.5525 14.5027 18.75 15 18.75C15.4973 18.75 15.9742 18.5525 16.3258 18.2008C16.6775 17.8492 16.875 17.3723 16.875 16.875V16.25C16.875 14.8719 18.2813 13.75 20 13.75C21.7188 13.75 23.125 14.8719 23.125 16.25C23.125 17.6281 21.7188 18.75 20 18.75C19.5027 18.75 19.0258 18.9475 18.6742 19.2992C18.3226 19.6508 18.125 20.1277 18.125 20.625V21.875C18.1239 22.3382 18.2943 22.7855 18.6034 23.1305C18.9125 23.4756 19.3383 23.694 19.7989 23.7437C20.2595 23.7934 20.7221 23.6708 21.0977 23.3996C21.4732 23.1284 21.7351 22.7278 21.8328 22.275C24.7359 21.5437 26.875 19.1203 26.875 16.25C26.875 12.8031 23.7906 10 20 10Z" 
                fill="white"
              />
            </svg>
          </div>
          <h2 className="text-slate-700 text-4xl font-bold tracking-wide">FAQs</h2>
        </div>

        {/* Optional subtitle */}
        <p className="text-slate-700 text-lg font-medium tracking-wide text-center max-w-xl leading-relaxed">
          Find answers to the most common questions below.
        </p>
      </div>

      {/* Full-width FAQ accordion */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden w-full">
          {faqData.map((item, index) => (
            <div key={index}
              className={`border-b border-gray-200 last:border-b-0 ${openItems.includes(index) ? 'bg-purple-50' : ''}`}
            >
              <button
                onClick={() => toggleItem(index)}
                className={`flex items-center justify-between cursor-pointer w-full text-left p-6 hover:bg-gray-50 transition-colors ${
                  openItems.includes(index) ? 'bg-purple-50 hover:bg-purple-50' : ''
                }`}
              >
                <span className={`text-base font-semibold pr-4 ${
                  openItems.includes(index) ? 'text-primary' : 'text-gray-800'
                }`}>
                  {item.question}
                </span>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  openItems.includes(index) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
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
    </section>
  );
};
