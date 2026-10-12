class MenuPage {
  visit(restaurantId) {
    cy.visit(`/apps/food/r/${restaurantId}`);
    return this;
  }

  title() {
    return cy.getByTestId('restaurant-title');
  }

  /** Adds a plain item to the cart; after the first one the Add button becomes a +/− stepper. */
  add(itemId, quantity = 1) {
    cy.getByTestId(`add-${itemId}`).click();
    for (let extra = 1; extra < quantity; extra++) this.increase(itemId);
    return this;
  }

  /**
   * Opens the customiser for an item and picks a size and toppings. The item's
   * Add button and its + stepper both open the customiser, so either is clicked.
   */
  addCustomised(itemId, { size, toppings = [] }) {
    cy.get(`[data-testid="add-${itemId}"], [data-testid="${itemId}-inc"]`).click();
    if (size) cy.getByTestId(`size-${size}`).click();
    toppings.forEach((topping) => cy.getByTestId(`topping-${topping}`).check());
    return this;
  }

  customTotal() {
    return cy.getByTestId('custom-total');
  }

  confirmCustomised() {
    cy.getByTestId('add-customized').click();
    return this;
  }

  increase(itemId) {
    cy.getByTestId(`${itemId}-inc`).click();
    return this;
  }

  quantity(itemId) {
    return cy.getByTestId(`${itemId}-qty`);
  }

  cartCount() {
    return cy.getByTestId('cart-count');
  }

  goToCheckout() {
    cy.getByTestId('view-cart').click();
    cy.location('pathname').should('eq', '/apps/food/checkout');
  }
}

module.exports = new MenuPage();
