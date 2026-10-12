const restaurantsPage = require('../../support/pages/restaurantsPage');
const menuPage = require('../../support/pages/menuPage');

describe('FoodDash: finding a restaurant', () => {
  beforeEach(() => {
    cy.fixture('menu').as('menu');
    restaurantsPage.visit();
  });

  it('lists restaurants on the home page', { tags: '@smoke' }, () => {
    restaurantsPage.cards().should('have.length.greaterThan', 1);
  });

  it('filters the list by cuisine', function () {
    restaurantsPage.filterByCuisine(this.menu.pizzeria.cuisine);

    restaurantsPage.count().should('contain.text', '1 restaurant');
    restaurantsPage.names().should('have.length', 1).and('contain.text', this.menu.pizzeria.name);
  });

  it('opens a restaurant menu', function () {
    restaurantsPage.open(this.menu.pizzeria.id);

    cy.location('pathname').should('eq', `/apps/food/r/${this.menu.pizzeria.id}`);
    menuPage.title().should('contain.text', this.menu.pizzeria.name);
  });
});
