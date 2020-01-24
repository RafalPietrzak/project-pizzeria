import {templates, select} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(bookingWrapper) {
    const thisBooking = this;
    thisBooking.render(bookingWrapper);
    thisBooking.initWidgets();
  }
  render(bookingWrapper) {
    const thisBooking = this;
    const generateHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingWrapper;
    thisBooking.dom.wrapper.appendChild(utils.createDOMFromHTML(generateHTML));
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount    
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount    
    ); 
  }
  initWidgets (){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;