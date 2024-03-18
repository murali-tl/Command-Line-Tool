class Constants {
    static ADD = '--add';
    static SUBTRACT = '--subtract';
    static MULTIPLY = '--multiply';
    static DIVIDE = '--divide';
    static EXIT = 'exit';
}
const baseClass = require('./BaseHandler.js');
class MathHandler extends baseClass {
    constructor() {
        super();
        this.commandDict = {
            '-a': Constants.ADD,
            '-s': Constants.SUBTRACT,
            '-sub': Constants.SUBTRACT,
            '-m': Constants.MULTIPLY,
            '-d': Constants.DIVIDE
        }
        this.commandDesc = {
            [Constants.ADD]: '`add` - It should take list of elements as input and return their sum ',
            [Constants.SUBTRACT]: '`subtract` - It should take list of elements as input and return their subtraction',
            [Constants.MULTIPLY]: '`multiply` - It should take list of elements as input and return their multiplication',
            [Constants.DIVIDE]: '`divide` - It can allow only two numbers as input and return their division'
        }
    }
    handleCommand = (input) => {
        let parseArr = input.split(' ');
        if (!parseArr.length) { console.log('Invalid Function name!!\n'); return; }
        let command = parseArr.shift();
        if (command in this.commandDict) { command = this.commandDict[command] }
        if (parseArr.length) {
            for (let element of parseArr) {
                if (isNaN(element)) {
                    console.log('Alphabets not allowed. Please enter Numerics..');
                    return;
                }
            }
            if (command === Constants.ADD) {
                console.log(this.add(parseArr));
            }
            else if (command === Constants.SUBTRACT) {
                console.log(this.subtract(parseArr));
            }
            else if (command === Constants.MULTIPLY) {
                console.log(this.multiply(parseArr));
            }
            else if (command === Constants.DIVIDE) {
                console.log(this.divide(parseArr));
            }
            else {
                console.log('Invalid function name!!!\n');
            }
        }
        else {
            console.log('\nNo Argumnets are passed to perform operations.\n')
        }

    }
    add = (arr) => {
        //provides sum of elements of array
        let sum = 0;
        for (let element of arr) {

            sum += Number(element);
        }
        return sum;
    }
    subtract = (arr) => {
        //provides subtraction of elements of array
        let subtractValue = arr[0];
        for (let index = 1; index < arr.length; index++) {

            subtractValue -= Number(arr[index]);
        }
        return subtractValue;
    }
    multiply = (arr) => {
        //provides product of elements of array
        let product = 1;
        for (let element of arr) {
            if (Number(element) === 0) {
                return 0;
            }
            product *= Number(element);
        }
        return product;
    }
    divide = (arr) => {
        //provides division of elements of array
        if(arr[0] ===0 ){return 0};
        let divideValue = arr[0];
        for (let index = 1; index < arr.length; index++) {

            if (Number(arr[index]) === 0) { return Infinity };
            divideValue /= Number(arr[index]);
        }
        return divideValue;
    }
    help = (commandArr) => {
          //store descriptions of commands n functions
        if (commandArr.length == 1) {
            console.log(this.commandDesc);

        }

        else if (commandArr[1] in commandDesc) {
            console.log(this.commandDesc[commandArr[1]]);
        }
        else {
            console.log('subCommand does not exist');
        }
    }

}
module.exports = MathHandler;