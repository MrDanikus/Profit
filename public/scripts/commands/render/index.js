import {ConsoleCommand} from '../../console/index.js';

import {ModalWindow} from '../../modal-window/index.js';

const monthNumberToWord = (n) => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][n];
}

const stringToHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.firstElementChild; 
}

/**
 * @typedef {object} User
 * @property {string} _id
 * @property {string} name
 */
/**
 * @typedef {object} Ad
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {string} link
 * @property {User} vendor
 * @property {string[]} tags
 * @property {number} discount
 * @property {string} promocode
 * @property {string} icon
 * @property {number} likes 
 * @property {string} expiresAt
 * @property {string} createdAt
 */
/**
 * @typedef {object} Comment
 * @property {string} _id
 * @property {string} ad
 * @property {string} content
 * @property {User} author
 * @property {string} createdAt
 */

/**
 * @todo
 * use tags and discount
 * 
 * @param {Ad} ad 
 * @return {Element} html
 */
const adCardTemplate = (ad) => {
  const expirationDate = new Date(ad.expiresAt);
  const adCard = stringToHTML(`\
<div class="ad-wrapper">
  <div class="ad card" id="${ad._id}" vendor-id="${ad.vendor._id}">
    <div class="icon" style="background: url('${ad.icon}') center/cover no-repeat;"></div>
    <div class="wrapper">
      <div class="header noselect">
        <div class="date">
          <span class="day">Until</span>
          <span class="day">${expirationDate.getDate()}</span>
          <span class="month">${monthNumberToWord(expirationDate.getMonth())}</span>
          <span class="year">${expirationDate.getFullYear()}</span>
        </div>
        <ul class="menu-content">
          <li class="likes" liked="false"><a href="#" class="far fa-heart"><span>${ad.likes}</span></a></li>
          <li class="comments"><a href="#" class="far fa-comment"></a></li>
        </ul>
      </div>
      <div class="data">
        <div class="content">
          <span class="vendor noselect">${ad.vendor.name}</span>
          <div class="tags-container">
            ${ad.tags.splice(0, 5).map(tag => `<span class="tag">${tag.replaceAll(/\s/g, '&nbsp;')}</span>`).join('\n')}
          </div>
          <h1 class="title noselect"><a href="${ad.link}" target="_blank">${ad.name}</a></h1>
          <p class="text noselect">${ad.description}</p>
          <a href="#" class="promocode button">
            <i class="far fa-eye"></i>
            <span class="code" opened=false promocode="${ad.promocode}">✱✱✱✱✱✱✱✱</span>
            <span class="custom-tooltip">copied to clipboard</sapn>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>`);

  const promocodeIcon = adCard.querySelector('.promocode i');
  const promocode = adCard.querySelector('.promocode .code');
  promocodeIcon.onclick = (e) => {
    e.preventDefault();
    promocode.setAttribute('opened', true);
    promocodeIcon.classList = 'far fa-copy';
    promocode.textContent = promocode.getAttribute('promocode');
  }
  adCard.querySelector('.promocode').onclick = (e) => {
    e.preventDefault();
    if (promocode.getAttribute('opened') === 'true') {
      const r = document.createRange();
      r.selectNode(promocode);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(r);
      document.execCommand('copy');
      adCard.querySelector('.promocode .custom-tooltip').style.display = "inline";
      setTimeout( function() {
        adCard.querySelector('.promocode .custom-tooltip').style.display = "none";
      }, 1000);
    }
  }

  return adCard;
}
/**
 * 
 * @param {Comment} comment 
 */
const commentBubbleTemplate = (comment) => {
  const createdAt = new Date(comment.createdAt);
  return stringToHTML(`\
<div class="comment noselect" id="${comment._id}">
  <p class="comment-content">${comment.content}</p>
  <span class="comment-author" id="${comment.author._id}">${comment.author.name}</span>
  <span class="comment-date">${createdAt.getDate()}\
 ${monthNumberToWord(createdAt.getMonth())}\
 ${createdAt.getFullYear()} At ${createdAt.getHours()}:${createdAt.getMinutes()}</span>
</div>`);
}

/**
 * @param {object} obj
 * @param {string} propName
 * 
 * @return {boolean}
 */
const checkProps = (obj, ...props) => {
  return typeof obj === 'object' &&
    props.reduce((acc, cur) => acc && (obj[cur] !== undefined), true);
}
/**
 * @param {object} obj 
 *
 * @return {boolean}
 */
