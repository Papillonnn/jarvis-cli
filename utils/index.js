import log from "./log.js";
import copyDir from "./copyDir.js";

function isDebug() {
  return process.argv.includes("-d") || process.argv.includes("--debug");
}

function formatDate() {
  let date = new Date();
  let year = date.getFullYear(); //年
  let month = date.getMonth() + 1; //月
  let strDate = date.getDate(); //日
  let hours = date.getHours(); //时
  let minutes = date.getMinutes(); //分
  let seconds = date.getSeconds(); //秒

  return (
    year +
    "年" +
    month +
    "月" +
    strDate +
    "日 " +
    hours +
    "时" +
    minutes +
    "分" +
    seconds +
    "秒"
  );
}

export { log, isDebug, copyDir, formatDate };
