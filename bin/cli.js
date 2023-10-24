#!/usr/bin/env node
import path from "node:path";
import { program } from "commander";
import fse from "fs-extra";
import semver from "semver";
import { dirname } from "dirname-filename-esm";
import "./exception.js";
import buildAction from "../command/build.js";
import { log } from "../utils/index.js";

const __dirname = dirname(import.meta);

const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = fse.readJsonSync(pkgPath);

const MIN_NODE_VERSION = "14.15.0";

function checkNodeVersion() {
  const nodeVersion = process.version;
  if (!semver.gte(nodeVersion, MIN_NODE_VERSION)) {
    throw new Error(`jarvis运行需要node版本大于v${MIN_NODE_VERSION}, 当前node版本为${nodeVersion}`);
  }
}

function preAction() {
  checkNodeVersion();
}

(async () => {
  program.version(pkg.version);

  program
    .usage("<command> [options]")
    .description(
      "eg: jarvis build -tp ../xxx-client-h5/xxx-client-h5/cyl",
    )
    .option("-d, --debug", "开启调试模式")
    .hook("preAction", preAction);

  program
    .command("build")
    .option(
      "-tp, --targetPath <targetPath>",
      "目标文件夹路径(相对当前执行路径)",
    )
    .option("-a, --action <action>", "指定执行的命令", 'build')
    .option("-m, --commit <commitMessage>", "git commit信息")
    .option("-f --force", "强制提交代码，不再问询")
    .option("-ng --noGit", "不提交代码")
    .description("build project then copy dist to target path")
    .allowUnknownOption()
    .action(buildAction);

  // 监听未知命令
  program.on('command:*', function (obj) {
    log.warn('未知的命令：' + obj[0])  // 未知的命令：aaa

    const availableCommands = program.commands.map(cmd => cmd.name());
    log.warn('可用的命令：' + availableCommands.join(','));
  })

  program.parse();
})();
