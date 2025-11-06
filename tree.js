import fs from "fs";
import path from "path";

const IGNORE = ["node_modules", ".next"];

function listFiles(dir, prefix = "") {
  const entries = fs.readdirSync(dir).sort();

  for (const entry of entries) {
    if (IGNORE.includes(entry)) continue;

    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      console.log(`${prefix}${entry}/`);
      listFiles(fullPath, prefix + "    ");
    } else {
      console.log(`${prefix}${entry}`);
    }
  }
}

console.log("./");
listFiles(process.cwd());
