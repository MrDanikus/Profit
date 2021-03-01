const ready = () => {
  const items = document.querySelectorAll('.vendor-item');
  for (const item of items) {
    const vendorId = item.getAttribute('vendor-id');

    // promocode
    const promocode = item.querySelector('.promocode');
    const icon = promocode.querySelector('i');
    const code = promocode.querySelector('.code');
    icon.onclick = (e) => {
      e.preventDefault();
      code.setAttribute('opened', true);
      icon.classList = 'far fa-copy';
      code.textContent = 'asdd-ahsd-quoi';
    }

    code.onclick = (e) => {
      e.preventDefault();
      if (code.getAttribute('opened')) {
        const r = document.createRange();
        r.selectNode(code);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(r);
        document.execCommand('copy');
        promocode.querySelector('.custom-tooltip').style.display = "inline";
        setTimeout( function() {
          promocode.querySelector(".custom-tooltip").style.display = "none";
        }, 1000);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", ready);