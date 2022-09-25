/*
  # DESCRIPTION

  This script takes a given manifest version (v2 or v3) and generates a
  supported `manifest.json` file from the template located in
  `lib/manifest-template.txt`. It first runs `yarn build` then replaces values
  in the template based on the version it receives before writing the resulting
  JSON into the `dist` directory under the file name `manifest.json`.

  # USAGE

  ```sh
  node build.mjs [v2 | v3]
  ```

  # WHY

  Chrome currently supports v3 manifest while other browsers do not. We need a
  way to package all supported versions to use when publishing the extension to
  the various extension stores.
*/

import { exec } from "child_process";
import fs from "fs";
import path from "path";

const __dirname = process.cwd();

const commonValues = {
  NAME: "TinySheets",
  VERSION: "0.0.0", // TODO
  DESCRIPTION: "Mini spreadsheets",
  HOMEPAGE_URL: "https://github.com/dan-lovelace/tinysheets",
};

const versionValues = {
  v2: {
    MANIFEST_VERSION: 2,
    ACTION: "browser_action",
  },
  v3: {
    MANIFEST_VERSION: 3,
    ACTION: "action",
  },
};

function main() {
  const manifestVersion = process.argv[2];

  if (!manifestVersion) {
    console.error("Missing manifest version");
    console.info("Usage: node build.cjs [v2 | v3]");
    process.exit(1);
  }

  if (!versionValues[manifestVersion]) {
    console.error("Invalid manifest version");
    console.info("Must be one of: v2, v3");
    process.exit(1);
  }

  const template = fs.readFileSync(
    path.join(__dirname, "lib", "manifest-template.txt"),
    "utf-8"
  );

  let resolved = template;
  Object.keys(commonValues).forEach(
    (key) => (resolved = resolved.replace(`%${key}%`, commonValues[key]))
  );

  Object.keys(versionValues[manifestVersion]).forEach((key) => {
    resolved = resolved.replace(
      `%${key}%`,
      versionValues[manifestVersion][key]
    );
  });

  exec("yarn build", (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      process.exit(1);
    }

    fs.writeFileSync(
      path.join(__dirname, "dist", "manifest.json"),
      resolved,
      "utf-8"
    );
  });
}

main();
