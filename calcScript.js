class Calculator {
    #leftValue;
    #operand;
    #rightValue;

    constructor(leftValue = null, operand = null, rightValue = null) {
        this.validOperands = ['+', '-', '*', '/'];

        this.leftValue = leftValue;
        this.operand = operand;
        this.rightValue = rightValue;
    }

    #logSetterErrors(badValue, classVar) {
        console.error(`Invalid Value: ${badValue}\nPassed To: ${classVar}`);
    }

    get leftValue() {
        return this.#leftValue;
    }

    set leftValue(value) {
        // Default initialization value
        if (value === null) {
            this.#leftValue = null;
            return;
        }

        if (typeof(value) !== 'number' || isNaN(value)) {
            this.#logSetterErrors(value, '#leftValue');
            // call reset function
        }

        else {
            this.#leftValue = value;
        }
    }

    get operand() {
        return this.#operand;
    }

    set operand(symbol) {
        if (symbol === null) {
            this.#operand = null;
        }
        else if (!this.validOperands.includes(symbol)) {

        }
    }
}