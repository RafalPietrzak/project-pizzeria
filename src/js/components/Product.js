
import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }
  renderInMenu() {
    const thisProduct = this;
    const ganeratedHTML = templates.menuProduct(thisProduct.data);
    const menuContainer = document.querySelector(select.containerOf.menu);
    thisProduct.element = utils.createDOMFromHTML(ganeratedHTML);
    menuContainer.appendChild(thisProduct.element);
  }
  initAccordion() {
    const thisProduct = this;
    thisProduct.accordionTrigger.addEventListener('click', function () {
      thisProduct.element.classList.toggle(
        classNames.menuProduct.wrapperActive
      );
      const activeProducts = document.querySelectorAll(
        select.all.menuProductsActive
      );
      for (let activeProduct of activeProducts) {
        if (activeProduct != thisProduct.element) {
          activeProduct.classList.remove('active');
        }
      }
    });
  }
  getElements() {
    const thisProduct = this;
    thisProduct.accordionTrigger = thisProduct.element.querySelector(
      select.menuProduct.clickable
    );
    thisProduct.form = thisProduct.element.querySelector(
      select.menuProduct.form
    );
    thisProduct.formInputs = thisProduct.form.querySelectorAll(
      select.all.formInputs
    );
    thisProduct.cartButton = thisProduct.element.querySelector(
      select.menuProduct.cartButton
    );
    thisProduct.priceElem = thisProduct.element.querySelector(
      select.menuProduct.priceElem
    );
    thisProduct.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    );
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    );
  }
  initOrderForm() {
    const thisProduct = this;
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });
    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault;
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = thisProduct.data.params;
    let productPrice = thisProduct.data.price;
    thisProduct.params = {};

    for (let param in params) {
      for (let option in params[param].options) {
        const optionData = params[param].options[option];
        const isDefault = ('default' in optionData) ? true : false;
        const isActive = (param in formData) 
          ? formData[param].includes(option) : false;
        const price = optionData.price;
        if (isActive && !isDefault){
          productPrice += price;
        } else if (!isActive && isDefault) {
          productPrice -= price;
        }
        if(isActive){
          if(!thisProduct.params[param]) {
            thisProduct.params[param] = {
              label: params[param].label,
              options: {},
            };
          }
          thisProduct.params[param].options[option] = optionData.label;
        }
        const images = thisProduct.imageWrapper.querySelectorAll(
          '.'+ param +'-'+ option
        );
        for (let image of images) {
          if (isActive && image != undefined) {
            image.classList.add(classNames.menuProduct.imageVisible);
          } else if (image != undefined) {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    thisProduct.priceSingle = productPrice;
    thisProduct.price = thisProduct.priceSingle 
    * thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = thisProduct.price;
    console.log(thisProduct.params);
  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;
    thisProduct.amount = thisProduct.amountWidget.value;
    thisProduct.name = thisProduct.data.name;
    
    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      }
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;