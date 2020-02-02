import { select, templates, classNames, settings } from '../settings.js';
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
    thisOpinions.renderOpinions();
    thisOpinions.setActive();
    setInterval(function () {
      thisOpinions.setActive();
    }, 3000);
  }
  setActive(id = undefined) {
    const thisOpinions = this;
    if (typeof id == 'undefined') {
      const active = thisOpinions.dom.opinions.shift();
      active.classList.remove(classNames.opinion.active);
      thisOpinions.dom.opinions[0].classList.add(classNames.opinion.active);
      thisOpinions.dom.opinions.push(active);
    } else {
      let i = 0;
      do {
        const active = thisOpinions.dom.opinions.shift();
        if (id == active.getAttribute('opinion')) {
          active.classList.add(classNames.opinion.active);
          thisOpinions.dom.opinions.unshift(active);
          i = thisOpinions.dom.opinions.length;
        } else {
          active.classList.remove(classNames.opinion.active);
          thisOpinions.dom.opinions.push(active);
          i++;
        }
      } while (i < thisOpinions.dom.opinions.length);
    }
  }
  renderOpinions() {
    const thisOpinions = this;
    const data = {
      opinions: thisOpinions.data,
      links: [],
    };
    for (let i = 0; i < thisOpinions.data.length; i++) {
      data.links.push(i);
    }
    const generateHTML = templates.opinions(data);
    thisOpinions.dom.opinionsWidget = utils.createDOMFromHTML(
      generateHTML
    );
    thisOpinions.dom.opinions = Array.from(
      thisOpinions.dom.opinionsWidget.querySelectorAll(
        select.opinions.opinion
      )
    );
    thisOpinions.dom.links = thisOpinions.dom.opinionsWidget.querySelector(
      select.opinions.menu
    ).children;
    for (let link of thisOpinions.dom.links) {
      link.addEventListener('click', function () {
        thisOpinions.setActive(link.getAttribute(settings.opinions.circleId));
      });
    }

    console.log(thisOpinions.dom.links);
    thisOpinions.dom.wrapper.appendChild(thisOpinions.dom.opinionsWidget);
  }
}
export default Opinions;