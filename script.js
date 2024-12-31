let num1 = null; 
let num2 = null;
let operator = null;
let displayValue = "0";
let resetDisplay = false;

// Basic Operations
function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num2 !== 0 ? num1 / num2 : "Error"; // Avoid divide by zero
}

// Update Display
function updateDisplay() {
    const display = document.querySelector(".display");
    display.textContent = displayValue;
}

// Handle Digit Click
function handleDigitClick(event) {
    const digit = event.target.getAttribute("data-value");

    if (resetDisplay) {
        displayValue = digit; // Start fresh after operator
        resetDisplay = false;
    } else if (displayValue === "0") {
        displayValue = digit; // Replace leading zero
    } else {
        displayValue += digit; // Append digit
    }

    updateDisplay();
}

function operatorClick(event) {
    const selectedOperator = event.target.getAttribute("data-value");

    if (num1 === null) {
        // First number input
        num1 = parseFloat(displayValue);
    } else if (!resetDisplay) {
        // Perform the operation only if a number has been entered after the last operator
        num2 = parseFloat(displayValue);
        num1 = operate(operator, num1, num2); // Perform operation
        displayValue = num1.toString();
        updateDisplay();
    }

    operator = selectedOperator; // Update the operator
    resetDisplay = true; // Prepare for the next input
}

function equalsClick() {
    if (operator && num1 !== null) {
        // If the second number hasn't been entered, treat it as `0`
        num2 = parseFloat(displayValue) || 0;

        const result = operate(operator, num1, num2);
        displayValue = result === "Error" ? "Error" : result.toString();
        updateDisplay();

        // Reset for the next calculation
        num1 = result; // Store result as num1 for chaining
        num2 = null;
        operator = null;
        resetDisplay = true; // Prepare for new input
    }
}


// Handle Clear Click
function clearClick() {
    num1 = null;
    num2 = null;
    operator = null;
    displayValue = "0";
    resetDisplay = false;
    updateDisplay();
}

// Perform Operation
function operate(operator, num1, num2) {
    switch (operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "*":
            return multiply(num1, num2);
        case "/":
            return divide(num1, num2);
        default:
            return null;
    }
}

// Event Listeners
const digitButtons = document.querySelectorAll(".nums");
digitButtons.forEach((button) => {
    button.addEventListener("click", handleDigitClick);
});

const operatorButtons = document.querySelectorAll(".operators");
operatorButtons.forEach((button) => {
    button.addEventListener("click", operatorClick);
});

const equalsButton = document.querySelector(".equals");
equalsButton.addEventListener("click", equalsClick);

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", clearClick);
