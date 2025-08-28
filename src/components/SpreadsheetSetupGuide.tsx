import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { setWebhookUrl, getWebhookUrl } from "@/utils/emailToSpreadsheet";
import { useToast } from "@/hooks/use-toast";

export const SpreadsheetSetupGuide = () => {
  const [webhookUrl, setWebhookUrlState] = useState(getWebhookUrl());
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

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Zapier Example:</strong> Create a new Zap with "Webhook by Zapier" trigger → 
            "Google Sheets" action to append new rows with the email data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};