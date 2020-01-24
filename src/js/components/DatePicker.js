/* global flatpickr */
import {select, settings} from '../settings.js';
import {utils} from '../utils.js';
import BaseWiget from './BaseWidget.js';

class DatePicker extends BaseWiget {
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.datePicker.input
    );
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(
      thisWidget.value,
      settings.datePicker.maxDaysInFuture
    );
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,

    });

  }
}
export default DatePicker;