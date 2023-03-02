const LCD = document.querySelector(".lcd");
const CLR = document.querySelector("#clear");
const BK = document.querySelector("#backspace");
const NUMERAL = document.querySelectorAll(".numeral");

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
}

function inputToLCD(char) {
  const display = LCD.textContent;
  const maxLength = display.includes("-") ? 11 : 10;
  if (display.length === maxLength) return;
  if (char === "-" && (display.includes("-") || display !== "0")) return;
  if (display === "-" && char === ".") {
    LCD.textContent = display + "0.";
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
  if (display === "0" && /[1-9\-]/.test(char)) LCD.textContent = "";
  LCD.textContent += char;
}

function backspace() {
  let display = LCD.textContent;
  if (display === "0") return;
  display = display.slice(0, display.indexOf("e"));
  if (display === "-" || display === "") display = "0";
  LCD.textContent = display;
}

CLR.addEventListener("click", () => clearAll());
BK.addEventListener("click", () => backspace());
NUMERAL.forEach((button) => {
  button.addEventListener("click", () => inputToLCD(button.textContent));
});
