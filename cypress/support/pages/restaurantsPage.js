class RestaurantsPage {
  visit() {
    cy.visit('/apps/food');
    return this;
  }

  filterByCuisine(cuisine) {
    cy.getByTestId(`cuisine-${cuisine}`).click();
    return this;
  }

  open(restaurantId) {
    cy.getByTestId(`open-restaurant-${restaurantId}`).click();
    return this;
  }

  count() {
    return cy.getByTestId('restaurant-count');
  }

  cards() {
    return cy.getByTestId('restaurant-card');
  }

  names() {
    return cy.getByTestId('restaurant-name');
  }
}

module.exports = new RestaurantsPage();
