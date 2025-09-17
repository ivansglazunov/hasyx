import dotenv from 'dotenv';
import { down } from 'hasyx/lib/items/down-items';

dotenv.config();

(async () => {
  try {
    await down();
    console.log('✅ Items unmigration completed successfully');
  } catch (error) {
    console.error('❌ Items unmigration failed:', error);
    process.exit(1);
  }
})();



