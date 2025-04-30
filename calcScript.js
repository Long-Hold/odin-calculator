class Calculator {
    #leftValue;
    #operand;
    #rightValue;

    constructor() {
        this.validOperands = ['+', '-', '*', '/'];
        this.#setToBaseState();
        this.#initializeDomElements();
    }

    #setToBaseState() {
        this.#leftValue = null;
        this.#operand = null;
        this.#rightValue = null;
        this.result = null;
    }
    #initializeDomElements() {
        this.display = document.getElementById('dsiplay-window');
        this.buttons = document.getElementById('calculator-buttons');
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
            return;
        }

        this.#leftValue = value;
    }

    get operand() {
        return this.#operand;
    }

    set operand(symbol) {
        if (symbol === null) {
            this.#operand = null;
            return;
        }

        if (!this.validOperands.includes(symbol)) {
            this.#logSetterErrors(symbol, '#operand');
            // call reset
            return;
        }

        this.#operand = symbol;
    }

    get rightValue() {
        return this.#rightValue;
    }

    set rightValue(value) {
        if (value === null) {
            this.#rightValue = null;
            return;
        }

        if (typeof(value) !== 'number' || isNaN(value)) {
            this.#logSetterErrors(value, '#rightValue');
            //call reset
            return;
        }

        this.#rightValue = value;
    }
}