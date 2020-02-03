import {select, settings, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './CartProduct.js';
import BugReport from './BugReport.js';

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initAction();
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    // console.log('new Cart', thisCart);
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {}; 
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
      select.cart.productList
    );
    thisCart.renderTotalsKeys = [
      'totalNumber', 
      'totalPrice', 
      'subtotalPrice', 
      'deliveryFee'
    ];
    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(
        select.cart[key]
      );
    }
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(
      select.cart.form
    );
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(
      select.cart.phone
    );
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(
      select.cart.address
    );
  }
  initAction() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct) {
    const thisCart = this;
    const ganeratedHTML = templates.cartProduct(menuProduct);
    const generateDOM = utils.createDOMFromHTML(ganeratedHTML);
    thisCart.dom.productList.appendChild(generateDOM);
    thisCart.products.push(
      new CartProduct(menuProduct, generateDOM)
    );
    thisCart.update();
  }
  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for(let product of thisCart.products){
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    for (let key of thisCart.renderTotalsKeys){
      for (let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      address: thisCart.dom.address.value,
      phone:  thisCart.dom.phone.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice, 
      totalPrice: thisCart.totalPrice,
      products: [],
    };
    for(let product of thisCart.products) {
      payload.products.push(product.getData());
    }
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    };
    fetch(url, options).then(function(response){
      if (response.status === 404) {
        return Promise.reject(response);
      }
      return response.json();
    }).then(function(parseResponse){
      // TODO : Display order confirmation
      console.log('parseResponse', parseResponse);
    }).catch(function () {
      const wrapper = document.querySelector(select.containerOf.menu);
      new BugReport(wrapper, settings.bug.order);
    });
  }
}

export default Cart;