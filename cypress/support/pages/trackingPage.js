class TrackingPage {
  confirmation() {
    return cy.getByTestId('order-placed');
  }

  orderId() {
    return cy.getByTestId('order-id');
  }

  /**
   * The order moves to the next stage by itself every few seconds. Passing a
   * timeout lets Cypress keep retrying until the text appears, with no fixed sleep.
   */
  status(timeout = 15_000) {
    return cy.getByTestId('order-status', { timeout });
  }

  rate(stars) {
    cy.getByTestId(`rate-${stars}`, { timeout: 15_000 }).click();
    return this;
  }
}

module.exports = new TrackingPage();
