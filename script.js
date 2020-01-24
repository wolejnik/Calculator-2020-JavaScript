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
  const currency = document.getElementById("selectCurrency");
  const currentValueInput = document.querySelector('.current-operand');


  initClickListenersForButtonsArray(digitalButtons, text => calc.addDigit(text));
  initClickListenersForButtonsArray(operationsButton, text => calc.setOperation(text));
  initClickListenersForButtonsArray(dotButton, () => calc.addDot());
  equalsButton.addEventListener('click', () => calc.calculate(currentValueInput.innerText));
  deleteAllButton.addEventListener('click', () => calc.deleteAll());
  deleteButton.addEventListener('click', () => calc.deleteLast());
  currency.addEventListener('change', () => calc.getCurrencyRate(document.getElementById("selectCurrency").options[document.getElementById("selectCurrency").selectedIndex].value));
  calc.setValueChangeListener( (value) => { 
    console.log(value)
    currentValueInput.innerText = '' + value;
   })
};

const calc = new Calculator();
initCalcListeners(calc);