import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  onSubmit: () => void;
}

export const SignInDialog = ({ 
  open, 
  onOpenChange, 
  userEmail, 
  setUserEmail, 
  onSubmit 
}: SignInDialogProps) => {
  const [isValid, setIsValid] = useState(false);

  const handleEmailChange = (email: string) => {
    setUserEmail(email);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border border-border w-full max-w-md mx-auto rounded-2xl">
        <DialogHeader className="text-center space-y-6 pb-2">
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Find Out How Much You Could Recover
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 px-2">
          <div className="space-y-3">
            <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
              Company Email
            </Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="Eg. jondoh@mercy.xyz"
              value={userEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="h-12 text-base rounded-lg border-border"
            />
          </div>

          <Button 
            onClick={onSubmit}
            disabled={!isValid}
            className="w-full h-12 text-lg font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Results
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};