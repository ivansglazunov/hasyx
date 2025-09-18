import dotenv from 'dotenv';
import { down } from 'hasyx/lib/items/down-item-options';

dotenv.config();

(async () => {
  try {
    await down();
    console.log('✅ Item-options unmigration completed successfully');
  } catch (error) {
    console.error('❌ Item-options unmigration failed:', error);
    process.exit(1);
  }
})();
