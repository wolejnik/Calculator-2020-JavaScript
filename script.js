((document) => { //not poluting globals
	
class Calculator {
    constructor(lastValueInput, currentValueInput) {
      this.currentValue = "";
      this.lastValue = "";
      this.operation = undefined;
      this.result = "";
      this.lastValueInput = lastValueInput;
      this.currentValueInput = currentValueInput;
    }
  
    addDigit(digit) {
      this.currentValue += digit;
    }
  
    addDot() {
      if (this.currentValue.includes(".")) {
        return;
      }
      this.currentValue += ".";
    }
  
    deleteLast() {
      this.currentValue = this.currentValue.toString().slice(0, -1);
      this.currentValueInput.innerText = this.currentValue;
    }
  
    deletaAll() {
      this.currentValue = "";
      this.lastValue = "";
      this.result = "";
      this.currentValueInput.innerText = "";
    }

    updateDisplay() {
      this.currentValueInput.innerText = this.currentValue;
    }
  
    setOperation(operation) {
      this.operation = operation;
      this.lastValue = this.currentValue;
      this.currentValue = "";
    }
  
    _calculateByOperation(operation, a, b) {
      
      if(b === 0) {
        return 0;
      }

      if (operation === "+") {
        return a + b;
      } else if (operation === "-") {
        return a - b;
      } else if (operation === "*") {
        return a * b;
      } else if (operation === "÷") {
        return a / b;
      } else {
        console.error(`Unknown operation ${operation}`);
      }
    }
  
    calculate() {
      const a = parseFloat(this.lastValue);
      const b = parseFloat(this.currentValue);
      if (isNaN(a) || isNaN(b)) {
        return;
      }
      this.result = this._calculateByOperation(this.operation, a, b);
      this.currentValue = this.result;
    }
  }
  
  
  
  const initCalcListeners = (calc) => {
	 
  	const initClickListenersForButtonsArray = (arrayOfButtons, buttonCallback) => {
		arrayOfButtons.forEach(button => {
			button.addEventListener('click', () => {
				buttonCallback(button.innerText);
				calc.updateDisplay();
			});
		});
	};
	  
	const digitalButtons = [...document.getElementsByClassName('btn-primary')];
	const dotButton = [...document.getElementsByClassName('btn-secondary')];
	const equalsButton = [...document.getElementsByClassName('btn-success')];
	const operationsButton = [...document.getElementsByClassName('btn-info')];
	const deleteAllButton = document.querySelector('.delete-all');
	const deleteButton  = document.querySelector('.delete-one');
	  
	initClickListenersForButtonsArray(digitalButtons, text => calc.addDigit(text));
	initClickListenersForButtonsArray(operationsButton, text => calc.setOperation(text));
	initClickListenersForButtonsArray(dotButton, () => calc.addDot());
	initClickListenersForButtonsArray(equalsButton, () => calc.calculate());
	deleteAllButton.addEventListener('click', () => calc.deletaAll());
	deleteButton.addEventListener('click', () => calc.deleteLast());
  };
  
  const lastValueInput = document.querySelector('.last-operand');
  const currentValueInput = document.querySelector('.current-operand');
  const calc = new Calculator(lastValueInput, currentValueInput);
  initCalcListeners(calc);
  
})(document);
  
