import {ConsoleCommand} from '../console/index.js';

import {RenderCommand} from './render/index.js';

const BASE_API_URL = 'http://localhost:3001';

export class HelpCommand extends ConsoleCommand {
  constructor() {
    super('help');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'help [command]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'List available commands or doc and usage of specified command';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, _state, _console) {
    if (input) {
      const command = commands.find(command => command.name === input);
      if (!command) {
        throw new Error(`No such command: ${input}`);
      }

      return `${command.usage()}\n${command.doc()}`;
    } else {
      let res = [];
      for (const command of commands.values()) {
        res.push(`${command.usage()}\n${command.doc()}\n`);
      }
      return res.join('\n');
    }
  }
}

export class EchoCommand extends ConsoleCommand {
  constructor() {
    super('echo');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'echo [string]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Echoes string to console';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, _state, _console) {
    return input;
  }
}

export class ClearCommand extends ConsoleCommand {
  constructor() {
    super('clear');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'clear'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Clears console window';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(_input, _args, _state, _console) {
    return '\n'.repeat(50);
  }
}

export class ListCommand extends ConsoleCommand {
  constructor() {
    super('list');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'list [comma-separated values?] [json array?]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Lists provided values';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, _state, _console) {
    if (!input) {
      throw new SyntaxError('No input was provided');
    }

    let items;
    try {
      items = JSON.parse(input);
    } catch (err) {
      items = input.split(',');
    }

    if (!Array.isArray(items)) items = [items];

    items = items.filter(Boolean);

    return `<ul>${
      items.map(el =>
        `<li>${typeof el === 'string' ? el.trim() : JSON.stringify(el, null, 2)}</li>`
        ).join('')
      }</ul>`;
  }
}

export class PrettifyCommand extends ConsoleCommand {
  constructor() {
    super('prettify');
  }
  /**
   * @param {object} obj
   */
  objectToHTMLList(obj) {
    const replacer = (_match, pIndent, pKey, pVal, pEnd) => {
      const key = '<span class=json-key>';
      const val = '<span class=json-value>';
      const str = '<span class=json-string>';
      let r = pIndent || '';
      if (pKey)
         r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
         r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
    };
    const jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*|\[\]|\{\})?([,[{])?$/mg;
    return JSON.stringify(obj, null, 3)
       .replace(/&/g, '&amp;')
       .replace(/\\"/g, '&quot;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(jsonLine, replacer);
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'prettify [json]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Prettify json data.';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, _state, _console) {
    if (!input) {
      throw new SyntaxError('No input was provided');
    }

    let data;

    try {
      data = JSON.parse(input);
    } catch (err) {
      throw new SyntaxError('Valid JSON data was expected');
    }

    return this.objectToHTMLList(data);
  }
}

export class AuthCommand extends ConsoleCommand {
  constructor() {
    super('auth');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'auth [login] [password]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Trying to authorize user';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, state, console) {
    const [login, password] = input.split(' ');

    if (!login || !password) {
      throw new SyntaxError('The string did not match the expected pattern.');
    }

    const response = await fetch(`${BASE_API_URL}/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        password
      }),
    });

    const jsonData = await response.json();

    if (response.status >= 400) {
      throw jsonData.errors[0].message;
    }

    console.user = jsonData.data.name;
    state.user = jsonData.data;

    localStorage.setItem('user', JSON.stringify(jsonData.data));

    return 'successfully authorized';
  }
}

export class LikeCommand extends ConsoleCommand {
  constructor() {
    super('like');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'like [id]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Likes the ad with specified id. Requires authentication.';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, state, _console) {
    if (!state.user) {
      throw new Error('This command requires authentication');
    }

    const [adId] = input.split(' ');
    if (!adId) {
      throw new SyntaxError('The input did not match the expected pattern.');
    }

    const response = await fetch(`${BASE_API_URL}/v1/ads/${adId}/like`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${state.user.token}`,
      }
    });

    if (response.status >= 400) {
      throw (await response.json()).errors[0].message;
    }

    if (!state.user.likes.includes(adId)) {
      state.user.likes.push(adId);
      localStorage.setItem('user', JSON.stringify(state.user));
    }

    return 'ok';
  }
}

