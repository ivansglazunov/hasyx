import dotenv from 'dotenv';
import { up } from 'hasyx/lib/items/up-item-options';

dotenv.config();

(async () => {
  try {
    await up();
    console.log('✅ Item-options migration completed successfully');
  } catch (error) {
    console.error('❌ Item-options migration failed:', error);
    process.exit(1);
  }
})();
