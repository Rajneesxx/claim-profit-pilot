import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield, Download, CheckCircle } from 'lucide-react';

interface ModernEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  onSubmit: () => void;
}

export const ModernEmailDialog = ({ 
  open, 
  onOpenChange, 
  userEmail, 
  setUserEmail, 
  onSubmit 
}: ModernEmailDialogProps) => {
  const [isValid, setIsValid] = useState(false);

  const handleEmailChange = (email: string) => {
    setUserEmail(email);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
            <Download className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-white">
            Get Your ROI Report
          </DialogTitle>
          <p className="text-gray-300 text-sm">
            Enter your email to receive a detailed analysis of your potential savings
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Business Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="yourname@company.com"
              value={userEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`bg-gray-800 border-gray-600 text-white h-12 ${
                isValid ? 'border-green-500' : userEmail ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {isValid && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" />
                Email format is valid
              </div>
            )}
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Your data is secure</span>
            </div>
            <p className="text-gray-400 text-xs">
              We respect your privacy and will only use your email to send you the ROI report. 
              No spam, unsubscribe anytime.
            </p>
          </div>

          <Button 
            onClick={onSubmit}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5 mr-2" />
            Get My ROI Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};