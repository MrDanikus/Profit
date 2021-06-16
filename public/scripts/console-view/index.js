import {Console} from '../console/index.js';

function concatUserAndDevice(user, device) {
  return `${user}@${device}`;
}

export class HTMLConsoleOutputElement extends HTMLElement {
  constructor(console, str) {
    if (!HTMLConsoleOutputElement.isInited) {
      customElements.define('console-output', HTMLConsoleOutputElement);
      HTMLConsoleOutputElement.isInited = true;
    }
    super();

    this.console = console;
    this.innerHTML = str;
  }
}

export class HTMLConsoleErrorElement extends HTMLElement {
  constructor(console, err) {
    if (!HTMLConsoleErrorElement.isInited) {
      customElements.define('console-error', HTMLConsoleErrorElement);
      HTMLConsoleErrorElement.isInited = true;
    }
    super();

    this.console = console;
    this.innerHTML = err.split('\n').join('<br>');
    this.setAttribute('data-before', this.console.name + ':');
  }
}

export class HTMLConsoleCommandElement extends HTMLElement {
  constructor(console, str) {
    if (!HTMLConsoleCommandElement.isInited) {
      customElements.define('console-command', HTMLConsoleCommandElement);
      HTMLConsoleCommandElement.isInited = true;
    }
    super();

    this.console = console;
    this.innerHTML = str;
    this.setAttribute(
      'data-before',
      concatUserAndDevice(this.console.user, this.console.device) + ':');
  }
}

export class HTMLConsoleToolbarElement extends HTMLElement {
  constructor(console) {
    if (!HTMLConsoleToolbarElement.isInited) {
      customElements.define('console-toolbar', HTMLConsoleToolbarElement);
      HTMLConsoleToolbarElement.isInited = true;
    }
    super();

    this.console = console;
    this.innerHTML = this.console.name;
  }
}

export class HTMLConsoleBodyElement extends HTMLElement {
  constructor(console) {
    if (!HTMLConsoleBodyElement.isInited) {
      customElements.define('console-body', HTMLConsoleBodyElement);
      HTMLConsoleBodyElement.isInited = true;
    }
    super();

    this.console = console;

    this.output = document.createElement('div');
    this.output.classList.add('console-output-container');

    this.inputWrapper = document.createElement('div');
    this.inputWrapper.classList.add('console-input-wrapper');
    this.inputWrapper.setAttribute(
      'data-before',
      concatUserAndDevice(this.console.user, this.console.device) + ':');

    this.input = document.createElement('input');
    this.input.classList.add('console-input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('autofocus', true);
    this.input.setAttribute('spellcheck', false);

    this.inputWrapper.append(this.input);
    this.append(this.output, this.inputWrapper);

    this.addEventListener('dblclick', () => {
      this.input.focus();
    }, false);
  }
}

export class HTMLConsoleViewElement extends HTMLElement {
  constructor(console) {
    if (!HTMLConsoleViewElement.isInited) {
      customElements.define('console-view', HTMLConsoleViewElement);
      HTMLConsoleViewElement.isInited = true;
    }
    super();

    this.console = console;

    this.toolbar = new HTMLConsoleToolbarElement(this.console);
    this.body = new HTMLConsoleBodyElement(this.console);

    this.append(this.toolbar, this.body);
  }

  scrollToEnd() {
    this.body.scrollTop = this.body.scrollHeight;
  }

  addOutput(str) {
    this.body.output.append(new HTMLConsoleOutputElement(this.console, str));
  
    this.scrollToEnd();
  }

  addCommand(str) {
    this.body.output.append(new HTMLConsoleCommandElement(this.console, str));

    this.scrollToEnd();
  }

  addError(err) {    
    this.body.output.append(new HTMLConsoleErrorElement(this.console, err));

    this.scrollToEnd();
  }
}

export class ConsoleView {
  /**
   * @typedef {object} ConsoleViewOptions
   * @property {string} name console name
   * @property {string} user user name
   * @property {stirng} device user device
   * @property {ConsoleCommand[]} commands commands to define
   */
  /**
   * 
   * @param {HTMLElement} parent parent node
   * @param {ConsoleViewOptions} options
   */
  constructor(parent, options) {
    this.console = new Console(options.name, options.user, options.device);
    this.consoleHistoryIterator = null;

    options.commands.forEach(this.console.defineCommand.bind(this.console));

    this.document = new HTMLConsoleViewElement(this.console);
    parent.append(this.document);

    this.console.on('error', this.onErrorHandler.bind(this));
    this.console.on('data', this.onDataHandler.bind(this));

    this.document.body.input.addEventListener('keydown', this.onKeyPressed.bind(this), true)
  }
  /**
   * @param {KeyboardEvent} event
   * @private
   */
  async onKeyPressed(event) {
    if (event.defaultPrevented) {
      return;
    }

    switch(event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        if (!this.consoleHistoryIterator) {
          this.consoleHistoryIterator = this.console.history.iterator();
        }
        this.document.body.input.value =
          this.consoleHistoryIterator.next() || '';
        
        event.preventDefault();
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        if (!this.consoleHistoryIterator) {
          this.consoleHistoryIterator = this.console.history.iterator();
        }
        this.document.body.input.value =
          this.consoleHistoryIterator.prev() || '';
        
        event.preventDefault();
        break;
      case "Enter":
        const inputWrapperDisplay =
          this.document.body.inputWrapper.style.display;
        this.document.body.inputWrapper.style.display = 'none';
        this.consoleHistoryIterator = null;
        const input = this.document.body.input.value;

        this.document.body.input.value = '';
        this.onInputHandler(this.console, input);

        try {
          if (input.trim() !== '') await this.console.exec(input);
        } catch (err) {}

        this.document.body.inputWrapper.style.display = inputWrapperDisplay;

        event.preventDefault();
        break;
    }
  }

  onDataHandler(_console, str) {
    this.document.addOutput(str);
    this.document.body.inputWrapper.setAttribute(
      'data-before',
      concatUserAndDevice(this.console.user, this.console.device) + ':');
  }

  onErrorHandler(_console, str) {
    this.document.addError(str);
    this.document.body.inputWrapper.setAttribute(
      'data-before',
      concatUserAndDevice(this.console.user, this.console.device) + ':');
  }

  onInputHandler(_console, str) {
    this.document.addCommand(str);
    this.document.body.inputWrapper.setAttribute(
      'data-before',
      concatUserAndDevice(this.console.user, this.console.device) + ':');
  }
}
