class Calculator {
    #leftValue;
    #operand;
    #rightValue;

    constructor(leftValue = null, operand = null, rightValue = null) {
        this.leftValue = leftValue;
        this.operand = operand;
        this.rightValue = rightValue;
    }

    get leftValue() {
        return this.#leftValue;
    }

    set leftValue(value) {
        // Default initialization value
        if (value === null) {
            this.#leftValue = null;
        }

        else if (typeof(value) !== 'number' || isNaN(value)) {
            throw new Error(`Invalid value passed to leftValue: ${value}`);
            // call reset function
        }

        else {
            this.#leftValue = value;
        }
    }
}