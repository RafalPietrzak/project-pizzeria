import { select, templates, classNames } from '../settings.js';
import { utils } from '../utils.js';

class Opinions {
  constructor(wrapper, url) {
    const thisOpinions = this;
    thisOpinions.getDOM(wrapper);
    thisOpinions.getData(url);
  }
  getDOM(wrapper) {
    const thisOpinions = this;
    thisOpinions.dom = {};
    thisOpinions.dom.wrapper = wrapper;
    thisOpinions.dom.menu = thisOpinions.dom.wrapper.querySelector(
      select.opinions.menu
    );
  }
  getData(url) {
    const thisOpinions = this;
    thisOpinions.data = {};
    fetch(url).then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (parsedResponse) {
      thisOpinions.data = parsedResponse;
      thisOpinions.initOpinion();
    });
  }
  initOpinion() {
    const thisOpinions = this;
    thisOpinions.activeOpinionIndex = undefined;
    thisOpinions.renderOpinions();
    thisOpinions.setActive();
    setInterval(function () {
      thisOpinions.setActive();
    }, 3000);
  }
  setActive() {
    const thisOpinions = this;
    if (
      typeof thisOpinions.activeOpinionIndex == 'undefined'
      ||
      typeof thisOpinions.dom.opinions[thisOpinions.activeOpinionIndex + 1] == 'undefined'
    ) {
      thisOpinions.activeOpinionIndex = 0;
      thisOpinions.dom.opinions[thisOpinions.activeOpinionIndex].classList.add(
        classNames.opinion.active
      );
      thisOpinions.dom.opinions[
        thisOpinions.dom.opinions.length - 1
      ].classList.remove(
        classNames.opinion.active
      );
    } else {
      thisOpinions.dom.opinions[thisOpinions.activeOpinionIndex].classList.remove(
        classNames.opinion.active
      );
      thisOpinions.activeOpinionIndex++;
      thisOpinions.dom.opinions[thisOpinions.activeOpinionIndex].classList.add(
        classNames.opinion.active
      );
    }
  }
  renderOpinions() {
    const thisOpinions = this;
    const data = {
      opinions: thisOpinions.data,
      links: []
    };
    const generateHTML = templates.opinions(data);
    thisOpinions.dom.opinionsWidget = utils.createDOMFromHTML(
      generateHTML
    );
    thisOpinions.dom.opinions = thisOpinions.dom.opinionsWidget.querySelectorAll(
      select.opinions.opinion
    );
    thisOpinions.dom.wrapper.appendChild(thisOpinions.dom.opinionsWidget);
  }
}
export default Opinions;