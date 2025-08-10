import React from 'react';
import { renderForm } from './lib/ink';
import { hasuraSchema } from './lib/config';
import { Form } from './lib/ink';

async function main() {
  await renderForm(
    <Form 
      schema={hasuraSchema} 
      onSubmit={(formData) => {
        console.log('Form submitted with data:', formData);
        process.exit(0);
      }}
    />
  );
}

main().catch(console.error); 