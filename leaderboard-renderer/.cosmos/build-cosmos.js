import { build } from "esbuild";

build({
  entryPoints: [".cosmos/module.js"],
  bundle: true,
  outfile: "./.cosmos/cosmos-module.js",
  format: "esm",
  platform: "browser",
})
  .catch((e) => {
    console.log(e);
    return process.exit(1);
  })
  .finally(() => console.log("Success."));
