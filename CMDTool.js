class Log {
    constructor(filePath) {
        this.path = filePath;
        this.logList = [];
        this.fs = require('fs');
    }

    printTopNLines = (size) => {
        if (this.logList.length) {
            for (let count = 0; count < (Math.min(size, this.logList.length)); count++) {
                console.log(this.logList[count][0], this.logList[count][1], this.logList[count][2]);
            }
        }
        else {
            Console.log('No Logs found...\n');
        }
    }
    printLastNLines = (size) => {
        if (this.logList.length) {
            for (let count = this.logList.length - 1; count >= (Math.max(0, this.logList.length - size)); count--) {
                console.log(this.logList[count][0], this.logList[count][1], this.logList[count][2]);
            }
        }
        else {
            Console.log('No Logs found...\n');
        }
    }
    appendDataToFile = (data) => {
        try {
            this.fs.appendFileSync(this.path, data);
        }
        catch (err) {
            Console.log('Error: error writing to file at given path');
        }
    }
    clearFileData = () => {
        try {
            this.fs.writeFileSync(this.path, '');
        }
        catch (err) {
            Console.log('Error: error Clearing data in file at given path');
        }
        this.appendDataToFile('S.No.\tTimeStamp  \tCommand\n');
        this.logList = [];
    }
}

class Constants {
    static REGISTER = 'register';
    static UNREGISTER = 'unregister';
    static ACTIVATE = 'activate';
    static DEACTIVATE = 'deactivate';
    static LOG = 'log';
    static HISTORY = 'history';
    static HELP = '--help';
    static HELP_SHORT = '-h';
    static HEAD = '--head';
    static TAIL = '--tail';
    static LOG_START = '--start';
    static LOG_STOP = '--stop';
    static LOG_CLEAR = '--clear';
    static LOG_ALL = '--all';
    static EXIT = 'exit';
}


class CommandLine {
    constructor() {
        this.registeredCMDs = {};
        this.historyList = [];
        this.basicCmd = [Constants.REGISTER, Constants.HELP, Constants.UNREGISTER, Constants.HELP, Constants.ACTIVATE, Constants.DEACTIVATE, Constants.LOG, Constants.HISTORY];
        this.logIndex = 0;
        this.logFlag=0;
        this.logObj = null;
        this.isLogUsedBefore = false;
        this.commandDesc = {
            [Constants.REGISTER]: '`register <command_name> <Executor>`: \n  \u2023Registers a command and actions assigned to the command. \n  \u2023On register, the command should be auto activated. \n \u2023 Executor is an object, which should be stored against the `command_name` at the time of registering. You must use this object while running the registered commands',
            [Constants.UNREGISTER]: '`unregister <command_name>`: \n  \u2023unregister a command',
            [Constants.ACTIVATE]: '`activate <command_name>`: \n  \u2023activates the command mentioned in the `< command_name>`, it makes the user to gain access to run this command.',
            [Constants.DEACTIVATE]: '`deactivate <command_name>`: \n  \u2023deactivates the command mentioned in the `< command_name>`, it makes the user to loss access to run this command. ',
            [Constants.LOG]: '`log <options>` - Logs commands from the log file location \n  \u2023`log --start <path>` - start logging and the save the log at given path. Ex: log --start C:/Users/UserName/log.txt \n  \u2023`log --all`         - print all commands from the current log file \n  \u2023`log --tail 9`      - print last 9 commands from the current log file \n  \u2023`log --head 9`   - print first 9 commands from the current log file \n  \u2023`log --clear`      - clears all logs from the current log file \n  \u2023`log --stop`       - stops logging commands but keep the current log file ',
            [Constants.HISTORY]: '`history <count>`: \n  \u2023print <count> latest commands (no need to persist), default count is 5'
        }
    }
    handleCommand = (command) => {
        if (command === '' || command === null) {
            console.log('Please enter some valid command\n');
            return false;
        }
        let parseArr = command.split(' ');
        if (command === Constants.EXIT) { return true; }
        if (parseArr[parseArr.length - 1] == Constants.HELP || parseArr[parseArr.length - 1] == Constants.HELP_SHORT) {
            parseArr.pop();
            if (this.basicCmd.includes(parseArr[0]) || parseArr.length === 0) {
                this.help(parseArr);
            }
            else {
                if (parseArr[0] in this.registeredCMDs) {
                    this.registeredCMDs[parseArr[0]]['object'].help(parseArr);
                } else {
                    console.log('Command not yet registered. please register first.\n');
                }
            }
        }
        else if (parseArr[0] === Constants.REGISTER) {
            this.register(parseArr[1], parseArr[2]);
        }
        else if (parseArr[0] === Constants.UNREGISTER) {
            this.unregister(parseArr[1]);
        }
        else if (parseArr[0] === Constants.ACTIVATE) {
            this.activateCmd(parseArr[1]);
        }
        else if (parseArr[0] === Constants.DEACTIVATE) {
            this.deactivateCmd(parseArr[1]);
        }
        else if (parseArr[0] === Constants.HISTORY) {
            this.getHistory(parseArr[1]);
        }
        else if (parseArr[0] === Constants.LOG) {
            this.logger(command);
        }

        else {
            //call respective function
            let baseCmd = parseArr.shift();
            if (baseCmd in this.registeredCMDs) {
                if (this.registeredCMDs[baseCmd].isActive) {
                    this.registeredCMDs[baseCmd]['object'].handleCommand(parseArr.join(' '));
                }
                else {
                    console.log('please Activate first!\n');
                }
            }
            else {
                console.log('Command not found. please register first!\n\u2023Click "-h" to view available commands\n');
            }

        }
        this.historyList.push(command);
        if (this.logIndex && this.logFlag) {
            this.logObj.logList.push([this.logIndex - 1, Date.now(), command]);
            if (this.logIndex !== 1)
                this.logObj.appendDataToFile(this.logObj.logList[this.logObj.logList.length - 1].join('\t') + '\n');
            else if (!this.isLogUsedBefore) { this.logObj.appendDataToFile('S.No.\tTimeStamp  \tCommand\n') }
            this.logIndex++;
        }
    }

