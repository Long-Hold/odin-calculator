class Calculator {
    #firstDigit;
    #operand;
    #secondDigit;

    constructor(firstDigit, operand, secondDigit) {
        this.firstDigit = firstDigit;
        this.operand = operand;
        this.secondDigit = secondDigit;
    }

    set firstDigit(value) {
        if (typeof(value) !== 'number' || isNaN(value))
            throw new Error('Invalid first digit passed.');
        this.#firstDigit = value;
    }

    set operand(symbol) {
        const validOperands = ['+', '-', '*', '/'];

        if (validOperands.includes(symbol))
            this.#operand = symbol;
        else throw new Error('Invalid operand passed.');
    }

    set secondDigit(value) {
        if (value === 0 && this.#isDividingByZero)
            this.updateCalculatorDisplay('OOPS: CANNOT DIVIDE BY 0');
        else
            this.#secondDigit = value;
    }

    #isDividingByZero() {
        return this.#operand === '/';
    }

    updateCalculatorDisplay(message = 0) {
        const display = document.getElementById('display-window');
        display.textContent = message;
    }
}

function calculate(operand, digit1, digit2) {
    switch (operand) {
        case '+':
            return digit1 + digit2;
        case '-':
            return digit1 - digit2;
        case '*':
            return digit1 * digit2;
        case '/':
            return digit1 / digit2;
    };
}

function updateDisplay() {
    /* Updates the calculator display
    to reflect the users button selections. */

    // Calculator display window
    const displayWindow = document.getElementById('display-window');
}