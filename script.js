((document) => { //not poluting globals

  class Calculator {
  constructor(lastValueInput, currentValueInput) {
      this.currentValue = '';
      this.lastValue = '';
      this.operation = undefined;
      this.result = '';
      this.lastValueInput = lastValueInput;
      this.currentValueInput = currentValueInput;
      this.equalsPressed = false;
  }

  addDigit(digit) {
      this.currentValue += digit;
  }

  addDot() {
      if (this.currentValue.toString().includes('.')) {
          return;
      }
      this.currentValue += '.';
  }

  deleteLast() {
      if (this.equalsPressed) {
          this.deleteAll()
      } else {
          this.currentValue = this.currentValue.toString().slice(0, -1);
          this.currentValueInput.innerText = this.currentValue;
      }
  }

  deleteAll() {
      this.currentValue = '';
      this.lastValue = '';
      this.result = '';
      this.currentValueInput.innerText = '';
      this.equalsPressed = false;
  }

  _updateDisplayWith(value) {
      this.currentValueInput.innerText = '' + value;
  }

  updateDisplay() {
      this._updateDisplayWith(this.currentValue);
  }

  setOperation(operation) {
      // Gdy wciśniemy cyfrę a następnie kilka razy różne bądź te same operatory to przestaje działać
      if (this.currentValue.length === 0) {
          this.operation = operation;
          return;
      }
      this.operation = operation;
      if (!this.equalsPressed) {
          this.lastValue = this.currentValue;
      }
      this.equalsPressed = false;
      this.currentValue = '';
  }

  _calculateByOperation(operation, a, b) {
      if (operation === '+') {
          return a + b;
      } else if (operation === '-') {
          return a - b;
      } else if (operation === '*') {
          return a * b;
      } else if (operation === '÷') {
          if(b === 0) {
              return 0;
          }
          return a / b;
      } else {
          console.error(`Unknown operation ${operation}`);
      }
  }

  calculate() {
      this.equalsPressed = true;
      const a = parseFloat(this.lastValue);
      const b = parseFloat(this.currentValue);
      if (isNaN(a) || isNaN(b)) {
          return;
      }
      this.result = this._calculateByOperation(this.operation, a, b);
      this.lastValue = this.result;
      this.currentValue = this.currentValue;
      this._updateDisplayWith(this.result);
  }
}



const initCalcListeners = (calc) => {
  const initClickListenersForButtonsArray = (arrayOfButtons, buttonCallback) => {
      arrayOfButtons.forEach(button => {
          button.addEventListener('click', () => {
              buttonCallback(button.innerText);
          // Podczas wybierania operatora znikają liczby na wyświetlaczu
          if(!button.classList.contains('btn-info')) {
              calc.updateDisplay();
          }
       });
      });
  };

  const digitalButtons = [...document.getElementsByClassName('btn-primary')];
  const dotButton = [...document.getElementsByClassName('btn-secondary')];
  const operationsButton = [...document.getElementsByClassName('btn-info')];
  const equalsButton = document.querySelector('.btn-success');
  const deleteAllButton = document.querySelector('.delete-all');
  const deleteButton  = document.querySelector('.delete-one');

  initClickListenersForButtonsArray(digitalButtons, text => calc.addDigit(text));
  initClickListenersForButtonsArray(operationsButton, text => calc.setOperation(text));
  initClickListenersForButtonsArray(dotButton, () => calc.addDot());
  equalsButton.addEventListener('click', () => calc.calculate());
  deleteAllButton.addEventListener('click', () => calc.deleteAll());
  deleteButton.addEventListener('click', () => calc.deleteLast());
};

const lastValueInput = document.querySelector('.last-operand');
const currentValueInput = document.querySelector('.current-operand');
const calc = new Calculator(lastValueInput, currentValueInput);
initCalcListeners(calc);


})(document);