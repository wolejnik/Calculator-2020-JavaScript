

	const isNumber = x =>  /^-?[0-9]+(\.[0-9]+)?$/.test(x)

	const Operators = {
		'U': 3, // USD
		'E': 3, // EUR
		'C': 3, // CHF
		'N': 3, // NDK
		'^': 3,
		'√': 3,
		'÷': 2,
		'*': 2,
		'+': 1,
		'-': 1,
		'(': 0,
		')': 0,
  };
  
  class CalculationError extends Error {
    constructor(mesg) {
      super(mesg);
    }
  }

	class Stack extends Array {
		peek() {
			return this[this.length -1];
		}

		isEmpty() {
			return this.length === 0;
		}
	}

  class Calculator {
  constructor() {
		this.currentValue = '';
		this.lastValue = '';
		this.operation = undefined;
		this.result = '';
		this.equalsPressed = false;
    this.expressionToCalculate = '';
    this.currencies = {};
  }

  setValueChangeListener(func) {
    this.eventListener = func;
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
      calc.updateDisplay();
		}
  }

  deleteAll() {
		this.currentValue = '';
		this.lastValue = '';
		this.result = '';
		this.equalsPressed = false;
    this.expressionToCalculate = '';
    this.updateDisplay();
  }

  _updateDisplayWith(value) {
		this.currentValueInput.innerText = '' + value;
  }

  updateDisplay() {
    // this.eventListener(this.expressionToCalculate)
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

  rpn(expression2) {
    let resultStack = [];
    let expression = expression2.split(" ");

    for (let i = 0; i < expression.length; i++) {
      const token = expression[i]
      if (!isNaN(parseFloat(token))) {
        resultStack.push(parseFloat(token));
      } else {
        
        if(['U', 'E', 'C', 'N'].includes(token)){
          var v1 = parseFloat(resultStack.pop());
        } else {
          var v1 = parseFloat(resultStack.pop());
          var v2 = parseFloat(resultStack.pop());
        }

        const Calcucation = {
          '+' : {
            calc: (v1, v2) => v1 + v2
          },
          '-' : {
            calc: (v1, v2) => v1 - v2
          },
          '*' : {
            calc: (v1, v2) => v1 * v2

          },
          '÷' : {
            calc: (v1, v2) => v2 / v1,
            valid: (v1, v2) => { 
              if(v1 === 0) {
                throw new Error('Nie można dzielić przez zero.')
              }
            }
          },
          '^' : {
            calc: (v1, v2) => Math.pow(v2, v1),
          },
          '√' : {
            calc: (v1, v2) => Math.pow(v1, 1/v2),
          },
          'E' : {
            calc: (v1) => this.getMoneyInPLN(v1, 'EUR'),
          },
          'U' : {
            calc: (v1) => this.getMoneyInPLN(v1, 'USD'),
          },
          'N' : {
            calc: (v1) => this.getMoneyInPLN(v1, 'NOK'),
          },
          'C' : {
            calc: (v1) => this.getMoneyInPLN(v1, 'CHF'),
          },
        }
        
        const operatorObject = Calcucation[token];
        if(operatorObject) {
          if(operatorObject.valid){
            operatorObject.valid(v1,v2);
          } 
          const result = operatorObject.calc(v1, v2);
          resultStack.push(result);
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

  getCurrencyRate() {
    const currency = document.getElementById("selectCurrency").options[document.getElementById("selectCurrency").selectedIndex].value;

    if (this.currencies[currency]) {
      return;
    } else {
      fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${currency}`)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        this.currencies[currency] = myJson.rates[0].mid;
        this.expressionToCalculate += currency.toString().slice(0, -2);
        calc.updateDisplay();
      });
    }
  }

  getMoneyInPLN(value, currency) {
    let currencyRate = this.currencies[currency];
    if (currencyRate) {
        return value * currencyRate;
    } else {
        this.getCurrencyRate(currency);
        return false;
    }
}

  calculate(expression) {
    this.expressionToCalculate = expression;
    this.equalsPressed = true;
    const inputTokenized = this.tokenize(this.expressionToCalculate)
    const rpnExpression = this.fromInfixToPrefix(inputTokenized)
    this.result = this.rpn(rpnExpression);
    this.lastValue = this.result;
    this.currentValue = this.currentValue;
    this.expressionToCalculate = '';
    this.expressionToCalculate += ' ' + this.result;
    this.updateDisplay(this.result);
    return this.result;
  }
}

if(typeof module !== 'undefined') {
  module.exports = new Calculator();
}
