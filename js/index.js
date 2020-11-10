const displayController = {
	displayValue: "",
	negativeActive: false,
	resetReady: false,
	updateDisplay: function () {
		if (this.displayValue.startsWith("-")) {
			this.negativeActive = true;
			let displayArray = this.displayValue.split("");
			displayArray.splice(0, 1);
			this.displayValue = displayArray.join("");
		}
		if (this.displayValue.length > 11) {
			let displayArray = this.displayValue.split("");
			displayArray.pop();
			this.displayValue = displayArray.join("");
		}
		if (this.negativeActive) {
			document.getElementById("negative-display").textContent = "-";
		} else {
			document.getElementById("negative-display").textContent = "\xa0";	// This sets the negative section to a non-breaking space, ensuring the browser doesn't collapse the display container border
		}
		document.getElementById("display").textContent = this.displayValue;
	},
	updateController: function() {
		this.displayValue = document.getElementById("display").textContent;
		this.negativeActive = document.getElementById("negative-display").textContent === "-";
	},
}

var operationArray = []; // Keeps track of numbers and operations in order

function setup() {
	displayController.updateController();
	displayController.updateDisplay();

	// Setup event listeners
	document.getElementById("num-0").addEventListener("click", () => { inputNumber(0); });
	document.getElementById("num-1").addEventListener("click", () => { inputNumber(1); });
	document.getElementById("num-2").addEventListener("click", () => { inputNumber(2); });
	document.getElementById("num-3").addEventListener("click", () => { inputNumber(3); });
	document.getElementById("num-4").addEventListener("click", () => { inputNumber(4); });
	document.getElementById("num-5").addEventListener("click", () => { inputNumber(5); });
	document.getElementById("num-6").addEventListener("click", () => { inputNumber(6); });
	document.getElementById("num-7").addEventListener("click", () => { inputNumber(7); });
	document.getElementById("num-8").addEventListener("click", () => { inputNumber(8); });
	document.getElementById("num-9").addEventListener("click", () => { inputNumber(9); });

	document.getElementById("add-button").addEventListener("click", () => { addOperation("+"); });
	document.getElementById("subtract-button").addEventListener("click", () => { addOperation("-"); });
	document.getElementById("multiply-button").addEventListener("click", () => { addOperation("*"); });
	document.getElementById("divide-button").addEventListener("click", () => { addOperation("/"); });

	document.getElementById("clear-button").addEventListener("click", () => { reset(); });
	document.getElementById("back-button").addEventListener("click", () => {
		if (displayController.resetReady) { return; }
		let displayArray = displayController.displayValue.split("");
		displayArray.pop();
		displayController.displayValue = displayArray.join("");
		displayController.updateDisplay();
	});
	document.getElementById("floating-point").addEventListener("click", () => {
		// TODO: Implement
		console.log(".");
	});
	document.getElementById("negative-toggle").addEventListener("click", () => {
		if (displayController.negativeActive) {
			displayController.negativeActive = false;
		} else {
			displayController.negativeActive = true;
		}
		displayController.updateDisplay();
	});

	document.getElementById("execute-operation").addEventListener("click", () => {
		addOperation("=");
		operationArray.pop();	// Remove the equal sign we just inserted
		if (typeof(operationArray[operationArray.length-1]) === "string") {
			operationArray.pop();
		}
		displayController.displayValue = operate().toString();
		displayController.updateDisplay();
		displayController.resetReady = true;
	});
}

function inputNumber(inNum) {
	if (this.resetReady) {
		reset();
		this.resetReady = false;
	}
	displayController.displayValue += inNum.toString();
	displayController.updateDisplay();
}

function addOperation(opString) {
	let num = parseInt(displayController.displayValue);
	if (displayController.negativeActive) {
		num *= -1;
	}
	operationArray.push(num);
	operationArray.push(opString);	// +, -, *, /

	displayController.displayValue = "";
	displayController.negativeActive = false;
	displayController.updateDisplay();
}

function reset() {
	displayController.displayValue = "";
	displayController.negativeActive = false;
	displayController.updateDisplay();
	operationArray.splice(0, operationArray.length);
}

function operate() {
	while(operationArray.indexOf("*") !== -1 || operationArray.indexOf("/") !== -1) {
		let multiplyIndex = operationArray.indexOf("*");
		let divideIndex = operationArray.indexOf("/");

		if (multiplyIndex < divideIndex) {
			if (multiplyIndex !== -1) {
				multiply(multiplyIndex);
			} else if (divideIndex !== -1) {
				divide(divideIndex);
			}
		} else {
			if (divideIndex !== -1) {
				divide(divideIndex);
			} else if (multiplyIndex !== -1) {
				multiply(multiplyIndex);
			}
		}
	}

	while(operationArray.indexOf("+") !== -1 || operationArray.indexOf("-") !== -1) {
		let addIndex = operationArray.indexOf("+");
		let subtractIndex = operationArray.indexOf("-");

		if (addIndex < subtractIndex) {
			if (addIndex !== -1) {
				add(addIndex);
			} else if (subtractIndex !== -1) {
				subtract(subtractIndex);
			}
		} else {
			if (subtractIndex !== -1) {
				subtract(subtractIndex);
			} else if (addIndex !== -1) {
				add(addIndex);
			}
		}
	}
	let returnValue = operationArray[0];
	operationArray.splice(0, operationArray.length);
	return returnValue;
}

function add(index) {
	operationArray[index] = operationArray[index-1] + operationArray[index+1]
	operationArray.splice(index+1, 1);
	operationArray.splice(index-1, 1);
}

function subtract(index) {
	operationArray[index] = operationArray[index-1] - operationArray[index+1]
	operationArray.splice(index+1, 1);
	operationArray.splice(index-1, 1);
}

function multiply(index) {
	operationArray[index] = operationArray[index-1] * operationArray[index+1]
	operationArray.splice(index+1, 1);
	operationArray.splice(index-1, 1);
}

function divide(index) {
	// TODO: Gracefully handle division by zero errors
	operationArray[index] = operationArray[index-1] / operationArray[index+1]
	operationArray.splice(index+1, 1);
	operationArray.splice(index-1, 1);
}

function testOperate() {
	let currentOpArrayVal = [...operationArray];
	// 7 - 24 / 8 * 4 + 6
	operationArray = [7, "-", 24, "/", 8, "*", 4, "+", 6];
	console.log("7 - 24 / 8 * 4 + 6 =", operate(), "(Should be 1)");

	// 18 / 3 - 7 + 2 * 5
	operationArray = [18, "/", 3, "-", 7, "+", 2, "*", 5];
	console.log("18 / 3 - 7 + 2 * 5 =", operate(), "(Should be 9)");

	// 6 * 4 / 12 + 72 / 8 - 9
	operationArray = [6, "*", 4, "/", 12, "+", 72, "/", 8, "-", 9];
	console.log("6 * 4 / 12 + 72 / 8 - 9 =", operate(), "(Should be 2)");

	operationArray = [...currentOpArrayVal];
}
