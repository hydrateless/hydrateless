import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const version = process.argv[2];
if (!version) {
  console.error("Usage: node update-versions.mjs <version>");
  process.exit(1);
}

const rootDir = join(import.meta.dirname, "..");
const packagesDir = join(rootDir, "packages");

const rootPkgPath = join(rootDir, "package.json");
const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8"));
rootPkg.version = version;
writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + "\n");
console.log(`Updated root package.json to ${version}`);

const packageDirs = readdirSync(packagesDir).filter((name) => {
  try {
    statSync(join(packagesDir, name, "package.json"));
    return true;
  } catch {
    return false;
  }
});

const workspaceNames = new Set();
for (const dir of packageDirs) {
  const pkg = JSON.parse(
    readFileSync(join(packagesDir, dir, "package.json"), "utf8"),
  );
  workspaceNames.add(pkg.name);
}

for (const dir of packageDirs) {
  const pkgPath = join(packagesDir, dir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

  pkg.version = version;

  for (const depType of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ]) {
    if (pkg[depType]) {
      for (const name of Object.keys(pkg[depType])) {
        if (workspaceNames.has(name)) {
          pkg[depType][name] = `^${version}`;
        }
      }
    }
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`Updated ${pkg.name} to ${version}`);
}
