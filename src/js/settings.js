/* global Handlebars */

export const select = {
  header: {
    wrapper: '.header__wrapper',
    mainNav: '.main-nav',
    cart: '.cart'
  },
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget',
    opinions: '#template-opinion-widget',
    gallery: '#template-gallery-widget',
    bugReport: '#template-bug-hover',
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',
    booking: '.booking-wrapper',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
    datePicker: {
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    },
  },
  opinions: {
    wrapper: '.opinion-wrapper',
    opinion: '.opinion__box',
    menu: '.opinion__menu'
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
  booking: {
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
    form: '.booking-form',
    formSubmit: '.btn-secondary [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  nav: {
    links: '.main-nav a',
  },
  gallery: {
    wrapper: '.gallery-wrapper',
  },
  homeMenu: {
    booking: '#home-menu-booking',
    order: '#home-menu-order',
  }
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  cart: {
    wrapperActive: 'active',
  },
  booking: {
    loading: 'loading',
    tableBooked: 'booked',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  },
  header: {
    hidden: 'hidden',
  },
  opinion: {
    active: 'opinion__box--visible',
  }
};

export const settings = {
  hours: {
    open: 12,
    close: 24,
  },
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  },
  datePicker: {
    maxDaysInFuture: 14,
  },
  cart: {
    defaultDeliveryFee: 20,
  },
  booking: {
    tableIdAttribute: 'data-table',
  },
  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    product: 'product',
    order: 'order',
    booking: 'booking',
    event: 'event',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
    opinions: 'opinions',
    gallery: 'gallery',
  },
  opinions: {
    circleId: 'circle-id',
  },
  bug: {
    booking: {
      title: 'Server unavailable',
      text: 'Please try later or booking by phone 555 555 555',
    },
    opinions: {
      title: 'DELICIOUS FOOD!',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam egestas viverra tortor, eu ullamcorper dui imperdiet nec. Nunc sed dolor at elit lobortis sodales.',
    },
    gallery: {
      title: 'Lovely place',
      text: 'See our photos on instagram',
    },
    order: {
      title: 'Order error',
      text: 'Please try later or place your order by phone 555 555 555',
    }
  }
};

export const templates = {
  menuProduct: Handlebars.compile(
    document.querySelector(select.templateOf.menuProduct).innerHTML
  ),
  cartProduct: Handlebars.compile(
    document.querySelector(select.templateOf.cartProduct).innerHTML
  ),
  bookingWidget: Handlebars.compile(
    document.querySelector(select.templateOf.bookingWidget).innerHTML
  ),
  opinions: Handlebars.compile(
    document.querySelector(select.templateOf.opinions).innerHTML
  ),
  gallery: Handlebars.compile(
    document.querySelector(select.templateOf.gallery).innerHTML
  ),
  bugReport: Handlebars.compile(
    document.querySelector(select.templateOf.bugReport).innerHTML
  ), 
};