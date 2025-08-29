import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getWebhookUrl, getWebhookToken, appendToSpreadsheet, buildEmailData } from "@/utils/emailToSpreadsheet";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export const SpreadsheetDebugger = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setIsChecking(true);
    console.log('🔍 Running spreadsheet diagnostics...');
    
    const diagnostics = {
      webhookUrl: getWebhookUrl(),
      webhookToken: getWebhookToken(),
      localStorage: {
        available: typeof Storage !== 'undefined',
        webhookSet: !!localStorage.getItem('spreadsheet_webhook_url'),
        tokenSet: !!localStorage.getItem('spreadsheet_webhook_token')
      },
      networkTest: null as any,
      emailValidation: null as any,
      timestamp: new Date().toISOString()
    };

    // Test email validation
    const testEmail = 'test@example.com';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    diagnostics.emailValidation = {
      email: testEmail,
      isValid: emailRegex.test(testEmail),
      regex: emailRegex.toString()
    };

    // Test network connectivity
    if (diagnostics.webhookUrl) {
      try {
        console.log('📡 Testing webhook connection to:', diagnostics.webhookUrl);
        
        const testData = buildEmailData(
          'debug@test.com',
          'Other',
          'Spreadsheet Debug Test',
          'This is a debug test from the spreadsheet debugger'
        );

        const result = await appendToSpreadsheet(testData);
        diagnostics.networkTest = {
          success: result.ok,
          result,
          error: result.ok ? null : result
        };

        if (result.ok) {
          toast({
            title: "✅ Connection Successful",
            description: "Test data sent to spreadsheet successfully",
          });
        } else {
          toast({
            title: "❌ Connection Failed",
            description: `Reason: ${result.reason || 'Unknown error'}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Network test error:', error);
        diagnostics.networkTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        
        toast({
          title: "❌ Network Error",
          description: "Failed to connect to webhook",
          variant: "destructive"
        });
      }
    } else {
      diagnostics.networkTest = {
        success: false,
        error: 'No webhook URL configured'
      };
      
      toast({
        title: "⚠️ Configuration Missing",
        description: "Webhook URL not configured",
        variant: "destructive"
      });
    }

    setDebugInfo(diagnostics);
    setIsChecking(false);
    
    console.log('🔍 Diagnostics complete:', diagnostics);
  };

  const getStatusIcon = (success: boolean | null) => {
    if (success === null) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (success: boolean | null) => {
    if (success === null) return <Badge variant="secondary">Unknown</Badge>;
    return success ? <Badge className="bg-green-100 text-green-800">OK</Badge> : <Badge variant="destructive">Failed</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Spreadsheet Integration Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button 
          onClick={runDiagnostics} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </Button>

        {debugInfo && (
          <div className="space-y-4">
            {/* Configuration Status */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Configuration Status</h3>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(!!debugInfo.webhookUrl)}
                  <span className="text-sm">Webhook URL</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(!!debugInfo.webhookUrl)}
                  {debugInfo.webhookUrl && (
                    <span className="text-xs text-muted-foreground">
                      {debugInfo.webhookUrl.substring(0, 30)}...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.localStorage.available)}
                  <span className="text-sm">LocalStorage</span>
                </div>
                {getStatusBadge(debugInfo.localStorage.available)}
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.emailValidation.isValid)}
                  <span className="text-sm">Email Validation</span>
                </div>
                {getStatusBadge(debugInfo.emailValidation.isValid)}
              </div>
            </div>

            {/* Network Test Results */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Network Test</h3>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.networkTest?.success)}
                  <span className="text-sm">Webhook Connection</span>
                </div>
                {getStatusBadge(debugInfo.networkTest?.success)}
              </div>

              {debugInfo.networkTest && !debugInfo.networkTest.success && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 text-sm">Error Details:</h4>
                  <p className="text-red-700 text-xs mt-1">
                    {debugInfo.networkTest.error || debugInfo.networkTest.result?.reason || 'Unknown error'}
                  </p>
                </div>
              )}
            </div>

            {/* Common Issues & Solutions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Common Issues & Solutions</h3>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <strong>Issue:</strong> Webhook URL not configured<br/>
                  <strong>Solution:</strong> Set localStorage.setItem('spreadsheet_webhook_url', 'your-url')
                </div>
                
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <strong>Issue:</strong> CORS errors<br/>
                  <strong>Solution:</strong> Ensure your webhook accepts POST requests with no-cors mode
                </div>
                
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <strong>Issue:</strong> Authentication failures<br/>
                  <strong>Solution:</strong> Check if your Google Apps Script is deployed as web app with proper permissions
                </div>
                
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <strong>Issue:</strong> Data not appearing in spreadsheet<br/>
                  <strong>Solution:</strong> Verify your Apps Script processes the POST data correctly (e.parameter.sender, etc.)
                </div>
              </div>
            </div>

            {/* Debug Data */}
            <details className="space-y-2">
              <summary className="font-semibold text-sm cursor-pointer">Raw Debug Data</summary>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
};