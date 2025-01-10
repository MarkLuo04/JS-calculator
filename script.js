// Calculator State
let displayValue = "0";
let num1 = null;
let num2 = null;
let operator = null;
let resetDisplay = false;
let justPressedEquals = false; 

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

  // Prevents input of digits after a calculation
  if (justPressedEquals) {
    return;
  }

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
  justPressedEquals = false;

  const selectedOperator = e.target.getAttribute("data-value");

  // If num1 is null, set it from displayValue
  if (num1 === null) {
    num1 = parseFloat(displayValue);
  } 
  // If we have an operator set and the user just typed a number 
  // we do a partial calculation first
  else if (!resetDisplay) {
    num2 = parseFloat(displayValue);
    const result = operate(operator, num1, num2);
    displayValue = result.toString();
    num1 = (result === "Error") ? null : result;
    updateDisplay();
  }
  // Now set the new operator 
  operator = selectedOperator;
  resetDisplay = true;
}


// Handles digits inputted from keyboard
function handleDigitFromKeyboard(digit) {

  // Prevents input of digits after a calculation
  if (justPressedEquals) {
    return;
  }

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

// Handles operators from keyboard input
function handleOperatorFromKeyboard(selectedOperator) {
  justPressedEquals = false;

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

// Handle Equals
function handleEqualsClick() {
  // If we have an operator and num1 is not null
  if (operator && num1 !== null) {
    num2 = parseFloat(displayValue) || 0;
    const result = operate(operator, num1, num2);

    displayValue = (result === "Error") ? "Error" : result.toString();
    updateDisplay();

    // Prepare for next calculation chain
    num1 = (result === "Error") ? null : result;
    num2 = null;
    operator = null;

    resetDisplay = true; 
    justPressedEquals = true;
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
  // Ensuring we can type digits after
  justPressedEquals = false;
}

// Mapping keys to values
function mapKeyToDataValue(key) {
  // Digits, decimal
  if ((key >= "0" && key <= "9") || key === ".") return key;

  // Backspace, Escape, Enter
  if (key === "Backspace") return "backspace";
  if (key === "Escape")   return "clear";
  if (key === "Enter" || key === "NumpadEnter") return "=";

  // Operators
  if (key === "+") return "+";
  if (key === "-") return "-";
  if (key === "/") return "/";
  if (key === "*") return "*";

  // Square root
  if (key === "s" || key === "S") return "sqrt";

  // No match
  return null;
}

// Highlights button when pressed through keyboard input
function highlightButton(key) {
  const dataValue = mapKeyToDataValue(key);
  if (!dataValue) return;

  // Find the button with that data value
  const button = document.querySelector(`[data-value="${dataValue}"]`);
  if (!button) return;

  button.classList.add("pressed");

  // Remove it after a short delay
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 150);
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

// Keydown listeners
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    handleDigitFromKeyboard(e.key);
  } else if (e.key === ".") {
    handleDigitFromKeyboard(".");
  } else if (e.key === "Backspace") {
    handleBackspaceClick();
  } 
  // operators, equals, clear, and sqrt
  else if (e.key === "Enter" || e.key === "NumpadEnter" || e.key === "=") {
    handleEqualsClick();
  } else if (e.key === "+") {
    handleOperatorFromKeyboard("+");
  } else if (e.key === "-") {
    handleOperatorFromKeyboard("-");
  } else if (e.key === "/") {
    handleOperatorFromKeyboard("/");
  } else if (e.key === "*") {
    handleOperatorFromKeyboard("*");
  } else if (e.key === "Escape") {
    handleClearClick();
  } 
  // For square root, we can choose "s" or "S"
  else if (e.key === "s" || e.key === "S") {
    handleSqrtClick();
  }
  // Triggers button highlight
  highlightButton(e.key);
});

