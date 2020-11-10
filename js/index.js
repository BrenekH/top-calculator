const displayController = {
	displayValue: "",
	updateDisplay: function () {
		document.getElementById("display").textContent = displayValue;
	},
	updateController: function() {
		this.displayValue = document.getElementById("display").textContent;
	},
}

var operationArray = []; // Keeps track of numbers and operations in order

function setup() {
	displayController.updateDisplay();
	// TODO: Setup event handlers
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

	return operationArray[0];
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
