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

    #resetMemory(event) {
        const display = document.getElementById('display-window');
        const placeholderActive = document.getElementById('placeholder');

        if (!placeholderActive) {
            display.textContent = '';
            const placeholder = document.createElement('span');
            placeholder.textContent = '0';
            display.appendChild(placeholder);
        }
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

    clear_screen() {
        /*
            Resets the display to show only the placeholder again
         */

        //#TODO: Add event listener for clicking the clear button
        const clearScreenButton = document.getElementById('clear-memory');
        clearScreenButton.addEventListener('click', this.#resetMemory);
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

    // placeholder is an htmml element that is displayed before program is interacted with
    const placeholder = document.getElementById('placeholder');

    // If the calculator screen is showing the default placeholder text,
    // then we need to remove the placeholder and update it with the user selection
    if (display.contains(placeholder)) {
        display.textContent = message;
        placeholder.remove();
    }

    else
        // If the placeholder isn't active, continue appending user selection
        display.textContent += message;
}

createCalculator();