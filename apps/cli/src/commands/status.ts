import { Command } from "commander";
import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";
import logger from "@udp/logger";

export function statusCommand(program: Command): void {
  program
    .command("status")
    .description("Show UDP project status")
    .action(async () => {
      const configPath = path.join(process.cwd(), ".udp", "config.json");

      if (!fs.existsSync(configPath)) {
        logger.warn(chalk.yellow("UDP is not initialized in this directory."));
        logger.info(chalk.dim("Run ") + chalk.cyan("udp init") + chalk.dim(" to get started."));
        return;
      }

      let config: any;
      try {
        const rawConfig = fs.readFileSync(configPath, "utf-8");
        config = JSON.parse(rawConfig);
      } catch (error) {
        logger.error(chalk.red("Failed to read UDP project configuration."));
        logger.warn(
          chalk.yellow(
            "Your .udp/config.json file appears to be missing or corrupted. Please re-run "
          ) +
            chalk.cyan("udp init") +
            chalk.yellow(" to recreate it.")
        );
        process.exit(1);
      }

      logger.info(
        "\n" +
          chalk.bold.blue("UDP Project Status") +
          "\n" +
          chalk.dim("─".repeat(40)) +
          "\n" +
          chalk.bold("  Project:    ") +
          config.projectName +
          "\n" +
          chalk.bold("  Frameworks: ") +
          (config.frameworks?.length > 0
            ? config.frameworks.join(", ")
            : chalk.dim("none detected")) +
          "\n" +
          chalk.bold("  Sync port:  ") +
          config.syncPort +
          "\n" +
          chalk.bold("  Initialized: ") +
          new Date(config.createdAt).toLocaleDateString() +
          "\n" +
          chalk.dim("─".repeat(40))
      );

      // Check devices
      const devicesPath = path.join(process.cwd(), ".udp", "devices.json");
      if (fs.existsSync(devicesPath)) {
        try {
          const rawDevices = fs.readFileSync(devicesPath, "utf-8");
          const devices = JSON.parse(rawDevices);
          logger.info(chalk.bold("  Devices:    ") + devices.length + " paired");
        } catch (error) {
          logger.warn(
            chalk.yellow(
              "Your .udp/devices.json file appears to be corrupted. Ignoring devices for this command."
            )
          );
          logger.info(chalk.bold("  Devices:    ") + chalk.dim("none paired"));
        }
      } else {
        logger.info(chalk.bold("  Devices:    ") + chalk.dim("none paired"));
      }

      // Check sync status
      logger.info(chalk.bold("  Sync:       ") + chalk.dim("not running"));
      logger.info("\n" + chalk.dim("Run ") + chalk.cyan("udp sync") + chalk.dim(" to start syncing"));
    });
}
