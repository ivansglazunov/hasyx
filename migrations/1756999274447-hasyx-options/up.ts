import dotenv from 'dotenv';
import { up } from 'hasyx/lib/options/up-options';

dotenv.config();

// Run the migration with default names; projects can adjust by editing migration
(async () => {
  try {
    await up({
      optionsTable: 'options',
      tableHandler: async () => {}
    });
    console.log('✅ Options migration completed successfully');
  } catch (error) {
    console.error('❌ Options migration failed:', error);
    process.exit(1);
  }
})();



