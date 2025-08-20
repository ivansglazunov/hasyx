import dotenv from 'dotenv';
import { up } from 'hasyx/lib/invite/up-invites';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up();
