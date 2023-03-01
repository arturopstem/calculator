const LCD = document.querySelector(".lcd");
const CLR = document.querySelector("#clear");
const BK = document.querySelector("#backspace");
const NUMERAL = document.querySelectorAll(".numeral");

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

const MINUS = document.querySelector("#subtraction");
MINUS.addEventListener("click", () => inputToLCD("-"));
