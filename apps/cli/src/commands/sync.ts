import { Command } from "commander";
import chalk from "chalk";

export function syncCommand(program: Command): void {
  program
    .command("sync")
    .description("Start real-time project sync across devices")
    .option("-p, --port <port>", "Override sync server port")
    .action(async (_options) => {
      console.log();
      console.log(
        chalk.yellow("⚠ ") +
          chalk.bold("udp sync") +
          " is coming in Sprint 2"
      );
      console.log();
      console.log(
        chalk.dim(
          "  This command will start the Yjs sync server, watch your\n" +
            "  project files, and display a QR code for mobile pairing.\n" +
            "\n" +
            "  For now, the CLI skeleton is working. Run:\n" +
            "    udp init     — Initialize a project\n" +
            "    udp status   — Check project status"
        )
      );
      console.log();
    });
}
