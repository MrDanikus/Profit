import {ModalWindow} from './modal-window/index.js';
import {Carousel, Slide as CarouselSlide} from './carousel/index.js';

const show = () => {
  const mwindow = new ModalWindow();

  const c = new Carousel('start-guide', mwindow.view.body);

  const slides = [
    new CarouselSlide('start-guide'),
    new CarouselSlide('start-guide'),
    new CarouselSlide('start-guide'),
    new CarouselSlide('start-guide'),
    new CarouselSlide('start-guide'),
    new CarouselSlide('start-guide'),
    new CarouselSlide('start-guide'),
  ]

  slides.forEach((slide, index) => {
    slide.view.innerHTML = `
    <video loop autoplay muted>
      <source src="/videos/slide-${index}.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div class="slide-caption"></div>
    `;
    slide.view.querySelector('video').playbackRate = 1.5;
  });

  slides[0].view.querySelector('.slide-caption').textContent = 'Welcome to the "Profit" console UI!';
  slides[1].view.querySelector('.slide-caption').textContent = 'Use "help" command to see other commands';
  slides[2].view.querySelector('.slide-caption').innerHTML = 'Combine two or<br>more commands';
  slides[3].view.querySelector('.slide-caption').innerHTML = 'Use command arguments';
  slides[4].view.querySelector('.slide-caption').textContent = 'Only console - only hardcore!';
  slides[5].view.querySelector('.slide-caption').innerHTML = 'Use $Date, $Now and<br>$File meta sequences';
  slides[6].view.querySelector('.slide-caption').innerHTML = 'Prove that you are<br>real programmer!';


  slides.forEach(c.addSlide.bind(c));
  mwindow.open();
}

if (!localStorage.getItem('is_first_visit')) {
  show();
  localStorage.setItem('is_first_visit', true);
}
