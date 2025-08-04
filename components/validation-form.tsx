'use client';

import { useState, useEffect } from 'react';
import { Input } from 'hasyx/components/ui/input';
import { Label } from 'hasyx/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Badge } from 'hasyx/components/ui/badge';
import { schema } from 'hasyx/schema';

const emailSchema = schema.email;

interface ValidationFormProps {
  className?: string;
}

export default function ValidationForm({ className }: ValidationFormProps) {
  const [email, setEmail] = useState('');
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
  } | null>(null);

  // Автоматическая валидация при изменении email
  useEffect(() => {
    if (!email) {
      setValidationResult(null);
      return;
    }

    try {
      const result = emailSchema.parse({ email });
      setValidationResult({ success: true, data: result });
    } catch (error: any) {
      setValidationResult({ 
        success: false, 
        error: error.errors?.[0]?.message || 'Validation failed' 
      });
    }
  }, [email]);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Email Validation</CardTitle>
          <CardDescription>
            Enter an email address to test real-time validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={validationResult && !validationResult.success ? 'border-red-500' : ''}
            />
          </div>

          {validationResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Validation Status:</span>
                <Badge variant={validationResult.success ? 'default' : 'destructive'}>
                  {validationResult.success ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
              
              {validationResult.success ? (
                <div className="space-y-2">
                  <p className="text-green-600 text-sm">✅ Email is valid!</p>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(validationResult.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-600 text-sm">❌ Validation failed</p>
                  <p className="text-red-500 text-sm">{validationResult.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schema Display */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Zod Schema</CardTitle>
          <CardDescription>
            The validation schema used for this form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
            <code>{`// From schema.tsx
import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Used in this form:
const result = emailSchema.parse({ email });`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
} 