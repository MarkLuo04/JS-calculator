var num1 = 4;
var num2 = 3;
var operator;

// Addition
function add(num1, num2) {
    return num1 + num2;
}

// Subtraction
function subtract(num1, num2) {
    return num1 - num2;
}

// Multiplication
function multiply(num1, num2) {
    return num1 * num2;
}

// Division
function divide(num1, num2) {
    return num1 / num2;
}

// Operation control
function operate(operator, num1, num2) {
    if(operator == "add") {
        return add(num1, num2);
    }
    if(operator == "subtract") {
        return subtract(num1, num2);
    }
    if(operator == "multiply") {
        return multiply(num1, num2);
    }
    if(operator == "divide") {
        return divide(num1, num2);
    }
}