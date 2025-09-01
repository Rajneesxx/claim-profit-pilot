import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Calendar, MessageCircle, X } from 'lucide-react';

export const FloatingCTA = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const ctaOptions = [
    {
      icon: Calendar,
      label: "Book a Demo",
      action: () => window.open('https://calendly.com/rapidclaims', '_blank'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Phone,
      label: "Call Us",
      action: () => window.open('tel:+1-555-RAPID', '_blank'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: MessageCircle,
      label: "Live Chat",
      action: () => {
        // Integration with chat widget
        console.log('Opening live chat...');
      },
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {ctaOptions.map((cta, index) => (
            <Button
              key={index}
              onClick={cta.action}
              className={`${cta.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 px-4 py-3`}
            >
              <cta.icon className="h-4 w-4" />
              {cta.label}
            </Button>
          ))}
        </div>
      )}
      
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      >
        {isExpanded ? (
          <X className="h-6 w-6" />
        ) : (
          <Phone className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};