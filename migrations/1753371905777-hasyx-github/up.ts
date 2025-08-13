import dotenv from 'dotenv';
import { up } from 'hasyx/lib/github/up-github';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up(); 
