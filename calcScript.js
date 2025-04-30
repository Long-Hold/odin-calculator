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
                return this.leftValue / this.rightValue;
            
            default:
                console.error('Invalid OPERATION submitted.')
                this.#setToBaseState();
                return;
        }
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