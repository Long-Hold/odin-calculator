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
        if (typeof(value) !== 'number' || isNaN(value)) {
            this.#logSetterErrors(value, '#leftValue');
            this.#setToBaseState();
            return;
        }

        this.#leftValue = value;
    }

    get operand() {
        return this.#operand;
    }

    set operand(symbol) {
        if (!this.validOperands.includes(symbol)) {
            this.#logSetterErrors(symbol, '#operand');
            this.#setToBaseState();
            return;
        }

        this.#operand = symbol;
    }

    get rightValue() {
        return this.#rightValue;
    }

    set rightValue(value) {
        if (typeof(value) !== 'number' || isNaN(value)) {
            this.#logSetterErrors(value, '#rightValue');
            this.#setToBaseState();
            return;
        }

        this.#rightValue = value;
    }
}