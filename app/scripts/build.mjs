import { execSync } from "child_process"

execSync(
  `(npm i && tsc && VITE_CONTRACT=KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw vite build)`,
  {
    encoding: "utf8",
    stdio: "inherit",
  }
)
