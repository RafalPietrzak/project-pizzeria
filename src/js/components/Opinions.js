import {select, templates} from '../settings.js';
import { utils } from '../utils.js';

class Opinions {
  constructor(wrapper, url){
    const thisOpinions = this;
    thisOpinions.getDOM(wrapper);
    thisOpinions.getData(url);    
  }
  getDOM(wrapper){
    const thisOpinions = this;
    thisOpinions.dom = {};
    thisOpinions.dom.wrapper = wrapper; 
    thisOpinions.dom.menu = thisOpinions.dom.wrapper.querySelector(
      select.opinions.menu
    );
  }
  getData(url){
    const thisOpinions = this;
    thisOpinions.data = {};
    fetch(url).then(function(rawResponse){
      return rawResponse.json();
    }).then(function (parsedResponse){
      thisOpinions.data = parsedResponse;
      thisOpinions.initOpinion();
    });
  }
  initOpinion(){
    const thisOpinions = this;
    thisOpinions.renderOpinions();
  }
  renderOpinions(){
    const thisOpinions = this;
    const data = {
      opinions: {
        jeden : 1,
        dwa : 2,
        trzy : 3,
      } }
       ;
    console.log('data', data);
    const generateHTML = templates.opinions(data);
    thisOpinions.dom.opinions = utils.createDOMFromHTML(
      generateHTML
    );
    console.log('thisOpinions.dom.opinions', generateHTML);
    thisOpinions.dom.wrapper.appendChild(thisOpinions.dom.opinions);
  }
}
export default Opinions;