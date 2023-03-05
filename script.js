const LCD = document.querySelector(".lcd");
const BUTTONS = document.querySelectorAll("button");
const CLEAR = document.querySelector("#clear");
const calc = {
  stream: [],
  result: 0,
  afterOperator: false,
  buttons: [],
  chained: false,
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
  calc.result = 0;
  calc.afterOperator = false;
  calc.buttons = [];
  calc.chained = false;
  calc.error = false;
}

function inputToLCD(char) {
  const display = LCD.textContent;
  const maxLength = display.includes("-") ? 11 : 10;
  if (display.length === maxLength && calc.afterOperator === false) return;
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

function typeOfButton(button) {
  if (button.classList.contains("operator")) {
    switch (button.id) {
      case "addition":
      case "subtraction":
      case "multiplication":
      case "division":
      case "equals":
        return "operator";
    }
  } else {
    return "other";
  }
}

function analizeInput(button) {
  if (!LCD.classList.contains("result")) {
    LCD.classList.add("result");
  } else {
    LCD.classList.remove("result");
  }
  if (!button.classList.contains("pressed")) {
    button.classList.add("pressed");
  } else {
    button.classList.remove("pressed");
  }
  calc.buttons.push(typeOfButton(button));
  if (calc.buttons.length === 3) calc.buttons.shift();
  if (calc.buttons[0] === "operator" && calc.buttons[1] === "operator") {
    calc.chained = true;
  } else {
    calc.chained = false;
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
  if (calc.afterOperator && calc.chained && calc.stream.length === 2) {
    calc.stream[1] = operator;
    return;
  }
  calc.stream.push(Number(LCD.textContent));
  calc.stream.push(operator);
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
    const sign = result < 0 ? "-" : "";
    const absValue = result < 0 ? result * -1 : result;
    let strValue = absValue.toString();
    if (strValue.length > 10 && absValue < 1) {
      const mantissa = strValue.slice(2, 6);
      if (mantissa === "0000") {
        strValue = absValue.toExponential(4);
      } else {
        strValue = strValue.slice(0, 10);
      }
    } else if (strValue.length > 10 && 1 <= absValue) {
      if (strValue.slice(0, 9).includes(".")) {
        const mantissa = Number(strValue.slice(strValue.indexOf(".") + 1, 10));
        if (mantissa === 0) {
          strValue = absValue.toExponential(4);
        } else {
          strValue = strValue.slice(0, 10);
        }
      } else {
        strValue = absValue.toExponential(4);
      }
    }
    LCD.textContent = sign + strValue;
    if (calc.stream.length === 4) calc.stream[2] = result;
  }
}

BUTTONS.forEach((button) => {
  button.addEventListener("click", () => analizeInput(button));
  button.addEventListener("transitionend", () => {
    button.classList.remove("pressed");
  });
});
LCD.addEventListener("transitionend", () => {
  LCD.classList.remove("result");
});
window.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "escape":
      analizeInput(document.querySelector("#clear"));
      break;
    case "backspace":
    case "delete":
      analizeInput(document.querySelector("#backspace"));
      break;
    case "%":
      analizeInput(document.querySelector("#percent"));
      break;
    case "r":
      analizeInput(document.querySelector("#squareroot"));
      break;
    case "+":
      analizeInput(document.querySelector("#addition"));
      break;
    case "-":
      analizeInput(document.querySelector("#subtraction"));
      break;
    case "*":
      analizeInput(document.querySelector("#multiplication"));
      break;
    case "/":
      analizeInput(document.querySelector("#division"));
      break;
    case "enter":
    case "=":
      analizeInput(document.querySelector("#equals"));
      break;
    case "0":
      analizeInput(document.querySelector("#num0"));
      break;
    case "1":
      analizeInput(document.querySelector("#num1"));
      break;
    case "2":
      analizeInput(document.querySelector("#num2"));
      break;
    case "3":
      analizeInput(document.querySelector("#num3"));
      break;
    case "4":
      analizeInput(document.querySelector("#num4"));
      break;
    case "5":
      analizeInput(document.querySelector("#num5"));
      break;
    case "6":
      analizeInput(document.querySelector("#num6"));
      break;
    case "7":
      analizeInput(document.querySelector("#num7"));
      break;
    case "8":
      analizeInput(document.querySelector("#num8"));
      break;
    case "9":
      analizeInput(document.querySelector("#num9"));
      break;
    case ".":
      analizeInput(document.querySelector("#dot"));
      break;
  }
});
