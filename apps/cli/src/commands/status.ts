import { Command } from "commander";
import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";

export function statusCommand(program: Command): void {
  program
    .command("status")
    .description("Show UDP project status")
    .action(async () => {
      const configPath = path.join(process.cwd(), ".udp", "config.json");

      if (!fs.existsSync(configPath)) {
        console.log(
          chalk.yellow("UDP is not initialized in this directory.")
        );
        console.log(
          chalk.dim("Run ") +
            chalk.cyan("udp init") +
            chalk.dim(" to get started.")
        );
        return;
      }

      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

      console.log();
      console.log(chalk.bold.blue("UDP Project Status"));
      console.log(chalk.dim("─".repeat(40)));
      console.log(chalk.bold("  Project:    ") + config.projectName);
      console.log(
        chalk.bold("  Frameworks: ") +
          (config.frameworks?.length > 0
            ? config.frameworks.join(", ")
            : chalk.dim("none detected"))
      );
      console.log(chalk.bold("  Sync port:  ") + config.syncPort);
      console.log(
        chalk.bold("  Initialized: ") +
          new Date(config.createdAt).toLocaleDateString()
      );
      console.log(chalk.dim("─".repeat(40)));

      // Check devices
      const devicesPath = path.join(process.cwd(), ".udp", "devices.json");
      if (fs.existsSync(devicesPath)) {
        const devices = JSON.parse(fs.readFileSync(devicesPath, "utf-8"));
        console.log(
          chalk.bold("  Devices:    ") + devices.length + " paired"
        );
      } else {
        console.log(
          chalk.bold("  Devices:    ") + chalk.dim("none paired")
        );
      }

      // Check sync status
      console.log(
        chalk.bold("  Sync:       ") + chalk.dim("not running")
      );
      console.log();
      console.log(
        chalk.dim("Run ") +
          chalk.cyan("udp sync") +
          chalk.dim(" to start syncing")
      );
    });
}