export class UnlikeCommand extends ConsoleCommand {
  constructor() {
    super('unlike');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'unlike [id]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Removes like from the ad with specified id. Requires authentication.';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, state, _console) {
    if (!state.user) {
      throw new Error('This command requires authentication');
    }

    const [adId] = input.split(' ');
    if (!adId) {
      throw new SyntaxError('The input did not match the expected pattern.');
    }

    const response = await fetch(`${BASE_API_URL}/v1/ads/${adId}/like`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.user.token}`,
      }
    });

    if (response.status >= 400) {
      throw (await response.json()).errors[0].message;
    }

    if (state.user.likes.includes(adId)) {
      state.user.likes.splice(state.user.likes.indexOf(adId), 1);
      localStorage.setItem('user', JSON.stringify(state.user));
    }

    return 'ok';
  }
}

export class LogoutCommand extends ConsoleCommand {
  constructor() {
    super('logout');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'logout'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Logs out from account';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(_input, _args, state, console) {
    console.user = 'unauthorized';
    state.user = null;
    localStorage.removeItem('user');

    return 'ok';
  }
}

export class WhoAmICommand extends ConsoleCommand {
  constructor() {
    super('whoami');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'whoami'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Prints information about currently logged in user';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(_input, _args, state, _console) {
    if (!state.user) {
      return 'not authorized';
    }
    return JSON.stringify({
      ...state.user,
      token: undefined,
      password: undefined
    }, null , ' ');
  }
}

export class FindCommand extends ConsoleCommand {
  constructor() {
    super('find');

    this.allowedResourceTypes = ['ads', 'vendors', 'comments'];
  }
  /**
   * @param {string?} id ad id
   * @param {Map<string, string|boolean|number|Array>} args
   */
  getAdSearchURL(id, args) {
    const allowedOptions = ['q', 'tags', 'vendorId', 'from', 'to',
      'sort', 'sortOrder', 'page', 'limit', 'fields'];

    for (const key of args.keys()) {
      if (!allowedOptions.includes(key)) {
        throw new SyntaxError(`Option '${key}' is not allowed`);
      }
    }

    const urlParams = [...args.entries()]
      .map(entry => entry
        .join('=')
        .replaceAll(/\s/g, '+'))
      .join('&');

    return `${BASE_API_URL}/v1/ads${id ? '/' + id : ''}?${urlParams}`;
  }
  /**
   * @param {string?} id ad id
   * @param {Map<string, string|boolean|number|Array>} args
   */
  getVendorSearchURL(args) {
    const allowedOptions = ['page', 'limit', 'fields'];

    for (const key of args.keys()) {
      if (!allowedOptions.includes(key)) {
        throw new SyntaxError(`Option '${key}' is not allowed`);
      }
    }

    const urlParams = [...args.entries()]
      .map(entry => entry
        .join('=')
        .replaceAll(/\s/g, '+'))
      .join('&');

    return `${BASE_API_URL}/v1/vendors?${urlParams}`;
  }
  /**
   * @param {string} adId ad id
   * @param {Map<string, string|boolean|number|Array>} args
   */
  getCommentSearchURL(adId, args) {
    const allowedOptions = ['page', 'limit', 'fields'];

    for (const key of args.keys()) {
      if (!allowedOptions.includes(key)) {
        throw new SyntaxError(`Option '${key}' is not allowed`);
      }
    }

    const urlParams = [...args.entries()]
      .map(entry => entry
        .join('=')
        .replaceAll(/\s/g, '+'))
      .join('&');

    return `${BASE_API_URL}/v1/ads/${adId}/comments?${urlParams}`;
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'find [resource=ads|vendors|comments] [id?] [options?]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return `find comments [adId] [options?]
Finds comments of the ad according to provided options
    adId: 24 length hex value, id of the ad
    --page: positive number
    --limit: positive number
    --fields: comma-separated fields to project

find vendors [id?] [options?]
Finds vendors according to provided options
    id: 24 length hex value
    --page: positive number
    --limit: positive number
    --fields: comma-separated fields to project

find ads [id?] [options?]
Finds ads according to provided options
    id: 24 length hex value
    -q: search q (enclosed in "")
    --tags: comma-separated strings
    --vendorId: 24 length hex value
    --from: date in ISO format
    --to: date in ISO format
    --sort: date|rate
    --sortOrder: 1 for ascending and -1 for descending
    --page: positive number
    --limit: positive number
    --fields: comma-separated fields to project`;
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, args, _state, _console) {
    input = input.split(' ');

    if (input.length > 2 || input.length == 0) {
      throw new SyntaxError('Invalid input');
    }

    const resource = input[0];
    const id = input[1];

    if (!this.allowedResourceTypes.includes(resource)) {
      throw new SyntaxError(`Resource type "${resource}" is not allowed`);
    }

    let requestUrl;

    switch (resource) {
      case 'ads':
        requestUrl = this.getAdSearchURL(id, args);
      break;
      case 'vendors':
        if (id) {
          throw new Error(
            '"id" is not supported for "vendors" resource type'
          );
        }
        requestUrl = this.getVendorSearchURL(args);
      break;
      case 'comments':
        if (!id) {
          throw new Error(
            '"id" as ad\'s id is required for "comments" resource type'
          );
        }
        requestUrl = this.getCommentSearchURL(id, args);
      break;
    }
    
    const response = await fetch(requestUrl, {
      method: 'GET',
    });

    const jsonData = await response.json();

    if (response.status >= 400) {
      throw `${jsonData.errors[0].message}: ${jsonData.errors[0].detail}`;
    }

    return JSON.stringify(jsonData.data, null, ' ');
  }
}

export class CommentCommand extends ConsoleCommand {
  constructor() {
    super('comment');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'comment [id] [text]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Adds new comment to the ad with specified id. Requires authentication.';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, state, _console) {
    if (!state.user) {
      throw new Error('This command requires authentication');
    }
    const [adId, ...content] = input.split(' ');

    if (!adId || !content.length) {
      throw new SyntaxError('The input did not match the expected pattern.');
    }

    const response = await fetch(`${BASE_API_URL}/v1/ads/${adId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: content.join(' '),
      }),
    });

    const jsonResponse = await response.json();
    if (response.status >= 400) {
      throw jsonResponse.errors[0].message;
    }

    return JSON.stringify(jsonResponse.data, null, ' ');
  }
}

