class CheckoutPage {
  visit() {
    cy.visit('/apps/food/checkout');
    return this;
  }

  applyPromo(code) {
    cy.getByTestId('promo-code').clear();
    cy.getByTestId('promo-code').type(code);
    cy.getByTestId('apply-promo').click();
    return this;
  }

  promoMessage() {
    return cy.getByTestId('promo-message');
  }

  tip(amount) {
    cy.getByTestId(`tip-${amount}`).click();
    return this;
  }

  deliverTo(address) {
    cy.getByTestId(`address-${address}`).click();
    return this;
  }

  phone(number) {
    cy.getByTestId('delivery-phone').type(number);
    return this;
  }

  payWith(method) {
    cy.getByTestId(`pay-${method}`).click();
    return this;
  }

  placeOrder() {
    cy.getByTestId('place-order').click();
    return this;
  }

  /** One line of the bill: items, discount, delivery, taxes, tip or total. */
  bill(line) {
    return cy.getByTestId(`bill-${line}`);
  }

  error(field) {
    return cy.getByTestId(`error-${field}`);
  }

  cartLines() {
    return cy.getByTestId('food-cart-line');
  }

  emptyCart() {
    return cy.getByTestId('empty-food-cart');
  }
}

module.exports = new CheckoutPage();
