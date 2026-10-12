const menuPage = require('./pages/menuPage');

/**
 * Shortcuts for getting the app into a known state. Tests that are not about
 * the menu use these so they stay short and say only what they are checking.
 */
function cartWith(restaurantId, itemId, quantity = 1) {
  menuPage.visit(restaurantId).add(itemId, quantity);
  menuPage.goToCheckout();
}

module.exports = { cartWith };
