import dotenv from 'dotenv';
import { down } from 'hasyx/lib/options/down-options';

dotenv.config();

// Run the down migration with same names as up migration
down({
  optionsViewTable: 'options',
  numbersTable: 'options_numbers',
  stringsTable: 'options_strings',
  objectsTable: 'options_objects',
  booleansTable: 'options_booleans'
});



