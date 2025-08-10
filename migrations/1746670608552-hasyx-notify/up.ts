import dotenv from 'dotenv';
import { up } from '@/lib/notify/up-notify';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up(); 