import { Command } from "commander";
import chalk from "chalk";
import pino from "pino";
const logger = pino();

export function syncCommand(program: Command): void {
  program
    .command("sync")
    .description("Start real-time project sync across devices")
    .option("-p, --port <port>", "Override sync server port")
    .action(async (_options) => {
      logger.info("\n" +
        chalk.yellow("⚠ ") +
        chalk.bold("udp sync") +
        " is coming in Sprint 2\n" +
        chalk.dim(
          "  This command will start the Yjs sync server, watch your\n" +
          "  project files, and display a QR code for mobile pairing.\n" +
          "\n" +
          "  For now, the CLI skeleton is working. Run:\n" +
          "    udp init     — Initialize a project\n" +
          "    udp status   — Check project status"
        ) +
        "\n"
      );
    });
}
