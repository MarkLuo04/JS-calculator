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
  return b !== 0 ? a / b : "Error"; // Avoid dividing by zero
}
function squareRoot(a) {
  return a < 0 ? "Error" : Math.sqrt(a);
}

// Updating display for initial inputs (no formatting)
function updateDisplayNoFormat() {
  const display = document.querySelector(".display");
  display.textContent = displayValue;
}

// Update Display
function updateDisplay() {
  const display = document.querySelector(".display");

  // Only format if it's not error 
  if (displayValue !== "Error") {
    displayValue = formatDisplayValue(displayValue);
  }

  display.textContent = displayValue;
}

// Format display numbers
function formatDisplayValue(value) {
    // Return Error if invalid
    if (value === "Error" || isNaN(value)) return "Error";
    const num = parseFloat(value);
    if (!isFinite(num)) return "Error";
  
    // Up to 12 digits in plain format
    if (Math.abs(num) < 1e9 && (num === 0 || Math.abs(num) >= 1e-6)) {
      let normal = num.toPrecision(12);
      // If it's not in exponent form, remove trailing zeros
      if (!normal.includes("e")) {
        normal = normal.replace(/(\.\d*?[1-9])0+$/, "$1");
        normal = normal.replace(/\.$/, "");
      }
      // If that fits 12 chars or fewer, return it
      if (normal.length <= 12) return normal;
      // Otherwise, switch to exponential
    }
  
    // Exponential total length at 12
    for (let i = 12; i >= 1; i--) {
      const test = num.toExponential(i); 
      if (test.length <= 12) return test;
    }
  
    // Fallback if somehow everything else fails
    return num.toExponential(1);
}


// Handles digits
function handleDigitClick(e) {
  const digit = e.target.getAttribute("data-value");

  // If display shows Error, reset
  if (displayValue === "Error") {
    displayValue = "0";
    num1 = null;
    num2 = null;
    operator = null;
  }

  // Prevent multiple decimals
  if (digit === "." && displayValue.includes(".")) {
    return;
  }

  // Max 12 characters
  if (displayValue.length >= 12 && !resetDisplay) {
    return;
  }

  if (resetDisplay) {
    displayValue = digit;
    resetDisplay = false;
  } else if (displayValue === "0" && digit !== ".") {
    displayValue = digit;
  } else {
    displayValue += digit;
  }

  // No formatting when inputting
  updateDisplayNoFormat();
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
    // After pressing equals, apply format
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
  // After sqrt, we apply format
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
    displayValue = "0";
    // No-format update when manually editing
    updateDisplayNoFormat();
    return;
  }

  if (
    displayValue.length === 1 ||
    (displayValue.startsWith("-") && displayValue.length === 2)
  ) {
    displayValue = "0";
  } else {
    displayValue = displayValue.slice(0, -1); 
  }

  updateDisplayNoFormat();
}

// Handle Clear
function handleClearClick() {
  displayValue = "0";
  num1 = null;
  num2 = null;
  operator = null;
  resetDisplay = false;
  updateDisplayNoFormat();
}

// Event Listeners
const digitButtons = document.querySelectorAll(".nums");
digitButtons.forEach(btn => {
  btn.addEventListener("click", handleDigitClick);
});

const operatorButtons = document.querySelectorAll(".operators");
operatorButtons.forEach(btn => {
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
