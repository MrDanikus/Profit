class HTMLModalBlock extends HTMLElement {
  constructor() {
    if (!HTMLModalBlock.isInited) {
      customElements.define('modal-block', HTMLModalBlock);
      HTMLModalBlock.isInited = true;
    }
    super();
  }
}

class HTMLModalWindow extends HTMLElement {
  constructor() {
    if (!HTMLModalWindow.isInited) {
      customElements.define('modal-window', HTMLModalWindow);
      HTMLModalWindow.isInited = true;
    }
    super();
    this.innerHTML = '<div class="close-wrapper"><i class="fas fa-times close"></i></div>\n<div class="body"></div>';

    this.closeButton = this.querySelector('.close');
    this.body = this.querySelector('.body');
  }
}

export class ModalWindow {
  constructor (width, height) {
    this.view_ = new HTMLModalWindow();
    this.block_ = new HTMLModalBlock();

    if (width) this.view_.style.width = width;
    if (height) this.view_.style.height = height;

    this.view_.closeButton.addEventListener('click', (e) => {
      this.delete();
    })

    document.body.append(this.block_, this.view_);
  }
  /**
   * @return {HTMLModalWindow}
   */
  get view() {
    return this.view_;
  }
  open() {
    this.view_.setAttribute('open', '');
  }
  close() {
    this.view_.removeAttribute('open');
  }
  isOpen() {
    return this.view_.hasAttribute('open');
  }
  clear() {
    this.view_.body.innerHTML = '';
  }
  delete() {
    this.view_.remove();
    this.block_.remove();
  }
}