import { Button } from "@/components/ui/button";
import { sendSlackMessage, buildSignInBlocks, buildEmailCaptureBlocks, getSlackBotToken, getSlackChannel } from "@/utils/slack";
import { useToast } from "@/hooks/use-toast";

export const SlackTestButton = () => {
  const { toast } = useToast();

  const testSlackConnection = async () => {
    const testEmail = 'test@example.com';
    const ts = new Date();
    
    console.log('=== TESTING SLACK BOT CONNECTION ===');
    console.log('Bot Token:', getSlackBotToken() ? 'Found' : 'Not configured');
    console.log('Channel:', getSlackChannel());
    
    try {
      // Test basic message
      const result1 = await sendSlackMessage('🧪 Test message from ROI Calculator');
      console.log('Basic message result:', result1);
      
      // Test sign-in notification
      const result2 = await sendSlackMessage(
        `🧪 Test Sign-In: ${testEmail}`, 
        buildSignInBlocks(testEmail, ts.toLocaleString())
      );
      console.log('Sign-in test result:', result2);
      
      // Test email capture notification
      const result3 = await sendSlackMessage(
        `🧪 Test Email Capture: ${testEmail}`,
        buildEmailCaptureBlocks(testEmail, 'ROI Calculator', ts.toLocaleString())
      );
      console.log('Email capture test result:', result3);
      
      toast({
        title: "Slack Bot Test Completed",
        description: "Check console logs and Slack channel for results",
      });
    } catch (error) {
      console.error('Slack test error:', error);
      toast({
        title: "Slack Bot Test Failed",
        description: "Check console for error details",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={testSlackConnection}
      variant="outline"
      className="fixed bottom-4 right-4 z-50 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
    >
      Test Slack
    </Button>
  );
};