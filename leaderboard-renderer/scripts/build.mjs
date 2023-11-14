import { build } from "esbuild";

const options = {
  entryPoints: ["src/App.jsx"],
  bundle: true,
  outfile: "dist/app.js",
  format: "cjs",
  platform: "node",
  external: ["react", "react-dom"],
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
};

build(options)
  .catch((e) => {
    console.log(e);
    return process.exit(1);
  })
  .finally(() => console.log("Success."));
