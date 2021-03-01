(function(window) { 
  const K_COLORS = ['#EE6352', '#08B2E3', '#57A773', '#F6E27F', '#E2C391', '#1C77C3', '#801A86', '#519E8A'];
  const K_TAGS = ['spa', 'quest', 'cinema', 'theatre', 'food',
                    'restaurant', 'cafe', 'fitnes', 'gym', 'shop',
                  'computer', 'games'];
  const K_SEARCH_PHRASES = ['Buy tickets in theatre', 'Spa coupons', 'Wanna buy new macbook',
                            'Promocodes for coffee', 'Free coffee']
  
  function ready() {
    const tagCloud = new TagCloud(document.querySelector('.tag-cloud-container'), K_TAGS, K_COLORS);
    const tags = tagCloud.tags;
    const selectedTagsContainer = document.querySelector('.selected-tags');
    const inputElement = document.querySelector('#search-box');
    const placeholderTyper = new PlaceholderTyper(inputElement, K_SEARCH_PHRASES);
    placeholderTyper.start();

    inputElement.addEventListener('input', function(e) {
      if (this.value !== '') {
        document.querySelector('#search').style.display = 'block';
      } else {
        if (selectedTagsContainer.childElementCount == 0) {
          document.querySelector('#search').style.display = 'none';
        }
      }
    });

    for (const tag of tags) {
      tag.node.onclick = (e) => {
        e.preventDefault();
        if (tag.node.getAttribute('used') !== null) return;

        tag.node.setAttribute('used', '');
        document.querySelector('#search').style.display = 'block';

        const selectedTag = new RemovableTagTemplate(tag.node.getAttribute('value'));
        selectedTagsContainer.append(selectedTag.node);

        selectedTag.node.querySelector('a').onclick = (e) => {
          selectedTag.node.remove();
          tag.node.removeAttribute('used');
          if (selectedTagsContainer.childElementCount == 0) {
            if (inputElement.value === '')
            document.querySelector('#search').style.display = 'none';
          }
        }
      };
    }
  }

  document.addEventListener("DOMContentLoaded", ready);
})(this);