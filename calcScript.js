class Calculator {
    // An object containing operand symbols
    static OPERATIONS = {
        ADD: Symbol('add'),
        SUBTRACT: Symbol('subtract'),
        MULTIPLY: Symbol('multiply'),
        DIVIDE: Symbol('divide')
    };

    static STATE = {
        /**
         * This static method is crucial for determining the state of the calculator
         * By checking on the state, we can manipulate on how the equation is built.
         * 
         * Example:
         *  Display: 1 +
         *  State: OPERAND
         *  User Submission: '-' (another operand)
         *  
         *  Error checking:
         *      if calc.state === OPERAND, and another operand submitted,
         *      ignore input.
         * 
         * States allow easy checking that is more mechanical rather than manipulating
         * DOM textContent to check for incorrect input.
         */
        INITIAL: 70, // Calculator is 'empty'
        LEFT: 71, // Calculator is building left value
        OPERAND: 72, // Calculator is on the operand
        RIGHT: 73, // Calculator is building right value
        EQUAL: 74, // Calculator is prepared to evaluate expression
    };

    // Map input types to a string equivalent
    static INPUT_TYPE = {
        /**
         * INPUT_TYPE.CLEAR represents the CLEAR MEMORY selection,
         * NOT Clear Digit
         * */
        NUMERIC: 'NUMERIC',
        OPERAND: 'OPERAND',
        EQUAL: 'EQUAL',
        CLEAR: 'CLEAR',
    }

    // Returns an appropriate STATE based on INPUT_TYPE and CURRENT_STATE
    static STATE_TRANSITIONS = {
        [Calculator.STATE.INITIAL]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.LEFT, // Begin building left value
            // Invalid inputs, maintain state
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.INITIAL,
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.INITIAL,
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.INITIAL,
        },

        // Calculator has a left value
        [Calculator.STATE.LEFT]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.LEFT, // Continue building left value
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.OPERAND, // Left Value is finished
            // Invalid inputs, maintain state
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.LEFT,
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.INITIAL,
        },

        // Calculator has an operand registered, awaiting right value construction
        [Calculator.STATE.OPERAND]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.RIGHT,
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.OPERAND,
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.OPERAND,
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.INITIAL,
        },

        [Calculator.STATE.RIGHT]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.RIGHT, // Continue building right value

            // Evaluate current expression, store as left value, return to OPERAND state
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.OPERAND,
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.EQUAL,
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.INITIAL,
        },

        [Calculator.STATE.EQUAL]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.INITIAL, // Clear memory and start new
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.OPERAND, // Use result as left value
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.EQUAL,
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.INITIAL,
        }
    }

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
    #state;
    #result;

    constructor() {
        this.#setToBaseState();
    }

    #setToBaseState() {
        this.#leftValue = null;
        this.#operand = null;
        this.#rightValue = null;
        this.#state = Calculator.STATE.INITIAL;
        this.#result = null;
    }

    #logSetterErrors(badValue, classVar) {
        console.error(`Invalid Value: ${badValue}\nPassed To: ${classVar}`);
    }

    #logSTATEErrors(state, classVar) {
        /** Called when a class variable assignment
         * is attempted while calculator is in an invalid state
         */
        console.error(`Invalid Process: Cannot assign ${classVar} while in STATE ${state}`);
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

        switch(this.state) {
            case Calculator.STATE.INITIAL: 
                this.#leftValue = value;
                break;

            case Calculator.STATE.LEFT:
                this.#leftValue = parseFloat(`${this.#leftValue}${value}`);
                break;
            
            default:
                this.#logSTATEErrors(this.state, '#leftValue');
                return;
        }
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

    get state() {
        return this.#state;
    }

    set state(inputType) {
        this.#state = Calculator.STATE_TRANSITIONS[this.#state][inputType];
    }

    get result() {
        this.#result = this.calculate();
        return this.#result;
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
    #nodeplaceHolder;
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

    #checkCalculatorState() {
        /** Checks the Calculator.STATE before proceeding with input processing.
         * Depending on the state returned, the input is either accepted or rejected.
         * 
         * Prevents illegal or syntactically incorrect input from being accepted into the
         * engine.
         */


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
                this.#displayNumericInput(event);
                return;

            case 'operand-buttons':
                this.#displayOperandInput(event);
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
        if (!this.#display.contains(this.#placeHolder) && this.#display.textContent.length > 1) {
            this.#display.textContent = this.#display.textContent.slice(0, -1);
        }
        else {
            this.#clearMemory();
        }
    }

    #submitNumericInput(event) {
        /**
         * Submits numeric input to the Calculator engine.
         * 
         * Depending on Calculator.STATE, either send to leftValue or Right Value.
         * 
         */
    }

    #displayNumericInput(event) {
        /**
         * This method passes numeric submissions to the display
         */

        // Replace the placeholder node with the submitted digit
        if (this.#display.contains(document.getElementById('placeholder'))) {
            this.#display.textContent = event.target.textContent;
        }
        // Keep appending digits if no placeholder active
        else {
            this.#display.textContent += event.target.textContent;
        }
    }

    #processOperandInput(event) {
        /**When an operand button is selected, this method checks
         * if it is an arithmetic operator or an assignment operator.
         * 
         * When an arithmetic operator is chosen, we need to check the state of the calculator.
         * This is to prevent multiple arithmetic operators being processed.
         * 
         * Assignment operator '=' means we must execute the evaluation method from the
         * calculator class.
         */


    }

    #displayOperandInput(event) {
        this.#display.textContent += event.target.textContent;
    }
}

const gui = new CalculatorGUI();