((document) => {

	const isNumber = x =>  /^-?[0-9]+(\.[0-9]+)?$/.test(x)

	const Operators = {
		'^': 3,
		'√': 3,
		'÷': 2,
		'*': 2,
		'+': 1,
		'-': 1,
		'(': 0,
		')': 0,
	};

	class Stack extends Array {
		peek() {
			return this[this.length -1];
		}

		isEmpty() {
			return this.length === 0;
		}
	}

  class Calculator {
  constructor(lastValueInput, currentValueInput) {
		this.currentValue = '';
		this.lastValue = '';
		this.operation = undefined;
		this.result = '';
		this.lastValueInput = lastValueInput;
		this.currentValueInput = currentValueInput;
		this.equalsPressed = false;
		this.expressionToCalculate = '';
  }

  addDigit(digit) {
		this.currentValue += digit;
		this.expressionToCalculate += ' ' + digit;
  }

  addDot() {
		if (this.currentValue.toString().includes('.')) {
			return;
		}
		this.currentValue += '.';
		this.expressionToCalculate += '.';
  }

  deleteLast() {
		if (this.equalsPressed) {
			this.deleteAll()
		} else {
			this.currentValue = this.currentValue.toString().slice(0, -1);
			this.expressionToCalculate = this.expressionToCalculate.toString().slice(0, -2)
      this.currentValueInput.innerText = this.currentValue;
      calc.updateDisplay();
		}
  }

  deleteAll() {
		this.currentValue = '';
		this.lastValue = '';
		this.result = '';
		this.currentValueInput.innerText = '';
		this.equalsPressed = false;
		this.expressionToCalculate = '';
  }

  _updateDisplayWith(value) {
		this.currentValueInput.innerText = '' + value;
  }

  updateDisplay() {
		this._updateDisplayWith(this.expressionToCalculate);
  }

  setOperation(operation) {
		if (this.currentValue.length === 0) {
			this.operation = operation;
			this.expressionToCalculate += " " + this.operation;
			return;
		}
		this.operation = operation;
		this.expressionToCalculate += " " + this.operation;
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
      } else if (operation === '^') {
          if(b === 0) {
              return 1;
          }
          return Math.pow(a, b);     
      } else if (operation === '√') {
          return Math.pow(a, 1/b);     
      } else {
          console.error(`Unknown operation ${operation}`);
      }
  }

  rpn(expression2) {
    let resultStack = [];
    let expression = expression2.split(" ");

    for (let i = 0; i < expression.length; i++) {
      if (!isNaN(parseFloat(expression[i]))) {
        resultStack.push(parseFloat(expression[i]));
      } else {
        let v1 = parseFloat(resultStack.pop());
        let v2 = parseFloat(resultStack.pop());

        if (expression[i] === "+") {
        resultStack.push(v1 + v2);
        } else if (expression[i] === "-") {
        resultStack.push(v2 - v1);
        } else if (expression[i] === "*") {
        resultStack.push(v1 * v2);
        } else if (expression[i] === "÷") {
        resultStack.push(v2 / v1);
        } else if (expression[i] === "^") {
        resultStack.push(Math.pow(v2, v1));
        } else if (expression[i] === "√") {
        resultStack.push(Math.pow(v1, 1/v2));
        }
      }
    }

    if (resultStack.length > 1) {
      return "error";
    } else {
      return resultStack.pop();
    }
}


  fromInfixToPrefix(infixNotationTokens) {
    const infix = []
    const S = new Stack();

    for (const token of infixNotationTokens) {
      if ('(' === token) {
        S.push(token);
        continue;
      }

      if (")" === token) {
        while ("(" !== S.peek()) {
          infix.push(S.pop());
        }
        S.pop();
        continue;
      }

      if (Operators[token]) {
        while (!S.isEmpty() && Operators[token] <= Operators[S.peek()]) {
          infix.push(S.pop());
        }
        S.push(token);
        continue;
      }

      if (isNumber(token)) {
        infix.push(token);
        continue;
      }

      throw "Error";
    }
    
    while (!S.isEmpty()) {
      infix.push(S.pop());
    }

    return infix.join(' ');
  }

tokenize(expression) {
  const result = [];
  let currentDigit = '';
  const addCurrentDigit = () => { 
    if (currentDigit !== '') {
      if (!isNumber(currentDigit)) {
        throw ('Invalid Digit ' + currentDigit );
      }
      result.push(currentDigit); 
      currentDigit = '';
    }
  }
  
  const expresionWithoutSpaces = expression.replace(/\s+/g, "");
  for (const token of expresionWithoutSpaces) {
    if (/[0-9]|\./.test(token)) { 
      currentDigit += token;
    } else if (Operators[token] !== undefined) { 
      addCurrentDigit();
      result.push(token);
    } else {
      throw 'Invalid token ' + token;
    }
  }
  addCurrentDigit();
  return result;
}

  calculate() {
    this.equalsPressed = true;
    const inputTokenized = this.tokenize(this.expressionToCalculate)
    const rpnExpression = this.fromInfixToPrefix(inputTokenized)
    this.result = this.rpn(rpnExpression);
    this.lastValue = this.result;
    this.currentValue = this.currentValue;
    this.expressionToCalculate = '';
    this.expressionToCalculate += ' ' + this.result;
    this._updateDisplayWith(this.result);
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

/**
RPN("2 2 2 * +") // 2 + (2 * 2) = 6
RPN("7 3 + 5 2 - 2 ^ *"); // (7 + 3) * (5 - 2) ^ 2 + 2√90 = 99.48683
RPN("1 2 3 4 + * 2 / 1 - +"); // 1 + 2 * (3 + 4) / 2 - 1 = 7
 */