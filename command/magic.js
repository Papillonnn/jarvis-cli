import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";


const magicAction = async () => {
    console.log(chalk.red("I want to play a game~"));
    console.log(chalk.green("我是一个虚拟文明的魔术师,接下来开始我的表演~"));
    await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: chalk.yellow('请随机想一个10到100的数字,假设这个数字是x,请将x减去它个位与十位之和得出一个数字Q,请你心里默念三次数字Q,请按回车键继续,然后选择数字Q对应的图案~')
    })
    // 放非9的倍数的图标
    const list1 = ["☄", "☬", "♝", "♬", "◐", "♣", "▲", "♦", "☺", "√", "♞", "♍", "♒", "♓", "♑", "♐", "♎", "♌", "♉", "♈"];
    // 放9的倍数的图标
    const list2 = ["§", "〼", "◎", "α", "¤", "☼", "☽", "■", "★", "♠", "♥", "☑", "β", "♛"];

    const index2 = random(0, 14);

    for (let i = 1; i < 101; i++) {
        // 单个
        let item;
        const index1 = random(0, 20)
        // 九倍数的时候
        if (i % 9 === 0) {
            item = `${i}:${list2[index2]}`
        } else {
            item = `${i}:${list1[index1]}`
        }
        // 输出换行逻辑
        if (i % 10 === 0) {
            process.stdout.write(item + "\n")
            process.stdout.write("\n")
        } else {
            process.stdout.write(item + "   ")
        }
    }

    await inquirer.prompt({
        type: 'input',
        name: "wait",
        message: chalk.cyan('您选择好了么,来让我预言下~~')
    })
    const spinner = ora('正在预言中...').start();
    setTimeout(() => {
        console.log('\n');
        console.log(chalk.yellow('---------------------'));
        console.log(chalk.yellow('---------------------'));
        console.log(chalk.yellow('---------------------'));
        console.log(`你选择的是:${list2[index2]}`);
        console.log(`我的预言正确吗😄`);
        console.log(chalk.yellow('---------------------'));
        console.log(chalk.yellow('---------------------'));
        console.log(chalk.yellow('---------------------'));
        spinner.stop();
    }, 2000);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default magicAction;
