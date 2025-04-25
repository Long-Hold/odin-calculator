class Calculator {
    #firstDigit;
    #operand;
    #secondDigit;

    constructor(firstDigit, operand, secondDigit) {
        // These call the setters, not the variables passed directly
        this.firstDigit = firstDigit;
        this.operand = operand;
        this.secondDigit = secondDigit;
    }

    get firstDigit() {
        return this.#firstDigit;
    }

    set firstDigit(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('First digit must be a valid number');
        }
        this.#firstDigit = value;
    }

    get operand() {
        return this.#operand;
    }

    set operand(symbol) {
        
    }

    // Private method that returns a calculated solution
    calculate() {
        switch(this.operand) {
            case '+': return this.firstDigit + this.secondDigit;
            case '-': return this.firstDigit - this.secondDigit;
            case '*': return this.firstDigit * this.secondDigit;
            case '/': return this.firstDigit / this.secondDigit;
        }
    }
}