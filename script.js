const LCD = document.querySelector(".lcd");
const CLR = document.querySelector("#clear");
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

CLR.addEventListener("click", () => clearAll());
NUMERAL.forEach((button) => {
  button.addEventListener("click", () => inputToLCD(button.textContent));
});

const MINUS = document.querySelector("#subtraction");
MINUS.addEventListener("click", () => inputToLCD("-"));
