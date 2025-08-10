import dotenv from 'dotenv';
import { up } from '@/lib/plv8/up-plv8';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up(); 