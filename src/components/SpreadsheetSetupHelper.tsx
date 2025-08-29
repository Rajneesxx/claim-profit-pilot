import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setWebhookUrl, getWebhookUrl, appendToSpreadsheet, buildEmailData } from "@/utils/emailToSpreadsheet";

export const SpreadsheetSetupHelper = () => {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [webhookUrl, setWebhookUrlLocal] = useState(getWebhookUrl());
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const googleAppsScriptCode = `/**
 * GOOGLE APPS SCRIPT FOR EMAIL CAPTURE
 * Copy this code to script.google.com
 */

function doPost(e) {
  try {
    console.log('=== EMAIL CAPTURE REQUEST ===');
    console.log('Parameters:', e.parameter);
    
    const SPREADSHEET_ID = '${spreadsheetId || 'YOUR_SPREADSHEET_ID_HERE'}';
    const SHEET_NAME = 'Email Captures';
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 9).setValues([[
        'Timestamp', 'Email', 'Subject', 'Source', 'Body', 'Date', 'User Agent', 'Origin', 'Token'
      ]]);
    }
    
    const emailData = {
      timestamp: new Date(),
      email: e.parameter.sender || e.parameter.email || '',
      subject: e.parameter.subject || '',
      source: e.parameter.source || '',
      body: e.parameter.body || '',
      date: e.parameter.date || '',
      userAgent: e.parameter.userAgent || '',
      origin: e.parameter.triggered_from || '',
      token: e.parameter.token || ''
    };
    
    if (!emailData.email) {
      throw new Error('Email is required');
    }
    
    sheet.appendRow([
      emailData.timestamp,
      emailData.email,
      emailData.subject,
      emailData.source,
      emailData.body,
      emailData.date,
      emailData.userAgent,
      emailData.origin,
      emailData.token
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email captured successfully',
        email: emailData.email
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Email capture service is running',
      timestamp: new Date()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Copied to clipboard",
      description: "Code has been copied to your clipboard"
    });
  };

  const saveWebhookUrl = () => {
    if (webhookUrl) {
      setWebhookUrl(webhookUrl);
      toast({
        title: "✅ Webhook URL Saved",
        description: "Your Google Apps Script webhook URL has been saved"
      });
    }
  };

  const testConnection = async () => {
    if (!webhookUrl) {
      toast({
        title: "❌ Missing Webhook URL",
        description: "Please enter your Google Apps Script webhook URL first",
        variant: "destructive"
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      const testData = buildEmailData(
        'setup-test@example.com',
        'Other',
        'Setup Test - Email Capture',
        'This is a test email from the setup helper to verify the connection is working'
      );

      const result = await appendToSpreadsheet(testData);
      
      if (result.ok) {
        toast({
          title: "✅ Connection Successful!",
          description: "Test email was sent to your spreadsheet successfully"
        });
      } else {
        toast({
          title: "❌ Connection Failed",
          description: `Test failed: ${result.reason || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Connection Error",
        description: "Failed to test connection. Check your webhook URL.",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Create Spreadsheet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge>1</Badge>
            Create Google Spreadsheet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            First, create a new Google Spreadsheet to store your email captures.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={() => window.open('https://sheets.google.com/create', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Create New Spreadsheet
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="spreadsheet-id">Spreadsheet ID (from URL)</Label>
            <Input
              id="spreadsheet-id"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Copy the ID from your spreadsheet URL: https://docs.google.com/spreadsheets/d/<strong>SPREADSHEET_ID</strong>/edit
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Google Apps Script */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge>2</Badge>
            Setup Google Apps Script
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Copy this code to a new Google Apps Script project.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Google Apps Script Code</Label>
              <Button
                onClick={() => copyToClipboard(googleAppsScriptCode)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </div>
            <Textarea
              value={googleAppsScriptCode}
              readOnly
              className="h-32 text-xs font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={() => window.open('https://script.google.com/create', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Google Apps Script
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 text-sm mb-2">Deployment Instructions:</h4>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Paste the code into a new Google Apps Script project</li>
              <li>2. Save the project (give it a name like "Email Capture")</li>
              <li>3. Click "Deploy" → "New deployment"</li>
              <li>4. Choose type: "Web app"</li>
              <li>5. Execute as: "Me"</li>
              <li>6. Who has access: "Anyone"</li>
              <li>7. Copy the webhook URL provided after deployment</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Configure Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge>3</Badge>
            Configure Webhook URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Google Apps Script Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
              value={webhookUrl}
              onChange={(e) => setWebhookUrlLocal(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Paste the webhook URL you got after deploying your Google Apps Script
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={saveWebhookUrl} disabled={!webhookUrl}>
              Save Webhook URL
            </Button>
            <Button 
              onClick={testConnection} 
              variant="outline"
              disabled={!webhookUrl || isTestingConnection}
            >
              {isTestingConnection ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Issue:</strong> "Script not found" or 403 errors<br/>
              <strong>Solution:</strong> Ensure the script is deployed as a web app with "Anyone" access
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Issue:</strong> Data not appearing in spreadsheet<br/>
              <strong>Solution:</strong> Check the spreadsheet ID in your Google Apps Script matches your actual spreadsheet
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Issue:</strong> Permission errors<br/>
              <strong>Solution:</strong> Make sure you authorize the script to access Google Sheets when first running it
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};