/*
    TODO:
        - If an equation is calculated, the 'C' (clear-digit) button should function
        as the 'AC' (clear memory) button

        - After the 'AC' button is clicked and the <span> element is added, it has no id.
        Add an 'id' to the 'span' element created by the #resetMemory method

        - #resetMemory method should re-initialize class parameters to 'null' to represent
        an initialized, but unused value.
*/

class Calculator {
    #firstDigit;
    #operand;
    #secondDigit;

    constructor(firstDigit = null, operand = null, secondDigit = null) {
        this.firstDigit = firstDigit;
        this.operand = operand;
        this.secondDigit = secondDigit;
    }

    get firstDigit() {
        return this.#firstDigit;
    }

    set firstDigit(value) {
        if (value === null)
            this.#firstDigit = null;

        else if (typeof(value) !== 'number' || isNaN(value))
            throw new Error('Invalid first digit passed.');

        else
            this.#firstDigit = value;
    }

    get operand() {
        return this.#operand;
    }

    set operand(symbol) {
        if (symbol === null)
            this.#operand = null;

        // If the operand is not null, then check if it is a valid operand
        else {
            const validOperands = ['+', '-', '*', '/'];

            if (validOperands.includes(symbol))
                this.#operand = symbol;
            else throw new Error('Invalid operand passed.');
        }
    }

    get secondDigit() {
        return this.#secondDigit;
    }

    set secondDigit(value) {
        if (value === null)
            this.#secondDigit = null;

        else if (this.#isDividingByZero(value))
            this.#displayErrors('UNDEFINED');

        else
            this.#secondDigit = value;
    }

    #placeHolderIsActive() {
        return document.getElementById('placeholder') ? true : false;
    }

    #isDividingByZero(secondDigit) {
        return this.#operand === '/' && secondDigit === 0;
    }

    #displayErrors(message = 'NaN') {
        const display = document.getElementById('display-window');
        display.textContent = message;
    }

    #resetMemory(event) {
        /*
             Invoked when the AC button event listener is triggered.
             Checks if the placeHolder text element exists, if not, clears screen
             and adds it back.
        */
        const display = document.getElementById('display-window');
        const placeholderActive = document.getElementById('placeholder');

        if (!placeholderActive) {
            display.textContent = '';
            const placeholder = document.createElement('span');
            placeholder.textContent = '0';
            display.appendChild(placeholder);
        }
    }

    #deleteLastInput(event) {
        const display = document.getElementById('display-window');
        display.textContent = display.textContent.slice(0, -1);
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

    clearScreen() {
        /*
            Listens for a click on the AC button,
            on click, calls the #resetMemory() private method.
         */
        const clearScreenButton = document.getElementById('clear-memory');
        clearScreenButton.addEventListener('click', this.#resetMemory);
    }

    clearLastInput() {
        /*
            Listens for input on the C button,
            calls event handler to erase most recent input 
        */

        const clearDigitButton = document.getElementById('clear-digit');
        clearDigitButton.addEventListener('click', this.#deleteLastInput);
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
const calc = new Calculator();
calc.clearLastInput();
calc.clearScreen();