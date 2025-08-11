import dotenv from 'dotenv';
import path from 'path';
import { up } from '@/lib/payments/up-payments';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Run the migration
up();
