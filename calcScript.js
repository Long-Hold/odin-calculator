class Calculator {
    #leftValue;
    #operand;
    #rightValue;

    constructor() {
        this.validOperands = ['+', '-', '*', '/'];
        this.#setToBaseState();
    }

    #setToBaseState() {
        this.#leftValue = null;
        this.#operand = null;
        this.#rightValue = null;
        this.result = null;
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

class CalculatorGUI {
    #display;
    #buttonContainer;

    constructor() {
        this.#setDOMNodeRefs();
        this.#setEventListeners();
    }

    #setDOMNodeRefs() {
        this.#display = document.getElementById('display-window');
        this.#buttonContainer = document.getElementById('calculator-buttons');
    }

    #setEventListeners() {
        this.#buttonContainer.addEventListener('click', this.#delegateEvent.bind(this));
    }

    #delegateEvent(event) {
        if (!event.target.matches('button')) {
            return;
        }
        // TODO: Handle different classes of events (numeric, operand, clear buttons)
    }
}