import { build } from "esbuild";
import replace from "replace-in-file";

// Build L1 contract
build({
  entryPoints: ["./src/contract-L1.js"],
  outdir: "./dist",
  minify: false,
  bundle: true,
  format: "esm",
})
  .catch(() => process.exit(1))

  .finally(() => {
    replace.sync({
      files: "./dist/contract-L1.js",
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: "",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-L1.js",
      from: ["async function handle"],
      to: "export async function handle",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-L1.js",
      from: [
        `
export {
  handle
};`,
      ],
      to: "",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-L1.js",
      from: ["var BigNumber = clone();"],
      to: "var BigNumberClone = clone();",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-L1.js",
      from: ["var bignumber_default = BigNumber;"],
      to: "var bignumber_default = BigNumberClone;",
      countMatches: true,
    });
  });

// Build SEQUENCER Contract
build({
  entryPoints: ["./src/contract-SEQ.js"],
  outdir: "./dist",
  minify: false,
  bundle: true,
  format: "esm",
})
  .catch(() => process.exit(1))

  .finally(() => {
    replace.sync({
      files: "./dist/contract-SEQ.js",
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: "",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-SEQ.js",
      from: ["async function handle"],
      to: "export async function handle",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-SEQ.js",
      from: [
        `
export {
  handle
};`,
      ],
      to: "",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-SEQ.js",
      from: ["var BigNumber = clone();"],
      to: "var BigNumberClone = clone();",
      countMatches: true,
    });
    replace.sync({
      files: "./dist/contract-SEQ.js",
      from: ["var bignumber_default = BigNumber;"],
      to: "var bignumber_default = BigNumberClone;",
      countMatches: true,
    });
  });
