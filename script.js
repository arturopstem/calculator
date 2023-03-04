const LCD = document.querySelector(".lcd");
const BUTTONS = document.querySelectorAll("button");
const CLEAR = document.querySelector("#clear");
const calc = {
  stream: [],
  result: 0,
  afterOperator: false,
  lastButton: undefined,
  error: false,
};

const addition = (a, b) => a + b;
const subtraction = (a, b) => a - b;
const multiplication = (a, b) => a * b;
const division = (a, b) => a / b;
const squareRoot = (x) => Math.sqrt(x);
const percent = (a, p, operator) => {
  if (operator === "addition") return a + (a * p) / 100;
  if (operator === "subtraction") return a - (a * p) / 100;
  if (operator === "multiplication") return (a * p) / 100;
  if (operator === "division") return (a * 100) / p;
};

function clearAll() {
  LCD.textContent = "0";
  calc.stream = [];
  calc.afterOperator = false;
  calc.result = 0;
  calc.error = false;
  allowOperator = false;
}

function inputToLCD(char) {
  const display = LCD.textContent;
  const maxLength = display.includes("-") ? 11 : 10;
  if (display.length === maxLength) return;
  allowOperator = true;
  if (char === "-" && (display.includes("-") || display !== "0")) return;
  if (display === "-" && char === ".") {
    LCD.textContent = display + "0.";
    return;
  }
  if (calc.afterOperator && char === ".") {
    calc.afterOperator = false;
    LCD.textContent = "0.";
    return;
  }
  if (display === "0" && char === "0") return;
  if (char === "." && display.includes(".")) return;
  if (char === "." && display === "0") {
    LCD.textContent += char;
    return;
  }
  if (display === "-0" && /[0-9]/.test(char)) {
    LCD.textContent = "-" + char;
    return;
  }
  if ((display === "0" && /[1-9\-]/.test(char)) || calc.afterOperator) {
    calc.afterOperator = false;
    LCD.textContent = "";
  }
  LCD.textContent += char;
}

function backspace() {
  let display = LCD.textContent;
  if (display === "0") return;
  display = display.slice(0, display.indexOf("e"));
  if (display === "-" || display === "") display = "0";
  LCD.textContent = display;
}

function analizeInput(button) {
  if (button.classList.contains("operator")) {
    switch (button.id) {
      case "addition":
      case "subtraction":
      case "multiplication":
      case "division":
        calc.lastButton = "basicOperator";
        break;
    }
  } else {
    calc.lastButton = "otherButton";
  }
  if (button.id === "clear") clearAll();
  if (calc.error) return;
  if (button.id === "backspace") backspace();
  if (button.classList.contains("numeral")) inputToLCD(button.textContent);
  if (button.classList.contains("operator")) {
    if (
      button.id === "subtraction" &&
      calc.stream.length === 0 &&
      LCD.textContent === "0"
    ) {
      inputToLCD("-");
      return;
    }
    calc.afterOperator = true;
    operate(button.id);
  }
}

function operate(operator) {
  calc.stream.push(Number(LCD.textContent));
  calc.stream.push(operator);
  if (calc.lastButton === "basicOperator" && calc.stream.length > 2) {
    clearCalcStream(2);
    return;
  }
  if (operator === "squareroot") {
    calc.result = squareRoot(Number(LCD.textContent));
    displayResult(calc.result);
    calc.stream = [];
  }
  if (calc.stream[1] === "percent") {
    clearCalcStream(2);
    clearAll();
  }
  if (calc.stream.length > 2 && operator === "percent") {
    if (calc.stream[1] === "equals") {
      clearCalcStream(4);
      displayResult(0);
      return;
    }
    calc.result = percent(calc.stream[0], calc.stream[2], calc.stream[1]);
    displayResult(calc.result);
    clearCalcStream(4);
  }
  if (calc.stream.length > 2 && operator !== "percent") {
    switch (calc.stream[1]) {
      case "addition":
        calc.result = addition(calc.stream[0], calc.stream[2]);
        displayResult(calc.result);
        break;
      case "subtraction":
        calc.result = subtraction(calc.stream[0], calc.stream[2]);
        displayResult(calc.result);
        break;
      case "multiplication":
        calc.result = multiplication(calc.stream[0], calc.stream[2]);
        displayResult(calc.result);
        break;
      case "division":
        calc.result = division(calc.stream[0], calc.stream[2]);
        displayResult(calc.result);
        break;
    }
    clearCalcStream(2);
  }
}

function clearCalcStream(n) {
  for (let i = 0; i < n; i++) calc.stream.shift();
}

function displayResult(result) {
  if (Number.isNaN(result) || result === Infinity) {
    LCD.textContent = "ERROR";
    calc.error = true;
  } else {
    LCD.textContent = result;
  }
}

BUTTONS.forEach((button) => {
  button.addEventListener("click", () => analizeInput(button));
});
