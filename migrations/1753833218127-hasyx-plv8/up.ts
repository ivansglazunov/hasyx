import dotenv from 'dotenv';
import { up } from 'hasyx/lib/plv8/up-plv8';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up(); 