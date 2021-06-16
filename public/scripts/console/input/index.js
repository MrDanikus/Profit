class ConsoleInputError extends Error {
  constructor(message) {
    super(message);
  }
}

const metaSequence = [
  {
    regexp: /\$Date\((\S*)\)/,
    /**
     * @param {string} token
     */
    async parse(token) {
      const args = this.regexp.exec(token)[1];
      return token.replace(
        this.regexp,
        args ?
          new Date(args.replace(/['"]+/g, '')).toISOString() :
          new Date().toISOString(),
      );
    }
  },
  {
    regexp: /\$Now/,
    /**
     * @param {string} token
     */
    async parse(token) {
      return token.replace(this.regexp, new Date().toISOString());
    }
  },
  {
    regexp: /\$File/,
    /**
     * @param {string} token
     */
    async parse(token) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.click();

      return new Promise((resolve, reject) => {
        input.onchange = (e) => {
          resolve(token.replace(this.regexp, URL.createObjectURL(e.target.files[0])));
        };

        document.body.onfocus = (e) => {
          setTimeout(() => {
            if (input.files.length === 0) {
              resolve(token);
            }
            document.body.onfocus = null;
          }, 1000);
        }
      });
    }
  }
];

/**
 * @param {string} arg argument
 */
function parseArgument(arg) {
  if (typeof arg !== 'string') return arg;

  arg = arg.trim();
  // check number
  if (!Number.isNaN(+arg)) return new Number(arg);
  // check boolean
  if (arg === 'true' || arg === 'false') return new Boolean(arg);
  // check array
  if (arg.split(',').length > 1) return arg.split(',').map(parseArgument);

  // string
  if (arg[0] === '"' && arg[arg.length - 1] === '"') return arg.slice(1, -1);
  if (arg[0] === '\'' && arg[arg.length - 1] === '\'') return arg.slice(1, -1);

  return arg;
}
/**
 * @param {string} command
 */
function tokenizeCommand(command) {
  const tokens = [];

  let cur = '';
  let curQuoteCount = 0;

  for (let i = 0; i < command.length; i++) {
    if (command[i] === '"') {
      ++curQuoteCount;
    }
    if (command[i] === ' ') {
      if (curQuoteCount % 2 === 1) cur += command[i];
      else if (cur) {
        tokens.push(cur);
        cur = '';
      }
    } else {
      cur += command[i];
    }
  }
  if (cur) tokens.push(cur);

  return tokens;
}

/**
 * @param {string[]} tokens
 */
async function parseMetaSequence(tokens) {
  return Promise.all(tokens.map(async token => {
    const sequence = metaSequence.find(c => c.regexp.test(token));

    if (sequence) {
      return await sequence.parse(token);
    }
    return token;
  }));
}

export class ConsoleInput {
  /**
   * @param {string[]} tokens tokens from parsed command
   * @param {any} options
   */
  constructor(tokens, options) {
    // base command must be the first token
    this.base = tokens[0];

    if (!this.base || this.base[0] === '-') {
      throw new ConsoleInputError('no base command was provided')
    }

    // all tokens without prefix '-' except first one
    this.input = tokens.slice(1).filter(token => token[0] !== '-').join(' ');
    // build map with command options
    this.args = new Map(tokens.filter(token => token[0] === '-').map(token => {
      const parts = token.split('=');
      while(parts[0][0] === '-') {
        parts[0] = parts[0].slice(1);
      }

      return [parts[0], parseArgument(parts.slice(1).join('='))];
    }));
  }
  /**
   * Command must be in format:
   * `<command> <input> <flags?>`
   * @example
   * "find ad -q=test -fields=_id,tags"
   *
   * @param {string} command command to execute
   * @param {any} options
   *
   * @return {Promise<ConsoleInput>}
   */
  static async build(command, options) {
    const tokens = await parseMetaSequence(tokenizeCommand(command));
    return new ConsoleInput(tokens, options);
  }
}
