function* getNextItem(items){
  let i = 0;
  while(true){
    if(i >= items.length)
      i = 0;
    yield items[i];
    i++;
  }
}

function* getNextSymbol(phrase){
  let i = 0;
  while(i < phrase.length){
    yield phrase[i];
    i++;
  }
}


class PlaceholderTyper {
  constructor(input, phrases) {
    this.inputElement = input;
    this.nextPhrase = getNextItem(phrases);
    this.nextSymbol = getNextSymbol(this.nextPhrase.next().value);
    this.curString = '';
  }

  start() {
    let flag = false;
    let flag2 = false;
    this.interval = setInterval(() => {
      let symbol = this.nextSymbol.next();
      if (this.curString === '' &&  symbol.done){
        flag2 = false;
        this.nextSymbol = getNextSymbol(this.nextPhrase.next().value);
      } else if (!symbol.done) {
        this.curString += symbol.value;
      } else {
        if (!flag && !flag2) {
          flag = true;
          setTimeout(function() {
            flag = false;
            flag2 = true;
          }, 1000);
        }
        if (flag2) {
          this.curString = this.curString.slice(0, -1);
        }
      }

      this.inputElement.setAttribute('placeholder', this.curString);
    }, 120);
  }
  stop() {
    clearInterval(this.interval);
    this.inputElement.removeAttribute('placeholder');
  }
}