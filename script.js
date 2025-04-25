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

    }

    #isDividingByZero() {
        
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