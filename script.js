class Calculator {
    constructor(firstDigit, operand, secondDigit) {
        this.firstDigit = firstDigit;
        this.operand = operand;
        this.secondDigit = secondDigit;
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