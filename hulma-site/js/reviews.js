// Classroom demo: reviews stay in this browser, not in a shared database.
document.addEventListener('DOMContentLoaded', function () {
  var reviewForm = document.getElementById('reviewForm');
  if (!reviewForm) return;

  var nameInput = document.getElementById('reviewName');
  var ratingInput = document.getElementById('reviewRating');
  var messageInput = document.getElementById('reviewMessage');
  var reviewStatus = document.getElementById('reviewStatus');
  var reviewSummary = document.getElementById('reviewSummary');
  var reviewEmpty = document.getElementById('reviewEmpty');
  var reviewList = document.getElementById('reviewList');
  var storageKey = 'hulma-reviews-v1';
  var reviews = [];

  // Validate saved data too, so a damaged storage entry cannot break the page.
  function isValidReview(review) {
    return review && typeof review.name === 'string' && review.name.trim().length > 0 &&
      review.name.length <= 60 && Number.isInteger(review.rating) &&
      review.rating >= 1 && review.rating <= 5 && typeof review.message === 'string' &&
      review.message.trim().length >= 10 && review.message.length <= 1000 &&
      typeof review.date === 'string' && !isNaN(Date.parse(review.date));
  }

  function loadReviews() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(saved)) throw new Error('Invalid review list');
      reviews = saved.filter(isValidReview);
    } catch (error) {
      reviewStatus.textContent = 'Saved reviews could not be read in this browser. You can try saving a new review.';
    }
  }

  function displayReviews() {
    reviewList.textContent = '';
    reviewEmpty.hidden = reviews.length > 0;
    if (reviews.length === 0) {
      reviewSummary.textContent = 'No reviews saved in this browser yet.';
      return;
    }

    var total = 0;
    reviews.forEach(function (review, index) {
      total += review.rating;
      var card = document.createElement('article');
      card.className = 'review-card';
      var heading = document.createElement('h3');
      heading.textContent = review.name;
      var rating = document.createElement('p');
      rating.className = 'review-rating';
      rating.textContent = review.rating + ' / 5 stars';
      var date = document.createElement('time');
      date.dateTime = review.date;
      date.textContent = new Date(review.date).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      var message = document.createElement('p');
      message.className = 'review-message';
      message.textContent = review.message;
      var removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'review-remove';
      removeButton.textContent = 'Remove from this browser';
      removeButton.setAttribute('aria-label', 'Remove the review by ' + review.name + ' from this browser');
      removeButton.addEventListener('click', function () { removeReview(index); });
      card.appendChild(heading);
      card.appendChild(rating);
      card.appendChild(date);
      card.appendChild(message);
      card.appendChild(removeButton);
      reviewList.appendChild(card);
    });
    reviewSummary.textContent = reviews.length + (reviews.length === 1 ? ' review' : ' reviews') +
      ' saved here · Average: ' + (total / reviews.length).toFixed(1) + ' / 5';
  }

  function saveReviews(updatedReviews) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
      reviews = updatedReviews;
      displayReviews();
      return true;
    } catch (error) {
      reviewStatus.textContent = 'This change could not be saved. Browser storage may be unavailable or full. Your form has been kept so you can try again.';
      return false;
    }
  }

  function removeReview(index) {
    var remaining = reviews.filter(function (review, position) { return position !== index; });
    if (saveReviews(remaining)) {
      reviewStatus.textContent = 'Review removed from this browser.';
      nameInput.focus();
    }
  }

  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!reviewForm.reportValidity()) return;

    var review = {
      name: nameInput.value.trim(),
      rating: Number(ratingInput.value),
      message: messageInput.value.trim(),
      date: new Date().toISOString()
    };
    if (!isValidReview(review)) {
      reviewStatus.textContent = 'Enter your name, choose 1–5 stars, and write a review of 10–1,000 characters. Spaces alone do not count.';
      return;
    }

    // Newest reviews appear first. Text is displayed safely with textContent.
    if (saveReviews([review].concat(reviews))) {
      reviewForm.reset();
      reviewStatus.textContent = 'Thank you! Your review is saved in this browser only.';
    }
  });

  loadReviews();
  displayReviews();
});
