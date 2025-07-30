import dotenv from 'dotenv';
import { up } from 'hasyx/lib/up-plv8';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up(); 