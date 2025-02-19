import { readFileSync, writeFileSync } from "fs";
import { release } from "@vitejs/release-scripts";
import * as colors from "picocolors";

const changelog = readFileSync("CHANGELOG.md", "utf-8");

release({
  repo: "vite-plugin-react-swc",
  packages: ["plugin-react-swc"],
  toTag: (_, version) => `v${version}`,
  logChangelog: () => {
    if (!changelog.includes("## Unreleased")) {
      throw new Error("Can't find '## Unreleased' section in CHANGELOG.md");
    }
    const index = changelog.indexOf("## Unreleased") + 13;
    console.log(
      colors.dim(
        changelog.slice(index, changelog.indexOf("## ", index)).trim(),
      ),
    );
  },
  generateChangelog: (_, version) => {
    console.log(colors.dim("Write package.json & CHANGELOG.md"));
    writeFileSync(
      "CHANGELOG.md",
      changelog.replace("## Unreleased", `## Unreleased\n\n## ${version}`),
    );
  },
  getPkgDir: () => "dist",
});
