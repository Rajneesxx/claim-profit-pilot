import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { setWebhookUrl, getWebhookUrl, setWebhookToken, getWebhookToken } from "@/utils/emailToSpreadsheet";
import { useToast } from "@/hooks/use-toast";

export const SpreadsheetSetupGuide = () => {
  const [webhookUrl, setWebhookUrlState] = useState(getWebhookUrl());
  const [token, setTokenState] = useState(getWebhookToken());
  const { toast } = useToast();

  const handleSaveWebhook = () => {
    if (webhookUrl) {
      setWebhookUrl(webhookUrl);
      toast({
        title: "Webhook URL Saved",
        description: "Your spreadsheet webhook URL has been saved successfully.",
      });
    }
  };

  const handleSaveToken = () => {
    setWebhookToken(token || '');
    toast({
      title: "Token Saved",
      description: "Shared-secret token saved to localStorage.",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>📊 Email to Spreadsheet Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Setup Instructions:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Create a webhook using Zapier, Make.com, or Google Apps Script</li>
            <li>Configure the webhook to append data to your Google Sheets</li>
            <li>Expected data fields: sender, subject, date, body, source, timestamp</li>
            <li>Enter your webhook URL below and click Save</li>
          </ol>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <div className="flex gap-2">
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrlState(e.target.value)}
            />
            <Button onClick={handleSaveWebhook} disabled={!webhookUrl}>
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-token">Shared-secret Token (optional)</Label>
          <div className="flex gap-2">
            <Input
              id="webhook-token"
              type="text"
              placeholder="Enter the same token set in your Apps Script"
              value={token}
              onChange={(e) => setTokenState(e.target.value)}
            />
            <Button onClick={handleSaveToken}>
              Save Token
            </Button>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Zapier/Apps Script:</strong> Use a shared-secret token to block unauthorized writes.
            Set the same token in your Google Apps Script and here. Our requests include it automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};