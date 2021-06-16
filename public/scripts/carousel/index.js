class HTMLCarouselDot extends HTMLElement {
  constructor() {
    if (!HTMLCarouselDot.isInited) {
      customElements.define('carousel-dot', HTMLCarouselDot);
      HTMLCarouselDot.isInited = true;
    }
    super();

    this.classList.add('carousel-dot');
  }

  enable() {
    this.classList.add('active');
  }

  disable() {
    this.classList.remove('active');
  }
}

class HTMLCarouselDotContainer extends HTMLElement {
  constructor() {
    if (!HTMLCarouselDotContainer.isInited) {
      customElements.define('carousel-dot-container', HTMLCarouselDotContainer);
      HTMLCarouselDotContainer.isInited = true;
    }
    super();

    /** @type {HTMLCarouselDot[]} */
    this.dots_ = [];
    this.classList.add('carousel-dot-container');
  }
  /**
   * @return {HTMLCarouselDot[]}
   */
  get dots() {
    return this.dots_;
  }

  addDot() {
    const dot = new HTMLCarouselDot();
    this.dots_.push(dot)
    this.append(dot);
  }

  removeDot() {
    this.dots_.pop().remove();
  }
}

class HTMLCarouselButton extends HTMLElement {
  constructor(...classList) {
    if (!HTMLCarouselButton.isInited) {
      customElements.define('carousel-button', HTMLCarouselButton);
      HTMLCarouselButton.isInited = true;
    }
    super();

    this.classList.add('carousel-button', ...classList);
  }
}

class HTMLCarouselSlideContainer extends HTMLElement {
  constructor() {
    if (!HTMLCarouselSlideContainer.isInited) {
      customElements.define('carousel-slide-container', HTMLCarouselSlideContainer);
      HTMLCarouselSlideContainer.isInited = true;
    }
    super();

    this.classList.add('carousel-slide-container');
  }
  /**
   * @param {HTMLCarouselSlide} slide 
   */
  addSlide(slide) {
    this.append(slide);
  }
  /**
   * @return {NodeListOf<HTMLCarouselSlide>} slides
   */
  get slides() {
    return this.querySelectorAll('carousel-slide');
  }
}

class HTMLCarouselSlide extends HTMLElement {
  constructor(...classList) {
    if (!HTMLCarouselSlide.isInited) {
      customElements.define('carousel-slide', HTMLCarouselSlide);
      HTMLCarouselSlide.isInited = true;
    }
    super();

    this.classList.add('carousel-slide', ...classList);
  }
}

class HTMLCarousel extends HTMLElement {
  constructor(name) {
    if (!HTMLCarousel.isInited) {
      customElements.define('carousel-container', HTMLCarousel);
      HTMLCarousel.isInited = true;
    }
    super();

    this.setAttribute('name', name);

    this.nextButton_ = new HTMLCarouselButton('next', 'fas', 'fa-angle-right');
    this.prevButton_ = new HTMLCarouselButton('prev', 'fas', 'fa-angle-left');
    this.slideContainer_ = new HTMLCarouselSlideContainer();
    this.dotContainer_ = new HTMLCarouselDotContainer();

    this.append(
      this.slideContainer_,
      this.prevButton_,
      this.nextButton_,
      this.dotContainer_);

    this.classList.add('carousel');
  }
  /**
   * @param {HTMLCarouselSlide} slide 
   */
  addSlide(slide) {
    this.dotContainer_.addDot();
    this.slideContainer_.addSlide(slide);
  }
  /**
   * @return {HTMLCarouselButton}
   */
  get nextButton() {
    return this.nextButton_;
  }
  /**
   * @return {HTMLCarouselButton}
   */
  get prevButton() {
    return this.prevButton_;
  }
  /**
   * @return {NodeListOf<HTMLCarouselSlide>} slides
   */
  get slides() {
    return this.slideContainer_.slides;
  }
}

export class Slide {
  constructor(...classList) {
    this.view_ = new HTMLCarouselSlide(...classList);
  }
  /**
   * @return {HTMLCarouselSlide}
   */
  get view() {
    return this.view_;
  }

  show() {
    this.view_.classList.add('shown');
  }
  hide() {
    this.view_.classList.remove('shown');
  }
  isShown() {
    return this.view_.classList.contains('shown');
  }
}

export class Carousel {
  /**
   * @param {string} name
   * @param {HTMLElement} parent 
   */
  constructor(name, parent) {
    this.view_ = new HTMLCarousel(name);

    this.view_.nextButton.addEventListener('click', () => {
      this.showNext();
    });
    this.view_.prevButton.addEventListener('click', () => {
      this.showPrev();
    });

    /** @type {Slide[]} */
    this.slides_ = [];
    this.currentSlide_ = 0;

    parent.append(this.view_);
  }
  /**
   * @param {Slide} slide 
   */
  addSlide(slide) {
    this.slides_.push(slide);
    this.view_.addSlide(slide.view);

    if (this.slides_.length === 1) {
      slide.show();
      this.currentSlide_ = 0;
      this.view_.dotContainer_.dots[0].enable();
    } else {
      slide.hide();
    }
  }
  /**
   * @return {Slide[]} slides
   */
  get slides() {
    return this.slides_;
  }
  /**
   * @return {Slide}
   */
  get current() {
    return this.slides_[Math.abs(this.currentSlide_) % this.slides_.length];
  }

  showNext() {
    this.view_.dotContainer_.dots[this.currentSlide_].disable();
    this.slides_[this.currentSlide_].hide();
    if (this.currentSlide_ === this.slides_.length - 1) {
      this.currentSlide_ = 0;
    } else {
      this.currentSlide_++;
    }
    this.view_.dotContainer_.dots[this.currentSlide_].enable();
    this.slides_[this.currentSlide_].show();
  }

  showPrev() {
    this.view_.dotContainer_.dots[this.currentSlide_].disable();
    this.slides_[this.currentSlide_].hide();
    if (this.currentSlide_ === 0) {
      this.currentSlide_ = this.slides_.length - 1;
    } else {
      this.currentSlide_--;
    }
    this.view_.dotContainer_.dots[this.currentSlide_].enable();
    this.slides_[this.currentSlide_].show();
  }
}