class Calculator {
    // An object containing operand symbols
    static OPERATIONS = {
        ADD: Symbol('add'),
        SUBTRACT: Symbol('subtract'),
        MULTIPLY: Symbol('multiply'),
        DIVIDE: Symbol('divide')
    };

    static assignOperationSYMBOL(operandNodeID) {
        /**Compares HTML DOM Node.id's to switch cases.
         * If an ID is matched, return the respective OPERATION Symbol()
         * 
         * If an invalid ID is passed, throw an error.
         */
        switch(operandNodeID) {
            case 'add':         return Calculator.OPERATIONS.ADD;
            case 'subtract':    return Calculator.OPERATIONS.SUBTRACT;
            case 'multiply':    return Calculator.OPERATIONS.MULTIPLY;
            case 'divide':      return Calculator.OPERATIONS.DIVIDE;
            default:            throw new Error(`Passed Value: ${operandNodeID} is not a valid OPERAND`);
        }
    }

    #leftValue;
    #operand;
    #rightValue;
    #result;

    constructor() {
        this.#setToBaseState();
    }

    #setToBaseState() {
        this.#leftValue = null;
        this.#operand = null;
        this.#rightValue = null;
        this.#result = null;
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

    set operand(operandNodeID) {
        try {
            this.#operand = Calculator.assignOperationSYMBOL(operandNodeID);
        }
        catch(err) {
            this.#logSetterErrors(operandNodeID, '#operand');
            this.#setToBaseState();
        }
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

    calculate() {
        switch(this.operand) {
            case Calculator.OPERATIONS.ADD:
                return this.leftValue + this.rightValue;

            case Calculator.OPERATIONS.SUBTRACT:
                return this.leftValue - this.rightValue;
            
            case Calculator.OPERATIONS.MULTIPLY:
                return this.leftValue * this.rightValue;
            
            case Calculator.OPERATIONS.DIVIDE:
                return this.rightValue !== 0 
                ? this.leftValue / this.rightValue
                : this.#setToBaseState();
            
            default:
                console.error('Invalid OPERATION submitted.')
                this.#setToBaseState();
                return;
        }
    }

    resetMemory() {
        this.#setToBaseState();
    }
}

class CalculatorGUI {
    #display;
    #buttonContainer;
    #placeHolder;
    #calcEngine;

    constructor() {
        this.#calcEngine = new Calculator();
        this.#setDOMNodeRefs();
        this.#setEventListeners();
        this.#cachePlaceHolder();
    }

    #setDOMNodeRefs() {
        this.#display = document.getElementById('display-window');
        this.#buttonContainer = document.getElementById('calculator-buttons');
    }

    #setEventListeners() {
        this.#buttonContainer.addEventListener('click', this.#delegateEvent.bind(this));
    }

    #cachePlaceHolder() {
        this.#placeHolder = document.getElementById('placeholder').cloneNode(true);
    }

    #delegateEvent(event) {
        if (!event.target.matches('button')) {
            return;
        }

        // Record the class that event came from (its container)
        const buttonType = event.target.parentNode.id;

        // TODO: Handle different classes of events (numeric, operand, clear buttons)
        switch (buttonType) {
            case 'reset-buttons':
                this.#handleResetButtons(event);
                return;

            case 'numerical-buttons':
                // handle numerical input
                return;

            case 'operand-buttons':
                // handle operand selection
                return;
        }
    }

    #handleResetButtons(event) {
        event.target.id === 'clear-memory'? this.#clearMemory() : this.#clearDigit();
    }

    #clearMemory() {
        this.#display.textContent = '';
        this.#display.appendChild(this.#placeHolder);
        this.#calcEngine.resetMemory();
    }

    #clearDigit() {
        if (!this.#display.contains(this.#placeHolder) && this.#display.textContent > 1) {
            this.#display.textContent = this.#display.textContent.slice(0, -1);
        }
        else {
            this.#clearMemory();
        }
    }
}

const gui = new CalculatorGUI();