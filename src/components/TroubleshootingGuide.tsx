import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

export const TroubleshootingGuide = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Spreadsheet Integration Troubleshooting Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Common Issues */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Common Issues & Solutions</h3>
          
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Issue: Sign-in data not appearing in spreadsheet</div>
                <div className="text-sm space-y-1">
                  <div>• Check if webhook URL is properly configured in localStorage</div>
                  <div>• Verify Google Apps Script is deployed as a web app</div>
                  <div>• Ensure the script has permissions to edit the spreadsheet</div>
                  <div>• Check the Apps Script execution log for errors</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Issue: CORS errors in browser console</div>
                <div className="text-sm space-y-1">
                  <div>• This is normal when using 'no-cors' mode</div>
                  <div>• Data may still be sent successfully</div>
                  <div>• Check your spreadsheet to verify data arrival</div>
                  <div>• Use the debug panel to test connection</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Issue: Google Apps Script configuration</div>
                <div className="text-sm space-y-1">
                  <div>• Deploy as web app with "Anyone" access</div>
                  <div>• Execute as "Me" (your account)</div>
                  <div>• Grant necessary permissions to access spreadsheet</div>
                  <div>• Use proper POST data parsing: e.parameter.sender, etc.</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Debug Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Debug Steps</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="font-medium">1. Check Configuration</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Open browser console (F12)</div>
                <div>• Check for webhook URL logs</div>
                <div>• Verify localStorage has the URL set</div>
                <div>• Use admin panel to test connection</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="font-medium">2. Test Network</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Use the debug panel's test function</div>
                <div>• Check browser network tab for requests</div>
                <div>• Verify requests reach the webhook URL</div>
                <div>• Look for 200 status codes</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="font-medium">3. Verify Data Format</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Check console logs for sent data</div>
                <div>• Ensure email format is valid</div>
                <div>• Verify timestamp formatting</div>
                <div>• Check for special characters</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="font-medium">4. Apps Script Issues</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Check execution transcript</div>
                <div>• Verify function is triggered</div>
                <div>• Test script with sample data</div>
                <div>• Review spreadsheet permissions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Required Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Expected Data Fields</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'sender', 'email', 'subject', 'source', 
              'body', 'date', 'timestamp', 'triggered_from'
            ].map(field => (
              <Badge key={field} variant="secondary" className="justify-center py-2">
                {field}
              </Badge>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Your Google Apps Script should handle these fields from the POST request.
            Access them using <code className="bg-muted px-1 rounded">e.parameter.sender</code>, 
            <code className="bg-muted px-1 rounded">e.parameter.email</code>, etc.
          </div>
        </div>

        {/* Sample Apps Script */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sample Google Apps Script</h3>
          
          <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <pre>{`function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = e.parameter;
    
    sheet.appendRow([
      data.sender || data.email,
      data.subject || '',
      data.source || '',
      data.body || '',
      data.date || '',
      data.timestamp || '',
      data.triggered_from || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};