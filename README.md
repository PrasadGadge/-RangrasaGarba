# RANGRASA — The Garba Edit

A premium, responsive front-end mini-project celebrating Gujarati Garba, Bandhani textiles, festive chaniya choli styles, and kediyu-inspired menswear.

## Run it

1. Extract the project folder.
2. Open `index.html` in a modern browser.
3. For a more realistic local development workflow, run a simple static server from this folder, for example:
   - VS Code: install/use **Live Server** and choose **Open with Live Server**.
   - Python: `python -m http.server 5500`, then visit `http://localhost:5500`.

No framework, build step, API key, or package install is required.

## What is interactive

- Responsive desktop/mobile navigation
- Product cards rendered from a JavaScript data array
- Category filters, search, and price/name sorting
- Product quick-view modal
- Wishlist toggles and saved items
- Add-to-bag, quantity updates, remove-item controls, and subtotal
- Browser `localStorage` persistence for bag and wishlist
- Newsletter form confirmation (front-end demo only)
- Toast messages and Escape/backdrop close behavior
- Responsive layouts and reduced-motion support
- **Style finder quiz**: 3 questions, scored against the product data array, recommends one piece
- **Cart upgrades**: free-shipping progress bar (over ₹5,000) and coupon code `GARBA10` (10% off)
- **Scroll progress bar**, shrinking sticky header, staged hero entrance
- **Offline-safe images**: a broken remote image is replaced by a generated Bandhani-pattern SVG
- **Accessibility**: focus trap in both cart and quick-view, focus returns to the trigger on close

## Project structure

- `index.html` — semantic page structure
- `style.css` — design system, layout, responsive styles, animation
- `script.js` — product data and interaction logic

## Notes for submission

- Product names, prices, and catalogue entries are illustrative demo content.
- The checkout is intentionally not connected to a payment or inventory backend.
- Photography is loaded from remote image URLs, so an internet connection is needed for those images. Font loading also uses Google Fonts; system fallbacks are included.
- The HTML/CSS/JavaScript and layout are original project code. Product/festival imagery is served from external image URLs for this visual demo; check the original source terms and replace with licensed or self-created assets before public production use.

## Suggested viva/demo flow

1. Introduce the theme and the visual design system.
2. Show responsive navigation and the product filter/search.
3. Open a quick-view modal and add an item to the bag.
4. Update quantities, show the live subtotal, and refresh to demonstrate `localStorage` persistence.
5. Take the style finder quiz, add the result to the bag, apply `GARBA10`.
6. Save a product to the wishlist and test the newsletter confirmation.
