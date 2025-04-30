/*
    TODO:
        - If an equation is calculated, the 'C' (clear-digit) button should function
        as the 'AC' (clear memory) button

        - #resetMemory method should re-initialize class parameters to 'null' to represent
        an initialized, but unused value.

        - If an operand is selected after inputting an equation already,
        store the calculation of the previous equation, and then set it to the firstDigit var:

        Pseudocode:
            5 + 6 - 7
            With the current class implementation, when '+' is selected,
            firstDigit = 5, operand = '+'.

            Plan: When a second operand that is not '=' is selected, call calculate():
                when '+' is pressed after 6:
                    If operand is not Null:
                        secondDigit = 6 
                    firstDigit = self.calculate(), so firstDigit = 11.
                    operand = '-'
                Display is now: 11 - 7.

                Repeat process until '=' is selected, or another operand is placed.
*/

class Calculator {
    #firstDigit;
    #operand;
    #secondDigit;

    constructor(firstDigit = null, operand = null, secondDigit = null) {
        this.calculatorDisplay = document.getElementById('display-window');
        this.calcButtons = document.getElementById('calculator-buttons');
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
            throw new Error(`Invalid first digit passed: ${value}`);

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
        return this.calculatorDisplay.querySelector('#placeholder') !== null;
    }

    #isDividingByZero(secondDigit) {
        return this.#operand === '/' && secondDigit === 0;
    }

    #displayErrors(message = 'NaN') {
        this.calculatorDisplay.textContent = message;
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
            placeholder.setAttribute('id', 'placeholder');
            placeholder.textContent = '0';
            display.appendChild(placeholder);
        }
    }

    #deleteLastInput(event) {
        /*
            Removes the last submitted char from the display node.
            If there is only one char left or the placeholder is still active,
            call this.#resetMemory instead.
        */

        if (!this.#placeHolderIsActive() && this.calculatorDisplay.textContent.length > 1) {
            this.calculatorDisplay.textContent = this.calculatorDisplay.textContent.slice(0, -1);
        }

        else
            this.#resetMemory(event);
    }

    #delegateKeyChoice(event) {
        // For all operands and digit buttons, we can update the display
        // For the clear buttons, we must call a different function
        if (event.target.classList.contains('digit-button') || 
            event.target.classList.contains('operand')) {

                this.#updateCalculatorDisplay(event.target.textContent);

                // When an operand is selected, variables are intialized with inputted data
                if (event.target.classList.contains('operand')) {
                    this.initializeClassVars(event);
                }

                // When the equal button is selected, update the display with the calculation
                if (event.target.id === 'equal') {
                    this.#updateCalculatorDisplay(this.calculate());
                }
            }
        
        else if (event.target.id === 'clear-memory')
            this.#resetMemory(event);
        else if (event.target.id === 'clear-digit')
            this.#deleteLastInput(event);
    }

    #updateCalculatorDisplay(message = 0) {
        // If the calculator screen is showing the default placeholder text,
        // then we simply need to replace the text content of the display
        if (this.#placeHolderIsActive()) {
            this.calculatorDisplay.textContent = message;
        }
    
        else
            // If the placeholder isn't active, continue appending user selection
            this.calculatorDisplay.textContent += message;
    }

    #returnConvertedOperand(event) {
        /**
         * Compares the event target ID to an operand map,
         * returns the corresponding value (operand).
         * 
         * Returns: A Javascript operand
         */
        const domOperand = event.target.id;
        const operatorMap = {
            'add': '+',
            'subtract': '-',
            'multiply': '*',
            'divide': '/'
        };

        return operatorMap[domOperand];
    }

    #returnOperandId() {
        const operatorIdDomMap = {
            '+': 'add',
            '-': 'subtract',
            '*': 'multiply',
            '/': 'divide'
        };

        return operatorIdDomMap[this.operand];
    }

    #extractFirstDigitValues() {
        /**
         * This method assigns the values to left of operand to firstDigit,
         * values to right of operand to secondDigit
         * 
         *
         */
        const currentEquation = this.calculatorDisplay.textContent;
        return parseInt(currentEquation);
    }

    #extractSecondDigitValues() {
        const currentEquation = this.calculatorDisplay.textContent;
        const operandIndex = currentEquation.indexOf(this.#returnOperandId());
        return parseInt(currentEquation.slice(operandIndex + 1, -1));
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

    captureKeyPadClick() {
        this.calcButtons.addEventListener('click', (event) => {
            this.#delegateKeyChoice(event);
        })
    }

    initializeClassVars(event) {
        // When an operand is selected, record the ints to the left as firstDigit,
        // and then the operand itself
        if (event.target.classList.contains('operand') &&
            event.target.id !== 'equal') {
            this.firstDigit = this.#extractFirstDigitValues() 
            this.operand = this.#returnConvertedOperand(event);
        }

        // TODO: When '=' is hit, record the values to right of operand in secondDigit
        if (event.target.id === 'equal') {
            this.secondDigit = this.#extractSecondDigitValues();
        }
    }
}

const calc = new Calculator();
calc.captureKeyPadClick();