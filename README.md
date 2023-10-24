# jarvis
打包项目，将打包后的产物复制到指定文件下，并自动提交代码
## 安装
```sh
npm install -g @cyl-cli/jarvis
#OR
yarn global add @cyl-cli/jarvis
```
## 查看版本号
```sh
jarvis -V
# OR
jarvis --version
```
## 更新
```sh
npm update -g @cyl-cli/jarvis
#OR
yarn global upgrade @cyl-cli/jarvis
```

## 功能
运行以下命令
```sh
jarvis build
```
**jarvis build** 命令有一些可选项，你可以通过运行以下命令进行探索
```sh
jarvis build --help
```

```
用法：jarvis build [options]

选项：
  -tp, --targetPath <targetPath>  目标文件夹路径(相对当前执行路径)
  -a,  --action <action>      指定执行的命令
  -m,  --commit <commitMessage>   git commit信息
  -f,  --force                    强制提交代码，不再问询
  -ng, --noGit                    不提交代码
  -h,  --help                     输出使用帮助信息
```
