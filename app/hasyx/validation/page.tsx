'use client';

import { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { emailSchema } from '@/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Convert Zod schema to JSON Schema for react-jsonschema-form
const jsonSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
      description: 'Please enter a valid email address',
    },
  },
  required: ['email'],
};

const uiSchema = {
  email: {
    'ui:placeholder': 'Enter your email address',
    'ui:widget': 'email',
  },
};

export default function ValidationPage() {
  const [formData, setFormData] = useState<any>({});
  const [validationResult, setValidationResult] = useState<any>(null);
  const [serverResponse, setServerResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setFormData(data.formData);
    
    // Validate with Zod
    try {
      const result = emailSchema.parse(data.formData);
      setValidationResult({ success: true, data: result });
    } catch (error: any) {
      setValidationResult({ 
        success: false, 
        error: error.errors?.[0]?.message || 'Validation failed' 
      });
    }
  };

  const handleChange = (data: any) => {
    setFormData(data.formData);
  };

  const testServerSubmission = async () => {
    setIsLoading(true);
    setServerResponse(null);
    
    try {
      // Simulate server request
      const response = await fetch('/api/validation/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      setServerResponse(result);
    } catch (error) {
      setServerResponse({ 
        success: false, 
        error: 'Failed to connect to server',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Form Validation</h1>
        <p className="text-muted-foreground">
          Test form validation using react-jsonschema-form and Zod
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Email Validation Form</CardTitle>
            <CardDescription>
              Enter an email address to test validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              schema={jsonSchema}
              uiSchema={uiSchema}
              onSubmit={handleSubmit}
              validator={validator}
              onChange={handleChange}
              formData={formData}
            >
              <Button type="submit" className="mt-4">
                Validate Email
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* Schema Display */}
        <Card>
          <CardHeader>
            <CardTitle>Zod Schema</CardTitle>
            <CardDescription>
              The validation schema used for this form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
              <code>{`import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Validation Result
              <Badge variant={validationResult.success ? 'default' : 'destructive'}>
                {validationResult.success ? 'Valid' : 'Invalid'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationResult.success ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">✅ Email is valid!</p>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  {JSON.stringify(validationResult.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-600 font-medium">❌ Validation failed</p>
                <p className="text-red-500">{validationResult.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Server Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Server Test</CardTitle>
          <CardDescription>
            Test sending current form data to server (even if invalid)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={testServerSubmission} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Sending...' : 'Test Server Submission'}
            </Button>
            {formData.email && (
              <Badge variant="secondary">
                Current data: {formData.email}
              </Badge>
            )}
          </div>

          {serverResponse && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center gap-2">
                <Badge variant={serverResponse.success ? 'default' : 'destructive'}>
                  {serverResponse.success ? 'Success' : 'Error'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Server Response
                </span>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(serverResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
