import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

const run = (command, commandArgs) => {
  const result = spawnSync(command, commandArgs, {
    stdio: "inherit",
    shell: false
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === "number") {
    process.exit(result.status);
  }
};

if (process.platform === "win32") {
  const scriptPath = path.resolve(__dirname, "start.ps1");
  const mappedArgs = args.map((arg) => {
    switch (arg) {
      case "--force-install":
        return "-ForceInstall";
      case "--skip-start":
        return "-SkipStart";
      default:
        return arg;
    }
  });

  run("powershell.exe", [
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    scriptPath,
    ...mappedArgs
  ]);
} else {
  const scriptPath = path.resolve(__dirname, "start.sh");
  run("bash", [scriptPath, ...args]);
}

