import dotenv from 'dotenv';
import { down } from '../../lib/github/down-github';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
down(); 
