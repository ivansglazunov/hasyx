import dotenv from 'dotenv';
import { down } from 'hasyx/lib/users/down-users';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
down();
