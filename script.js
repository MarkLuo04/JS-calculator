// Calculator State
let displayValue = "0";
let num1 = null;
let num2 = null;
let operator = null;
let resetDisplay = false;

// Basic Operations
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return b !== 0 ? a / b : "Error"; // Avoid divide-by-zero
}
function squareRoot(a) {
  return a < 0 ? "Error" : Math.sqrt(a);
}

// Update the Display
function updateDisplay() {
  const display = document.querySelector(".display");
  display.textContent = displayValue;
}

// Handle Digit Click (0-9 or ".")
function handleDigitClick(e) {
  const digit = e.target.getAttribute("data-value");

  // If we're coming from an error, reset to "0" first
  if (displayValue === "Error") {
    displayValue = "0";
    num1 = null;
    num2 = null;
    operator = null;
  }

  // Prevent multiple decimals in the same number
  if (digit === "." && displayValue.includes(".")) {
    return;
  }

  if (resetDisplay) {
    // If we just pressed an operator or "=", start fresh
    displayValue = digit;
    resetDisplay = false;
  } else if (displayValue === "0" && digit !== ".") {
    // Replace leading zero (unless it's "0.")
    displayValue = digit;
  } else {
    // Append the digit
    displayValue += digit;
  }

  updateDisplay();
}

// Handle Operator Click 
function handleOperatorClick(e) {
  const selectedOperator = e.target.getAttribute("data-value");

  // First time an operator is pressed
  if (num1 === null) {
    num1 = parseFloat(displayValue);
  } 
  // If we already have a num1 and just entered another number
  else if (!resetDisplay) {
    num2 = parseFloat(displayValue);
    const result = operate(operator, num1, num2);
    displayValue = result.toString();
    num1 = (result === "Error") ? null : result; 
    updateDisplay();
  }

  operator = selectedOperator;
  resetDisplay = true; // next digit press starts a new number
}

// Handle Equals 
function handleEqualsClick() {
  if (operator && num1 !== null) {
    num2 = parseFloat(displayValue) || 0;

    const result = operate(operator, num1, num2);
    displayValue = (result === "Error") ? "Error" : result.toString();
    updateDisplay();

    // Prepare for continued calculations
    num1 = (result === "Error") ? null : result;
    num2 = null;
    operator = null;
    resetDisplay = true;
  }
}

// Choosing an operation
function operate(op, a, b) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return null;
  }
}

// Handle Square Root
function handleSqrtClick() {
  const currentNum = parseFloat(displayValue);

  const result = squareRoot(currentNum);
  displayValue = (result === "Error") ? "Error" : result.toString();
  updateDisplay();

  // If not an error, store as num1
  if (result !== "Error") {
    num1 = result;
  } else {
    num1 = null;
  }
  num2 = null;
  operator = null;
  resetDisplay = true;
}

// Handle Backspace
function handleBackspaceClick() {
  if (displayValue === "Error") {
    // If we were on "Error," reset to 0
    displayValue = "0";
    updateDisplay();
    return;
  }

  // If we only have one digit left
  if (displayValue.length === 1 ||
      (displayValue.startsWith("-") && displayValue.length === 2)) {
    displayValue = "0";
  } else {
    displayValue = displayValue.slice(0, -1); 
  }
  updateDisplay();
}

// Handle Clear 
function handleClearClick() {
  displayValue = "0";
  num1 = null;
  num2 = null;
  operator = null;
  resetDisplay = false;
  updateDisplay();
}

// Event Listeners
const digitButtons = document.querySelectorAll(".nums");
digitButtons.forEach(btn => {
  btn.addEventListener("click", handleDigitClick);
});

const operatorButtons = document.querySelectorAll(".operators");
operatorButtons.forEach(btn => {
  // Differentiate sqrt from other operators
  if (btn.getAttribute("data-value") === "sqrt") {
    btn.addEventListener("click", handleSqrtClick);
  } else {
    btn.addEventListener("click", handleOperatorClick);
  }
});

const equalsButton = document.querySelector(".equals");
equalsButton.addEventListener("click", handleEqualsClick);

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", handleClearClick);

const backspaceButton = document.querySelector(".backspace");
backspaceButton.addEventListener("click", handleBackspaceClick);
