import readline from "readline";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import pino from "pino";
import qrcode from "qrcode-terminal";

const logger = pino();

export function syncCommand(program: Command): void {
  program
    .command("sync")
    .description("Start real-time project sync across devices")
    .option("-p, --port <port>", "Override sync server port")
    .action(async (options) => {
      const spinner = ora("Starting UDP sync server...").start();
      const projectRoot = process.cwd();
      const udpDir = path.join(projectRoot, ".udp");
      const configPath = path.join(udpDir, "config.json");
      let port = options.port;
      if (!port && fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        port = config.syncPort;
      }
      port = port || 21567;

      // Start sync-server as a child process
      const serverPath = path.resolve(__dirname, "../../../sync-server/server.js");
      const serverProc = spawn("node", [serverPath], {
        env: { ...process.env, PORT: port },
        stdio: "ignore",
        detached: true,
      });
      serverProc.unref();
      spinner.succeed(`Sync server started on port ${port}`);

      // Poll for QR code endpoint and extract pairing token
      const qrUrl = `http://localhost:${port}/api/devices/qr?roomId=default`;
      spinner.start("Waiting for QR code...");
      let pairingToken = null;
      let pairingUrl = null;
      for (let i = 0; i < 10; i++) {
        try {
          const res = await fetch(qrUrl);
          if (res.ok) {
            // QR endpoint now returns JSON with token, pairingUrl, and qr data URL
            const data = (await res.json()) as { token: string; pairingUrl: string; qr: string };
            pairingToken = data.token;
            pairingUrl = data.pairingUrl;
            break;
          }
        } catch { /* retry on fetch error */ }
        await new Promise(r => setTimeout(r, 500));
      }
      if (pairingToken && pairingUrl) {
        spinner.succeed("Scan this QR code to pair a device:");
        qrcode.generate(pairingUrl, { small: true });
      } else {
        spinner.fail("Failed to fetch QR code from sync server.");
        return;
      }

      // Register this device (simulate mobile scan for now)
      const deviceId = randomUUID();
      const deviceInfo = {
        name: `CLI Device (${process.env.USER || process.env.USERNAME || "unknown"})`,
        platform: process.platform,
        createdAt: new Date().toISOString(),
      };
      const registerRes = await fetch(`http://localhost:${port}/api/devices/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: pairingToken, deviceId, info: deviceInfo }),
      });
      if (!registerRes.ok) {
        spinner.fail("Device registration failed.");
        return;
      }
      spinner.succeed("Device registered, awaiting confirmation...");

      // Prompt user to confirm device
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      await new Promise(resolve => {
        rl.question(chalk.yellow("Confirm device pairing? (y/n): "), async answer => {
          if (answer.trim().toLowerCase() === "y") {
            // Prompt for auth token if not set in env
            let authToken = process.env.UDP_PAIR_AUTH;
            if (!authToken) {
              rl.question(chalk.cyan("Enter pairing auth token: "), tokenInput => {
                rl.close();
                authToken = tokenInput.trim();
                confirmDevice(authToken);
              });
            } else {
              rl.close();
              confirmDevice(authToken);
            }
            async function confirmDevice(authToken: string) {
              const confirmRes = await fetch(`http://localhost:${port}/api/devices/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId, authToken }),
              });
              if (confirmRes.ok) {
                spinner.succeed("Device pairing confirmed!");
                // Save device info
                const devicesPath = path.join(udpDir, "devices.json");
                let devices = [];
                if (fs.existsSync(devicesPath)) {
                  devices = JSON.parse(fs.readFileSync(devicesPath, "utf-8"));
                }
                devices.push({ deviceId, ...deviceInfo, confirmed: true });
                fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));
                logger.info(chalk.green("Device pairing complete!"));

                // Set up file sync with ProjectSyncManager
                spinner.start("Setting up file synchronization...");
                try {
                  const { NodeFileSystem } = await import("@udp/filesystem");
                  const { ProjectSyncManager } = await import("@udp/editor-core");
                  const WebSocket = (await import("ws")).default;

                  // Initialize file system and sync manager
                  const fsInstance = new NodeFileSystem(projectRoot);
                  const manager = new ProjectSyncManager(fsInstance);

                  // Connect to Yjs sync server
                  const wsUrl = `ws://localhost:${port}/default`;
                  const ws = new WebSocket(wsUrl);

                  ws.on("open", () => {
                    spinner.succeed("File sync connected!");
                    logger.info(chalk.green("Monitoring project for changes..."));
                  });

                  ws.on("close", () => {
                    logger.info("File sync disconnected");
                  });

                  ws.on("error", (error) => {
                    logger.error({ err: error }, "File sync error");
                  });

                  // Log file sync events
                  manager.on("file:synced", (...args: unknown[]) => {
                    logger.info(`Synced: ${args[0]}`);
                  });
                  manager.on("file:created", (...args: unknown[]) => {
                    logger.info(`Created: ${args[0]}`);
                  });
                  manager.on("file:deleted", (...args: unknown[]) => {
                    logger.info(`Deleted: ${args[0]}`);
                  });
                } catch (error) {
                  logger.warn({ err: error }, "File sync setup failed, continuing with pairing only");
                }
              } else {
                spinner.fail("Device confirmation failed.");
              }
              resolve(null);
            }
          } else {
            rl.close();
            spinner.fail("Device pairing cancelled by user.");
            resolve(null);
          }
        });
      });
    });
}