export class DeleteAdCommand extends ConsoleCommand {
  constructor() {
    super('delete-ad');
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'delete-ad [id]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return 'Deletes ad with specified id. Requires authentication. You must be the owner of the ad or admin.';
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, _args, state, _console) {
    if (
      !state.user ||
      (state.user.role !== 'admin' && state.user.role !== 'vendor')
    ) {
      throw new Error('This command requires authentication');
    }

    const [adId] = input.split(' ');
    if (!adId) {
      throw new SyntaxError('The input did not match the expected pattern.');
    }

    const response = await fetch(`${BASE_API_URL}/v1/ads/${adId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.user.token}`,
      }
    });

    if (response.status >= 400) {
      throw (await response.json()).errors[0].message;
    }

    return 'ok';
  }
}

export class CreateAdCommand extends ConsoleCommand {
  constructor() {
    super('create-ad');

    this.allowedOptions = ['description', 'link', 'tags',
      'discount', 'promocode', 'icon', 'expiresAt'];
    this.requiredOptions = ['description', 'promocode', 'icon', 'expiresAt'];
  }
  /**
   * @param {string} url url of the image to upload
   * @param {token} userToken user bearer token
   * @return {Promise<string>} image link
   */
  async uploadImage(url, userToken) {
    const response = await fetch(url);
    if (response.status >= 400) {
      throw new Error('Wrong url format');
    }
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob);

    const iconPostResponse = await fetch(`${BASE_API_URL}/v1/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
      body: formData,
    });
    const result = await iconPostResponse.json();

    if (iconPostResponse.status >= 400) {
      throw result.errors[0].message;
    }

    return BASE_API_URL + result.link;
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'create-ad [name] [args]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return `Creates ad. Requires authentication. You must be the vendor.
  name: name of the promo
  --description: description of the promo
  --promocode: secret code that customer should present
  --icon: url of the promo's icon (use "$File" to load local file)
  --expiresAt: ISO date of promo expiration (use "$Date(...)")
  [--link]: url of additional external resourse
  [--tags]: comma-separated list of promo tags
  [--discount]: discount amount`;
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, args, state, _console) {
    if (!state.user || state.user.role !== 'vendor') {
      throw new Error('This command requires authentication');
    }

    for (const key of args.keys()) {
      if (!this.allowedOptions.includes(key)) {
        throw new SyntaxError(`Option '${key}' is not allowed`);
      }
    }
    for (const option of this.requiredOptions) {
      if (!args.has(option)) {
        throw new SyntaxError(`Option '${option}' is required`);
      }
    }
    const [name] = input.split(' ');
    if (!name) {
      throw new Error('Name is required');
    }

    const body = {
      name,
      description: args.get('description'),
      link: args.get('link'),
      tags: args.get('tags')?.filter(Boolean),
      discount: args.get('discount'),
      promocode: args.get('promocode'),
      icon: await this.uploadImage(args.get('icon'), state.user.token),
      expiresAt: args.get('expiresAt'),
    }

    const response = await fetch(`${BASE_API_URL}/v1/ads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const jsonResponse = await response.json();
    if (response.status >= 400) {
      throw jsonResponse.errors[0].message;
    }

    return JSON.stringify(jsonResponse.data, null, ' ');
  }
}

