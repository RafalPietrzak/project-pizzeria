import { templates } from '../settings.js';
import { utils } from '../utils.js';

class Gallery {
  constructor(wrapper, url) {
    const thisGallery = this;
    thisGallery.getDOM(wrapper);
    thisGallery.getData(url);
  }
  getDOM(wrapper) {
    const thisGallery = this;
    thisGallery.dom = {};
    thisGallery.dom.wrapper = wrapper;
  }
  getData(url) {
    const thisGallery = this;
    thisGallery.data = {};
    fetch(url).then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (parsedResponse) {
      thisGallery.data = parsedResponse;
      thisGallery.initGallery();
    });
  }
  initGallery() {
    const thisGallery = this;
    thisGallery.renderGallery();
  }
  renderGallery() {
    const thisGallery = this;
    const data = {
      gallery: thisGallery.data,
    };
    console.log(data);
    const generateHTML = templates.gallery(data);
    thisGallery.dom.galleryWidget = utils.createDOMFromHTML(
      generateHTML
    );
    thisGallery.dom.wrapper.appendChild(thisGallery.dom.galleryWidget);
  }
}
export default Gallery;