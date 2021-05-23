import {ConsoleInput} from './input/index.js';

class NotImplemented extends Error {
  constructor(method) {
    super(`${method} method must be implemented`);
  }
}

class ConsoleHistoryIterator {
  /**
   * @param {string[]} data
   * @param {number} index 
   */
  constructor(data, index) {
    this.index = index;
    this.data = data;
  }
  /**
   * @return {stirng}
   */
  next() {
    if (this.index >= this.data.length - 1) {
      this.index = this.data.length;
      return null;
    }
    return this.data[++this.index];
  }
  /**
   * @return {stirng | null}
   */
  prev() {
    if (this.index <= 0) {
      this.index = 0;
      return this.data[this.index];
    }
    return this.data[--this.index];
  }
} 

class ConsoleHistory {
  constructor() {
    /** @type {string[]} */
    this.data = [];
  }
  /**
   * @return {string[]}
   */
  list() {
    return [...this.data];
  }
  /**
   * @param {string} str
   */
  push(str) {
    this.data.push(str);
  }
  /**
   * @return {ConsoleHistoryIterator}
   */
  iterator() {
    return new ConsoleHistoryIterator(this.data, this.data.length);
  }
}

export class Console {
  /**
   * Creates console instance with provided
   * name and user name
   * @param {string} name 
   * @param {string} user 
   * @param {string} device
   */
  constructor(name, user, device) {
    this.name = name;
    this.user = user;
    this.device = device
    /* console output line by line */
    this.stdout = [];
    this.stderr = [];

    this.state = {};
    /**
     * @type {Map<string, (console: Console, ...args: any[]) => any>}
     * @public
     */
    this.listeners = new Map();
    /**
     * @type {Map<string, ConsoleCommand>}
     * @public
     */
    this.commands = new Map();

    this.history = new ConsoleHistory();
  }
  /**
   * Calls all listeners on provided event
   *
   * @param {string} event event name
   * @param {any[]} args
   */
  dispatchEvent(event, ...args) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        callback(this, ...args);
      }
    }
  }
  /**
   * Pushes string to stdout of console
   * and dispatches `data` event
   *
   * @param {string} str some string
   */
  cout(str) {
    this.stdout.push(str);
    this.dispatchEvent('data', str);
  }
  /**
   * Pushes string to stderr of console
   * and dispatches `error` event
   *
   * @param {string} str some string
   */
  cerr(str) {
    this.stderr.push(str);
    this.dispatchEvent('error', str);
  }
  /**
   * Defines new console command
   *
   * @param {ConsoleCommand} command 
   */
  defineCommand(command) {
    this.commands.set(command.name, command);
  }
  /**
   * 
   * @param {string} event event name
   * @param {(console: Console, ...args: any[]) => any} callback
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);
  }
  /**
   * Parses and processes console input
   * by executing appropriate command
   *
   * @param {string} input console input
   *
   * @return {Proise<boolean>} command execution result
   */
  async exec(input) {
    this.history.push(input);

    const chainInputs = input.split('|');
    let lastOutput = '';
    for (const input of chainInputs) {
      const consoleInput = await ConsoleInput.build(input);

      if (lastOutput) {
        consoleInput.input = [consoleInput.input].concat(lastOutput).filter(Boolean).join(' ');
      }
      
      if (!this.commands.has(consoleInput.base)) {
        this.cerr(`command not found: ${consoleInput.base}`);
        this.cerr(`try to use 'help' command`);
        return false;
      }
  
      const command = this.commands.get(consoleInput.base);

      try {
        const result = await command.exec(consoleInput.input, consoleInput.args, this.state, this);
        lastOutput = result;
      } catch (err) {
        this.cerr(err.toString());
        this.cerr(command.usage());
        return false;
      }
    }

    this.cout(lastOutput);
    return true;
  }
}

export class ConsoleCommand {
  /**
   * @param {string} name command base name
   */
  constructor(name) {
    this.name = name;
  }
  /**
   * @return {string} command usage template
   */
  usage() {throw new NotImplemented('usage');}
  /**
   * @return {string} command brief description
   */
  doc() {throw new NotImplemented('doc');}
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, args, state, console) {throw new NotImplemented('exec');}
}