export class UpdateAdCommand extends ConsoleCommand {
  constructor() {
    super('update-ad');

    this.allowedOptions = ['name', 'description', 'link', 'tags',
      'discount', 'promocode', 'icon', 'expiresAt'];
  }
  /**
   * @param {string} url url of the image to upload
   * @param {token} userToken user bearer token
   * @return {Promise<string>} image link
   */
  async uploadImage(url, userToken) {
    const response = await fetch(url);

    if (response.status >= 400) {
      throw new Error('Wrong url format');
    }
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob);

    const iconPostResponse = await fetch(`${BASE_API_URL}/v1/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
      body: formData,
    });
    const result = await iconPostResponse.json();

    if (iconPostResponse.status >= 400) {
      throw result.errors[0].message;
    }

    return BASE_API_URL + result.link;
  }
  /**
   * @return {string} command usage template
   */
  usage() {
    return 'update-ad [id] [args]'
  }
  /**
   * @return {string} command brief description
   */
  doc() {
    return `Updates ad. All options are optional. \
Requires authentication. You must be the owner of the ad or admin.
  --name: name of the promo
  --description: description of the promo
  --promocode: secret code that customer should present
  --icon: url of the promo's icon (use "$File" to load local file)
  --expiresAt: ISO date of promo expiration (use "$Date(...)")
  --link: url of additional external resourse
  --tags: comma-separated list of promo tags
  --discount: discount amount`;
  }
  /**
   * @param {string} input command input
   * @param {Map<string, string|boolean|number|Array>} args
   * @param {Record<string, any>} state shared state of console object
   * @param {Console} console
   * 
   * @return {Promise<string?>} result of command execution
   */
  async exec(input, args, state, _console) {
    if (!state.user || state.user.role !== 'vendor') {
      throw new Error('This command requires authentication');
    }

    if (args.size === 0) {
      throw new Error('Args must be not empty');
    }

    for (const key of args.keys()) {
      if (!this.allowedOptions.includes(key)) {
        throw new SyntaxError(`Option '${key}' is not allowed`);
      }
    }

    const [adId] = input.split(' ');
    if (!adId) {
      throw new Error('Id is required');
    }

    const icon = args.has('icon') ?
      await this.uploadImage(args.get('icon'), state.user.token) :
      undefined;

    const body = {
      name: args.get('name'),
      description: args.get('description'),
      link: args.get('link'),
      tags: args.get('tags')?.filter(Boolean),
      discount: args.get('discount'),
      promocode: args.get('promocode'),
      icon,
      expiresAt: args.get('expiresAt'),
    }

    const response = await fetch(`${BASE_API_URL}/v1/ads/${adId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${state.user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const jsonResponse = await response.json();
    if (response.status >= 400) {
      throw jsonResponse.errors[0].message;
    }

    return JSON.stringify(jsonResponse.data, null, ' ');
  }
}

export const commands = [
  new HelpCommand(),
  new EchoCommand(),
  new ClearCommand(),
  new ListCommand(),
  new AuthCommand(),
  new LogoutCommand(),
  new WhoAmICommand(),
  new FindCommand(),
  new PrettifyCommand(),
  new LikeCommand(),
  new UnlikeCommand(),
  new CommentCommand(),
  new DeleteAdCommand(),
  new CreateAdCommand(),
  new UpdateAdCommand(),
  new RenderCommand('render-container'),
];
