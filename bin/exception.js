import { isDebug, log } from "../utils/index.js";

function printErrorLog(type, e) {
  if (isDebug()) {
    console.log(e);
  } else {
    log.error(type, e.message);
  }
}
// 监听全局错误
process.on("uncaughtException", (e) => {
  printErrorLog("error", e);
});
process.on("unhandledRejection", (e) => {
  printErrorLog("error", e);
});
