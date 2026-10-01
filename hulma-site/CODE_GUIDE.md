# Explaining the HULMA website

HULMA uses HTML for content, CSS for appearance, and vanilla JavaScript for interactions. There are no frameworks or build steps. The Contact page also uses Leaflet, a small library for interactive maps. Open `index.html` to start at the welcome screen, or `home.html` for the homepage. Use a local HTTP server (for example, your editor's Live Server) and an internet connection when testing the map. Keep the same localhost address when testing saved reviews.

## Where to look

| File or folder | Purpose |
| --- | --- |
| `index.html` | Welcome screen. |
| `home.html` | Homepage, search field, and suggestion dropdown. |
| `about.html` | About, History, Mission, and Vision. |
| `contact.html` | Social links, email, daily business hours, and the map. |
| `reviews.html` | Browser-only review submission form and saved reviews. |
| Other `.html` pages | Menus, merchandise, workshops, and studio information. |
| `css/style.css` | Shared colors, fonts, layouts, hover effects, and responsive rules. |
| `js/main.js` | Search, mobile navigation, FAQ accordion, scroll effects, and signup feedback. |
| `js/contact.js` | Leaflet map API calls and loading/error feedback. |
| `js/reviews.js` | Review validation, localStorage, and DOM updates. |
| `images/` | Photos and SVG artwork used by the menu pages. |

## How an HTML page is organized

Most pages follow the same order, marked with comments:

1. `<head>` contains the page title, description, font links, and stylesheet link.
2. `<header>` and `<nav>` contain the logo and navigation links.
3. The breadcrumb shows the current page and links to its parent pages.
4. `<main>` contains the content unique to that page, divided into sections.
5. `<footer>` contains shared links, studio details, and the signup form.
6. `<script src="js/main.js">` loads the shared JavaScript.

`index.html` is shorter because it is a welcome screen. Its content sits inside `<main class="splash">`.

Indentation shows which elements are inside other elements. Comments explain sections but do not appear on the website.

## Classes and IDs

A **class** is a reusable name for styling. For example, `content-narrow` sets a maximum width in the CSS, and `workshop-layout` places the two class-detail panels beside each other. Several elements can share a class. These names replace repeated `style="..."` attributes.

An **ID** identifies one element on a page. JavaScript uses IDs such as `homeSearchInput` to find the search field and `homeSearchResults` to find its list. Keep these IDs when editing the markup.

The header and footer remain ordinary HTML in each page. To change a shared navigation link, update it on each page that contains it.

## How the search works

1. `searchItems` in `main.js` stores the 14 menu items and three workshops. Each entry has a name, category, keywords, and destination URL.
2. Entries marked `suggested: true` appear when the empty search field receives focus or is clicked.
3. As the visitor types, `showSearchResults()` trims the query, changes it to lowercase, and splits it into words.
4. `filter()` keeps entries where `every()` search word is found with `includes()` in the name, category, or keywords.
5. JavaScript creates a list of links with `createElement()`. It inserts words with `textContent`, so typed text is not treated as HTML.
6. No matches produce a helpful message. Clearing the field restores suggestions. Clicking outside, moving keyboard focus outside, or pressing Escape closes the dropdown.

Submitting with Enter or the search button runs the same search. `preventDefault()` stops the browser from reloading the page. Add or update entries in `searchItems` when the menu or workshops change.

## Other features you may be asked about

- **Mobile menu:** clicking the hamburger toggles the `is-open` CSS class and updates `aria-expanded`. Escape, an outside click, or resizing to desktop closes the menu.
- **FAQ:** clicking a question adds or removes the `open` class and changes the answer's height.
- **Scroll reveal:** `IntersectionObserver` detects when an element enters the visible area and adds the `in` class. CSS handles the fade and movement.
- **Hover effects:** CSS `:hover` rules change a link, button, or card when the pointer is over it.
- **Responsive styles:** CSS `@media` rules adjust selected layouts at smaller screen widths.
- **SVG icons:** `<circle>`, `<path>`, and other SVG tags draw the logos and icons. A path's `d` attribute stores its drawing coordinates. The existing artwork was retained.
- **Signup forms:** the browser checks the email field, then JavaScript shows confirmation text. Addresses are not currently saved or sent.

## Contact map

The map uses the [Leaflet JavaScript API](https://leafletjs.com/examples/quick-start/) and [OpenStreetMap tiles](https://operations.osmfoundation.org/policies/tiles/). Leaflet 1.9.4 is loaded only on `contact.html`; the rest of the site does not download it.

`initializeMap()` reads the latitude and longitude from the map element's `data-lat` and `data-lng` attributes. `L.map()` creates the interactive map, `L.tileLayer()` loads its map images, and `L.marker()` places the business pin. The pin uses the supplied coordinates, not a guessed address search.

Keep the visible OpenStreetMap attribution, use the normal browser cache, and serve the page over HTTP/HTTPS so the browser sends a website referrer. Map availability depends on the internet and external services. The directions and larger-map links remain usable if the embedded map cannot load. Directions open Google Maps through its [Maps URL format](https://developers.google.com/maps/documentation/urls/get-started); no Google API key is used.

## Browser-only reviews

This is a classroom demo, not a public review database. Reviews are saved under `hulma-reviews-v1` in `localStorage`, so they remain in the same browser and website address after a reload. Other visitors cannot see them, and clearing browser data removes them. Opening the pages with `file://` can make browser storage behavior inconsistent; a local HTTP server is recommended.

- `isValidReview()` checks the name, 1–5 rating, message length, and date.
- `loadReviews()` reads saved JSON and handles unavailable or damaged storage.
- `saveReviews()` writes the updated list before showing success.
- `displayReviews()` builds review cards with `createElement()`, `textContent`, and `appendChild()`, and calculates the average rating.
- `removeReview()` removes a selected entry from this browser only.

The form starts empty. It does not include invented reviews, send email, or publish submissions to a server. Online booking, a cart, and a real newsletter service remain separate future features.

## Old page links

`our-story.html` and `our-company.html` forward to the relevant About sections. `social-media.html`, `location-hours.html`, and `customer-service.html` forward to the relevant Contact sections. These small redirect pages keep older bookmarks working while the navigation uses the new structure.
