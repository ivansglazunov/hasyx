import dotenv from 'dotenv';
import { up } from 'hasyx/lib/notify/up-notify';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up(); 