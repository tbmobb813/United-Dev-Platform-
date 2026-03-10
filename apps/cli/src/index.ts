#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { analyzeCommand } from "./commands/analyze.js";
import { initCommand } from "./commands/init.js";
import { statusCommand } from "./commands/status.js";
import { syncCommand } from "./commands/sync.js";
import { devicesCommand } from "./commands/devices.js";

const program = new Command();

program
  .name("udp")
  .description(
    chalk.bold("UDP") +
      " — Cross-platform developer workflow tool\n" +
      "  Sync your project across devices, preview on mobile, analyze cross-platform parity."
  )
  .version("0.1.0");

// Register commands
analyzeCommand(program);
initCommand(program);
statusCommand(program);
syncCommand(program);
devicesCommand(program);

program.parse();
