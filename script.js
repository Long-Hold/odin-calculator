class Calculator {
    constructor(firstDigit, operand, secondDigit) {
        this.firstDigit = firstDigit;
        this.operand = operand;
        this.secondDigit = secondDigit;
    }

    // Getter for private method #computeResult
    get calculate() {
        return this.#computeResult();
    }

    // Private method that returns a calculated solution
    #computeResult() {
        switch(this.operand) {
            case '+': return this.firstDigit + this.secondDigit;
            case '-': return this.firstDigit - this.secondDigit;
            case '*': return this.firstDigit * this.secondDigit;
            case '/': return this.firstDigit / this.secondDigit;
        }
    }
}