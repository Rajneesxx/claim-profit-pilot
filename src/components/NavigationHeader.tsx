import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NavigationHeader = () => {
  return (
          <header className="bg-slate-900 fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg shadow-lg">
        <div className="flex items-center justify-between h-12 px-6 w-auto">

        {/* Logo */}
        <div className="flex-shrink-0">
          <img 
            src="/lovable-uploads/f375585e-a028-4771-aeca-4d548db422ca.png" 
            alt="RapidClaims Logo" 
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 ml-12">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 text-white font-bold text-sm hover:text-gray-300 transition-colors bg-transparent border-none">
              <span>PRODUCTS</span>
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700">
              <DropdownMenuItem asChild>
                <a 
                  href="https://www.rapidclaims.ai/products/rapid-code"
                  className="text-white hover:text-gray-300 cursor-pointer"
                >
                  RapidCode
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a 
                  href="https://www.rapidclaims.ai/products/rapid-scrub"
                  className="text-white hover:text-gray-300 cursor-pointer"
                >
                  RapidScrub
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a 
                  href="https://www.rapidclaims.ai/products/rapid-cdi"
                  className="text-white hover:text-gray-300 cursor-pointer"
                >
                  RapidCDI
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a 
            href="https://www.rapidclaims.ai/solutions" 
            className="text-white font-bold text-sm hover:text-gray-300 transition-colors"
          >
            SOLUTIONS
          </a>
          <a 
            href="https://www.rapidclaims.ai/resources/blogs" 
            className="text-white font-bold text-sm hover:text-gray-300 transition-colors"
          >
            RESOURCES
          </a>
        </nav>

        {/* Right Side - CTA */}
        <div className="flex items-center">
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md text-sm transition-colors flex items-center space-x-2"
            style={{ backgroundColor: '#FF442B' }}
            asChild
          >
            <a href="https://www.rapidclaims.ai/get-in-touch">
              <span>REQUEST A DEMO</span>
              <ArrowRight className="w-4 h-4" />
            </a>
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
