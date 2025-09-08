import dotenv from 'dotenv';
import { up } from 'hasyx/lib/options/up-options';

dotenv.config();

// Run the migration with default names; projects can adjust by editing migration
up({
  optionsViewTable: 'options',
  numbersTable: 'options_numbers',
  stringsTable: 'options_strings',
  objectsTable: 'options_objects',
  booleansTable: 'options_booleans',
  tableHandler: async () => {}
});