const isUser = (obj) => {
  return checkProps(obj, '_id', 'name');
}
/**
 * @param {object} obj 
 *
 * @return {boolean}
 */
const isComment = (obj) => {
  return checkProps(obj, '_id', 'ad', 'author', 'content', 'createdAt') &&
    isUser(obj.author, '_id', 'name');
}

/**
 * @param {object} obj some obj
 * 
 * @return {boolean}
 */
const isAd = (obj) => {
  return checkProps(obj, '_id' , 'name', 'description',
      'link', 'vendor', 'tags', 'discount',
      'promocode', 'icon', 'likes', 'expiresAt') &&
    isUser(obj.vendor)
}

export class RenderCommand extends ConsoleCommand {
  /**
   * @param {string} selector
   */
  constructor(selector) {
    super('render');

    this.selector = selector;
    this.body = document.querySelector(this.selector);
    this.modalWindow = null;
  }
  tryRender(console, state, obj) {
    if (isAd(obj)) {
      const adCardWrapper = adCardTemplate(obj);
      const adCard = adCardWrapper.querySelector('.ad.card');
      
      if (state.user && state.user.likes.includes(adCard.getAttribute('id'))) {
        adCard.querySelector('.likes a').classList.value = 'fas fa-heart';
        adCard.querySelector('.likes').setAttribute('liked', 'true');
      }

      adCard.querySelector('.likes').onclick = async (e) => {
        e.preventDefault();
        if (
          adCard.querySelector('.likes').getAttribute('liked') === 'true'
        ) {
          if (!(await console.exec(`unlike ${adCard.getAttribute('id')}`))) return;
          // unlike
          adCard.querySelector('.likes a').classList.value = 'far fa-heart';
          adCard.querySelector('.likes').setAttribute('liked', 'false');

          adCard.querySelector('.likes span').innerHTML =
            +adCard.querySelector('.likes span').innerHTML - 1;
        } else {
          if (!(await console.exec(`like ${adCard.getAttribute('id')}`))) return;
          // like
          adCard.querySelector('.likes a').classList.value = 'fas fa-heart';
          adCard.querySelector('.likes').setAttribute('liked', 'true');

          adCard.querySelector('.likes span').innerHTML =
            +adCard.querySelector('.likes span').innerHTML + 1;
        }
      }

      adCard.querySelector('.comments').onclick = async (e) => {
        e.preventDefault();
        await console.exec(`find comments ${adCard.getAttribute('id')} | render --modal`);
      }

      adCard.ondblclick = (e) => {
        e.preventDefault();
        console.exec(`echo ${JSON.stringify(obj, null, ' ')} | prettify`);
      }

      this.body.append(adCardWrapper);
    } else if (isComment(obj)) {
      const commentBubble = commentBubbleTemplate(obj);

      commentBubble.ondblclick = (e) => {
        e.preventDefault();
        console.exec(`echo ${JSON.stringify(obj, null, ' ')} | prettify`);
      }

      this.body.append(commentBubble);
    } else {
      throw new Error('Unknown object type')
    }
  }
  /**
   * @return {string} command usage template
   */
  usage() {return 'render [json-data] [args?]'}
  /**
   * @return {string} command brief description
   */
  doc() {return ''}
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, args, state, console) {
    if (args.has('modal')) {
      this.modalWindow = new ModalWindow();
      this.body = this.modalWindow.view.body
    } else {
      this.body = document.querySelector(this.selector);
      this.body.innerHTML = '';
      this.body.scrollTop = 0;
      this.body.style.display = '';
    }
    
    try {
      const parsedInput = JSON.parse(input);

      if (Array.isArray(parsedInput)) {
        parsedInput.forEach(this.tryRender.bind(this, console, state));
      } else {
        this.tryRender(console, state, parsedInput);
      }
    } catch (err) {
      if (args.has('modal') && !this.body.innerHTML) {
        this.modalWindow.delete();
      }

      if (!args.has('clear'))
        throw err;
    }

    if (!args.has('modal')) {
      if (!this.body.style.display && this.body.innerHTML) {
        this.body.style.display = 'block';
      } else if (!this.body.innerHTML) {
        this.body.style.display = '';
      }
    } else {
      if (this.body.innerHTML) {
        this.modalWindow.open();
      } else {
        this.modalWindow.delete();
      }
    }

    return 'ok';
  }
}