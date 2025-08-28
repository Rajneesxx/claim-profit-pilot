import { useState } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield, Download, CheckCircle, X } from 'lucide-react';

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
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="bg-card border border-border w-full max-w-lg mx-auto">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary w-16 h-16 rounded-full flex items-center justify-center">
            <Download className="h-8 w-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">
            Get Your RapidROI Analysis
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Enter your email to receive a comprehensive PDF report with detailed financial analysis and implementation recommendations
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Business Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="yourname@company.com"
              value={userEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`h-12 ${
                isValid ? 'border-green-500' : userEmail ? 'border-red-500' : ''
              }`}
            />
            {isValid && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                Email format is valid
              </div>
            )}
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-green-600 text-sm font-medium">Your data is secure</span>
            </div>
            <p className="text-muted-foreground text-xs">
              We respect your privacy and will only use your email to send you the detailed ROI analysis. 
              No spam, unsubscribe anytime.
            </p>
          </div>

          <Button 
            onClick={onSubmit}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary h-12 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5 mr-2" />
            Generate My RapidROI Report
          </Button>
        </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};