    register = (command, executor) => {
        let res = undefined;
        try {
            res = require(`./${executor}.js`);
        }
        catch (err) {
            console.log('Module not found!!');
            return;
        }
        let obj = new res();
        if (typeof obj.handleCommand === 'function' && typeof obj.help === 'function') {
            this.registeredCMDs[command] = {
                'object': obj,
                isActive: true
            }
            console.log('\nSuccess:', command, 'Registered Successfully.\n')
            this.commandDesc[command] = obj.commandDesc;
        }
        else {
            console.log('\nFailure: Invalid executor!\n');
        }
    }

    unregister = (command) => {
        if (command in this.registeredCMDs) {
            delete this.registeredCMDs[command];
            console.log('\n', command, 'Unregistered successfully!\n');
        }
        else if(this.basicCmd.includes(command)){
            console.log('Cannot deactivate default commands.');
        }
        else {
            console.log('\n', command, 'not found\n');
        }
    }

    activateCmd = (command) => {
        if (command in this.registeredCMDs) {
            this.registeredCMDs[command].isActive = true;
            console.log('\nComand Activated\n');
        }
        else if(this.basicCmd.includes(command)){
            console.log('Cannot deactivate default commands.');
        }
        else {
            console.log("please register first!");
        }
    }
    deactivateCmd = (command) => {
        if (command in this.registeredCMDs) {
            this.registeredCMDs[command].isActive = false;
            console.log('\nComand Deactivated\n');
        }
        else if(this.basicCmd.includes(command)){
            console.log('Cannot deactivate default commands.');
        }
        else {
            console.log("please register first!");
        }
    }


    getHistory = (count = 5) => {
        if (this.historyList.length) {
            for (let index = 0; index < Math.min(count, this.historyList.length); index++) {
                console.log(this.historyList[this.historyList.length - 1 - index]);
            }
        }
        else {
            console.log('No History found...\n');
        }
    }

    help = (commandArr) => {
        
        if (commandArr.length < 1) {
            console.log(this.commandDesc);
        }
        else if (commandArr[0] in this.commandDesc) {
            console.log(this.commandDesc[commandArr[0]]);
        }
    }


    logger = (command) => {
        let commandArr = command.split(' ');
        if (commandArr[1] === Constants.LOG_START) {
            if (commandArr.length < 3) {
                console.log('Path Not Specified');
            }
            else {
                this.logObj = new Log(commandArr[2]);
                if (!this.isLogUsedBefore) {
                    this.isLogUsedBefore = true;
                    this.logObj.clearFileData();
                    console.log('Log Started...');
                }
                else{
                    console.log('Log Resumed...');
                }
                this.logIndex = 1;
                this.logFlag=1;
            }
        }
        else if (this.logIndex > 0) {
            if (commandArr[1] === Constants.LOG_STOP) {
                this.logFlag = 0;
                console.log('Log Stopped...');
            }
            else if (commandArr[1] === Constants.TAIL) {
                this.logObj.printLastNLines(commandArr[2]);
            }
            else if (commandArr[1] === Constants.HEAD) {
                this.logObj.printTopNLines(commandArr[2]);

            }
            else if (commandArr[1] === Constants.LOG_CLEAR) {
                this.logObj.clearFileData();
                this.logIndex = 1;
            }
            else if (commandArr[1] === Constants.LOG_ALL) {
                this.logObj.printTopNLines(this.logObj.logList.length);
            }
        }
        else if (this.logIndex === 0) {
            console.log('NOTE: Log not yet Started.\n');
        }
        else {
            console.log('Invalid LOG Command.\n');
        }
    }

}

const prompt = require('prompt-sync')();
const tool = new CommandLine();
let result = false;
while (result !== true) {
    let commandInput = prompt('Enter the command: ');
    //{history : require('prompt-sync-history')()}
    //prompt.history.save();
    result = tool.handleCommand(commandInput);
}   
