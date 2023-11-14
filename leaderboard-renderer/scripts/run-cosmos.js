import { spawn } from "child_process";

// const main = () => {
//   execSync("nodemon ./scripts/build-cosmos.js");
// };
spawn("node", ["./scripts/run-cosmos.js"], {
  stdio: "inherit",
}).then((o) => console.log(o));
try {
  console.log("Server started successfully");
} catch (error) {
  console.error("Error starting server:", error);
  process.exit();
}

// Run another command after the server starts
try {
  console.log("Second Command executed successfully");
} catch (error) {
  console.error("Error executing command:", error);
}
