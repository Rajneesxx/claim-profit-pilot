import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NavigationHeader = () => {
  return (
    <header className="bg-slate-900 w-full fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-red-500 flex items-center justify-center transform rotate-45">
            <span className="text-white font-bold text-lg transform -rotate-45">X</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 ml-12">
          <button className="flex items-center space-x-1 text-white font-bold text-sm hover:text-gray-300 transition-colors">
            <span>PRODUCTS</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <a 
            href="#" 
            className="text-white font-bold text-sm hover:text-gray-300 transition-colors"
          >
            SOLUTIONS
          </a>
          <a 
            href="#" 
            className="text-white font-bold text-sm hover:text-gray-300 transition-colors"
          >
            RESOURCES
          </a>
        </nav>

        {/* Right Side - Login and CTA */}
        <div className="flex items-center space-x-6">
          <a 
            href="#" 
            className="hidden lg:block text-white font-bold text-sm hover:text-gray-300 transition-colors"
          >
            LOGIN
          </a>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md text-sm transition-colors flex items-center space-x-2"
            style={{ backgroundColor: '#FF442B' }}
          >
            <span>REQUEST A DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};