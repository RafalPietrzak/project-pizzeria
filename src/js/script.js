/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  ('use strict');
  
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart'
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select'
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]'
    },
    widgets: {
      amount: {
        input: 'input.amount', 
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]'
      }
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active'
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    ),
    cartProduct: Handlebars.compile(
      document.querySelector(select.templateOf.cartProduct).innerHTML
    ),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.rebderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }
    rebderInMenu() {
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
      });
    }
    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = thisProduct.data.params;
      let productPrice = thisProduct.data.price;
      for (let param in params) {
        for (let option in params[param].options) {
          const optionData =  params[param].options[option];
          const isDefault = ('default' in optionData) ? true : false;
          const isActive = (param in formData) 
            ? formData[param].includes(option) : false;
          const price = optionData.price;
          if (isActive && !isDefault){
            productPrice += price;
          } else if (!isActive && isDefault) {
            productPrice -= price;
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
      productPrice *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = productPrice;
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
    }
  }

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
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }
  class Cart {
    constructor(elelment) {
      const thisCart = this;
      thisCart.product = [];
      thisCart.getElements(elelment);
      thisCart.initAction();
      // console.log('new Cart', thisCart);
    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {}; 
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
        select.cart.toggleTrigger
      );
    }
    initAction() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }
  }
  const app = {
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    initMenu: function () {
      const thisApp = this;
      // console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initCart: function () {
      const thisApp = this;
      const cartElement = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElement);
    },
    init: function () {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}
