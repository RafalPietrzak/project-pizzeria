import {select, settings} from '../settings.js';


class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.initAction();
    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.setValue(thisWidget.input.value);
    // console.log('AmountWidget: ', thisWidget);
    // console.log('constructor arguments:', element);
  }
  getElements(elelment) {
    const thisWidget = this;

    thisWidget.element = elelment;
    thisWidget.input = thisWidget.element.querySelector(
      select.widgets.amount.input
    );
    thisWidget.linkDecrease = thisWidget.element.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.linkIncrease = thisWidget.element.querySelector(
      select.widgets.amount.linkIncrease
    );
  }
  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);
    if (
      newValue >= settings.amountWidget.defaultMin 
        && newValue <= settings.amountWidget.defaultMax
    ) {
      thisWidget.value = newValue;
      thisWidget.announce();
    }
    thisWidget.input.value = thisWidget.value;
  }
  initAction() {
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value - 1 );
    });
    thisWidget.linkIncrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value + 1 );
    });
  }
  announce() {
    const thisWidget = this;
    const event = new Event('updated', { bubbles : true });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;