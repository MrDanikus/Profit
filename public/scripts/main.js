import {ConsoleView} from './console-view/index.js';
import {commands} from './commands/index.js';

/**
 * Gets the type of browser
 *
 * @returns {string}
 */
const detectBrowser = () => { 
  if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
    return 'Opera';
  } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
    return 'Chrome';
  } else if(navigator.userAgent.indexOf("Safari") != -1) {
    return 'Safari';
  } else if(navigator.userAgent.indexOf("Firefox") != -1 ){
    return 'Firefox';
  } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
    return 'IE';
  } else {
    return 'Unknown';
  }
}

const user = JSON.parse(localStorage.getItem('user'));
const consoleView = new ConsoleView(
    document.querySelector('console-container'),
    {
        name: 'prc',
        user: user?.name ?? 'unauthorized',
        device: detectBrowser(),
        commands,
    },
);

if (user) {
    consoleView.console.state.user = user;
}
