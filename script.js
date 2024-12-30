let num1 = 4;
let num2 = 3;
let operator;
let displayValue = "0";

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

// Display
function updateDisplay() {
    const display = document.querySelector(".display");
    display.textContent = displayValue;
}

// Updates display based on button clicked
function handleDigitClick(event) {
    const digit = event.target.getAttribute("data-value");

    if (displayValue === "0") {
        displayValue = digit; // Replace leading zero
    } else {
        displayValue += digit; // Append digit
    }

    updateDisplay();
}

// Event Listeners
const digitButtons = document.querySelectorAll(".nums");

digitButtons.forEach((button) => {
    button.addEventListener("click", handleDigitClick);
});



// Operation control
function operate(operator, num1, num2) {
    switch (operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "*":
            return multiply(num1, num2);
        case "/":
            return num2 !== 0 ? divide(num1, num2) : "Error"; // Avoid divide by zero
        default:
            return "Invalid operator";
    }
}


