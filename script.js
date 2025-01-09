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

  if (displayValue !== "Error") {
    displayValue = formatDisplayValue(displayValue);
  }
  display.textContent = displayValue;
}

// Format integers 
function formatDisplayValue(value) {
  if (value === "Error" || isNaN(value)) return "Error";
  const num = parseFloat(value);
  if (!isFinite(num)) return "Error";

  // Plain integer unless it exceeds 12 digits
  if (Math.abs(num) < 1e11) {
    // If integer & short enough
    if (Number.isInteger(num)) {
      const intString = num.toString();
      if (intString.length <= 12) return intString;
      // Otherwise we trim digits from the integer until it fits
      return trimDecimal(intString);
    }

    // Convert to string
    let dec = num.toString();

    // If it fits, use it
    if (dec.length <= 12) return dec;

    // Otherwise trim
    return trimDecimal(dec);
  }

  // Exponential notation if bigger than 1e11
  for (let i = 15; i >= 1; i--) {
    const expStr = num.toExponential(i);
    if (expStr.length <= 12) return expStr;
  }
  // If that fails, minimal exponent
  return num.toExponential(1);
}

// Trims integer string down to 12 digits
function trimDecimal(str) {
  if (str.length <= 12) return str;
  while (str.length > 12) {
    str = str.slice(0, -1);
  }
  // If we end on a decimal, remove it
  return str.replace(/\.$/, "");
}

// Handles digits
function handleDigitClick(e) {
  const digit = e.target.getAttribute("data-value");

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

  updateDisplayNoFormat();
}

// Handle Operator Click
function handleOperatorClick(e) {
  const selectedOperator = e.target.getAttribute("data-value");

  if (num1 === null) {
    num1 = parseFloat(displayValue);
  } else if (!resetDisplay) {
    num2 = parseFloat(displayValue);
    const result = operate(operator, num1, num2);
    displayValue = result.toString();
    num1 = (result === "Error") ? null : result;
    updateDisplay();
  }
  operator = selectedOperator;
  resetDisplay = true;
}

// Handles Keyboard Inputs
function handleDigitFromKeyboard(digit) {
  if (displayValue === "Error") {
    displayValue = "0";
    num1 = null;
    num2 = null;
    operator = null;
  }

  if (digit === "." && displayValue.includes(".")) {
    return;
  }

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

  updateDisplayNoFormat();
}

// Handle Equals
function handleEqualsClick() {
  if (operator && num1 !== null) {
    num2 = parseFloat(displayValue) || 0;
    const result = operate(operator, num1, num2);
    displayValue = (result === "Error") ? "Error" : result.toString();
    updateDisplay();
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

// Keydown listeners for digits, decimal and backspace
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    handleDigitFromKeyboard(e.key);
  } else if (e.key === ".") {
    handleDigitFromKeyboard(".");
  } else if (e.key === "Backspace") {
    handleBackspaceClick();
  }
});
