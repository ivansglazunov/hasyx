import dotenv from 'dotenv';
import path from 'path';
import { down } from 'hasyx/lib/payments/down-payments';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Run the migration
down();