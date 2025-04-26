class Calculator {
    #firstDigit;
    #operand;
    #secondDigit;

    constructor(firstDigit, operand, secondDigit) {
        this.firstDigit = firstDigit;
        this.operand = operand;
        this.secondDigit = secondDigit;
    }

    get firstDigit() {
        return this.#firstDigit;
    }

    set firstDigit(value) {
        if (typeof(value) !== 'number' || isNaN(value))
            throw new Error('Invalid first digit passed.');
        this.#firstDigit = value;
    }

    get operand() {
        return this.#operand;
    }

    set operand(symbol) {
        const validOperands = ['+', '-', '*', '/'];

        if (validOperands.includes(symbol))
            this.#operand = symbol;
        else throw new Error('Invalid operand passed.');
    }

    get secondDigit() {
        return this.#secondDigit;
    }

    set secondDigit(value) {
        if (this.#isDividingByZero(value))
            this.#displayErrors('UNDEFINED');
        else
            this.#secondDigit = value;
    }

    #isDividingByZero(secondDigit) {
        return this.#operand === '/' && secondDigit === 0;
    }

    #displayErrors(message = 'NaN') {
        const display = document.getElementById('display-window');
        display.textContent = message;
    }

    calculate() {
        switch (this.operand) {
            case '+':
                return this.firstDigit + this.secondDigit;
            case '-':
                return this.firstDigit - this.secondDigit;
            case '*':
                return this.firstDigit * this.secondDigit;
            case '/':
                return this.firstDigit / this.secondDigit;
        }
    }

}

function createCalculator() {
    const calcContainer = document.getElementById('calculator-container');
    
    calcContainer.addEventListener('click', event => {
        if (event.target.classList.contains('digit-button'))
            updateCalculatorDisplay(event.target.textContent);
    });
}

function updateCalculatorDisplay(message = 0) {
    const display = document.getElementById('display-window');
    display.textContent += message;
}

createCalculator();