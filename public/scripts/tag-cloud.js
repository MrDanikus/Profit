function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function bringError(val, error = 0.1) {
  return (Math.random() * 2 - 1) * val * error + val;
}

function randomRange(a, b) {
  return Math.random() * (b - a) + a;
}

class TagTemplate {
  constructor(content, color, posX = 0, posY = 0) {
    const buf = document.createElement('buffer');
    buf.innerHTML = `<div class="tag" value="${content}"><span class="tag-content">${content}</span></div>`;
    this.node = buf.firstChild;

    this.node.style.borderColor = color;
    this.node.style.top = posY + 'px';
    this.node.style.left = posX + 'px';
  }

  get width() {
    return this.node.getBoundingClientRect().width;
  }
  get height() {
    return this.node.getBoundingClientRect().height;
  }

  set x(newX) {
    this.node.style.left = newX + 'px';
  }
  set y(newY) {
    this.node.style.top = newY + 'px';
  }
  get y() {
    return parseFloat(this.node.style.top);
  }
  get x() {
    return parseFloat(this.node.style.left);
  }
}

class RemovableTagTemplate {
  constructor(content) {
    const buf = document.createElement('buffer');
    buf.innerHTML = `<div class="tag removable"><span class="tag-content">${content}</span><a type="button"><i class="far fa-times-circle"></i></a></div>`;
    this.node = buf.firstChild;
  }
}

function distBetween(tagA, tagB) {
  return [
    Math.max(tagB.x - tagA.x, 0) - tagA.width,
    Math.max(tagB.y - tagA.y, 0) - tagA.height
  ]
}

class TagCloud {
  constructor(tagContainer, K_TAGS, K_COLORS) {
    const tagContainerWidth = parseFloat(window.getComputedStyle(tagContainer, null).getPropertyValue('width'));
    const tagContainerPadding = parseFloat(window.getComputedStyle(tagContainer, null).getPropertyValue('padding'));
    const margin = 15;
    const step = 10;
  
    this.tags = [];
  
    for (const tagName of K_TAGS) {
      const tag = new TagTemplate(tagName, randomFrom(K_COLORS));
      tagContainer.appendChild(tag.node);
    
      const hStart = Math.max(this.tags.length > 0 ? this.tags[this.tags.length - 1].y + randomRange(-step, step) : tagContainerPadding, tagContainerPadding);
      let wStart = this.tags.length > 0 ? this.tags[this.tags.length - 1].x + this.tags[this.tags.length - 1].width + margin : (tagContainerPadding + randomRange(0, margin));
  
      let flag = false;
      for (let j = hStart; ; j += bringError(step)) {
        for (let i = wStart; i < tagContainerWidth - tagContainerPadding - tag.width; i += bringError(step)) {
          tag.x = i;
          tag.y = j;
          flag = true;
          for (const t of this.tags) {
            const d = distBetween(t, tag);
            if (d[0] < margin && d[1] < margin) {
              flag = false;
              break;
            }
          }
          if (flag) break;
        }
        wStart = tagContainerPadding + randomRange(0, margin);
        if (flag) break;
      }
      this.tags.push(tag);
    }
  
    // set parent block height
    const lowestTagHeight = this.tags.reduce((prev, cur) => Math.max(prev, cur.y + cur.height), Number.MIN_VALUE);
    tagContainer.style.height = lowestTagHeight + tagContainerPadding + 'px';
  }
}
