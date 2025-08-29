import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpreadsheetDebugger } from "./SpreadsheetDebugger";
import { SpreadsheetSetupGuide } from "./SpreadsheetSetupGuide";
import { SpreadsheetTestButton } from "./SpreadsheetTestButton";
import { SpreadsheetSetupHelper } from "./SpreadsheetSetupHelper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bug, TestTube, Trash2 } from "lucide-react";

export const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const clearAllData = () => {
    try {
      localStorage.removeItem('spreadsheet_webhook_url');
      localStorage.removeItem('spreadsheet_webhook_token');
      sessionStorage.removeItem('rapidclaims_signed_in');
      sessionStorage.removeItem('rapidclaims_user_email');
      
      toast({
        title: "🗑️ Data Cleared",
        description: "All stored configuration and session data has been cleared.",
      });
      
      // Reload page to reset state
      window.location.reload();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to clear data",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          <Settings className="h-4 w-4 mr-2" />
          Debug Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Admin & Debug Panel</h2>
          <div className="flex gap-2">
            <Button
              onClick={clearAllData}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Quick Setup
              </TabsTrigger>
              <TabsTrigger value="debugger" className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Debugger
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Guide
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Test
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="mt-6">
              <SpreadsheetSetupHelper />
            </TabsContent>
            
            <TabsContent value="debugger" className="mt-6">
              <SpreadsheetDebugger />
            </TabsContent>
            
            <TabsContent value="guide" className="mt-6">
              <SpreadsheetSetupGuide />
            </TabsContent>
            
            <TabsContent value="test" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Test your spreadsheet connection by sending sample data.
                  </p>
                  <SpreadsheetTestButton />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};