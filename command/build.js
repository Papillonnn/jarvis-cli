import path from "node:path";
import fse from "fs-extra";
import { execa } from "execa";
import ora from "ora";
import SimpleGit from "simple-git";
import { copyDir, log, formatDate } from "../utils/index.js";
import { makeInput, makeConfirm } from "../utils/inquirer.js";

let copyTargetPath;
let commitMsg = "jarvis submit at " + formatDate(); // git commit信息
let forceExec; // 是否强制提交代码
let noSubmit; // 是否提交代码
let actionName;

const buildAction = async (opts) => {
  await resolveOptions(opts);
  checkIsNpmProject();
  await execBuildAction();
  await copyFileToTargetPath();
  await commitAndPushCode();
};

/**
 * 处理options参数
 * 判断targetPath是否存在 不存在则让用户手动输入
 * @param opts
 * @returns {Promise<void>}
 */
async function resolveOptions(opts) {
  let { targetPath, commitMessage, force = false, noGit = false, action } = opts;
  log.verbose('opts', opts);
  if (!targetPath) {
    targetPath = await makeInput({
      message: "请输入目标项目地址(相对于当前执行路径)",
      require: true,
    });
  }
  if (commitMessage) {
    commitMsg = commitMessage;
  }
  copyTargetPath = path.resolve(process.cwd(), targetPath);
  forceExec = force;
  noSubmit = noGit;
  actionName = action;
  log.verbose("copyTargetPath", copyTargetPath);
}

// 判断当前执行路径是否是npm项目 是否有build命令
function checkIsNpmProject() {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (!fse.pathExistsSync(pkgPath)) {
    throw new Error("package.json文件不存在！");
  }
  const pkg = fse.readJsonSync(pkgPath);
  if (!pkg.scripts || !Object.keys(pkg.scripts || {}).includes("build")) {
    throw new Error("build命令不存在！");
  }
}

// 执行npm run build命令
async function execBuildAction() {
  // 执行npm run build
  console.time(`执行npm run ${actionName}耗时`);
  log.info(`执行npm run ${actionName}...`);
  const spinner = ora(`正在执行npm run ${actionName}...`).start();
  const { stdout, stderr } = await execa('npm', ['run', actionName]);
  spinner.stop();
  console.timeEnd(`执行npm run ${actionName}耗时`);
  if (stdout.indexOf("Compiled successfully") > -1) {
    log.success("打包成功！");
  } else {
    throw new Error(stderr || `npm run ${actionName}执行失败!`);
  }
  return Promise.resolve();
}

// 复制打包后的dist文件到自定目录
async function copyFileToTargetPath() {
  let sourcePath = path.join(process.cwd(), "dist/h5");
  if (!fse.pathExistsSync(sourcePath)) {
    sourcePath = path.join(process.cwd(), "dist");
  }
  if (!fse.pathExistsSync(sourcePath)) {
    throw new Error("dist目录不存在！");
  }
  if (!fse.pathExistsSync(copyTargetPath)) {
    fse.mkdirpSync(copyTargetPath);
    log.info(`目标路径${copyTargetPath}不存在，已自动创建`);
  } else {
    fse.emptydirSync(copyTargetPath);
  }
  log.info(`正在复制${sourcePath}目录到${copyTargetPath}`);
  copyDir(sourcePath, copyTargetPath, (err) => {
    throw new Error(err);
  });
  log.success("复制成功！");
  return Promise.resolve();
}

async function commitAndPushCode(opts) {
  if (noSubmit) return;
  let git = SimpleGit(copyTargetPath);
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    throw new Error("git仓库不存在！终止执行");
  }
  const rootGitPath = await findRootGitPath(copyTargetPath);
  log.verbose("rootGitPath", rootGitPath);
  if (!rootGitPath) {
    throw new Error("git仓库不存在！终止执行");
  }
  git = SimpleGit(rootGitPath);
  const branch = await git.branch();
  const currentBranch = branch.current;
  log.info("当前分支：", currentBranch);

  let confirm;
  if (!forceExec) {
    confirm = await makeConfirm({
      message: `是否确定将代码推送至远程分支：${currentBranch}`,
    });
  } else {
    confirm = forceExec;
  }
  if (!confirm) return;

  const spinner = ora(`正在提交代码至远程分支：${currentBranch}`).start();
  try {
    await git.add("./*");
    await git.commit(commitMsg);
    await git.pull("origin", currentBranch, ["--no-rebase"]);
    await git.push("origin", currentBranch);
  } catch (e) {
    throw new Error(e);
  } finally {
    spinner.stop();
  }
  log.success("代码已成功推送至远程分支：" + currentBranch);
}

// 获取git仓库根目录
async function findRootGitPath(targetPath) {
  const git = SimpleGit(targetPath);
  const isRootRepo = await git.checkIsRepo("root");
  if (fse.pathExistsSync(targetPath) && isRootRepo) {
    return targetPath;
  } else if (fse.pathExistsSync(targetPath) && !isRootRepo) {
    const newPath = path.resolve(targetPath, "../");
    return await findRootGitPath(newPath);
  } else {
    return null;
  }
}

export default buildAction;
