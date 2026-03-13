import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { Command } from "commander";
import path from "path";
import fs from "node:fs";

jest.mock("node:fs");

const chalkFn = (s: string) => s;
const boldFn = Object.assign((s: string) => s, { blue: (s: string) => s });
jest.mock("chalk", () => ({
  __esModule: true,
  default: Object.assign(chalkFn, {
    yellow: (s: string) => s,
    cyan: (s: string) => s,
    dim: (s: string) => s,
    bold: boldFn,
  }),
}));

jest.mock("@udp/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { statusCommand } from "../../src/commands/status";
import logger from "@udp/logger";

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedLogger = logger as jest.Mocked<typeof logger>;

const fakeProjectRoot = "/fake/project";
const configPath = path.join(fakeProjectRoot, ".udp", "config.json");
const udpDir = path.join(fakeProjectRoot, ".udp");
const devicesPath = path.join(fakeProjectRoot, ".udp", "devices.json");

const fakeConfig = {
  projectName: "my-project",
  frameworks: ["react", "node"],
  syncPort: 21567,
  createdAt: new Date("2024-01-01").toISOString(),
};

describe("status command", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(process, "cwd").mockReturnValue(fakeProjectRoot);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("reads config.json and displays project information when initialized", async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      const ps = String(p);
      return ps === configPath || ps === udpDir;
    });

    (mockedFs.readFileSync as jest.Mock).mockImplementation((p: any) => {
      if (String(p) === configPath) {
        return JSON.stringify(fakeConfig);
      }
      return "";
    });

    const program = new Command();
    statusCommand(program);
    await program.parseAsync(["node", "test", "status"]);

    expect(mockedLogger.info).toHaveBeenCalled();
    const calls = (mockedLogger.info as jest.Mock).mock.calls.map((c: any) => String(c[0]));
    const output = calls.join("\n");
    expect(output).toContain("my-project");
  });

  it("shows not initialized message when config.json is missing", async () => {
    mockedFs.existsSync.mockReturnValue(false as any);

    const program = new Command();
    statusCommand(program);
    await program.parseAsync(["node", "test", "status"]);

    expect(mockedLogger.warn).toHaveBeenCalled();
  });

  it("shows devices count when devices.json exists", async () => {
    const fakeDevices = [{ id: "device-1" }, { id: "device-2" }];

    mockedFs.existsSync.mockImplementation((p: any) => {
      const ps = String(p);
      return ps === configPath || ps === udpDir || ps === devicesPath;
    });

    (mockedFs.readFileSync as jest.Mock).mockImplementation((p: any) => {
      if (String(p) === configPath) {
        return JSON.stringify(fakeConfig);
      }
      if (String(p) === devicesPath) {
        return JSON.stringify(fakeDevices);
      }
      return "";
    });

    const program = new Command();
    statusCommand(program);
    await program.parseAsync(["node", "test", "status"]);

    const calls = (mockedLogger.info as jest.Mock).mock.calls.map((c: any) => String(c[0]));
    const output = calls.join("\n");
    expect(output).toContain("2 paired");
  });
});
