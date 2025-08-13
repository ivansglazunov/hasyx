import dotenv from 'dotenv';
import { down } from 'hasyx/lib/github/down-github';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
down(); 
