import dotenv from 'dotenv';
import { up } from '@/lib/files/up-storage';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up(); 