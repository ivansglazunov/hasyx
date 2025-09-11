import dotenv from 'dotenv';
import { down } from 'hasyx/lib/options/down-options';

dotenv.config();

// Run the down migration with same names as up migration
(async () => {
  try {
    await down({
      optionsTable: 'options'
    });
    console.log('✅ Options down migration completed successfully');
  } catch (error) {
    console.error('❌ Options down migration failed:', error);
    process.exit(1);
  }
})();



