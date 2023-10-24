import log from "npmlog";
import { isDebug } from "./index.js";

if (isDebug()) {
  log.level = "verbose";
}

log.addLevel("success", 2500, { fg: "green", bg: "black" });

export default log;
