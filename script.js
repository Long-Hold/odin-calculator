function calculate(operand, digit1, digit2) {
    switch (operand) {
        case '+':
            return digit1 + digit2;
        case '-':
            return digit1 - digit2;
        case '*':
            return digit1 * digit2;
        case '/':
            return digit1 / digit2;
    };
}

function updateDisplay() {
    /* Updates the calculator display
    to reflect the users button selections. */

    // Calculator display window
    const displayWindow = document.getElementById('display-window');
}