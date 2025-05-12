/**Displaying decimal points:
 * Challenge: Display the decimal point on screen before any
 * decimal places are introduced.
 * 
 * Proposed solution:
 * Variable to track if a decimal value is being built.
 * 
 * If decimal flag is true, then the left or right setters will store the input as a string,
 * rather than as a number.
 * 
 * These setters will convert the strings back to float values based on certain STATE transitions:
 *  LEFT -> OPERAND : leftValue converts string to float
 *  RIGHT -> EQUAL  : rightValue converts string to float
 *  RIGHT -> INITIAL: rightValue converts string to float (for expression chaining functionality)
 * 
 * Decimal flag changes based on key inputs:
 *  A setter receives a decimal as input: flag = true
 *  Decimal is cleared from the string: flag = false
 *  STATE is INITIAL, OPERAND, EQUAL: flag = false
 * 
 *  If flag = true and a decimal is received, input is ignored by the Engine.
 */

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
        /** CLEAR goes back to previous STATE
         * unless STATE is EQUAL or INITIAL
         */
        NUMERIC: 'NUMERIC',
        DECIMAL: 'DECIMAL',
        OPERAND: 'OPERAND',
        EQUAL: 'EQUAL',
        CLEAR: 'CLEAR',
        RESET: 'RESET-MEMORY',
    }

    // Returns an appropriate STATE based on INPUT_TYPE and CURRENT_STATE
    static STATE_TRANSITIONS = {
        /**TRANSITION PATTERN:
         * INITIAL => LEFT => OPERAND => RIGHT => EQUAL
         * 
         * MULTI EQUATION PATTERN:
         * INITIAL => LEFT => OPERAND => RIGHT => OPERAND ... => EQUAL
         * 
         * PRESSING AN OPERAND FROM EQUAL USES THE RESULT AS LEFT VALUE
         * 
         * PRESSING A NUMERIC VALUE FROM EQUAL RESETS THE CALCULATOR
         */
        [Calculator.STATE.INITIAL]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.LEFT, // Begin building left value

            // Invalid inputs, maintain state
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.INITIAL,
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.INITIAL,
            [Calculator.INPUT_TYPE.RESET]: Calculator.STATE.INITIAL,
        },

        // Calculator has a left value
        [Calculator.STATE.LEFT]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.LEFT, // Continue building left value
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.OPERAND, // Left Value is finished
            
            // Invalid input, maintain state
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.LEFT,

            // Go back one state or revert to INITIAL
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.INITIAL,
            [Calculator.INPUT_TYPE.RESET]: Calculator.STATE.INITIAL,
        },

        // Calculator has an operand registered, awaiting right value construction
        [Calculator.STATE.OPERAND]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.RIGHT,
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.OPERAND,
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.OPERAND,
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.LEFT,
            [Calculator.INPUT_TYPE.RESET]: Calculator.STATE.INITIAL,
        },

        [Calculator.STATE.RIGHT]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.RIGHT, // Continue building right value

            // Evaluate current expression, store as left value, return to OPERAND state
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.INITIAL,

            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.EQUAL,
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.OPERAND,
            [Calculator.INPUT_TYPE.RESET]: Calculator.STATE.INITIAL,
        },

        [Calculator.STATE.EQUAL]: {
            [Calculator.INPUT_TYPE.NUMERIC]: Calculator.STATE.INITIAL, // Clear memory and start new

            // Clear memory, store result in left, translate to operand
            [Calculator.INPUT_TYPE.OPERAND]: Calculator.STATE.INITIAL,
            [Calculator.INPUT_TYPE.EQUAL]: Calculator.STATE.EQUAL,

            // CLEAR will allow the user to modify the right value and exit the EQUAL state
            [Calculator.INPUT_TYPE.CLEAR]: Calculator.STATE.RIGHT,
            [Calculator.INPUT_TYPE.RESET]: Calculator.STATE.INITIAL,
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

    #decimalActive;
    #leftValue;
    #operand;
    #rightValue;
    #state;
    #result;

    constructor() {
        this.#setToBaseState();
    }

    #setToBaseState() {
        this.#decimalActive = false;
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

    #valueIsDecimal(value) {
        return value === '.';
    }

    get decimalActive() {
        return this.#decimalActive;
    }

    set decimalActive(value) {
        if (typeof(value) !== 'boolean') {
            this.#logSetterErrors(value, 'decimalActive');
            return;
        }

        this.#decimalActive = value;
    }

    get leftValue() {
        return parseFloat(this.#leftValue);
    }

    set leftValue(value) {
        // if (typeof(value) !== 'number' || isNaN(value)) {
        //     this.#logSetterErrors(value, '#leftValue');
        //     this.#setToBaseState();
        //     return;
        // }

        // Check for decimal input, if already active then ignore multiple input attempts
        // Otherwise set the flag to true
        if (this.#valueIsDecimal(value)) {
            switch(this.decimalActive) {
                case true:
                    return;
                case false:
                    this.decimalActive = true;
                    break;
            }
        }

        switch(this.state) {
            case Calculator.STATE.INITIAL: 
                this.#leftValue = value;
                break;

            case Calculator.STATE.LEFT:
                this.#leftValue = `${this.#leftValue}${value}`;
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
        if (operandNodeID === null) {
            this.#operand = null;
            return;
        }
        try {
            this.#operand = Calculator.assignOperationSYMBOL(operandNodeID);
        }
        catch(err) {
            this.#logSetterErrors(operandNodeID, '#operand');
            this.#setToBaseState();
        }
    }

    get rightValue() {
        return parseFloat(this.#rightValue);
    }

    set rightValue(value) {
        if (value === null) {
            this.#rightValue = null;
            return;
        }

        switch(this.state) {
            case Calculator.STATE.OPERAND: 
                this.#rightValue = value;
                break;

            case Calculator.STATE.RIGHT:
                this.#rightValue = `${this.#rightValue}${value}`;
                break;
            
            default:
                this.#logSTATEErrors(this.state, '#leftValue');
                return;
        }
    }

    get state() {
        return this.#state;
    }

    set state(inputType) {
        this.#state = Calculator.STATE_TRANSITIONS[this.#state][inputType];
    }

    get result() {
        return this.#result;
    }

    set result(value) {
        this.#result = value;
    }

    calculate() {
        // if (this.state !== Calculator.STATE.RIGHT || this.state !== Calculator.STATE.EQUAL) {
        //     this.#logSTATEErrors(this.state, `result`);
        //     return;
        // }

        switch(this.operand) {
            case Calculator.OPERATIONS.ADD:
                this.result = this.leftValue + this.rightValue;
                break;

            case Calculator.OPERATIONS.SUBTRACT:
                this.result = this.leftValue - this.rightValue;
                break;
            
            case Calculator.OPERATIONS.MULTIPLY:
                this.result = this.leftValue * this.rightValue;
                break;
            
            case Calculator.OPERATIONS.DIVIDE:
                this.rightValue !== 0 
                ? this.result = this.leftValue / this.rightValue
                : this.resetMemory();
                break;
            
            default:
                console.error('Invalid OPERATION submitted.')
                this.resetMemory();
                break;
        };
    }

    resetMemory() {
        this.#setToBaseState();
    }
}

class CalculatorGUI {
    static OPERAND_SYMBOLS = {
        /**Converts Calculator Class SYMBOLS to 
         * char literals that can be displayed on a browser
         */
        [Calculator.OPERATIONS.ADD]: '+',
        [Calculator.OPERATIONS.SUBTRACT]: '-',
        [Calculator.OPERATIONS.MULTIPLY]: '×',
        [Calculator.OPERATIONS.DIVIDE]: '÷'
    };

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

    get calcEngine() {
        return this.#calcEngine;
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

    #validEngineState(event) {
        /** Checks the Calculator.STATE before proceeding with input processing.
         * Depending on the state returned, the input is either accepted or rejected.
         * 
         * Prevents illegal or syntactically incorrect input from being accepted into the
         * engine.
         * 
         * 'equal' is in the same container as the other operands, so it must be specifically
         * checked via ID, and before any parent node is checked.
         */

        if (event.target.id === 'equal') {
            return this.#calcEngine.state === Calculator.STATE.RIGHT;
        }

        const buttonType = event.target.parentNode.id;

        switch (buttonType) {
            case 'reset-buttons':
                return true;

            case 'numerical-buttons':
                return [
                    Calculator.STATE.INITIAL,
                    Calculator.STATE.LEFT,
                    Calculator.STATE.OPERAND, 
                    Calculator.STATE.RIGHT,
                    Calculator.STATE.EQUAL,
                ].includes(this.#calcEngine.state);

            case 'operand-buttons':
                return [
                    Calculator.STATE.LEFT,
                    Calculator.STATE.RIGHT,
                    Calculator.STATE.EQUAL,
                ].includes(this.#calcEngine.state);
        }
    }

    #delegateEvent(event) {
        if (!event.target.matches('button')) {
            return;
        }

        // Check if the submitted input follows valid state
        if (!this.#validEngineState(event)) {
            return;
        }

        // Record the class that the event came from (the parent container)
        const buttonType = event.target.parentNode.id;
        const textContent = event.target.textContent;

        // TODO: Handle different classes of events (numeric, operand, clear buttons)
        switch (buttonType) {
            case 'reset-buttons':
                this.#handleResetButtons(event);
                return;

            case 'numerical-buttons':
                this.#submitNumericInput(textContent);
                this.#displayNumericInput();
                return;

            case 'operand-buttons':
                this.#processOperandInput(event);
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
        /**Allows the user to clear the last accepted value from the calculator.
         * Depending on the calculators state, signal the engine to go back one state.
         * 
         * E.G.
         *  Screen: 120 + 135
         *  Input: CLEAR
         *  STATE: RIGHT
         *  
         *  If rightValue Length > 1, Temporarily revert state back to previous STATE,
         *  submit the shortened value, and return back to original state
         */
        switch (this.#calcEngine.state) {
            case Calculator.STATE.INITIAL:
                this.#clearMemory();
                return;
            
            case Calculator.STATE.LEFT:
                const leftValStr = this.#calcEngine.leftValue.toString();
                if (leftValStr.length === 1) {
                    this.#clearMemory();
                }

                else {
                    this.#calcEngine.state = Calculator.INPUT_TYPE.CLEAR;
                    this.#submitNumericInput(leftValStr.slice(0, -1));
                    this.#displayNumericInput()
                }
                return;
            
            case Calculator.STATE.OPERAND:
                this.#calcEngine.state = Calculator.INPUT_TYPE.CLEAR;
                this.#calcEngine.operand = null;
                this.#displayOperandInput();
                return;
            
            case Calculator.STATE.RIGHT:
                const rightValStr = this.#calcEngine.rightValue.toString();
                this.#calcEngine.state = Calculator.INPUT_TYPE.CLEAR;
                if (rightValStr.length === 1) {
                    // If we are removing the last digit in right value
                    // Then we set it to null, and update the display with just the
                    // Left value and operand
                    this.#calcEngine.rightValue = null;
                    this.#displayOperandInput();
                }

                else {
                    this.#submitNumericInput(rightValStr.slice(0, -1));
                    this.#displayNumericInput();
                }
                return;
            
            case Calculator.STATE.EQUAL:
                this.#clearMemory();
        }
    }

    #submitNumericInput(textContent) {
        /**
         * Submits numeric input to the Calculator engine.
         * 
         * Depending on Calculator.STATE, either send to leftValue or Right Value.
         * 
         */

        // If the user presses a Numeric value from EQUAL, signal to state
        // of numeric input to handle restarting calculator for new equation
        if (this.#calcEngine.state === Calculator.STATE.EQUAL) {
            this.#calcEngine.state = Calculator.INPUT_TYPE.NUMERIC;
        }

        if (this.#calcEngine.state === Calculator.STATE.INITIAL ||
            this.#calcEngine.state === Calculator.STATE.LEFT) {
                this.#calcEngine.leftValue = textContent;
            }

        else {
            this.#calcEngine.rightValue = textContent;
        }

        this.#calcEngine.state = Calculator.INPUT_TYPE.NUMERIC;
    }

    #displayNumericInput() {
        /**
         * This method passes numeric submissions to the display
         */
        switch (this.#calcEngine.state) {
            case Calculator.STATE.LEFT:
                this.#display.textContent = this.#calcEngine.leftValue;
                break;
            case Calculator.STATE.RIGHT:
                const operand = CalculatorGUI.OPERAND_SYMBOLS[this.#calcEngine.operand];
                this.#display.textContent = `${this.#calcEngine.leftValue} ${operand} ${this.#calcEngine.rightValue}`;
                break;
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
         * 
         * If the Engine is in State RIGHT, we need to evaluate the expression and store it
         * in the leftValue, then re-assign the operand to the chosen expression.
         */

        if (event.target.id === 'equal') {
            this.#calcEngine.state = Calculator.INPUT_TYPE.EQUAL;
            this.#displayCalculation();
            return;
        }

        else if (this.#calcEngine.state === Calculator.STATE.RIGHT
            || this.#calcEngine.state === Calculator.STATE.EQUAL
        ) {
            // Evaluate the expression, which stores it in the result variable
            this.#calcEngine.calculate();
            this.#calcEngine.state = Calculator.INPUT_TYPE.OPERAND;

            this.#submitNumericInput(this.#calcEngine.result);
            this.#displayNumericInput();
        }

        this.#submitOperandInput(event);
        this.#displayOperandInput();

    }

    #submitOperandInput(event) {
        this.#calcEngine.operand = event.target.id;
        this.#calcEngine.state = Calculator.INPUT_TYPE.OPERAND;
    }

    #displayOperandInput() {
        this.#display.textContent = this.calcEngine.operand 
        ? `${this.#calcEngine.leftValue} ${CalculatorGUI.OPERAND_SYMBOLS[this.calcEngine.operand]} ` 
        : `${this.#calcEngine.leftValue} `
    }

    #isInt(number) {
        return number % 1 === 0;
    }

    #formatFloat(number) {
        // Only allows up to 4 decimal places for floats
        return new Intl.NumberFormat( 'en-US', {
            style:'decimal', 
            maximumFractionDigits: 4
        }).format(number,);
    }

    #displayCalculation() {
        // Call the engines calculate method, then retrieve the result for display
        this.#calcEngine.calculate();
        const result = this.#calcEngine.result;

        this.#display.textContent += ' = ' + (
        this.#isInt(result)
        ? result
        : this.#formatFloat(result)
        );
    }
}

function convertToDecimal(num) {
  // Convert to string to count the number of digits
  const numStr = Math.abs(num).toString();
  
  // Calculate the divisor (10 raised to the power of the number of digits)
  const divisor = Math.pow(10, numStr.length);
  
  // Divide the number by the divisor to get the decimal format
  return num / divisor;
}

const gui = new CalculatorGUI();