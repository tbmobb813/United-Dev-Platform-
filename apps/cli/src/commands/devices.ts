import { Command } from "commander";
import chalk from "chalk";
import fetch from "node-fetch";
import pino from "pino";
const logger = pino();
import ora from "ora";
import fs from "node:fs";
import path from "node:path";

export function devicesCommand(program: Command): void {
  program
    .command("devices [action] [deviceId]")
    .description("List, remove, or manage paired devices")
    .action(async (action, deviceId) => {
      const spinner = ora();
      const projectRoot = process.cwd();
      const udpDir = path.join(projectRoot, ".udp");
      const configPath = path.join(udpDir, "config.json");
      let port = 21567;
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        port = config.syncPort || port;
      }
      if (!action || action === "list") {
        spinner.start("Fetching paired devices...");
        try {
          const res = await fetch(`http://localhost:${port}/api/devices`);
          if (!res.ok) { throw new Error("Failed to fetch devices"); }
          const data = await res.json() as { devices: Array<{ deviceId: string; info?: { name?: string }; confirmed: boolean }> };
          spinner.succeed("Paired devices:");
          if (data.devices.length === 0) {
            logger.info(chalk.dim("  (none)"));
          } else {
            for (const d of data.devices) {
              logger.info(
                `${chalk.cyan(d.deviceId)}  ${d.info?.name || "(unnamed)"}  ${d.confirmed ? chalk.green("confirmed") : chalk.yellow("pending")}`
              );
            }
          }
        } catch {
          spinner.fail("Failed to fetch devices");
        }
      } else if (action === "remove" && deviceId) {
        spinner.start(`Removing device ${deviceId}...`);
        try {
          const res = await fetch(`http://localhost:${port}/api/devices/${deviceId}`, { method: "DELETE" });
          if (!res.ok) { throw new Error("Failed to remove device"); }
          spinner.succeed(`Device ${deviceId} removed.`);
        } catch {
          spinner.fail("Failed to remove device");
        }
      } else {
        logger.error(chalk.red("Unknown action or missing deviceId."));
      }
    });
}
