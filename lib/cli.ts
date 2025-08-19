#!/usr/bin/env node

import { Command } from 'commander';
import { setupCommands } from 'hasyx/lib/cli-hasyx';

const program = new Command();

// Register commands (defaults to packageName "hasyx")
setupCommands(program);

program.parse(process.argv);


