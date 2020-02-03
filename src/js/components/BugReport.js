import { templates } from '../settings.js';
import {utils} from '../utils.js';

class BugReport {
  constructor (wrapper, bug) {
    const thisBugReport = this;
    thisBugReport.wrapper = wrapper;
    thisBugReport.bug = bug;
    const generateHTML = templates.bugReport(thisBugReport.bug);
    thisBugReport.dom = utils.createDOMFromHTML(generateHTML);
    wrapper.appendChild(thisBugReport.dom);
  }   
}
export default BugReport;
