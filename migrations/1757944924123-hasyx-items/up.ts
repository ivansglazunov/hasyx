import dotenv from 'dotenv';
import { up } from 'hasyx/lib/items/up-items';

dotenv.config();

(async () => {
  try {
    await up();
    console.log('✅ Items migration completed successfully');
  } catch (error) {
    console.error('❌ Items migration failed:', error);
    process.exit(1);
  }
})();

