import {templates, select, settings, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import BugReport from './BugReport.js';

class Booking {
  constructor(bookingWrapper) {
    const thisBooking = this;
    thisBooking.render(bookingWrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
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
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    ); 
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(
      select.booking.form
    );
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(
      select.booking.phone
    );
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(
      select.booking.address
    );  
  }
  initWidgets (){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper = addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
    for(let table of thisBooking.dom.tables){
      table.addEventListener('click', function(){
        let tableId = table.getAttribute(settings.booking.tableIdAttribute);
        if(!isNaN(tableId)){
          tableId = parseInt(tableId);
        }
        thisBooking.selectedTable = tableId;
        thisBooking.updateDOM();
      });
    }  
    thisBooking.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      if(typeof thisBooking.selectedTable != 'undefined'){
        thisBooking.sendOrder();
      }
    });
  }
  getData () {
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' 
                           + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' 
                         + utils.dateToStr(thisBooking.datePicker.maxDate);
    const params = {
      booking: [
        startDateParam,
        endDateParam
      ],
      eventCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam
      ],
      eventRepeat: [
        settings.db.repeatParam,
        endDateParam
      ],
    };
    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking 
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event 
                                     + '?' + params.eventCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event 
                                     + '?' + params.eventRepeat.join('&'),
    };
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ]).then(function(allResponses){
      if (
        allResponses[0].status === 404
        ||
        allResponses[1].status === 404
        ||
        allResponses[2].status === 404
      ) {
        return Promise.reject(allResponses);
      }
      const bookingResponse = allResponses[0];
      const eventsCurrentResponse = allResponses[1];
      const eventsRepeatResponse = allResponses[2];
      return Promise.all([
        bookingResponse.json(),
        eventsCurrentResponse.json(),
        eventsRepeatResponse.json()
      ]);
    }).then(function([bookings, eventsCurrent, eventsRepeat]){
      thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
    }).catch(function () {
      const wrapper = document.querySelector(select.containerOf.booking);
      new BugReport(wrapper, settings.bug.booking);
    });
  }
  parseData (bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};
    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(
          let loopDate = minDate; 
          loopDate <= maxDate; 
          loopDate = utils.addDays(loopDate, 1)
        ){
          thisBooking.makeBooked(
            utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    thisBooking.updateDOM();
  }
  updateDOM() {
    const thisBooking = this;
    
    if(
      thisBooking.date != thisBooking.datePicker.value 
      ||
      thisBooking.hour != utils.hourToNumber(thisBooking.hourPicker.value)  
    ){
      thisBooking.selectedTable = undefined;    
    }
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
  
    let allAvailable = false;
    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
        ||
        thisBooking.selectedTable == tableId
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
      
    }
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);
    if(typeof thisBooking.booked[date][startHour] == 'undefined'){
      thisBooking.booked[date][startHour] = [];
    }
    for(
      let hourBlock = startHour; 
      hourBlock  < startHour + duration;  
      hourBlock += 0.5
    ){
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];  
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  sendOrder() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    const payload = {
      date: thisBooking.date,
      hour: utils.numberToHour(thisBooking.hour),
      table: thisBooking.selectedTable,
      duration: thisBooking.hoursAmount.value, 
      ppl: thisBooking.peopleAmount.value,
      starters: [],
      // address: thisBooking.dom.address.value,
      // phone:  thisBooking.dom.phone.value,
    };
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    };
    console.log(payload);
    fetch(url, options).then(function(response){
      return response.json();
    }).then(function(parseResponse){
      console.log('parseResponse', parseResponse);
      thisBooking.getData();
    });
  }
}
export default Booking;