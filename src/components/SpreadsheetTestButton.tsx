import { Button } from "@/components/ui/button";
import { appendToSpreadsheet, buildEmailData, getWebhookUrl } from "@/utils/emailToSpreadsheet";
import { useToast } from "@/hooks/use-toast";

export const SpreadsheetTestButton = () => {
  const { toast } = useToast();

  const testSpreadsheetConnection = async () => {
    console.log('=== TESTING SPREADSHEET WEBHOOK CONNECTION ===');
    console.log('Webhook URL:', getWebhookUrl() ? 'Found' : 'Not configured');

    try {
      // Test email data
      const testEmailData1 = buildEmailData(
        'test@example.com',
        'Sign In',
        'Test Sign In',
        'Test user signed in to the ROI Calculator'
      );

      const testEmailData2 = buildEmailData(
        'user@company.com',
        'PDF Request',
        'PDF Report Request',
        'User requested PDF report with ROI calculations'
      );

      const testEmailData3 = buildEmailData(
        'demo@example.com',
        'ROI Calculator',
        'Email Capture',
        'User provided email during ROI calculation process'
      );

      console.log('Sending test email data 1:', testEmailData1);
      const result1 = await appendToSpreadsheet(testEmailData1);
      console.log('Result 1:', result1);

      console.log('Sending test email data 2:', testEmailData2);
      const result2 = await appendToSpreadsheet(testEmailData2);
      console.log('Result 2:', result2);

      console.log('Sending test email data 3:', testEmailData3);
      const result3 = await appendToSpreadsheet(testEmailData3);
      console.log('Result 3:', result3);

      toast({
        title: "Spreadsheet Test Completed",
        description: "Check console logs and your spreadsheet for results",
      });
    } catch (error) {
      console.error('Spreadsheet test error:', error);
      toast({
        title: "Spreadsheet Test Failed",
        description: "Check console for error details",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={testSpreadsheetConnection}
      variant="outline"
      className="mb-4"
    >
      Test Spreadsheet
    </Button>
  );
};