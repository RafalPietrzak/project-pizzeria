import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


const app = {
  initBooking: function () {
  //  const thisApp = this;
    const bookingWrapper = document.querySelector(select.containerOf.booking);
    new Booking(bookingWrapper);
  },
  initPages: function () {
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatcingHash = thisApp.pages[0].id;
    for (let page of thisApp.pages){
      if(page.id == idFromHash) {
        pageMatcingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatcingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }

  },
  activatePage: function (pageId) {
    const thisApp = this;
    /* add class "active" to matching page, remove from non-matching*/ 
    for( let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, (page.id == pageId));
    }
    for( let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        (link.getAttribute('href') == '#' + pageId)
      );
    }
  },
  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url).then(function(rawResponse){
      return rawResponse.json();
    }).then(function (parsedResponse){
      console.log('parsedResponse', parsedResponse);
      thisApp.data.products = parsedResponse;
      thisApp.initMenu();
    });
  },
  initMenu: function () {
    const thisApp = this;
    // console.log('thisApp.data:', thisApp.data);
    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id, 
        thisApp.data.products[productData]
      );
    }
  },
  initCart: function () {
    const thisApp = this;
    const cartElement = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElement);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  init: function () {
    const thisApp = this;
    thisApp.initPages();
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();

  },
};

app.init();

