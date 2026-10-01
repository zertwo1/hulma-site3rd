// Hulma — shared behavior for every page

document.addEventListener('DOMContentLoaded', function () {

  // Homepage search. Update this list when menu items or workshops change.
  var searchForm = document.getElementById('homeSearchForm');
  if (searchForm) {
    var searchArea = document.getElementById('homeSearchArea');
    var searchInput = document.getElementById('homeSearchInput');
    var searchPanel = document.getElementById('homeSearchPanel');
    var searchResults = document.getElementById('homeSearchResults');
    var searchStatus = document.getElementById('homeSearchStatus');
    var searchItems = [
      { name: 'Drip Coffee', category: 'Coffee', keywords: 'menu house blend brewed', url: 'coffee.html', suggested: true },
      { name: 'Espresso', category: 'Coffee', keywords: 'menu single double shot', url: 'coffee.html' },
      { name: 'Americano', category: 'Coffee', keywords: 'menu espresso hot water', url: 'coffee.html' },
      { name: 'Cappuccino / Latte', category: 'Coffee', keywords: 'menu steamed milk flavor', url: 'coffee.html' },
      { name: 'Cold Brew', category: 'Coffee', keywords: 'menu ice iced steeped', url: 'coffee.html' },
      { name: 'Seasonal Specialty', category: 'Coffee', keywords: 'menu roast monthly', url: 'coffee.html' },
      { name: 'Rice Bowl', category: 'Meals', keywords: 'menu grilled protein garlic rice egg', url: 'meals.html', suggested: true },
      { name: 'Sandwich', category: 'Meals', keywords: 'menu toasted fillings side salad', url: 'meals.html' },
      { name: 'Soup of the Day', category: 'Meals', keywords: 'menu daily soup', url: 'meals.html' },
      { name: "Today's Special", category: 'Meals', keywords: 'menu chef pick limited', url: 'meals.html' },
      { name: 'Basque Burnt Cheesecake', category: 'Cakes & Pastries', keywords: 'menu cake slice', url: 'cakes-pastries.html', suggested: true },
      { name: 'Banana Bread', category: 'Cakes & Pastries', keywords: 'menu slice toasted', url: 'cakes-pastries.html' },
      { name: 'Croissant', category: 'Cakes & Pastries', keywords: 'menu plain filled pastry', url: 'cakes-pastries.html' },
      { name: 'Seasonal Cake', category: 'Cakes & Pastries', keywords: 'menu whole cake pre-order preorder', url: 'cakes-pastries.html' },
      { name: 'Pottery Class', category: 'Workshops', keywords: 'classes craft clay wheel cup bowl glaze beginner', url: 'pottery-class.html', suggested: true },
      { name: 'Art Class', category: 'Workshops', keywords: 'classes craft painting canvas paints all levels', url: 'art-class.html', suggested: true },
      { name: 'Sewing Class', category: 'Workshops', keywords: 'classes craft machine fabric thread pouch tote beginner', url: 'sewing-class.html', suggested: true }
    ];

    function showSearchResults() {
      var query = searchInput.value.trim();
      var matches;
      searchResults.textContent = '';
      searchResults.hidden = true;
      searchPanel.hidden = false;
      searchPanel.scrollTop = 0;

      if (!query) {
        // Show a mix of menu items and workshops before the visitor types.
        matches = searchItems.filter(function (item) { return item.suggested; });
        searchStatus.textContent = 'Not sure what to search? Try these.';
      } else {
        // Every typed word must appear in the item's name, category, or keywords.
        var words = query.toLowerCase().split(/\s+/);
        matches = searchItems.filter(function (item) {
          var text = (item.name + ' ' + item.category + ' ' + item.keywords).toLowerCase();
          return words.every(function (word) { return text.includes(word); });
        });
        searchStatus.textContent = matches.length + (matches.length === 1 ? ' result' : ' results') + ' for "' + query + '".';
      }

      if (matches.length === 0) {
        searchStatus.textContent = 'No matches for "' + query + '". Try coffee, cake, pottery, art, or sewing.';
        return;
      }

      matches.forEach(function (item) {
        var row = document.createElement('li');
        var link = document.createElement('a');
        var name = document.createElement('strong');
        var category = document.createElement('span');
        link.href = item.url;
        name.textContent = item.name;
        category.textContent = item.category;
        link.appendChild(name);
        link.appendChild(category);
        row.appendChild(link);
        searchResults.appendChild(row);
      });
      searchResults.hidden = false;
    }

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showSearchResults();
    });
    searchInput.addEventListener('focus', showSearchResults);
    searchInput.addEventListener('click', showSearchResults);
    searchInput.addEventListener('input', showSearchResults);

    // Keep the dropdown open while using its links, and close it when leaving.
    function closeSearchOutside(e) {
      if (!searchArea.contains(e.target)) searchPanel.hidden = true;
    }
    document.addEventListener('click', closeSearchOutside);
    document.addEventListener('focusin', closeSearchOutside);
    searchArea.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        searchInput.focus();
        searchPanel.hidden = true;
      }
    });
  }

  // Mobile menu toggle
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    var links = document.querySelector('.nav-links');
    function closeMenu() {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 920) closeMenu();
    });
  }

  // FAQ accordion (used on faq.html)
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
    if (item.classList.contains('open')) {
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer mini signup form (present on every page)
  var footerForm = document.getElementById('signupForm');
  if (footerForm) {
    footerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('signupNote');
      if (note) note.textContent = "You're on the list — see you soon.";
      this.reset();
    });
  }

  // Full signup page form
  var pageForm = document.getElementById('signupPageForm');
  if (pageForm) {
    pageForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('signupPageNote');
      if (note) note.textContent = "You're on the list — see you soon.";
      this.reset();
    });
  }

});
